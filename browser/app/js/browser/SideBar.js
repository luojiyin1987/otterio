/*
 * MinIO Cloud Storage (C) 2016, 2018 MinIO, Inc.
 * Modifications and additions (C) 2025-2026 soulteary, https://github.com/soulteary/otterio
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import React, { useCallback } from "react"
import classNames from "classnames"
import { useDispatch, useSelector } from "react-redux"
import BucketSearch from "../buckets/BucketSearch"
import BucketList from "../buckets/BucketList"
import Host from "./Host"
import * as actionsCommon from "./actions"
import web from "../web"
import useOnClickOutside from "../utils/useOnClickOutside"

export const SideBar = () => {
  const dispatch = useDispatch()
  const sidebarOpen = useSelector(state => state.browser.sidebarOpen)

  // Close the sidebar when the user clicks outside of it on small screens.
  // The .feh-trigger button toggles the sidebar from outside, so guard
  // against treating a click on that as an "outside" click.
  const handleClickOutside = useCallback(
    e => {
      if (e.target && e.target.classList.contains("feh-trigger")) return
      dispatch(actionsCommon.closeSidebar())
    },
    [dispatch]
  )
  const outsideRef = useOnClickOutside(handleClickOutside)

  return (
    <div
      ref={outsideRef}
      className={classNames({ "fe-sidebar": true, toggled: sidebarOpen })}
    >
      <div className="fes-header clearfix hidden-sm hidden-xs">
        <h2>OtterIO Browser</h2>
      </div>
      <div className="fes-list">
        {web.LoggedIn() && <BucketSearch />}
        <BucketList />
      </div>
      <Host />
    </div>
  )
}

export default SideBar
