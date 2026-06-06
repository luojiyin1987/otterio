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
import { UploadModal } from "../UploadModal"
import * as uploadsActions from "../actions"

describe("UploadModal", () => {
  beforeEach(() => jest.clearAllMocks())

  it("renders nothing when there are no uploads", () => {
    const { container } = renderWithStore(<UploadModal />, defaultState)
    expect(container.querySelector(".progress")).toBeNull()
  })

  it("shows the progress bar when one or more files are uploading", () => {
    const { container } = renderWithStore(<UploadModal />, {
      ...defaultState,
      uploads: {
        files: { "a-b/-test": { size: 100, loaded: 50, name: "test" } },
        showAbortModal: false,
      },
    })
    expect(container.querySelector(".progress")).not.toBeNull()
  })

  it("renders AbortConfirmModal when showAbortModal is true", () => {
    renderWithStore(<UploadModal />, {
      ...defaultState,
      uploads: {
        files: { "a-b/-test": { size: 100, loaded: 50, name: "test" } },
        showAbortModal: true,
      },
    })
    expect(document.querySelector(".modal-confirm")).not.toBeNull()
  })

  it("dispatches showAbortModal when the close button is clicked", async () => {
    const user = userEvent.setup()
    const spy = jest.spyOn(uploadsActions, "showAbortModal")
    const { container } = renderWithStore(<UploadModal />, {
      ...defaultState,
      uploads: {
        files: { "a-b/-test": { size: 100, loaded: 50, name: "test" } },
        showAbortModal: false,
      },
    })
    await user.click(container.querySelector("button.close"))
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})
