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

/**
 * Build a real `Arguments` object from an array.
 *
 * This is load-bearing, not a style choice. gtag.js only treats an
 * `[object Arguments]` entry on dataLayer as a *command*; a plain `[object
 * Array]` is read as a GTM-style data push and silently ignored. Pushing
 * `["config", "G-…"]` as an array means GA4 never initialises and never sends a
 * single hit — which is exactly why this property reported "No data received
 * from your website yet" despite the tag being installed for months.
 *
 * Google's own snippet is `function gtag(){dataLayer.push(arguments)}` for this
 * reason.
 */
const capture = function (): IArguments {
  // eslint-disable-next-line prefer-rest-params
  return arguments
} as unknown as (...args: unknown[]) => IArguments

function toArguments(args: unknown[]): IArguments {
  return capture(...args)
}

/** gtag command shim — pushes a genuine Arguments object onto dataLayer. */
export function gtag(...args: unknown[]): void {
  if (typeof window === "undefined") return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(toArguments(args))
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
