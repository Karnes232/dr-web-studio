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

const projectsQuery = `*[_type == "project"] | order(year desc) {
  _id,
  title,
  client,
  category,
  image {
    asset-> {
      url,
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

export async function getProjects(): Promise<Project[]> {
  return client.fetch(projectsQuery)
}

export async function getFeaturedProjects(): Promise<Project[]> {
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
} 