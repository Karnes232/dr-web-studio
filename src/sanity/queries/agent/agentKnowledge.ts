import "server-only"
import { unstable_cache } from "next/cache"
import { serverClient } from "@/sanity/lib/serverClient"

/**
 * Everything the WhatsApp agent needs to answer a sales conversation, in one
 * round trip.
 *
 * Deliberately NOT `src/lib/llmsFull.ts`: that builds the same kind of dump but
 * includes every blog post and all ~24 landing pages, and the live output is
 * ~1.4 MB / ~295K tokens per locale — unusable as a cached prompt prefix. This
 * query is the subset a conversation actually needs, both locales together.
 *
 * Read through `serverClient` (`useCdn: false`) rather than the CDN client, and
 * cached for an hour with `unstable_cache` — the pattern is `getContactEmail`
 * at the bottom of `src/sanity/queries/layout/generalLayout.ts`. React `cache()`
 * used everywhere else is request-scoped, which is wrong here: every inbound
 * WhatsApp message is its own request and would re-fetch the whole base.
 *
 * Everything selected below is plain `{en, es}`. The only Portable Text in this
 * project lives on `landingPage` and `serviceItem.pageContent.mainDescription`,
 * neither of which is included — so no flattening is needed. If that ever
 * changes, reuse `src/lib/portableTextToPlainText.ts`.
 */

export interface Localized {
  en: string
  es: string
}

export interface AgentService {
  slug: string | null
  title: Localized
  description: Localized
  /** Bare, unitless string from the CMS — e.g. "400", "1,250". No currency. */
  priceRange: string | null
  /** Bare, unitless string — e.g. "2-3", "Ongoing". Units are added in the UI. */
  timeline: string | null
}

export interface AgentPackage {
  title: Localized
  description: Localized
  /** Bare number as a string, no symbol: "400", "95". */
  price: string | null
  pricePeriod: Localized | null
  variant: string | null
  /**
   * `included: false` means the feature is NOT in this package — the pricing
   * table renders those struck through. Must be surfaced as an exclusion or
   * dropped, never listed as if it were included.
   */
  features: { text: Localized; included: boolean }[] | null
}

export interface AgentQA {
  question: Localized
  answer: Localized
}

export interface AgentPlannerService {
  key: string
  title: Localized
  description: Localized
  basePrice: number
  timeline: Localized
  pageBased: boolean | null
  included: Localized[] | null
}

export interface AgentLayout {
  companyName: string | null
  email: string | null
  telephone: string | null
  address: {
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
    addressCountry?: string
  } | null
  openingHours: { dayOfWeek: string[]; opens: string; closes: string }[] | null
}

export interface AgentKnowledge {
  services: AgentService[]
  packages: AgentPackage[]
  faqs: AgentQA[]
  contactFaqs: AgentQA[]
  faqCategories: { title: Localized; questions: AgentQA[] | null }[]
  plannerServices: AgentPlannerService[]
  layout: AgentLayout | null
}

// Ordering is explicit on every list so the rendered prefix is byte-stable
// across requests. An unstable prefix silently destroys the prompt cache.
const agentKnowledgeQuery = `{
  "services": *[_type == "serviceItem"] | order(priceRange asc) {
    "slug": slug.current, title, description, priceRange, timeline
  },
  "packages": *[_type == "pricingData"] | order(order asc) {
    title, description, price, pricePeriod, variant,
    "features": features[]{ text, included }
  },
  "faqs": *[_type == "faq"] | order(order asc) { question, answer },
  "contactFaqs": *[_type == "contactFaq"] | order(order asc) { question, answer },
  "faqCategories": *[_type == "faqCategory"] | order(order asc) {
    title, "questions": questions[]{ question, answer }
  },
  "plannerServices": *[_type == "plannerService" && active != false] | order(order asc) {
    key, title, description, basePrice, timeline, pageBased, included
  },
  "layout": *[_id == "generalLayout"][0] {
    companyName, email, telephone, address, openingHours
  }
}`

export const getAgentKnowledge = unstable_cache(
  async (): Promise<AgentKnowledge> =>
    serverClient.fetch<AgentKnowledge>(agentKnowledgeQuery),
  ["agent-knowledge"],
  { revalidate: 3600, tags: ["agentKnowledge"] },
)
