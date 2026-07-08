/**
 * Seed script — INDUSTRY PAGE: Inmobiliarias ONLY
 *
 * Creates the bilingual (en/es) landing page document AND its seo document for:
 *   slug "paginas-web-para-inmobiliarias"
 *   → target: "páginas web para inmobiliarias" / "diseño web inmobiliaria" /
 *             "página web para bienes raíces" / "real estate web design
 *             dominican republic"
 *
 * SCOPE SPLIT (decide anchors now, before the sibling page exists):
 *   • THIS page = property SALES: agencies, independent agents, developers,
 *     pre-construction projects.
 *   • The future alquileres-vacacionales page = rental managers / Airbnb
 *     operators. Anchors with "inmobiliaria(s)" or "bienes raíces" point
 *     HERE; anchors with "alquileres vacacionales" point THERE. Never mix.
 *
 * INDUSTRY PAGE CONVENTIONS (same as the other industry seeds):
 *   • Flat slug: paginas-web-para-{industria}
 *   • EN route slug (translated): web-design-for-real-estate — the EN
 *     structuredData URLs below assume this; adjust if you pick another.
 *   • structuredData: Service node with `audience` (real estate) +
 *     `areaServed` Country (nationwide).
 *
 * Does NOT touch any other documents.
 * Idempotent: safe to run repeatedly (createOrReplace) — but it will overwrite
 * Studio edits to these two documents.
 *
 * ── AFTER SEEDING ───────────────────────────────────────────────────────────
 *
 * 1. seo.ts — add this option to the pageName dropdown list:
 *      {
 *        title: "Páginas Web para Inmobiliarias (Industry Landing)",
 *        value: "paginas-web-para-inmobiliarias",
 *      },
 *
 * 2. ROUTES — ES route at:
 *      src/app/(root)/[lang]/paginas-web-para-inmobiliarias/page.tsx
 *    and the EN route at web-design-for-real-estate, both fetching
 *    getLandingPage("paginas-web-para-inmobiliarias", lang).
 *
 * 3. INTERNAL LINKS (city ↔ industry grid) —
 *      • From the national hub: one contextual link, anchor
 *        "páginas web para inmobiliarias".
 *      • From this page: one link to the hub and one to /es.
 *      • The real-estate city cards link here: San Pedro ("Bienes Raíces y
 *        Alquileres en Juan Dolio") and Punta Cana ("Bienes Raíces y
 *        Alquileres Vacacionales") are the cleanest anchors; Puerto Plata and
 *        Las Terrenas mention property/villas in their copy too. This page
 *        links back to Punta Cana and San Pedro.
 *
 * 4. SITEMAP — confirm the slug is emitted for en + es with hreflang
 *    alternates.
 *
 * 5. STUDIO — attach portfolio projects (your most photo-rich work first) and
 *    upload a 1200x630 OG image (a striking property shot).
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seedInmobiliarias.ts
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
// structuredData — INDUSTRY-scoped Service node (audience: real estate,
// areaServed: DO). Same replace-the-auto-Service mechanics as all pages.
// ─────────────────────────────────────────────────────────────────────────────

const BASE = "https://www.dr-webstudio.com"

const industryServiceNode = (o: {
  url: string
  name: string
  serviceType: string
  description: string
  audienceType: string
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
        audience: {
          "@type": "BusinessAudience",
          audienceType: o.audienceType,
        },
        areaServed: {
          "@type": "Country",
          name: "Dominican Republic",
        },
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: o.url,
          availableLanguage: ["es", "en"],
        },
      },
    ],
  })

const inmoServiceEs = industryServiceNode({
  url: `${BASE}/es/paginas-web-para-inmobiliarias`,
  name: "Páginas Web para Inmobiliarias",
  serviceType: "Diseño de páginas web para inmobiliarias",
  description:
    "Diseño de páginas web para inmobiliarias en República Dominicana: catálogos de propiedades bilingües, galerías rápidas y captación de leads por WhatsApp.",
  audienceType: "Inmobiliarias, agentes independientes y desarrolladores",
})

const inmoServiceEn = industryServiceNode({
  url: `${BASE}/en/web-design-for-real-estate`,
  name: "Web Design for Real Estate",
  serviceType: "Real estate website design",
  description:
    "Real estate website design in the Dominican Republic: bilingual property catalogs, fast galleries and WhatsApp lead capture for international buyers.",
  audienceType: "Real estate agencies, independent agents and developers",
})

// ─────────────────────────────────────────────────────────────────────────────
// Inmobiliarias — industry landing page document
// Angle: TRUST, not commissions. A foreign buyer researches the agency online
// before wiring money across a border — the website is the credential that
// makes a high-ticket sale possible. Product hooks: a self-managed property
// catalog (add/edit/mark-sold without a developer), pre-construction landing
// pages for ad campaigns, and English-first SEO for the international buyers
// driving the country's real estate boom. We're based in its epicenter.
// ─────────────────────────────────────────────────────────────────────────────

const inmobiliariasPage: Record<string, unknown> = {
  _type: "landingPage",
  _id: "landingPage-paginas-web-para-inmobiliarias",
  title: "Páginas Web para Inmobiliarias (Industry Landing Page)",
  slug: { _type: "slug", current: "paginas-web-para-inmobiliarias" },

  // ── HERO ──────────────────────────────────────────────────────────────────
  hero: {
    headline: loc(
      "Web Design for Real Estate",
      "Páginas Web para Inmobiliarias",
    ),
    subheadline: loc(
      "Bilingual property websites that make international buyers trust you before they ever write — with a catalog you manage yourself and leads that land in your WhatsApp.",
      "Páginas web inmobiliarias bilingües que hacen que el comprador internacional confíe en ti antes de escribirte — con un catálogo que administras tú mismo y leads que llegan a tu WhatsApp.",
    ),
    primaryCta: loc("Get a Free Quote", "Solicitar Cotización Gratis"),
    primaryCtaHref: "/contact",
    secondaryCta: loc("View Our Portfolio", "Ver Nuestro Portafolio"),
    secondaryCtaHref: "/portfolio",
    badge: loc(
      "For agencies, independent agents and developers across the Dominican Republic",
      "Para inmobiliarias, agentes independientes y desarrolladores en toda República Dominicana",
    ),
  },

  // ── STATS BAR (verified stats from your live landing pages) ───────────────
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
      value: "2",
      label: loc("Languages on Every Site", "Idiomas en Cada Sitio"),
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
      "What a Real Estate Website Must Do",
      "Lo que la Página Web de una Inmobiliaria Debe Hacer",
    ),
    sectionSubtitle: locBlocks(
      "A buyer deciding on a property from another country has exactly one way to evaluate you: your website. It has to do three jobs perfectly.",
      "Un comprador decidiendo una propiedad desde otro país tiene exactamente una forma de evaluarte: tu página web. Tiene que hacer tres trabajos a la perfección.",
    ),
    items: [
      {
        _key: key(),
        icon: "Building2",
        title: loc(
          "A Property Catalog You Manage",
          "Un Catálogo de Propiedades que Tú Administras",
        ),
        description: locBlocks(
          "Add a listing, update a price, mark a unit sold — from your phone, without calling a developer. Fast galleries, clear specs and search by zone, type and price range.",
          "Agrega una propiedad, actualiza un precio, marca una unidad vendida — desde tu celular, sin llamar a un desarrollador. Galerías rápidas, especificaciones claras y búsqueda por zona, tipo y rango de precio.",
        ),
        linkSlug: "custom-websites",
      },
      {
        _key: key(),
        icon: "Target",
        title: loc(
          "Landing Pages for Pre-Construction",
          "Landing Pages para Proyectos en Preventa",
        ),
        description: locBlocks(
          "Selling a project off-plan with Google or Meta ads? Focused landing pages with renders, unit tables, payment plans and lead-capture forms — built to turn ad clicks into scheduled calls.",
          "¿Vendes un proyecto en planos con anuncios de Google o Meta? Landing pages enfocadas con renders, tablas de unidades, planes de pago y formularios de captación — hechas para convertir clics de anuncios en llamadas agendadas.",
        ),
        linkSlug: "landing-pages",
      },
      {
        _key: key(),
        icon: "Globe",
        title: loc(
          "Built for the International Buyer",
          "Hecha para el Comprador Internacional",
        ),
        description: locBlocks(
          "Buyers research from Miami, Toronto and Madrid — in English. Every site ships fully bilingual with international SEO, presenting your agency with the professionalism a cross-border purchase demands.",
          "Los compradores investigan desde Miami, Toronto y Madrid — en inglés. Cada sitio se entrega completamente bilingüe con SEO internacional, presentando tu inmobiliaria con el profesionalismo que exige una compra desde el exterior.",
        ),
        linkSlug: "ecommerce",
      },
    ],
  },

  // ── WHY CHOOSE US ─────────────────────────────────────────────────────────
  whyUs: {
    sectionTitle: loc(
      "Why Real Estate Businesses Choose Us",
      "Por Qué las Inmobiliarias Nos Eligen",
    ),
    sectionSubtitle: locBlocks(
      "We're based in Punta Cana — the epicenter of the country's real estate boom. This market isn't abstract to us.",
      "Tenemos base en Punta Cana — el epicentro del boom inmobiliario del país. Este mercado no nos es ajeno.",
    ),
    items: [
      {
        _key: key(),
        icon: "ShieldCheck",
        title: loc(
          "Credibility that Closes High-Ticket Sales",
          "Credibilidad que Cierra Ventas de Alto Valor",
        ),
        description: locBlocks(
          "Before wiring a deposit across a border, every buyer googles you. A fast, professional, bilingual website is the difference between 'looks legitimate' and a closed tab.",
          "Antes de enviar un depósito desde el exterior, todo comprador te googlea. Una página web rápida, profesional y bilingüe es la diferencia entre 'se ve serio' y una pestaña cerrada.",
        ),
      },
      {
        _key: key(),
        icon: "Search",
        title: loc(
          "SEO Where Buyers Actually Search",
          "SEO Donde Realmente Busca el Comprador",
        ),
        description: locBlocks(
          "From 'apartamentos en venta en Punta Cana' to 'condo for sale Dominican Republic' — bilingual SEO puts your listings in both markets' searches, local and international.",
          "Desde 'apartamentos en venta en Punta Cana' hasta 'condo for sale Dominican Republic' — el SEO bilingüe pone tus propiedades en las búsquedas de ambos mercados, el local y el internacional.",
        ),
      },
      {
        _key: key(),
        icon: "Images",
        title: loc(
          "Fast Galleries, Properties that Sell Themselves",
          "Galerías Rápidas, Propiedades que Enamoran",
        ),
        description: locBlocks(
          "Real estate sites drown in photos — and slow galleries kill interest. Ours load in under two seconds with full-resolution images, on any device, on any connection.",
          "Los sitios inmobiliarios se ahogan en fotos — y las galerías lentas matan el interés. Las nuestras cargan en menos de dos segundos con imágenes en alta resolución, en cualquier dispositivo y conexión.",
        ),
      },
      {
        _key: key(),
        icon: "MessageSquare",
        title: loc(
          "Leads Straight to Your WhatsApp",
          "Leads Directo a tu WhatsApp",
        ),
        description: locBlocks(
          "Every property page has one-tap WhatsApp contact and viewing-request forms — so an interested buyer becomes a conversation before they drift to the next listing.",
          "Cada página de propiedad tiene contacto por WhatsApp de un toque y formularios para agendar visitas — para que un comprador interesado se convierta en conversación antes de irse al siguiente anuncio.",
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
        stepTitle: loc("Discovery & Planning", "Descubrimiento y Planificación"),
        description: locBlocks(
          "We learn about your agency, your zones and the buyers you serve. You complete our project questionnaire and we define the full scope, sitemap and timeline together.",
          "Conocemos tu inmobiliaria, tus zonas y los compradores que atiendes. Completas nuestro cuestionario de proyecto y juntos definimos el alcance, mapa del sitio y cronograma.",
        ),
        duration: loc("3–5 days", "3–5 días"),
      },
      {
        _key: key(),
        number: 2,
        icon: "Palette",
        stepTitle: loc("Design & Prototyping", "Diseño y Prototipado"),
        description: locBlocks(
          "We create a custom visual design that projects the professionalism your listings deserve. You review the design and we refine it across two revision rounds until it's perfect.",
          "Creamos un diseño visual personalizado que proyecta el profesionalismo que merecen tus propiedades. Revisas el diseño y lo refinamos en dos rondas de revisión hasta que quede perfecto.",
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
          "We build your site with Next.js and connect it to Sanity CMS so you can add properties, update prices and mark units sold yourself. SEO, performance and responsive design are built in.",
          "Construimos tu sitio con Next.js y lo conectamos a Sanity CMS para que agregues propiedades, actualices precios y marques unidades vendidas tú mismo. SEO, rendimiento y diseño responsivo vienen integrados.",
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
      "Websites we've built for Dominican businesses.",
      "Páginas web que hemos creado para negocios dominicanos.",
    ),
    // Attach real `project` references in Studio (max 3). Your most
    // photo-rich, gallery-heavy work first — it's the closest visual proxy
    // to a property catalog until you land a real-estate client.
    projects: [],
    ctaText: loc("View Full Portfolio", "Ver Portafolio Completo"),
    ctaHref: "/portfolio",
  },

  // ── TESTIMONIALS (same three clients; sales-results story first) ──────────
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
      "What real estate professionals ask us most.",
      "Lo que más nos preguntan los profesionales inmobiliarios.",
    ),
    items: [
      {
        _key: key(),
        question: loc(
          "How much does a real estate website cost?",
          "¿Cuánto cuesta una página web para mi inmobiliaria?",
        ),
        // Figures verified against your live landing pages (July 2026).
        answer: locBlocks(
          "A complete website with a self-managed property catalog starts at $950 USD; a focused pre-construction landing page starts at $400 and web applications at $1,250 — 50% upfront, 50% on delivery, with no hidden fees and no monthly platform charges.",
          "Un sitio web completo con catálogo de propiedades autoadministrable comienza en $950 USD; una landing page de preventa enfocada comienza en $400 y las aplicaciones web en $1,250 — 50% al inicio y 50% al entregar, sin costos ocultos ni cuotas mensuales de plataforma.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Can I add and edit properties myself?",
          "¿Puedo agregar y editar propiedades yo mismo?",
        ),
        answer: locBlocks(
          "Yes — that's the core of the build. Add listings with photos and specs, update prices, mark units reserved or sold, all from your phone or laptop. We train you and your agents before launch, and the same listing publishes in both languages.",
          "Sí — ese es el corazón del proyecto. Agrega propiedades con fotos y especificaciones, actualiza precios, marca unidades reservadas o vendidas, todo desde tu celular o laptop. Te capacitamos a ti y a tus agentes antes del lanzamiento, y la misma propiedad se publica en ambos idiomas.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Will international buyers find my site?",
          "¿Los compradores extranjeros encontrarán mi sitio?",
        ),
        answer: locBlocks(
          "That's what the English version is for. It ships with international SEO — optimized titles, structured data and fast load times — so buyers searching from the US, Canada or Europe find your listings while researching from abroad, and see an agency they can trust.",
          "Para eso está la versión en inglés. Se entrega con SEO internacional — títulos optimizados, datos estructurados y carga rápida — para que compradores buscando desde EE. UU., Canadá o Europa encuentren tus propiedades investigando desde el exterior, y vean una inmobiliaria en la que pueden confiar.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Does it work for pre-construction projects?",
          "¿Sirve para proyectos en preventa?",
        ),
        answer: locBlocks(
          "Yes — dedicated landing pages with renders, unit tables, payment plans and lead-capture forms, built to receive traffic from Google and Meta ads. If your project takes online reservations, we can integrate payments for unit deposits as well.",
          "Sí — landing pages dedicadas con renders, tablas de unidades, planes de pago y formularios de captación, hechas para recibir tráfico de anuncios de Google y Meta. Si tu proyecto acepta separaciones en línea, también podemos integrar pagos para depósitos de unidades.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Should I stop publishing on real estate portals?",
          "¿Debo dejar de publicar en portales inmobiliarios?",
        ),
        answer: locBlocks(
          "No — portals like SuperCasas bring you local buyers who are actively searching, and that reach is worth keeping. Your own website does what portals can't: build your brand, rank in English for international buyers, and convert your referrals and ad traffic into leads that belong to you, not to the portal.",
          "No — los portales como SuperCasas te traen compradores locales que están buscando activamente, y ese alcance vale la pena. Tu propia página web hace lo que los portales no pueden: construir tu marca, posicionar en inglés para compradores internacionales y convertir tus referidos y tráfico de anuncios en leads que te pertenecen a ti, no al portal.",
        ),
      },
    ],
  },

  // ── STRUCTURED DATA (industry-scoped Service — replaces the auto one) ─────
  structuredData: { en: inmoServiceEn, es: inmoServiceEs },
}

// ─────────────────────────────────────────────────────────────────────────────
// seo document (metadata)
// ─────────────────────────────────────────────────────────────────────────────

const inmobiliariasSeo = {
  _type: "seo",
  _id: "seo-paginas-web-para-inmobiliarias",
  pageName: "paginas-web-para-inmobiliarias",
  meta: {
    en: {
      title: "Real Estate Web Design Dominican Republic | DR Web Studio",
      description:
        "Real estate website design in the Dominican Republic: bilingual property catalogs, fast galleries and WhatsApp leads for international buyers. Free quotes.",
      keywords: [
        "real estate website design dominican republic",
        "real estate web design punta cana",
        "property listing website",
      ],
    },
    es: {
      title: "Diseño de Páginas Web para Inmobiliarias | DR Web Studio",
      description:
        "Diseño de páginas web para inmobiliarias en República Dominicana: catálogo de propiedades bilingüe, galerías rápidas y leads por WhatsApp. Cotización gratis.",
      keywords: [
        "páginas web para inmobiliarias",
        "diseño web inmobiliaria",
        "página web para bienes raíces",
        "página web inmobiliaria república dominicana",
        "diseño de páginas web para inmobiliarias",
      ],
    },
  },
  openGraph: {
    en: {
      title: "Real Estate Websites — Built for International Buyers",
      description:
        "Bilingual property catalogs you manage yourself, pre-construction landing pages, and leads straight to your WhatsApp. Built in Punta Cana. Free quotes.",
    },
    es: {
      title:
        "Páginas Web para Inmobiliarias — Hechas para el Comprador Internacional",
      description:
        "Catálogos de propiedades bilingües que administras tú mismo, landing pages de preventa y leads directo a tu WhatsApp. Creadas en Punta Cana. Cotización gratis.",
    },
    // image: upload in Studio (1200x630 — a striking property shot)
  },
  structuredData: { en: "", es: "" },
  canonicalUrl: "",
  noIndex: false,
  noFollow: false,
}

// ─────────────────────────────────────────────────────────────────────────────
// Write
// ─────────────────────────────────────────────────────────────────────────────

async function seed() {
  await client.createOrReplace(
    inmobiliariasPage as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded landing page: paginas-web-para-inmobiliarias")

  await client.createOrReplace(
    inmobiliariasSeo as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded SEO doc: paginas-web-para-inmobiliarias")

  console.log("")
  console.log("Next steps: see the header comment — note the anchor split vs")
  console.log("the future alquileres-vacacionales page before wiring links.")
}

seed().catch(console.error)
