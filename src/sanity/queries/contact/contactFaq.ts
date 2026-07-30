import { cache } from "react"
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

export const getContactFaqs = cache(async (): Promise<ContactFaq[]> => {
  // Plain template literal — importing the `groq` tag from next-sanity pulls
  // its visual-editing client components (@sanity/client + stega, ~57 KiB)
  // into the /contact browser bundle.
  const query = `
    *[_type == "contactFaq"] | order(order asc) {
      _id,
      _type,
      question,
      answer,
      order
    }
  `

  return await client.fetch(query)
})
