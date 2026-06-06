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
import { screen } from "@testing-library/react"
import { renderWithStore, defaultState } from "../../jest/test-utils"
import Header from "../Header"
import * as browserActions from "../actions"

jest.mock("../../web", () => ({
  LoggedIn: jest.fn(() => false),
  GetToken: jest.fn(() => ""),
}))

const web = require("../../web")

beforeEach(() => {
  jest
    .spyOn(browserActions, "fetchStorageInfo")
    .mockReturnValue({ type: "TEST_FETCH_STORAGE_INFO" })
  jest
    .spyOn(browserActions, "fetchServerInfo")
    .mockReturnValue({ type: "TEST_FETCH_SERVER_INFO" })
})

afterEach(() => jest.restoreAllMocks())

describe("Header", () => {
  it("renders the Login button when not logged in", () => {
    web.LoggedIn.mockReturnValue(false)
    renderWithStore(<Header />, defaultState)
    expect(screen.getByText("Login")).toBeInTheDocument()
  })

  it("renders the user dropdown trigger when logged in", () => {
    web.LoggedIn.mockReturnValue(true)
    const { container } = renderWithStore(<Header />, defaultState)
    expect(container.querySelector(".fa-bars")).not.toBeNull()
  })
})
