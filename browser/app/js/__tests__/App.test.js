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
import { MemoryRouter } from "react-router-dom"
import App from "../App"

jest.mock("../browser/Login", () => () => <div>Login</div>)
jest.mock("../browser/Browser", () => () => <div>Browser</div>)
jest.mock("../browser/OpenIDLogin", () => () => <div>OpenIDLogin</div>)

const renderAt = path =>
  render(
    <MemoryRouter
      initialEntries={[path]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <App />
    </MemoryRouter>
  )

describe("App", () => {
  it("renders Login at /login", () => {
    const { getByText } = renderAt("/login")
    expect(getByText("Login")).toBeInTheDocument()
  })

  it("renders Browser at /", () => {
    const { getByText } = renderAt("/")
    expect(getByText("Browser")).toBeInTheDocument()
  })

  it("renders Browser at /bucket", () => {
    const { getByText } = renderAt("/bucket")
    expect(getByText("Browser")).toBeInTheDocument()
  })

  it("renders Browser at /bucket/a/b/c", () => {
    const { getByText } = renderAt("/bucket/a/b/c")
    expect(getByText("Browser")).toBeInTheDocument()
  })
})
