/*
 * Modifications and additions (C) 2025-2026 soulteary, https://github.com/soulteary/otterio
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import React from "react"

// react-bootstrap v2 removed the `noCaret` prop on <Dropdown.Toggle>. The
// recommended replacement is a custom toggle rendered via the `as` prop; this
// wrapper keeps the BS3-era look (just the icon, no chevron) without us having
// to repeat the boilerplate at every call site.
export const CaretlessToggle = React.forwardRef(
  ({ children, onClick, className }, ref) => {
    // react-bootstrap injects `dropdown-toggle` (which adds a ::after caret)
    // into the className. Append a marker class so CSS can selectively hide
    // the caret without affecting other dropdown toggles in the app.
    const composed = ["caretless-toggle", className].filter(Boolean).join(" ")
    return (
      <a
        href=""
        ref={ref}
        className={composed}
        onClick={e => {
          e.preventDefault()
          onClick && onClick(e)
        }}
      >
        {children}
      </a>
    )
  }
)

CaretlessToggle.displayName = "CaretlessToggle"
