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

import { createBrowserHistory } from "history"
import { otterioBrowserPrefix } from "./constants"

// We share a single history instance between React Router 6 (mounted via
// unstable_HistoryRouter in app/index.js) and the redux-thunk action
// creators that need to navigate outside a React render (login redirects,
// post-upload routing, etc.).
//
// history@5 dropped the `basename` option that history@4 used to support, but
// our app is served from a sub-path (e.g. /otterio). Calls like
// `history.push("/login")` therefore have to be rewritten to /<prefix>/login,
// otherwise the React Router (mounted with the same basename) would match
// nothing and render a blank page.
//
// We wrap the underlying history object so that push/replace/createHref
// transparently prepend the prefix when the caller provides an in-app path,
// while listeners and the live `location` keep returning the raw pathname --
// which is what HistoryRouter feeds back into Router so it can strip the
// basename itself.
const baseHistory = createBrowserHistory()
const basename = otterioBrowserPrefix || ""

const withBase = (to) => {
  if (!basename) return to
  if (typeof to === "string") {
    if (!to.startsWith("/")) return to
    if (to === basename || to.startsWith(basename + "/")) return to
    return basename + to
  }
  if (to && typeof to === "object" && typeof to.pathname === "string") {
    return { ...to, pathname: withBase(to.pathname) }
  }
  return to
}

const history = {
  get action() {
    return baseHistory.action
  },
  get location() {
    return baseHistory.location
  },
  createHref: (to) => baseHistory.createHref(withBase(to)),
  push: (to, state) => baseHistory.push(withBase(to), state),
  replace: (to, state) => baseHistory.replace(withBase(to), state),
  go: (n) => baseHistory.go(n),
  back: () => baseHistory.back(),
  forward: () => baseHistory.forward(),
  listen: (listener) => baseHistory.listen(listener),
  block: (blocker) => baseHistory.block(blocker),
}

export default history
