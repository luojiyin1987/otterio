/*
 * MinIO Cloud Storage (C) 2019 MinIO, Inc.
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
import { Navigate, useLocation } from "react-router-dom"
import qs from "query-string"
import storage from "local-storage-fallback"
import { jwtDecode } from "jwt-decode"
import Alert from "../alert/Alert"
import * as actionsAlert from "../alert/actions"
import InputGroup from "./InputGroup"
import web from "../web"
import { getRandomString } from "../utils"
import { buildOpenIDAuthURL, OPEN_ID_NONCE_KEY } from "./utils"
import logo from "../../img/logo.png"

export const OpenIDLogin = () => {
  const [clientID, setClientID] = useState("")
  const [discoveryDoc, setDiscoveryDoc] = useState({})

  const dispatch = useDispatch()
  const location = useLocation()
  const alert = useSelector(state => state.alert)

  const showAlert = (type, message) =>
    dispatch(actionsAlert.set({ type, message }))
  const clearAlert = () => dispatch(actionsAlert.clear())

  // Pull the discovery doc + apply the "is-guest" body class on first mount.
  useEffect(() => {
    clearAlert()
    document.body.classList.add("is-guest")
    web.GetDiscoveryDoc().then(({ DiscoveryDoc }) => {
      setDiscoveryDoc(DiscoveryDoc || {})
    })
    return () => {
      document.body.classList.remove("is-guest")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // On (re)entry, parse the auth code/error coming back from the OpenID
  // provider and finish the STS login if appropriate. Triggered by changes
  // to location.hash so the user can re-arrive on this page mid-flow.
  useEffect(() => {
    const values = qs.parse(location.hash)
    if (values.error) {
      showAlert("danger", values.error_description)
      return
    }

    if (values.id_token) {
      const tokenJSON = jwtDecode(values.id_token)
      if (storage.getItem(OPEN_ID_NONCE_KEY) !== tokenJSON.nonce) {
        showAlert("danger", "Invalid auth token")
        return
      }

      web.LoginSTS({ token: values.id_token }).then(() => {
        storage.removeItem(OPEN_ID_NONCE_KEY)
        // Force navigation so the LoggedIn check below re-runs.
        window.location.hash = ""
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.hash])

  const handleSubmit = event => {
    event.preventDefault()
    if (clientID === "") {
      showAlert("danger", "Client ID cannot be empty")
      return
    }

    if (discoveryDoc && discoveryDoc.authorization_endpoint) {
      const redirectURI = window.location.href.split("#")[0]

      // Store nonce in localstorage to check again after the redirect
      const nonce = getRandomString(16)
      storage.setItem(OPEN_ID_NONCE_KEY, nonce)

      const authURL = buildOpenIDAuthURL(
        discoveryDoc.authorization_endpoint,
        discoveryDoc.scopes_supported,
        redirectURI,
        clientID,
        nonce
      )
      window.location = authURL
    }
  }

  if (web.LoggedIn()) {
    return <Navigate to="/" replace />
  }

  const alertBox = alert && alert.message ? (
    <Alert {...alert} onDismiss={clearAlert} />
  ) : null

  return (
    <div className="login">
      {alertBox}
      <div className="l-wrap">
        <form onSubmit={handleSubmit}>
          <InputGroup
            value={clientID}
            onChange={e => setClientID(e.target.value)}
            className="ig-dark"
            label="Client ID"
            id="clientID"
            name="clientID"
            type="text"
            spellCheck="false"
            required="required"
          />
          <button className="lw-btn" type="submit">
            <i className="fas fa-sign-in-alt" />
          </button>
        </form>
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

export default OpenIDLogin
