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

import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import classNames from "classnames"
import { jwtDecode } from "jwt-decode"
import { Modal, ModalBody, ModalHeader } from "react-bootstrap"
import web from "../web"
import * as alertActions from "../alert/actions"
import { getRandomSecretKey } from "../utils"
import InputGroup from "./InputGroup"
import { ACCESS_KEY_MIN_LENGTH, SECRET_KEY_MIN_LENGTH } from "../constants"

export const ChangePasswordModal = ({ hideChangePassword, serverInfo }) => {
  const [currentAccessKey, setCurrentAccessKey] = useState("")
  const [currentSecretKey, setCurrentSecretKey] = useState("")
  const [currentSecretKeyVisible, setCurrentSecretKeyVisible] = useState(false)
  const [newAccessKey, setNewAccessKey] = useState("")
  const [newSecretKey, setNewSecretKey] = useState("")
  const [newSecretKeyVisible, setNewSecretKeyVisible] = useState(false)

  const dispatch = useDispatch()
  // serverInfo is passed as a prop by BrowserDropdown but we also fall back
  // to the store value so the modal works in isolation (e.g. in tests).
  const storeServerInfo = useSelector(state => state.browser.serverInfo)
  const effectiveServerInfo = serverInfo || storeServerInfo

  const showAlert = alert => dispatch(alertActions.set(alert))

  // Seed the access key inputs from the JWT subject on first mount so the
  // user only has to type the new secret key, not their existing access key.
  useEffect(() => {
    const token = jwtDecode(web.GetToken())
    setCurrentAccessKey(token.sub)
    setNewAccessKey(token.sub)
  }, [])

  const canChangePassword = () => {
    if (!effectiveServerInfo || !effectiveServerInfo.userInfo) return false
    // Password change is not allowed for temporary STS users.
    if (effectiveServerInfo.userInfo.isTempUser) return false
    // Password change is only allowed for regular (IAM) users.
    if (!effectiveServerInfo.userInfo.isIAMUser) return false
    return true
  }

  const canUpdateCredentials = () =>
    currentAccessKey.length > 0 &&
    currentSecretKey.length > 0 &&
    newAccessKey.length >= ACCESS_KEY_MIN_LENGTH &&
    newSecretKey.length >= SECRET_KEY_MIN_LENGTH

  const setAuth = () => {
    if (!canUpdateCredentials()) return
    web
      .SetAuth({ currentAccessKey, currentSecretKey, newAccessKey, newSecretKey })
      .then(() =>
        showAlert({
          type: "success",
          message: "Credentials updated successfully.",
        })
      )
      .catch(err => showAlert({ type: "danger", message: err.message }))
  }

  const generateAuth = () => {
    setNewSecretKey(getRandomSecretKey())
    setNewSecretKeyVisible(true)
  }

  if (!canChangePassword()) {
    return (
      <Modal size="sm" animation={false} show={true}>
        <ModalHeader>Change Password</ModalHeader>
        <ModalBody>
          Credentials of this user cannot be updated through OtterIO Browser.
        </ModalBody>
        <div className="modal-footer">
          <button
            id="cancel-change-password"
            className="btn btn-link"
            onClick={hideChangePassword}
          >
            Close
          </button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal size="sm" animation={false} show={true}>
      <ModalHeader>Change Password</ModalHeader>
      <ModalBody className="m-t-20">
        <div className="has-toggle-password">
          <InputGroup
            value={currentAccessKey}
            id="currentAccessKey"
            label="Current Access Key"
            name="currentAccesskey"
            type="text"
            spellCheck="false"
            required="required"
            autoComplete="false"
            align="ig-left"
            readonly={true}
          />

          <i
            onClick={() => setCurrentSecretKeyVisible(v => !v)}
            className={
              "toggle-password fas fa-eye " +
              (currentSecretKeyVisible ? "toggled" : "")
            }
          />
          <InputGroup
            value={currentSecretKey}
            onChange={e => setCurrentSecretKey(e.target.value)}
            id="currentSecretKey"
            label="Current Secret Key"
            name="currentSecretKey"
            type={currentSecretKeyVisible ? "text" : "password"}
            spellCheck="false"
            required="required"
            autoComplete="false"
            align="ig-left"
          />
        </div>

        <div className="has-toggle-password m-t-30">
          <i
            onClick={() => setNewSecretKeyVisible(v => !v)}
            className={
              "toggle-password fas fa-eye " +
              (newSecretKeyVisible ? "toggled" : "")
            }
          />
          <InputGroup
            value={newSecretKey}
            onChange={e => setNewSecretKey(e.target.value)}
            id="newSecretKey"
            label="New Secret Key"
            name="newSecretKey"
            type={newSecretKeyVisible ? "text" : "password"}
            spellCheck="false"
            required="required"
            autoComplete="false"
            align="ig-left"
          />
        </div>
      </ModalBody>
      <div className="modal-footer">
        <button
          id="generate-keys"
          className="btn btn-primary"
          onClick={generateAuth}
        >
          Generate
        </button>
        <button
          id="update-keys"
          className={classNames({
            btn: true,
            "btn-success": canUpdateCredentials(),
          })}
          disabled={!canUpdateCredentials()}
          onClick={setAuth}
        >
          Update
        </button>
        <button
          id="cancel-change-password"
          className="btn btn-link"
          onClick={hideChangePassword}
        >
          Cancel
        </button>
      </div>
    </Modal>
  )
}

export default ChangePasswordModal
