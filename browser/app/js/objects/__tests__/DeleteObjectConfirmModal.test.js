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
import { DeleteObjectConfirmModal } from "../DeleteObjectConfirmModal"

describe("DeleteObjectConfirmModal", () => {
  it("renders without crashing", () => {
    render(<DeleteObjectConfirmModal deleteObject={() => {}} hideDeleteConfirmModal={() => {}} />)
  })

  it("calls deleteObject when Delete is clicked", async () => {
    const user = userEvent.setup()
    const deleteObject = jest.fn()
    render(
      <DeleteObjectConfirmModal
        deleteObject={deleteObject}
        hideDeleteConfirmModal={() => {}}
      />
    )
    await user.click(screen.getByText("Delete"))
    expect(deleteObject).toHaveBeenCalled()
  })

  it("calls hideDeleteConfirmModal when Cancel is clicked", async () => {
    const user = userEvent.setup()
    const hide = jest.fn()
    render(
      <DeleteObjectConfirmModal
        deleteObject={() => {}}
        hideDeleteConfirmModal={hide}
      />
    )
    await user.click(screen.getByText("Cancel"))
    expect(hide).toHaveBeenCalled()
  })
})
