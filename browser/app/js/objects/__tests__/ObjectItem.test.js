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
import { ObjectItem } from "../ObjectItem"

describe("ObjectItem", () => {
  it("renders without crashing", () => {
    render(<ObjectItem name="test" />)
  })

  it("infers data-type from the file name", () => {
    const { container } = render(<ObjectItem name="test.jpg" contentType="" />)
    expect(container.querySelector(".fesl-row").dataset.type).toBe("image")
  })

  it("calls onClick when a folder link is clicked", async () => {
    const user = userEvent.setup()
    const onClick = jest.fn()
    const { container } = render(<ObjectItem name="test/" onClick={onClick} />)
    await user.click(container.querySelector("a"))
    expect(onClick).toHaveBeenCalled()
  })

  it("calls checkObject when the checkbox is toggled (unchecked -> checked)", () => {
    const checkObject = jest.fn()
    const { container } = render(
      <ObjectItem name="test" checked={false} checkObject={checkObject} />
    )
    fireEvent.click(container.querySelector('input[type="checkbox"]'))
    expect(checkObject).toHaveBeenCalledWith("test")
  })

  it("calls uncheckObject when the checkbox is toggled (checked -> unchecked)", () => {
    const checkObject = jest.fn()
    const uncheckObject = jest.fn()
    const { container } = render(
      <ObjectItem
        name="test"
        checked={true}
        checkObject={checkObject}
        uncheckObject={uncheckObject}
      />
    )
    fireEvent.click(container.querySelector('input[type="checkbox"]'))
    expect(uncheckObject).toHaveBeenCalledWith("test")
  })

  it("renders the checkbox as checked when prop is true", () => {
    const { container } = render(<ObjectItem name="test" checked={true} />)
    expect(container.querySelector('input[type="checkbox"]').checked).toBe(true)
  })
})
