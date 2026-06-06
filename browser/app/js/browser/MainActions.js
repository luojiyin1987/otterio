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
import { Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap"
import web from "../web"
import * as actionsBuckets from "../buckets/actions"
import * as uploadsActions from "../uploads/actions"
import { getPrefixWritable } from "../objects/selectors"
import { CaretlessToggle } from "../utils/dropdownToggle"

export const MainActions = () => {
  const dispatch = useDispatch()
  const prefixWritable = useSelector(getPrefixWritable)

  const onFileUpload = e => {
    e.preventDefault()
    const files = e.target.files
    for (let i = 0; i < files.length; i++) {
      dispatch(uploadsActions.uploadFile(files.item(i)))
    }
    e.target.value = null
  }

  const loggedIn = web.LoggedIn()
  if (!loggedIn && !prefixWritable) return null

  const uploadTooltip = <Tooltip id="tt-upload-file">Upload file</Tooltip>
  const makeBucketTooltip = (
    <Tooltip id="tt-create-bucket">Create bucket</Tooltip>
  )

  return (
    <Dropdown drop="up" className="feb-actions">
      <Dropdown.Toggle as={CaretlessToggle} className="feba-toggle">
        <span>
          <i className="fas fa-plus" />
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <OverlayTrigger placement="left" overlay={uploadTooltip}>
          <a href="#" className="feba-btn feba-upload">
            <input
              type="file"
              onChange={onFileUpload}
              style={{ display: "none" }}
              id="file-input"
              multiple={true}
            />
            <label htmlFor="file-input">
              {" "}
              <i className="fas fa-cloud-upload-alt" />{" "}
            </label>
          </a>
        </OverlayTrigger>
        {loggedIn && (
          <OverlayTrigger placement="left" overlay={makeBucketTooltip}>
            <a
              href="#"
              id="show-make-bucket"
              className="feba-btn feba-bucket"
              onClick={e => {
                e.preventDefault()
                dispatch(actionsBuckets.showMakeBucketModal())
              }}
            >
              <i className="far fa-hdd" />
            </a>
          </OverlayTrigger>
        )}
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default MainActions
