import { client } from '@/sanity/lib/client'

interface Reason {
  title: {
    en: string
    es: string
  }
  description: {
    en: string
    es: string
  }
}

export interface WhyChooseUsData {
  title: {
    en: string
    es: string
  }
  reasons: Reason[]
}

const whyChooseUsQuery = `*[_type == "whyChooseUs"][0] {
  title,
  reasons[] {
    title,
    description
  }
}`

export async function getWhyChooseUs(): Promise<WhyChooseUsData> {
  return client.fetch(whyChooseUsQuery)
} 