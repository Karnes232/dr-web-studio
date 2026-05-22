import { cache } from "react"
import { client } from "@/sanity/lib/client"

interface Approach {
  title: {
    en: string
    es: string
  }
  description: {
    en: string
    es: string
  }
  iconName: string
}

interface DevelopmentApproachData {
  title: {
    en: string
    es: string
  }
  approaches: Approach[]
}

export const developmentApproachQuery = `*[_type == "developmentApproach"][0] {
  title {
    en,
    es
  },
  approaches[] {
    title {
      en,
      es
    },
    description {
      en,
      es
    },
    iconName
  }
}`

export const getDevelopmentApproach = cache(
  async (): Promise<DevelopmentApproachData> => {
    return client.fetch(developmentApproachQuery)
  },
)
