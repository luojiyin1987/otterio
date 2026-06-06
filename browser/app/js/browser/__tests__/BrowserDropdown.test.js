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
import BrowserDropdown from "../BrowserDropdown"
import * as browserActions from "../actions"

jest.mock("../../web", () => ({
  Logout: jest.fn(),
  LoggedIn: jest.fn(() => true),
  GetToken: jest.fn(() => ""),
}))

beforeEach(() => {
  jest
    .spyOn(browserActions, "fetchServerInfo")
    .mockReturnValue({ type: "TEST_FETCH_SERVER_INFO" })
})

afterEach(() => jest.restoreAllMocks())

describe("BrowserDropdown", () => {
  it("renders without crashing", () => {
    const { container } = renderWithStore(<BrowserDropdown />, defaultState)
    expect(container.querySelector(".fa-bars")).not.toBeNull()
  })

  it("dispatches fetchServerInfo on mount", () => {
    renderWithStore(<BrowserDropdown />, defaultState)
    expect(browserActions.fetchServerInfo).toHaveBeenCalled()
  })

  it("opens the About modal when the About link is clicked", async () => {
    const user = userEvent.setup()
    renderWithStore(<BrowserDropdown />, defaultState)
    // Open the dropdown first so the menu items become mounted.
    await user.click(document.querySelector(".fa-bars").parentElement)
    const aboutLink = document.querySelector("#show-about")
    expect(aboutLink).not.toBeNull()
    await user.click(aboutLink)
    expect(document.querySelector(".modal-about")).not.toBeNull()
  })
})
