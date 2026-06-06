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
import { PrefixActions } from "../PrefixActions"
import * as objectsActions from "../actions"

beforeEach(() => {
  jest
    .spyOn(objectsActions, "downloadPrefix")
    .mockImplementation(name => ({ type: "TEST_DOWNLOAD_PREFIX", name }))
  jest
    .spyOn(objectsActions, "deleteObject")
    .mockImplementation(name => ({ type: "TEST_DELETE_OBJECT", name }))
})

afterEach(() => jest.restoreAllMocks())

// Open the dropdown so its menu items become reachable in jsdom.
const openMenu = async user => {
  await user.click(document.querySelector(".fia-toggle"))
}

describe("PrefixActions", () => {
  it("renders without crashing", () => {
    renderWithStore(<PrefixActions object={{ name: "abc/" }} />, defaultState)
  })

  it("dispatches downloadPrefix when download is clicked", async () => {
    const user = userEvent.setup()
    renderWithStore(<PrefixActions object={{ name: "abc/" }} />, defaultState)
    await openMenu(user)
    await user.click(document.querySelectorAll(".fiad-action")[0])
    expect(objectsActions.downloadPrefix).toHaveBeenCalledWith("abc/")
  })

  it("opens the delete confirmation when Delete is clicked", async () => {
    const user = userEvent.setup()
    renderWithStore(<PrefixActions object={{ name: "abc/" }} />, defaultState)
    await openMenu(user)
    const links = document.querySelectorAll(".fiad-action")
    await user.click(links[links.length - 1])
    expect(document.querySelector(".modal-confirm")).not.toBeNull()
  })
})
