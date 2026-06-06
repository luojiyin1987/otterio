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

import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  sidebarOpen: false,
  storageInfo: { used: 0 },
  serverInfo: {},
}

// Slice is named "common" so generated types stay common/TOGGLE_SIDEBAR etc.,
// matching the existing constants exported from ./actions.js.
const browserSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    TOGGLE_SIDEBAR: state => {
      state.sidebarOpen = !state.sidebarOpen
    },
    CLOSE_SIDEBAR: state => {
      state.sidebarOpen = false
    },
    SET_STORAGE_INFO: (state, action) => {
      state.storageInfo = action.storageInfo ?? action.payload
    },
    SET_SERVER_INFO: (state, action) => {
      state.serverInfo = action.serverInfo ?? action.payload
    },
  },
})

export default browserSlice.reducer
