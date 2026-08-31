import type { AppPathnames } from "@/i18n/routing"
import type { Locale } from "@/lib/slugs"

export type StaticPathname = Exclude<
  AppPathnames,
  "/blog/[slug]" | "/our-services/[slug]"
>

/** SEO landing pages (internal folder names). Both locales included in sitemap. */
export const LANDING_PAGE_ROUTES = [
  "/desarrollo-web-republica-dominicana",
  "/diseno-web-republica-dominicana",
  "/desarrollo-web-punta-cana",
  "/desarrollo-ecommerce-republica-dominicana",
  "/mantenimiento-web-republica-dominicana",
  "/diseno-de-paginas-web-santo-domingo",
  "/diseno-de-paginas-web-santiago",
  "/diseno-de-paginas-web-la-romana",
  "/diseno-de-paginas-web-higuey",
  "/diseno-de-paginas-web-san-pedro-de-macoris",
  "/diseno-de-paginas-web-punta-cana",
  "/diseno-de-paginas-web-puerto-plata",
  "/diseno-de-paginas-web-las-terrenas",
  "/paginas-web-para-inmobiliarias",
  "/paginas-web-para-hoteles",
  "/paginas-web-para-restaurantes",
  "/paginas-web-para-tour-operadores",
  "/paginas-web-para-alquileres-vacacionales",
  "/paginas-web-para-bodas-y-eventos",
  "/paginas-web-para-dentistas",
  "/paginas-web-para-abogados",
  "/paginas-web-para-constructoras",
  "/paginas-web-para-salones-de-belleza",
] as const satisfies readonly StaticPathname[]

export type LandingPageSlug =
  (typeof LANDING_PAGE_ROUTES)[number] extends `/${infer S}` ? S : never

/** The 8 city landing pages — surfaced in the footer and cross-linked between
 *  neighboring cities (they were reachable only via /sitemap before). */
export const CITY_PAGE_ROUTES = [
  "/diseno-de-paginas-web-santo-domingo",
  "/diseno-de-paginas-web-santiago",
  "/diseno-de-paginas-web-la-romana",
  "/diseno-de-paginas-web-higuey",
  "/diseno-de-paginas-web-san-pedro-de-macoris",
  "/diseno-de-paginas-web-punta-cana",
  "/diseno-de-paginas-web-puerto-plata",
  "/diseno-de-paginas-web-las-terrenas",
] as const satisfies readonly StaticPathname[]

export type CityPageRoute = (typeof CITY_PAGE_ROUTES)[number]

/** City display names (proper nouns — identical in both locales). */
export const CITY_NAMES: Record<CityPageRoute, string> = {
  "/diseno-de-paginas-web-santo-domingo": "Santo Domingo",
  "/diseno-de-paginas-web-santiago": "Santiago",
  "/diseno-de-paginas-web-la-romana": "La Romana",
  "/diseno-de-paginas-web-higuey": "Higüey",
  "/diseno-de-paginas-web-san-pedro-de-macoris": "San Pedro de Macorís",
  "/diseno-de-paginas-web-punta-cana": "Punta Cana",
  "/diseno-de-paginas-web-puerto-plata": "Puerto Plata",
  "/diseno-de-paginas-web-las-terrenas": "Las Terrenas",
}

/** Geographically nearby cities for each city page's "also serving" links. */
export const CITY_ADJACENCY: Record<CityPageRoute, CityPageRoute[]> = {
  "/diseno-de-paginas-web-santo-domingo": [
    "/diseno-de-paginas-web-san-pedro-de-macoris",
    "/diseno-de-paginas-web-la-romana",
    "/diseno-de-paginas-web-santiago",
  ],
  "/diseno-de-paginas-web-santiago": [
    "/diseno-de-paginas-web-puerto-plata",
    "/diseno-de-paginas-web-santo-domingo",
  ],
  "/diseno-de-paginas-web-la-romana": [
    "/diseno-de-paginas-web-san-pedro-de-macoris",
    "/diseno-de-paginas-web-higuey",
    "/diseno-de-paginas-web-punta-cana",
  ],
  "/diseno-de-paginas-web-higuey": [
    "/diseno-de-paginas-web-punta-cana",
    "/diseno-de-paginas-web-la-romana",
  ],
  "/diseno-de-paginas-web-san-pedro-de-macoris": [
    "/diseno-de-paginas-web-santo-domingo",
    "/diseno-de-paginas-web-la-romana",
  ],
  "/diseno-de-paginas-web-punta-cana": [
    "/diseno-de-paginas-web-higuey",
    "/diseno-de-paginas-web-la-romana",
  ],
  "/diseno-de-paginas-web-puerto-plata": [
    "/diseno-de-paginas-web-santiago",
    "/diseno-de-paginas-web-las-terrenas",
  ],
  "/diseno-de-paginas-web-las-terrenas": [
    "/diseno-de-paginas-web-puerto-plata",
    "/diseno-de-paginas-web-santo-domingo",
  ],
}

/** The two national landing pages that serve adjacent intents. They are
 *  reachable only via /sitemap, so these cross-links are their main source of
 *  internal PageRank — and the descriptive anchor text is what tells Google
 *  which page owns "desarrollo" and which owns "diseño". */
export const RELATED_LANDING_ROUTES = [
  "/desarrollo-web-republica-dominicana",
  "/diseno-web-republica-dominicana",
] as const satisfies readonly StaticPathname[]

export type RelatedLandingRoute = (typeof RELATED_LANDING_ROUTES)[number]

export const RELATED_LANDING_PAGES: Record<
  RelatedLandingRoute,
  RelatedLandingRoute[]
> = {
  "/desarrollo-web-republica-dominicana": ["/diseno-web-republica-dominicana"],
  "/diseno-web-republica-dominicana": ["/desarrollo-web-republica-dominicana"],
}

/** Anchor text and supporting copy for the cross-links above. Deliberately
 *  descriptive rather than a bare page name — the anchor is the ranking signal
 *  that separates these two pages in search results. */
export const RELATED_LANDING_COPY: Record<
  RelatedLandingRoute,
  Record<Locale, { label: string; blurb: string }>
> = {
  "/desarrollo-web-republica-dominicana": {
    es: {
      label: "Desarrollo Web en República Dominicana",
      blurb:
        "¿Necesitas la parte técnica — velocidad, integraciones, CMS y tienda en línea? Así construimos sitios a medida.",
    },
    en: {
      label: "Web Development in the Dominican Republic",
      blurb:
        "Need the technical build — speed, integrations, CMS and online store? Here is how we develop custom sites.",
    },
  },
  "/diseno-web-republica-dominicana": {
    es: {
      label: "Diseño de Páginas Web en República Dominicana",
      blurb:
        "¿Te interesa más el diseño visual — marca, maquetación y experiencia de usuario? Así abordamos el diseño.",
    },
    en: {
      label: "Custom Web Design in the Dominican Republic",
      blurb:
        "More interested in the visual side — brand, layout and user experience? Here is how we approach design.",
    },
  },
}

const MAIN_INDEXABLE_ROUTES = [
  "/",
  "/about-me",
  "/blog",
  "/contact",
  "/faqs",
  "/guia-completa-desarrollo-web-moderno-negocios",
  "/our-services",
  "/pricing",
  "/portfolio",
  "/project-planner",
] as const satisfies readonly StaticPathname[]

const LEGAL_INDEXABLE_ROUTES = [
  "/privacy-policy",
  "/terms-of-service",
] as const satisfies readonly StaticPathname[]

/**
 * Static pathname keys emitted in sitemap.xml (both locales).
 * Excludes /sitemap, /custom-payment, /payment-success (noindex / utility).
 */
export const INDEXABLE_STATIC_ROUTES: StaticPathname[] = [
  ...MAIN_INDEXABLE_ROUTES,
  ...LANDING_PAGE_ROUTES,
  ...LEGAL_INDEXABLE_ROUTES,
]
