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
import BucketDropdown from "../BucketDropdown"
import * as bucketActions from "../actions"

// react-bootstrap 2 keeps the dropdown menu unmounted until the toggle is
// activated. We open it explicitly before asserting on the items.
const openMenu = async user => {
  await user.click(document.querySelector(".fa-ellipsis-v").parentElement)
}

describe("BucketDropdown", () => {
  beforeEach(() => jest.clearAllMocks())

  it("renders the trigger", () => {
    const { container } = renderWithStore(
      <BucketDropdown bucket="test" />,
      defaultState
    )
    expect(container.querySelector(".fa-ellipsis-v")).not.toBeNull()
  })

  it("dispatches showBucketPolicy when Edit policy is clicked", async () => {
    const user = userEvent.setup()
    const spy = jest
      .spyOn(bucketActions, "showBucketPolicy")
      .mockReturnValue({ type: "TEST_SHOW_POLICY" })
    renderWithStore(<BucketDropdown bucket="test" />, defaultState)
    await openMenu(user)
    const links = document.querySelectorAll("li a")
    await user.click(links[0])
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it("dispatches deleteBucket when Delete is clicked", async () => {
    const user = userEvent.setup()
    const spy = jest
      .spyOn(bucketActions, "deleteBucket")
      .mockReturnValue({ type: "TEST_DELETE_BUCKET" })
    renderWithStore(<BucketDropdown bucket="test" />, defaultState)
    await openMenu(user)
    const links = document.querySelectorAll("li a")
    await user.click(links[1])
    expect(spy).toHaveBeenCalledWith("test")
    spy.mockRestore()
  })
})
