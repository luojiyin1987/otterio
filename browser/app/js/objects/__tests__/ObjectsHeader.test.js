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
import { ObjectsHeader } from "../ObjectsHeader"
import { SORT_ORDER_ASC, SORT_ORDER_DESC } from "../../constants"

describe("ObjectsHeader", () => {
  it("renders without crashing", () => {
    render(<ObjectsHeader sortObjects={() => {}} />)
  })

  it("shows the asc icon when sorted by name asc", () => {
    const { container } = render(
      <ObjectsHeader
        sortObjects={() => {}}
        sortedByName={true}
        sortOrder={SORT_ORDER_ASC}
      />
    )
    expect(
      container.querySelector("#sort-by-name i").classList.contains("fa-sort-alpha-down")
    ).toBe(true)
  })

  it("shows the desc icon when sorted by name desc", () => {
    const { container } = render(
      <ObjectsHeader
        sortObjects={() => {}}
        sortedByName={true}
        sortOrder={SORT_ORDER_DESC}
      />
    )
    expect(
      container.querySelector("#sort-by-name i").classList.contains("fa-sort-alpha-down-alt")
    ).toBe(true)
  })

  it("calls sortObjects when a column is clicked", () => {
    const sortObjects = jest.fn()
    const { container } = render(<ObjectsHeader sortObjects={sortObjects} />)
    fireEvent.click(container.querySelector("#sort-by-name"))
    expect(sortObjects).toHaveBeenCalledWith("name")
    fireEvent.click(container.querySelector("#sort-by-size"))
    expect(sortObjects).toHaveBeenCalledWith("size")
    fireEvent.click(container.querySelector("#sort-by-last-modified"))
    expect(sortObjects).toHaveBeenCalledWith("last-modified")
  })
})
