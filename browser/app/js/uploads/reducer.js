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
  files: {},
  showAbortModal: false,
}

const uploadsSlice = createSlice({
  name: "uploads",
  initialState,
  reducers: {
    ADD: (state, action) => {
      state.files[action.slug] = {
        loaded: 0,
        size: action.size,
        name: action.name,
      }
    },
    UPDATE_PROGRESS: (state, action) => {
      if (state.files[action.slug]) {
        state.files[action.slug].loaded = action.loaded
      }
    },
    STOP: (state, action) => {
      delete state.files[action.slug]
    },
    SHOW_ABORT_MODAL: (state, action) => {
      state.showAbortModal = action.show
    },
  },
})

export default uploadsSlice.reducer
