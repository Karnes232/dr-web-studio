import { cache } from "react"
import { client } from "@/sanity/lib/client"
import {
  projectProjection,
  type Project,
} from "@/sanity/queries/portfolio/project"

export interface HomeFeaturedWorkData {
  title?: { en: string; es: string }
  subtitle?: { en: string; es: string }
  projects?: Project[]
}

const homeFeaturedWorkQuery = `*[_type == "homeFeaturedWork"][0] {
  title { en, es },
  subtitle { en, es },
  projects[]-> ${projectProjection}
}`

export const getHomeFeaturedWork = cache(
  async (): Promise<HomeFeaturedWorkData | null> => {
    return client.fetch(homeFeaturedWorkQuery)
  },
)
