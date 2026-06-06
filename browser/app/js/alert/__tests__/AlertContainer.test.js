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
import { render, screen } from "@testing-library/react"
import { AlertContainer } from "../AlertContainer"

describe("AlertContainer", () => {
  it("renders the underlying Alert with message", () => {
    const { container } = render(
      <AlertContainer
        alert={{ show: true, type: "danger", message: "Test" }}
        clearAlert={() => {}}
      />
    )
    expect(container.querySelector(".alert")).not.toBeNull()
    expect(screen.getByText("Test")).toBeInTheDocument()
  })

  it("renders nothing when message is empty", () => {
    const { container } = render(
      <AlertContainer
        alert={{ show: true, type: "danger", message: "" }}
        clearAlert={() => {}}
      />
    )
    expect(container.querySelector(".alert")).toBeNull()
  })
})
