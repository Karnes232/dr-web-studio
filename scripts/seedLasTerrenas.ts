/**
 * Seed script — Las Terrenas / Samaná ONLY
 *
 * Creates the bilingual (en/es) landing page document AND its seo document for:
 *   slug "diseno-de-paginas-web-las-terrenas"
 *   → target: "diseño de páginas web en las terrenas" / "diseño web las
 *             terrenas" / "diseño web samaná" / "web design las terrenas"
 *
 * The page covers the WHOLE Samaná peninsula (Las Terrenas, Samaná town,
 * Las Galeras, El Limón) — deliberately one page, not four. Las Terrenas
 * leads the slug/H1 because that's where the businesses (and the searches)
 * concentrate.
 *
 * HONESTY NOTE: much of this audience is French/Italian/German — but your
 * platform ships Spanish + English. The copy leans on "English-friendly"
 * and a FAQ addresses the language question truthfully. Do NOT add promises
 * of French-language sites unless you actually plan to deliver them.
 *
 * Does NOT touch the other city documents.
 * Idempotent: safe to run repeatedly (createOrReplace) — but note it will
 * overwrite any edits made to these two documents in Studio.
 *
 * ── AFTER SEEDING ───────────────────────────────────────────────────────────
 *
 * 1. seo.ts — add this option to the pageName dropdown list:
 *      {
 *        title: "Diseño de Páginas Web Las Terrenas / Samaná (Landing)",
 *        value: "diseno-de-paginas-web-las-terrenas",
 *      },
 *
 * 2. ROUTE — create, mirroring an existing landing page route:
 *      src/app/(root)/[lang]/diseno-de-paginas-web-las-terrenas/page.tsx
 *    fetching with getLandingPage("diseno-de-paginas-web-las-terrenas", lang).
 *
 * 3. INTERNAL LINKS — one contextual link from the national hub
 *    /es/diseno-web-republica-dominicana with anchor
 *    "diseño de páginas web en Las Terrenas"; from this page, one link back
 *    to the hub and one to /es (anchor "desarrollo web en República
 *    Dominicana"). Cross-link once with the Puerto Plata page (its expat/
 *    tourism sibling). SPECIAL: your existing Las Terrenas blog post is the
 *    single most natural internal link source on the whole site — add a
 *    contextual link from it to this page with the exact anchor.
 *
 * 4. SITEMAP — confirm the slug is emitted for en + es with hreflang
 *    alternates, and verify the EN URLs inside the structuredData below if
 *    your English route uses a translated slug.
 *
 * 5. STUDIO — attach portfolio projects (tourism work first) and upload a
 *    1200x630 OG image.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seedLasTerrenas.ts
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

const ltAreas = [
  { "@type": "City", name: "Las Terrenas" },
  { "@type": "City", name: "Samaná" },
  { "@type": "AdministrativeArea", name: "Provincia Samaná" },
  { "@type": "City", name: "Las Galeras" },
  { "@type": "Place", name: "El Limón" },
]

const ltCityServiceEs = serviceNode({
  url: `${BASE}/es/diseno-de-paginas-web-las-terrenas`,
  name: "Diseño de Páginas Web en Las Terrenas y Samaná",
  serviceType: "Diseño y desarrollo de páginas web",
  description:
    "Diseño de páginas web bilingües para hoteles boutique, excursiones, restaurantes y villas en Las Terrenas y la península de Samaná, República Dominicana.",
  areaServed: ltAreas,
})

const ltCityServiceEn = serviceNode({
  url: `${BASE}/en/diseno-de-paginas-web-las-terrenas`,
  name: "Web Design in Las Terrenas & Samaná",
  serviceType: "Web design and development",
  description:
    "Bilingual web design for boutique hotels, excursions, restaurants and villas in Las Terrenas and the Samaná peninsula, Dominican Republic.",
  areaServed: ltAreas,
})

// ─────────────────────────────────────────────────────────────────────────────
// Las Terrenas / Samaná — landing page document
// Angle: the peninsula — Europe's corner of the Caribbean. Three hooks the
// other pages don't have: (1) WHALE SEASON: Samaná Bay's Jan–Mar humpback
// season is a hard deadline; the busiest 10 weeks of the year are booked
// online months earlier. (2) The boutique hotel / villa scene lives and dies
// by OTA commissions — direct bookings pitch. (3) European expat owners
// (French, Italian, German) who want an English-friendly process — handled
// honestly without promising French-language sites.
// ─────────────────────────────────────────────────────────────────────────────

const lasTerrenasPage: Record<string, unknown> = {
  _type: "landingPage",
  _id: "landingPage-diseno-paginas-web-las-terrenas",
  slug: { _type: "slug", current: "diseno-de-paginas-web-las-terrenas" },
  title: "Diseño de Páginas Web en Las Terrenas / Samaná (City Landing Page)",

  // ── HERO ──────────────────────────────────────────────────────────────────
  hero: {
    headline: loc(
      "Web Design in Las Terrenas & Samaná",
      "Diseño de Páginas Web en Las Terrenas y Samaná",
    ),
    subheadline: loc(
      "Fast, bilingual websites for the peninsula's boutique hotels, excursions, restaurants and villas — built to win direct bookings from international travelers.",
      "Páginas web rápidas y bilingües para los hoteles boutique, excursiones, restaurantes y villas de la península — hechas para ganar reservas directas de viajeros internacionales.",
    ),
    primaryCta: loc("Get a Free Quote", "Solicitar Cotización Gratis"),
    primaryCtaHref: "/contact",
    secondaryCta: loc("View Our Portfolio", "Ver Nuestro Portafolio"),
    secondaryCtaHref: "/portfolio",
    badge: loc(
      "Serving Las Terrenas, Samaná, Las Galeras and El Limón",
      "Atendemos Las Terrenas, Samaná, Las Galeras y El Limón",
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
      "Websites for the Peninsula's Businesses",
      "Páginas Web para los Negocios de la Península",
    ),
    sectionSubtitle: locBlocks(
      "From whale season in the bay to the restaurants of Pueblo de los Pescadores — Samaná's guests choose online, long before they arrive.",
      "Desde la temporada de ballenas en la bahía hasta los restaurantes del Pueblo de los Pescadores — los visitantes de Samaná eligen en línea, mucho antes de llegar.",
    ),
    items: [
      {
        _key: key(),
        icon: "Fish",
        title: loc(
          "Whale Watching & Excursions",
          "Avistamiento de Ballenas y Excursiones",
        ),
        description: locBlocks(
          "Booking-ready sites for whale watching, El Limón waterfall, Los Haitises and Cayo Levantado tours — fast pages, clear seasonal pricing and one-tap WhatsApp, live before the season starts.",
          "Sitios listos para reservas para avistamiento de ballenas, la cascada El Limón, Los Haitises y tours a Cayo Levantado — páginas rápidas, precios de temporada claros y WhatsApp de un toque, en línea antes de que empiece la temporada.",
        ),
        linkSlug: "landing-pages",
      },
      {
        _key: key(),
        icon: "BedDouble",
        title: loc("Boutique Hotels & Villas", "Hoteles Boutique y Villas"),
        description: locBlocks(
          "The peninsula's small hotels pay some of the heaviest OTA commissions in the country. A fast, trustworthy site with direct booking inquiries turns your repeat guests and referrals into commission-free reservations.",
          "Los hoteles pequeños de la península pagan algunas de las comisiones OTA más altas del país. Un sitio rápido y confiable con reservas directas convierte a tus huéspedes recurrentes y referidos en reservaciones sin comisión.",
        ),
        linkSlug: "custom-websites",
      },
      {
        _key: key(),
        icon: "Croissant",
        title: loc(
          "Restaurants & Local Businesses",
          "Restaurantes y Negocios Locales",
        ),
        description: locBlocks(
          "Las Terrenas' restaurants, bakeries, shops and services — many European-owned — get bilingual sites with instant-loading menus, galleries and online ordering where it fits.",
          "Los restaurantes, panaderías, tiendas y servicios de Las Terrenas — muchos de dueños europeos — reciben sitios bilingües con menús que cargan al instante, galerías y pedidos en línea donde aplique.",
        ),
        linkSlug: "ecommerce",
      },
    ],
  },

  // ── WHY CHOOSE US ─────────────────────────────────────────────────────────
  whyUs: {
    sectionTitle: loc(
      "Why Peninsula Businesses Choose Us",
      "Por Qué los Negocios de la Península Nos Eligen",
    ),
    sectionSubtitle: locBlocks(
      "Far from everything, online with everyone — that's the peninsula, and that's exactly what we build for.",
      "Lejos de todo, en línea con todos — así es la península, y exactamente para eso construimos.",
    ),
    items: [
      {
        _key: key(),
        icon: "Globe",
        title: loc(
          "English-Friendly, Start to Finish",
          "Todo en Inglés o Español, de Inicio a Fin",
        ),
        description: locBlocks(
          "Many of the peninsula's business owners came from Europe. The entire process — consultation, design reviews, training, support — runs in English or Spanish, whichever you prefer.",
          "Muchos dueños de negocios de la península llegaron de Europa. Todo el proceso — consulta, revisiones de diseño, capacitación, soporte — se lleva en inglés o español, como prefieras.",
        ),
      },
      {
        _key: key(),
        icon: "CalendarClock",
        title: loc(
          "Ready Before Whale Season",
          "Listos Antes de la Temporada de Ballenas",
        ),
        description: locBlocks(
          "Your busiest ten weeks are decided online months earlier. Tell us your season and we plan the build backwards from it, so you launch with time to rank and take bookings.",
          "Tus diez semanas más ocupadas se deciden en línea meses antes. Dinos tu temporada y planificamos el proyecto hacia atrás desde ella, para que lances con tiempo de posicionar y recibir reservas.",
        ),
      },
      {
        _key: key(),
        icon: "Percent",
        title: loc(
          "Direct Bookings, Not Commissions",
          "Reservas Directas, No Comisiones",
        ),
        description: locBlocks(
          "Every OTA booking costs you 15–25%. Your own fast, credible website turns guests who already found you — by referral, Instagram or a past stay — into commission-free sales.",
          "Cada reserva por OTA te cuesta un 15–25%. Tu propia página web, rápida y creíble, convierte a los huéspedes que ya te encontraron — por referido, Instagram o una estadía anterior — en ventas sin comisión.",
        ),
      },
      {
        _key: key(),
        icon: "Video",
        title: loc(
          "Remote Works Perfectly Here",
          "Lo Remoto Funciona Perfecto Aquí",
        ),
        description: locBlocks(
          "Every serious agency serves the peninsula remotely — we're just built for it: video calls, WhatsApp and a CMS you manage yourself, with the same developer from start to finish.",
          "Toda agencia seria atiende la península de forma remota — nosotros simplemente estamos hechos para eso: videollamadas, WhatsApp y un CMS que manejas tú mismo, con el mismo desarrollador de principio a fin.",
        ),
      },
    ],
  },

  // ── PROCESS STEPS (the real 5-step process from your live landing pages) ──
  process: {
    sectionTitle: loc("How We Work", "Cómo Trabajamos"),
    sectionSubtitle: locBlocks(
      "A clear, structured process from first call to launch — planned around your season.",
      "Un proceso claro y estructurado desde la primera llamada hasta el lanzamiento — planificado alrededor de tu temporada.",
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
          "We learn about your business, your seasons and your guests. You complete our project questionnaire and we define the full scope, sitemap and timeline together.",
          "Conocemos tu negocio, tus temporadas y tus huéspedes. Completas nuestro cuestionario de proyecto y juntos definimos el alcance, mapa del sitio y cronograma.",
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
          "We build your site with Next.js and connect it to Sanity CMS so you can update tours, rooms, menus or seasonal pricing yourself. SEO, performance and responsive design are built in.",
          "Construimos tu sitio con Next.js y lo conectamos a Sanity CMS para que actualices tours, habitaciones, menús o precios de temporada tú mismo. SEO, rendimiento y diseño responsivo vienen integrados.",
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
      "Websites we've built for tourism and hospitality businesses.",
      "Páginas web que hemos creado para negocios de turismo y hospitalidad.",
    ),
    // Attach real `project` references in Studio (max 3). Tourism/hospitality
    // work first — Grand Bay of the Sea and Punta Cana Tour Store.
    projects: [],
    ctaText: loc("View Full Portfolio", "Ver Portafolio Completo"),
    ctaHref: "/portfolio",
  },

  // ── TESTIMONIALS (same three clients; tourism businesses listed first) ────
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
          "DR Web Studio transformed our online presence completely. Our sales increased by 150% in just 3 months!",
          "DR Web Studio transformó por completo nuestra presencia online. ¡Nuestras ventas aumentaron un 150% en tan solo 3 meses!",
        ),
        author: "Grecia Mejía",
        company: "Sertuin Events",
        rating: 5,
      },
    ],
  },

  // ── FAQ (feeds auto-generated FAQPage JSON-LD — fill BOTH locales) ────────
  faq: {
    sectionTitle: loc("Frequently Asked Questions", "Preguntas Frecuentes"),
    sectionSubtitle: locBlocks(
      "What peninsula business owners ask us most.",
      "Lo que más nos preguntan los dueños de negocios en la península.",
    ),
    items: [
      {
        _key: key(),
        question: loc(
          "How much does a website cost in Las Terrenas or Samaná?",
          "¿Cuánto cuesta una página web en Las Terrenas o Samaná?",
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
          "Most of my clients are European — are English and Spanish enough?",
          "La mayoría de mis clientes son europeos — ¿bastan el inglés y el español?",
        ),
        answer: locBlocks(
          "For almost every peninsula business, yes: international travelers overwhelmingly search and book in English when abroad, and Spanish covers the local and Dominican market. Your site ships fully bilingual in both. If your business truly needs a third language, tell us during discovery and we'll assess what it takes honestly — we don't sell what we can't deliver well.",
          "Para casi todos los negocios de la península, sí: los viajeros internacionales buscan y reservan mayormente en inglés cuando están fuera de su país, y el español cubre el mercado local y dominicano. Tu sitio se entrega completamente bilingüe en ambos. Si tu negocio realmente necesita un tercer idioma, dínoslo en la fase de descubrimiento y evaluaremos honestamente qué implica — no vendemos lo que no podemos entregar bien.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "I run whale watching or excursions — when should I start to be ready for the season?",
          "Tengo un negocio de ballenas o excursiones — ¿cuándo debo empezar para llegar a la temporada?",
        ),
        answer: locBlocks(
          "Whale season opens in mid-January, and guests book weeks or months ahead. Landing pages take 2–3 weeks and full business sites 6–8 weeks — so ideally start by October or November, giving your site time to launch, get indexed and start ranking before the first boats go out.",
          "La temporada de ballenas abre a mediados de enero, y los visitantes reservan con semanas o meses de anticipación. Las landing pages toman 2–3 semanas y los sitios completos 6–8 semanas — así que lo ideal es empezar en octubre o noviembre, dándole tiempo a tu sitio de lanzarse, indexarse y empezar a posicionar antes de que salgan los primeros botes.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Can my boutique hotel take direct bookings instead of paying OTA commissions?",
          "¿Mi hotel boutique puede recibir reservas directas en lugar de pagar comisiones OTA?",
        ),
        answer: locBlocks(
          "Yes. We build direct inquiry and booking flows through WhatsApp and forms as standard, and can integrate a booking engine as your operation needs. Guests who found you through referrals or a past stay shouldn't cost you 15–25% per night.",
          "Sí. Construimos flujos de consulta y reserva directa por WhatsApp y formularios de manera estándar, y podemos integrar un motor de reservas según lo necesite tu operación. Los huéspedes que te encontraron por referidos o una estadía anterior no deberían costarte un 15–25% por noche.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Do you work with businesses in Samaná town, Las Galeras and El Limón?",
          "¿Trabajan con negocios en Samaná, Las Galeras y El Limón?",
        ),
        answer: locBlocks(
          "Yes — the entire peninsula. The process runs remotely by video call and WhatsApp on your schedule, and you always work directly with the developer building your site.",
          "Sí — toda la península. El proceso se realiza de forma remota por videollamada y WhatsApp según tu horario, y siempre trabajas directamente con el desarrollador que construye tu sitio.",
        ),
      },
    ],
  },

  // ── STRUCTURED DATA (city-scoped Service — replaces the auto-generated) ───
  structuredData: { en: ltCityServiceEn, es: ltCityServiceEs },
}

// ─────────────────────────────────────────────────────────────────────────────
// seo document (metadata)
// ─────────────────────────────────────────────────────────────────────────────

const lasTerrenasSeo = {
  _type: "seo",
  _id: "seo-diseno-de-paginas-web-las-terrenas",
  pageName: "diseno-de-paginas-web-las-terrenas",
  meta: {
    en: {
      title: "Web Design in Las Terrenas & Samaná | DR Web Studio",
      description:
        "Web design for boutique hotels, excursions, restaurants and villas in Las Terrenas and the Samaná peninsula. Bilingual, fast, English-friendly. Free quotes.",
      keywords: [
        "web design las terrenas",
        "web design samana dominican republic",
        "website design las terrenas",
      ],
    },
    es: {
      title: "Diseño de Páginas Web Las Terrenas y Samaná | DR Web Studio",
      description:
        "Diseño de páginas web para hoteles boutique, excursiones, restaurantes y villas en Las Terrenas y Samaná. Sitios bilingües y rápidos. Cotización gratis.",
      keywords: [
        "diseño de páginas web en las terrenas",
        "diseño web las terrenas",
        "diseño web samaná",
        "páginas web samaná",
        "páginas web las terrenas",
      ],
    },
  },
  openGraph: {
    en: {
      title: "Web Design in Las Terrenas & Samaná — Built for the Peninsula",
      description:
        "Websites for whale watching tours, boutique hotels, restaurants and villas across the Samaná peninsula. Direct bookings, not commissions. Free quotes.",
    },
    es: {
      title:
        "Diseño de Páginas Web en Las Terrenas y Samaná — Para la Península",
      description:
        "Páginas web para tours de ballenas, hoteles boutique, restaurantes y villas en toda la península de Samaná. Reservas directas, no comisiones. Cotización gratis.",
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
    lasTerrenasPage as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded landing page: diseno-de-paginas-web-las-terrenas")

  await client.createOrReplace(
    lasTerrenasSeo as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded SEO doc: diseno-de-paginas-web-las-terrenas")

  console.log("")
  console.log("Next steps: see the header comment — don't miss linking your")
  console.log("existing Las Terrenas blog post to this page.")
}

seed().catch(console.error)
