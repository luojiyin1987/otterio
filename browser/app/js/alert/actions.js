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

// Action type constants kept exactly identical to the pre-RTK contract so
// existing component imports (`import * as alertActions from ...`) and the
// reducer/action tests that compare against alert/SET continue to work.
export const SET = "alert/SET"
export const CLEAR = "alert/CLEAR"

export let alertId = 0

// `set` is a thunk because it auto-dismisses non-error toasts after 5s. The
// dispatched action shape uses an `alert` field (not RTK's `payload`); the
// reducer normalizes both, see ./reducer.js.
export const set = alert => {
  const id = alertId++
  return (dispatch, getState) => {
    if (alert.type !== "danger" || alert.autoClear) {
      setTimeout(() => {
        dispatch({
          type: CLEAR,
          alert: { id },
        })
      }, 5000)
    }
    dispatch({
      type: SET,
      alert: { ...alert, id },
    })
  }
}

export const clear = () => ({ type: CLEAR })
