import { cache } from "react"
import { client } from "../lib/client"
import type { PillarPageContent } from "@/components/GuiaCompletaComponents/types"

type Lang = "en" | "es"

interface Localized<T> {
  en: T
  es: T
}

interface RawPillarPage {
  title: string
  hero: {
    headline: Localized<string>
    subheadline: Localized<string>
    stats: {
      value: string
      label: Localized<string>
    }[]
    readingTime: Localized<string>
    lastUpdated: Localized<string>
  }
  comparisonData: {
    feature: Localized<string>
    traditional: {
      value: Localized<string>
      icon: string
      description: Localized<string>
    }
    modern: {
      value: Localized<string>
      icon: string
      description: Localized<string>
    }
  }[]
  techStack: {
    name: string
    category: "frontend" | "backend" | "database" | "devops" | "tools"
    description: Localized<string>
    icon: string
    benefits: Localized<string[]>
    useCases: Localized<string[]>
    popularity?: number
  }[]
  caseStudies: {
    caseId: string
    client: string
    industry: Localized<string>
    logo: {
      asset: {
        url: string
        metadata: {
          dimensions: {
            width: number
            height: number
          }
        }
      }
    }
    challenge: Localized<string>
    solution: Localized<string[]>
    results: {
      metric: Localized<string>
      before: Localized<string>
      after: Localized<string>
      improvement: Localized<string>
    }[]
    technologies: string[]
    timeline: Localized<string>
    testimonial?: {
      quote: Localized<string>
      author: Localized<string>
      role: Localized<string>
    }
  }[]
  processSteps: {
    step: number
    stepTitle: Localized<string>
    description: Localized<string>
    duration: Localized<string>
    deliverables: Localized<string[]>
    icon: string
  }[]
  faqs: {
    question: Localized<string>
    answer: Localized<string>
  }[]
  structuredData: Localized<string>
}

export const pillarPageQuery = `
*[_type == "pillarPage"][0] {
  title,
  hero {
    headline { en, es },
    subheadline { en, es },
    stats[] {
      value,
      label { en, es }
    },
    readingTime { en, es },
    lastUpdated { en, es }
  },
  comparisonData[] {
    feature { en, es },
    traditional {
      value { en, es },
      icon,
      description { en, es }
    },
    modern {
      value { en, es },
      icon,
      description { en, es }
    }
  },
  techStack[] {
    name,
    category,
    description { en, es },
    icon,
    benefits { en, es },
    useCases { en, es },
    popularity
  },
  caseStudies[] {
    caseId,
    client,
    industry { en, es },
    logo {
      asset -> {
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      }
    },
    challenge { en, es },
    solution { en, es },
    results[] {
      metric { en, es },
      before { en, es },
      after { en, es },
      improvement { en, es }
    },
    technologies,
    timeline { en, es },
    testimonial {
      quote { en, es },
      author { en, es },
      role { en, es }
    }
  },
  processSteps[] {
    step,
    stepTitle { en, es },
    description { en, es },
    duration { en, es },
    deliverables { en, es },
    icon
  },
  faqs[] {
    question { en, es },
    answer { en, es }
  },
  structuredData { en, es }
}`

function pick<T>(obj: Localized<T> | undefined | null, lang: Lang): T {
  return (obj?.[lang] ?? obj?.en) as T
}

function transformToContent(
  raw: RawPillarPage,
  lang: Lang,
): PillarPageContent & { structuredData: string } {
  return {
    heroData: {
      headline: pick(raw.hero?.headline, lang),
      subheadline: pick(raw.hero?.subheadline, lang),
      stats: (raw.hero?.stats || []).map((s) => ({
        value: s.value,
        label: pick(s.label, lang),
      })),
      readingTime: pick(raw.hero?.readingTime, lang),
      lastUpdated: pick(raw.hero?.lastUpdated, lang),
    },
    tableOfContents: [],
    comparisonData: (raw.comparisonData || []).map((c) => ({
      feature: pick(c.feature, lang),
      traditional: {
        value: pick(c.traditional?.value, lang),
        icon: c.traditional?.icon || "",
        description: pick(c.traditional?.description, lang),
      },
      modern: {
        value: pick(c.modern?.value, lang),
        icon: c.modern?.icon || "",
        description: pick(c.modern?.description, lang),
      },
    })),
    techStack: (raw.techStack || []).map((t) => ({
      name: t.name,
      category: t.category,
      description: pick(t.description, lang),
      icon: t.icon,
      benefits: pick(t.benefits, lang) || [],
      useCases: pick(t.useCases, lang) || [],
      popularity: t.popularity,
    })),
    roiMetrics: [],
    caseStudies: (raw.caseStudies || []).map((cs) => ({
      id: cs.caseId,
      client: cs.client,
      industry: pick(cs.industry, lang),
      logo: cs.logo.asset.url,
      challenge: pick(cs.challenge, lang),
      solution: pick(cs.solution, lang) || [],
      results: (cs.results || []).map((r) => ({
        metric: pick(r.metric, lang),
        before: pick(r.before, lang),
        after: pick(r.after, lang),
        improvement: pick(r.improvement, lang),
      })),
      technologies: cs.technologies || [],
      timeline: pick(cs.timeline, lang),
      testimonial: cs.testimonial
        ? {
            quote: pick(cs.testimonial.quote, lang),
            author: pick(cs.testimonial.author, lang),
            role: pick(cs.testimonial.role, lang),
          }
        : undefined,
    })),
    processSteps: (raw.processSteps || []).map((p) => ({
      step: p.step,
      title: pick(p.stepTitle, lang),
      description: pick(p.description, lang),
      duration: pick(p.duration, lang),
      deliverables: pick(p.deliverables, lang) || [],
      icon: p.icon,
    })),
    faqs: (raw.faqs || []).map((f) => ({
      question: pick(f.question, lang),
      answer: pick(f.answer, lang),
    })),
    leadMagnet: { title: "", description: "", benefits: [], preview: [] },
    ctas: {
      primary: { text: "", description: "" },
      secondary: { text: "", description: "" },
      leadMagnet: { text: "", description: "" },
    },
    statistics: { hero: [], impact: [] },
    structuredData: pick(raw.structuredData, lang) || "",
  }
}

export const getPillarPageContent = cache(
  async (
    lang: Lang,
  ): Promise<(PillarPageContent & { structuredData: string }) | null> => {
    const raw = await client.fetch<RawPillarPage | null>(pillarPageQuery)
    if (!raw) return null
    return transformToContent(raw, lang)
  },
)
