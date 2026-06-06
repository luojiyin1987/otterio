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
import { render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ConfirmModal from "../ConfirmModal"

const props = {
  baseClass: "test-class",
  icon: "fa fa-trash",
  text: "Delete?",
  sub: "This cannot be undone",
  okText: "Yes",
  cancelText: "No",
}

describe("ConfirmModal", () => {
  it("renders text and sub when visible", () => {
    render(<ConfirmModal {...props} show={true} okHandler={() => {}} cancelHandler={() => {}} />)
    expect(document.body.textContent).toContain("Delete?")
    expect(document.body.textContent).toContain("This cannot be undone")
  })

  it("calls okHandler when OK is clicked", async () => {
    const user = userEvent.setup()
    const okHandler = jest.fn()
    render(<ConfirmModal {...props} show={true} okHandler={okHandler} cancelHandler={() => {}} />)
    const buttons = document.querySelectorAll(".modal-footer button")
    await user.click(buttons[0])
    expect(okHandler).toHaveBeenCalled()
  })

  it("calls cancelHandler when Cancel is clicked", async () => {
    const user = userEvent.setup()
    const cancelHandler = jest.fn()
    render(<ConfirmModal {...props} show={true} okHandler={() => {}} cancelHandler={cancelHandler} />)
    const buttons = document.querySelectorAll(".modal-footer button")
    await user.click(buttons[1])
    expect(cancelHandler).toHaveBeenCalled()
  })
})
