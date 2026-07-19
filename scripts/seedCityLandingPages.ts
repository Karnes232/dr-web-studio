/**
 * Seed script — City Landing Pages (Santo Domingo + Santiago)
 *
 * Creates TWO fully-populated bilingual (en/es) `landingPage` documents
 * targeting local-intent keywords:
 *
 *   1. slug "diseno-de-paginas-web-santo-domingo"
 *      → target: "diseño de páginas web en Santo Domingo"
 *   2. slug "diseno-de-paginas-web-santiago"
 *      → target: "diseño de páginas web en Santiago" / "diseño web Santiago"
 *
 * The copy is INTENTIONALLY DIFFERENT between the two cities (services angle,
 * why-us, FAQs). Do not homogenize them — identical pages with only the city
 * name swapped are treated by Google as doorway pages and won't rank.
 *
 * Idempotent: safe to run repeatedly (uses createOrReplace). Unique _ids
 * (hyphens only — dotted _ids are invisible to the anonymous public client).
 *
 * ── AFTER SEEDING, DO THESE 4 THINGS ────────────────────────────────────────
 *
 * 1. ROUTES — create route folders mirroring an existing landing page
 *    (e.g. copy src/app/(root)/[lang]/desarrollo-web-republica-dominicana/):
 *      src/app/(root)/[lang]/diseno-de-paginas-web-santo-domingo/page.tsx
 *      src/app/(root)/[lang]/diseno-de-paginas-web-santiago/page.tsx
 *    and fetch with getLandingPage("diseno-de-paginas-web-santo-domingo", lang)
 *    / getLandingPage("diseno-de-paginas-web-santiago", lang).
 *
 * 2. METADATA — if the route's generateMetadata doesn't derive title/description
 *    from this document, set them per page:
 *      SD  es title: "Diseño de Páginas Web en Santo Domingo | DR Web Studio"
 *      SD  es desc:  "Diseño de páginas web profesionales en Santo Domingo.
 *                     Sitios rápidos, modernos y optimizados para Google.
 *                     Atendemos todo el Gran Santo Domingo. Cotización gratis."
 *      STI es title: "Diseño de Páginas Web en Santiago | DR Web Studio"
 *      STI es desc:  "Diseño de páginas web para empresas de Santiago y el
 *                     Cibao. Sitios bilingües, rápidos y optimizados para
 *                     Google. Ideal para comercio, industria y exportadores."
 *      SD  en title: "Web Design in Santo Domingo | DR Web Studio"
 *      STI en title: "Web Design in Santiago de los Caballeros | DR Web Studio"
 *
 * 3. INTERNAL LINKS (hub & spoke) — the national page
 *    /es/diseno-web-republica-dominicana is the hub; these two are spokes:
 *      • From the national diseño page: one contextual link to each city page
 *        (anchors: "diseño de páginas web en Santo Domingo",
 *                  "diseño de páginas web en Santiago").
 *      • From each city page's body/FAQ: one link back to the hub and one to
 *        the homepage (/es) — anchor "desarrollo web en República Dominicana".
 *      • Cross-link the two city pages to each other once.
 *      • Add one contextual link to each city page from relevant blog posts.
 *
 * 4. SITEMAP — confirm both slugs are emitted in sitemap.xml for en + es and
 *    that hreflang alternates are generated like the other landing pages.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seedCityLandingPages.ts
 *
 * Requires SANITY_API_TOKEN (write) in .env.local.
 */

import { createClient } from "@sanity/client"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-06-01",
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

// ─────────────────────────────────────────────────────────────────────────────
// Helpers (same conventions as seedExampleLandingPage.ts)
// ─────────────────────────────────────────────────────────────────────────────

let _keyCounter = 0
const key = () => `key${++_keyCounter}`

const loc = (en: string, es: string) => ({ en, es })

const block = (text: string) => [
  {
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  },
]
const locBlocks = (en: string, es: string) => ({
  en: block(en),
  es: block(es),
})

// ─────────────────────────────────────────────────────────────────────────────
// structuredData — city-scoped Service nodes
// ─────────────────────────────────────────────────────────────────────────────
//
// The app auto-generates the core graph (Organization/LocalBusiness, WebSite,
// Service, WebPage, FAQPage, BreadcrumbList) via getLandingGraph. Per
// mergeCustomNodes, a custom Service node REPLACES the auto-generated one —
// intentional here: a Service scoped to the city via `areaServed` is the one
// geo signal the generic graph can't express.
//
// IMPORTANT — two things to verify against src/lib/schema/graph.ts:
//   1. @id convention: if the auto WebPage node references the Service by @id,
//      match that convention below (currently "{pageUrl}#service").
//   2. EN URLs: these assume the same slug under /en/. If your English landing
//      routes use translated slugs (like web-design-dominican-republic does),
//      update the two EN serviceUrl/@id values accordingly.
//
// Deliberately NOT included: a city street address (the business is in Punta
// Cana — areaServed is the honest way to claim a service area) and pricing
// (avoids schema/page mismatches when prices change).

const BASE = "https://www.dr-webstudio.com"

const serviceNode = (o: {
  url: string
  name: string
  serviceType: string
  description: string
  areaServed: Record<string, string>[]
}) =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${o.url}#service`,
        name: o.name,
        serviceType: o.serviceType,
        description: o.description,
        provider: {
          "@type": "Organization",
          name: "DR Web Studio",
          url: BASE,
        },
        areaServed: o.areaServed,
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: o.url,
          availableLanguage: ["es", "en"],
        },
      },
    ],
  })

const sdAreas = [
  { "@type": "City", name: "Santo Domingo" },
  { "@type": "AdministrativeArea", name: "Distrito Nacional" },
  { "@type": "City", name: "Santo Domingo Este" },
  { "@type": "City", name: "Santo Domingo Norte" },
  { "@type": "City", name: "Santo Domingo Oeste" },
]

const stiAreas = [
  { "@type": "City", name: "Santiago de los Caballeros" },
  { "@type": "AdministrativeArea", name: "Provincia Santiago" },
  { "@type": "AdministrativeArea", name: "Región del Cibao" },
]

const sdCityServiceEs = serviceNode({
  url: `${BASE}/es/diseno-de-paginas-web-santo-domingo`,
  name: "Diseño de Páginas Web en Santo Domingo",
  serviceType: "Diseño y desarrollo de páginas web",
  description:
    "Diseño de páginas web profesionales, rápidas y bilingües para negocios en todo el Gran Santo Domingo, República Dominicana.",
  areaServed: sdAreas,
})

const sdCityServiceEn = serviceNode({
  url: `${BASE}/en/diseno-de-paginas-web-santo-domingo`,
  name: "Web Design in Santo Domingo",
  serviceType: "Web design and development",
  description:
    "Professional, fast, bilingual web design for businesses across Greater Santo Domingo, Dominican Republic.",
  areaServed: sdAreas,
})

const stiCityServiceEs = serviceNode({
  url: `${BASE}/es/diseno-de-paginas-web-santiago`,
  name: "Diseño de Páginas Web en Santiago de los Caballeros",
  serviceType: "Diseño y desarrollo de páginas web",
  description:
    "Diseño de páginas web bilingües para comercios, industrias y exportadores en Santiago de los Caballeros y la región del Cibao.",
  areaServed: stiAreas,
})

const stiCityServiceEn = serviceNode({
  url: `${BASE}/en/diseno-de-paginas-web-santiago`,
  name: "Web Design in Santiago de los Caballeros",
  serviceType: "Web design and development",
  description:
    "Bilingual web design for retail, industry and exporters in Santiago de los Caballeros and the Cibao region, Dominican Republic.",
  areaServed: stiAreas,
})

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 1 — Santo Domingo
// Angle: the capital = the country's biggest, most competitive digital market.
// Audience: professional services, retail/delivery e-commerce, restaurants,
// clinics, startups in the Distrito Nacional + SD Este/Norte/Oeste.
// ─────────────────────────────────────────────────────────────────────────────

const santoDomingoPage: Record<string, unknown> = {
  _type: "landingPage",
  _id: "landingPage-diseno-paginas-web-santo-domingo",
  title: "Diseño de Páginas Web en Santo Domingo (City Landing Page)",
  slug: { _type: "slug", current: "diseno-de-paginas-web-santo-domingo" },

  // ── HERO ──────────────────────────────────────────────────────────────────
  hero: {
    headline: loc(
      "Web Design in Santo Domingo",
      "Diseño de Páginas Web en Santo Domingo",
    ),
    subheadline: loc(
      "Fast, modern websites built to help Santo Domingo businesses stand out in the country's most competitive digital market — and show up on Google when customers search for you.",
      "Páginas web rápidas y modernas que ayudan a negocios de Santo Domingo a destacar en el mercado digital más competitivo del país — y a aparecer en Google cuando tus clientes te buscan.",
    ),
    primaryCta: loc("Get a Free Quote", "Solicitar Cotización Gratis"),
    primaryCtaHref: "/contact",
    secondaryCta: loc("View Our Portfolio", "Ver Nuestro Portafolio"),
    secondaryCtaHref: "/portfolio",
    badge: loc(
      "Serving businesses across Greater Santo Domingo — Distrito Nacional, Este, Norte and Oeste",
      "Atendemos negocios en todo el Gran Santo Domingo — Distrito Nacional, Este, Norte y Oeste",
    ),
  },

  // ── STATS BAR (the same verified stats as your live landing pages) ────────
  statsBar: [
    {
      _key: key(),
      value: "50+",
      label: loc("Projects Delivered", "Proyectos Entregados"),
    },
    {
      _key: key(),
      value: "5",
      label: loc("Client Rating", "Calificación de Clientes"),
    },
    {
      _key: key(),
      value: "150%",
      label: loc("Avg. Sales Growth", "Crecimiento Promedio en Ventas"),
    },
    {
      _key: key(),
      value: "1yr",
      label: loc("Free Hosting Included", "Hosting Gratis Incluido"),
    },
  ],

  // ── SERVICES GRID ─────────────────────────────────────────────────────────
  servicesGrid: {
    sectionTitle: loc(
      "Web Design for Santo Domingo Businesses",
      "Diseño de Páginas Web para Negocios de Santo Domingo",
    ),
    sectionSubtitle: locBlocks(
      "In the capital, your customers compare you against dozens of competitors before they call. These are the sites we build to win that comparison.",
      "En la capital, tus clientes te comparan con decenas de competidores antes de llamar. Estas son las páginas web que construimos para ganar esa comparación.",
    ),
    items: [
      {
        _key: key(),
        icon: "Building2",
        title: loc(
          "Corporate & Professional Websites",
          "Páginas Web Corporativas y Profesionales",
        ),
        description: locBlocks(
          "Authority-building websites for law firms, clinics, consultancies, real estate and financial services in the Distrito Nacional — designed to convert high-value inquiries.",
          "Sitios que transmiten autoridad para bufetes, clínicas, consultoras, inmobiliarias y servicios financieros del Distrito Nacional — diseñados para convertir consultas de alto valor.",
        ),
        linkSlug: "custom-websites",
      },
      {
        _key: key(),
        icon: "ShoppingCart",
        title: loc(
          "Online Stores with Delivery Focus",
          "Tiendas Online con Enfoque en Delivery",
        ),
        description: locBlocks(
          "E-commerce built for how the capital buys: mobile-first, fast on cellular data, with secure payments and order flows ready for same-day delivery across Greater Santo Domingo.",
          "E-commerce hecho para cómo compra la capital: mobile-first, rápido en datos móviles, con pagos seguros y flujos de pedido listos para entregas el mismo día en el Gran Santo Domingo.",
        ),
        linkSlug: "ecommerce",
      },
      {
        _key: key(),
        icon: "Target",
        title: loc(
          "Landing Pages for Ad Campaigns",
          "Landing Pages para Campañas Publicitarias",
        ),
        description: locBlocks(
          "Running Google Ads or Instagram campaigns aimed at capital audiences? We build focused landing pages that turn that paid traffic into leads instead of bounces.",
          "¿Corres campañas de Google Ads o Instagram dirigidas al público capitalino? Creamos landing pages enfocadas que convierten ese tráfico pagado en clientes, no en rebotes.",
        ),
        linkSlug: "landing-pages",
      },
    ],
  },

  // ── WHY CHOOSE US ─────────────────────────────────────────────────────────
  whyUs: {
    sectionTitle: loc(
      "Why Santo Domingo Businesses Choose Us",
      "Por Qué los Negocios de Santo Domingo Nos Eligen",
    ),
    sectionSubtitle: locBlocks(
      "The capital is full of agencies. Here is what working with us gets you that a template shop doesn't.",
      "En la capital hay muchas agencias. Esto es lo que obtienes con nosotros y no con una plantilla genérica.",
    ),
    items: [
      {
        _key: key(),
        icon: "Search",
        title: loc(
          "Built to Rank Locally",
          "Hechos para Posicionar Localmente",
        ),
        description: locBlocks(
          'Clean architecture, structured data and local SEO fundamentals baked in — so your business can compete in searches like "diseño de páginas web en Santo Domingo" in your own industry.',
          "Arquitectura limpia, datos estructurados y fundamentos de SEO local integrados — para que tu negocio compita en las búsquedas de tu propia industria en Santo Domingo.",
        ),
      },
      {
        _key: key(),
        icon: "Zap",
        title: loc(
          "Faster Than the Competition",
          "Más Rápidos que la Competencia",
        ),
        description: locBlocks(
          "Most capital businesses run on slow WordPress templates. We build with Next.js: sites that load in under two seconds, keep visitors on the page, and score higher with Google.",
          "La mayoría de negocios capitalinos usan plantillas lentas de WordPress. Nosotros construimos con Next.js: sitios que cargan en menos de dos segundos, retienen visitantes y puntúan mejor en Google.",
        ),
      },
      {
        _key: key(),
        icon: "Video",
        title: loc("A 100% Remote Process", "Un Proceso 100% Remoto"),
        description: locBlocks(
          "No office visits, no traffic on the 27 de Febrero. Consultations, design reviews and launch happen over video calls — with the same developer from start to finish.",
          "Sin visitas a oficinas ni tapones en la 27 de Febrero. Consultas, revisiones de diseño y lanzamiento se hacen por videollamada — con el mismo desarrollador de principio a fin.",
        ),
      },
      {
        _key: key(),
        icon: "Languages",
        title: loc("Bilingual by Default", "Bilingüe por Defecto"),
        description: locBlocks(
          "Every site can launch in Spanish and English from day one — essential for capital businesses serving corporate clients, diaspora customers and international partners.",
          "Cada sitio puede lanzarse en español e inglés desde el día uno — esencial para negocios capitalinos que atienden clientes corporativos, dominicanos en el exterior y socios internacionales.",
        ),
      },
    ],
  },

  // ── PROCESS STEPS (the real 5-step process from your live landing pages) ──
  process: {
    sectionTitle: loc("How We Work", "Cómo Trabajamos"),
    sectionSubtitle: locBlocks(
      "A clear, structured process from first call to launch — no guesswork, no delays.",
      "Un proceso claro y estructurado desde la primera llamada hasta el lanzamiento — sin improvisación, sin retrasos.",
    ),
    steps: [
      {
        _key: key(),
        number: 1,
        icon: "MessageCircle",
        stepTitle: loc(
          "Discovery & Planning",
          "Descubrimiento y Planificación",
        ),
        description: locBlocks(
          "We learn about your business, goals and audience. You complete our project questionnaire and we define the full scope, sitemap and timeline together.",
          "Conocemos tu negocio, objetivos y audiencia. Completas nuestro cuestionario de proyecto y juntos definimos el alcance, mapa del sitio y cronograma.",
        ),
        duration: loc("3–5 days", "3–5 días"),
      },
      {
        _key: key(),
        number: 2,
        icon: "Palette",
        stepTitle: loc("Design & Prototyping", "Diseño y Prototipado"),
        description: locBlocks(
          "We create a custom visual design that reflects your brand identity. You review the design and we refine it across two revision rounds until it's perfect.",
          "Creamos un diseño visual personalizado que refleja la identidad de tu marca. Revisas el diseño y lo refinamos en dos rondas de revisión hasta que quede perfecto.",
        ),
        duration: loc("1–2 weeks", "1–2 semanas"),
      },
      {
        _key: key(),
        number: 3,
        icon: "Code",
        stepTitle: loc(
          "Development & CMS Setup",
          "Desarrollo y Configuración del CMS",
        ),
        description: locBlocks(
          "We build your site with Next.js and connect it to Sanity CMS so you can edit content easily. SEO, performance and responsive design are built in.",
          "Construimos tu sitio con Next.js y lo conectamos a Sanity CMS para que puedas editar contenido fácilmente. SEO, rendimiento y diseño responsivo vienen integrados.",
        ),
        duration: loc("2–4 weeks", "2–4 semanas"),
      },
      {
        _key: key(),
        number: 4,
        icon: "Rocket",
        stepTitle: loc("Testing & Launch", "Pruebas y Lanzamiento"),
        description: locBlocks(
          "We test on all devices, optimize Core Web Vitals, set up your domain and email, and launch. You get full training on managing your new site.",
          "Probamos en todos los dispositivos, optimizamos Core Web Vitals, configuramos tu dominio y email, y lanzamos. Recibes capacitación completa para gestionar tu nuevo sitio.",
        ),
        duration: loc("3–5 days", "3–5 días"),
      },
      {
        _key: key(),
        number: 5,
        icon: "LifeBuoy",
        stepTitle: loc("Post-Launch Support", "Soporte Post-Lanzamiento"),
        description: locBlocks(
          "30 days of free post-launch support plus a full year of hosting and maintenance included at no cost — valued at $1,140.",
          "30 días de soporte post-lanzamiento gratis más un año completo de hosting y mantenimiento incluido sin costo — valorado en $1,140.",
        ),
        duration: loc("30 days + 1 year", "30 días + 1 año"),
      },
    ],
  },

  // ── PORTFOLIO HIGHLIGHT ───────────────────────────────────────────────────
  portfolioHighlight: {
    sectionTitle: loc("Recent Projects", "Proyectos Recientes"),
    sectionSubtitle: locBlocks(
      "Real websites we've built for Dominican businesses.",
      "Páginas web reales que hemos creado para negocios dominicanos.",
    ),
    // Attach real `project` references in Studio (max 3). If you have any
    // Santo Domingo-based clients, feature those first — local proof matters
    // more on a city page than your overall best work.
    projects: [],
    ctaText: loc("View Full Portfolio", "Ver Portafolio Completo"),
    ctaHref: "/portfolio",
  },

  // ── TESTIMONIALS (same three clients as the live national landing pages) ──
  testimonials: {
    sectionTitle: loc("What Our Clients Say", "Lo que Dicen Nuestros Clientes"),
    items: [
      {
        _key: key(),
        quote: loc(
          "DR Web Studio transformed our online presence completely. Our sales increased by 150% in just 3 months!",
          "DR Web Studio transformó por completo nuestra presencia online. ¡Nuestras ventas aumentaron un 150% en tan solo 3 meses!",
        ),
        author: "Grecia Mejía",
        company: "Sertuin Events",
        rating: 5,
      },
      {
        _key: key(),
        quote: loc(
          "The website loads incredibly fast and looks amazing on all devices. Our customers love the new design!",
          "El sitio web carga rapidísimo y se ve increíble en todos los dispositivos. ¡A nuestros clientes les encanta el nuevo diseño!",
        ),
        author: "Franklin Santos",
        company: "Grand Bay of the Sea",
        rating: 5,
      },
      {
        _key: key(),
        quote: loc(
          "Professional, fast, and exactly what we needed. They understood our vision and delivered beyond expectations.",
          "Profesionales, rápidos y justo lo que necesitábamos. Comprendieron nuestra visión y superaron nuestras expectativas.",
        ),
        author: "Alex Castro",
        company: "Punta Cana Tour Store",
        rating: 5,
      },
    ],
  },

  // ── FAQ (feeds auto-generated FAQPage JSON-LD — fill BOTH locales) ────────
  faq: {
    sectionTitle: loc("Frequently Asked Questions", "Preguntas Frecuentes"),
    sectionSubtitle: locBlocks(
      "What Santo Domingo business owners ask us most.",
      "Lo que más nos preguntan los dueños de negocios en Santo Domingo.",
    ),
    items: [
      {
        _key: key(),
        question: loc(
          "How much does a website cost in Santo Domingo?",
          "¿Cuánto cuesta el diseño de una página web en Santo Domingo?",
        ),
        // Figures verified against your live landing pages (July 2026).
        answer: locBlocks(
          "Pricing starts at $400 USD for landing pages, $950 for custom business websites, $900 for online stores and $1,250 for web applications — 50% upfront, 50% on delivery, with no hidden fees and no monthly platform charges.",
          "Los precios comienzan en $400 USD para landing pages, $950 para sitios web empresariales, $900 para tiendas online y $1,250 para aplicaciones web — 50% al inicio y 50% al entregar, sin costos ocultos ni cuotas mensuales de plataforma.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Do you work with businesses in Santo Domingo if you're based in Punta Cana?",
          "¿Trabajan con negocios en Santo Domingo si están ubicados en Punta Cana?",
        ),
        answer: locBlocks(
          "Yes — a large part of our clients are outside Punta Cana. The entire process runs remotely over video calls and email, and you always deal directly with the developer building your site, in your time zone.",
          "Sí — gran parte de nuestros clientes están fuera de Punta Cana. Todo el proceso se realiza de forma remota por videollamada y correo, y siempre tratas directamente con el desarrollador que construye tu sitio, en tu misma zona horaria.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Will my business show up on Google for searches in Santo Domingo?",
          "¿Mi negocio aparecerá en Google para búsquedas en Santo Domingo?",
        ),
        answer: locBlocks(
          "Every site ships with local SEO fundamentals: optimized titles and descriptions, structured data, fast load times and a clean architecture Google can read. We also guide you on setting up your Google Business Profile so you can appear in map results for your area of the city.",
          "Cada sitio incluye los fundamentos de SEO local: títulos y descripciones optimizados, datos estructurados, carga rápida y una arquitectura limpia que Google puede leer. Además te guiamos para configurar tu Perfil de Negocio de Google y aparecer en los resultados de mapas de tu zona de la ciudad.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "How long does it take to build my website?",
          "¿Cuánto tiempo tarda el diseño de mi página web?",
        ),
        answer: locBlocks(
          "Landing pages take 2–3 weeks, custom business websites 6–8 weeks, and web applications 5–8 weeks. You'll get a detailed timeline during the discovery phase so there are no surprises.",
          "Las landing pages toman 2–3 semanas, los sitios web empresariales 6–8 semanas y las aplicaciones web 5–8 semanas. Recibirás un cronograma detallado durante la fase de descubrimiento para que no haya sorpresas.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "What happens after my website launches?",
          "¿Qué pasa después del lanzamiento de mi página web?",
        ),
        // TODO: confirm the maintenance figures ($95/month, first year free)
        // still match your maintenance page before launch.
        answer: locBlocks(
          "Every new project includes a full year of hosting and maintenance at no cost. After that, our maintenance plan is $95/month — hosting, security, updates and support, handled by the same developer who built your site.",
          "Cada proyecto nuevo incluye un año completo de hosting y mantenimiento sin costo. Después, nuestro plan de mantenimiento es de $95/mes — hosting, seguridad, actualizaciones y soporte, a cargo del mismo desarrollador que construyó tu sitio.",
        ),
      },
    ],
  },

  // ── STRUCTURED DATA ───────────────────────────────────────────────────────
  // City-scoped Service node (replaces the auto-generated Service — see the
  // long note above serviceNode). Everything else in the graph stays
  // auto-generated: LocalBusiness, WebPage, FAQPage, BreadcrumbList.
  structuredData: { en: sdCityServiceEn, es: sdCityServiceEs },
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 2 — Santiago de los Caballeros
// Angle: the Cibao's commercial and industrial heart. Audience: family
// businesses modernizing, retail expanding online, and B2B — zonas francas,
// manufacturing, tobacco, agro-industry and exporters who need bilingual sites.
// ─────────────────────────────────────────────────────────────────────────────

const santiagoPage: Record<string, unknown> = {
  _type: "landingPage",
  _id: "landingPage-diseno-paginas-web-santiago",
  title: "Diseño de Páginas Web en Santiago (City Landing Page)",
  slug: { _type: "slug", current: "diseno-de-paginas-web-santiago" },

  // ── HERO ──────────────────────────────────────────────────────────────────
  hero: {
    headline: loc(
      "Web Design in Santiago de los Caballeros",
      "Diseño de Páginas Web en Santiago de los Caballeros",
    ),
    subheadline: loc(
      "Professional, bilingual websites that help Cibao businesses sell beyond their neighborhood — to the whole country and to international buyers.",
      "Páginas web profesionales y bilingües que ayudan a las empresas del Cibao a vender más allá de su sector — a todo el país y a compradores internacionales.",
    ),
    primaryCta: loc("Get a Free Quote", "Solicitar Cotización Gratis"),
    primaryCtaHref: "/contact",
    secondaryCta: loc("View Our Portfolio", "Ver Nuestro Portafolio"),
    secondaryCtaHref: "/portfolio",
    badge: loc(
      "Serving businesses in Santiago and across the Cibao region",
      "Atendemos empresas en Santiago y toda la región del Cibao",
    ),
  },

  // ── STATS BAR (verified stats; "2 languages" kept for the exporter angle) ─
  statsBar: [
    {
      _key: key(),
      value: "50+",
      label: loc("Projects Delivered", "Proyectos Entregados"),
    },
    {
      _key: key(),
      value: "150%",
      label: loc("Avg. Sales Growth", "Crecimiento Promedio en Ventas"),
    },
    {
      _key: key(),
      value: "2",
      label: loc("Languages on Every Site", "Idiomas en Cada Sitio"),
    },
    {
      _key: key(),
      value: "1yr",
      label: loc(
        "Free Hosting & Maintenance",
        "Hosting y Mantenimiento Gratis",
      ),
    },
  ],

  // ── SERVICES GRID ─────────────────────────────────────────────────────────
  servicesGrid: {
    sectionTitle: loc(
      "Websites Built for How Santiago Does Business",
      "Páginas Web Hechas para Cómo se Hacen Negocios en Santiago",
    ),
    sectionSubtitle: locBlocks(
      "From family businesses on Calle del Sol to free-zone exporters — the Cibao's economy is diverse, and its websites should be too.",
      "Desde negocios familiares en la Calle del Sol hasta exportadores de zonas francas — la economía del Cibao es diversa, y sus páginas web también deben serlo.",
    ),
    items: [
      {
        _key: key(),
        icon: "Factory",
        title: loc(
          "B2B & Industrial Websites",
          "Sitios Web B2B e Industriales",
        ),
        description: locBlocks(
          "Product catalogs and corporate sites for manufacturers, free-zone companies, agro-industry and distributors — structured so wholesale buyers can find specs and request quotes fast.",
          "Catálogos de productos y sitios corporativos para manufactura, zonas francas, agroindustria y distribuidores — estructurados para que compradores al por mayor encuentren especificaciones y coticen rápido.",
        ),
        linkSlug: "custom-websites",
      },
      {
        _key: key(),
        icon: "Globe",
        title: loc(
          "Bilingual Sites for Exporters",
          "Sitios Bilingües para Exportadores",
        ),
        description: locBlocks(
          "Selling tobacco, cacao, textiles or services abroad? Every site we build is fully bilingual (Spanish/English) with international SEO, so foreign buyers find you and trust you.",
          "¿Exportas tabaco, cacao, textiles o servicios? Cada sitio que construimos es completamente bilingüe (español/inglés) con SEO internacional, para que compradores extranjeros te encuentren y confíen en ti.",
        ),
        linkSlug: "landing-pages",
      },
      {
        _key: key(),
        icon: "ShoppingCart",
        title: loc(
          "Online Stores for Cibao Retail",
          "Tiendas Online para el Comercio Cibaeño",
        ),
        description: locBlocks(
          "Take your Santiago storefront national: complete e-commerce with secure payments, inventory management and mobile-first checkout for customers who shop from their phones.",
          "Lleva tu tienda de Santiago a todo el país: e-commerce completo con pagos seguros, gestión de inventario y checkout mobile-first para clientes que compran desde el celular.",
        ),
        linkSlug: "ecommerce",
      },
    ],
  },

  // ── WHY CHOOSE US ─────────────────────────────────────────────────────────
  whyUs: {
    sectionTitle: loc(
      "Why Cibao Businesses Work With Us",
      "Por Qué las Empresas del Cibao Trabajan con Nosotros",
    ),
    sectionSubtitle: locBlocks(
      "You shouldn't have to travel to the capital to get a serious website.",
      "No deberías tener que viajar a la capital para conseguir una página web seria.",
    ),
    items: [
      {
        _key: key(),
        icon: "Video",
        title: loc(
          "Everything Remote, Nothing Lost",
          "Todo Remoto, Sin Perder Nada",
        ),
        description: locBlocks(
          "Consultation, design approvals and training happen by video call on your schedule — you get capital-level quality without leaving Santiago.",
          "Consultas, aprobaciones de diseño y capacitación por videollamada según tu horario — obtienes calidad de nivel capitalino sin salir de Santiago.",
        ),
      },
      {
        _key: key(),
        icon: "ShieldCheck",
        title: loc("No Plugins, No Surprises", "Sin Plugins, Sin Sorpresas"),
        description: locBlocks(
          "We build with Next.js instead of plugin-heavy WordPress: no monthly plugin failures, no hacked sites, no calls to a webmaster every time something breaks.",
          "Construimos con Next.js en lugar de WordPress cargado de plugins: sin fallos mensuales de plugins, sin sitios hackeados, sin llamar a un webmaster cada vez que algo se rompe.",
        ),
      },
      {
        _key: key(),
        icon: "Handshake",
        title: loc(
          "One Developer, Long-Term",
          "Un Solo Desarrollador, a Largo Plazo",
        ),
        description: locBlocks(
          "Cibao businesses are built on lasting relationships. You work with the same developer who built your site — for launch, support and every improvement after.",
          "Los negocios del Cibao se construyen sobre relaciones duraderas. Trabajas con el mismo desarrollador que construyó tu sitio — en el lanzamiento, el soporte y cada mejora posterior.",
        ),
      },
      {
        _key: key(),
        icon: "Wallet",
        title: loc(
          "Transparent Pricing, No Surprises",
          "Precios Transparentes, Sin Sorpresas",
        ),
        description: locBlocks(
          "Clear pricing from $400, paid 50% upfront and 50% on delivery — with your first year of hosting and maintenance included free, a $1,140 value.",
          "Precios claros desde $400, pagando 50% al inicio y 50% al entregar — con el primer año de hosting y mantenimiento gratis incluido, un valor de $1,140.",
        ),
      },
    ],
  },

  // ── PROCESS STEPS (the real 5-step process from your live landing pages) ──
  process: {
    sectionTitle: loc("A Straightforward Process", "Un Proceso Sencillo"),
    sectionSubtitle: locBlocks(
      "Five clear steps from idea to a website that works for your business — no guesswork, no delays.",
      "Cinco pasos claros desde la idea hasta una página web que trabaja para tu empresa — sin improvisación, sin retrasos.",
    ),
    steps: [
      {
        _key: key(),
        number: 1,
        icon: "MessageCircle",
        stepTitle: loc(
          "Discovery & Planning",
          "Descubrimiento y Planificación",
        ),
        description: locBlocks(
          "We learn about your company, your customers in the Cibao and beyond, then define the full scope, sitemap and timeline together with our project questionnaire.",
          "Conocemos tu empresa y tus clientes en el Cibao y fuera de él, y juntos definimos el alcance, mapa del sitio y cronograma con nuestro cuestionario de proyecto.",
        ),
        duration: loc("3–5 days", "3–5 días"),
      },
      {
        _key: key(),
        number: 2,
        icon: "Palette",
        stepTitle: loc("Design & Prototyping", "Diseño y Prototipado"),
        description: locBlocks(
          "We create a custom visual design that reflects your brand — in both languages — and refine it with you across two revision rounds until it's perfect.",
          "Creamos un diseño visual personalizado que refleja tu marca — en ambos idiomas — y lo refinamos contigo en dos rondas de revisión hasta que quede perfecto.",
        ),
        duration: loc("1–2 weeks", "1–2 semanas"),
      },
      {
        _key: key(),
        number: 3,
        icon: "Code",
        stepTitle: loc(
          "Development & CMS Setup",
          "Desarrollo y Configuración del CMS",
        ),
        description: locBlocks(
          "We build your site with Next.js and connect it to Sanity CMS so your team can edit content easily. SEO, performance and responsive design are built in.",
          "Construimos tu sitio con Next.js y lo conectamos a Sanity CMS para que tu equipo edite contenido fácilmente. SEO, rendimiento y diseño responsivo vienen integrados.",
        ),
        duration: loc("2–4 weeks", "2–4 semanas"),
      },
      {
        _key: key(),
        number: 4,
        icon: "Rocket",
        stepTitle: loc("Testing & Launch", "Pruebas y Lanzamiento"),
        description: locBlocks(
          "We test on all devices, optimize Core Web Vitals, set up your domain and email, and launch — with full training so you manage the site yourself.",
          "Probamos en todos los dispositivos, optimizamos Core Web Vitals, configuramos tu dominio y email, y lanzamos — con capacitación completa para que gestiones el sitio tú mismo.",
        ),
        duration: loc("3–5 days", "3–5 días"),
      },
      {
        _key: key(),
        number: 5,
        icon: "LifeBuoy",
        stepTitle: loc("Post-Launch Support", "Soporte Post-Lanzamiento"),
        description: locBlocks(
          "30 days of free post-launch support plus a full year of hosting and maintenance included at no cost — valued at $1,140.",
          "30 días de soporte post-lanzamiento gratis más un año completo de hosting y mantenimiento incluido sin costo — valorado en $1,140.",
        ),
        duration: loc("30 days + 1 year", "30 días + 1 año"),
      },
    ],
  },

  // ── PORTFOLIO HIGHLIGHT ───────────────────────────────────────────────────
  portfolioHighlight: {
    sectionTitle: loc("Recent Projects", "Proyectos Recientes"),
    sectionSubtitle: locBlocks(
      "Websites we've built for Dominican businesses.",
      "Páginas web que hemos creado para empresas dominicanas.",
    ),
    // Attach real `project` references in Studio (max 3). Feature Santiago or
    // Cibao clients first if you have them; otherwise your strongest B2B or
    // e-commerce work.
    projects: [],
    ctaText: loc("View Full Portfolio", "Ver Portafolio Completo"),
    ctaHref: "/portfolio",
  },

  // ── TESTIMONIALS (same three clients as the live national landing pages) ──
  testimonials: {
    sectionTitle: loc("What Our Clients Say", "Lo que Dicen Nuestros Clientes"),
    items: [
      {
        _key: key(),
        quote: loc(
          "DR Web Studio transformed our online presence completely. Our sales increased by 150% in just 3 months!",
          "DR Web Studio transformó por completo nuestra presencia online. ¡Nuestras ventas aumentaron un 150% en tan solo 3 meses!",
        ),
        author: "Grecia Mejía",
        company: "Sertuin Events",
        rating: 5,
      },
      {
        _key: key(),
        quote: loc(
          "The website loads incredibly fast and looks amazing on all devices. Our customers love the new design!",
          "El sitio web carga rapidísimo y se ve increíble en todos los dispositivos. ¡A nuestros clientes les encanta el nuevo diseño!",
        ),
        author: "Franklin Santos",
        company: "Grand Bay of the Sea",
        rating: 5,
      },
      {
        _key: key(),
        quote: loc(
          "Professional, fast, and exactly what we needed. They understood our vision and delivered beyond expectations.",
          "Profesionales, rápidos y justo lo que necesitábamos. Comprendieron nuestra visión y superaron nuestras expectativas.",
        ),
        author: "Alex Castro",
        company: "Punta Cana Tour Store",
        rating: 5,
      },
    ],
  },

  // ── FAQ (feeds auto-generated FAQPage JSON-LD — fill BOTH locales) ────────
  faq: {
    sectionTitle: loc("Frequently Asked Questions", "Preguntas Frecuentes"),
    sectionSubtitle: locBlocks(
      "What Santiago business owners ask us most.",
      "Lo que más nos preguntan los empresarios en Santiago.",
    ),
    items: [
      {
        _key: key(),
        question: loc(
          "How much does a website cost in Santiago?",
          "¿Cuánto cuesta una página web en Santiago?",
        ),
        // Figures verified against your live landing pages (July 2026).
        answer: locBlocks(
          "The same transparent pricing we offer everywhere in the country: landing pages from $400 USD, custom business websites from $950, online stores from $900 and web applications from $1,250 — 50% upfront, 50% on delivery, with no hidden fees.",
          "Los mismos precios transparentes que ofrecemos en todo el país: landing pages desde $400 USD, sitios web empresariales desde $950, tiendas online desde $900 y aplicaciones web desde $1,250 — 50% al inicio y 50% al entregar, sin costos ocultos.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Can we work together without in-person meetings?",
          "¿Podemos trabajar juntos sin reuniones presenciales?",
        ),
        answer: locBlocks(
          "Yes — the entire process is remote by design. Video calls for consultation and design reviews, email and WhatsApp for day-to-day updates. Many of our clients never need a single in-person meeting.",
          "Sí — todo el proceso es remoto por diseño. Videollamadas para la consulta y las revisiones de diseño, correo y WhatsApp para el seguimiento diario. Muchos de nuestros clientes nunca necesitan una sola reunión presencial.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Do you build websites for free-zone companies and exporters?",
          "¿Hacen páginas web para zonas francas y empresas exportadoras?",
        ),
        answer: locBlocks(
          "Yes, and it's where bilingual sites matter most: your Spanish site serves local clients while the English version — with international SEO — presents your company professionally to buyers in the US, Europe and beyond.",
          "Sí, y es donde los sitios bilingües más importan: tu sitio en español atiende a clientes locales mientras la versión en inglés — con SEO internacional — presenta tu empresa profesionalmente a compradores en EE. UU., Europa y más allá.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "How long until my website is live?",
          "¿En cuánto tiempo estará lista mi página web?",
        ),
        answer: locBlocks(
          "Landing pages take 2–3 weeks, custom business websites 6–8 weeks, and web applications or large B2B catalogs 5–8 weeks. You'll receive a detailed timeline during the discovery phase.",
          "Las landing pages toman 2–3 semanas, los sitios web empresariales 6–8 semanas y las aplicaciones web o catálogos B2B grandes 5–8 semanas. Recibirás un cronograma detallado durante la fase de descubrimiento.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Will my site rank on Google for searches in Santiago?",
          "¿Mi sitio posicionará en Google para búsquedas en Santiago?",
        ),
        answer: locBlocks(
          "Every site includes local SEO fundamentals — optimized titles, structured data, fast load times — plus guidance to set up your Google Business Profile so customers in Santiago find you in both search and map results.",
          "Cada sitio incluye los fundamentos de SEO local — títulos optimizados, datos estructurados, carga rápida — más orientación para configurar tu Perfil de Negocio de Google y que los clientes en Santiago te encuentren tanto en búsquedas como en resultados de mapas.",
        ),
      },
    ],
  },

  // ── STRUCTURED DATA (city-scoped Service — see note above serviceNode) ────
  structuredData: { en: stiCityServiceEn, es: stiCityServiceEs },
}

// ─────────────────────────────────────────────────────────────────────────────
// Write
// ─────────────────────────────────────────────────────────────────────────────

async function seed() {
  for (const page of [santoDomingoPage, santiagoPage]) {
    await client.createOrReplace(
      page as Parameters<typeof client.createOrReplace>[0],
    )
    console.log(
      `✓ Seeded landing page: _id="${page._id}" slug="${
        (page.slug as { current: string }).current
      }"`,
    )
  }
  console.log("")
  console.log("Next steps (see header comment for details):")
  console.log("  1. Create the two route folders under src/app/(root)/[lang]/")
  console.log("  2. Set per-page metadata (title + description, en/es)")
  console.log("  3. Add hub-and-spoke internal links")
  console.log("  4. Verify both slugs appear in sitemap.xml with hreflang")
  console.log("  5. In Studio: attach portfolio projects (testimonials, stats")
  console.log("     and pricing now match your live landing pages)")
}

seed().catch(console.error)
