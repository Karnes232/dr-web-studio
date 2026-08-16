import { cache } from "react"
import { client } from "@/sanity/lib/client"
import { portableTextToPlainText } from "@/lib/portableTextToPlainText"
import { getPathname } from "@/i18n/navigation"

/** Portable Text block array (loosely typed, matching the project convention). */
type PortableBlocks = unknown[]

// ──────────────────────────────────────────
// GROQ Query
// ──────────────────────────────────────────

/** Shared field projection — used by the single-page query below and the
 *  all-pages query in allLandingPages.ts. */
export const landingPageProjection = `{
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
    "backgroundImage": backgroundImage.asset->url + "?w=1920&q=75&auto=format&fit=max"
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

  structuredData { en, es },
  "serviceSlugPairs": *[_type == "serviceItem"] { "en": slug.current, "es": slugEs.current }
}`

export const landingPageQuery = `
*[_type == "landingPage" && slug.current == $slug][0] ${landingPageProjection}
`

// ──────────────────────────────────────────
// Raw Types (from Sanity)
// ──────────────────────────────────────────

interface LocalizedString {
  en?: string
  es?: string
}

// Rich-text fields come back as a localized pair of Portable Text arrays. The
// `string` union covers legacy/un-migrated docs (asBlocks wraps them safely).
interface LocalizedBlocks {
  en?: PortableBlocks | string
  es?: PortableBlocks | string
}

interface RawStatItem {
  value?: string
  label?: LocalizedString
}

interface RawServiceItem {
  icon?: string
  title?: LocalizedString
  description?: LocalizedBlocks
  linkSlug?: string
}

interface RawWhyUsItem {
  icon?: string
  title?: LocalizedString
  description?: LocalizedBlocks
}

interface RawProcessStep {
  number?: number
  icon?: string
  stepTitle?: LocalizedString
  description?: LocalizedBlocks
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
  answer?: LocalizedBlocks
}

export interface RawLandingPage {
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
    sectionSubtitle?: LocalizedBlocks
    items?: RawServiceItem[]
  }
  whyUs?: {
    sectionTitle?: LocalizedString
    sectionSubtitle?: LocalizedBlocks
    items?: RawWhyUsItem[]
  }
  process?: {
    sectionTitle?: LocalizedString
    sectionSubtitle?: LocalizedBlocks
    steps?: RawProcessStep[]
  }
  portfolioHighlight?: {
    sectionTitle?: LocalizedString
    sectionSubtitle?: LocalizedBlocks
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
    sectionSubtitle?: LocalizedBlocks
    items?: RawFaqItem[]
  }
  structuredData?: LocalizedString
  serviceSlugPairs?: { en?: string; es?: string | null }[]
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
    sectionSubtitle: PortableBlocks
    items: {
      icon: string
      title: string
      description: PortableBlocks
      linkSlug?: string
    }[]
  }
  whyUs: {
    sectionTitle: string
    sectionSubtitle: PortableBlocks
    items: { icon: string; title: string; description: PortableBlocks }[]
  }
  process: {
    sectionTitle: string
    sectionSubtitle: PortableBlocks
    steps: {
      number: number
      icon: string
      stepTitle: string
      description: PortableBlocks
      duration: string
    }[]
  }
  portfolioHighlight: {
    sectionTitle: string
    sectionSubtitle: PortableBlocks
    projects: {
      title: string
      slug: string
      client: string
      category: string
      imageUrl?: string
      tags?: string[]
    }[]
    ctaText: string
    ctaHref: string
  }
  testimonials: {
    sectionTitle: string
    items: {
      quote: string
      author: string
      company: string
      rating: number
      avatarUrl?: string
    }[]
  }
  faq: {
    sectionTitle: string
    sectionSubtitle: PortableBlocks
    items: { question: string; answer: PortableBlocks; answerText: string }[]
  }

  structuredData?: string
}

// ──────────────────────────────────────────
// Transform
// ──────────────────────────────────────────

function pick(obj: LocalizedString | undefined, lang: "en" | "es"): string {
  return obj?.[lang] ?? obj?.en ?? ""
}

/** Coerce a rich-text value to a Portable Text block array. Arrays pass through;
 *  a legacy plain string is wrapped into a single block (defensive for
 *  un-migrated docs / string-based seeds); anything else becomes []. */
function asBlocks(value: PortableBlocks | string | undefined): PortableBlocks {
  if (Array.isArray(value)) return value
  if (typeof value === "string" && value.trim()) {
    return [
      {
        _type: "block",
        style: "normal",
        markDefs: [],
        children: [{ _type: "span", text: value, marks: [] }],
      },
    ]
  }
  return []
}

function pickBlocks(
  obj: LocalizedBlocks | undefined,
  lang: "en" | "es",
): PortableBlocks {
  return asBlocks(obj?.[lang] ?? obj?.en)
}

/** Resolve a Sanity-stored href (canonical English path like "/contact" or
 *  "/our-services/<en-slug>", with or without a locale prefix) into the final
 *  locale-prefixed URL ("/es/contacto"), so components can render it with a
 *  plain <Link> and no redirect hop. Unknown paths fall back to prefix-only. */
function resolveLandingHref(
  href: string,
  lang: "en" | "es",
  slugPairs: { en?: string; es?: string | null }[],
): string {
  if (!href.startsWith("/")) return href
  const path = href.replace(/^\/(en|es)(?=\/|$)/, "") || "/"

  const serviceMatch = path.match(/^\/our-services\/(.+)$/)
  if (serviceMatch) {
    const enSlug = serviceMatch[1]
    const pair = slugPairs.find(p => p.en === enSlug)
    const slug = lang === "es" ? (pair?.es ?? enSlug) : enSlug
    return getPathname({
      locale: lang,
      href: { pathname: "/our-services/[slug]", params: { slug } },
    })
  }

  try {
    return getPathname({
      locale: lang,
      href: path as Parameters<typeof getPathname>[0]["href"],
    })
  } catch {
    return `/${lang}${path}`
  }
}

export function transformLandingPage(
  raw: RawLandingPage,
  lang: "en" | "es",
): LandingPageData {
  const slugPairs = raw.serviceSlugPairs ?? []
  const resolveHref = (href: string) =>
    resolveLandingHref(href, lang, slugPairs)
  return {
    title: raw.title ?? "",
    slug: raw.slug ?? "",
    hero: {
      headline: pick(raw.hero?.headline, lang),
      subheadline: pick(raw.hero?.subheadline, lang),
      primaryCta: pick(raw.hero?.primaryCta, lang),
      primaryCtaHref: resolveHref(raw.hero?.primaryCtaHref ?? "/contact"),
      secondaryCta: pick(raw.hero?.secondaryCta, lang),
      secondaryCtaHref: resolveHref(raw.hero?.secondaryCtaHref ?? "/portfolio"),
      badge: pick(raw.hero?.badge, lang),
      backgroundImage: raw.hero?.backgroundImage,
    },
    statsBar: (raw.statsBar ?? []).map(s => ({
      value: s.value ?? "",
      label: pick(s.label, lang),
    })),
    servicesGrid: {
      sectionTitle: pick(raw.servicesGrid?.sectionTitle, lang),
      sectionSubtitle: pickBlocks(raw.servicesGrid?.sectionSubtitle, lang),
      items: (raw.servicesGrid?.items ?? []).map(i => ({
        icon: i.icon ?? "Globe",
        title: pick(i.title, lang),
        description: pickBlocks(i.description, lang),
        // Localized here (en slug from content → es slug when lang is es) so
        // the grid's Link emits the final URL with no redirect hop.
        linkSlug: i.linkSlug
          ? lang === "es"
            ? (slugPairs.find(p => p.en === i.linkSlug)?.es ?? i.linkSlug)
            : i.linkSlug
          : undefined,
      })),
    },
    whyUs: {
      sectionTitle: pick(raw.whyUs?.sectionTitle, lang),
      sectionSubtitle: pickBlocks(raw.whyUs?.sectionSubtitle, lang),
      items: (raw.whyUs?.items ?? []).map(i => ({
        icon: i.icon ?? "Check",
        title: pick(i.title, lang),
        description: pickBlocks(i.description, lang),
      })),
    },
    process: {
      sectionTitle: pick(raw.process?.sectionTitle, lang),
      sectionSubtitle: pickBlocks(raw.process?.sectionSubtitle, lang),
      steps: (raw.process?.steps ?? []).map(s => ({
        number: s.number ?? 0,
        icon: s.icon ?? "ArrowRight",
        stepTitle: pick(s.stepTitle, lang),
        description: pickBlocks(s.description, lang),
        duration: pick(s.duration, lang),
      })),
    },
    portfolioHighlight: {
      sectionTitle: pick(raw.portfolioHighlight?.sectionTitle, lang),
      sectionSubtitle: pickBlocks(
        raw.portfolioHighlight?.sectionSubtitle,
        lang,
      ),
      projects: (raw.portfolioHighlight?.projects ?? []).map(p => ({
        title: pick(p.title, lang),
        slug: p.slug ?? "",
        client: p.client ?? "",
        category: pick(p.category, lang),
        imageUrl: p.imageUrl,
        tags: p.tags,
      })),
      ctaText: pick(raw.portfolioHighlight?.ctaText, lang),
      ctaHref: resolveHref(raw.portfolioHighlight?.ctaHref ?? "/portfolio"),
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
      sectionSubtitle: pickBlocks(raw.faq?.sectionSubtitle, lang),
      items: (raw.faq?.items ?? []).map(f => {
        const answer = pickBlocks(f.answer, lang)
        return {
          question: pick(f.question, lang),
          answer,
          answerText: portableTextToPlainText(answer),
        }
      }),
    },
    structuredData: raw.structuredData?.[lang] ?? raw.structuredData?.en,
  }
}

// ──────────────────────────────────────────
// Public Fetch Function
// ──────────────────────────────────────────

export const getLandingPage = cache(
  async (slug: string, lang: "en" | "es"): Promise<LandingPageData | null> => {
    const raw: RawLandingPage | null = await client.fetch(landingPageQuery, {
      slug,
    })
    if (!raw) return null
    return transformLandingPage(raw, lang)
  },
)
