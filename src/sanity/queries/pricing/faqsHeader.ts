import { cache } from "react"
import { client } from "@/sanity/lib/client"

export interface FAQsHeaderData {
  title: {
    en: string
    es: string
  }
  subtitle: {
    en: string
    es: string
  }
}

const faqsHeaderQuery = `*[_type == "faqsHeader"][0] {
  title,
  subtitle
}`

export const getFAQsHeader = cache(async (): Promise<FAQsHeaderData> => {
  return client.fetch(faqsHeaderQuery)
})
