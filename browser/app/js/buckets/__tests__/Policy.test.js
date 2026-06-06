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
import { Policy } from "../Policy"
import { READ_ONLY, NONE } from "../../constants"
import web from "../../web"

jest.mock("../../web", () => ({
  SetBucketPolicy: jest.fn(() => Promise.resolve()),
}))

const stateWithBucket = {
  ...defaultState,
  buckets: { ...defaultState.buckets, currentBucket: "bucket" },
}

describe("Policy", () => {
  beforeEach(() => jest.clearAllMocks())

  it("renders without crashing", () => {
    renderWithStore(<Policy prefix="foo" policy={READ_ONLY} />, stateWithBucket)
  })

  it("renders nothing when policy is NONE", () => {
    const { container } = renderWithStore(
      <Policy prefix="foo" policy={NONE} />,
      stateWithBucket
    )
    expect(container.querySelector(".pmb-list")).toBeNull()
  })

  it("displays '*' for empty prefix", () => {
    const { container } = renderWithStore(
      <Policy prefix="" policy={READ_ONLY} />,
      stateWithBucket
    )
    expect(container.querySelector(".pmbl-item").textContent).toBe("*")
  })

  it("calls web.SetBucketPolicy on Remove click", async () => {
    const user = userEvent.setup()
    const { container } = renderWithStore(
      <Policy prefix="foo" policy={READ_ONLY} />,
      stateWithBucket
    )
    await user.click(container.querySelector("button"))
    expect(web.SetBucketPolicy).toHaveBeenCalledWith({
      bucketName: "bucket",
      prefix: "foo",
      policy: "none",
    })
  })
})
