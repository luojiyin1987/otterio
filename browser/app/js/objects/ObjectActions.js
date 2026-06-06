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
import { Dropdown } from "react-bootstrap"
import { CaretlessToggle } from "../utils/dropdownToggle"
import ShareObjectModal from "./ShareObjectModal"
import DeleteObjectConfirmModal from "./DeleteObjectConfirmModal"
import PreviewObjectModal from "./PreviewObjectModal"
import * as objectsActions from "./actions"
import { getDataType } from "../mime.js"
import {
  SHARE_OBJECT_EXPIRY_DAYS,
  SHARE_OBJECT_EXPIRY_HOURS,
  SHARE_OBJECT_EXPIRY_MINUTES,
} from "../constants"

export const ObjectActions = ({ object }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const dispatch = useDispatch()
  const showShareObjectModal = useSelector(
    state => state.objects.shareObject.show
  )
  const shareObjectName = useSelector(state => state.objects.shareObject.object)

  const shareObject = e => {
    e.preventDefault()
    dispatch(
      objectsActions.shareObject(
        object.name,
        SHARE_OBJECT_EXPIRY_DAYS,
        SHARE_OBJECT_EXPIRY_HOURS,
        SHARE_OBJECT_EXPIRY_MINUTES
      )
    )
  }

  const handleDownload = e => {
    e.preventDefault()
    dispatch(objectsActions.downloadObject(object.name))
  }

  const deleteObject = () => {
    dispatch(objectsActions.deleteObject(object.name))
  }

  const getObjectURL = (name, callback) => {
    dispatch(objectsActions.getObjectURL(name, callback))
  }

  return (
    <Dropdown>
      <Dropdown.Toggle as={CaretlessToggle} className="fia-toggle" />
      <Dropdown.Menu>
        <a href="" className="fiad-action" title="Share" onClick={shareObject}>
          <i className="fas fa-share-alt" />
        </a>
        {getDataType(object.name, object.contentType) === "image" && (
          <a
            href=""
            className="fiad-action"
            title="Preview"
            onClick={e => {
              e.preventDefault()
              setShowPreview(true)
            }}
          >
            <i className="far fa-file-image" />
          </a>
        )}
        <a
          href=""
          className="fiad-action"
          title="Download"
          onClick={handleDownload}
        >
          <i className="fas fa-cloud-download-alt" />
        </a>
        <a
          href=""
          className="fiad-action"
          title="Delete"
          onClick={e => {
            e.preventDefault()
            setShowDeleteConfirmation(true)
          }}
        >
          <i className="fas fa-trash-alt" />
        </a>
      </Dropdown.Menu>
      {showShareObjectModal && shareObjectName === object.name && (
        <ShareObjectModal object={object} />
      )}
      {showDeleteConfirmation && (
        <DeleteObjectConfirmModal
          deleteObject={deleteObject}
          hideDeleteConfirmModal={() => setShowDeleteConfirmation(false)}
        />
      )}
      {showPreview && (
        <PreviewObjectModal
          object={object}
          hidePreviewModal={() => setShowPreview(false)}
          getObjectURL={getObjectURL}
        />
      )}
    </Dropdown>
  )
}

export default ObjectActions
