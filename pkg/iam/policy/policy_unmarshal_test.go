/*
 * OtterIO Cloud Storage, (C) 2025-2026 soulteary, https://github.com/soulteary/otterio
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

package iampolicy

import (
	"encoding/json"
	"strings"
	"testing"
)

// TestIAMPolicyUnmarshalDoesNotPanic feeds a curated set of malformed JSON
// blobs straight into json.Unmarshal of an iampolicy.Policy and asserts that
// every input either round-trips or is rejected with an error. Panics, OOMs,
// and timeouts are caught by the test runner; a recover() guard turns any
// panic into a failed test instead of an aborted run.
//
// The list intentionally exercises classes of attacker input that have
// historically caused upstream advisories: type confusion (string vs array,
// number vs object), recursion-bombs, control-character injection, missing
// required fields, very large fields, NUL bytes, deeply nested objects, and
// truncated JSON.
func TestIAMPolicyUnmarshalDoesNotPanic(t *testing.T) {
	t.Parallel()

	cases := []struct {
		name string
		data string
	}{
		{"empty", ``},
		{"emptyObject", `{}`},
		{"emptyArray", `[]`},
		{"versionAsArray", `{"Version": ["2012-10-17"], "Statement": []}`},
		{"versionAsObject", `{"Version": {}, "Statement": []}`},
		{"statementAsString", `{"Version": "2012-10-17", "Statement": "deny everything"}`},
		{"statementAsNumber", `{"Version": "2012-10-17", "Statement": 42}`},
		{"statementMissing", `{"Version": "2012-10-17"}`},
		{"effectInvalid", `{"Version": "2012-10-17", "Statement": [{"Effect": "Maybe", "Action": "s3:*", "Resource": "*"}]}`},
		{"effectAsArray", `{"Version": "2012-10-17", "Statement": [{"Effect": ["Allow"], "Action": "s3:*", "Resource": "*"}]}`},
		{"actionAsObject", `{"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Action": {}, "Resource": "*"}]}`},
		{"actionEmptyArray", `{"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Action": [], "Resource": "*"}]}`},
		{"resourceAsObject", `{"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Action": "s3:*", "Resource": {}}]}`},
		{"resourceMissing", `{"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Action": "s3:*"}]}`},
		{"conditionAsArray", `{"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Action": "s3:*", "Resource": "*", "Condition": []}]}`},
		{"controlChars", "{\"Version\": \"2012-10-17\", \"Statement\": [{\"Effect\": \"\u0000\", \"Action\": \"s3:*\", \"Resource\": \"*\"}]}"},
		{"truncated", `{"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Action": "s3:*"`},
		{"deepNesting", `{"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Action": "s3:*", "Resource": "*", "Condition": {"StringEquals": {"k": ` + strings.Repeat(`["`, 200) + `"v"` + strings.Repeat(`"]`, 200) + `}}}]}`},
		{"largeAction", `{"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Action": "` + strings.Repeat("s", 100000) + `", "Resource": "*"}]}`},
		{"nulInString", "{\"Version\": \"2012-10-17\", \"Statement\": [{\"Effect\": \"Allow\", \"Action\": \"s3:Get\u0000Object\", \"Resource\": \"*\"}]}"},
		{"nullStatement", `{"Version": "2012-10-17", "Statement": null}`},
		{"unknownTopField", `{"Version": "2012-10-17", "Statement": [], "Banana": true}`},
		{"versionTypo", `{"Version": "2099-13-37", "Statement": []}`},
		{"resourceArrayMixed", `{"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Action": "s3:*", "Resource": ["arn:aws:s3:::a", 5]}]}`},
		{"actionInvalidPattern", `{"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Action": "*::*", "Resource": "*"}]}`},
		{"effectMixedCase", `{"Version": "2012-10-17", "Statement": [{"Effect": "ALLOW", "Action": "s3:*", "Resource": "*"}]}`},
		{"actionWildcardOnly", `{"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Action": "*", "Resource": "*"}]}`},
		{"resourceTrailingComma", `{"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Action": "s3:*", "Resource": "*",}]}`},
		{"unicodeNoncharacter", "{\"Version\": \"2012-10-17\", \"Statement\": [{\"Effect\": \"Allow\", \"Action\": \"s3:Get\uFFFFObject\", \"Resource\": \"*\"}]}"},
	}

	for _, tc := range cases {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()
			defer func() {
				if r := recover(); r != nil {
					t.Fatalf("UnmarshalJSON panicked on %q: %v", tc.name, r)
				}
			}()
			var p Policy
			_ = json.Unmarshal([]byte(tc.data), &p)
		})
	}
}

// TestIAMPolicyUnmarshalRejectsInvalid pins the new isValid() gate added to
// (*Policy).UnmarshalJSON. Direct json.Unmarshal calls (which are present in
// cmd/iam-object-store.go and cmd/iam-etcd-store.go) used to silently accept a
// Policy whose Statements contained an invalid Effect. After the gate they
// return an error before the malformed Policy is handed to callers.
func TestIAMPolicyUnmarshalRejectsInvalid(t *testing.T) {
	t.Parallel()

	cases := []struct {
		name      string
		data      string
		shouldErr bool
	}{
		{
			name:      "bogusEffect",
			data:      `{"Version": "2012-10-17", "Statement": [{"Effect": "Maybe", "Action": "s3:GetObject", "Resource": "arn:aws:s3:::b/*"}]}`,
			shouldErr: true,
		},
		{
			name:      "emptyAction",
			data:      `{"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Action": [], "Resource": "arn:aws:s3:::b/*"}]}`,
			shouldErr: true,
		},
		{
			name:      "wrongVersion",
			data:      `{"Version": "1999-01-01", "Statement": []}`,
			shouldErr: true,
		},
		{
			name: "validMinimal",
			data: `{"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Action": "s3:GetObject", "Resource": "arn:aws:s3:::b/*"}]}`,
		},
		{
			name: "emptyStatementsValid",
			// isValid permits empty Statements (the IsEmpty path); only
			// invalid version/statements are rejected at unmarshal time.
			data: `{"Version": "2012-10-17", "Statement": []}`,
		},
	}

	for _, tc := range cases {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()
			var p Policy
			err := json.Unmarshal([]byte(tc.data), &p)
			if tc.shouldErr {
				if err == nil {
					t.Fatalf("expected UnmarshalJSON to reject %q but it succeeded", tc.data)
				}
			} else if err != nil {
				t.Fatalf("expected UnmarshalJSON to accept %q but it returned %v", tc.data, err)
			}
		})
	}
}
