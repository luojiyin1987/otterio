/*
 * MinIO Cloud Storage (C) 2016 MinIO, Inc.
 * Modifications and additions (C) 2025-2026 soulteary, https://github.com/soulteary/otterio
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import { configureStore as rtkConfigureStore } from "@reduxjs/toolkit"
import reducer from "../reducers"

// RTK's configureStore wires up redux-thunk and a redux-devtools-extension
// hook automatically. The uploads slice holds non-serializable XMLHttpRequest
// refs via thunk closures (see uploads/actions.js) and dispatches actions
// referencing them indirectly, so we relax the serializable-state check to
// keep dev warnings clean.
export default function configureStore(preloadedState) {
  return rtkConfigureStore({
    reducer,
    preloadedState,
    middleware: getDefault =>
      getDefault({
        serializableCheck: false,
        immutableCheck: false,
      }),
  })
}
