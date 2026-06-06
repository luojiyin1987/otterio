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
import PrefixContainer from "../PrefixContainer"
import * as objectsActions from "../actions"

beforeEach(() => {
  jest
    .spyOn(objectsActions, "selectPrefix")
    .mockImplementation(prefix => ({ type: "TEST_SELECT_PREFIX", prefix }))
})

afterEach(() => jest.restoreAllMocks())

describe("PrefixContainer", () => {
  it("renders the prefix name", () => {
    const { container } = renderWithStore(
      <PrefixContainer object={{ name: "abc/" }} />,
      defaultState
    )
    expect(container.textContent).toContain("abc/")
  })

  it("dispatches selectPrefix on click", async () => {
    const user = userEvent.setup()
    const { container } = renderWithStore(<PrefixContainer object={{ name: "abc/" }} />, {
      ...defaultState,
      objects: { ...defaultState.objects, currentPrefix: "xyz/" },
    })
    await user.click(container.querySelector("a"))
    expect(objectsActions.selectPrefix).toHaveBeenCalledWith("xyz/abc/")
  })

  it("renders PrefixActions when nothing is checked", () => {
    const { container } = renderWithStore(
      <PrefixContainer object={{ name: "abc/" }} />,
      defaultState
    )
    expect(container.querySelector(".fia-toggle")).not.toBeNull()
  })

  it("does not render PrefixActions when some objects are checked", () => {
    const { container } = renderWithStore(<PrefixContainer object={{ name: "abc/" }} />, {
      ...defaultState,
      objects: { ...defaultState.objects, checkedList: ["x"] },
    })
    expect(container.querySelector(".fia-toggle")).toBeNull()
  })
})
