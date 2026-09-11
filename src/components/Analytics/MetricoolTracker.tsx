"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

const METRICOOL_HASH = "24e2974b870e5a09f75b9e774708b35c"
const TRACKER_SRC = "https://tracker.metricool.com/resources/be.js"

declare global {
  interface Window {
    beTracker?: { t: (opts: Record<string, unknown>) => void }
  }
}

/**
 * Metricool tracking.
 *
 * `be.js` is 379 bytes and its only job is to define `beTracker.t`, which fires a
 * 1×1 image beacon at tracker.metricool.com/c3po.jpg with the current URL, viewport
 * and referrer. That is cheap enough that it doesn't need the interaction-gated
 * treatment DeferredAnalytics gives gtag.js (~160 kB) — waiting for the `load` event
 * is enough to keep it clear of the LCP window, and firing that early is what keeps
 * Metricool's counts honest for visits that end in under a few seconds.
 *
 * Metricool's stock snippet only ever fires on a hard page load, so in an App Router
 * app a visitor browsing five pages registers as one. The pathname effect below fixes
 * that by re-firing on client-side navigation.
 */
export default function MetricoolTracker() {
  const pathname = usePathname()
  const injected = useRef(false)
  const firstRender = useRef(true)

  useEffect(() => {
    // StrictMode remounts this effect in dev; the script must go in once.
    if (injected.current) return
    injected.current = true

    const load = () => {
      const script = document.createElement("script")
      script.src = TRACKER_SRC
      script.async = true
      // be.js reads document.location.href at call time, so this reports whatever
      // page the visitor is on when it lands — even if they've navigated since.
      script.onload = () => window.beTracker?.t({ hash: METRICOOL_HASH })
      document.head.appendChild(script)
    }

    if (document.readyState === "complete") load()
    else window.addEventListener("load", load, { once: true })

    return () => window.removeEventListener("load", load)
  }, [])

  useEffect(() => {
    // The first pageview is sent by the onload handler above.
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    // No-ops if the visitor navigated before be.js finished loading — onload then
    // reports the current URL, so the hit isn't lost.
    window.beTracker?.t({ hash: METRICOOL_HASH })
  }, [pathname])

  return null
}
