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

export async function getProjectPlannerHeader(): Promise<ProjectPlannerHeader> {
  return client.fetch(projectPlannerHeaderQuery)
}
