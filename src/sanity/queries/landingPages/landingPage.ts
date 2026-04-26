import { client } from "@/sanity/lib/client"

// ──────────────────────────────────────────
// GROQ Query
// ──────────────────────────────────────────

export const landingPageQuery = `
*[_type == "landingPage" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  hero {
    headline { en, es },
    subheadline { en, es },
    primaryCta { en, es },
    primaryCtaHref,
    secondaryCta { en, es },
    secondaryCtaHref,
    badge { en, es },
    "backgroundImage": backgroundImage.asset->url
  },
  statsBar[] {
    value,
    label { en, es }
  },
  servicesGrid {
    sectionTitle { en, es },
    sectionSubtitle { en, es },
    items[] {
      icon,
      title { en, es },
      description { en, es },
      linkSlug
    }
  },
  whyUs {
    sectionTitle { en, es },
    sectionSubtitle { en, es },
    items[] {
      icon,
      title { en, es },
      description { en, es }
    }
  },
  process {
    sectionTitle { en, es },
    sectionSubtitle { en, es },
    steps[] {
      number,
      icon,
      stepTitle { en, es },
      description { en, es },
      duration { en, es }
    }
  },
  portfolioHighlight {
    sectionTitle { en, es },
    sectionSubtitle { en, es },
    "projects": projects[]-> {
      "title": title { en, es },
      "slug": slug.current,
      client,
      "category": category { en, es },
      "imageUrl": image.asset->url,
      tags
    },
    ctaText { en, es },
    ctaHref
  },
  testimonials {
    sectionTitle { en, es },
    items[] {
      quote { en, es },
      author,
      company,
      rating,
      "avatarUrl": avatar.asset->url
    }
  },
  faq {
    sectionTitle { en, es },
    sectionSubtitle { en, es },
    items[] {
      question { en, es },
      answer { en, es }
    }
  },

  structuredData { en, es }
}
`

// ──────────────────────────────────────────
// Raw Types (from Sanity)
// ──────────────────────────────────────────

interface LocalizedString {
  en?: string
  es?: string
}

interface RawStatItem {
  value?: string
  label?: LocalizedString
}

interface RawServiceItem {
  icon?: string
  title?: LocalizedString
  description?: LocalizedString
  linkSlug?: string
}

interface RawWhyUsItem {
  icon?: string
  title?: LocalizedString
  description?: LocalizedString
}

interface RawProcessStep {
  number?: number
  icon?: string
  stepTitle?: LocalizedString
  description?: LocalizedString
  duration?: LocalizedString
}

interface RawProject {
  title?: LocalizedString
  slug?: string
  client?: string
  category?: LocalizedString
  imageUrl?: string
  tags?: string[]
}

interface RawTestimonialItem {
  quote?: LocalizedString
  author?: string
  company?: string
  rating?: number
  avatarUrl?: string
}

interface RawFaqItem {
  question?: LocalizedString
  answer?: LocalizedString
}

interface RawLandingPage {
  title?: string
  slug?: string
  hero?: {
    headline?: LocalizedString
    subheadline?: LocalizedString
    primaryCta?: LocalizedString
    primaryCtaHref?: string
    secondaryCta?: LocalizedString
    secondaryCtaHref?: string
    badge?: LocalizedString
    backgroundImage?: string
  }
  statsBar?: RawStatItem[]
  servicesGrid?: {
    sectionTitle?: LocalizedString
    sectionSubtitle?: LocalizedString
    items?: RawServiceItem[]
  }
  whyUs?: {
    sectionTitle?: LocalizedString
    sectionSubtitle?: LocalizedString
    items?: RawWhyUsItem[]
  }
  process?: {
    sectionTitle?: LocalizedString
    sectionSubtitle?: LocalizedString
    steps?: RawProcessStep[]
  }
  portfolioHighlight?: {
    sectionTitle?: LocalizedString
    sectionSubtitle?: LocalizedString
    projects?: RawProject[]
    ctaText?: LocalizedString
    ctaHref?: string
  }
  testimonials?: {
    sectionTitle?: LocalizedString
    items?: RawTestimonialItem[]
  }
  faq?: {
    sectionTitle?: LocalizedString
    sectionSubtitle?: LocalizedString
    items?: RawFaqItem[]
  }
  structuredData?: LocalizedString
}

// ──────────────────────────────────────────
// Typed Output (post-transform)
// ──────────────────────────────────────────

export interface LandingPageData {
  title: string
  slug: string
  hero: {
    headline: string
    subheadline: string
    primaryCta: string
    primaryCtaHref: string
    secondaryCta: string
    secondaryCtaHref: string
    badge: string
    backgroundImage?: string
  }
  statsBar: { value: string; label: string }[]
  servicesGrid: {
    sectionTitle: string
    sectionSubtitle: string
    items: { icon: string; title: string; description: string; linkSlug?: string }[]
  }
  whyUs: {
    sectionTitle: string
    sectionSubtitle: string
    items: { icon: string; title: string; description: string }[]
  }
  process: {
    sectionTitle: string
    sectionSubtitle: string
    steps: { number: number; icon: string; stepTitle: string; description: string; duration: string }[]
  }
  portfolioHighlight: {
    sectionTitle: string
    sectionSubtitle: string
    projects: { title: string; slug: string; client: string; category: string; imageUrl?: string; tags?: string[] }[]
    ctaText: string
    ctaHref: string
  }
  testimonials: {
    sectionTitle: string
    items: { quote: string; author: string; company: string; rating: number; avatarUrl?: string }[]
  }
  faq: {
    sectionTitle: string
    sectionSubtitle: string
    items: { question: string; answer: string }[]
  }

  structuredData?: string
}

// ──────────────────────────────────────────
// Transform
// ──────────────────────────────────────────

function pick(obj: LocalizedString | undefined, lang: "en" | "es"): string {
  return obj?.[lang] ?? obj?.en ?? ""
}

function transformLandingPage(raw: RawLandingPage, lang: "en" | "es"): LandingPageData {
  return {
    title: raw.title ?? "",
    slug: raw.slug ?? "",
    hero: {
      headline: pick(raw.hero?.headline, lang),
      subheadline: pick(raw.hero?.subheadline, lang),
      primaryCta: pick(raw.hero?.primaryCta, lang),
      primaryCtaHref: raw.hero?.primaryCtaHref ?? `/${lang}/contact`,
      secondaryCta: pick(raw.hero?.secondaryCta, lang),
      secondaryCtaHref: raw.hero?.secondaryCtaHref ?? `/${lang}/portfolio`,
      badge: pick(raw.hero?.badge, lang),
      backgroundImage: raw.hero?.backgroundImage,
    },
    statsBar: (raw.statsBar ?? []).map(s => ({
      value: s.value ?? "",
      label: pick(s.label, lang),
    })),
    servicesGrid: {
      sectionTitle: pick(raw.servicesGrid?.sectionTitle, lang),
      sectionSubtitle: pick(raw.servicesGrid?.sectionSubtitle, lang),
      items: (raw.servicesGrid?.items ?? []).map(i => ({
        icon: i.icon ?? "Globe",
        title: pick(i.title, lang),
        description: pick(i.description, lang),
        linkSlug: i.linkSlug,
      })),
    },
    whyUs: {
      sectionTitle: pick(raw.whyUs?.sectionTitle, lang),
      sectionSubtitle: pick(raw.whyUs?.sectionSubtitle, lang),
      items: (raw.whyUs?.items ?? []).map(i => ({
        icon: i.icon ?? "Check",
        title: pick(i.title, lang),
        description: pick(i.description, lang),
      })),
    },
    process: {
      sectionTitle: pick(raw.process?.sectionTitle, lang),
      sectionSubtitle: pick(raw.process?.sectionSubtitle, lang),
      steps: (raw.process?.steps ?? []).map(s => ({
        number: s.number ?? 0,
        icon: s.icon ?? "ArrowRight",
        stepTitle: pick(s.stepTitle, lang),
        description: pick(s.description, lang),
        duration: pick(s.duration, lang),
      })),
    },
    portfolioHighlight: {
      sectionTitle: pick(raw.portfolioHighlight?.sectionTitle, lang),
      sectionSubtitle: pick(raw.portfolioHighlight?.sectionSubtitle, lang),
      projects: (raw.portfolioHighlight?.projects ?? []).map(p => ({
        title: pick(p.title, lang),
        slug: p.slug ?? "",
        client: p.client ?? "",
        category: pick(p.category, lang),
        imageUrl: p.imageUrl,
        tags: p.tags,
      })),
      ctaText: pick(raw.portfolioHighlight?.ctaText, lang),
      ctaHref: raw.portfolioHighlight?.ctaHref ?? `/${lang}/portfolio`,
    },
    testimonials: {
      sectionTitle: pick(raw.testimonials?.sectionTitle, lang),
      items: (raw.testimonials?.items ?? []).map(t => ({
        quote: pick(t.quote, lang),
        author: t.author ?? "",
        company: t.company ?? "",
        rating: t.rating ?? 5,
        avatarUrl: t.avatarUrl,
      })),
    },
    faq: {
      sectionTitle: pick(raw.faq?.sectionTitle, lang),
      sectionSubtitle: pick(raw.faq?.sectionSubtitle, lang),
      items: (raw.faq?.items ?? []).map(f => ({
        question: pick(f.question, lang),
        answer: pick(f.answer, lang),
      })),
    },
    structuredData: raw.structuredData?.[lang] ?? raw.structuredData?.en,
  }
}

// ──────────────────────────────────────────
// Public Fetch Function
// ──────────────────────────────────────────

export async function getLandingPage(
  slug: string,
  lang: "en" | "es",
): Promise<LandingPageData | null> {
  const raw: RawLandingPage | null = await client.fetch(landingPageQuery, { slug })
  if (!raw) return null
  return transformLandingPage(raw, lang)
}
