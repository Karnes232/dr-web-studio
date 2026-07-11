import { cache } from "react"
import { client } from "@/sanity/lib/client"

/** Portable Text block array (loosely typed, matching the project convention). */
type PortableBlocks = unknown[]

export interface HomeIntroData {
  title: { en: string; es: string }
  body?: { en?: PortableBlocks; es?: PortableBlocks }
}

const homeIntroQuery = `*[_type == "homeIntro"][0] {
  title { en, es },
  body { en, es }
}`

export const getHomeIntro = cache(
  async (): Promise<HomeIntroData | null> => client.fetch(homeIntroQuery),
)
