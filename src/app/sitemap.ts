import { getAllBlogPostsSitemap } from "@/sanity/queries/blog/blog"
import { getServiceItemsSitemap } from "@/sanity/queries/services/serviceItem"
import type { MetadataRoute } from "next"
import { localizedUrl } from "@/lib/urls"
import { slugPair } from "@/lib/slugs"
import { routing } from "@/i18n/routing"

export const revalidate = 3600

type Href = Parameters<typeof localizedUrl>[0]

// Internal pathname keys included in the sitemap (both locales). Intentionally
// excludes /sitemap, /custom-payment, /payment-success (noindex / utility).
const STATIC_ROUTES: { key: Href; priority: number }[] = [
  { key: "/", priority: 1 },
  { key: "/about-me", priority: 0.8 },
  { key: "/blog", priority: 0.8 },
  { key: "/contact", priority: 0.8 },
  { key: "/faqs", priority: 0.8 },
  { key: "/guia-completa-desarrollo-web-moderno-negocios", priority: 0.8 },
  { key: "/desarrollo-web-republica-dominicana", priority: 0.9 },
  { key: "/diseno-web-republica-dominicana", priority: 0.9 },
  { key: "/desarrollo-web-punta-cana", priority: 0.9 },
  { key: "/desarrollo-ecommerce-republica-dominicana", priority: 0.9 },
  { key: "/mantenimiento-web-republica-dominicana", priority: 0.9 },
  { key: "/privacy-policy", priority: 0.8 },
  { key: "/terms-of-service", priority: 0.8 },
  { key: "/our-services", priority: 0.8 },
  { key: "/pricing", priority: 0.8 },
  { key: "/portfolio", priority: 0.8 },
  { key: "/project-planner", priority: 0.8 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [serviceItems, blogPosts] = await Promise.all([
    getServiceItemsSitemap(),
    getAllBlogPostsSitemap(),
  ])
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  for (const { key, priority } of STATIC_ROUTES) {
    for (const locale of routing.locales) {
      entries.push({
        url: localizedUrl(key, locale),
        lastModified: now,
        changeFrequency: "monthly",
        priority,
      })
    }
  }

  for (const item of serviceItems) {
    const pair = slugPair(item)
    for (const locale of routing.locales) {
      entries.push({
        url: localizedUrl(
          { pathname: "/our-services/[slug]", params: { slug: pair[locale] } },
          locale,
        ),
        lastModified: new Date(item._updatedAt),
        changeFrequency: "monthly",
        priority: 0.8,
      })
    }
  }

  for (const item of blogPosts) {
    const pair = slugPair(item)
    for (const locale of routing.locales) {
      entries.push({
        url: localizedUrl(
          { pathname: "/blog/[slug]", params: { slug: pair[locale] } },
          locale,
        ),
        lastModified: new Date(item._updatedAt),
        changeFrequency: "monthly",
        priority: 0.8,
      })
    }
  }

  return entries
}
