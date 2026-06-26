import { getAllBlogPostsSitemap } from "@/sanity/queries/blog/blog"
import { getServiceItemsSitemap } from "@/sanity/queries/services/serviceItem"
import type { MetadataRoute } from "next"
import { localizedUrl } from "@/lib/urls"
import { slugPair, type Locale } from "@/lib/slugs"
import { routing } from "@/i18n/routing"

export const revalidate = 3600

type Href = Parameters<typeof localizedUrl>[0]

// Internal pathname keys included in the sitemap (both locales). Intentionally
// excludes /sitemap, /custom-payment, /payment-success (noindex / utility).
const STATIC_ROUTES: Href[] = [
  "/",
  "/about-me",
  "/blog",
  "/contact",
  "/faqs",
  "/guia-completa-desarrollo-web-moderno-negocios",
  "/desarrollo-web-republica-dominicana",
  "/diseno-web-republica-dominicana",
  "/desarrollo-web-punta-cana",
  "/desarrollo-ecommerce-republica-dominicana",
  "/mantenimiento-web-republica-dominicana",
  "/privacy-policy",
  "/terms-of-service",
  "/our-services",
  "/pricing",
  "/portfolio",
  "/project-planner",
]

// Stable lastmod for hardcoded routes. Using `new Date()` here would stamp a
// fresh timestamp on every hourly revalidate, training crawlers to ignore
// lastmod entirely. Bump this when static page copy materially changes.
// Sanity-backed routes (services, blog) use the document `_updatedAt` instead.
const STATIC_LASTMOD = new Date("2026-06-26T00:00:00.000Z")

/**
 * Build the hreflang `alternates.languages` map for a route, given a function
 * that returns the absolute URL for each locale. Emits one entry per locale
 * plus `x-default` (→ the en URL). Next.js serializes these as
 * `<xhtml:link rel="alternate" hreflang="...">` inside each `<url>` block.
 */
function languagesFor(urlForLocale: (locale: Locale) => string) {
  const languages: Record<string, string> = {}
  for (const locale of routing.locales) languages[locale] = urlForLocale(locale)
  languages["x-default"] = urlForLocale(routing.defaultLocale)
  return languages
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [serviceItems, blogPosts] = await Promise.all([
    getServiceItemsSitemap(),
    getAllBlogPostsSitemap(),
  ])
  const entries: MetadataRoute.Sitemap = []

  for (const key of STATIC_ROUTES) {
    const languages = languagesFor(locale => localizedUrl(key, locale))
    for (const locale of routing.locales) {
      entries.push({
        url: localizedUrl(key, locale),
        lastModified: STATIC_LASTMOD,
        alternates: { languages },
      })
    }
  }

  for (const item of serviceItems) {
    const pair = slugPair(item)
    const urlFor = (locale: Locale) =>
      localizedUrl(
        { pathname: "/our-services/[slug]", params: { slug: pair[locale] } },
        locale,
      )
    const languages = languagesFor(urlFor)
    for (const locale of routing.locales) {
      entries.push({
        url: urlFor(locale),
        lastModified: new Date(item._updatedAt),
        alternates: { languages },
      })
    }
  }

  for (const item of blogPosts) {
    const pair = slugPair(item)
    const urlFor = (locale: Locale) =>
      localizedUrl(
        { pathname: "/blog/[slug]", params: { slug: pair[locale] } },
        locale,
      )
    const languages = languagesFor(urlFor)
    for (const locale of routing.locales) {
      entries.push({
        url: urlFor(locale),
        lastModified: new Date(item._updatedAt),
        alternates: { languages },
      })
    }
  }

  return entries
}
