"use client"

import { useSyncExternalStore } from "react"
import type { Locale } from "@/lib/slugs"

// A tiny client-side store holding the current detail page's per-locale hrefs.
// next-intl localizes the route PREFIX but not the dynamic `[slug]` value, so on
// /blog/[slug] and /our-services/[slug] the language switcher can't translate the
// slug on its own (usePathname() returns the resolved path, not the template).
// Detail pages publish their per-locale slugs here via <SetLocalizedHrefs/> so
// the global switcher can navigate to the target locale's slug.

/** A next-intl href object for a localized dynamic route. */
export type LocalizedHref = { pathname: string; params: { slug: string } }
export type LocalizedHrefs = Record<Locale, LocalizedHref> | null

let current: LocalizedHrefs = null
const listeners = new Set<() => void>()

/** Publish the current page's per-locale hrefs (or `null` to clear). */
export function setLocalizedHrefs(next: LocalizedHrefs) {
  current = next
  for (const notify of listeners) notify()
}

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  return () => {
    listeners.delete(onChange)
  }
}

/** Read the current per-locale hrefs. `null` on non-detail routes (and during
 *  SSR, so the switcher falls back to its default prefix-swap behavior). */
export function useLocalizedHrefs(): LocalizedHrefs {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  )
}
