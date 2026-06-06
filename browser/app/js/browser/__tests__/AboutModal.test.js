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
import userEvent from "@testing-library/user-event"
import { AboutModal } from "../AboutModal"

const serverInfo = { version: "v1", platform: "linux", runtime: "go1.22" }

describe("AboutModal", () => {
  it("renders the version/platform/runtime values", () => {
    render(<AboutModal serverInfo={serverInfo} hideAbout={() => {}} />)
    expect(screen.getByText("v1")).toBeInTheDocument()
    expect(screen.getByText("linux")).toBeInTheDocument()
    expect(screen.getByText("go1.22")).toBeInTheDocument()
  })

  it("calls hideAbout when the close button is clicked", async () => {
    const user = userEvent.setup()
    const hideAbout = jest.fn()
    render(<AboutModal serverInfo={serverInfo} hideAbout={hideAbout} />)
    await user.click(document.querySelector(".close"))
    expect(hideAbout).toHaveBeenCalled()
  })
})
