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
import { fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithStore, defaultState } from "../../jest/test-utils"
import { PolicyInput } from "../PolicyInput"
import { READ_ONLY } from "../../constants"
import web from "../../web"
import * as bucketActions from "../actions"

jest.mock("../../web", () => ({
  SetBucketPolicy: jest.fn(() => Promise.resolve()),
}))

const stateWithBucket = {
  ...defaultState,
  buckets: { ...defaultState.buckets, currentBucket: "bucket", policies: [] },
}

beforeEach(() => {
  jest.clearAllMocks()
  jest
    .spyOn(bucketActions, "fetchPolicies")
    .mockReturnValue({ type: "TEST_FETCH_POLICIES" })
  jest
    .spyOn(bucketActions, "setPolicies")
    .mockImplementation(p => ({ type: "TEST_SET_POLICIES", p }))
})

afterEach(() => jest.restoreAllMocks())

describe("PolicyInput", () => {
  it("renders without crashing", () => {
    renderWithStore(<PolicyInput />, stateWithBucket)
  })

  it("dispatches fetchPolicies on mount", () => {
    renderWithStore(<PolicyInput />, stateWithBucket)
    expect(bucketActions.fetchPolicies).toHaveBeenCalledWith("bucket")
  })

  it("calls web.SetBucketPolicy on Add click", async () => {
    const user = userEvent.setup()
    const { container } = renderWithStore(<PolicyInput />, stateWithBucket)
    fireEvent.change(container.querySelector('input[type="text"]'), {
      target: { value: "baz" },
    })
    fireEvent.change(container.querySelector("select"), {
      target: { value: READ_ONLY },
    })
    await user.click(container.querySelector("button"))
    expect(web.SetBucketPolicy).toHaveBeenCalledWith({
      bucketName: "bucket",
      prefix: "baz",
      policy: READ_ONLY,
    })
  })

  it("rewrites a '*' prefix to empty string", async () => {
    const user = userEvent.setup()
    const { container } = renderWithStore(<PolicyInput />, stateWithBucket)
    fireEvent.change(container.querySelector('input[type="text"]'), {
      target: { value: "*" },
    })
    await user.click(container.querySelector("button"))
    expect(web.SetBucketPolicy).toHaveBeenCalledWith({
      bucketName: "bucket",
      prefix: "",
      policy: READ_ONLY,
    })
  })
})
