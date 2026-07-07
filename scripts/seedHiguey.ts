/**
 * Seed script — Higüey ONLY
 *
 * Creates the bilingual (en/es) landing page document AND its seo document for:
 *   slug "diseno-de-paginas-web-higuey"
 *   → target: "diseño de páginas web en Higüey" / "diseño web Higüey"
 *
 * Does NOT touch the other city documents.
 * Idempotent: safe to run repeatedly (createOrReplace) — but note it will
 * overwrite any edits made to these two Higüey documents in Studio.
 *
 * ── AFTER SEEDING ───────────────────────────────────────────────────────────
 *
 * 1. seo.ts — add this option to the pageName dropdown list:
 *      {
 *        title: "Diseño de Páginas Web Higüey (Landing)",
 *        value: "diseno-de-paginas-web-higuey",
 *      },
 *
 * 2. ROUTE — create, mirroring an existing landing page route:
 *      src/app/(root)/[lang]/diseno-de-paginas-web-higuey/page.tsx
 *    fetching with getLandingPage("diseno-de-paginas-web-higuey", lang).
 *
 * 3. INTERNAL LINKS — one contextual link from the national hub
 *    /es/diseno-web-republica-dominicana with anchor
 *    "diseño de páginas web en Higüey"; from this page, one link back to the
 *    hub and one to /es (anchor "desarrollo web en República Dominicana").
 *    Also cross-link with the La Romana page and your Punta Cana landing page
 *    once each — the three eastern pages support each other.
 *
 * 4. SITEMAP — confirm the slug is emitted for en + es with hreflang
 *    alternates, and verify the EN URLs inside the structuredData below if
 *    your English route uses a translated slug.
 *
 * 5. STUDIO — attach portfolio projects (Sertuin Events / Punta Cana Tour
 *    Store first for this commerce-minded audience) and upload a 1200x630
 *    OG image.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seedHiguey.ts
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

const hgAreas = [
  { "@type": "City", name: "Higüey" },
  { "@type": "AdministrativeArea", name: "Provincia La Altagracia" },
]

const hgCityServiceEs = serviceNode({
  url: `${BASE}/es/diseno-de-paginas-web-higuey`,
  name: "Diseño de Páginas Web en Higüey",
  serviceType: "Diseño y desarrollo de páginas web",
  description:
    "Diseño de páginas web para comercios, servicios y proveedores en Higüey y la provincia La Altagracia, República Dominicana.",
  areaServed: hgAreas,
})

const hgCityServiceEn = serviceNode({
  url: `${BASE}/en/diseno-de-paginas-web-higuey`,
  name: "Web Design in Higüey",
  serviceType: "Web design and development",
  description:
    "Web design for local businesses, services and hotel suppliers in Higüey and La Altagracia province, Dominican Republic.",
  areaServed: hgAreas,
})

// ─────────────────────────────────────────────────────────────────────────────
// Higüey — landing page document
// Angle: the commerce and services capital of our own province. Higüey isn't
// the tourist destination — it's the city the tourism corridor's economy runs
// through: local shops, clinics and services, the workforce housing boom, and
// the suppliers who sell to Punta Cana / Bávaro hotels. Everything here
// happens on mobile phones and WhatsApp.
// ─────────────────────────────────────────────────────────────────────────────

const higueyPage: Record<string, unknown> = {
  _type: "landingPage",
  _id: "landingPage-diseno-paginas-web-higuey",
  title: "Diseño de Páginas Web en Higüey (City Landing Page)",
  slug: { _type: "slug", current: "diseno-de-paginas-web-higuey" },

  // ── HERO ──────────────────────────────────────────────────────────────────
  hero: {
    headline: loc(
      "Web Design in Higüey",
      "Diseño de Páginas Web en Higüey",
    ),
    subheadline: loc(
      "Fast, professional websites for Higüey's shops, services and suppliers — built by your neighbors in Punta Cana, in the same province.",
      "Páginas web rápidas y profesionales para los comercios, servicios y proveedores de Higüey — creadas por tus vecinos en Punta Cana, en la misma provincia.",
    ),
    primaryCta: loc("Get a Free Quote", "Solicitar Cotización Gratis"),
    primaryCtaHref: "/contact",
    secondaryCta: loc("View Our Portfolio", "Ver Nuestro Portafolio"),
    secondaryCtaHref: "/portfolio",
    badge: loc(
      "Serving Higüey and all of La Altagracia — from right here in the province",
      "Atendemos Higüey y toda La Altagracia — desde la misma provincia",
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
      "Websites for How Higüey Does Business",
      "Páginas Web para Cómo se Hacen Negocios en Higüey",
    ),
    sectionSubtitle: locBlocks(
      "The East's economy runs through Higüey — and your customers now check Google and WhatsApp before they check the street.",
      "La economía del Este pasa por Higüey — y tus clientes ahora revisan Google y WhatsApp antes de revisar la calle.",
    ),
    items: [
      {
        _key: key(),
        icon: "Store",
        title: loc(
          "Local Businesses & Services",
          "Comercios y Servicios Locales",
        ),
        description: locBlocks(
          "Professional websites for Higüey's shops, clinics, pharmacies, schools, hardware stores and professional services — so customers searching Google find you, trust you and contact you.",
          "Páginas web profesionales para comercios, clínicas, farmacias, colegios, ferreterías y servicios profesionales de Higüey — para que los clientes que buscan en Google te encuentren, confíen en ti y te contacten.",
        ),
        linkSlug: "custom-websites",
      },
      {
        _key: key(),
        icon: "Truck",
        title: loc(
          "Suppliers to the Tourism Corridor",
          "Proveedores del Corredor Turístico",
        ),
        description: locBlocks(
          "Sell to the hotels and resorts of Punta Cana, Bávaro and Cap Cana? A professional bilingual site is what procurement teams expect before they sign — we build the ones that win contracts.",
          "¿Vendes a los hoteles y resorts de Punta Cana, Bávaro y Cap Cana? Un sitio profesional y bilingüe es lo que los departamentos de compras esperan antes de firmar — nosotros creamos los que ganan contratos.",
        ),
        linkSlug: "landing-pages",
      },
      {
        _key: key(),
        icon: "ShoppingCart",
        title: loc(
          "Online Stores & Ordering",
          "Tiendas Online y Pedidos",
        ),
        description: locBlocks(
          "Take orders beyond your neighborhood: online stores with secure payments and WhatsApp ordering flows, built for a city that shops from the phone.",
          "Recibe pedidos más allá de tu sector: tiendas online con pagos seguros y flujos de pedidos por WhatsApp, hechas para una ciudad que compra desde el celular.",
        ),
        linkSlug: "ecommerce",
      },
    ],
  },

  // ── WHY CHOOSE US ─────────────────────────────────────────────────────────
  whyUs: {
    sectionTitle: loc(
      "Why Higüey Businesses Choose Us",
      "Por Qué los Negocios de Higüey Nos Eligen",
    ),
    sectionSubtitle: locBlocks(
      "We're not an agency in the capital — we're in your province.",
      "No somos una agencia en la capital — estamos en tu provincia.",
    ),
    items: [
      {
        _key: key(),
        icon: "MapPin",
        title: loc("From La Altagracia", "Somos de La Altagracia"),
        description: locBlocks(
          "We're based in Punta Cana — same province, under an hour away. We know Higüey's market because it's our region too, and the whole process runs conveniently by video call and WhatsApp.",
          "Estamos en Punta Cana — misma provincia, a menos de una hora. Conocemos el mercado de Higüey porque también es nuestra región, y todo el proceso se maneja cómodamente por videollamada y WhatsApp.",
        ),
      },
      {
        _key: key(),
        icon: "TrendingUp",
        title: loc("Grow with the East", "Crece con la Región Este"),
        description: locBlocks(
          "La Altagracia is the fastest-growing region in the country. A professional website positions your business to capture that growth — new residents, new contracts, new customers.",
          "La Altagracia es la región de mayor crecimiento del país. Una página web profesional posiciona tu negocio para captar ese crecimiento — nuevos residentes, nuevos contratos, nuevos clientes.",
        ),
      },
      {
        _key: key(),
        icon: "Smartphone",
        title: loc("Truly Mobile-First", "Mobile-First de Verdad"),
        description: locBlocks(
          "Your customers browse on phones with mobile data. We build with Next.js so your site loads instantly on any connection — no slow WordPress templates.",
          "Tus clientes navegan desde el celular con datos móviles. Construimos con Next.js para que tu sitio cargue al instante en cualquier conexión — sin plantillas lentas de WordPress.",
        ),
      },
      {
        _key: key(),
        icon: "MessageSquare",
        title: loc("Built for WhatsApp Sales", "Ventas por WhatsApp"),
        description: locBlocks(
          "In Higüey, deals close on WhatsApp. Every site we build puts a one-tap WhatsApp button where it counts, turning visits into conversations and conversations into sales.",
          "En Higüey los negocios se cierran por WhatsApp. Cada sitio que construimos pone un botón de WhatsApp de un toque donde importa, convirtiendo visitas en conversaciones y conversaciones en ventas.",
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
          "We learn about your business, your customers and how you sell today. You complete our project questionnaire and we define the full scope, sitemap and timeline together.",
          "Conocemos tu negocio, tus clientes y cómo vendes hoy. Completas nuestro cuestionario de proyecto y juntos definimos el alcance, mapa del sitio y cronograma.",
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
          "We build your site with Next.js and connect it to Sanity CMS so you can update products, prices or services yourself. SEO, performance and responsive design are built in.",
          "Construimos tu sitio con Next.js y lo conectamos a Sanity CMS para que actualices productos, precios o servicios tú mismo. SEO, rendimiento y diseño responsivo vienen integrados.",
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
      "Websites we've built for businesses right here in the East.",
      "Páginas web que hemos creado para negocios aquí mismo en el Este.",
    ),
    // Attach real `project` references in Studio (max 3). Lead with the
    // commerce/results story (Sertuin Events) for this audience.
    projects: [],
    ctaText: loc("View Full Portfolio", "Ver Portafolio Completo"),
    ctaHref: "/portfolio",
  },

  // ── TESTIMONIALS (same three clients; commerce/results story first) ───────
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
          "Professional, fast, and exactly what we needed. They understood our vision and delivered beyond expectations.",
          "Profesionales, rápidos y justo lo que necesitábamos. Comprendieron nuestra visión y superaron nuestras expectativas.",
        ),
        author: "Alex Castro",
        company: "Punta Cana Tour Store",
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
    ],
  },

  // ── FAQ (feeds auto-generated FAQPage JSON-LD — fill BOTH locales) ────────
  faq: {
    sectionTitle: loc("Frequently Asked Questions", "Preguntas Frecuentes"),
    sectionSubtitle: locBlocks(
      "What Higüey business owners ask us most.",
      "Lo que más nos preguntan los dueños de negocios en Higüey.",
    ),
    items: [
      {
        _key: key(),
        question: loc(
          "How much does a website cost in Higüey?",
          "¿Cuánto cuesta una página web en Higüey?",
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
          "Do you serve businesses in Higüey from Punta Cana?",
          "¿Atienden negocios en Higüey desde Punta Cana?",
        ),
        answer: locBlocks(
          "Yes — we're in the same province, under an hour away. The process runs conveniently by video call and WhatsApp, and you work directly with the developer building your site, not a distant agency.",
          "Sí — estamos en la misma provincia, a menos de una hora. El proceso se maneja cómodamente por videollamada y WhatsApp, y trabajas directamente con el desarrollador que construye tu sitio, no con una agencia distante.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "My business sells locally in Higüey — will a website really help?",
          "Mi negocio vende localmente en Higüey — ¿de verdad me ayuda una página web?",
        ),
        answer: locBlocks(
          "Yes — your customers already search Google before choosing where to buy. A professional site with local SEO helps you appear in those searches and in Maps, and with one-tap WhatsApp contact, an online visit becomes a sale. We also guide you on setting up your Google Business Profile.",
          "Sí — tus clientes ya buscan en Google antes de decidir dónde comprar. Un sitio profesional con SEO local te ayuda a aparecer en esas búsquedas y en Maps, y con contacto por WhatsApp de un toque, una visita online se convierte en una venta. Además te guiamos para configurar tu Perfil de Negocio de Google.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Do you build websites for companies that supply hotels in Punta Cana and Bávaro?",
          "¿Hacen páginas web para empresas que venden a hoteles de Punta Cana y Bávaro?",
        ),
        answer: locBlocks(
          "Yes — it's one of the strongest cases for a website in La Altagracia. A professional, bilingual site with your catalog and credentials is what resort procurement teams expect to see before signing a supplier. We build sites designed to win those contracts.",
          "Sí — es uno de los casos más fuertes para tener página web en La Altagracia. Un sitio profesional y bilingüe con tu catálogo y credenciales es lo que los departamentos de compras de los resorts esperan ver antes de firmar con un proveedor. Creamos sitios diseñados para ganar esos contratos.",
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
  structuredData: { en: hgCityServiceEn, es: hgCityServiceEs },
}

// ─────────────────────────────────────────────────────────────────────────────
// seo document (metadata)
// ─────────────────────────────────────────────────────────────────────────────

const higueySeo = {
  _type: "seo",
  _id: "seo-diseno-de-paginas-web-higuey",
  pageName: "diseno-de-paginas-web-higuey",
  meta: {
    en: {
      title: "Web Design in Higüey, Dominican Republic | DR Web Studio",
      description:
        "Professional web design for shops, services and hotel suppliers in Higüey, La Altagracia. Fast, bilingual, Google-optimized websites. Free quotes.",
      keywords: [
        "web design higuey dominican republic",
        "website design la altagracia",
        "web development higuey",
      ],
    },
    es: {
      title: "Diseño de Páginas Web en Higüey | DR Web Studio",
      description:
        "Diseño de páginas web para comercios, servicios y proveedores en Higüey. Sitios rápidos, optimizados para Google y listos para WhatsApp. Cotización gratis.",
      keywords: [
        "diseño de páginas web en higüey",
        "diseño web higüey",
        "páginas web higüey",
        "desarrollo web higüey",
        "diseño web la altagracia",
      ],
    },
  },
  openGraph: {
    en: {
      title: "Web Design in Higüey — Fast Sites Built for WhatsApp Sales",
      description:
        "Professional websites for Higüey's businesses and tourism-corridor suppliers. Built by your neighbors in Punta Cana. Get a free quote.",
    },
    es: {
      title:
        "Diseño de Páginas Web en Higüey — Rápidas y Listas para WhatsApp",
      description:
        "Páginas web profesionales para los negocios de Higüey y los proveedores del corredor turístico. Creadas por tus vecinos en Punta Cana. Cotización gratis.",
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
    higueyPage as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded landing page: diseno-de-paginas-web-higuey")

  await client.createOrReplace(
    higueySeo as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded SEO doc: diseno-de-paginas-web-higuey")

  console.log("")
  console.log("Next steps: see the header comment (seo.ts dropdown option,")
  console.log("route folder, internal links, sitemap check, Studio tasks).")
}

seed().catch(console.error)
