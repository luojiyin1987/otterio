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
import { render, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithStore, defaultState } from "../../jest/test-utils"
import { ChangePasswordModal } from "../ChangePasswordModal"

jest.mock("jwt-decode", () => ({
  jwtDecode: () => ({ sub: "otterio" }),
}))

jest.mock("../../web", () => ({
  SetAuth: jest.fn(() => Promise.resolve({})),
  GetToken: jest.fn(() => ""),
}))

jest.mock("../../utils", () => ({
  getRandomAccessKey: () => "raccesskey",
  getRandomSecretKey: () => "rsecretkey",
}))

const iamServerInfo = {
  version: "test",
  platform: "test",
  runtime: "test",
  info: {},
  userInfo: { isIAMUser: true },
}

describe("ChangePasswordModal", () => {
  it("renders without crashing", () => {
    renderWithStore(
      <ChangePasswordModal serverInfo={iamServerInfo} hideChangePassword={() => {}} />,
      defaultState
    )
  })

  it("displays a message when user is not an IAM user", () => {
    renderWithStore(
      <ChangePasswordModal
        serverInfo={{ ...iamServerInfo, userInfo: { isIAMUser: false } }}
        hideChangePassword={() => {}}
      />,
      defaultState
    )
    // react-bootstrap Modal portals its body to document.body, so the visible
    // copy of the message lives outside the render container.
    expect(document.body.textContent).toContain(
      "Credentials of this user cannot be updated"
    )
  })

  it("displays the same message for STS/temp users", () => {
    renderWithStore(
      <ChangePasswordModal
        serverInfo={{ ...iamServerInfo, userInfo: { isTempUser: true } }}
        hideChangePassword={() => {}}
      />,
      defaultState
    )
    expect(document.body.textContent).toContain(
      "Credentials of this user cannot be updated"
    )
  })

  it("does not render the new access key field for IAM users", () => {
    renderWithStore(
      <ChangePasswordModal
        serverInfo={iamServerInfo}
        hideChangePassword={() => {}}
      />,
      defaultState
    )
    expect(document.querySelector("#newAccesskey")).toBeNull()
  })

  it("keeps the Update button disabled while inputs are too short", () => {
    renderWithStore(
      <ChangePasswordModal
        serverInfo={iamServerInfo}
        hideChangePassword={() => {}}
      />,
      defaultState
    )
    fireEvent.change(document.querySelector("#currentSecretKey"), {
      target: { value: "otterio123" },
    })
    fireEvent.change(document.querySelector("#newSecretKey"), {
      target: { value: "t1" },
    })
    expect(document.querySelector("#update-keys").disabled).toBe(true)
  })

  it("calls hideChangePassword when cancel is clicked", async () => {
    const user = userEvent.setup()
    const hideChangePassword = jest.fn()
    renderWithStore(
      <ChangePasswordModal
        serverInfo={iamServerInfo}
        hideChangePassword={hideChangePassword}
      />,
      defaultState
    )
    await user.click(document.querySelector("#cancel-change-password"))
    expect(hideChangePassword).toHaveBeenCalled()
  })
})
