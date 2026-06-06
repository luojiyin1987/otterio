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

import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as actions from "./actions"
import { getCheckedList } from "./selectors"
import DeleteObjectConfirmModal from "./DeleteObjectConfirmModal"

export const ObjectsBulkActions = () => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const dispatch = useDispatch()
  const checkedObjects = useSelector(getCheckedList)

  const clearChecked = () => dispatch(actions.resetCheckedList())

  const handleDownload = () => {
    if (checkedObjects.length === 1 && !checkedObjects[0].endsWith("/")) {
      dispatch(actions.downloadObject(checkedObjects[0]))
      clearChecked()
    } else {
      dispatch(actions.downloadCheckedObjects())
    }
  }

  const deleteChecked = () => {
    dispatch(actions.deleteCheckedObjects())
    setShowDeleteConfirmation(false)
  }

  return (
    <div
      className={
        "list-actions" +
        (checkedObjects.length > 0 ? " list-actions-toggled" : "")
      }
    >
      <span className="la-label">
        <i className="fas fa-check-circle" /> {checkedObjects.length}
        {checkedObjects.length === 1 ? " Object " : " Objects "}
        selected
      </span>
      <span className="la-actions pull-right">
        <button id="download-checked" onClick={handleDownload}>
          {" "}
          Download
          {checkedObjects.length === 1 && !checkedObjects[0].endsWith("/")
            ? " object"
            : " all as zip"}{" "}
        </button>
      </span>
      <span className="la-actions pull-right">
        <button
          id="delete-checked"
          onClick={() => setShowDeleteConfirmation(true)}
        >
          {" "}
          Delete selected{" "}
        </button>
      </span>
      <i
        className="la-close fas fa-times"
        id="close-bulk-actions"
        onClick={clearChecked}
      />
      {showDeleteConfirmation && (
        <DeleteObjectConfirmModal
          deleteObject={deleteChecked}
          hideDeleteConfirmModal={() => setShowDeleteConfirmation(false)}
        />
      )}
    </div>
  )
}

export default ObjectsBulkActions
