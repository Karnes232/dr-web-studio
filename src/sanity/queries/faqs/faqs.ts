import { cache } from "react"
import { client } from "@/sanity/lib/client"

// TypeScript interfaces
export interface FaqQuestion {
  id: string
  question: {
    en: string
    es: string
  }
  answer: {
    en: string
    es: string
  }
}

export interface FaqCategory {
  _id: string
  id: string
  title: {
    en: string
    es: string
  }
  icon: string
  color: string
  questions: FaqQuestion[]
  order: number
}

export interface FaqsData {
  categories: FaqCategory[]
}

// GROQ Queries
export const faqsQuery = `
  *[_type == "faqCategory"] | order(order asc) {
    _id,
    id,
    title,
    icon,
    color,
    order,
    questions[] {
      id,
      question,
      answer
    }
  }
`

export const faqCategoryQuery = `
  *[_type == "faqCategory" && id == $categoryId][0] {
    _id,
    id,
    title,
    icon,
    color,
    order,
    questions[] {
      id,
      question,
      answer
    }
  }
`

// Fetch functions
export const getFaqs = cache(async (): Promise<FaqsData> => {
  const categories = await client.fetch<FaqCategory[]>(faqsQuery)
  return { categories }
})

export const getFaqCategory = cache(
  async (categoryId: string): Promise<FaqCategory | null> => {
    const category = await client.fetch<FaqCategory | null>(faqCategoryQuery, {
      categoryId,
    })
    return category
  },
)

export const getFaqCategories = cache(async (): Promise<FaqCategory[]> => {
  return await client.fetch<FaqCategory[]>(faqsQuery)
})
