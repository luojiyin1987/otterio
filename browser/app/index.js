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

import "./less/main.less"
// Pull only the icon families this project actually uses (fas/fab/far),
// instead of all.css which bundles all 5 free families and 2MB+ of fonts.
import "@fortawesome/fontawesome-free/css/fontawesome.css"
import "@fortawesome/fontawesome-free/css/solid.css"
import "@fortawesome/fontawesome-free/css/regular.css"
import "@fortawesome/fontawesome-free/css/brands.css"

import React from "react"
import { createRoot } from "react-dom/client"
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom"
import { Provider } from "react-redux"

import history from "./js/history"
import configureStore from "./js/store/configure-store"
import hideLoader from "./js/loader"
import App from "./js/App"
import { otterioBrowserPrefix } from "./js/constants"

const store = configureStore()

const root = createRoot(document.getElementById("root"))
root.render(
  <Provider store={store}>
    <HistoryRouter
      history={history}
      basename={otterioBrowserPrefix}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <App />
    </HistoryRouter>
  </Provider>
)

hideLoader()
