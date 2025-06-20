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

export async function getFAQsHeader(): Promise<FAQsHeaderData> {
  return client.fetch(faqsHeaderQuery)
} 