export type Lang = "en" | "es"

/** Portable Text block array (loosely typed, matching the project convention). */
export type PortableBlocks = unknown[]

export interface StatItem {
  value: string
  label: string
}

export interface ServiceItem {
  icon: string
  title: string
  description: PortableBlocks
  linkSlug?: string
}

export interface WhyUsItem {
  icon: string
  title: string
  description: PortableBlocks
}

export interface ProcessStep {
  number: number
  icon: string
  stepTitle: string
  description: PortableBlocks
  duration: string
}

export interface PortfolioProject {
  title: string
  slug: string
  client: string
  category: string
  imageUrl?: string
  tags?: string[]
}

export interface TestimonialItem {
  quote: string
  author: string
  company: string
  rating: number
  avatarUrl?: string
}

export interface FaqItem {
  question: string
  // Portable Text on landing pages; a plain string when reused elsewhere
  // (e.g. the services page) — RichText renders both.
  answer: PortableBlocks | string
  /** Plain-text answer for JSON-LD (present on landing data; unused in render). */
  answerText?: string
}

export interface HeroData {
  headline: string
  subheadline: string
  primaryCta: string
  primaryCtaHref: string
  secondaryCta: string
  secondaryCtaHref: string
  badge: string
  backgroundImage?: string
}
