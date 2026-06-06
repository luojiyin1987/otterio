/*
 * MinIO Cloud Storage (C) 2016, 2018, 2019 MinIO, Inc.
 * Modifications and additions (C) 2025-2026 soulteary, https://github.com/soulteary/otterio
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import React, { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { getCurrentBucket } from "../buckets/selectors"
import * as actionsObjects from "./actions"
import * as actionsBuckets from "../buckets/actions"
import useOnClickOutside from "../utils/useOnClickOutside"

export const Path = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [path, setPath] = useState("")
  const pathInputRef = useRef(null)

  const dispatch = useDispatch()
  const buckets = useSelector(state => state.buckets.list)
  const currentBucket = useSelector(getCurrentBucket)
  const currentPrefix = useSelector(state => state.objects.currentPrefix)

  const stopEditing = useCallback(() => setIsEditing(false), [])

  // Hook the editable input's outside-click handler. The ref returned by
  // useOnClickOutside is attached to the wrapping element below so that
  // clicks inside the input do not collapse edit mode.
  const outsideRef = useOnClickOutside(stopEditing)

  // After we transition into edit mode, focus the freshly-mounted input and
  // park the caret at the end of the prefilled path.
  useEffect(() => {
    if (isEditing && pathInputRef.current) {
      pathInputRef.current.focus()
      pathInputRef.current.setSelectionRange(path.length, path.length)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing])

  const bucketExists = name => buckets.includes(name)

  const onPrefixClick = (e, prefix) => {
    e.preventDefault()
    dispatch(actionsObjects.selectPrefix(prefix))
  }

  const onEditClick = e => {
    e.preventDefault()
    setPath(`${currentBucket}/${currentPrefix}`)
    setIsEditing(true)
  }

  const onKeyDown = e => {
    if (e.keyCode === 27) stopEditing()
  }

  const onSubmit = async e => {
    e.preventDefault()
    let newPath = path
    if (!newPath.endsWith("/")) newPath += "/"
    const splittedPath = newPath.split("/")
    if (splittedPath.length > 0 && splittedPath[0]) {
      const bucketName = splittedPath[0]
      const prefix = splittedPath.slice(1).join("/")
      if (!bucketExists(bucketName)) {
        await dispatch(actionsBuckets.makeBucket(bucketName))
      }
      // Re-check the (now possibly updated) list before navigating.
      if (buckets.includes(bucketName) || bucketName === currentBucket) {
        dispatch(actionsBuckets.selectBucket(bucketName, prefix))
      }
      stopEditing()
    }
  }

  const pathTooltip = (
    <Tooltip id="tt-path">Choose or create new path</Tooltip>
  )

  let pathLinks = []
  if (currentPrefix) {
    const dirPath = []
    pathLinks = currentPrefix.split("/").map((dir, i) => {
      if (!dir) return null
      dirPath.push(dir)
      const fullDirPath = dirPath.join("/") + "/"
      return (
        <span key={i}>
          <a href="" onClick={e => onPrefixClick(e, fullDirPath)}>
            {dir}
          </a>
        </span>
      )
    })
  }

  return (
    <h2>
      {isEditing ? (
        <div ref={outsideRef}>
          <form onSubmit={onSubmit}>
            <input
              className="form-control form-control--path"
              type="text"
              placeholder="Choose or create new path"
              ref={pathInputRef}
              onKeyDown={onKeyDown}
              value={path}
              onChange={e => setPath(e.target.value)}
            />
          </form>
        </div>
      ) : (
        <React.Fragment>
          <span className="main">
            <a href="" onClick={e => onPrefixClick(e, "")}>
              {currentBucket}
            </a>
          </span>
          {pathLinks}
          <OverlayTrigger placement="bottom" overlay={pathTooltip}>
            <a href="" onClick={onEditClick} className="fe-edit">
              <i className="fas fa-folder-plus" />
            </a>
          </OverlayTrigger>
        </React.Fragment>
      )}
    </h2>
  )
}

export default Path
