export type Lang = "en" | "es"

export interface StatItem {
  value: string
  label: string
}

export interface ServiceItem {
  icon: string
  title: string
  description: string
  linkSlug?: string
}

export interface WhyUsItem {
  icon: string
  title: string
  description: string
}

export interface ProcessStep {
  number: number
  icon: string
  stepTitle: string
  description: string
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
  answer: string
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
