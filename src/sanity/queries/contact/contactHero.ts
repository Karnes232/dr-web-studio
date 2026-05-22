import { cache } from "react"
import { client } from "@/sanity/lib/client"

export interface ContactHeroData {
  title: {
    en: string
    es: string
  }
  highlightedText: {
    en: string
    es: string
  }
  description: {
    en: string
    es: string
  }
}

const contactHeroQuery = `*[_type == "contactHero"][0] {
  title,
  highlightedText,
  description
}`

export const getContactHero = cache(async (): Promise<ContactHeroData> => {
  return client.fetch(contactHeroQuery)
})
