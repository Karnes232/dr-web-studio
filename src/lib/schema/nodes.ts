import { localizedUrl } from "@/lib/urls"
import { SITE_URL } from "@/lib/site"
import type { Locale } from "@/lib/slugs"
import type { LayoutSchemaData } from "@/sanity/queries/layout/generalLayout"
import type { Testimonial } from "@/sanity/queries/home/testimonials"
import {
  AREA_SERVED,
  CURRENCIES_ACCEPTED,
  FOUNDING_DATE,
  ORG_DESCRIPTION,
  ORG_ID,
  PAYMENT_ACCEPTED,
  PERSON_ID,
  PERSON_JOB_TITLE,
  PERSON_KNOWS_ABOUT,
  PERSON_KNOWS_LANGUAGE,
  PRICE_RANGE,
  SERVICE_PRICES,
  WEBSITE_ID,
} from "./config"

/** Internal href accepted by `localizedUrl` (string pathname or {pathname, params}). */
type Href = Parameters<typeof localizedUrl>[0]

/** Absolute, locale-correct URL for an internal pathname. */
const abs = (href: Href, lang: Locale) => localizedUrl(href, lang)

/** Drop undefined/null/empty values from an array (used for sameAs lists). */
const compact = (arr: (string | undefined | null)[]): string[] =>
  arr.filter((v): v is string => Boolean(v))

/** Normalise a stored phone string to E.164 (`+` prefixed, digits only). */
function formatPhone(raw?: string): string | undefined {
  if (!raw) return undefined
  const digits = raw.replace(/[^\d]/g, "")
  return digits ? `+${digits}` : undefined
}

/**
 * Sanity asset URLs encode the source dimensions as `-{w}x{h}.{ext}`.
 * Returns them so ImageObject nodes can declare width/height for crawlers.
 */
function sanityImageDimensions(
  url?: string,
): { width: number; height: number } | undefined {
  if (!url) return undefined
  const m = url.match(/-(\d+)x(\d+)\.[a-z]+(?:\?|$)/i)
  if (!m) return undefined
  return { width: Number(m[1]), height: Number(m[2]) }
}

type JsonObject = Record<string, unknown>

// ── Organization / LocalBusiness ────────────────────────────────────────────

/**
 * The single canonical `#organization` node. Identical on every page (that's
 * the whole point — one consistent business entity). Reviews/aggregateRating
 * are opt-in via options and only passed on the homepage.
 */
export function organizationNode(
  layout: LayoutSchemaData,
  opts: {
    lang: Locale
    offerCatalog?: JsonObject
    aggregateRating?: JsonObject
    reviews?: JsonObject[]
  },
): JsonObject {
  const { lang } = opts
  const s = layout.socialLinks ?? {}
  const logoUrl = layout.logo

  const node: JsonObject = {
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": ORG_ID,
    name: layout.companyName ?? "DR Web Studio",
    alternateName: "DR Web Development Studio",
    url: SITE_URL,
    description: ORG_DESCRIPTION[lang],
    email: layout.email,
    founder: { "@id": PERSON_ID },
    foundingDate: FOUNDING_DATE,
    priceRange: PRICE_RANGE,
    currenciesAccepted: CURRENCIES_ACCEPTED,
    paymentAccepted: PAYMENT_ACCEPTED,
    areaServed: AREA_SERVED,
  }

  if (logoUrl) {
    const dims = sanityImageDimensions(logoUrl)
    node.logo = {
      "@type": "ImageObject",
      url: logoUrl,
      ...(dims ?? {}),
    }
    node.image = logoUrl
  }

  const phone = formatPhone(layout.telephone)
  if (phone) node.telephone = phone

  node.contactPoint = {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: layout.email,
    ...(phone ? { telephone: phone } : {}),
    availableLanguage: ["English", "Spanish"],
  }

  if (layout.address) {
    // Build from only the populated subfields — the GROQ projection returns
    // `null` for empty CMS fields, and emitting `"streetAddress": null` is a
    // structured-data validator warning.
    const a = layout.address
    const address: JsonObject = { "@type": "PostalAddress" }
    if (a.streetAddress) address.streetAddress = a.streetAddress
    if (a.addressLocality) address.addressLocality = a.addressLocality
    if (a.addressRegion) address.addressRegion = a.addressRegion
    if (a.postalCode) address.postalCode = a.postalCode
    if (a.addressCountry) address.addressCountry = a.addressCountry
    node.address = address
  }

  if (layout.geo?.latitude != null && layout.geo?.longitude != null) {
    node.geo = {
      "@type": "GeoCoordinates",
      latitude: layout.geo.latitude,
      longitude: layout.geo.longitude,
    }
  }

  if (layout.openingHours?.length) {
    node.openingHoursSpecification = layout.openingHours.map(h => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek:
        h.dayOfWeek && h.dayOfWeek.length === 1 ? h.dayOfWeek[0] : h.dayOfWeek,
      opens: h.opens,
      closes: h.closes,
    }))
  }

  // Company-level sameAs (the business profiles, NOT James's personal ones).
  const sameAs = compact([
    s.googleBusiness,
    s.trustpilot,
    s.clutch,
    s.linkedinCompany,
    s.instagram,
    s.facebook,
  ])
  if (sameAs.length) node.sameAs = sameAs

  if (opts.offerCatalog) node.hasOfferCatalog = opts.offerCatalog
  if (opts.aggregateRating) node.aggregateRating = opts.aggregateRating
  if (opts.reviews?.length) node.review = opts.reviews

  return node
}

// ── Person (James Karnes) ────────────────────────────────────────────────────

export function personNode(layout: LayoutSchemaData, lang: Locale): JsonObject {
  const s = layout.socialLinks ?? {}
  const sameAs = compact([s.linkedin, s.github])
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "James Karnes",
    url: abs("/about-me", lang),
    jobTitle: PERSON_JOB_TITLE,
    worksFor: { "@id": ORG_ID },
    knowsAbout: PERSON_KNOWS_ABOUT,
    knowsLanguage: PERSON_KNOWS_LANGUAGE,
    ...(sameAs.length ? { sameAs } : {}),
  }
}

// ── WebSite ──────────────────────────────────────────────────────────────────

export function webSiteNode(
  layout: LayoutSchemaData,
  lang: Locale,
): JsonObject {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: layout.companyName ?? "DR Web Studio",
    description:
      "Custom website development for businesses in the Dominican Republic",
    publisher: { "@id": ORG_ID },
    inLanguage: ["en", "es"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${localizedUrl("/blog", lang)}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

// ── WebPage + Breadcrumb ─────────────────────────────────────────────────────

export function webPageNode(args: {
  lang: Locale
  href: Href
  name: string
  description?: string
  image?: string
  breadcrumb?: boolean
}): JsonObject {
  const url = abs(args.href, args.lang)
  const node: JsonObject = {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: args.name,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    inLanguage: args.lang,
  }
  if (args.description) node.description = args.description
  if (args.image)
    node.primaryImageOfPage = { "@type": "ImageObject", url: args.image }
  if (args.breadcrumb) node.breadcrumb = { "@id": `${url}#breadcrumb` }
  return node
}

/** items: ordered crumbs; each `href` is an internal pathname. */
export function breadcrumbNode(args: {
  lang: Locale
  pageHref: Href
  items: { name: string; href: Href }[]
}): JsonObject {
  const pageUrl = abs(args.pageHref, args.lang)
  return {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: args.items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.href, args.lang),
    })),
  }
}

// ── Service + OfferCatalog ───────────────────────────────────────────────────

export function serviceNode(args: {
  lang: Locale
  name: string
  /** Plain service category (e.g. "Landing Pages"). Falls back to `name`.
   *  Keep this free of SEO-title cruft like brand/geo suffixes. */
  serviceType?: string
  description?: string
  href: Href
  price?: number
  unit?: "MONTH"
}): JsonObject {
  const url = abs(args.href, args.lang)
  const node: JsonObject = {
    "@type": "Service",
    // Stable @id (shared with the homepage OfferCatalog entry for the same
    // service) so both resolve to one entity within the locale's graph.
    "@id": `${url}#service`,
    name: args.name,
    serviceType: args.serviceType ?? args.name,
    url,
    provider: { "@id": ORG_ID },
    areaServed: AREA_SERVED,
  }
  if (args.description) node.description = args.description
  if (args.price != null) {
    node.offers = {
      "@type": "Offer",
      price: String(args.price),
      priceCurrency: CURRENCIES_ACCEPTED,
      ...(args.unit
        ? { priceSpecification: offerUnit(args.price, args.unit) }
        : {}),
    }
  }
  return node
}

function offerUnit(price: number, unit: "MONTH"): JsonObject {
  return {
    "@type": "UnitPriceSpecification",
    price: String(price),
    priceCurrency: CURRENCIES_ACCEPTED,
    unitText: unit,
  }
}

/** Builds the OfferCatalog from the live `serviceItem` docs + the price map. */
export function offerCatalogNode(
  services: {
    title: { en: string; es: string }
    description?: { en: string; es: string }
    slug: { current: string }
    slugEs?: { current: string } | null
  }[],
  lang: Locale,
): JsonObject {
  return {
    "@type": "OfferCatalog",
    name: "Web Development Services",
    itemListElement: services.map(svc => {
      const enSlug = svc.slug.current
      const priceInfo = SERVICE_PRICES[enSlug]
      const href = {
        pathname: "/our-services/[slug]" as const,
        params: {
          slug: lang === "es" ? (svc.slugEs?.current ?? enSlug) : enSlug,
        },
      }
      const serviceUrl = abs(href, lang)
      const itemOffered: JsonObject = {
        "@type": "Service",
        // Matches the `@id` on the service-detail page's Service node.
        "@id": `${serviceUrl}#service`,
        name: svc.title[lang],
        url: serviceUrl,
        provider: { "@id": ORG_ID },
      }
      if (svc.description) itemOffered.description = svc.description[lang]
      const offer: JsonObject = { "@type": "Offer", itemOffered }
      if (priceInfo) {
        offer.priceSpecification = {
          "@type": priceInfo.unit
            ? "UnitPriceSpecification"
            : "PriceSpecification",
          price: String(priceInfo.price),
          priceCurrency: CURRENCIES_ACCEPTED,
          ...(priceInfo.unit ? { unitText: priceInfo.unit } : {}),
        }
      }
      return offer
    }),
  }
}

// ── FAQPage ──────────────────────────────────────────────────────────────────

/** items already localised to the current language. */
export function faqPageNode(
  items: { question: string; answer: string }[],
): JsonObject | null {
  const valid = items.filter(i => i.question && i.answer)
  if (!valid.length) return null
  return {
    "@type": "FAQPage",
    mainEntity: valid.map(i => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  }
}

// ── Article / BlogPosting ────────────────────────────────────────────────────

export function articleNode(args: {
  lang: Locale
  href: Href
  title: string
  description?: string
  image?: string
  datePublished?: string
  dateModified?: string
}): JsonObject {
  const url = abs(args.href, args.lang)
  const node: JsonObject = {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: args.title,
    inLanguage: args.lang,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
  }
  if (args.description) node.description = args.description
  if (args.image) node.image = args.image
  if (args.datePublished) node.datePublished = args.datePublished
  if (args.dateModified) node.dateModified = args.dateModified
  return node
}

// ── AggregateRating + Reviews (homepage only) ────────────────────────────────

export function aggregateRatingNode(
  testimonials: Testimonial[],
): JsonObject | null {
  const rated = testimonials.filter(t => typeof t.rating === "number")
  if (!rated.length) return null
  const avg = rated.reduce((sum, t) => sum + t.rating, 0) / rated.length
  return {
    "@type": "AggregateRating",
    ratingValue: avg.toFixed(1),
    bestRating: "5",
    worstRating: "1",
    ratingCount: String(rated.length),
    reviewCount: String(rated.length),
  }
}

export function reviewNodes(
  testimonials: Testimonial[],
  lang: Locale,
): JsonObject[] {
  return testimonials
    .filter(t => t.quote?.[lang] && t.author)
    .map(t => ({
      "@type": "Review",
      author: { "@type": "Person", name: t.author },
      reviewRating: {
        "@type": "Rating",
        ratingValue: String(t.rating ?? 5),
        bestRating: "5",
      },
      reviewBody: t.quote[lang],
      itemReviewed: { "@id": ORG_ID },
    }))
}
