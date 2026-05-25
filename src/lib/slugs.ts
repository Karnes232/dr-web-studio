export type Locale = "en" | "es"

/** A Sanity document carrying the canonical (en) slug plus an optional Spanish slug. */
export type LocalizedSlugDoc = {
  slug: { current: string }
  slugEs?: { current: string } | null
}

/** The slug value to use in a given locale. Spanish falls back to the en slug
 *  until a `slugEs` has been entered in Sanity (so nothing 404s mid-rollout). */
export function slugForLocale(doc: LocalizedSlugDoc, locale: Locale): string {
  return locale === "es"
    ? (doc.slugEs?.current ?? doc.slug.current)
    : doc.slug.current
}

/** Both locales' slug values for a doc — used for hreflang alternates + sitemap. */
export function slugPair(doc: LocalizedSlugDoc): Record<Locale, string> {
  return { en: doc.slug.current, es: doc.slugEs?.current ?? doc.slug.current }
}
