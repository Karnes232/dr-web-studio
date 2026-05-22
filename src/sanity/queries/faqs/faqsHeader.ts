import { cache } from "react"
import { client } from "@/sanity/lib/client"

export interface FaqsHeaderData {
  title: {
    en: string
    es: string
  }
  description: {
    en: string
    es: string
  }
}

const faqsHeaderQuery = `*[_type == "faqsPageHeader"][0] {
  title,
  description
}`

export const getFaqsHeader = cache(async (): Promise<FaqsHeaderData> => {
  return client.fetch(faqsHeaderQuery)
})
