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

import web from "../web"
import history from "../history"
import * as objectsActions from "../objects/actions"
import { pathSlice } from "../utils"
import {
  dispatchAlertError,
  dispatchAlertInfo,
} from "../utils/alertDispatch"

export const SET_LIST = "buckets/SET_LIST"
export const ADD = "buckets/ADD"
export const REMOVE = "buckets/REMOVE"
export const SET_FILTER = "buckets/SET_FILTER"
export const SET_CURRENT_BUCKET = "buckets/SET_CURRENT_BUCKET"
export const SHOW_MAKE_BUCKET_MODAL = "buckets/SHOW_MAKE_BUCKET_MODAL"
export const SHOW_BUCKET_POLICY = "buckets/SHOW_BUCKET_POLICY"
export const SET_POLICIES = "buckets/SET_POLICIES"

export const fetchBuckets = () => {
  return function (dispatch) {
    const { bucket, prefix } = pathSlice(history.location.pathname)
    return web
      .ListBuckets()
      .then(res => {
        const buckets = res.buckets
          ? res.buckets.map(bucket => bucket.name)
          : []
        if (buckets.length > 0) {
          dispatch(setList(buckets))
          if (bucket && buckets.indexOf(bucket) > -1) {
            dispatch(selectBucket(bucket, prefix))
          } else {
            dispatch(selectBucket(buckets[0]))
          }
        } else {
          if (bucket) {
            dispatch(setList([bucket]))
            dispatch(selectBucket(bucket, prefix))
          } else {
            dispatch(selectBucket(""))
            history.replace("/")
          }
        }
      })
      .catch(err => {
        if (
          (bucket && err.message === "Access Denied.") ||
          err.message.indexOf("Prefix access is denied") > -1
        ) {
          dispatch(setList([bucket]))
          dispatch(selectBucket(bucket, prefix))
        } else {
          dispatchAlertError(dispatch, err, { autoClear: true })
        }
      })
  }
}

export const setList = buckets => ({
  type: SET_LIST,
  buckets,
})

export const setFilter = filter => ({
  type: SET_FILTER,
  filter,
})

export const selectBucket = (bucket, prefix) => {
  return function (dispatch) {
    dispatch(setCurrentBucket(bucket))
    dispatch(objectsActions.selectPrefix(prefix || ""))
  }
}

export const setCurrentBucket = bucket => ({
  type: SET_CURRENT_BUCKET,
  bucket,
})

export const makeBucket = bucket => {
  return function (dispatch) {
    return web
      .MakeBucket({ bucketName: bucket })
      .then(() => {
        dispatch(addBucket(bucket))
        dispatch(selectBucket(bucket))
      })
      .catch(err => dispatchAlertError(dispatch, err))
  }
}

export const deleteBucket = bucket => {
  return function (dispatch) {
    return web
      .DeleteBucket({ bucketName: bucket })
      .then(() => {
        dispatchAlertInfo(dispatch, `Bucket '${bucket}' has been deleted.`)
        dispatch(removeBucket(bucket))
        dispatch(fetchBuckets())
      })
      .catch(err => dispatchAlertError(dispatch, err))
  }
}

export const addBucket = bucket => ({
  type: ADD,
  bucket,
})

export const removeBucket = bucket => ({
  type: REMOVE,
  bucket,
})

export const showMakeBucketModal = () => ({
  type: SHOW_MAKE_BUCKET_MODAL,
  show: true,
})

export const hideMakeBucketModal = () => ({
  type: SHOW_MAKE_BUCKET_MODAL,
  show: false,
})

export const fetchPolicies = bucket => {
  return function (dispatch) {
    return web
      .ListAllBucketPolicies({ bucketName: bucket })
      .then(res => {
        const policies = res.policies || []
        dispatch(setPolicies(policies))
      })
      .catch(err => dispatchAlertError(dispatch, err))
  }
}

export const setPolicies = policies => ({
  type: SET_POLICIES,
  policies,
})

export const showBucketPolicy = () => ({
  type: SHOW_BUCKET_POLICY,
  show: true,
})

export const hideBucketPolicy = () => ({
  type: SHOW_BUCKET_POLICY,
  show: false,
})
