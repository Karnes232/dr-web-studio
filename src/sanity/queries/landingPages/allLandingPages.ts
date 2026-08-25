import { cache } from "react"
import { client } from "@/sanity/lib/client"
import { landingPageProjection } from "./landingPage"
import type { RawLandingPage } from "./landingPage"

export const allLandingPagesQuery = `
*[_type == "landingPage"] | order(slug.current asc) ${landingPageProjection}
`

/** All landing-page docs (raw, both locales), keyed by slug. Consumers pick a
 *  locale via transformLandingPage from landingPage.ts. */
export const getAllLandingPages = cache(
  async (): Promise<Map<string, RawLandingPage>> => {
    const docs: (RawLandingPage & { slug?: string })[] =
      await client.fetch(allLandingPagesQuery)
    return new Map(
      (docs ?? []).filter(d => d.slug).map(d => [d.slug as string, d]),
    )
  },
)

// ── sitemap ─────────────────────────────────────────────────────────────────
// Deliberately NOT the full landingPageProjection: sitemap.ts only needs the
// slug and the edit timestamp, and that projection pulls the entire page body.
export const landingPagesSitemapQuery = `*[_type == "landingPage"] {
  "slug": slug.current,
  _updatedAt
}`

export interface LandingPageSitemap {
  slug: string | null
  _updatedAt: string
}

/** Slug + `_updatedAt` for every landing page, so sitemap.ts can give these
 *  routes a real lastmod instead of a hand-maintained date. */
export const getLandingPagesSitemap = cache(
  async (): Promise<LandingPageSitemap[]> => {
    return await client.fetch(landingPagesSitemapQuery)
  },
)
