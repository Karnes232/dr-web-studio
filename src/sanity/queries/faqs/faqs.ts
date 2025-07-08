import { client } from '@/sanity/lib/client'

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
export async function getFaqs(): Promise<FaqsData> {
  const categories = await client.fetch<FaqCategory[]>(faqsQuery)
  return { categories }
}

export async function getFaqCategory(categoryId: string): Promise<FaqCategory | null> {
  const category = await client.fetch<FaqCategory | null>(faqCategoryQuery, {
    categoryId
  })
  return category
}

export async function getFaqCategories(): Promise<FaqCategory[]> {
  return await client.fetch<FaqCategory[]>(faqsQuery)
} 