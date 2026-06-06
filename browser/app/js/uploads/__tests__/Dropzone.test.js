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
import { Dropzone } from "../Dropzone"

describe("Dropzone", () => {
  it("renders the children", () => {
    const { container } = renderWithStore(
      <Dropzone>
        <span data-testid="child">hi</span>
      </Dropzone>,
      defaultState
    )
    expect(container.querySelector('[data-testid="child"]')).not.toBeNull()
  })
})
