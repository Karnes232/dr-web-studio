"use client"

import { useEffect } from "react"

const GA_MEASUREMENT_ID = "G-Y3DMZHFV9Z"
const AHREFS_KEY = "1+Xtrpxb01gBoWyKHrpzhQ"
const FALLBACK_DELAY_MS = 5000

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

export default function DeferredAnalytics() {
  useEffect(() => {
    let loaded = false
    const events = ["scroll", "click", "touchstart", "keydown"] as const

    const load = () => {
      if (loaded) return
      loaded = true

      window.dataLayer = window.dataLayer || []
      function gtag(...args: unknown[]) {
        window.dataLayer!.push(args)
      }
      gtag("js", new Date())
      gtag("config", GA_MEASUREMENT_ID)

      const gtagScript = document.createElement("script")
      gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
      gtagScript.async = true
      document.head.appendChild(gtagScript)

      const ahrefsScript = document.createElement("script")
      ahrefsScript.src = "https://analytics.ahrefs.com/analytics.js"
      ahrefsScript.dataset.key = AHREFS_KEY
      ahrefsScript.async = true
      document.head.appendChild(ahrefsScript)

      events.forEach(e => window.removeEventListener(e, load))
      clearTimeout(timeoutId)
    }

    events.forEach(e =>
      window.addEventListener(e, load, { once: true, passive: true }),
    )

    // Fallback for visitors who never interact: wait for the load event (so
    // gtag's ~160 KB parse can't land inside the LCP/TTI window on slow
    // devices — a fixed 5 s timer could), then a further idle delay.
    let timeoutId: number | undefined
    const scheduleFallback = () => {
      timeoutId = window.setTimeout(load, FALLBACK_DELAY_MS)
    }
    if (document.readyState === "complete") scheduleFallback()
    else window.addEventListener("load", scheduleFallback, { once: true })

    return () => {
      events.forEach(e => window.removeEventListener(e, load))
      window.removeEventListener("load", scheduleFallback)
      clearTimeout(timeoutId)
    }
  }, [])

  return null
}
