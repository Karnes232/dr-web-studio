import { client } from "@/sanity/lib/client"

export interface CustomSolutionCTAData {
  title: {
    en: string
    es: string
  }
  description: {
    en: string
    es: string
  }
  questionnaireButton: {
    en: string
    es: string
  }
  quoteButton: {
    en: string
    es: string
  }
}

const customSolutionCTAQuery = `*[_type == "customSolutionCTA"][0] {
  title,
  description,
  questionnaireButton,
  quoteButton
}`

export async function getCustomSolutionCTA(): Promise<CustomSolutionCTAData> {
  return client.fetch(customSolutionCTAQuery)
}
