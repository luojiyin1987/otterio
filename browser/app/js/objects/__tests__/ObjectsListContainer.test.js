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
import { ObjectsListContainer } from "../ObjectsListContainer"

describe("ObjectsListContainer", () => {
  it("renders without crashing", () => {
    renderWithStore(<ObjectsListContainer />, defaultState)
  })

  it("shows the loading indicator when listLoading is true", () => {
    const { container } = renderWithStore(<ObjectsListContainer />, {
      ...defaultState,
      objects: { ...defaultState.objects, listLoading: true },
    })
    expect(container.querySelector(".loading")).not.toBeNull()
  })
})
