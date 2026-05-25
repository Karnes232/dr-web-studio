import { getPathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { SITE_URL } from "@/lib/site"
import type { Locale } from "@/lib/slugs"

type Href = Parameters<typeof getPathname>[0]["href"]

/** Absolute, locale-correct URL for an internal pathname (or {pathname, params}). */
export function localizedUrl(href: Href, locale: Locale): string {
  return `${SITE_URL}${getPathname({ locale, href })}`
}

/**
 * Builds canonical + hreflang `alternates` for a page's `generateMetadata`.
 * `hrefFor(locale)` lets dynamic pages supply the per-locale slug; static pages
 * can ignore the arg and return a constant internal pathname.
 *
 * The canonical is always self-referential to the page's own localized URL —
 * the correct signal for a multilingual page (hreflang handles the alternate).
 * We intentionally do NOT honor Sanity `seo.canonicalUrl` overrides here: their
 * stored values are pre-localization slugs and would point canonicals at
 * redirecting URLs.
 */
export function buildAlternates({
  hrefFor,
  currentLocale,
}: {
  hrefFor: (locale: Locale) => Href
  currentLocale: Locale
}): { canonical: string; languages: Record<string, string> } {
  const languages: Record<string, string> = {}
  for (const l of routing.locales) {
    languages[l] = localizedUrl(hrefFor(l), l)
  }
  languages["x-default"] = languages[routing.defaultLocale]

  return { canonical: languages[currentLocale], languages }
}
