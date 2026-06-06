/*
 * OtterIO Cloud Storage, (C) 2025-2026 soulteary, https://github.com/soulteary/otterio
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

package policy

import (
	"encoding/json"
	"testing"
)

// bucketFuzzSeedCorpus parallels the IAM-side corpus. The shapes here exercise
// the bucket-policy specific Principal field (string-vs-object) plus the
// Resource / Action / Effect parsers shared with the IAM side. We keep both
// known-good and known-malformed seeds in the same slice so `go test` runs
// them as deterministic regressions and the fuzzer starts from a meaningfully
// diverse population on each run.
var bucketFuzzSeedCorpus = []string{
	`{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":"*","Action":"s3:GetObject","Resource":"arn:aws:s3:::b/*"}]}`,
	`{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"AWS":["*"]},"Action":["s3:GetObject"],"Resource":["arn:aws:s3:::b/*"]}]}`,
	`{"Version":"2012-10-17","Statement":[{"Effect":"Deny","Principal":"*","Action":"s3:*","Resource":"arn:aws:s3:::b/*"}]}`,
	`{}`,
	`{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":1,"Action":"s3:GetObject","Resource":"arn:aws:s3:::b/*"}]}`,
	`{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":"alice","Action":"s3:GetObject","Resource":"arn:aws:s3:::b/*"}]}`,
	`{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":"*","Action":[],"Resource":"arn:aws:s3:::b/*"}]}`,
	`{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":"*","Action":"s3:GetObject","Resource":[null]}]}`,
	`{"Version":"2012-10-17","Statement":[{"Effect":"ALLOW","Principal":"*","Action":"s3:GetObject","Resource":"arn:aws:s3:::b/*"}]}`,
	`{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":"*","Action":"s3:GetObject","Resource":"arn:aws:s3:::b/*","Condition":"yes"}]}`,
}

// FuzzBucketPolicyUnmarshal feeds arbitrary input bytes into the bucket-policy
// json.Unmarshal pipeline. Identical contract to FuzzIAMPolicyUnmarshal: any
// error is fine, panics fail the test. Run a smoke pass with:
//
//	go test -run=^$ -fuzz=FuzzBucketPolicyUnmarshal -fuzztime=10s ./pkg/bucket/policy/...
func FuzzBucketPolicyUnmarshal(f *testing.F) {
	for _, seed := range bucketFuzzSeedCorpus {
		f.Add([]byte(seed))
	}
	f.Fuzz(func(t *testing.T, data []byte) {
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
