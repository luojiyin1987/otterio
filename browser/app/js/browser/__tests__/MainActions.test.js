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
import MainActions from "../MainActions"
import * as bucketActions from "../../buckets/actions"
import * as uploadActions from "../../uploads/actions"

jest.mock("../../web", () => ({
  LoggedIn: jest.fn(() => true),
}))

const web = require("../../web")

beforeEach(() => {
  jest
    .spyOn(bucketActions, "showMakeBucketModal")
    .mockReturnValue({ type: "TEST_SHOW_MAKE_BUCKET_MODAL" })
  jest
    .spyOn(uploadActions, "uploadFile")
    .mockImplementation(file => ({ type: "TEST_UPLOAD_FILE", file }))
})

afterEach(() => jest.restoreAllMocks())

const buildState = (overrides = {}) => ({
  ...defaultState,
  objects: { ...defaultState.objects, prefixWritable: false, ...overrides },
})

const openMenu = async user => {
  await user.click(document.querySelector(".feba-toggle"))
}

describe("MainActions", () => {
  it("renders nothing when user is not logged in and prefix is not writable", () => {
    web.LoggedIn.mockReturnValue(false)
    const { container } = renderWithStore(<MainActions />, buildState())
    expect(container.querySelector(".feba-toggle")).toBeNull()
  })

  it("shows actions when user is logged in", () => {
    web.LoggedIn.mockReturnValue(true)
    const { container } = renderWithStore(<MainActions />, buildState())
    expect(container.querySelector(".feba-toggle")).not.toBeNull()
  })

  it("dispatches showMakeBucketModal when create bucket is clicked", async () => {
    const user = userEvent.setup()
    web.LoggedIn.mockReturnValue(true)
    renderWithStore(<MainActions />, buildState())
    await openMenu(user)
    await user.click(document.querySelector("#show-make-bucket"))
    expect(bucketActions.showMakeBucketModal).toHaveBeenCalled()
  })
})
