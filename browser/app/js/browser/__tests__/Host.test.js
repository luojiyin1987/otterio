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
import { render } from "@testing-library/react"
import Host from "../Host"

describe("Host", () => {
  it("renders without crashing", () => {
    const { container } = render(<Host />)
    expect(container.querySelector(".fes-host")).not.toBeNull()
  })

  it("renders a link with the current host", () => {
    const { container } = render(<Host />)
    const link = container.querySelector("a")
    expect(link).not.toBeNull()
    expect(link.textContent).toBe(window.location.host)
  })
})
