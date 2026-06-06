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

import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { filesize } from "filesize"
import * as actionsCommon from "./actions"

export const StorageInfo = () => {
  const dispatch = useDispatch()
  const storageInfo = useSelector(state => state.browser.storageInfo)

  useEffect(() => {
    dispatch(actionsCommon.fetchStorageInfo())
  }, [dispatch])

  const used = storageInfo && storageInfo.used
  if (!used || used === 0) {
    return null
  }

  return (
    <div className="feh-used">
      <div className="fehu-chart">
        <div style={{ width: 0 }} />
      </div>
      <ul>
        <li>
          <span>Used: </span>
          {filesize(used)}
        </li>
      </ul>
    </div>
  )
}

export default StorageInfo
