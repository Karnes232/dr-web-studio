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
