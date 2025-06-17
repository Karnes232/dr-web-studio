import { client } from "@/sanity/lib/client"

export interface Category {
  _id: string
  name: {
    en: string
    es: string
  }
  order: number
}

const categoriesQuery = `*[_type == "category"] | order(order asc) {
  _id,
  name,
  order
}`

export async function getCategories(): Promise<Category[]> {
  return client.fetch(categoriesQuery)
}
