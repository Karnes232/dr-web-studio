import { client } from "@/sanity/lib/client"

export interface FAQ {
  _id: string
  question: {
    en: string
    es: string
  }
  answer: {
    en: string
    es: string
  }
  order: number
}

const faqsQuery = `*[_type == "faq"] | order(order asc) {
  _id,
  question,
  answer,
  order
}`

export async function getFAQs(): Promise<FAQ[]> {
  return client.fetch(faqsQuery)
} 