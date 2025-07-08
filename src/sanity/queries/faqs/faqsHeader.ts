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

export async function getFaqsHeader(): Promise<FaqsHeaderData> {
  return client.fetch(faqsHeaderQuery)
}
