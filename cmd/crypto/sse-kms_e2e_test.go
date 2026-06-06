// Copyright (c) 2025 OtterIO contributors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package crypto

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"reflect"
	"testing"

	"github.com/soulteary/otterio/pkg/kms"
)

// L2 end-to-end pinning tests for backlog row 32 (SSE-KMS context
// binding). These tests drive the full Seal -> CreateMetadata ->
// ParseMetadata -> UnsealObjectKey loop against a real single-key
// KMS (pkg/kms.New) so that the AAD bytes flow through real AEAD
// (AES-256-GCM or ChaCha20Poly1305) inside pkg/kms/single-key.go.
//
// They complement the L1 mock-KMS tests by guarding against a class
// of regressions where the boundCtx looks right to a static analyzer
// but the actual byte-level AAD differs between Seal- and Unseal
// time (e.g. a sort-order bug, a stray trailing space, a JSON
// double-encoding, ...).

const e2eMasterKeyID = "ssekms-e2e"

// realKMS spins up a fresh single-key KMS with a random 32-byte
// master key. Each test gets its own KMS so the keys never escape
// the test scope.
func realKMS(t *testing.T) kms.KMS {
	t.Helper()
	mk := make([]byte, 32)
	if _, err := rand.Read(mk); err != nil {
		t.Fatalf("rand: %v", err)
	}
	k, err := kms.New(e2eMasterKeyID, mk)
	if err != nil {
		t.Fatalf("kms.New: %v", err)
	}
	return k
}

// sealE2E runs the production seal sequence end-to-end and returns
// the persisted metadata + the plaintext object key. It mirrors what
// a future SSE-KMS PUT path would do, modulo wiring.
func sealE2E(t *testing.T, k kms.KMS, bucket, object string, clientCtx Context) (map[string]string, ObjectKey) {
	t.Helper()

	bound, err := mergeBindingContext(bucket, object, clientCtx)
	if err != nil {
		t.Fatalf("mergeBindingContext: %v", err)
	}

	dek, err := k.GenerateKey(e2eMasterKeyID, bound)
	if err != nil {
		t.Fatalf("GenerateKey: %v", err)
	}
	if len(dek.Plaintext) != 32 {
		t.Fatalf("DEK plaintext len = %d, want 32", len(dek.Plaintext))
	}

	objKey := GenerateKey(dek.Plaintext, rand.Reader)
	iv := GenerateIV(rand.Reader)
	sealed := objKey.Seal(dek.Plaintext, iv, S3KMS.String(), bucket, object)

	md := S3KMS.CreateMetadata(nil, dek.KeyID, dek.Ciphertext, sealed, clientCtx)
	return md, objKey
}

// TestSSEKMSEndToEndSameObjectUnsealOK is the happy-path round-trip:
// seal at (bucket, object), unseal at the same (bucket, object), the
// recovered key must equal the original.
func TestSSEKMSEndToEndSameObjectUnsealOK(t *testing.T) {
	k := realKMS(t)
	const bucket, object = "alpha", "x/y/z"

	md, want := sealE2E(t, k, bucket, object, nil)

	got, err := S3KMS.UnsealObjectKey(k, md, bucket, object)
	if err != nil {
		t.Fatalf("UnsealObjectKey: %v", err)
	}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("recovered ObjectKey != original")
	}
}

// TestSSEKMSEndToEndCrossObjectUnsealFails is the headline regression
// test for Bug A: ciphertext sealed under (bucketA, objectX) MUST NOT
// decrypt when replayed under (bucketB, objectY), because the AEAD
// AAD differs. Before the fix, UnsealObjectKey would happily reuse
// whatever bucket key the persisted MetaContext carried, so a metadata
// transplant attack succeeded. After the fix, the bound ctx is always
// reconstructed from the runtime (bucket, object), so the KMS rejects
// the DEK as inauthentic.
func TestSSEKMSEndToEndCrossObjectUnsealFails(t *testing.T) {
	k := realKMS(t)
	const bucketA, objectX = "alpha", "x"
	const bucketB, objectY = "beta", "y"

	md, _ := sealE2E(t, k, bucketA, objectX, nil)

	_, err := S3KMS.UnsealObjectKey(k, md, bucketB, objectY)
	if err == nil {
		t.Fatalf("UnsealObjectKey accepted a cross-object metadata transplant; want auth failure")
	}
	// The exact error string belongs to pkg/kms/single-key.go ("encrypted
	// key is not authentic"). We only assert that the error is non-nil
	// and that the failure is not pre-empted by an earlier ctx-shape
	// check pretending to be an authenticity failure.
	if errors.Is(err, errKMSContextBindingConflict) {
		t.Fatalf("got errKMSContextBindingConflict, expected an AEAD authenticity failure from the KMS layer")
	}
}

// TestSSEKMSEndToEndDifferentObjectSameBucketUnsealFails covers the
// other axis: same bucket, different object key. The bound ctx value
// is path.Join(bucket, object), so a same-bucket replay must also
// fail.
func TestSSEKMSEndToEndDifferentObjectSameBucketUnsealFails(t *testing.T) {
	k := realKMS(t)
	const bucket = "alpha"

	md, _ := sealE2E(t, k, bucket, "obj-1", nil)

	_, err := S3KMS.UnsealObjectKey(k, md, bucket, "obj-2")
	if err == nil {
		t.Fatalf("UnsealObjectKey accepted a same-bucket / different-object replay; want auth failure")
	}
}

// TestSSEKMSEndToEndClientCtxRoundTrip covers Bug B's surface area:
// when CreateMetadata is given a non-empty clientCtx, the persisted
// MetaContext must round-trip through ParseMetadata + UnsealObjectKey
// against a real KMS. Equivalently: the AEAD AAD computed at seal
// time must equal the one rebuilt at unseal time, including the
// client keys.
func TestSSEKMSEndToEndClientCtxRoundTrip(t *testing.T) {
	k := realKMS(t)
	const bucket, object = "alpha", "x"
	clientCtx := Context{"app": "billing", "tenant": "acme"}

	md, want := sealE2E(t, k, bucket, object, clientCtx)

	got, err := S3KMS.UnsealObjectKey(k, md, bucket, object)
	if err != nil {
		t.Fatalf("UnsealObjectKey: %v", err)
	}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("recovered ObjectKey != original")
	}

	// And ParseMetadata must hand back the original client ctx.
	_, _, _, parsedCtx, err := S3KMS.ParseMetadata(md)
	if err != nil {
		t.Fatalf("ParseMetadata: %v", err)
	}
	if !reflect.DeepEqual(parsedCtx, clientCtx) {
		t.Fatalf("ParseMetadata ctx = %v, want %v", parsedCtx, clientCtx)
	}
}

// TestSSEKMSEndToEndTamperedClientCtxFails simulates an attacker who
// edits the persisted MetaContext to drop or change a client-supplied
// key after the object has been written. Because the KMS bound the
// DEK to the original AAD, tampering must cause Unseal to fail.
func TestSSEKMSEndToEndTamperedClientCtxFails(t *testing.T) {
	k := realKMS(t)
	const bucket, object = "alpha", "x"
	clientCtx := Context{"app": "billing", "tenant": "acme"}

	md, _ := sealE2E(t, k, bucket, object, clientCtx)

	// Re-encode a tampered client ctx into MetaContext.
	tampered := Context{"app": "billing", "tenant": "evil-tenant"}
	tamperedRaw, err := tampered.MarshalText()
	if err != nil {
		t.Fatalf("tampered MarshalText: %v", err)
	}
	md[MetaContext] = base64.StdEncoding.EncodeToString(tamperedRaw)

	if _, err := S3KMS.UnsealObjectKey(k, md, bucket, object); err == nil {
		t.Fatalf("UnsealObjectKey accepted tampered client ctx; want auth failure")
	}
}
