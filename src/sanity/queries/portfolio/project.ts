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

// Locale-resolved shape for client components: the flight payload only carries
// the active language's strings instead of the full { en, es } pairs.
export interface LocalizedOutcome {
  metric: string
  value: string
}

export interface LocalizedProject {
  _id: string
  title: string
  client: string
  category: string
  image: Project["image"]
  technologies: string[]
  problem: string
  outcomes: LocalizedOutcome[]
}

export function localizeProject(
  project: Project,
  lang: "en" | "es",
): LocalizedProject {
  return {
    _id: project._id,
    title: project.title[lang],
    client: project.client,
    category: project.category[lang],
    image: project.image,
    technologies: project.technologies,
    problem: project.problem[lang],
    outcomes: (project.outcomes ?? []).map(o => ({
      metric: o.metric[lang],
      value: o.value,
    })),
  }
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
