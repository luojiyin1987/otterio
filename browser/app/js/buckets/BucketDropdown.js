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
import { useDispatch } from "react-redux"
import { Dropdown } from "react-bootstrap"
import * as actionsBuckets from "./actions"
import { CaretlessToggle } from "../utils/dropdownToggle"

export const BucketDropdown = ({ bucket }) => {
  const [show, setShow] = useState(false)
  const dispatch = useDispatch()

  const toggleDropdown = () => setShow(prev => !prev)

  return (
    <Dropdown
      show={show}
      onToggle={toggleDropdown}
      className="bucket-dropdown"
      align="end"
    >
      <Dropdown.Toggle as={CaretlessToggle} className="dropdown-toggle">
        <i className="fas fa-ellipsis-v" />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <li className="dropdown-item-wrap">
          <a
            className="dropdown-item"
            onClick={e => {
              e.stopPropagation()
              toggleDropdown()
              dispatch(actionsBuckets.showBucketPolicy())
            }}
          >
            Edit policy
          </a>
        </li>
        <li className="dropdown-item-wrap">
          <a
            className="dropdown-item"
            onClick={e => {
              e.stopPropagation()
              toggleDropdown()
              dispatch(actionsBuckets.deleteBucket(bucket))
            }}
          >
            Delete
          </a>
        </li>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default BucketDropdown
