/*
 * MinIO Cloud Storage (C) 2020 MinIO, Inc.
 * Modifications and additions (C) 2025-2026 soulteary, https://github.com/soulteary/otterio
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { Dropdown } from "react-bootstrap"
import { CaretlessToggle } from "../utils/dropdownToggle"
import DeleteObjectConfirmModal from "./DeleteObjectConfirmModal"
import * as actions from "./actions"

export const PrefixActions = ({ object }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const dispatch = useDispatch()

  return (
    <Dropdown>
      <Dropdown.Toggle as={CaretlessToggle} className="fia-toggle" />
      <Dropdown.Menu>
        <a
          href=""
          className="fiad-action"
          title="Download as zip"
          onClick={e => {
            e.preventDefault()
            dispatch(actions.downloadPrefix(object.name))
          }}
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
      {showDeleteConfirmation && (
        <DeleteObjectConfirmModal
          deleteObject={() => dispatch(actions.deleteObject(object.name))}
          hideDeleteConfirmModal={() => setShowDeleteConfirmation(false)}
        />
      )}
    </Dropdown>
  )
}

export default PrefixActions
