import { cache } from "react"
import { client } from "@/sanity/lib/client"

export const projectPlannerHeaderQuery = `
  *[_type == "projectPlannerHeader"][0] {
    title,
    description
  }
`

export interface ProjectPlannerHeader {
  title: {
    en: string
    es: string
  }
  description: {
    en: string
    es: string
  }
}

export const getProjectPlannerHeader = cache(
  async (): Promise<ProjectPlannerHeader> => {
    return client.fetch(projectPlannerHeaderQuery)
  },
)
