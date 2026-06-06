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
	"testing"
)

// iamFuzzSeedCorpus is the deterministic seed material for FuzzIAMPolicyUnmarshal.
// Each entry below is added with f.Add at fuzz-startup time so a) the fuzzer
// has a non-trivial starting population and b) `go test` (without -fuzz) runs
// the corpus as a normal table-driven regression suite. A mix of legitimate
// policies and known-malformed shapes makes sure both branches of the
// json.Unmarshal -> isValid pipeline get exercised on every CI run.
var iamFuzzSeedCorpus = []string{
	`{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":"s3:GetObject","Resource":"arn:aws:s3:::b/*"}]}`,
	`{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["s3:GetObject","s3:PutObject"],"Resource":["arn:aws:s3:::b/*"]}]}`,
	`{"Version":"2012-10-17","Statement":[{"Effect":"Deny","Action":"s3:*","Resource":"*"}]}`,
	`{"Version":"2012-10-17","Statement":[]}`,
	`{}`,
	`{"Version":"2012-10-17","Statement":[{"Effect":"Maybe","Action":"s3:*","Resource":"*"}]}`,
	`{"Version":"2099-13-37","Statement":[]}`,
	`{"Version":"2012-10-17","Statement":"oops"}`,
	`{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":[],"Resource":"*"}]}`,
	`{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":"s3:*","Resource":{}}]}`,
}

// FuzzIAMPolicyUnmarshal feeds arbitrary input bytes into json.Unmarshal of an
// iampolicy.Policy. The harness only asserts the absence of panics: any
// returned error is acceptable, but a runtime crash means we have a
// type-confusion or recursion bug worth fixing.
//
// Run a short smoke pass with:
//
//	go test -run=^$ -fuzz=FuzzIAMPolicyUnmarshal -fuzztime=10s ./pkg/iam/policy/...
//
// The seed corpus encoded by f.Add doubles as deterministic regression
// material for `go test` (no -fuzz flag) so this file does not introduce
// fuzz-only coverage.
func FuzzIAMPolicyUnmarshal(f *testing.F) {
	for _, seed := range iamFuzzSeedCorpus {
		f.Add([]byte(seed))
	}
	f.Fuzz(func(t *testing.T, data []byte) {
		// Cap the fuzzer-supplied input to a sensible upper bound. Without
		// this the engine eventually generates many-MB inputs and we end up
		// burning fuzz time on trivial allocator stress rather than on
		// surface-area exploration of the parser.
		if len(data) > 1<<16 {
			t.Skip()
		}
		defer func() {
			if r := recover(); r != nil {
				t.Fatalf("UnmarshalJSON panicked on %q: %v", data, r)
			}
		}()
		var p Policy
		_ = json.Unmarshal(data, &p)
	})
}
