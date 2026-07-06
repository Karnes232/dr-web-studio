/**
 * Seed script — Example Landing Page (template / reference)
 *
 * Creates ONE fully-populated bilingual (en/es) `landingPage` document that
 * demonstrates every section of the schema
 * (src/sanity/schemaTypes/landing-pages/landingPage.ts). Use it as a copy-paste
 * reference when building new landing pages.
 *
 * Idempotent: safe to run repeatedly (uses createOrReplace). The unique `_id`
 * (`landingPage-example`) means it never clobbers the 5 real landing pages.
 *
 * NOTE: the slug `example` has no matching route under
 * src/app/(root)/[lang]/, so this doc is a Studio-only template — it is not a
 * live public page. To publish it, add a route folder mirroring an existing one
 * (e.g. desarrollo-web-republica-dominicana/page.tsx) and fetch it with
 * getLandingPage("example", lang).
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seedExampleLandingPage.ts
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
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

let _keyCounter = 0
// Stable _key for every array item (Sanity requires unique _key per array entry).
const key = () => `key${++_keyCounter}`

// Localized field: every localized value in the schema is an { en, es } object.
const loc = (en: string, es: string) => ({ en, es })

// Localized RICH TEXT (Portable Text). Used for the four fields the schema now
// stores as block content: service/whyUs/process descriptions and FAQ answers.
// Each string becomes a single normal block; edit in Studio to add links/lists.
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
// structuredData (optional)
// ─────────────────────────────────────────────────────────────────────────────
//
// The app AUTO-GENERATES the core JSON-LD graph in code for every landing page
// (see src/lib/schema/graph.ts → getLandingGraph): Organization/LocalBusiness,
// WebSite, Service, WebPage, FAQPage (built from `faq.items` below), and
// BreadcrumbList. You normally do NOT need to fill this field.
//
// This `structuredData` field is an OPTIONAL override/extension merged by
// mergeCustomNodes: site-identity types (Organization/WebSite) are ignored, and
// page-content types that collide (e.g. FAQPage, Service) are REPLACED by your
// custom copy. To rely purely on auto-generation, set en/es to "".
//
// The example below adds a HowTo node (mirroring the process steps) — a type the
// app does NOT auto-generate, so it's purely additive and won't duplicate or
// override anything. It must be a valid JSON string (the schema validates that).

const howToEn = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HowTo",
      name: "How We Build Your Website",
      step: [
        { "@type": "HowToStep", position: 1, name: "Free Consultation" },
        { "@type": "HowToStep", position: 2, name: "Design & Planning" },
        { "@type": "HowToStep", position: 3, name: "Development & Launch" },
      ],
    },
  ],
})

const howToEs = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HowTo",
      name: "Cómo Construimos Tu Sitio Web",
      step: [
        { "@type": "HowToStep", position: 1, name: "Consulta Gratuita" },
        { "@type": "HowToStep", position: 2, name: "Diseño y Planificación" },
        { "@type": "HowToStep", position: 3, name: "Desarrollo y Lanzamiento" },
      ],
    },
  ],
})

// ─────────────────────────────────────────────────────────────────────────────
// The example document — every section populated, bilingual.
// ─────────────────────────────────────────────────────────────────────────────

const examplePage: Record<string, unknown> = {
  _type: "landingPage",
  // Hyphens only — dotted _ids are invisible to the anonymous public client.
  _id: "landingPage-example",
  title: "Example Landing Page (Template)",
  slug: { _type: "slug", current: "example" },

  // ── HERO ──────────────────────────────────────────────────────────────────
  hero: {
    headline: loc(
      "Your Compelling Headline Goes Here",
      "Tu Titular Atractivo Va Aquí",
    ),
    subheadline: loc(
      "A one- or two-sentence supporting subheadline that explains the value you deliver and who it's for.",
      "Un subtítulo de una o dos frases que explica el valor que ofreces y para quién es.",
    ),
    primaryCta: loc("Get Free Quote", "Solicitar Cotización Gratis"),
    // Relative path (locale prefix is added by the app) or an anchor like #contact.
    primaryCtaHref: "/contact",
    secondaryCta: loc("View Our Portfolio", "Ver Nuestro Portafolio"),
    secondaryCtaHref: "/portfolio",
    badge: loc(
      "Trusted by businesses across the Dominican Republic",
      "De confianza para empresas en toda la República Dominicana",
    ),
    // backgroundImage is optional — upload one in Studio if desired.
  },

  // ── STATS BAR (value is a STRING) ──────────────────────────────────────────
  statsBar: [
    {
      _key: key(),
      value: "50+",
      label: loc("Websites Delivered", "Sitios Web Entregados"),
    },
    {
      _key: key(),
      value: "5+",
      label: loc("Years of Experience", "Años de Experiencia"),
    },
    {
      _key: key(),
      value: "4.9",
      label: loc("Average Rating", "Calificación Promedio"),
    },
    {
      _key: key(),
      value: "24/7",
      label: loc("Support Available", "Soporte Disponible"),
    },
  ],

  // ── SERVICES GRID (icon = Lucide icon name) ────────────────────────────────
  servicesGrid: {
    sectionTitle: loc(
      "Everything Your Business Needs Online",
      "Todo lo que Tu Negocio Necesita en Línea",
    ),
    sectionSubtitle: locBlocks(
      "A short intro describing the range of services shown below.",
      "Una breve introducción que describe la gama de servicios que se muestran a continuación.",
    ),
    items: [
      {
        _key: key(),
        icon: "Layout",
        title: loc("Landing Pages", "Páginas de Aterrizaje"),
        description: locBlocks(
          "High-converting landing pages designed to turn visitors into customers.",
          "Páginas de aterrizaje de alta conversión diseñadas para convertir visitantes en clientes.",
        ),
        // linkSlug is optional — links to /our-services/{slug}.
        linkSlug: "landing-pages",
      },
      {
        _key: key(),
        icon: "ShoppingCart",
        title: loc("E-commerce Stores", "Tiendas en Línea"),
        description: locBlocks(
          "Complete online stores with payment processing, inventory, and order tracking.",
          "Tiendas en línea completas con procesamiento de pagos, inventario y seguimiento de pedidos.",
        ),
        linkSlug: "ecommerce",
      },
      {
        _key: key(),
        icon: "Globe",
        title: loc("Corporate Websites", "Sitios Web Corporativos"),
        description: locBlocks(
          "Professional websites that represent your brand with authority and load fast.",
          "Sitios web profesionales que representan tu marca con autoridad y cargan rápido.",
        ),
        linkSlug: "custom-websites",
      },
    ],
  },

  // ── WHY CHOOSE US ──────────────────────────────────────────────────────────
  whyUs: {
    sectionTitle: loc(
      "Why Businesses Choose Us",
      "Por Qué los Negocios Nos Eligen",
    ),
    sectionSubtitle: locBlocks(
      "The differentiators that set you apart from the competition.",
      "Los diferenciadores que te distinguen de la competencia.",
    ),
    items: [
      {
        _key: key(),
        icon: "Languages",
        title: loc("Fully Bilingual", "Completamente Bilingüe"),
        description: locBlocks(
          "Every website is available in Spanish and English to reach local and international customers.",
          "Cada sitio web está disponible en español e inglés para llegar a clientes locales e internacionales.",
        ),
      },
      {
        _key: key(),
        icon: "Rocket",
        title: loc("Modern Technology", "Tecnología Moderna"),
        description: locBlocks(
          "Built with Next.js and React for sites that are fast, secure, and future-proof.",
          "Construidos con Next.js y React para sitios rápidos, seguros y preparados para el futuro.",
        ),
      },
      {
        _key: key(),
        icon: "Shield",
        title: loc("Transparent Pricing", "Precios Transparentes"),
        description: locBlocks(
          "Clear quotes upfront with no hidden fees and no surprises.",
          "Cotizaciones claras por adelantado, sin costos ocultos ni sorpresas.",
        ),
      },
    ],
  },

  // ── PROCESS STEPS ──────────────────────────────────────────────────────────
  process: {
    sectionTitle: loc("Our Simple Process", "Nuestro Proceso Simple"),
    sectionSubtitle: locBlocks(
      "From idea to launch in as little as 2-4 weeks.",
      "De la idea al lanzamiento en tan solo 2-4 semanas.",
    ),
    steps: [
      {
        _key: key(),
        number: 1,
        icon: "MessageCircle",
        stepTitle: loc("Free Consultation", "Consulta Gratuita"),
        description: locBlocks(
          "We discuss your goals, audience, and requirements — no obligation.",
          "Discutimos tus objetivos, audiencia y requisitos — sin obligación.",
        ),
        duration: loc("30-60 minutes", "30-60 minutos"),
      },
      {
        _key: key(),
        number: 2,
        icon: "Palette",
        stepTitle: loc("Design & Planning", "Diseño y Planificación"),
        description: locBlocks(
          "We create wireframes and mockups for your approval before coding.",
          "Creamos wireframes y maquetas para tu aprobación antes de programar.",
        ),
        duration: loc("3-5 days", "3-5 días"),
      },
      {
        _key: key(),
        number: 3,
        icon: "Rocket",
        stepTitle: loc("Development & Launch", "Desarrollo y Lanzamiento"),
        description: locBlocks(
          "We build, test, launch your site, and provide 30 days of free support.",
          "Construimos, probamos, lanzamos tu sitio y brindamos 30 días de soporte gratuito.",
        ),
        duration: loc("1-3 weeks", "1-3 semanas"),
      },
    ],
  },

  // ── PORTFOLIO HIGHLIGHT ────────────────────────────────────────────────────
  portfolioHighlight: {
    sectionTitle: loc("Recent Projects", "Proyectos Recientes"),
    sectionSubtitle: locBlocks(
      "A sample of the websites we've built.",
      "Una muestra de los sitios web que hemos construido.",
    ),
    // Leave empty and attach real `project` references in Studio (max 3).
    // The 5 real landing pages all do the same.
    projects: [],
    ctaText: loc("View Full Portfolio", "Ver Portafolio Completo"),
    ctaHref: "/portfolio",
  },

  // ── TESTIMONIALS ───────────────────────────────────────────────────────────
  testimonials: {
    sectionTitle: loc("What Our Clients Say", "Lo que Dicen Nuestros Clientes"),
    items: [
      {
        _key: key(),
        quote: loc(
          "They transformed our online presence. Our new site loads in under 2 seconds and inquiries jumped 60% in the first month.",
          "Transformaron nuestra presencia online. Nuestro nuevo sitio carga en menos de 2 segundos y las consultas subieron un 60% en el primer mes.",
        ),
        author: "María García",
        company: "Boutique Caribeña, Santo Domingo",
        rating: 5,
        // avatar is optional — upload in Studio.
      },
      {
        _key: key(),
        quote: loc(
          "Professional, bilingual, and always available. They understood exactly what we needed and delivered beyond expectations.",
          "Profesional, bilingüe y siempre disponible. Entendieron exactamente lo que necesitábamos y superaron nuestras expectativas.",
        ),
        author: "Carlos Ramírez",
        company: "Restaurante El Mangú, Santiago",
        rating: 5,
      },
    ],
  },

  // ── FAQ ────────────────────────────────────────────────────────────────────
  // Fill BOTH en and es — these items feed the auto-generated FAQPage JSON-LD
  // (src/lib/schema/graph.ts → getLandingGraph → faqPageNode). Missing a locale
  // means no FAQPage rich result in that language.
  faq: {
    sectionTitle: loc("Frequently Asked Questions", "Preguntas Frecuentes"),
    sectionSubtitle: locBlocks(
      "Everything you need to know about working with us.",
      "Todo lo que necesitas saber sobre trabajar con nosotros.",
    ),
    items: [
      {
        _key: key(),
        question: loc(
          "How much does a website cost?",
          "¿Cuánto cuesta un sitio web?",
        ),
        answer: locBlocks(
          "Our websites start at $800 USD for a basic landing page and scale with complexity. We offer transparent pricing with no hidden fees.",
          "Nuestros sitios web comienzan desde $800 USD para una página de aterrizaje básica y aumentan según la complejidad. Ofrecemos precios transparentes sin costos ocultos.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "How long does it take to build a website?",
          "¿Cuánto tiempo tarda en desarrollarse un sitio web?",
        ),
        answer: locBlocks(
          "A typical website takes 2-4 weeks from start to launch. Simple landing pages can be done in 1-2 weeks; complex e-commerce sites may take 6-8 weeks.",
          "Un sitio web típico tarda de 2 a 4 semanas desde el inicio hasta el lanzamiento. Las páginas de aterrizaje simples pueden estar listas en 1-2 semanas; los sitios de e-commerce complejos pueden tomar 6-8 semanas.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Will my website be in both Spanish and English?",
          "¿El sitio web será en español e inglés?",
        ),
        answer: locBlocks(
          "Yes! All our websites are fully bilingual by default, available in both Spanish and English.",
          "¡Sí! Todos nuestros sitios web son completamente bilingües por defecto, disponibles en español e inglés.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "What happens after my website launches?",
          "¿Qué pasa después del lanzamiento de mi sitio?",
        ),
        answer: locBlocks(
          "We provide 30 days of free post-launch support. After that you can manage the site yourself or subscribe to a maintenance plan starting at $150/month.",
          "Proveemos 30 días de soporte post-lanzamiento gratuito. Después puedes gestionar el sitio tú mismo o suscribirte a un plan de mantenimiento desde $150/mes.",
        ),
      },
    ],
  },

  // ── STRUCTURED DATA (optional — see the long note at the top) ───────────────
  structuredData: {
    en: howToEn,
    es: howToEs,
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Write
// ─────────────────────────────────────────────────────────────────────────────

async function seed() {
  await client.createOrReplace(
    examplePage as Parameters<typeof client.createOrReplace>[0],
  )
  console.log(
    `✓ Seeded example landing page: _id="${examplePage._id}" slug="example"`,
  )
  console.log("  Open /studio → Landing Pages to review the 'Example' doc.")
}

seed().catch(console.error)
