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

import React, { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { READ_ONLY, WRITE_ONLY, READ_WRITE } from "../constants"
import * as actionsBuckets from "./actions"
import * as actionsAlert from "../alert/actions"
import web from "../web"

export const PolicyInput = () => {
  const prefixRef = useRef(null)
  const policyRef = useRef(null)

  const dispatch = useDispatch()
  const currentBucket = useSelector(state => state.buckets.currentBucket)
  const policies = useSelector(state => state.buckets.policies)

  // Refresh the policy list on mount, and clear it on unmount so reopening
  // the dialog for a different bucket doesn't briefly flash stale entries.
  useEffect(() => {
    dispatch(actionsBuckets.fetchPolicies(currentBucket))
    return () => {
      dispatch(actionsBuckets.setPolicies([]))
    }
  }, [dispatch, currentBucket])

  const handlePolicySubmit = e => {
    e.preventDefault()
    if (prefixRef.current.value === "*") prefixRef.current.value = ""

    const policyAlreadyExists = policies.some(
      elem =>
        prefixRef.current.value === elem.prefix &&
        policyRef.current.value === elem.policy
    )
    if (policyAlreadyExists) {
      dispatch(
        actionsAlert.set({
          type: "danger",
          message: "Policy for this prefix already exists.",
        })
      )
      return
    }

    web
      .SetBucketPolicy({
        bucketName: currentBucket,
        prefix: prefixRef.current.value,
        policy: policyRef.current.value,
      })
      .then(() => {
        dispatch(actionsBuckets.fetchPolicies(currentBucket))
        prefixRef.current.value = ""
      })
      .catch(err =>
        dispatch(actionsAlert.set({ type: "danger", message: err.message }))
      )
  }

  return (
    <header className="pmb-list">
      <div className="pmbl-item">
        <input
          type="text"
          ref={prefixRef}
          className="form-control"
          placeholder="Prefix"
        />
      </div>
      <div className="pmbl-item">
        <select ref={policyRef} className="form-control">
          <option value={READ_ONLY}>Read Only</option>
          <option value={WRITE_ONLY}>Write Only</option>
          <option value={READ_WRITE}>Read and Write</option>
        </select>
      </div>
      <div className="pmbl-item">
        <button
          className="btn btn-block btn-primary"
          onClick={handlePolicySubmit}
        >
          Add
        </button>
      </div>
    </header>
  )
}

export default PolicyInput
