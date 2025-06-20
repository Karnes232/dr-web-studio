import { groq } from "next-sanity"
import { client } from "@/sanity/lib/client"

export interface ContactFaq {
  _id: string
  _type: "contactFaq"
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

export const getContactFaqs = async (): Promise<ContactFaq[]> => {
  const query = groq`
    *[_type == "contactFaq"] | order(order asc) {
      _id,
      _type,
      question,
      answer,
      order
    }
  `

  return await client.fetch(query)
} 