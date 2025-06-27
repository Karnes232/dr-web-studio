import { client } from "@/sanity/lib/client"

export const websiteTypeQuery = `
*[_type == "websiteType"][0]{
  _id,
  title,
  description,
  websiteTypes[] {
    value,
    label,
    description
  }
}
`
export async function getWebsiteType(): Promise<WebsiteType> {
  return client.fetch(websiteTypeQuery)
}

export interface WebsiteType {
  _id: string
  title: {
    en: string
    es: string
  }
  description: {
    en: string
    es: string
  }
  websiteTypes: {
    value: string
    label: {
      en: string
      es: string
    }
    description: {
      en: string
      es: string
    }
  }[]
}
