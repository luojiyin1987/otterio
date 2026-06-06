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
import { BucketSearch } from "../BucketSearch"

describe("BucketSearch", () => {
  it("renders without crashing", () => {
    render(<BucketSearch onChange={() => {}} />)
  })

  it("calls onChange with the typed value", () => {
    const onChange = jest.fn()
    const { container } = render(<BucketSearch onChange={onChange} />)
    fireEvent.change(container.querySelector("input"), {
      target: { value: "test" },
    })
    expect(onChange).toHaveBeenCalledWith("test")
  })
})
