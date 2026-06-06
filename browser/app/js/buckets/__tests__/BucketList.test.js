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
import { renderWithStore, defaultState } from "../../jest/test-utils"
import BucketList from "../BucketList"
import * as bucketActions from "../actions"
import history from "../../history"

jest.mock("../../web", () => ({
  LoggedIn: jest.fn(() => true),
}))

const web = require("../../web")

beforeEach(() => {
  jest
    .spyOn(bucketActions, "fetchBuckets")
    .mockReturnValue({ type: "TEST_FETCH_BUCKETS" })
  jest
    .spyOn(bucketActions, "setList")
    .mockImplementation(list => ({ type: "TEST_SET_LIST", list }))
  jest
    .spyOn(bucketActions, "selectBucket")
    .mockImplementation((bucket, prefix) => ({
      type: "TEST_SELECT_BUCKET",
      bucket,
      prefix,
    }))
})

afterEach(() => jest.restoreAllMocks())

describe("BucketList", () => {
  it("renders without crashing", () => {
    renderWithStore(<BucketList />, defaultState)
  })

  it("dispatches fetchBuckets on mount when logged in", () => {
    web.LoggedIn.mockReturnValue(true)
    renderWithStore(<BucketList />, defaultState)
    expect(bucketActions.fetchBuckets).toHaveBeenCalled()
  })

  it("seeds the bucket list from the URL when not logged in", () => {
    web.LoggedIn.mockReturnValue(false)
    history.push("/bk1/pre1")
    renderWithStore(<BucketList />, defaultState)
    expect(bucketActions.setList).toHaveBeenCalledWith(["bk1"])
    expect(bucketActions.selectBucket).toHaveBeenCalledWith("bk1", "pre1")
  })
})
