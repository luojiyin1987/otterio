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
import MakeBucketModal from "../MakeBucketModal"
import * as bucketActions from "../actions"

const openState = {
  ...defaultState,
  buckets: { ...defaultState.buckets, showMakeBucketModal: true },
}

beforeEach(() => {
  jest
    .spyOn(bucketActions, "hideMakeBucketModal")
    .mockReturnValue({ type: "TEST_HIDE_MAKE_BUCKET" })
  jest
    .spyOn(bucketActions, "makeBucket")
    .mockImplementation(name => ({ type: "TEST_MAKE_BUCKET", name }))
})

afterEach(() => jest.restoreAllMocks())

describe("MakeBucketModal", () => {
  it("renders without crashing", () => {
    renderWithStore(<MakeBucketModal />, openState)
  })

  it("dispatches hideMakeBucketModal when close is clicked", async () => {
    const user = userEvent.setup()
    renderWithStore(<MakeBucketModal />, openState)
    await user.click(document.querySelector(".close"))
    expect(bucketActions.hideMakeBucketModal).toHaveBeenCalled()
  })

  it("dispatches makeBucket on form submit", () => {
    renderWithStore(<MakeBucketModal />, openState)
    const input = document.querySelector(".ig-text")
    fireEvent.change(input, { target: { value: "test" } })
    fireEvent.submit(document.querySelector("form"))
    expect(bucketActions.makeBucket).toHaveBeenCalledWith("test")
  })
})
