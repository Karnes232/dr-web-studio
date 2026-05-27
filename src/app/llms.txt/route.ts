import { getServiceItemsSitemap } from "@/sanity/queries/services/serviceItem"
import { getSEO } from "@/sanity/queries/seo"
import { localizedUrl } from "@/lib/urls"
import { slugPair } from "@/lib/slugs"
import { SITE_URL } from "@/lib/site"
import type { Locale } from "@/lib/slugs"

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

// SEO landing routes. Keys are the internal (Spanish) folder names; localizedUrl
// resolves the English slugs via routing.pathnames.
const LANDING_PAGES: { key: Href; title: Localized; description: Localized }[] =
  [
    {
      key: "/desarrollo-web-republica-dominicana",
      title: {
        en: "Web Development in the Dominican Republic",
        es: "Desarrollo Web en la República Dominicana",
      },
      description: {
        en: "Custom web development for Dominican businesses.",
        es: "Desarrollo web a medida para empresas dominicanas.",
      },
    },
    {
      key: "/diseno-web-republica-dominicana",
      title: {
        en: "Web Design in the Dominican Republic",
        es: "Diseño Web en la República Dominicana",
      },
      description: {
        en: "Modern, responsive web design services.",
        es: "Servicios de diseño web moderno y responsivo.",
      },
    },
    {
      key: "/desarrollo-ecommerce-republica-dominicana",
      title: {
        en: "E-commerce Development in the Dominican Republic",
        es: "Desarrollo de E-commerce en la República Dominicana",
      },
      description: {
        en: "Online stores and e-commerce solutions.",
        es: "Tiendas en línea y soluciones de comercio electrónico.",
      },
    },
    {
      key: "/desarrollo-web-punta-cana",
      title: {
        en: "Web Development in Punta Cana",
        es: "Desarrollo Web en Punta Cana",
      },
      description: {
        en: "Web development services for the Punta Cana area.",
        es: "Servicios de desarrollo web para la zona de Punta Cana.",
      },
    },
    {
      key: "/mantenimiento-web-republica-dominicana",
      title: {
        en: "Website Maintenance in the Dominican Republic",
        es: "Mantenimiento Web en la República Dominicana",
      },
      description: {
        en: "Ongoing website maintenance and support.",
        es: "Mantenimiento y soporte continuo de sitios web.",
      },
    },
    {
      key: "/guia-completa-desarrollo-web-moderno-negocios",
      title: {
        en: "Complete Guide to Modern Web Development for Business",
        es: "Guía Completa de Desarrollo Web Moderno para Negocios",
      },
      description: {
        en: "In-depth guide to modern web development.",
        es: "Guía detallada del desarrollo web moderno.",
      },
    },
  ]

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
      ...LANDING_PAGES.map(p =>
        line(
          p.title[locale],
          localizedUrl(p.key, locale),
          p.description[locale],
        ),
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
  const [home, services] = await Promise.all([
    getSEO("home"),
    getServiceItemsSitemap(),
  ])

  const summaryEn = (home?.meta.en.description ?? FALLBACK_SUMMARY.en).trim()
  const summaryEs = (home?.meta.es.description ?? FALLBACK_SUMMARY.es).trim()

  const body =
    [
      `# DR Web Studio`,
      `> ${summaryEn}`,
      `> ${summaryEs}`,
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
