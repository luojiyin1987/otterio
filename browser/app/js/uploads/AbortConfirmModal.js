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
import { useDispatch, useSelector } from "react-redux"
import ConfirmModal from "../browser/ConfirmModal"
import * as uploadsActions from "./actions"

export const AbortConfirmModal = () => {
  const dispatch = useDispatch()
  const uploads = useSelector(state => state.uploads.files)

  const abortUploads = () => {
    for (const slug of Object.keys(uploads)) {
      dispatch(uploadsActions.abortUpload(slug))
    }
  }

  return (
    <ConfirmModal
      show={true}
      baseClass="abort-upload"
      text="Abort uploads in progress?"
      icon="fas fa-info-circle mci-amber"
      sub="This cannot be undone!"
      okText="Abort"
      okIcon="fas fa-times"
      cancelText="Upload"
      cancelIcon="fas fa-cloud-upload-alt"
      okHandler={abortUploads}
      cancelHandler={() => dispatch(uploadsActions.hideAbortModal())}
    />
  )
}

export default AbortConfirmModal
