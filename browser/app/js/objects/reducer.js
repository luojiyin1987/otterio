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
import { SORT_ORDER_ASC } from "../constants"
import { removeFromList } from "../utils/listOps"

const initialState = {
  list: [],
  filter: "",
  listLoading: false,
  sortBy: "",
  sortOrder: SORT_ORDER_ASC,
  currentPrefix: "",
  prefixWritable: false,
  shareObject: {
    show: false,
    object: "",
    url: "",
  },
  checkedList: [],
}

const objectsSlice = createSlice({
  name: "objects",
  initialState,
  reducers: {
    SET_LIST: (state, action) => {
      state.list = action.objects
    },
    RESET_LIST: state => {
      state.list = []
    },
    SET_FILTER: (state, action) => {
      state.filter = action.filter
    },
    SET_LIST_LOADING: (state, action) => {
      state.listLoading = action.listLoading
    },
    REMOVE: (state, action) => {
      state.list = removeFromList(state.list, o => o.name === action.object)
    },
    SET_SORT_BY: (state, action) => {
      state.sortBy = action.sortBy
    },
    SET_SORT_ORDER: (state, action) => {
      state.sortOrder = action.sortOrder
    },
    SET_CURRENT_PREFIX: (state, action) => {
      state.currentPrefix = action.prefix
    },
    SET_PREFIX_WRITABLE: (state, action) => {
      state.prefixWritable = action.prefixWritable
    },
    SET_SHARE_OBJECT: (state, action) => {
      state.shareObject = {
        show: action.show,
        object: action.object,
        url: action.url,
        showExpiryDate: action.showExpiryDate,
      }
    },
    CHECKED_LIST_ADD: (state, action) => {
      state.checkedList.push(action.object)
    },
    CHECKED_LIST_REMOVE: (state, action) => {
      state.checkedList = removeFromList(
        state.checkedList,
        o => o === action.object
      )
    },
    CHECKED_LIST_RESET: state => {
      state.checkedList = []
    },
  },
})

export default objectsSlice.reducer
