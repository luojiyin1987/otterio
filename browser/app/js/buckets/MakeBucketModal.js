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
import { Modal, ModalBody } from "react-bootstrap"
import * as actionsBuckets from "./actions"

export const MakeBucketModal = () => {
  const [bucketName, setBucketName] = useState("")
  const dispatch = useDispatch()
  const showMakeBucketModal = useSelector(
    state => state.buckets.showMakeBucketModal
  )

  const hideModal = () => {
    setBucketName("")
    dispatch(actionsBuckets.hideMakeBucketModal())
  }

  const onSubmit = e => {
    e.preventDefault()
    if (bucketName) {
      dispatch(actionsBuckets.makeBucket(bucketName))
      hideModal()
    }
  }

  return (
    <Modal
      className="modal-create-bucket"
      size="sm"
      animation={false}
      show={showMakeBucketModal}
      onHide={hideModal}
    >
      <button className="close close-alt" onClick={hideModal}>
        <span>×</span>
      </button>
      <ModalBody>
        <form onSubmit={onSubmit}>
          <div className="input-group">
            <input
              className="ig-text"
              type="text"
              placeholder="Bucket Name"
              value={bucketName}
              onChange={e => setBucketName(e.target.value)}
              autoFocus
            />
            <i className="ig-helpers" />
          </div>
        </form>
      </ModalBody>
    </Modal>
  )
}

export default MakeBucketModal
