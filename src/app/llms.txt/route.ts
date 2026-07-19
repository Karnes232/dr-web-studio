import { getServiceItemsSitemap } from "@/sanity/queries/services/serviceItem"
import { getNewestBlogPostDate } from "@/sanity/queries/blog/blog"
import { getSEO } from "@/sanity/queries/seo"
import { getContactEmail } from "@/sanity/queries/layout/generalLayout"
import { localizedUrl } from "@/lib/urls"
import { slugPair } from "@/lib/slugs"
import { SITE_URL } from "@/lib/site"
import type { Locale } from "@/lib/slugs"
import { LANDING_PAGE_ROUTES } from "@/lib/indexableRoutes"
import type { LandingPageSlug } from "@/lib/indexableRoutes"

// Generated /llms.txt — a concise, BILINGUAL index of the site for LLMs/AI
// agents. Lists key pages for both /en and /es; the full long-form content
// (blog post bodies, service descriptions, FAQs) lives in the per-language
// /llms-full.txt and /llms-full-es.txt files, which each language section
// points to. Mirrors src/app/sitemap.ts (localizedUrl + cached queries).
export const revalidate = 3600

type Href = Parameters<typeof localizedUrl>[0]
type Localized = { en: string; es: string }

const FALLBACK_SUMMARY: Record<Locale, string> = {
  en:
    "DR Web Studio is a freelance web development studio building fast, modern, " +
    "multilingual websites and web apps for businesses in the Dominican Republic.",
  es:
    "DR Web Studio es un estudio freelance de desarrollo web que crea sitios y " +
    "aplicaciones web rápidos, modernos y multilingües para empresas en la República Dominicana.",
}

const LOCALE_LABEL: Record<Locale, string> = { en: "English", es: "Español" }

const SUBHEADINGS: Record<
  Locale,
  { main: string; services: string; landing: string; full: string }
> = {
  en: {
    main: "Main Pages",
    services: "Services",
    landing: "Location & Industry Pages",
    full: "Full Content",
  },
  es: {
    main: "Páginas Principales",
    services: "Servicios",
    landing: "Páginas de Ubicación e Industria",
    full: "Contenido Completo",
  },
}

const HOME: { title: Localized; description: Localized } = {
  title: { en: "Home", es: "Inicio" },
  description: {
    en: "Custom website development in the Dominican Republic.",
    es: "Desarrollo web a medida en la República Dominicana.",
  },
}

// Curated pages. `key` matches the internal app-router pathname (see
// routing.pathnames); localizedUrl resolves it to the right /en or /es URL.
const MAIN_PAGES: { key: Href; title: Localized; description: Localized }[] = [
  {
    key: "/our-services",
    title: { en: "Services", es: "Servicios" },
    description: {
      en: "Web development, web design, and e-commerce services.",
      es: "Servicios de desarrollo web, diseño web y comercio electrónico.",
    },
  },
  {
    key: "/pricing",
    title: { en: "Pricing", es: "Precios" },
    description: {
      en: "Packages and pricing for websites and web apps.",
      es: "Paquetes y precios para sitios y aplicaciones web.",
    },
  },
  {
    key: "/portfolio",
    title: { en: "Portfolio", es: "Portafolio" },
    description: {
      en: "Selected client projects and case studies.",
      es: "Proyectos de clientes seleccionados y casos de estudio.",
    },
  },
  {
    key: "/about-me",
    title: { en: "About", es: "Sobre Mí" },
    description: {
      en: "About DR Web Studio and James Karnes.",
      es: "Acerca de DR Web Studio y James Karnes.",
    },
  },
  {
    key: "/contact",
    title: { en: "Contact", es: "Contacto" },
    description: {
      en: "Get in touch to start a project.",
      es: "Ponte en contacto para iniciar un proyecto.",
    },
  },
  {
    key: "/faqs",
    title: { en: "FAQs", es: "Preguntas Frecuentes" },
    description: {
      en: "Common questions about working with the studio.",
      es: "Preguntas comunes sobre trabajar con el estudio.",
    },
  },
  {
    key: "/project-planner",
    title: { en: "Project Planner", es: "Planificador de Proyectos" },
    description: {
      en: "Scope and estimate a project brief online.",
      es: "Define y estima un proyecto en línea.",
    },
  },
]

// SEO landing routes. Keyed by LandingPageSlug so adding a route to
// LANDING_PAGE_ROUTES without an entry here is a compile error — the section
// can never drift out of sync with the sitemap again. localizedUrl resolves
// the English slugs via routing.pathnames.
const LANDING_PAGE_META: Record<
  LandingPageSlug,
  { title: Localized; description: Localized }
> = {
  "desarrollo-web-republica-dominicana": {
    title: {
      en: "Web Development in the Dominican Republic",
      es: "Desarrollo Web en la República Dominicana",
    },
    description: {
      en: "Custom web development for Dominican businesses.",
      es: "Desarrollo web a medida para empresas dominicanas.",
    },
  },
  "diseno-web-republica-dominicana": {
    title: {
      en: "Web Design in the Dominican Republic",
      es: "Diseño Web en la República Dominicana",
    },
    description: {
      en: "Modern, responsive web design services.",
      es: "Servicios de diseño web moderno y responsivo.",
    },
  },
  "desarrollo-web-punta-cana": {
    title: {
      en: "Web Development in Punta Cana",
      es: "Desarrollo Web en Punta Cana",
    },
    description: {
      en: "Web development services for the Punta Cana area.",
      es: "Servicios de desarrollo web para la zona de Punta Cana.",
    },
  },
  "desarrollo-ecommerce-republica-dominicana": {
    title: {
      en: "E-commerce Development in the Dominican Republic",
      es: "Desarrollo de E-commerce en la República Dominicana",
    },
    description: {
      en: "Online stores and e-commerce solutions.",
      es: "Tiendas en línea y soluciones de comercio electrónico.",
    },
  },
  "mantenimiento-web-republica-dominicana": {
    title: {
      en: "Website Maintenance in the Dominican Republic",
      es: "Mantenimiento Web en la República Dominicana",
    },
    description: {
      en: "Ongoing website maintenance and support.",
      es: "Mantenimiento y soporte continuo de sitios web.",
    },
  },
  "diseno-de-paginas-web-santo-domingo": {
    title: {
      en: "Web Design in Santo Domingo",
      es: "Diseño de Páginas Web en Santo Domingo",
    },
    description: {
      en: "Web design for businesses in Santo Domingo.",
      es: "Diseño web para empresas en Santo Domingo.",
    },
  },
  "diseno-de-paginas-web-santiago": {
    title: {
      en: "Web Design in Santiago",
      es: "Diseño de Páginas Web en Santiago",
    },
    description: {
      en: "Web design for businesses in Santiago de los Caballeros.",
      es: "Diseño web para empresas en Santiago de los Caballeros.",
    },
  },
  "diseno-de-paginas-web-la-romana": {
    title: {
      en: "Web Design in La Romana",
      es: "Diseño de Páginas Web en La Romana",
    },
    description: {
      en: "Web design for businesses in La Romana.",
      es: "Diseño web para empresas en La Romana.",
    },
  },
  "diseno-de-paginas-web-higuey": {
    title: {
      en: "Web Design in Higüey",
      es: "Diseño de Páginas Web en Higüey",
    },
    description: {
      en: "Web design for businesses in Higüey.",
      es: "Diseño web para empresas en Higüey.",
    },
  },
  "diseno-de-paginas-web-san-pedro-de-macoris": {
    title: {
      en: "Web Design in San Pedro de Macorís",
      es: "Diseño de Páginas Web en San Pedro de Macorís",
    },
    description: {
      en: "Web design for businesses in San Pedro de Macorís.",
      es: "Diseño web para empresas en San Pedro de Macorís.",
    },
  },
  "diseno-de-paginas-web-punta-cana": {
    title: {
      en: "Web Design in Punta Cana",
      es: "Diseño de Páginas Web en Punta Cana",
    },
    description: {
      en: "Web design for businesses in Punta Cana and Bávaro.",
      es: "Diseño web para empresas en Punta Cana y Bávaro.",
    },
  },
  "diseno-de-paginas-web-puerto-plata": {
    title: {
      en: "Web Design in Puerto Plata",
      es: "Diseño de Páginas Web en Puerto Plata",
    },
    description: {
      en: "Web design for businesses in Puerto Plata.",
      es: "Diseño web para empresas en Puerto Plata.",
    },
  },
  "diseno-de-paginas-web-las-terrenas": {
    title: {
      en: "Web Design in Las Terrenas",
      es: "Diseño de Páginas Web en Las Terrenas",
    },
    description: {
      en: "Web design for businesses in Las Terrenas and Samaná.",
      es: "Diseño web para empresas en Las Terrenas y Samaná.",
    },
  },
  "paginas-web-para-inmobiliarias": {
    title: {
      en: "Web Design for Real Estate Agents",
      es: "Páginas Web para Inmobiliarias",
    },
    description: {
      en: "Websites with property listings for real estate agencies.",
      es: "Sitios web con listados de propiedades para inmobiliarias.",
    },
  },
  "paginas-web-para-hoteles": {
    title: {
      en: "Web Design for Hotels",
      es: "Páginas Web para Hoteles",
    },
    description: {
      en: "Websites with direct booking for hotels and resorts.",
      es: "Sitios web con reservas directas para hoteles y resorts.",
    },
  },
  "paginas-web-para-restaurantes": {
    title: {
      en: "Web Design for Restaurants",
      es: "Páginas Web para Restaurantes",
    },
    description: {
      en: "Websites with menus and reservations for restaurants.",
      es: "Sitios web con menús y reservaciones para restaurantes.",
    },
  },
  "paginas-web-para-tour-operadores": {
    title: {
      en: "Web Design for Tour Operators",
      es: "Páginas Web para Tour Operadores",
    },
    description: {
      en: "Websites with tour booking for excursion operators.",
      es: "Sitios web con reservas de tours para operadores de excursiones.",
    },
  },
  "paginas-web-para-alquileres-vacacionales": {
    title: {
      en: "Web Design for Vacation Rentals",
      es: "Páginas Web para Alquileres Vacacionales",
    },
    description: {
      en: "Direct-booking websites for vacation rental owners.",
      es: "Sitios web con reservas directas para alquileres vacacionales.",
    },
  },
  "paginas-web-para-bodas-y-eventos": {
    title: {
      en: "Web Design for Weddings and Events",
      es: "Páginas Web para Bodas y Eventos",
    },
    description: {
      en: "Websites for wedding planners and event businesses.",
      es: "Sitios web para organizadores de bodas y eventos.",
    },
  },
  "paginas-web-para-dentistas": {
    title: {
      en: "Web Design for Dentists",
      es: "Páginas Web para Dentistas",
    },
    description: {
      en: "Websites with appointment booking for dental clinics.",
      es: "Sitios web con citas en línea para clínicas dentales.",
    },
  },
  "paginas-web-para-abogados": {
    title: {
      en: "Web Design for Lawyers",
      es: "Páginas Web para Abogados",
    },
    description: {
      en: "Authority-building websites for law firms.",
      es: "Sitios web que proyectan autoridad para bufetes de abogados.",
    },
  },
  "paginas-web-para-constructoras": {
    title: {
      en: "Web Design for Construction Companies",
      es: "Páginas Web para Constructoras",
    },
    description: {
      en: "Project-showcase websites for construction companies and architects.",
      es: "Sitios web con portafolio de obras para constructoras y arquitectos.",
    },
  },
  "paginas-web-para-salones-de-belleza": {
    title: {
      en: "Web Design for Salons and Spas",
      es: "Páginas Web para Salones de Belleza",
    },
    description: {
      en: "Websites with online booking for salons and spas.",
      es: "Sitios web con reservas en línea para salones de belleza y spas.",
    },
  },
}

// Long-form pillar page, listed with the landing pages.
const GUIDE_PAGE: { key: Href; title: Localized; description: Localized } = {
  key: "/guia-completa-desarrollo-web-moderno-negocios",
  title: {
    en: "Complete Guide to Modern Web Development for Business",
    es: "Guía Completa de Desarrollo Web Moderno para Negocios",
  },
  description: {
    en: "In-depth guide to modern web development.",
    es: "Guía detallada del desarrollo web moderno.",
  },
}

const OPTIONAL_PAGES: { key: Href; title: Localized }[] = [
  {
    key: "/privacy-policy",
    title: { en: "Privacy Policy", es: "Política de Privacidad" },
  },
  {
    key: "/terms-of-service",
    title: { en: "Terms of Service", es: "Términos de Servicio" },
  },
]

// Pointer to the per-language full-content file.
const FULL_FILE: Record<Locale, { url: string; label: string }> = {
  en: {
    url: `${SITE_URL}/llms-full.txt`,
    label: "Full content — all blog posts, services, and FAQs",
  },
  es: {
    url: `${SITE_URL}/llms-full-es.txt`,
    label:
      "Contenido completo — todos los artículos, servicios y preguntas frecuentes",
  },
}

function line(title: string, url: string, description?: string): string {
  return description
    ? `- [${title}](${url}): ${description}`
    : `- [${title}](${url})`
}

function languageSection(
  locale: Locale,
  services: {
    title: Localized
    slug: { current: string }
    slugEs?: { current: string }
  }[],
): string {
  const sub = SUBHEADINGS[locale]
  const parts: string[] = [`## ${LOCALE_LABEL[locale]}`]

  parts.push(
    [
      `### ${sub.main}`,
      line(
        HOME.title[locale],
        localizedUrl("/", locale),
        HOME.description[locale],
      ),
      ...MAIN_PAGES.map(p =>
        line(
          p.title[locale],
          localizedUrl(p.key, locale),
          p.description[locale],
        ),
      ),
    ].join("\n"),
  )

  if (services.length > 0) {
    parts.push(
      [
        `### ${sub.services}`,
        ...services.map(s =>
          line(
            s.title[locale],
            localizedUrl(
              {
                pathname: "/our-services/[slug]",
                params: { slug: slugPair(s)[locale] },
              },
              locale,
            ),
          ),
        ),
      ].join("\n"),
    )
  }

  parts.push(
    [
      `### ${sub.landing}`,
      ...LANDING_PAGE_ROUTES.map(route => {
        const meta = LANDING_PAGE_META[route.slice(1) as LandingPageSlug]
        return line(
          meta.title[locale],
          localizedUrl(route, locale),
          meta.description[locale],
        )
      }),
      line(
        GUIDE_PAGE.title[locale],
        localizedUrl(GUIDE_PAGE.key, locale),
        GUIDE_PAGE.description[locale],
      ),
      ...OPTIONAL_PAGES.map(p =>
        line(p.title[locale], localizedUrl(p.key, locale)),
      ),
    ].join("\n"),
  )

  parts.push(
    [
      `### ${sub.full}`,
      line(FULL_FILE[locale].label, FULL_FILE[locale].url),
    ].join("\n"),
  )

  return parts.join("\n\n")
}

export async function GET() {
  const [home, services, contactEmail, newestPostDate] = await Promise.all([
    getSEO("home"),
    getServiceItemsSitemap(),
    getContactEmail(),
    getNewestBlogPostDate(),
  ])

  const summaryEn = (home?.meta.en.description ?? FALLBACK_SUMMARY.en).trim()
  const summaryEs = (home?.meta.es.description ?? FALLBACK_SUMMARY.es).trim()

  // Machine-readable metadata block (llms.txt convention) so AI agents can
  // resolve authorship, contact, licensing, and available languages.
  const metadata = [
    `> Author: James Karnes (DR Web Studio)`,
    `> Contact: ${contactEmail ?? `${SITE_URL}/en/contact`}`,
    `> License: RSL 1.0 — citation with attribution permitted`,
    `> Language: en, es`,
    ...(newestPostDate
      ? [
          `> Last-Updated: ${new Date(newestPostDate)
            .toISOString()
            .slice(0, 10)}`,
        ]
      : []),
  ].join("\n")

  const body =
    [
      `# DR Web Studio`,
      `> ${summaryEn}`,
      `> ${summaryEs}`,
      metadata,
      languageSection("en", services),
      languageSection("es", services),
    ].join("\n\n") + "\n"

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
