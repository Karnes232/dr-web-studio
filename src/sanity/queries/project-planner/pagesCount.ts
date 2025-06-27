import { client } from "@/sanity/lib/client"

export const pagesCountQuery = `
  *[_type == "pagesCount"][0] {
    title,
    description,
    rangeConfig,
    tip
  }
`

export interface PagesCount {
  title: {
    en: string
    es: string
  }
  description: {
    en: string
    es: string
  }
  rangeConfig: {
    min: number
    max: number
    step: number
    default: number
  }
  tip: {
    en: string
    es: string
  }
}

export async function getPagesCount(): Promise<PagesCount> {
  return client.fetch(pagesCountQuery)
}
