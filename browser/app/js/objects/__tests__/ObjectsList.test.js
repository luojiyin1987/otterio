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
import { ObjectsList } from "../ObjectsList"

describe("ObjectsList", () => {
  it("renders without crashing", () => {
    renderWithStore(<ObjectsList objects={[]} />, defaultState)
  })

  it("renders a row for every object/prefix", () => {
    const { container } = renderWithStore(
      <ObjectsList
        objects={[
          { name: "test1.jpg", size: 1 },
          { name: "abc/" },
          { name: "test2.jpg", size: 2 },
        ]}
      />,
      defaultState
    )
    expect(container.querySelectorAll(".fesl-row").length).toBe(3)
  })
})
