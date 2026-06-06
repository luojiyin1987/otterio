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
import { ObjectActions } from "../ObjectActions"
import * as objectsActions from "../actions"

const stateWithBucket = (extra = {}) => ({
  ...defaultState,
  buckets: { ...defaultState.buckets, currentBucket: "bk" },
  objects: { ...defaultState.objects, currentPrefix: "pre1/", ...extra },
})

beforeEach(() => {
  jest
    .spyOn(objectsActions, "downloadObject")
    .mockImplementation(name => ({ type: "TEST_DOWNLOAD", name }))
  jest
    .spyOn(objectsActions, "shareObject")
    .mockImplementation((name, d, h, m) => ({
      type: "TEST_SHARE",
      name,
      d,
      h,
      m,
    }))
  jest
    .spyOn(objectsActions, "deleteObject")
    .mockImplementation(name => ({ type: "TEST_DELETE", name }))
  jest
    .spyOn(objectsActions, "getObjectURL")
    .mockImplementation((name, cb) => ({ type: "TEST_GET_URL", name }))
})

afterEach(() => jest.restoreAllMocks())

const openMenu = async user => {
  await user.click(document.querySelector(".fia-toggle"))
}

describe("ObjectActions", () => {
  it("renders without crashing", () => {
    renderWithStore(<ObjectActions object={{ name: "obj1" }} />, stateWithBucket())
  })

  it("opens the delete confirmation when Delete is clicked", async () => {
    const user = userEvent.setup()
    renderWithStore(
      <ObjectActions object={{ name: "obj1" }} />,
      stateWithBucket()
    )
    await openMenu(user)
    const links = document.querySelectorAll(".fiad-action")
    await user.click(links[links.length - 1])
    expect(document.querySelector(".modal-confirm")).not.toBeNull()
  })

  it("dispatches downloadObject when Download is clicked (non-image)", async () => {
    const user = userEvent.setup()
    renderWithStore(
      <ObjectActions object={{ name: "obj1" }} />,
      stateWithBucket()
    )
    await openMenu(user)
    // For non-image: [Share, Download, Delete]
    const links = document.querySelectorAll(".fiad-action")
    await user.click(links[1])
    expect(objectsActions.downloadObject).toHaveBeenCalledWith("obj1")
  })

  it("dispatches shareObject with default expiry on Share click", async () => {
    const user = userEvent.setup()
    renderWithStore(
      <ObjectActions object={{ name: "obj1" }} />,
      stateWithBucket()
    )
    await openMenu(user)
    await user.click(document.querySelectorAll(".fiad-action")[0])
    expect(objectsActions.shareObject).toHaveBeenCalledWith("obj1", 5, 0, 0)
  })

  it("renders the Preview action for image objects only", async () => {
    const user = userEvent.setup()
    renderWithStore(
      <ObjectActions object={{ name: "img.jpg", contentType: "image/jpeg" }} />,
      stateWithBucket()
    )
    await openMenu(user)
    expect(document.querySelectorAll(".fiad-action").length).toBe(4)
  })
})
