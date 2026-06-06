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
import BucketContainer from "../BucketContainer"
import userEvent from "@testing-library/user-event"
import * as bucketActions from "../actions"

describe("BucketContainer", () => {
  it("renders the bucket name", () => {
    const { container } = renderWithStore(
      <BucketContainer bucket="Test" />,
      defaultState
    )
    expect(container.textContent).toContain("Test")
  })

  it("highlights the bucket when it is the current one", () => {
    const state = {
      ...defaultState,
      buckets: { ...defaultState.buckets, currentBucket: "Test" },
    }
    const { container } = renderWithStore(<BucketContainer bucket="Test" />, state)
    expect(container.querySelector("li").classList.contains("active")).toBe(true)
  })

  it("dispatches selectBucket on click", async () => {
    const user = userEvent.setup()
    // Replace the thunk with a no-op so we don't pull in history side effects.
    const spy = jest
      .spyOn(bucketActions, "selectBucket")
      .mockReturnValue({ type: "TEST_SELECT_BUCKET" })
    const { container } = renderWithStore(
      <BucketContainer bucket="Test" />,
      defaultState
    )
    await user.click(container.querySelector("li"))
    expect(spy).toHaveBeenCalledWith("Test")
    spy.mockRestore()
  })
})
