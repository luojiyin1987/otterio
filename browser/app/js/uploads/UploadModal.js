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
import { filesize } from "filesize"
import { ProgressBar } from "react-bootstrap"
import AbortConfirmModal from "./AbortConfirmModal"
import * as uploadsActions from "./actions"

export const UploadModal = () => {
  const dispatch = useDispatch()
  const uploads = useSelector(state => state.uploads.files)
  const showAbort = useSelector(state => state.uploads.showAbortModal)

  if (showAbort) {
    return <AbortConfirmModal />
  }

  const slugs = Object.keys(uploads)
  if (slugs.length === 0) return null

  let totalLoaded = 0
  let totalSize = 0
  for (const slug of slugs) {
    totalLoaded += uploads[slug].loaded
    totalSize += uploads[slug].size
  }
  const percent = (totalLoaded / totalSize) * 100

  const text =
    "Uploading " +
    (slugs.length === 1
      ? `'${uploads[slugs[0]].name}'`
      : `files (${slugs.length})`) +
    "..."

  return (
    <div className="alert alert-info progress animated fadeInUp ">
      <button
        type="button"
        className="close"
        onClick={() => dispatch(uploadsActions.showAbortModal())}
      >
        <span>×</span>
      </button>
      <div className="text-center">
        <small>{text}</small>
      </div>
      <ProgressBar now={percent} />
      <div className="text-center">
        <small>
          {filesize(totalLoaded)} ({percent.toFixed(2)} %)
        </small>
      </div>
    </div>
  )
}

export default UploadModal
