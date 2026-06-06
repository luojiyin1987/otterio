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
import { Routes, Route } from "react-router-dom"
import Browser from "./browser/Browser"
import Login from "./browser/Login"
import OpenIDLogin from "./browser/OpenIDLogin"

export const App = () => (
  <Routes>
    <Route path="/login/openid" element={<OpenIDLogin />} />
    <Route path="/login" element={<Login />} />
    {/* React Router 6 does not support optional path params (":bucket?"); we
        spell out both shapes instead so the same Browser handles both /
        and /:bucket/* alike. */}
    <Route path="/" element={<Browser />} />
    <Route path="/:bucket/*" element={<Browser />} />
  </Routes>
)

export default App
