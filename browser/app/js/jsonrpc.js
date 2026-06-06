/*
 * Isomorphic JS client for the OtterIO/MinIO JSON-RPC API.
 * (C) 2016 MinIO, Inc.
 * Modifications and additions (C) 2025-2026 soulteary, https://github.com/soulteary/otterio
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)

// Original implementation used superagent + the legacy `url` polyfill to do
// what the browser's fetch + URL APIs do natively. Removing them trims a few
// dozen KB from the bundle and eliminates two unmaintained dependencies.

export default class JSONrpc {
  constructor(params) {
    this.endpoint = params.endpoint
    this.namespace = params.namespace
    this.version = "2.0"
    const parsed = new URL(this.endpoint)
    this.scheme = parsed.protocol.replace(/:$/, "")
    if (this.scheme !== "http" && this.scheme !== "https") {
      throw new Error("Unknown protocol: " + parsed.protocol)
    }
    this.host = parsed.hostname
    this.path = parsed.pathname + parsed.search
    this.port = parsed.port || (this.scheme === "https" ? "443" : "80")
  }

  // call('Get', { id, params: {...} }, optionalBearerToken)
  // Returns a promise resolving to a superagent-like object exposing { text }
  // so existing callers (web.js) can stay unchanged.
  async call(method, options, token) {
    options = options || {}
    if (!options.id) options.id = 1
    if (!options.params) options.params = {}

    const body = JSON.stringify({
      id: options.id,
      jsonrpc: this.version,
      params: options.params,
      method: this.namespace ? `${this.namespace}.${method}` : method,
    })

    const headers = {
      "Content-Type": "application/json",
      "x-amz-date": dayjs.utc().format("YYYYMMDDTHHmmss") + "Z",
    }
    if (token) headers.Authorization = "Bearer " + token

    const response = await fetch(this.endpoint, {
      method: "POST",
      headers,
      body,
    })

    if (!response.ok) {
      const err = new Error(`Request failed: ${response.status}`)
      err.status = response.status
      throw err
    }
    const text = await response.text()
    return { text }
  }
}
