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

const path = require("path")
const { merge } = require("webpack-merge")
const common = require("./webpack.common.js")

const config = merge(common, {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  output: {
    path: path.resolve(__dirname, "dev"),
    filename: "index_bundle.js",
    publicPath: "/otterio/",
    clean: true,
  },
  devServer: {
    historyApiFallback: { index: "/otterio/" },
    proxy: [
      {
        context: ["/otterio/webrpc"],
        target: "http://localhost:9000",
        secure: false,
        headers: { Host: "localhost:9000" },
      },
      {
        context: ["/otterio/upload", "/otterio/download", "/otterio/zip"],
        target: "http://localhost:9000",
        secure: false,
      },
    ],
  },
})

if (process.env.NODE_ENV === "dev") {
  config.entry = [
    "webpack-dev-server/client?http://localhost:8080",
    path.resolve(__dirname, "app/index.js"),
  ]
}

module.exports = config
