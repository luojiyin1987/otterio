/*
 * MinIO Cloud Storage (C) 2020 MinIO, Inc.
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
import PreviewObjectModal from "../PreviewObjectModal"

describe("PreviewObjectModal", () => {
  it("invokes getObjectURL on mount with the object name and a setter", () => {
    const getObjectURL = jest.fn()
    render(
      <PreviewObjectModal
        object={{ name: "img.png" }}
        hidePreviewModal={() => {}}
        getObjectURL={getObjectURL}
      />
    )
    expect(getObjectURL).toHaveBeenCalledWith("img.png", expect.any(Function))
  })

  it("renders an <object> tag once getObjectURL resolves with a URL", () => {
    // The component sets the url state via the setter passed as the 2nd arg.
    const getObjectURL = jest.fn((_, set) => set("https://example.invalid/x.png"))
    render(
      <PreviewObjectModal
        object={{ name: "img.png" }}
        hidePreviewModal={() => {}}
        getObjectURL={getObjectURL}
      />
    )
    expect(document.querySelector(".modal-body object")).not.toBeNull()
  })

  it("calls hidePreviewModal when Cancel is clicked", async () => {
    const user = userEvent.setup()
    const hidePreviewModal = jest.fn()
    render(
      <PreviewObjectModal
        object={{ name: "img.png" }}
        hidePreviewModal={hidePreviewModal}
        getObjectURL={() => {}}
      />
    )
    await user.click(document.querySelector(".modal-footer button"))
    expect(hidePreviewModal).toHaveBeenCalled()
  })
})
