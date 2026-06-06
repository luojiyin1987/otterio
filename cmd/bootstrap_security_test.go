/*
 * OtterIO Cloud Storage, (C) 2025-2026 soulteary, https://github.com/soulteary/otterio
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

package cmd

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
)

// These tests pin down the CVE-2023-28432 hardening of the bootstrap REST
// surface. Before the fix, VerifyHandler replied to any caller with the
// cluster topology (OtterioPlatform / OtterioRuntime / OtterioEndpoints).
// After the fix, VerifyHandler must require the same inter-node JWT that
// peer-rest / storage-rest / lock-rest already validate via
// storageServerRequestValidate, while HealthHandler must remain anonymous
// (it returns no body and is used as a liveness probe).
//
// The handlers are plain net/http handlers, so the tests drive them with
// httptest directly rather than spinning up the Fiber app: wrapInternalHandler
// is auth-irrelevant (it only adds tracing) and exercising the handler
// in isolation removes a class of false positives that come from middleware
// short-circuiting before the auth gate runs.

func newBootstrapTestRequest() *http.Request {
	// The production caller is bootstrapRESTClient.callWithContext, which
	// passes values=nil and produces an empty URL.RawQuery. The audience
	// inside the inter-node JWT must match RawQuery, so reproduce that
	// shape here.
	req := httptest.NewRequest(http.MethodPost, "/otterio/bootstrap/v1/verify", nil)
	req.URL.RawQuery = ""
	return req
}

func setBootstrapAuth(req *http.Request, token, requestTime string) {
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("X-Otterio-Time", requestTime)
}

// TestBootstrapVerifyRejectsAnonymous covers the headline CVE-2023-28432
// case: a caller with no Authorization header MUST be rejected with 403 and
// MUST NOT receive the cluster topology fields.
func TestBootstrapVerifyRejectsAnonymous(t *testing.T) {
	srv := &bootstrapRESTServer{}
	req := newBootstrapTestRequest()
	rec := httptest.NewRecorder()

	srv.VerifyHandler(rec, req)

	if rec.Code != http.StatusForbidden {
		t.Fatalf("expected 403 for anonymous bootstrap verify, got %d (body=%q)", rec.Code, rec.Body.String())
	}
	body := rec.Body.String()
	if strings.Contains(body, "OtterioPlatform") || strings.Contains(body, "OtterioEndpoints") || strings.Contains(body, "OtterioRuntime") {
		t.Fatalf("anonymous response leaked cluster topology fields: %q", body)
	}
	if !strings.Contains(body, errNoAuthToken.Error()) {
		t.Fatalf("expected body to contain %q, got %q", errNoAuthToken.Error(), body)
	}
}

// TestBootstrapVerifyRejectsForgedToken proves that signing the JWT with a
// secret that does not match globalActiveCred.SecretKey yields 403. This
// closes the obvious bypass attempt of "send any HS512 token".
func TestBootstrapVerifyRejectsForgedToken(t *testing.T) {
	srv := &bootstrapRESTServer{}

	forged, err := authenticateNode(globalActiveCred.AccessKey, "wrong-secret-key-not-the-active-one", "")
	if err != nil {
		t.Fatalf("authenticateNode failed: %v", err)
	}
	req := newBootstrapTestRequest()
	setBootstrapAuth(req, forged, UTCNow().Format(time.RFC3339))
	rec := httptest.NewRecorder()

	srv.VerifyHandler(rec, req)

	if rec.Code != http.StatusForbidden {
		t.Fatalf("expected 403 for forged-token bootstrap verify, got %d (body=%q)", rec.Code, rec.Body.String())
	}
	body := rec.Body.String()
	if strings.Contains(body, "OtterioPlatform") || strings.Contains(body, "OtterioEndpoints") || strings.Contains(body, "OtterioRuntime") {
		t.Fatalf("forged-token response leaked cluster topology fields: %q", body)
	}
}

// TestBootstrapVerifyRejectsTimeSkew covers the 15-minute skew window
// enforced by storageServerRequestValidate. A token signed correctly but
// presented with X-Otterio-Time 30 minutes in the past must still be
// rejected, so a leaked token cannot be replayed indefinitely.
func TestBootstrapVerifyRejectsTimeSkew(t *testing.T) {
	srv := &bootstrapRESTServer{}

	token := newAuthToken("")
	skewed := UTCNow().Add(-30 * time.Minute).Format(time.RFC3339)

	req := newBootstrapTestRequest()
	setBootstrapAuth(req, token, skewed)
	rec := httptest.NewRecorder()

	srv.VerifyHandler(rec, req)

	if rec.Code != http.StatusForbidden {
		t.Fatalf("expected 403 for skewed bootstrap verify, got %d (body=%q)", rec.Code, rec.Body.String())
	}
	body := rec.Body.String()
	if strings.Contains(body, "OtterioPlatform") || strings.Contains(body, "OtterioEndpoints") || strings.Contains(body, "OtterioRuntime") {
		t.Fatalf("skewed response leaked cluster topology fields: %q", body)
	}
}

// TestBootstrapVerifyAcceptsValidNodeToken pins the success-path invariant.
// A token from newAuthToken("") (the exact form bootstrapRESTClient sends)
// plus a fresh X-Otterio-Time MUST yield 200 and a decodable
// ServerSystemConfig. If this test ever fails after the harden, legitimate
// inter-node verifyServerSystemConfig will start failing in production.
func TestBootstrapVerifyAcceptsValidNodeToken(t *testing.T) {
	srv := &bootstrapRESTServer{}

	token := newAuthToken("")
	req := newBootstrapTestRequest()
	setBootstrapAuth(req, token, UTCNow().Format(time.RFC3339))
	rec := httptest.NewRecorder()

	srv.VerifyHandler(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 for valid node-token bootstrap verify, got %d (body=%q, errHdr=%q)", rec.Code, rec.Body.String(), rec.Header().Get("X-Otterio-Bootstrap-Error"))
	}
	var got ServerSystemConfig
	if err := json.NewDecoder(rec.Body).Decode(&got); err != nil {
		t.Fatalf("response body is not a valid ServerSystemConfig JSON: %v (body=%q)", err, rec.Body.String())
	}
	if got.OtterioPlatform == "" {
		t.Fatalf("decoded ServerSystemConfig has empty OtterioPlatform; the success-path response shape changed: %+v", got)
	}
}

// TestBootstrapHealthRemainsAnonymous locks down the deliberate decision
// that HealthHandler stays anonymous after the CVE-2023-28432 fix. It is a
// no-body endpoint used by external liveness probes and load balancers, and
// is not part of the disclosure surface. If somebody later wraps it in
// storageServerRequestValidate, this test will fire and force a conscious
// decision.
func TestBootstrapHealthRemainsAnonymous(t *testing.T) {
	srv := &bootstrapRESTServer{}
	req := httptest.NewRequest(http.MethodPost, "/otterio/bootstrap/v1/health", nil)
	rec := httptest.NewRecorder()

	srv.HealthHandler(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 for anonymous bootstrap health, got %d (body=%q)", rec.Code, rec.Body.String())
	}
	if rec.Body.Len() != 0 {
		t.Fatalf("HealthHandler must remain a no-body endpoint, got %q", rec.Body.String())
	}
}
