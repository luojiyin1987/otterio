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

const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

const isProduction = process.env.NODE_ENV === "production"
const configFile = isProduction ? "webpack.prod.js" : "webpack.dev.js"

const targets = ["production", "dev"]
for (const dir of targets) {
  fs.rmSync(path.join(__dirname, dir), { recursive: true, force: true })
}

const webpackBin = path.join(__dirname, "node_modules", ".bin", "webpack")
const cmd = `"${webpackBin}" --config ${configFile}`
console.log("Running", cmd)

try {
  execSync(cmd, { stdio: "inherit", cwd: __dirname })
} catch (err) {
  process.exit(err.status || 1)
}
