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
import { Bucket } from "../Bucket"
import userEvent from "@testing-library/user-event"

describe("Bucket", () => {
  it("renders without crashing", () => {
    renderWithStore(<Bucket bucket="test" />, defaultState)
  })

  it("calls selectBucket when clicked", async () => {
    const user = userEvent.setup()
    const selectBucket = jest.fn()
    const { container } = renderWithStore(
      <Bucket bucket="test" selectBucket={selectBucket} />,
      defaultState
    )
    await user.click(container.querySelector("li"))
    expect(selectBucket).toHaveBeenCalledWith("test")
  })

  it("highlights the selected bucket", () => {
    const { container } = renderWithStore(
      <Bucket bucket="test" isActive={true} />,
      defaultState
    )
    expect(container.querySelector("li").classList.contains("active")).toBe(true)
  })
})
