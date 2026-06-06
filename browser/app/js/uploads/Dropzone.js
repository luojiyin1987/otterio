/*
 * MinIO Cloud Storage (C) 2016, 2018 MinIO, Inc.
 * Modifications and additions (C) 2025-2026 soulteary, https://github.com/soulteary/otterio
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import React from "react"
import { useDispatch } from "react-redux"
import ReactDropzone from "react-dropzone"
import * as actions from "./actions"

// Drag-and-drop landing zone. Wraps react-dropzone's render-prop API; the
// onClick override stops the wrapped child elements from triggering the file
// picker when the user clicks something nested (e.g. a button in MainContent).
export const Dropzone = ({ children }) => {
  const dispatch = useDispatch()

  const onDrop = files => {
    // FIXME: Currently you can upload multiple files, but only one abort
    // modal will be shown, and progress updates will only occur for one
    // file at a time. See #171.
    files.forEach(file => dispatch(actions.uploadFile(file)))
  }

  const baseStyle = {
    flex: "1",
    borderWidth: "0",
    borderStyle: "dashed",
    borderColor: "#fff",
  }
  const activeStyle = { borderWidth: "2px", borderColor: "#777" }
  const rejectStyle = { backgroundColor: "#ffdddd" }
  const getStyle = (isDragActive, _isDragAccept, isDragReject) => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragReject ? rejectStyle : {}),
  })

  return (
    <ReactDropzone onDrop={onDrop}>
      {({
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
      }) => (
        <div
          {...getRootProps({
            onClick: event => event.stopPropagation(),
          })}
          style={getStyle(isDragActive, isDragAccept, isDragReject)}
        >
          <input {...getInputProps()} />
          {children}
        </div>
      )}
    </ReactDropzone>
  )
}

export default Dropzone
