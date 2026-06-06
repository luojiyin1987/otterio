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
import { fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithStore, defaultState } from "../../jest/test-utils"
import { Path } from "../Path"
import * as bucketActions from "../../buckets/actions"
import * as objectsActions from "../actions"

const stateWith = (buckets, currentBucket, currentPrefix) => ({
  ...defaultState,
  buckets: { ...defaultState.buckets, list: buckets, currentBucket },
  objects: { ...defaultState.objects, currentPrefix },
})

describe("Path", () => {
  beforeEach(() => jest.clearAllMocks())

  it("renders only bucket when there is no prefix", () => {
    const { container } = renderWithStore(
      <Path />,
      stateWith(["test1"], "test1", "")
    )
    const spans = container.querySelectorAll("span")
    expect(spans.length).toBe(1)
    expect(spans[0].textContent).toBe("test1")
  })

  it("renders bucket and each prefix segment", () => {
    const { container } = renderWithStore(
      <Path />,
      stateWith(["test1"], "test1", "a/b/")
    )
    const spans = container.querySelectorAll("span")
    expect(spans[0].textContent).toBe("test1")
    expect(spans[1].textContent).toBe("a")
    expect(spans[2].textContent).toBe("b")
  })

  it("dispatches selectPrefix on segment click", async () => {
    const user = userEvent.setup()
    const spy = jest.spyOn(objectsActions, "selectPrefix")
    const { container } = renderWithStore(
      <Path />,
      stateWith(["test1"], "test1", "a/b/")
    )
    const links = container.querySelectorAll("a")
    // first link = bucket, then prefix segments
    await user.click(links[2])
    expect(spy).toHaveBeenCalledWith("a/b/")
    spy.mockRestore()
  })

  it("dispatches selectBucket on form submit for existing bucket", async () => {
    const user = userEvent.setup()
    const spy = jest.spyOn(bucketActions, "selectBucket")
    const { container } = renderWithStore(
      <Path />,
      stateWith(["test1", "test2"], "test1", "")
    )
    await user.click(container.querySelector(".fe-edit"))
    const input = container.querySelector(".form-control--path")
    fireEvent.change(input, { target: { value: "test2/dir1/" } })
    fireEvent.submit(container.querySelector("form"))
    expect(spy).toHaveBeenCalledWith("test2", "dir1/")
    spy.mockRestore()
  })

  it("dispatches makeBucket when the bucket in path does not exist", async () => {
    const user = userEvent.setup()
    const spy = jest.spyOn(bucketActions, "makeBucket")
    const { container } = renderWithStore(
      <Path />,
      stateWith(["test1", "test2"], "test1", "")
    )
    await user.click(container.querySelector(".fe-edit"))
    const input = container.querySelector(".form-control--path")
    fireEvent.change(input, { target: { value: "test3/dir1/" } })
    fireEvent.submit(container.querySelector("form"))
    expect(spy).toHaveBeenCalledWith("test3")
    spy.mockRestore()
  })
})
