import { cache } from "react"
import { client } from "@/sanity/lib/client"

interface SectionHeaderData {
  title: {
    en: string
    es: string
  }
  description: {
    en: string
    es: string
  }
  basedOutOf: {
    en: string
    es: string
  }
}

export const sectionHeaderQuery = `*[_type == "sectionHeader"][0] {
    title {
      en,
      es
    },
    description {
      en,
      es
    },
    basedOutOf {
      en,
      es
    }
  }`

export const getSectionHeader = cache(async (): Promise<SectionHeaderData> => {
  return client.fetch(sectionHeaderQuery)
})
