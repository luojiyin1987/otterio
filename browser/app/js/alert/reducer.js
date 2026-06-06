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
  show: false,
  type: "danger",
}

// We expose action.type strings in uppercase (alert/SET, alert/CLEAR) because
// existing tests and other slices reference these literals. createSlice uses
// the key from `reducers` verbatim as the action type suffix, so naming the
// case reducers SET/CLEAR keeps the public contract identical.
const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    SET: (state, action) => ({
      show: true,
      id: action.payload.id,
      type: action.payload.type,
      message: action.payload.message,
    }),
    CLEAR: (state, action) => {
      const payload = action.payload
      if (payload && payload.id != null && payload.id !== state.id) {
        return state
      }
      return initialState
    },
  },
})

// The slice generates action creators that take a single `payload` argument
// and emit { type, payload }. The legacy code emits raw actions of the form
// { type, alert: { ... } } (no payload key), so we expose a thin wrapper at
// the actions.js layer; the reducer below normalizes both shapes.
const wrappedReducer = (state, action) => {
  if (action && action.alert && action.payload === undefined) {
    return alertSlice.reducer(state, { ...action, payload: action.alert })
  }
  return alertSlice.reducer(state, action)
}

export default wrappedReducer
