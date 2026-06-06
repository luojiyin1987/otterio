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
import { useSelector } from "react-redux"
import InfiniteScroll from "react-infinite-scroller"
import ObjectsList from "./ObjectsList"
import { getFilteredObjects } from "./selectors"

export const ObjectsListContainer = () => {
  const [page, setPage] = useState(1)

  const currentBucket = useSelector(state => state.buckets.currentBucket)
  const currentPrefix = useSelector(state => state.objects.currentPrefix)
  const filteredObjects = useSelector(getFilteredObjects)
  const filter = useSelector(state => state.objects.filter)
  const sortBy = useSelector(state => state.objects.sortBy)
  const sortOrder = useSelector(state => state.objects.sortOrder)
  const listLoading = useSelector(state => state.objects.listLoading)

  // Whenever the listing context (bucket/prefix/sort) changes, jump back to
  // page 1 so the user sees the top of the new list, not a paginated tail.
  useEffect(() => {
    setPage(1)
  }, [currentBucket, currentPrefix, sortBy, sortOrder, filter])

  const visibleObjects = filteredObjects.slice(0, page * 100)
  return (
    <div style={{ position: "relative" }}>
      <InfiniteScroll
        pageStart={0}
        loadMore={() => setPage(p => p + 1)}
        hasMore={filteredObjects.length > visibleObjects.length}
        useWindow={true}
        initialLoad={false}
      >
        <ObjectsList objects={visibleObjects} />
      </InfiniteScroll>
      {listLoading && <div className="loading" />}
    </div>
  )
}

export default ObjectsListContainer
