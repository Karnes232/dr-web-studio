import { client } from "@/sanity/lib/client"

export const contentStatusQuery = `
  *[_type == "contentStatus"][0] {
    title,
    description,
    contentOptions[] {
      value,
      label,
      description
    }
  }
`

export async function getContentStatus(): Promise<ContentStatus> {
  return client.fetch(contentStatusQuery)
}

export interface ContentStatus {
  title: {
    en: string
    es: string
  }
  description: {
    en: string
    es: string
  }
  contentOptions: {
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
