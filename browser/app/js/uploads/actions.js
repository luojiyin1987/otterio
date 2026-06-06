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

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)
import storage from "local-storage-fallback"
import * as objectsActions from "../objects/actions"
import { getCurrentBucket } from "../buckets/selectors"
import { getCurrentPrefix } from "../objects/selectors"
import { otterioBrowserPrefix } from "../constants"
import {
  dispatchAlertError,
  dispatchAlertSuccess,
} from "../utils/alertDispatch"

export const ADD = "uploads/ADD"
export const UPDATE_PROGRESS = "uploads/UPDATE_PROGRESS"
export const STOP = "uploads/STOP"
export const SHOW_ABORT_MODAL = "uploads/SHOW_ABORT_MODAL"

export const add = (slug, size, name) => ({
  type: ADD,
  slug,
  size,
  name,
})

export const updateProgress = (slug, loaded) => ({
  type: UPDATE_PROGRESS,
  slug,
  loaded,
})

export const stop = slug => ({
  type: STOP,
  slug,
})

export const showAbortModal = () => ({
  type: SHOW_ABORT_MODAL,
  show: true,
})

export const hideAbortModal = () => ({
  type: SHOW_ABORT_MODAL,
  show: false,
})

// In-memory map of active uploads keyed by slug, so abortUpload can cancel
// the underlying XMLHttpRequest. Kept outside the redux store because XHR is
// not serializable.
const requests = {}

export const addUpload = (xhr, slug, size, name) => {
  return function (dispatch) {
    requests[slug] = xhr
    dispatch(add(slug, size, name))
  }
}

export const abortUpload = slug => {
  return function (dispatch) {
    const xhr = requests[slug]
    if (xhr) {
      xhr.abort()
    }
    dispatch(stop(slug))
    dispatch(hideAbortModal())
  }
}

export const uploadFile = file => {
  return function (dispatch, getState) {
    const state = getState()
    const currentBucket = getCurrentBucket(state)
    if (!currentBucket) {
      dispatchAlertError(dispatch, {
        message: "Please choose a bucket before trying to upload files.",
      })
      return
    }
    const currentPrefix = getCurrentPrefix(state)
    let filePath = file.path || file.name
    if (filePath.charAt(0) === "/") {
      filePath = filePath.substring(1)
    }
    const objectName = encodeURIComponent(`${currentPrefix}${filePath}`)
    const uploadUrl = `${window.location.origin}${otterioBrowserPrefix}/upload/${currentBucket}/${objectName}`
    const slug = `${currentBucket}-${currentPrefix}-${filePath}`

    const xhr = new XMLHttpRequest()
    xhr.open("PUT", uploadUrl, true)
    xhr.withCredentials = false
    const token = storage.getItem("token")
    if (token) {
      xhr.setRequestHeader("Authorization", "Bearer " + token)
    }
    xhr.setRequestHeader(
      "x-amz-date",
      dayjs.utc().format("YYYYMMDDTHHmmss") + "Z"
    )

    dispatch(addUpload(xhr, slug, file.size, file.name))

    xhr.onload = function () {
      if (xhr.status === 401 || xhr.status === 403) {
        dispatch(hideAbortModal())
        dispatch(stop(slug))
        dispatchAlertError(dispatch, { message: "Unauthorized request." })
      }
      if (xhr.status === 500) {
        dispatch(hideAbortModal())
        dispatch(stop(slug))
        dispatchAlertError(dispatch, { message: xhr.responseText })
      }
      if (xhr.status === 200) {
        dispatch(hideAbortModal())
        dispatch(stop(slug))
        dispatchAlertSuccess(
          dispatch,
          `File '${filePath}' uploaded successfully.`
        )
        dispatch(objectsActions.selectPrefix(currentPrefix))
      }
    }

    xhr.upload.addEventListener("error", () => {
      dispatch(stop(slug))
      dispatchAlertError(dispatch, {
        message: `Error occurred uploading '${filePath}'.`,
      })
    })

    xhr.upload.addEventListener("progress", event => {
      if (event.lengthComputable) {
        dispatch(updateProgress(slug, event.loaded))
      }
    })

    xhr.send(file)
  }
}
