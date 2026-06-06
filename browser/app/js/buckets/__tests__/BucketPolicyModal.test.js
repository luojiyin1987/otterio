/*
 * MinIO Cloud Storage (C) 2018 MinIO, Inc.
 * Modifications and additions (C) 2025-2026 soulteary, https://github.com/soulteary/otterio
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import React from "react"
import userEvent from "@testing-library/user-event"
import { renderWithStore, defaultState } from "../../jest/test-utils"
import BucketPolicyModal from "../BucketPolicyModal"
import { READ_ONLY } from "../../constants"
import * as bucketActions from "../actions"

const openState = (extra = {}) => ({
  ...defaultState,
  buckets: {
    ...defaultState.buckets,
    showBucketPolicy: true,
    currentBucket: "bk",
    policies: [],
    ...extra,
  },
})

beforeEach(() => {
  jest
    .spyOn(bucketActions, "hideBucketPolicy")
    .mockReturnValue({ type: "TEST_HIDE_BUCKET_POLICY" })
  jest
    .spyOn(bucketActions, "fetchPolicies")
    .mockReturnValue({ type: "TEST_FETCH_POLICIES" })
  jest
    .spyOn(bucketActions, "setPolicies")
    .mockImplementation(p => ({ type: "TEST_SET_POLICIES", p }))
})

afterEach(() => jest.restoreAllMocks())

describe("BucketPolicyModal", () => {
  it("renders without crashing", () => {
    renderWithStore(<BucketPolicyModal />, openState())
  })

  it("dispatches hideBucketPolicy when close is clicked", async () => {
    const user = userEvent.setup()
    renderWithStore(<BucketPolicyModal />, openState())
    await user.click(document.querySelector(".close"))
    expect(bucketActions.hideBucketPolicy).toHaveBeenCalled()
  })

  it("renders each policy row in addition to the input header", () => {
    renderWithStore(
      <BucketPolicyModal />,
      openState({ policies: [{ prefix: "test", policy: READ_ONLY }] })
    )
    expect(document.querySelectorAll(".pmb-list").length).toBeGreaterThanOrEqual(2)
  })
})
