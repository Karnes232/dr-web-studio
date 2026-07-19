/**
 * Seed script — San Pedro de Macorís ONLY
 *
 * Creates the bilingual (en/es) landing page document AND its seo document for:
 *   slug "diseno-de-paginas-web-san-pedro-de-macoris"
 *   → target: "diseño de páginas web en San Pedro de Macorís" /
 *             "diseño web San Pedro de Macorís" / "diseño web Juan Dolio"
 *
 * Does NOT touch the other city documents.
 * Idempotent: safe to run repeatedly (createOrReplace) — but note it will
 * overwrite any edits made to these two San Pedro documents in Studio.
 *
 * ── AFTER SEEDING ───────────────────────────────────────────────────────────
 *
 * 1. seo.ts — add this option to the pageName dropdown list:
 *      {
 *        title: "Diseño de Páginas Web San Pedro de Macorís (Landing)",
 *        value: "diseno-de-paginas-web-san-pedro-de-macoris",
 *      },
 *
 * 2. ROUTE — create, mirroring an existing landing page route:
 *      src/app/(root)/[lang]/diseno-de-paginas-web-san-pedro-de-macoris/page.tsx
 *    fetching with getLandingPage("diseno-de-paginas-web-san-pedro-de-macoris", lang).
 *
 * 3. INTERNAL LINKS — one contextual link from the national hub
 *    /es/diseno-web-republica-dominicana with anchor
 *    "diseño de páginas web en San Pedro de Macorís"; from this page, one link
 *    back to the hub and one to /es (anchor "desarrollo web en República
 *    Dominicana"). Cross-link once with the La Romana page (its coastal
 *    neighbor) so the eastern cluster stays connected.
 *
 * 4. SITEMAP — confirm the slug is emitted for en + es with hreflang
 *    alternates, and verify the EN URLs inside the structuredData below if
 *    your English route uses a translated slug.
 *
 * 5. STUDIO — attach portfolio projects (lead with Grand Bay of the Sea for
 *    the Juan Dolio real estate/hospitality audience) and upload a 1200x630
 *    OG image.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seedSanPedro.ts
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
// structuredData — city-scoped Service node (a custom Service REPLACES the
// auto-generated one from getLandingGraph; everything else in the graph stays
// auto-generated: LocalBusiness, WebPage, FAQPage, BreadcrumbList)
// ─────────────────────────────────────────────────────────────────────────────

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

const spmAreas = [
  { "@type": "City", name: "San Pedro de Macorís" },
  { "@type": "AdministrativeArea", name: "Provincia San Pedro de Macorís" },
  { "@type": "City", name: "Juan Dolio" },
  { "@type": "City", name: "Guayacanes" },
]

const spmCityServiceEs = serviceNode({
  url: `${BASE}/es/diseno-de-paginas-web-san-pedro-de-macoris`,
  name: "Diseño de Páginas Web en San Pedro de Macorís",
  serviceType: "Diseño y desarrollo de páginas web",
  description:
    "Diseño de páginas web bilingües para industria, comercios y proyectos inmobiliarios en San Pedro de Macorís y Juan Dolio, República Dominicana.",
  areaServed: spmAreas,
})

const spmCityServiceEn = serviceNode({
  url: `${BASE}/en/diseno-de-paginas-web-san-pedro-de-macoris`,
  name: "Web Design in San Pedro de Macorís",
  serviceType: "Web design and development",
  description:
    "Bilingual web design for industry, local businesses and Juan Dolio real estate in San Pedro de Macorís, Dominican Republic.",
  areaServed: spmAreas,
})

// ─────────────────────────────────────────────────────────────────────────────
// San Pedro de Macorís — landing page document
// Angle: the East's industrial and port city — free zones, the harbor, a
// major university (UCE) — plus the Juan Dolio / Guayacanes coastal corridor
// with its real estate and rental market for foreign and capital-city buyers.
// Cultural hook: la cuna de los peloteros — big-league framing throughout.
// ─────────────────────────────────────────────────────────────────────────────

const sanPedroPage: Record<string, unknown> = {
  _type: "landingPage",
  _id: "landingPage-diseno-paginas-web-san-pedro-de-macoris",
  title: "Diseño de Páginas Web en San Pedro de Macorís (City Landing Page)",
  slug: {
    _type: "slug",
    current: "diseno-de-paginas-web-san-pedro-de-macoris",
  },

  // ── HERO ──────────────────────────────────────────────────────────────────
  hero: {
    headline: loc(
      "Web Design in San Pedro de Macorís",
      "Diseño de Páginas Web en San Pedro de Macorís",
    ),
    subheadline: loc(
      "Fast, bilingual websites for San Pedro's industry, local businesses and the Juan Dolio real estate market — built to big-league standards.",
      "Páginas web rápidas y bilingües para la industria, los comercios y el mercado inmobiliario de Juan Dolio — construidas con estándares de grandes ligas.",
    ),
    primaryCta: loc("Get a Free Quote", "Solicitar Cotización Gratis"),
    primaryCtaHref: "/contact",
    secondaryCta: loc("View Our Portfolio", "Ver Nuestro Portafolio"),
    secondaryCtaHref: "/portfolio",
    badge: loc(
      "Serving San Pedro de Macorís, Juan Dolio and Guayacanes — the whole eastern coast",
      "Atendemos San Pedro de Macorís, Juan Dolio y Guayacanes — toda la costa Este",
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
      "Websites for San Pedro's Three Economies",
      "Páginas Web para las Tres Economías de San Pedro",
    ),
    sectionSubtitle: locBlocks(
      "The port and free zones, the beach corridor, and the city itself — each does business differently, and each needs a different kind of website.",
      "El puerto y las zonas francas, el corredor de playa y la ciudad misma — cada una hace negocios distinto, y cada una necesita un tipo de página web distinto.",
    ),
    items: [
      {
        _key: key(),
        icon: "Anchor",
        title: loc(
          "Industry, Port & Free Zone Websites",
          "Sitios para Industria, Puerto y Zonas Francas",
        ),
        description: locBlocks(
          "Corporate sites and product catalogs for manufacturers, logistics companies and free-zone operations — bilingual and credential-forward, built to pass the scrutiny of international clients.",
          "Sitios corporativos y catálogos de productos para manufactura, logística y operaciones de zonas francas — bilingües y con credenciales al frente, hechos para pasar el escrutinio de clientes internacionales.",
        ),
        linkSlug: "custom-websites",
      },
      {
        _key: key(),
        icon: "Building",
        title: loc(
          "Real Estate & Rentals in Juan Dolio",
          "Bienes Raíces y Alquileres en Juan Dolio",
        ),
        description: locBlocks(
          "Photo-first websites for beachfront projects, apartments and vacation rentals in Juan Dolio and Guayacanes — bilingual for foreign buyers, with fast galleries and WhatsApp inquiries.",
          "Sitios web centrados en fotografía para proyectos frente al mar, apartamentos y alquileres vacacionales en Juan Dolio y Guayacanes — bilingües para compradores extranjeros, con galerías rápidas y consultas por WhatsApp.",
        ),
        linkSlug: "landing-pages",
      },
      {
        _key: key(),
        icon: "ShoppingBag",
        title: loc(
          "Local Businesses & Online Stores",
          "Comercios Locales y Tiendas Online",
        ),
        description: locBlocks(
          "Websites and online stores for the city's shops, restaurants, clinics and services — including the businesses serving San Pedro's university community — with mobile-first speed and one-tap contact.",
          "Páginas web y tiendas online para los comercios, restaurantes, clínicas y servicios de la ciudad — incluyendo los negocios que atienden a la comunidad universitaria de San Pedro — con velocidad mobile-first y contacto de un toque.",
        ),
        linkSlug: "ecommerce",
      },
    ],
  },

  // ── WHY CHOOSE US ─────────────────────────────────────────────────────────
  whyUs: {
    sectionTitle: loc(
      "Why San Pedro Businesses Choose Us",
      "Por Qué los Negocios de San Pedro Nos Eligen",
    ),
    sectionSubtitle: locBlocks(
      "The city that sends players to the big leagues shouldn't settle for a minor-league website.",
      "La ciudad que envía peloteros a las grandes ligas no debería conformarse con una página web de ligas menores.",
    ),
    items: [
      {
        _key: key(),
        icon: "Trophy",
        title: loc("A Big-League Website", "Una Página Web de Grandes Ligas"),
        description: locBlocks(
          "We build with Next.js — the same technology behind the world's leading sites — not slow, plugin-heavy templates. Your business gets major-league performance from day one.",
          "Construimos con Next.js — la misma tecnología detrás de los sitios líderes del mundo — no plantillas lentas cargadas de plugins. Tu negocio juega en las mayores desde el primer día.",
        ),
      },
      {
        _key: key(),
        icon: "Globe",
        title: loc(
          "Bilingual for International Business",
          "Bilingüe para Negocios Internacionales",
        ),
        description: locBlocks(
          "Free-zone clients, port partners and Juan Dolio buyers all evaluate you in English. Every site ships fully bilingual — Spanish and English — with international SEO built in.",
          "Los clientes de zonas francas, los socios del puerto y los compradores de Juan Dolio te evalúan en inglés. Cada sitio se entrega completamente bilingüe — español e inglés — con SEO internacional integrado.",
        ),
      },
      {
        _key: key(),
        icon: "Zap",
        title: loc("Fast on Any Connection", "Rápidas en Cualquier Conexión"),
        description: locBlocks(
          "Your customers browse on phones with mobile data. Our sites load in under two seconds, keep visitors on the page, and score higher with Google.",
          "Tus clientes navegan desde el celular con datos móviles. Nuestros sitios cargan en menos de dos segundos, retienen a los visitantes y puntúan mejor en Google.",
        ),
      },
      {
        _key: key(),
        icon: "Search",
        title: loc("Local SEO that Works", "SEO Local que Trabaja"),
        description: locBlocks(
          "Structured data, optimized titles and Google Business Profile guidance — so you show up when people search for your industry in San Pedro or Juan Dolio, in either language.",
          "Datos estructurados, títulos optimizados y orientación para tu Perfil de Negocio de Google — para que aparezcas cuando busquen tu industria en San Pedro o Juan Dolio, en cualquiera de los dos idiomas.",
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
          "We build your site with Next.js and connect it to Sanity CMS so you can update catalogs, listings or menus yourself. SEO, performance and responsive design are built in.",
          "Construimos tu sitio con Next.js y lo conectamos a Sanity CMS para que actualices catálogos, propiedades o menús tú mismo. SEO, rendimiento y diseño responsivo vienen integrados.",
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
      "Websites we've built for businesses across the East.",
      "Páginas web que hemos creado para negocios en todo el Este.",
    ),
    // Attach real `project` references in Studio (max 3). Lead with Grand Bay
    // of the Sea — the most relevant proof for the Juan Dolio audience.
    projects: [],
    ctaText: loc("View Full Portfolio", "Ver Portafolio Completo"),
    ctaHref: "/portfolio",
  },

  // ── TESTIMONIALS (same three clients; hospitality/property story first) ───
  testimonials: {
    sectionTitle: loc("What Our Clients Say", "Lo que Dicen Nuestros Clientes"),
    items: [
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
      "What San Pedro business owners ask us most.",
      "Lo que más nos preguntan los dueños de negocios en San Pedro.",
    ),
    items: [
      {
        _key: key(),
        question: loc(
          "How much does a website cost in San Pedro de Macorís?",
          "¿Cuánto cuesta una página web en San Pedro de Macorís?",
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
          "Do you build websites for free-zone and port companies?",
          "¿Hacen páginas web para empresas de zonas francas y del puerto?",
        ),
        answer: locBlocks(
          "Yes — industrial and logistics companies are exactly where a bilingual, credential-forward website earns its keep: international clients and partners evaluate you online before any meeting. We build corporate sites and product catalogs designed to pass that evaluation.",
          "Sí — las empresas industriales y de logística son exactamente donde un sitio bilingüe con credenciales al frente se paga solo: los clientes y socios internacionales te evalúan en línea antes de cualquier reunión. Creamos sitios corporativos y catálogos de productos diseñados para pasar esa evaluación.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Do you make websites for real estate projects and rentals in Juan Dolio?",
          "¿Hacen páginas para proyectos inmobiliarios y alquileres en Juan Dolio?",
        ),
        answer: locBlocks(
          "Yes — bilingual by default, which matters in Juan Dolio where many buyers and renters are foreigners or capital-city families. Fast photo galleries, availability inquiries by WhatsApp, and English SEO so international buyers find your project while searching from abroad.",
          "Sí — bilingües por defecto, lo cual importa en Juan Dolio donde muchos compradores e inquilinos son extranjeros o familias de la capital. Galerías de fotos rápidas, consultas de disponibilidad por WhatsApp y SEO en inglés para que compradores internacionales encuentren tu proyecto buscando desde el exterior.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "How do we work together if you're in Punta Cana?",
          "¿Cómo trabajamos si ustedes están en Punta Cana?",
        ),
        answer: locBlocks(
          "We're on the same eastern coast, and the entire process runs by video call and WhatsApp on your schedule — consultation, design reviews, training and support. You always deal directly with the developer building your site.",
          "Estamos en la misma costa Este, y todo el proceso se maneja por videollamada y WhatsApp según tu horario — consulta, revisiones de diseño, capacitación y soporte. Siempre tratas directamente con el desarrollador que construye tu sitio.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "How long until my website is live?",
          "¿En cuánto tiempo estará lista mi página web?",
        ),
        answer: locBlocks(
          "Landing pages take 2–3 weeks, custom business websites 6–8 weeks, and web applications 5–8 weeks. You'll receive a detailed timeline during the discovery phase.",
          "Las landing pages toman 2–3 semanas, los sitios web empresariales 6–8 semanas y las aplicaciones web 5–8 semanas. Recibirás un cronograma detallado durante la fase de descubrimiento.",
        ),
      },
    ],
  },

  // ── STRUCTURED DATA (city-scoped Service — replaces the auto-generated) ───
  structuredData: { en: spmCityServiceEn, es: spmCityServiceEs },
}

// ─────────────────────────────────────────────────────────────────────────────
// seo document (metadata)
// ─────────────────────────────────────────────────────────────────────────────

const sanPedroSeo = {
  _type: "seo",
  _id: "seo-diseno-de-paginas-web-san-pedro-de-macoris",
  pageName: "diseno-de-paginas-web-san-pedro-de-macoris",
  meta: {
    en: {
      title: "Web Design in San Pedro de Macorís | DR Web Studio",
      description:
        "Bilingual web design for industry, free zones, local businesses and Juan Dolio real estate in San Pedro de Macorís, Dominican Republic. Free quotes.",
      keywords: [
        "web design san pedro de macoris",
        "website design juan dolio",
        "web development san pedro dominican republic",
      ],
    },
    es: {
      title: "Diseño de Páginas Web San Pedro de Macorís | DR Web Studio",
      description:
        "Diseño de páginas web para industria, comercios y proyectos inmobiliarios en San Pedro de Macorís y Juan Dolio. Sitios bilingües y rápidos. Cotización gratis.",
      keywords: [
        "diseño de páginas web en san pedro de macorís",
        "diseño web san pedro de macoris",
        "páginas web san pedro de macoris",
        "diseño web juan dolio",
        "desarrollo web san pedro de macoris",
      ],
    },
  },
  openGraph: {
    en: {
      title: "Web Design in San Pedro de Macorís — Big-League Websites",
      description:
        "Bilingual websites for San Pedro's industry, local businesses and the Juan Dolio real estate market. Fast, modern and built to rank. Get a free quote.",
    },
    es: {
      title: "Diseño de Páginas Web en San Pedro de Macorís — De Grandes Ligas",
      description:
        "Páginas web bilingües para la industria, los comercios y el mercado inmobiliario de Juan Dolio. Rápidas, modernas y hechas para posicionar. Cotización gratis.",
    },
    // image: upload in Studio (1200x630)
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
    sanPedroPage as Parameters<typeof client.createOrReplace>[0],
  )
  console.log(
    "✓ Seeded landing page: diseno-de-paginas-web-san-pedro-de-macoris",
  )

  await client.createOrReplace(
    sanPedroSeo as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded SEO doc: diseno-de-paginas-web-san-pedro-de-macoris")

  console.log("")
  console.log("Next steps: see the header comment (seo.ts dropdown option,")
  console.log("route folder, internal links, sitemap check, Studio tasks).")
}

seed().catch(console.error)
