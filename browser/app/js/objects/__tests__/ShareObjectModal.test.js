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
import { ShareObjectModal } from "../ShareObjectModal"
import * as objectsActions from "../actions"

jest.mock("../../web", () => ({
  LoggedIn: jest.fn(() => true),
  GetBucketPolicy: jest.fn(() => Promise.resolve({ policy: null })),
  PresignedGet: jest.fn(() =>
    Promise.resolve({ url: "https://example.invalid/share" })
  ),
}))

const stateWithShare = (extra = {}) => ({
  ...defaultState,
  objects: {
    ...defaultState.objects,
    shareObject: {
      show: true,
      object: "obj1",
      url: "test",
      showExpiryDate: true,
      ...extra,
    },
  },
})

describe("ShareObjectModal", () => {
  beforeEach(() => jest.clearAllMocks())

  it("renders the shareable link", () => {
    renderWithStore(<ShareObjectModal object={{ name: "obj1" }} />, stateWithShare())
    const input = document.querySelector("input[type=text]")
    expect(input.value).toBe(`${window.location.protocol}//test`)
  })

  it("hides expiry block when showExpiryDate is false", () => {
    renderWithStore(
      <ShareObjectModal object={{ name: "obj1" }} />,
      stateWithShare({ showExpiryDate: false })
    )
    expect(document.querySelector(".set-expire")).toBeNull()
  })

  it("dispatches hideShareObject when Cancel is clicked", async () => {
    const user = userEvent.setup()
    const spy = jest.spyOn(objectsActions, "hideShareObject")
    renderWithStore(<ShareObjectModal object={{ name: "obj1" }} />, stateWithShare())
    // Cancel is the second button in the modal footer.
    const buttons = document.querySelectorAll(".modal-footer button")
    await user.click(buttons[buttons.length - 1])
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it("dispatches shareObject when increasing days from a valid state", async () => {
    const user = userEvent.setup()
    const spy = jest.spyOn(objectsActions, "shareObject")
    renderWithStore(<ShareObjectModal object={{ name: "obj1" }} />, stateWithShare())
    await user.click(document.querySelector("#increase-hours"))
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})
