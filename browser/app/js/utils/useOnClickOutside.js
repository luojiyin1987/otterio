/*
 * Modifications and additions (C) 2025-2026 soulteary, https://github.com/soulteary/otterio
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import { useEffect, useRef } from "react"

// Drop-in replacement for the abandoned react-onclickout package. Attach the
// returned ref to the element you want to "guard"; when the user clicks or
// touches anywhere outside that subtree, handler is invoked with the event.
export default function useOnClickOutside(handler) {
  const ref = useRef(null)

  useEffect(() => {
    const listener = event => {
      const el = ref.current
      if (!el || el.contains(event.target)) {
        return
      }
      handler(event)
    }

    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)

    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [handler])

  return ref
}
