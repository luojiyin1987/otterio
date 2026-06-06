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

import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import InfiniteScroll from "react-infinite-scroller"
import * as actionsBuckets from "./actions"
import { getFilteredBuckets } from "./selectors"
import BucketContainer from "./BucketContainer"
import web from "../web"
import history from "../history"
import { pathSlice } from "../utils"

export const BucketList = () => {
  const [page, setPage] = useState(1)

  const dispatch = useDispatch()
  const filteredBuckets = useSelector(getFilteredBuckets)
  const filter = useSelector(state => state.buckets.filter)

  // Initial load: ask the API for buckets when logged in, or replay any
  // bucket+prefix already in the URL when anonymous (the public-bucket case).
  useEffect(() => {
    if (web.LoggedIn()) {
      dispatch(actionsBuckets.fetchBuckets())
    } else {
      const { bucket, prefix } = pathSlice(history.location.pathname)
      if (bucket) {
        dispatch(actionsBuckets.setList([bucket]))
        dispatch(actionsBuckets.selectBucket(bucket, prefix))
      } else {
        history.replace("/login")
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reset pagination when the search filter changes.
  useEffect(() => {
    setPage(1)
  }, [filter])

  const visibleBuckets = filteredBuckets.slice(0, page * 100)
  return (
    // react-custom-scrollbars (React 15-era, unmaintained) was previously
    // wrapping this list. Native overflow-y handles it just as well in
    // every browser we care about; the CSS class hook is kept for styling.
    <div className="fesl-inner scrollable">
      <InfiniteScroll
        pageStart={0}
        loadMore={() => setPage(p => p + 1)}
        hasMore={filteredBuckets.length > visibleBuckets.length}
        useWindow={false}
        element="div"
        initialLoad={false}
      >
        <ul>
          {visibleBuckets.map(bucket => (
            <BucketContainer key={bucket} bucket={bucket} />
          ))}
        </ul>
      </InfiniteScroll>
    </div>
  )
}

export default BucketList
