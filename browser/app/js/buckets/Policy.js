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
import { READ_ONLY, WRITE_ONLY, READ_WRITE, NONE } from "../constants"
import * as actionsBuckets from "./actions"
import * as actionsAlert from "../alert/actions"
import web from "../web"

export const Policy = ({ policy, prefix }) => {
  const dispatch = useDispatch()
  const currentBucket = useSelector(state => state.buckets.currentBucket)

  const removePolicy = e => {
    e.preventDefault()
    web
      .SetBucketPolicy({ bucketName: currentBucket, prefix, policy: "none" })
      .then(() => dispatch(actionsBuckets.fetchPolicies(currentBucket)))
      .catch(err =>
        dispatch(actionsAlert.set({ type: "danger", message: err.message }))
      )
  }

  if (policy === NONE) {
    return null
  }

  const displayPrefix = prefix === "" ? "*" : prefix
  return (
    <div className="pmb-list">
      <div className="pmbl-item">{displayPrefix}</div>
      <div className="pmbl-item">
        <select className="form-control" disabled value={policy}>
          <option value={READ_ONLY}>Read Only</option>
          <option value={WRITE_ONLY}>Write Only</option>
          <option value={READ_WRITE}>Read and Write</option>
        </select>
      </div>
      <div className="pmbl-item">
        <button className="btn btn-block btn-danger" onClick={removePolicy}>
          Remove
        </button>
      </div>
    </div>
  )
}

export default Policy
