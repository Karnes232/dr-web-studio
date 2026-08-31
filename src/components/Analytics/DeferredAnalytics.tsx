"use client"

import { gtag, hasCampaignParams } from "@/lib/analytics"
import { useEffect } from "react"

const GA_MEASUREMENT_ID = "G-Y3DMZHFV9Z"
const AHREFS_KEY = "1+Xtrpxb01gBoWyKHrpzhQ"
const FALLBACK_DELAY_MS = 5000

export default function DeferredAnalytics() {
  useEffect(() => {
    let loaded = false
    // Declared before `load` so the campaign-traffic path below, which calls
    // load() immediately, can't hit the temporal dead zone on this binding.
    let timeoutId: number | undefined
    const events = ["scroll", "click", "touchstart", "keydown"] as const

    const load = () => {
      if (loaded) return
      loaded = true

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

    // Paid/campaign traffic loads immediately: the click is billed whether or
    // not the visitor interacts, so waiting would drop conversions and break
    // attribution. Organic keeps the deferred path below.
    if (hasCampaignParams(window.location.search)) {
      load()
      return
    }

    events.forEach(e =>
      window.addEventListener(e, load, { once: true, passive: true }),
    )

    // Fallback for visitors who never interact: wait for the load event (so
    // gtag's ~160 KB parse can't land inside the LCP/TTI window on slow
    // devices — a fixed 5 s timer could), then a further idle delay.
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
