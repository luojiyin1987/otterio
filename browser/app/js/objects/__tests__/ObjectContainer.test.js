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
import { renderWithStore, defaultState } from "../../jest/test-utils"
import ObjectContainer from "../ObjectContainer"

describe("ObjectContainer", () => {
  it("renders the object name", () => {
    const { container } = renderWithStore(
      <ObjectContainer object={{ name: "test1.jpg", size: 0 }} />,
      defaultState
    )
    expect(container.textContent).toContain("test1.jpg")
  })

  it("renders action buttons when nothing is checked", () => {
    const { container } = renderWithStore(
      <ObjectContainer object={{ name: "test1.jpg", size: 0 }} />,
      defaultState
    )
    expect(container.querySelector(".fia-toggle")).not.toBeNull()
  })

  it("does not render action buttons when some objects are checked", () => {
    const { container } = renderWithStore(
      <ObjectContainer object={{ name: "test1.jpg", size: 0 }} />,
      {
        ...defaultState,
        objects: { ...defaultState.objects, checkedList: ["foo"] },
      }
    )
    expect(container.querySelector(".fia-toggle")).toBeNull()
  })
})
