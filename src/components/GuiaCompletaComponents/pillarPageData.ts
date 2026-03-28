// Pillar Page Data - Multilingual Helper
// Usage: import { getPillarPageContent } from '@/lib/pillarPageData'
// const content = getPillarPageContent('es') or getPillarPageContent('en')

import type { Language, PillarPageContent } from "./types"

// Spanish content (complete)
import spanishContent from "./content.es"

// English content (complete)
import englishContent from "./content.en"

const content: Record<Language, any> = {
  es: spanishContent,
  en: englishContent,
}

/**
 * Get pillar page content by language
 * @param lang - Language code ('en' or 'es')
 * @returns Complete pillar page content in requested language
 */
export function getPillarPageContent(lang: Language = "es") {
  return content[lang]
}

/**
 * Get specific section by language
 */
export function getHeroContent(lang: Language = "es") {
  return content[lang].heroData
}

export function getComparisonData(lang: Language = "es") {
  return content[lang].comparisonData
}

export function getTechStack(lang: Language = "es") {
  return content[lang].techStack
}

export function getCaseStudies(lang: Language = "es") {
  return content[lang].caseStudies
}

export function getProcessSteps(lang: Language = "es") {
  return content[lang].processSteps
}

export function getFAQs(lang: Language = "es") {
  return content[lang].faqs
}

export function getCTAs(lang: Language = "es") {
  return content[lang].ctas
}

// Export types for use in components
export type {
  Language,
  HeroData,
  ComparisonItem,
  TechStackItem,
  CaseStudy,
  ProcessStep,
  FAQ,
  LeadMagnet,
  CTAs,
} from "./types"

// Export cost breakdown (language-independent numbers)
export { costBreakdown } from "./content.es"
