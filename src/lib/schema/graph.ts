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

// ── CMS structured data (Sanity `structuredData` fields) ─────────────────────

// Site-identity nodes stay auto-generated: they're built live from layout data
// (with offers/ratings/reviews on home) and CMS copies are stale snapshots of
// the same @id. OfferCatalog is included because the catalog (names + prices)
// is built live from serviceItem docs + SERVICE_PRICES; stored copies have
// drifted from the published prices.
const SITE_IDENTITY_TYPES = new Set([
  "Organization",
  "LocalBusiness",
  "ProfessionalService",
  "WebSite",
  "OfferCatalog",
])

// Page-content types where the auto node is authoritative when it exists: it's
// built from the live routing tables and CMS fields, so its @id/slug always
// matches the page being rendered, while stored CMS copies have proven to carry
// stale or wrong-locale URLs. A CMS node of these types still applies on pages
// where no auto equivalent is emitted (e.g. FAQPage on blog posts).
const AUTO_WINS_TYPES = new Set([
  "Article",
  "Service",
  "WebPage",
  "BreadcrumbList",
  "FAQPage",
  "Person",
])

// Treat the Article family as one type when detecting collisions: stored blog
// structured data says "Article" while the auto node is "BlogPosting". Same for
// CollectionPage vs the auto WebPage on listing pages.
const TYPE_EQUIVALENCE: Record<string, string> = {
  BlogPosting: "Article",
  NewsArticle: "Article",
  TechArticle: "Article",
  CollectionPage: "WebPage",
}

const canonType = (t: string) => TYPE_EQUIVALENCE[t] ?? t

function typesOf(node: JsonObject): string[] {
  const t = node["@type"]
  if (typeof t === "string") return [canonType(t)]
  if (Array.isArray(t)) {
    return t.filter((x): x is string => typeof x === "string").map(canonType)
  }
  return []
}

/** Parse a CMS structuredData JSON string into graph nodes. Returns null on
 *  empty/invalid input so a bad paste in Studio can never break a page. */
function parseCustomNodes(json?: string | null): JsonObject[] | null {
  if (!json?.trim()) return null
  try {
    const parsed: unknown = JSON.parse(json)
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null
    }
    const obj = parsed as JsonObject
    const rawNodes = Array.isArray(obj["@graph"]) ? obj["@graph"] : [obj]
    const nodes = rawNodes
      .filter(
        (n): n is JsonObject =>
          Boolean(n) && typeof n === "object" && !Array.isArray(n),
      )
      .map(({ ["@context"]: _context, ...node }) => node)
    return nodes.length ? nodes : null
  } catch {
    return null
  }
}

/** Merge CMS nodes into the auto-generated node list. Precedence:
 *  1. Site-identity types: CMS copies are always discarded.
 *  2. AUTO_WINS types: the auto node is kept and the CMS copy dropped whenever
 *     an auto node of the same canonical type exists; if the page emits no auto
 *     equivalent, the CMS node still applies.
 *  3. Everything else: the CMS node wins and the colliding auto node is
 *     dropped; non-colliding CMS nodes are appended. */
function mergeCustomNodes(
  autoNodes: (JsonObject | null | undefined)[],
  customJson?: string | null,
): (JsonObject | null | undefined)[] {
  const custom = parseCustomNodes(customJson)?.filter(
    n => !typesOf(n).some(t => SITE_IDENTITY_TYPES.has(t)),
  )
  if (!custom?.length) return autoNodes
  const autoTypes = new Set(
    autoNodes.flatMap(n => (n ? typesOf(n) : [])),
  )
  const applicable = custom.filter(
    n => !typesOf(n).some(t => AUTO_WINS_TYPES.has(t) && autoTypes.has(t)),
  )
  if (!applicable.length) return autoNodes
  const customTypes = new Set(applicable.flatMap(typesOf))
  const kept = autoNodes.filter(
    n => !n || !typesOf(n).some(t => customTypes.has(t)),
  )
  return [...kept, ...applicable]
}

function buildGraph(
  nodes: (JsonObject | null | undefined)[],
  customJson?: string | null,
): JsonObject {
  return {
    "@context": "https://schema.org",
    "@graph": mergeCustomNodes(nodes, customJson).filter((n): n is JsonObject =>
      Boolean(n),
    ),
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

/** Pull localized name/description/image/structuredData from a page's Sanity SEO doc. */
async function seoMeta(pageName: string, lang: Locale) {
  const seo = await getSEO(pageName)
  return {
    name: seo?.meta?.[lang]?.title ?? "",
    description: seo?.meta?.[lang]?.description,
    image: seo?.openGraph?.image?.url,
    structuredData: seo?.structuredData?.[lang],
  }
}

// ── Homepage ─────────────────────────────────────────────────────────────────

export async function getHomeGraph(lang: Locale): Promise<JsonObject> {
  const [{ layout, org }, meta] = await Promise.all([
    buildOrg(lang, { withOffers: true, withReviews: true }),
    seoMeta("home", lang),
  ])
  return buildGraph(
    [
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
    ],
    meta.structuredData,
  )
}

// ── Standard content pages (about, pricing, portfolio, contact, etc.) ────────

export async function getStandardGraph(args: {
  lang: Locale
  pageName: string
  href: Href
  crumbs: Crumb[]
  includePerson?: boolean
  withOffers?: boolean
  /** Localized FAQ items; emits a FAQPage node when present. */
  faqItems?: { question: string; answer: string }[]
  /** CMS structuredData JSON string; falls back to the page's seo doc. */
  structuredData?: string
}): Promise<JsonObject> {
  const { lang, pageName, href, crumbs, includePerson, withOffers } = args
  const [{ layout, org }, meta] = await Promise.all([
    buildOrg(lang, { withOffers }),
    seoMeta(pageName, lang),
  ])
  return buildGraph(
    [
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
      faqPageNode(args.faqItems ?? []),
      breadcrumbNode({ lang, pageHref: href, items: crumbs }),
    ],
    args.structuredData || meta.structuredData,
  )
}

// ── Individual service page ──────────────────────────────────────────────────

export async function getServiceGraph(args: {
  lang: Locale
  href: Href
  enSlug: string
  name: string
  /** Plain service category for schema `serviceType` (no SEO-title suffix). */
  serviceType?: string
  description?: string
  image?: string
  crumbs: Crumb[]
  price?: number
  unit?: "MONTH"
  /** Localized FAQ items; emits a FAQPage node when present. */
  faqItems?: { question: string; answer: string }[]
  /** CMS structuredData JSON string from the serviceItem's seo object. */
  structuredData?: string
}): Promise<JsonObject> {
  const {
    lang,
    href,
    name,
    serviceType,
    description,
    image,
    crumbs,
    price,
    unit,
  } = args
  const { layout, org } = await buildOrg(lang, { withOffers: true })
  return buildGraph(
    [
      org,
      webSiteNode(layout),
      serviceNode({ lang, name, serviceType, description, href, price, unit }),
      webPageNode({ lang, href, name, description, image, breadcrumb: true }),
      faqPageNode(args.faqItems ?? []),
      breadcrumbNode({ lang, pageHref: href, items: crumbs }),
    ],
    args.structuredData,
  )
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
  /** CMS structuredData JSON string; falls back to the page's seo doc. */
  structuredData?: string
}): Promise<JsonObject> {
  const { lang, pageName, href, crumbs, serviceName, serviceDescription } = args
  const [{ layout, org }, meta] = await Promise.all([
    buildOrg(lang, { withOffers: true }),
    seoMeta(pageName, lang),
  ])
  return buildGraph(
    [
      org,
      webSiteNode(layout),
      serviceNode({
        lang,
        name: serviceName,
        description: serviceDescription,
        href,
      }),
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
    ],
    args.structuredData || meta.structuredData,
  )
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
  /** CMS structuredData JSON string from the blog post's seo object. */
  structuredData?: string
}): Promise<JsonObject> {
  const { lang, href, title, description, image, datePublished, dateModified } =
    args
  const { layout, org } = await buildOrg(lang)
  return buildGraph(
    [
      org,
      webSiteNode(layout),
      // Auto WebPage so stale CMS WebPage copies (wrong-locale slugs) are
      // dropped by the AUTO_WINS rule instead of passing through.
      webPageNode({
        lang,
        href,
        name: title,
        description,
        image,
        breadcrumb: true,
      }),
      // Author is referenced by @id from the article; define it on-page so
      // validators don't have to resolve it from another URL.
      personNode(layout, lang),
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
    ],
    args.structuredData,
  )
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
  return buildGraph(
    [
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
    ],
    meta.structuredData,
  )
}
