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
import { Navigate, Link, useNavigate } from "react-router-dom"
import Alert from "../alert/Alert"
import * as actionsAlert from "../alert/actions"
import InputGroup from "./InputGroup"
import web from "../web"
import OpenIDLoginButton from "./OpenIDLoginButton"
import logo from "../../img/logo.png"

export const Login = () => {
  const [accessKey, setAccessKey] = useState("")
  const [secretKey, setSecretKey] = useState("")
  const [discoveryDoc, setDiscoveryDoc] = useState({})
  const [clientId, setClientId] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const alert = useSelector(state => state.alert)

  const showAlert = (type, message) =>
    dispatch(actionsAlert.set({ type, message }))
  const clearAlert = () => dispatch(actionsAlert.clear())

  // Mount: clear stale alert + toggle the body class used by login layout.
  // Discovery doc is fetched separately on the same mount tick.
  useEffect(() => {
    clearAlert()
    document.body.classList.add("is-guest")
    web.GetDiscoveryDoc().then(({ DiscoveryDoc, clientId: cid }) => {
      setClientId(cid || "")
      setDiscoveryDoc(DiscoveryDoc || {})
    })
    return () => {
      document.body.classList.remove("is-guest")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = event => {
    event.preventDefault()
    let message = ""
    if (accessKey === "") {
      message = "Access Key cannot be empty"
    }
    if (secretKey === "") {
      message = "Secret Key cannot be empty"
    }
    if (message) {
      showAlert("danger", message)
      return
    }
    web
      .Login({ username: accessKey, password: secretKey })
      .then(() => {
        clearAlert()
        navigate("/")
      })
      .catch(e => showAlert("danger", e.message))
  }

  if (web.LoggedIn()) {
    return <Navigate to="/" replace />
  }

  const alertBox = alert && alert.message ? (
    <Alert {...alert} onDismiss={clearAlert} />
  ) : null

  const showOpenID = Boolean(
    discoveryDoc && discoveryDoc.authorization_endpoint
  )

  return (
    <div className="login">
      {alertBox}
      <div className="l-wrap">
        <form onSubmit={handleSubmit}>
          <InputGroup
            value={accessKey}
            onChange={e => setAccessKey(e.target.value)}
            className="ig-dark"
            label="Access Key"
            id="accessKey"
            name="username"
            type="text"
            spellCheck="false"
            required="required"
            autoComplete="username"
          />
          <InputGroup
            value={secretKey}
            onChange={e => setSecretKey(e.target.value)}
            className="ig-dark"
            label="Secret Key"
            id="secretKey"
            name="password"
            type="password"
            spellCheck="false"
            required="required"
          />
          <button className="lw-btn" type="submit">
            <i className="fas fa-sign-in-alt" />
          </button>
        </form>
        {showOpenID && (
          <div className="openid-login">
            <div className="or">or</div>
            {clientId ? (
              <OpenIDLoginButton
                className="btn openid-btn"
                clientId={clientId}
                authEp={discoveryDoc.authorization_endpoint}
                authScopes={discoveryDoc.scopes_supported}
              >
                Log in with OpenID
              </OpenIDLoginButton>
            ) : (
              <Link to="/login/openid" className="btn openid-btn">
                Log in with OpenID
              </Link>
            )}
          </div>
        )}
      </div>
      <div className="l-footer">
        <a className="lf-logo" href="">
          <img src={logo} alt="OtterIO" />
        </a>
        <div className="lf-server">{window.location.host}</div>
      </div>
    </div>
  )
}

export default Login
