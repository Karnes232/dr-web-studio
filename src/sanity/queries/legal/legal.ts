import { client } from "@/sanity/lib/client"

export const legalQuery = `*[_type == "legal" && pageName == $pageName][0] {
  pageName,
  content {
    en,
    es
  }
}`

export interface LegalData {
  pageName: string
  content: {
    en: string
    es: string
  }
}

export async function getLegal(pageName: string): Promise<LegalData | null> {
  return client.fetch(legalQuery, { pageName })
}
