/*
 * MinIO Cloud Storage (C) 2016, 2017, 2018 MinIO, Inc.
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
import { Dropdown } from "react-bootstrap"
import * as browserActions from "./actions"
import web from "../web"
import history from "../history"
import AboutModal from "./AboutModal"
import ChangePasswordModal from "./ChangePasswordModal"
import { CaretlessToggle } from "../utils/dropdownToggle"
import { getCurrentTheme, toggleTheme } from "../utils/theme"

export const BrowserDropdown = () => {
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [theme, setThemeState] = useState(() => getCurrentTheme())

  const dispatch = useDispatch()
  const serverInfo = useSelector(state => state.browser.serverInfo)

  useEffect(() => {
    dispatch(browserActions.fetchServerInfo())
  }, [dispatch])

  const handleToggleTheme = e => {
    e.preventDefault()
    setThemeState(toggleTheme())
  }

  const showAbout = e => {
    e.preventDefault()
    setShowAboutModal(true)
  }
  const hideAbout = () => setShowAboutModal(false)
  const showChangePassword = e => {
    e.preventDefault()
    setShowChangePasswordModal(true)
  }
  const hideChangePassword = () => setShowChangePasswordModal(false)

  const logout = e => {
    e.preventDefault()
    web.Logout()
    history.replace("/login")
  }

  return (
    <li>
      <Dropdown align="end">
        <Dropdown.Toggle as={CaretlessToggle}>
          <i className="fas fa-bars" />
        </Dropdown.Toggle>
        <Dropdown.Menu as="ul">
          <li>
            <a href="" onClick={handleToggleTheme} id="toggle-theme">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}{" "}
              <i
                className={
                  theme === "dark" ? "fas fa-sun" : "fas fa-moon"
                }
              />
            </a>
          </li>
          <li>
            <a href="" onClick={showChangePassword}>
              Change Password <i className="fas fa-cog" />
            </a>
            {showChangePasswordModal && (
              <ChangePasswordModal
                serverInfo={serverInfo}
                hideChangePassword={hideChangePassword}
              />
            )}
          </li>
          <li>
            <a
              target="_blank"
              href="https://github.com/soulteary/otterio#readme"
            >
              Documentation <i className="fas fa-book" />
            </a>
          </li>
          <li>
            <a target="_blank" href="https://github.com/soulteary/otterio">
              GitHub <i className="fab fa-github" />
            </a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://github.com/soulteary/otterio/issues"
            >
              Get Support <i className="fas fa-question-circle" />
            </a>
          </li>
          <li>
            <a href="" id="show-about" onClick={showAbout}>
              About <i className="fas fa-info-circle" />
            </a>
            {showAboutModal && (
              <AboutModal serverInfo={serverInfo} hideAbout={hideAbout} />
            )}
          </li>
          <li>
            <a href="" id="logout" onClick={logout}>
              Logout <i className="fas fa-sign-out-alt" />
            </a>
          </li>
        </Dropdown.Menu>
      </Dropdown>
    </li>
  )
}

export default BrowserDropdown
