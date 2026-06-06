/*
 * Modifications and additions (C) 2025-2026 soulteary, https://github.com/soulteary/otterio
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

// removeFromList returns a new array with the first item matching `predicate`
// removed, or the original reference if nothing matched. Replaces the nearly
// identical removeBucket / removeObject helpers that lived inside the
// per-slice reducers.
export const removeFromList = (list, predicate) => {
  const idx = list.findIndex(predicate)
  if (idx === -1) {
    return list
  }
  return [...list.slice(0, idx), ...list.slice(idx + 1)]
}
