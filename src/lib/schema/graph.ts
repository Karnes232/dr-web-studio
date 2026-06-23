import type { Locale } from "@/lib/slugs"
import { getLayoutSchemaData } from "@/sanity/queries/layout/generalLayout"
import type { LayoutSchemaData } from "@/sanity/queries/layout/generalLayout"
import { getServiceOffers } from "@/sanity/queries/services/serviceItem"
import { getAllTestimonials } from "@/sanity/queries/home/testimonials"
import { getSEO } from "@/sanity/queries/seo"
import {
  aggregateRatingNode,
  articleNode,
  breadcrumbNode,
  faqPageNode,
  offerCatalogNode,
  organizationNode,
  personNode,
  reviewNodes,
  serviceNode,
  webPageNode,
  webSiteNode,
} from "./nodes"

type Href = Parameters<typeof webPageNode>[0]["href"]
type Crumb = { name: string; href: Href }
type JsonObject = Record<string, unknown>

const HOME_LABEL: Record<Locale, string> = { en: "Home", es: "Inicio" }

function buildGraph(nodes: (JsonObject | null | undefined)[]): JsonObject {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter((n): n is JsonObject => Boolean(n)),
  }
}

/** Resolve the canonical Organization node, optionally with OfferCatalog/reviews. */
async function buildOrg(
  lang: Locale,
  { withOffers = false, withReviews = false } = {},
): Promise<{ layout: LayoutSchemaData; org: JsonObject }> {
  const [layoutRaw, offers, testimonials] = await Promise.all([
    getLayoutSchemaData(),
    withOffers ? getServiceOffers() : Promise.resolve(null),
    withReviews ? getAllTestimonials() : Promise.resolve(null),
  ])
  const layout = layoutRaw ?? {}
  const org = organizationNode(layout, {
    lang,
    offerCatalog: offers ? offerCatalogNode(offers, lang) : undefined,
    aggregateRating: testimonials
      ? (aggregateRatingNode(testimonials) ?? undefined)
      : undefined,
    reviews: testimonials ? reviewNodes(testimonials, lang) : undefined,
  })
  return { layout, org }
}

/** Pull localized name/description/image from a page's Sanity SEO doc. */
async function seoMeta(pageName: string, lang: Locale) {
  const seo = await getSEO(pageName)
  return {
    name: seo?.meta?.[lang]?.title ?? "",
    description: seo?.meta?.[lang]?.description,
    image: seo?.openGraph?.image?.url,
  }
}

// ── Homepage ─────────────────────────────────────────────────────────────────

export async function getHomeGraph(lang: Locale): Promise<JsonObject> {
  const [{ layout, org }, meta] = await Promise.all([
    buildOrg(lang, { withOffers: true, withReviews: true }),
    seoMeta("home", lang),
  ])
  return buildGraph([
    personNode(layout, lang),
    org,
    webSiteNode(layout),
    webPageNode({
      lang,
      href: "/",
      name: meta.name || "DR Web Studio",
      description: meta.description,
      image: meta.image,
      breadcrumb: true,
    }),
    breadcrumbNode({
      lang,
      pageHref: "/",
      items: [{ name: HOME_LABEL[lang], href: "/" }],
    }),
  ])
}

// ── Standard content pages (about, pricing, portfolio, contact, etc.) ────────

export async function getStandardGraph(args: {
  lang: Locale
  pageName: string
  href: Href
  crumbs: Crumb[]
  includePerson?: boolean
  withOffers?: boolean
}): Promise<JsonObject> {
  const { lang, pageName, href, crumbs, includePerson, withOffers } = args
  const [{ layout, org }, meta] = await Promise.all([
    buildOrg(lang, { withOffers }),
    seoMeta(pageName, lang),
  ])
  return buildGraph([
    includePerson ? personNode(layout, lang) : null,
    org,
    webSiteNode(layout),
    webPageNode({
      lang,
      href,
      name: meta.name,
      description: meta.description,
      image: meta.image,
      breadcrumb: true,
    }),
    breadcrumbNode({ lang, pageHref: href, items: crumbs }),
  ])
}

// ── Individual service page ──────────────────────────────────────────────────

export async function getServiceGraph(args: {
  lang: Locale
  href: Href
  enSlug: string
  name: string
  description?: string
  image?: string
  crumbs: Crumb[]
  price?: number
  unit?: "MONTH"
}): Promise<JsonObject> {
  const { lang, href, name, description, image, crumbs, price, unit } = args
  const { layout, org } = await buildOrg(lang, { withOffers: true })
  return buildGraph([
    org,
    webSiteNode(layout),
    serviceNode({ lang, name, description, href, price, unit }),
    webPageNode({ lang, href, name, description, image, breadcrumb: true }),
    breadcrumbNode({ lang, pageHref: href, items: crumbs }),
  ])
}

// ── SEO landing pages (location/service) ─────────────────────────────────────

export async function getLandingGraph(args: {
  lang: Locale
  pageName: string
  href: Href
  crumbs: Crumb[]
  serviceName: string
  serviceDescription?: string
  faqItems?: { question: string; answer: string }[]
}): Promise<JsonObject> {
  const { lang, pageName, href, crumbs, serviceName, serviceDescription } = args
  const [{ layout, org }, meta] = await Promise.all([
    buildOrg(lang, { withOffers: true }),
    seoMeta(pageName, lang),
  ])
  return buildGraph([
    org,
    webSiteNode(layout),
    serviceNode({ lang, name: serviceName, description: serviceDescription, href }),
    webPageNode({
      lang,
      href,
      name: meta.name,
      description: meta.description,
      image: meta.image,
      breadcrumb: true,
    }),
    faqPageNode(args.faqItems ?? []),
    breadcrumbNode({ lang, pageHref: href, items: crumbs }),
  ])
}

// ── Blog post ────────────────────────────────────────────────────────────────

export async function getArticleGraph(args: {
  lang: Locale
  href: Href
  title: string
  description?: string
  image?: string
  datePublished?: string
  dateModified?: string
  crumbs: Crumb[]
}): Promise<JsonObject> {
  const { lang, href, title, description, image, datePublished, dateModified } =
    args
  const { layout, org } = await buildOrg(lang)
  return buildGraph([
    org,
    webSiteNode(layout),
    articleNode({
      lang,
      href,
      title,
      description,
      image,
      datePublished,
      dateModified,
    }),
    breadcrumbNode({ lang, pageHref: href, items: args.crumbs }),
  ])
}

// ── FAQs page (standard page + a real FAQPage from the Q&A content) ──────────

export async function getFaqsGraph(args: {
  lang: Locale
  href: Href
  crumbs: Crumb[]
  faqItems: { question: string; answer: string }[]
}): Promise<JsonObject> {
  const { lang, href, crumbs, faqItems } = args
  const [{ layout, org }, meta] = await Promise.all([
    buildOrg(lang),
    seoMeta("faqs", lang),
  ])
  return buildGraph([
    org,
    webSiteNode(layout),
    webPageNode({
      lang,
      href,
      name: meta.name,
      description: meta.description,
      image: meta.image,
      breadcrumb: true,
    }),
    faqPageNode(faqItems),
    breadcrumbNode({ lang, pageHref: href, items: crumbs }),
  ])
}
