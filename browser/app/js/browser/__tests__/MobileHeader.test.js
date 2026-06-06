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
import userEvent from "@testing-library/user-event"
import { MobileHeader } from "../MobileHeader"

describe("MobileHeader", () => {
  it("renders without crashing", () => {
    render(<MobileHeader sidebarOpen={false} toggleSidebar={() => {}} />)
  })

  it("calls toggleSidebar when the trigger is clicked", async () => {
    const user = userEvent.setup()
    const toggleSidebar = jest.fn()
    const { container } = render(
      <MobileHeader sidebarOpen={false} toggleSidebar={toggleSidebar} />
    )
    await user.click(container.querySelector("#sidebar-toggle"))
    expect(toggleSidebar).toHaveBeenCalled()
  })
})
