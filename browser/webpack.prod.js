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
const TerserPlugin = require("terser-webpack-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const common = require("./webpack.common.js")

module.exports = merge(common, {
  mode: "production",
  output: {
    path: path.resolve(__dirname, "production"),
    filename: "index_bundle.js",
    // The browser is mounted under /otterio/ (see otterioReservedBucketPath
    // on the Go side); making this explicit ensures url() references inside
    // the extracted CSS resolve correctly from any SPA route.
    publicPath: "/otterio/",
    clean: true,
  },
  optimization: {
    // Keep the output as a single index_bundle.js (no *.LICENSE.txt sidecar)
    // and a single index_bundle.css; the Go side embeds these by exact name
    // so chunk splitting / contenthash are intentionally avoided here.
    minimize: true,
    minimizer: [
      new TerserPlugin({ extractComments: false }),
      new CssMinimizerPlugin(),
    ],
  },
})
