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
import Alert from "../Alert"

describe("Alert", () => {
  it("renders without crashing", () => {
    render(<Alert show={true} type="danger" message="" onDismiss={() => {}} />)
  })

  it("displays the message text", () => {
    render(
      <Alert show={true} type="info" message="hello world" onDismiss={() => {}} />
    )
    expect(screen.getByText("hello world")).toBeInTheDocument()
  })

  it("calls onDismiss when the close button is clicked", async () => {
    const user = userEvent.setup()
    const onDismiss = jest.fn()
    render(
      <Alert show={true} type="danger" message="oops" onDismiss={onDismiss} />
    )
    await user.click(screen.getByRole("button", { name: /close/i }))
    expect(onDismiss).toHaveBeenCalled()
  })
})
