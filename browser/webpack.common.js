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
const glob = require("glob-all")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin")

// Bootstrap 3 toggles many classes at runtime via JS (modals, dropdowns,
// alerts, tooltips). PurgeCSS cannot statically infer these from JSX, so
// they must be safelisted; otherwise production CSS loses critical rules.
const purgeSafelist = [
  // Bootstrap 3 toggles many classes at runtime via JS (modals, dropdowns,
  // alerts, tooltips). PurgeCSS cannot statically infer these from JSX, so
  // they must be safelisted; otherwise production CSS loses critical rules.
  /^modal/,
  /^fade/,
  /^in$/,
  /^show$/,
  /^open$/,
  /^collapse/,
  /^dropdown/,
  /^tooltip/,
  /^popover/,
  /^alert/,
  /^close/,
  /^carousel/,
  /^active$/,
  /^disabled$/,
  /^hidden/,
  /^visible/,
  /^has-/,
  /^help-block$/,
  /^sr-only/,
  // FontAwesome 5 base classes (.fa, .fas, .far, .fab) and every fa-*
  // glyph class. We only use a small subset of glyphs today but several
  // are computed at render time (e.g. file-type icons), so it's safer to
  // keep the family intact than to enumerate them.
  /^fa(s|r|b|d|l)?$/,
  /^fa-/,
  // animation classes used by the alert component
  /^fadeInDown$/,
  /^fadeOutUp$/,
  /^animated$/,
  // BS3 float helpers re-shimmed in bs3-compat.less; only `pull-right` is
  // referenced from JSX today, but we keep both so the shim is symmetric
  // and future templates can drop in either name without a CSS rebuild.
  /^pull-(left|right)$/,
  // BS5 utility classes used by react-bootstrap internals (Modal flips
  // .modal-open on body, react-bootstrap Dropdown toggles aria states).
  /^modal-open$/,
  /^modal-static$/,
]

// FontAwesome 5 ships eot/ttf/woff/svg fallbacks for IE/iOS Safari 4. Per our
// browserslist (not IE 11), only woff2 is needed; reject the legacy URLs at
// the css-loader stage so they never become webpack assets. The filter is
// invoked with (url, resourcePath) where resourcePath is the .css importing
// the url() and url is the relative path (e.g. ../webfonts/fa-solid-900.svg).
const cssUrlFilter = (url, resourcePath) => {
  if (/[\\/]fontawesome-free[\\/]/.test(resourcePath)) {
    return /\.woff2(\?.*)?$/.test(url)
  }
  return true
}

module.exports = {
  context: __dirname,
  entry: [path.resolve(__dirname, "app/index.js")],
  resolve: {
    // webpack 5 dropped automatic node core polyfills. mime-types reaches for
    // node's 'path' module; provide the browser shim only for that.
    fallback: {
      path: require.resolve("path-browserify"),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [{ loader: "babel-loader" }],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { url: { filter: cssUrlFilter } } },
          { loader: "less-loader" },
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { url: { filter: cssUrlFilter } } },
        ],
      },
      // Fonts and bitmap images become external files so they don't blow up
      // the JS bundle as base64. SVG stays inlined since the project only
      // ships a handful of small icons and Bootstrap/FontAwesome ship their
      // glyphs as fonts, not SVG. oneOf forces first-match-wins ordering so
      // logo.png is emitted by its specific rule, not the generic png rule.
      {
        test: /\.(eot|woff|woff2|ttf)$/,
        type: "asset/resource",
        generator: { filename: "fonts/[name].[hash:8][ext]" },
      },
      {
        oneOf: [
          // logo.png is imported by 4 JS files AND referenced by absolute URL
          // from index.html / Go's specialAssets list. Emit it with its
          // original filename at the production root so JS imports resolve to
          // the same physical file (otherwise we'd get logo.png +
          // images/logo.<hash>.png as two copies of the same 1.3MB asset).
          {
            test: /logo\.png$/,
            include: path.resolve(__dirname, "app/img"),
            type: "asset/resource",
            generator: { filename: "[name][ext]" },
          },
          {
            test: /\.(png|jpe?g|gif|webp)$/,
            type: "asset/resource",
            generator: { filename: "images/[name].[hash:8][ext]" },
          },
          // FontAwesome 5 ships ~1.8MB of legacy SVG webfonts (iOS Safari 4
          // fallback) under @fortawesome/.../webfonts/. css-loader would
          // otherwise inline them as base64 data URIs and balloon the CSS by
          // ~1.8MB; emit them as separate files instead. Modern browsers
          // grab woff2/woff first and never fetch the .svg.
          {
            test: /\.svg$/,
            include: /[\\/]fontawesome-free[\\/]webfonts[\\/]/,
            type: "asset/resource",
            generator: { filename: "fonts/[name].[hash:8][ext]" },
          },
          {
            test: /\.svg$/,
            type: "asset/inline",
          },
        ],
      },
    ],
  },
  plugins: [
    // logo.png is imported by 4 JS files and now emitted via the asset rule
    // above (root-level filename), so it's no longer copied here. Favicons
    // are referenced only from the static index.html by absolute URL, so
    // they must still be copied verbatim. loader.css and index.html itself
    // are likewise static (the Go server post-processes the HTML to
    // substitute the OTTERIO_UI_VERSION placeholder at request time).
    new CopyWebpackPlugin({
      patterns: [
        { from: "app/css/loader.css" },
        { from: "app/img/favicon/favicon-16x16.png" },
        { from: "app/img/favicon/favicon-32x32.png" },
        { from: "app/img/favicon/favicon-96x96.png" },
        { from: "app/index.html" },
      ],
    }),
    new MiniCssExtractPlugin({ filename: "index_bundle.css" }),
    new PurgeCSSPlugin({
      paths: glob.sync(
        [
          path.join(__dirname, "app/index.html"),
          path.join(__dirname, "app/js/**/*.js"),
        ],
        { ignore: ["**/__tests__/**", "**/__tests___/**", "**/*.test.js"] }
      ),
      safelist: purgeSafelist,
    }),
  ],
}
