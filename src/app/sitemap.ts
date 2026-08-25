import type { MetadataRoute } from "next"
import { getAllBlogPostsSitemap } from "@/sanity/queries/blog/blog"
import { getServiceItemsSitemap } from "@/sanity/queries/services/serviceItem"
import { getLandingPagesSitemap } from "@/sanity/queries/landingPages/allLandingPages"
import {
  INDEXABLE_STATIC_ROUTES,
  type StaticPathname,
} from "@/lib/indexableRoutes"
import { localizedUrl } from "@/lib/urls"
import { slugPair, type Locale, type LocalizedSlugDoc } from "@/lib/slugs"
import { routing } from "@/i18n/routing"

export const revalidate = 3600

// ── lastmod for static (non-collection) routes ──────────────────────────────
// Resolution order, most trustworthy first:
//
//   1. The landing page's own Sanity `_updatedAt` (23 of the static routes are
//      `landingPage` docs, so their copy changes with no deploy at all — a
//      hardcoded date here goes stale the moment someone edits the CMS).
//   2. An explicit STATIC_LASTMOD entry, for routes with no single backing doc.
//   3. DEFAULT_STATIC_LASTMOD.
//
// Dates in STATIC_LASTMOD are fixed, never `new Date()`: a fresh timestamp on
// every hourly revalidate would train crawlers to ignore lastmod entirely. Give
// a route its own date the day its copy materially changes.
//
// The remaining entries are *composite* pages — /pricing alone renders
// pricingHeader + pricingData + faqsHeader + faq + a CTA. Deriving a real date
// would need a route→doc-type map that silently rots whenever a page gains a
// section, so these stay manual on purpose.
const DEFAULT_STATIC_LASTMOD = "2026-06-26"

const STATIC_LASTMOD: Partial<Record<StaticPathname, string>> = {
  // Composite CMS pages — both materially changed in e993d14 (2026-08-16):
  // /contact gained a visible NAP block, /pricing a fourth plan card.
  "/contact": "2026-08-16",
  "/pricing": "2026-08-16",
  // Landing pages: kept only as a fallback if the Sanity doc is missing.
  // Normally superseded by `_updatedAt` via landingLastmod below.
  "/paginas-web-para-dentistas": "2026-07-08",
  "/paginas-web-para-abogados": "2026-07-08",
  "/paginas-web-para-alquileres-vacacionales": "2026-07-08",
  "/paginas-web-para-bodas-y-eventos": "2026-07-08",
}

function staticLastmod(
  route: StaticPathname,
  landingLastmod: Map<string, Date>,
): Date {
  return (
    landingLastmod.get(route) ??
    new Date(`${STATIC_LASTMOD[route] ?? DEFAULT_STATIC_LASTMOD}T00:00:00Z`)
  )
}

// A Sanity doc as returned by the sitemap queries: localized slugs + timestamp.
type SitemapDoc = LocalizedSlugDoc & { _updatedAt: string }

// ── entry builders ──────────────────────────────────────────────────────────
/**
 * Build the hreflang `alternates.languages` map for a route. Emits one entry per
 * locale plus `x-default` (→ the default-locale URL). Next.js serializes these
 * as `<xhtml:link rel="alternate" hreflang="...">` inside each `<url>` block.
 */
function languagesFor(urlForLocale: (locale: Locale) => string) {
  const languages: Record<string, string> = {}
  for (const locale of routing.locales) languages[locale] = urlForLocale(locale)
  languages["x-default"] = urlForLocale(routing.defaultLocale)
  return languages
}

/** One sitemap `<url>` entry per locale, sharing a single hreflang alternates map. */
function localizedEntries(
  urlFor: (locale: Locale) => string,
  lastModified: Date,
): MetadataRoute.Sitemap {
  const languages = languagesFor(urlFor)
  return routing.locales.map(locale => ({
    url: urlFor(locale),
    lastModified,
    alternates: { languages },
  }))
}

/** Entries for a Sanity-backed collection whose slugs live under `[slug]`. */
function collectionEntries(
  pathname: "/our-services/[slug]" | "/blog/[slug]",
  docs: SitemapDoc[],
): MetadataRoute.Sitemap {
  return docs.flatMap(doc => {
    const pair = slugPair(doc)
    return localizedEntries(
      locale =>
        localizedUrl({ pathname, params: { slug: pair[locale] } }, locale),
      new Date(doc._updatedAt),
    )
  })
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [serviceItems, blogPosts, landingPages] = await Promise.all([
    getServiceItemsSitemap(),
    getAllBlogPostsSitemap(),
    getLandingPagesSitemap(),
  ])

  // Keyed by pathname ("/diseno-de-paginas-web-punta-cana") to match the
  // StaticPathname values in INDEXABLE_STATIC_ROUTES.
  const landingLastmod = new Map<string, Date>(
    (landingPages ?? [])
      .filter(doc => doc.slug)
      .map(doc => [`/${doc.slug}`, new Date(doc._updatedAt)]),
  )

  return [
    ...INDEXABLE_STATIC_ROUTES.flatMap(route =>
      localizedEntries(
        locale => localizedUrl(route, locale),
        staticLastmod(route, landingLastmod),
      ),
    ),
    ...collectionEntries("/our-services/[slug]", serviceItems),
    ...collectionEntries("/blog/[slug]", blogPosts),
  ]
}
