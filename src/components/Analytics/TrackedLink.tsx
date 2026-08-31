"use client"

import { trackEvent, type EventParams } from "@/lib/analytics"
import type { AnchorHTMLAttributes, ReactNode } from "react"

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: string
  eventParams?: EventParams
  children: ReactNode
}

/**
 * Plain anchor that emits a GA4 event on click.
 *
 * Exists so server components (the landing CTAs, which are rendered on the
 * server) can still report outbound clicks. Outbound WhatsApp and tel: links
 * leave the site, so without this they are invisible to analytics entirely —
 * and WhatsApp is the primary lead path.
 *
 * Tracking never blocks navigation: the event is queued on dataLayer
 * synchronously and the browser follows the href as normal.
 */
export default function TrackedLink({
  event,
  eventParams,
  children,
  onClick,
  ...rest
}: TrackedLinkProps) {
  return (
    <a
      {...rest}
      onClick={e => {
        trackEvent(event, eventParams)
        onClick?.(e)
      }}
    >
      {children}
    </a>
  )
}
