"use client"

import { useTranslations, useLocale as useNextIntlLocale } from "next-intl"
import { getPathname } from "@/i18n/navigation"
import { slugForLocale, type LocalizedSlugDoc, type Locale } from "@/lib/slugs"

type Href = Parameters<typeof getPathname>[0]["href"]

/**
 * Compatibility hook on top of next-intl.
 *
 * - `t` / `currentLocale`: unchanged.
 * - `getLocalizedPath(path)`: returns a LOCALIZED url STRING for an internal
 *   pathname — used for runtime/Sanity-driven hrefs passed to `next/link`.
 * - `getServiceHref(doc)` / `getBlogHref(doc)`: return next-intl `<Link>` href
 *   OBJECTS with the correct per-locale slug (next-intl localizes the prefix but
 *   not the `[slug]` value, so we supply it).
 */
export function useLocale() {
  const translate = useTranslations()
  const currentLocale = useNextIntlLocale() as Locale

  return {
    currentLocale,
    t: (key: string) => translate(key),
    getLocalizedPath: (path: string) =>
      getPathname({ locale: currentLocale, href: path as Href }),
    getServiceHref: (doc: LocalizedSlugDoc) => ({
      pathname: "/our-services/[slug]" as const,
      params: { slug: slugForLocale(doc, currentLocale) },
    }),
    getBlogHref: (doc: LocalizedSlugDoc) => ({
      pathname: "/blog/[slug]" as const,
      params: { slug: slugForLocale(doc, currentLocale) },
    }),
  }
}
