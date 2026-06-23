import { cache } from "react"
import { client } from "@/sanity/lib/client"

export interface Outcome {
  metric: {
    en: string
    es: string
  }
  value: string
  improvement: string
}

export interface Project {
  _id: string
  title: {
    en: string
    es: string
  }
  client: string
  category: {
    en: string
    es: string
  }
  image: {
    asset: {
      url: string
      metadata?: {
        lqip?: string
      }
    }
  }
  technologies: string[]
  problem: {
    en: string
    es: string
  }
  solution: {
    en: string
    es: string
  }
  outcomes: Outcome[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  year: string
}

// Shared projection so hero / featured-work / portfolio queries return the same shape.
export const projectProjection = `{
  _id,
  title,
  client,
  category,
  image {
    asset-> {
      url,
      metadata {
        lqip
      }
    }
  },
  technologies,
  problem,
  solution,
  outcomes[] {
    metric,
    value,
    improvement
  },
  liveUrl,
  githubUrl,
  featured,
  year
}`

const projectsQuery = `*[_type == "project"] | order(year desc) ${projectProjection}`

export const getProjects = cache(async (): Promise<Project[]> => {
  return client.fetch(projectsQuery)
})

export const getFeaturedProjects = cache(async (): Promise<Project[]> => {
  return client.fetch(`*[_type == "project" && featured == true] | order(year desc) {
    _id,
    title,
    client,
    category,
    image {
      asset-> {
        _ref
      }
    },
    technologies,
    problem,
    solution,
    outcomes[] {
      metric,
      value,
      improvement
    },
    liveUrl,
    githubUrl,
    featured,
    year
  }`)
})
