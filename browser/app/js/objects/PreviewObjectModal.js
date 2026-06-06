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

import React, { useEffect, useState } from "react"
import { Modal, ModalHeader, ModalBody } from "react-bootstrap"

const PreviewObjectModal = ({ object, hidePreviewModal, getObjectURL }) => {
  const [url, setUrl] = useState("")

  useEffect(() => {
    getObjectURL(object.name, setUrl)
  }, [object.name, getObjectURL])

  return (
    <Modal show={true} animation={false} onHide={hidePreviewModal} size="lg">
      <ModalHeader>Preview</ModalHeader>
      <ModalBody>
        <div className="input-group">
          {url && (
            <object
              data={url}
              style={{ display: "block", width: "100%" }}
            >
              <h3
                style={{
                  textAlign: "center",
                  display: "block",
                  width: "100%",
                }}
              >
                Do not have read permissions to preview "{object.name}"
              </h3>
            </object>
          )}
        </div>
      </ModalBody>
      <div className="modal-footer">
        <button className="btn btn-link" onClick={hidePreviewModal}>
          Cancel
        </button>
      </div>
    </Modal>
  )
}

export default PreviewObjectModal
