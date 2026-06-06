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
import { removeFromList } from "../utils/listOps"

const initialState = {
  list: [],
  filter: "",
  currentBucket: "",
  showMakeBucketModal: false,
  policies: [],
  showBucketPolicy: false,
}

const bucketsSlice = createSlice({
  name: "buckets",
  initialState,
  reducers: {
    // Slice action types stay uppercase so the contract matches the
    // hand-written constants in ./actions.js (buckets/SET_LIST etc.).
    // Each reducer pulls its field off the raw action object — actions.js
    // still emits the legacy shape ({ type, buckets } / { type, bucket } /
    // { type, filter } / { type, show }) so we don't have to migrate every
    // caller to RTK's payload convention in this phase.
    SET_LIST: (state, action) => {
      state.list = action.buckets
    },
    ADD: (state, action) => {
      state.list.unshift(action.bucket)
    },
    REMOVE: (state, action) => {
      state.list = removeFromList(state.list, b => b === action.bucket)
    },
    SET_FILTER: (state, action) => {
      state.filter = action.filter
    },
    SET_CURRENT_BUCKET: (state, action) => {
      state.currentBucket = action.bucket
    },
    SHOW_MAKE_BUCKET_MODAL: (state, action) => {
      state.showMakeBucketModal = action.show
    },
    SET_POLICIES: (state, action) => {
      state.policies = action.policies
    },
    SHOW_BUCKET_POLICY: (state, action) => {
      state.showBucketPolicy = action.show
    },
  },
})

export default bucketsSlice.reducer
