// Pillar Page Types

export type Language = "en" | "es"

export interface HeroData {
  headline: string
  subheadline: string
  stats: {
    value: string
    label: string
  }[]
  readingTime: string
  lastUpdated: string
}

export interface TableOfContentsItem {
  id: string
  title: string
  subsections?: {
    id: string
    title: string
  }[]
}

export interface ComparisonItem {
  feature: string
  traditional: {
    value: string
    icon: string
    description?: string
  }
  modern: {
    value: string
    icon: string
    description?: string
  }
}

export interface TechStackItem {
  name: string
  category: "frontend" | "backend" | "database" | "devops" | "tools"
  description: string
  icon: string
  benefits: string[]
  useCases: string[]
  popularity?: number
}

export interface ROIMetric {
  metric: string
  traditional: number
  modern: number
  improvement: string
  unit: string
}

export interface CaseStudy {
  id: string
  client: string
  industry: string
  logo: string
  challenge: string
  solution: string[]
  results: {
    metric: string
    before: string
    after: string
    improvement: string
  }[]
  technologies: string[]
  timeline: string
  testimonial?: {
    quote: string
    author: string
    role: string
  }
}

export interface ProcessStep {
  step: number
  title: string
  description: string
  duration: string
  deliverables: string[]
  icon: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface LeadMagnet {
  title: string
  description: string
  benefits: string[]
  preview: string[]
}

export interface CTAs {
  primary: {
    text: string
    description: string
  }
  secondary: {
    text: string
    description: string
  }
  leadMagnet: {
    text: string
    description: string
  }
}

export interface Statistics {
  hero: {
    value: string
    label: string
  }[]
  impact: {
    value: string
    label: string
    trend: "up" | "down"
  }[]
}

export interface PillarPageContent {
  heroData: HeroData
  tableOfContents: TableOfContentsItem[]
  comparisonData: ComparisonItem[]
  techStack: TechStackItem[]
  roiMetrics: ROIMetric[]
  caseStudies: CaseStudy[]
  processSteps: ProcessStep[]
  faqs: FAQ[]
  leadMagnet: LeadMagnet
  ctas: CTAs
  statistics: Statistics
}
