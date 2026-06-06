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
import SideBar from "../SideBar"
import * as bucketActions from "../../buckets/actions"

jest.mock("../../web", () => ({
  LoggedIn: jest.fn(() => false),
  ListBuckets: jest.fn(() => Promise.resolve({ buckets: [] })),
}))

const web = require("../../web")

describe("SideBar", () => {
  beforeEach(() => {
    web.LoggedIn.mockReturnValue(false)
    // BucketList dispatches fetchBuckets/selectBucket on mount; stub them so
    // tests stay focused on the SideBar layout without hitting history APIs.
    jest
      .spyOn(bucketActions, "fetchBuckets")
      .mockReturnValue({ type: "TEST_FETCH_BUCKETS" })
    jest
      .spyOn(bucketActions, "selectBucket")
      .mockImplementation((b, p) => ({ type: "TEST_SELECT_BUCKET", b, p }))
    jest
      .spyOn(bucketActions, "setList")
      .mockImplementation(b => ({ type: "TEST_SET_LIST", b }))
  })

  afterEach(() => jest.restoreAllMocks())

  it("renders without crashing", () => {
    const { container } = renderWithStore(<SideBar />, defaultState)
    expect(container.querySelector(".fe-sidebar")).not.toBeNull()
  })

  it("does not render BucketSearch for non-logged-in users", () => {
    web.LoggedIn.mockReturnValue(false)
    const { container } = renderWithStore(<SideBar />, defaultState)
    expect(container.querySelector(".ig-search")).toBeNull()
  })

  it("renders BucketSearch when the user is logged in", () => {
    web.LoggedIn.mockReturnValue(true)
    const { container } = renderWithStore(<SideBar />, defaultState)
    expect(container.querySelector(".ig-search")).not.toBeNull()
  })
})
