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
import StorageInfo from "../StorageInfo"
import * as browserActions from "../actions"

// Stub the network-touching thunk so the mount-side useEffect doesn't try to
// reach the real backend during the test.
beforeEach(() => {
  jest
    .spyOn(browserActions, "fetchStorageInfo")
    .mockReturnValue({ type: "TEST_FETCH_STORAGE_INFO" })
})

afterEach(() => jest.restoreAllMocks())

describe("StorageInfo", () => {
  it("renders nothing when used is 0", () => {
    const { container } = renderWithStore(<StorageInfo />, {
      ...defaultState,
      browser: {
        ...defaultState.browser,
        storageInfo: { used: 0, total: 0, free: 0 },
      },
    })
    expect(container.querySelector(".feh-used")).toBeNull()
  })

  it("renders the usage block when used > 0", () => {
    const { container } = renderWithStore(<StorageInfo />, {
      ...defaultState,
      browser: {
        ...defaultState.browser,
        storageInfo: { used: 60, total: 100, free: 40 },
      },
    })
    expect(container.querySelector(".feh-used")).not.toBeNull()
  })

  it("dispatches fetchStorageInfo on mount", () => {
    renderWithStore(<StorageInfo />, defaultState)
    expect(browserActions.fetchStorageInfo).toHaveBeenCalled()
  })
})
