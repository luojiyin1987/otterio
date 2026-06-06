/*
 * Modifications and additions (C) 2025-2026 soulteary, https://github.com/soulteary/otterio
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import * as alertActions from "../alert/actions"

// dispatchAlertError centralizes the very repetitive
//   dispatch(alertActions.set({ type: 'danger', message: err.message, ... }))
// pattern that appeared in 20+ places across the action thunks. Callers can
// override or extend the alert payload via opts (e.g. autoClear).
export const dispatchAlertError = (dispatch, err, opts = {}) => {
  dispatch(
    alertActions.set({
      type: "danger",
      message: err && err.message ? err.message : String(err),
      ...opts,
    })
  )
}

export const dispatchAlertSuccess = (dispatch, message, opts = {}) => {
  dispatch(
    alertActions.set({
      type: "success",
      message,
      ...opts,
    })
  )
}

export const dispatchAlertInfo = (dispatch, message, opts = {}) => {
  dispatch(
    alertActions.set({
      type: "info",
      message,
      ...opts,
    })
  )
}
