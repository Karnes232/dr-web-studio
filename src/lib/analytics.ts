// GA4 event helpers.
//
// Analytics is loaded lazily by DeferredAnalytics, so events fired before
// gtag.js arrives simply queue in window.dataLayer and are processed once it
// loads. If the visitor leaves first, or blocks analytics, everything here is a
// silent no-op — nothing throws and no user flow is interrupted.
//
// Never pass PII (name, email, message body) in event params.

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

/** Matches the gtag shim in DeferredAnalytics: push the arg list onto dataLayer. */
export function gtag(...args: unknown[]): void {
  if (typeof window === "undefined") return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(args)
}

export type EventParams = Record<string, string | number | boolean | undefined>

export function trackEvent(name: string, params: EventParams = {}): void {
  gtag("event", name, params)
}

/**
 * True when the current URL carries paid/campaign attribution.
 *
 * Paid clicks have to be measured from first paint — if analytics waits for an
 * interaction, a visitor who bounces is invisible and the click is still billed.
 * Organic traffic keeps the deferred load so Core Web Vitals stay intact.
 */
export function hasCampaignParams(search: string): boolean {
  if (!search) return false
  const params = new URLSearchParams(search)
  return [
    "gclid",
    "gbraid",
    "wbraid",
    "utm_source",
    "utm_medium",
    "utm_campaign",
  ].some(key => Boolean(params.get(key)))
}
