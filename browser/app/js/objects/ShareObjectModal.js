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

import React, { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Modal, ModalHeader, ModalBody } from "react-bootstrap"
import CopyToClipboard from "react-copy-to-clipboard"
import QRCode from "react-qr-code"
import web from "../web"
import * as objectsActions from "./actions"
import * as alertActions from "../alert/actions"
import {
  SHARE_OBJECT_EXPIRY_DAYS,
  SHARE_OBJECT_EXPIRY_HOURS,
  SHARE_OBJECT_EXPIRY_MINUTES,
} from "../constants"

const EXPIRY_RANGE = {
  days: { min: 0, max: 7 },
  hours: { min: 0, max: 23 },
  minutes: { min: 0, max: 59 },
}

export const ShareObjectModal = ({ object }) => {
  const [expiry, setExpiry] = useState({
    days: SHARE_OBJECT_EXPIRY_DAYS,
    hours: SHARE_OBJECT_EXPIRY_HOURS,
    minutes: SHARE_OBJECT_EXPIRY_MINUTES,
  })
  const inputRef = useRef(null)

  const dispatch = useDispatch()
  const shareObjectDetails = useSelector(state => state.objects.shareObject)
  const hideShareObject = () => dispatch(objectsActions.hideShareObject())

  const updateExpireValue = (param, inc) => {
    const next = { ...expiry }

    // Don't allow further increment if days is already maxed out.
    if (next.days === EXPIRY_RANGE.days.max && inc > 0) return

    const { min, max } = EXPIRY_RANGE[param]
    next[param] = next[param] + inc
    if (next[param] < min || next[param] > max) return

    if (next.days === EXPIRY_RANGE.days.max) {
      next.hours = 0
      next.minutes = 0
    } else if (next.days + next.hours + next.minutes === 0) {
      next.days = EXPIRY_RANGE.days.max
    }

    setExpiry(next)
    dispatch(
      objectsActions.shareObject(object.name, next.days, next.hours, next.minutes)
    )
  }

  const onUrlCopied = () => {
    dispatch(
      alertActions.set({ type: "success", message: "Link copied to clipboard!" })
    )
    hideShareObject()
  }

  const url = `${window.location.protocol}//${shareObjectDetails.url}`

  return (
    <Modal show={true} animation={false} onHide={hideShareObject} size="sm">
      <ModalHeader>Share Object</ModalHeader>
      <ModalBody>
        <div className="input-group copy-text">
          <QRCode value={url} size={128} />
          <label>Shareable Link</label>
          <input
            type="text"
            ref={inputRef}
            readOnly="readOnly"
            value={url}
            onClick={() => inputRef.current && inputRef.current.select()}
          />
        </div>
        {shareObjectDetails.showExpiryDate && (
          <div
            className="input-group"
            style={{ display: web.LoggedIn() ? "block" : "none" }}
          >
            <label>Expires in (Max 7 days)</label>
            <div className="set-expire">
              <ExpireStepper
                idPrefix="days"
                title="Days"
                value={expiry.days}
                min={0}
                max={7}
                onChange={inc => updateExpireValue("days", inc)}
              />
              <ExpireStepper
                idPrefix="hours"
                title="Hours"
                value={expiry.hours}
                min={0}
                max={23}
                onChange={inc => updateExpireValue("hours", inc)}
              />
              <ExpireStepper
                idPrefix="minutes"
                title="Minutes"
                value={expiry.minutes}
                min={0}
                max={59}
                onChange={inc => updateExpireValue("minutes", inc)}
              />
            </div>
          </div>
        )}
      </ModalBody>
      <div className="modal-footer">
        <CopyToClipboard text={url} onCopy={onUrlCopied}>
          <button className="btn btn-success">Copy Link</button>
        </CopyToClipboard>
        <button className="btn btn-link" onClick={hideShareObject}>
          Cancel
        </button>
      </div>
    </Modal>
  )
}

// Three identical stepper widgets (days/hours/minutes) used to live inline;
// factor them out to remove ~50 lines of repetitive JSX.
const ExpireStepper = ({ idPrefix, title, value, min, max, onChange }) => (
  <div className="set-expire-item">
    <i
      id={`increase-${idPrefix}`}
      className="set-expire-increase"
      onClick={() => onChange(1)}
    />
    <div className="set-expire-title">{title}</div>
    <div className="set-expire-value">
      <input type="number" min={min} max={max} value={value} readOnly="readOnly" />
    </div>
    <i
      id={`decrease-${idPrefix}`}
      className="set-expire-decrease"
      onClick={() => onChange(-1)}
    />
  </div>
)

export default ShareObjectModal
