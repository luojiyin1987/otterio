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
import InputGroup from "../InputGroup"

describe("InputGroup", () => {
  it("renders the provided label", () => {
    const { container } = render(
      <InputGroup label="Access Key" align="ig-left" className="ig-dark" />
    )
    expect(container.querySelector(".ig-label").textContent).toBe("Access Key")
  })

  it("renders the input as disabled when readonly is set", () => {
    const { container } = render(
      <InputGroup id="ro" readonly align="ig-left" className="ig-dark" />
    )
    expect(container.querySelector("input").disabled).toBe(true)
  })

  it("calls the onChange handler when the user types", () => {
    const onChange = jest.fn()
    const { container } = render(
      <InputGroup
        id="ed"
        value=""
        onChange={onChange}
        align="ig-left"
        className="ig-dark"
      />
    )
    fireEvent.change(container.querySelector("input"), {
      target: { value: "test" },
    })
    expect(onChange).toHaveBeenCalled()
  })
})
