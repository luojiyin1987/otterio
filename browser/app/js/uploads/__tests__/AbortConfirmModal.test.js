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
import { AbortConfirmModal } from "../AbortConfirmModal"
import * as uploadsActions from "../actions"

const stateWith = files => ({
  ...defaultState,
  uploads: { files, showAbortModal: true },
})

describe("AbortConfirmModal", () => {
  beforeEach(() => jest.clearAllMocks())

  it("renders without crashing", () => {
    renderWithStore(<AbortConfirmModal />, stateWith({}))
  })

  it("dispatches abortUpload for every active upload when Abort is clicked", async () => {
    const user = userEvent.setup()
    const spy = jest.spyOn(uploadsActions, "abortUpload")
    renderWithStore(
      <AbortConfirmModal />,
      stateWith({
        "a-b/-test1": { size: 100, loaded: 50, name: "test1" },
        "a-b/-test2": { size: 100, loaded: 50, name: "test2" },
      })
    )
    await user.click(document.querySelector(".modal-confirm .btn-danger"))
    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy.mock.calls.map(c => c[0])).toEqual([
      "a-b/-test1",
      "a-b/-test2",
    ])
    spy.mockRestore()
  })

  it("dispatches hideAbortModal when Cancel is clicked", async () => {
    const user = userEvent.setup()
    const spy = jest.spyOn(uploadsActions, "hideAbortModal")
    renderWithStore(<AbortConfirmModal />, stateWith({}))
    await user.click(document.querySelector(".modal-confirm .btn-link"))
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})
