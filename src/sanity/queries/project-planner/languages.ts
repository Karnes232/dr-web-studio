import { client } from "@/sanity/lib/client"

export const languagesQuery = `
  *[_type == "languages"][0] {
    title,
    description,
    languageOptions[] {
      value,
      label
    },
    selectedLanguagesText
  }
`

export async function getLanguages(): Promise<Languages> {
  return client.fetch(languagesQuery)
}

export interface Languages {
  title: {
    en: string
    es: string
  }
  description: {
    en: string
    es: string
  }
  languageOptions: {
    value: {
      en: string
      es: string
    }
    label: {
      en: string
      es: string
    }
  }[]
  selectedLanguagesText: {
    en: string
    es: string
  }
}
