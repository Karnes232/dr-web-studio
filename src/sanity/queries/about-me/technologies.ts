import { client } from "@/sanity/lib/client"

interface Technology {
      name: string
      color: string
}

interface TechnologiesData {
  title: {
    en: string
    es: string
  }
  technologies: Technology[]
}

export const technologiesQuery = `*[_type == "technologies"][0] {
  title {
    en,
    es
  },
  technologies[] {
    name,
    color
  }
}`

export async function getTechnologies(): Promise<TechnologiesData> {
  return client.fetch(technologiesQuery)
} 