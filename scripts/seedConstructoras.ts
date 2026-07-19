/**
 * Seed script — INDUSTRY PAGE: Constructoras y Arquitectos ONLY
 *
 * Creates the bilingual (en/es) landing page document AND its seo document for:
 *   slug "paginas-web-para-constructoras"
 *   → target: "páginas web para constructoras" / "página web para
 *             arquitectos" / "construction web design dominican republic"
 *
 * SCOPE SPLIT (vs. the inmobiliarias page — respect it):
 *   • The inmobiliarias page = SELLING property (agencies, agents, preventa
 *     sales). Anchors with "inmobiliaria(s)" / "bienes raíces" point THERE.
 *   • THIS page = WINNING construction and design contracts (builders,
 *     architects, engineers, remodelers). Anchors with "constructoras" /
 *     "arquitectos" point HERE. Cross-link the two pages once each — a
 *     developer often needs both.
 *
 * INDUSTRY PAGE CONVENTIONS (same as the other industry seeds):
 *   • Flat slug: paginas-web-para-{industria}
 *   • EN route slug (translated): web-design-for-construction — the EN
 *     structuredData URLs below assume this; adjust if you pick another.
 *   • structuredData: Service node with `audience` + `areaServed` Country.
 *
 * Does NOT touch any other documents.
 * Idempotent (createOrReplace) — but it will overwrite Studio edits to these
 * two documents.
 *
 * ── AFTER SEEDING ───────────────────────────────────────────────────────────
 *
 * 1. seo.ts — add this option to the pageName dropdown list:
 *      {
 *        title: "Páginas Web para Constructoras (Industry Landing)",
 *        value: "paginas-web-para-constructoras",
 *      },
 *
 * 2. ROUTES — ES route at:
 *      src/app/(root)/[lang]/paginas-web-para-constructoras/page.tsx
 *    and the EN route at web-design-for-construction, both fetching
 *    getLandingPage("paginas-web-para-constructoras", lang).
 *
 * 3. INTERNAL LINKS (city ↔ industry grid) —
 *      • From the national hub: one contextual link, anchor
 *        "páginas web para constructoras".
 *      • From this page: one link to the hub and one to /es.
 *      • City anchors in: Punta Cana (the boom's epicenter) and Santo
 *        Domingo (corporate/construction firms). This page links back to
 *        Punta Cana.
 *      • Sibling: one cross-link each way with the inmobiliarias page,
 *        anchors per the scope split above.
 *
 * 4. SITEMAP — confirm the slug is emitted for en + es with hreflang
 *    alternates.
 *
 * 5. STUDIO — attach portfolio projects (your most photo-rich, structural/
 *    corporate work first) and upload a 1200x630 OG image (a finished build
 *    or striking render).
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seedConstructoras.ts
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
// structuredData — INDUSTRY-scoped Service node (audience: construction,
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

const consServiceEs = industryServiceNode({
  url: `${BASE}/es/paginas-web-para-constructoras`,
  name: "Páginas Web para Constructoras y Arquitectos",
  serviceType: "Diseño de páginas web para constructoras y arquitectos",
  description:
    "Diseño de páginas web para constructoras y arquitectos en República Dominicana: portafolios de obras, inglés para clientes extranjeros y cotizaciones directas.",
  audienceType: "Constructoras, arquitectos, ingenieros y remodeladores",
})

const consServiceEn = industryServiceNode({
  url: `${BASE}/en/web-design-for-construction`,
  name: "Web Design for Construction & Architects",
  serviceType: "Construction and architecture website design",
  description:
    "Web design for construction companies and architects in the Dominican Republic: project portfolios, English for foreign clients and direct quote requests.",
  audienceType: "Construction companies, architects, engineers and remodelers",
})

// ─────────────────────────────────────────────────────────────────────────────
// Constructoras y Arquitectos — industry landing page document
// Angle: projects win projects. In construction, the portfolio of completed
// works IS the sales tool — and clients (developers, homeowners, and above
// all foreigners building villas from abroad) vet a builder online before
// signing anything. Second hook: the country's construction boom, and we're
// based in its epicenter. Third: quote requests that arrive complete
// (project type, size, location, budget range) so estimating starts with
// context, not a cold call.
// ─────────────────────────────────────────────────────────────────────────────

const constructorasPage: Record<string, unknown> = {
  _type: "landingPage",
  _id: "landingPage-paginas-web-para-constructoras",
  title: "Páginas Web para Constructoras (Industry Landing Page)",
  slug: { _type: "slug", current: "paginas-web-para-constructoras" },

  // ── HERO ──────────────────────────────────────────────────────────────────
  hero: {
    headline: loc(
      "Web Design for Construction & Architects",
      "Páginas Web para Constructoras y Arquitectos",
    ),
    subheadline: loc(
      "Portfolio-first websites for builders and architecture studios — because in construction, your finished projects are the pitch, and clients see them online before they ever call.",
      "Páginas web centradas en portafolio para constructoras y estudios de arquitectura — porque en la construcción, tus obras terminadas son el argumento, y los clientes las ven en línea antes de llamar.",
    ),
    primaryCta: loc("Get a Free Quote", "Solicitar Cotización Gratis"),
    primaryCtaHref: "/contact",
    secondaryCta: loc("View Our Portfolio", "Ver Nuestro Portafolio"),
    secondaryCtaHref: "/portfolio",
    badge: loc(
      "For construction companies, architects, engineers and remodelers across the Dominican Republic",
      "Para constructoras, arquitectos, ingenieros y remodeladores en toda República Dominicana",
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
      "What a Builder's Website Must Do",
      "Lo que la Página Web de una Constructora Debe Hacer",
    ),
    sectionSubtitle: locBlocks(
      "Nobody hires a builder for a six-figure project on a business card. They hire the one whose finished work they've already seen.",
      "Nadie contrata una constructora para un proyecto de seis cifras con una tarjeta de presentación. Contratan a la que ya le vieron las obras terminadas.",
    ),
    items: [
      {
        _key: key(),
        icon: "HardHat",
        title: loc(
          "A Portfolio of Works that Sells",
          "Un Portafolio de Obras que Vende",
        ),
        description: locBlocks(
          "Every project with its own page: photos from foundation to delivery, renders, specs and scope. For architecture studios, design-first galleries that let the work speak — organized by type: residential, commercial, remodeling.",
          "Cada proyecto con su propia página: fotos desde los cimientos hasta la entrega, renders, especificaciones y alcance. Para estudios de arquitectura, galerías centradas en el diseño que dejan hablar a la obra — organizadas por tipo: residencial, comercial, remodelación.",
        ),
        linkSlug: "custom-websites",
      },
      {
        _key: key(),
        icon: "Target",
        title: loc(
          "Landing Pages to Win Projects",
          "Landing Pages para Captar Proyectos",
        ),
        description: locBlocks(
          "Building villas for foreign clients? Specializing in remodeling? Focused landing pages for each service line, built to receive Google and Meta ad traffic and turn clicks into site visits and signed contracts.",
          "¿Construyes villas para clientes extranjeros? ¿Te especializas en remodelaciones? Landing pages enfocadas por línea de servicio, hechas para recibir tráfico de anuncios de Google y Meta y convertir clics en visitas de obra y contratos firmados.",
        ),
        linkSlug: "landing-pages",
      },
      {
        _key: key(),
        icon: "Calculator",
        title: loc(
          "Quote Requests that Arrive Complete",
          "Solicitudes de Cotización que Llegan Completas",
        ),
        description: locBlocks(
          "Forms that capture the project type, approximate size, location and budget range — plus one-tap WhatsApp. Your first conversation starts with the essentials answered, so you estimate faster and qualify better.",
          "Formularios que capturan el tipo de proyecto, el tamaño aproximado, la ubicación y el rango de presupuesto — más WhatsApp de un toque. Tu primera conversación empieza con lo esencial respondido, para cotizar más rápido y calificar mejor.",
        ),
        linkSlug: "ecommerce",
      },
    ],
  },

  // ── WHY CHOOSE US ─────────────────────────────────────────────────────────
  whyUs: {
    sectionTitle: loc(
      "Why Builders & Architects Choose Us",
      "Por Qué las Constructoras y Arquitectos Nos Eligen",
    ),
    sectionSubtitle: locBlocks(
      "We're based in Punta Cana — the epicenter of the country's construction boom. We see who's building, and who's hiring them.",
      "Tenemos base en Punta Cana — el epicentro del boom de construcción del país. Vemos quién está construyendo, y quién los está contratando.",
    ),
    items: [
      {
        _key: key(),
        icon: "ShieldCheck",
        title: loc(
          "Credibility for Big Contracts",
          "Credibilidad para Contratos Grandes",
        ),
        description: locBlocks(
          "Before signing a construction contract, every client checks you out online. A professional site with your completed works, credentials and CODIA-registered professionals is the difference between shortlisted and skipped.",
          "Antes de firmar un contrato de construcción, todo cliente te investiga en línea. Un sitio profesional con tus obras terminadas, credenciales y profesionales colegiados en el CODIA es la diferencia entre entrar en la lista corta o quedar fuera.",
        ),
      },
      {
        _key: key(),
        icon: "Globe",
        title: loc(
          "English for Clients Building from Abroad",
          "Inglés para Clientes que Construyen desde el Exterior",
        ),
        description: locBlocks(
          "Foreigners building villas and second homes hire the builder they can vet in English — from abroad, before flying in. Every site ships fully bilingual with international SEO, so that client finds and trusts you.",
          "Los extranjeros que construyen villas y segundas casas contratan a la constructora que pueden evaluar en inglés — desde el exterior, antes de viajar. Cada sitio se entrega completamente bilingüe con SEO internacional, para que ese cliente te encuentre y confíe en ti.",
        ),
      },
      {
        _key: key(),
        icon: "Images",
        title: loc(
          "Heavy Galleries, Instant Load",
          "Galerías de Obra que Cargan al Instante",
        ),
        description: locBlocks(
          "Construction portfolios drown in photos, drone shots and renders — and a gallery that stalls looks like a company that cuts corners. Ours load in under two seconds, full resolution, on any device.",
          "Los portafolios de construcción se ahogan en fotos, tomas de dron y renders — y una galería que se traba parece una empresa que corta esquinas. Las nuestras cargan en menos de dos segundos, en alta resolución, en cualquier dispositivo.",
        ),
      },
      {
        _key: key(),
        icon: "TrendingUp",
        title: loc("In the Middle of the Boom", "En el Centro del Boom"),
        description: locBlocks(
          "Tourism zones, residential projects, commercial builds — the country is pouring concrete, and the contracts go to firms clients can find and verify. Your website puts you in that race.",
          "Zonas turísticas, proyectos residenciales, obras comerciales — el país está vaciando concreto, y los contratos van a las firmas que los clientes pueden encontrar y verificar. Tu página web te mete en esa carrera.",
        ),
      },
    ],
  },

  // ── PROCESS STEPS (the real 5-step process from your live landing pages) ──
  process: {
    sectionTitle: loc("How We Work", "Cómo Trabajamos"),
    sectionSubtitle: locBlocks(
      "A clear, structured process from first call to launch — you'll recognize the discipline from your own projects.",
      "Un proceso claro y estructurado desde la primera llamada hasta el lanzamiento — reconocerás la disciplina de tus propias obras.",
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
          "We learn about your company, your specialties and the projects you want more of. You complete our project questionnaire and we define the full scope, sitemap and timeline together.",
          "Conocemos tu empresa, tus especialidades y los proyectos que quieres atraer. Completas nuestro cuestionario de proyecto y juntos definimos el alcance, mapa del sitio y cronograma.",
        ),
        duration: loc("3–5 days", "3–5 días"),
      },
      {
        _key: key(),
        number: 2,
        icon: "Palette",
        stepTitle: loc("Design & Prototyping", "Diseño y Prototipado"),
        description: locBlocks(
          "We create a custom visual design with the solidity and precision a construction brand should project. You review the design and we refine it across two revision rounds until it's perfect.",
          "Creamos un diseño visual personalizado con la solidez y precisión que debe proyectar una marca de construcción. Revisas el diseño y lo refinamos en dos rondas de revisión hasta que quede perfecto.",
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
          "We build your site with Next.js and connect it to Sanity CMS so you can add finished works, photos and renders yourself. SEO, performance and responsive design are built in.",
          "Construimos tu sitio con Next.js y lo conectamos a Sanity CMS para que agregues obras terminadas, fotos y renders tú mismo. SEO, rendimiento y diseño responsivo vienen integrados.",
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
    // photo-rich, corporate-looking work first — the visual proxy for a
    // construction portfolio until you land a builder client.
    projects: [],
    ctaText: loc("View Full Portfolio", "Ver Portafolio Completo"),
    ctaHref: "/portfolio",
  },

  // ── TESTIMONIALS (same three clients; results story first) ────────────────
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
      "What builders and architects ask us most.",
      "Lo que más nos preguntan las constructoras y los arquitectos.",
    ),
    items: [
      {
        _key: key(),
        question: loc(
          "How much does a construction company website cost?",
          "¿Cuánto cuesta una página web para mi constructora?",
        ),
        // Figures verified against your live landing pages (July 2026).
        answer: locBlocks(
          "A complete website with a project portfolio starts at $950 USD; a focused landing page for one service line starts at $400. 50% upfront, 50% on delivery, with no hidden fees and no monthly platform charges.",
          "Un sitio web completo con portafolio de obras comienza en $950 USD; una landing page enfocada para una línea de servicio comienza en $400. 50% al inicio y 50% al entregar, sin costos ocultos ni cuotas mensuales de plataforma.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Will it help me win foreign clients?",
          "¿Me ayudará a conseguir clientes extranjeros?",
        ),
        answer: locBlocks(
          "It's one of the strongest reasons a Dominican builder invests in a website. Foreigners building villas or second homes vet builders online, in English, from abroad — comparing portfolios before they ever fly in. A bilingual site with your finished works puts you in that comparison.",
          "Es una de las razones más fuertes por las que una constructora dominicana invierte en su página web. Los extranjeros que construyen villas o segundas casas evalúan constructoras en línea, en inglés, desde el exterior — comparando portafolios antes de viajar. Un sitio bilingüe con tus obras terminadas te mete en esa comparación.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Can I add new projects myself?",
          "¿Puedo agregar obras nuevas yo mismo?",
        ),
        answer: locBlocks(
          "Yes — after every delivery, add the project with photos, renders and specs from your phone or laptop, no developer needed. We train you before launch, and everything publishes in both languages.",
          "Sí — después de cada entrega, agrega la obra con fotos, renders y especificaciones desde tu celular o laptop, sin necesitar un programador. Te capacitamos antes del lanzamiento, y todo se publica en ambos idiomas.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Does it work for architecture studios?",
          "¿Sirve para estudios de arquitectura?",
        ),
        answer: locBlocks(
          "Absolutely — for studios we build design-first portfolios where the projects and renders lead: minimal layouts, large imagery, and pages per project that present concept, process and result the way a studio would.",
          "Por supuesto — para estudios construimos portafolios centrados en el diseño donde mandan los proyectos y los renders: diseños minimalistas, imágenes grandes y páginas por proyecto que presentan concepto, proceso y resultado como lo haría un estudio.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "How long until my website is live?",
          "¿En cuánto tiempo estará lista mi página web?",
        ),
        answer: locBlocks(
          "A complete portfolio website takes 6–8 weeks; a focused landing page 2–3 weeks. You'll receive a detailed timeline during the discovery phase.",
          "Un sitio web completo con portafolio toma 6–8 semanas; una landing page enfocada 2–3 semanas. Recibirás un cronograma detallado durante la fase de descubrimiento.",
        ),
      },
    ],
  },

  // ── STRUCTURED DATA (industry-scoped Service — replaces the auto one) ─────
  structuredData: { en: consServiceEn, es: consServiceEs },
}

// ─────────────────────────────────────────────────────────────────────────────
// seo document (metadata)
// ─────────────────────────────────────────────────────────────────────────────

const constructorasSeo = {
  _type: "seo",
  _id: "seo-paginas-web-para-constructoras",
  pageName: "paginas-web-para-constructoras",
  meta: {
    en: {
      title: "Construction & Architect Web Design | DR Web Studio",
      description:
        "Web design for construction companies and architects in the Dominican Republic: project portfolios, English for foreign clients, direct quote requests.",
      keywords: [
        "construction website design dominican republic",
        "architect web design",
        "contractor website design",
      ],
    },
    es: {
      title: "Diseño de Páginas Web para Constructoras | DR Web Studio",
      description:
        "Diseño de páginas web para constructoras y arquitectos en República Dominicana: portafolios de obras, inglés para clientes extranjeros y cotizaciones directas.",
      keywords: [
        "páginas web para constructoras",
        "página web para arquitectos",
        "diseño web constructoras",
        "página web para mi constructora",
        "diseño de páginas web para constructoras",
      ],
    },
  },
  openGraph: {
    en: {
      title: "Construction Websites — Your Finished Projects Are the Pitch",
      description:
        "Portfolio-first websites for builders and architects in the Dominican Republic. Bilingual, fast galleries, quote requests that arrive complete.",
    },
    es: {
      title:
        "Páginas Web para Constructoras — Tus Obras Terminadas Son el Argumento",
      description:
        "Páginas web centradas en portafolio para constructoras y arquitectos en República Dominicana. Bilingües, galerías rápidas y cotizaciones que llegan completas.",
    },
    // image: upload in Studio (1200x630 — a finished build or striking render)
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
    constructorasPage as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded landing page: paginas-web-para-constructoras")

  await client.createOrReplace(
    constructorasSeo as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded SEO doc: paginas-web-para-constructoras")

  console.log("")
  console.log("Next steps: see the header comment — respect the anchor split")
  console.log("with the inmobiliarias page when wiring internal links.")
}

seed().catch(console.error)
