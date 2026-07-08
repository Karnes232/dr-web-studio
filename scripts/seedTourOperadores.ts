/**
 * Seed script — INDUSTRY PAGE: Tour Operadores y Excursiones ONLY
 *
 * Creates the bilingual (en/es) landing page document AND its seo document for:
 *   slug "paginas-web-para-tour-operadores"
 *   → target: "páginas web para tour operadores" / "página web para tours" /
 *             "diseño web excursiones" / "tour operator web design dominican
 *             republic"
 *
 * Completes the commission trilogy (restaurantes → delivery apps, hoteles →
 * OTAs, tours → Viator/GetYourGuide). Native proof: Punta Cana Tour Store —
 * Alex Castro's testimonial leads and his project goes first in the portfolio.
 *
 * INDUSTRY PAGE CONVENTIONS (same as seedRestaurantes.ts / seedHoteles.ts):
 *   • Flat slug: paginas-web-para-{industria}
 *   • EN route slug (translated): web-design-for-tour-operators — the EN
 *     structuredData URLs below assume this; adjust if you pick another.
 *   • structuredData: Service node with `audience` (tour operators) +
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
 *        title: "Páginas Web para Tour Operadores (Industry Landing)",
 *        value: "paginas-web-para-tour-operadores",
 *      },
 *
 * 2. ROUTES — ES route at:
 *      src/app/(root)/[lang]/paginas-web-para-tour-operadores/page.tsx
 *    and the EN route at web-design-for-tour-operators, both fetching
 *    getLandingPage("paginas-web-para-tour-operadores", lang).
 *
 * 3. INTERNAL LINKS — this is the most connected page in the grid:
 *      • From the national hub: one contextual link, anchor
 *        "páginas web para tour operadores".
 *      • From this page: one link to the hub and one to /es.
 *      • ALL FOUR tourism city pages have a tours/excursions services card —
 *        Punta Cana ("Tours, Excursiones y Transfers"), La Romana ("Páginas
 *        Web para Tours y Excursiones"), Puerto Plata ("Excursiones para
 *        Cruceristas y Tours") and Las Terrenas ("Avistamiento de Ballenas y
 *        Excursiones"). Each of those cards' copy is the natural home for a
 *        link to this page; this page links back to Punta Cana and one other.
 *
 * 4. SITEMAP — confirm the slug is emitted for en + es with hreflang
 *    alternates.
 *
 * 5. STUDIO — attach portfolio projects: Punta Cana Tour Store FIRST (this is
 *    its page), and upload a 1200x630 OG image (an excursion action shot).
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seedTourOperadores.ts
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
// structuredData — INDUSTRY-scoped Service node (audience: tour operators,
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

const tourServiceEs = industryServiceNode({
  url: `${BASE}/es/paginas-web-para-tour-operadores`,
  name: "Páginas Web para Tour Operadores",
  serviceType: "Diseño de páginas web para tour operadores",
  description:
    "Diseño de páginas web para tour operadores y excursiones en República Dominicana: reservas directas por WhatsApp y depósitos en línea, sin comisiones de plataformas.",
  audienceType: "Tour operadores, excursiones y actividades turísticas",
})

const tourServiceEn = industryServiceNode({
  url: `${BASE}/en/web-design-for-tour-operators`,
  name: "Web Design for Tour Operators",
  serviceType: "Tour operator website design",
  description:
    "Tour operator website design in the Dominican Republic: direct WhatsApp bookings and online deposits, without 20–30% marketplace commissions.",
  audienceType: "Tour operators, excursions and activity providers",
})

// ─────────────────────────────────────────────────────────────────────────────
// Tour Operadores — industry landing page document
// Angle: the sharpest commission math of the trilogy — Viator, GetYourGuide
// and hotel reps take 20–30% per seat, on tours where margins are already
// thin. The operator's own site converts the channels they already own (QR
// codes, Instagram, guest referrals, repeat cruise contacts) into direct
// sales. Everything travelers see must be in English, load on roaming data,
// and close via WhatsApp. Native proof: Punta Cana Tour Store.
// ─────────────────────────────────────────────────────────────────────────────

const tourOperadoresPage: Record<string, unknown> = {
  _type: "landingPage",
  _id: "landingPage-paginas-web-para-tour-operadores",
  title: "Páginas Web para Tour Operadores (Industry Landing Page)",
  slug: { _type: "slug", current: "paginas-web-para-tour-operadores" },

  // ── HERO ──────────────────────────────────────────────────────────────────
  hero: {
    headline: loc(
      "Web Design for Tour Operators",
      "Páginas Web para Tour Operadores",
    ),
    subheadline: loc(
      "Fast, English-first websites that turn travelers planning their trip into direct bookings — instead of 20–30% marketplace commissions on every seat.",
      "Páginas web rápidas, con inglés de primera, que convierten a viajeros planificando su viaje en reservas directas — en lugar de comisiones del 20–30% por cada asiento.",
    ),
    primaryCta: loc("Get a Free Quote", "Solicitar Cotización Gratis"),
    primaryCtaHref: "/contact",
    secondaryCta: loc("View Our Portfolio", "Ver Nuestro Portafolio"),
    secondaryCtaHref: "/portfolio",
    badge: loc(
      "For tour operators, excursions, catamarans, buggies and activities across the Dominican Republic",
      "Para tour operadores, excursiones, catamaranes, buggies y actividades en toda República Dominicana",
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
      "What a Tour Operator's Website Must Do",
      "Lo que la Página Web de un Tour Operador Debe Hacer",
    ),
    sectionSubtitle: locBlocks(
      "On a marketplace, your excursion is one card among fifty identical ones. On your own site, it's the only one — and the commission is zero.",
      "En un marketplace, tu excursión es una tarjeta entre cincuenta idénticas. En tu propio sitio, es la única — y la comisión es cero.",
    ),
    items: [
      {
        _key: key(),
        icon: "Compass",
        title: loc(
          "Tour Pages that Sell",
          "Páginas de Tours que Venden",
        ),
        description: locBlocks(
          "Each tour gets its own page: itinerary, photos, what's included, clear per-person pricing and departure times — structured so travelers get every answer without messaging you first.",
          "Cada tour tiene su propia página: itinerario, fotos, qué incluye, precios por persona claros y horarios de salida — estructurada para que el viajero encuentre cada respuesta sin tener que escribirte primero.",
        ),
        linkSlug: "landing-pages",
      },
      {
        _key: key(),
        icon: "CalendarCheck",
        title: loc(
          "Direct Bookings & Deposits",
          "Reservas Directas y Depósitos",
        ),
        description: locBlocks(
          "One-tap WhatsApp booking plus online deposits to lock in seats — so referrals, QR-code scans and Instagram followers become confirmed sales that don't cost you 20–30% in commissions.",
          "Reserva por WhatsApp con un toque más depósitos en línea para asegurar asientos — para que los referidos, los escaneos de QR y los seguidores de Instagram se conviertan en ventas confirmadas que no te cuestan un 20–30% en comisiones.",
        ),
        linkSlug: "ecommerce",
      },
      {
        _key: key(),
        icon: "Languages",
        title: loc(
          "English-First, Where Your Clients Search",
          "Inglés Primero, Donde Buscan tus Clientes",
        ),
        description: locBlocks(
          "Your customers search 'Saona island tour' or 'buggy adventure' from abroad, in English. Fully bilingual sites with international SEO put your tours in those results — before and during their trip.",
          "Tus clientes buscan 'Saona island tour' o 'buggy adventure' desde el exterior, en inglés. Sitios completamente bilingües con SEO internacional ponen tus tours en esos resultados — antes y durante su viaje.",
        ),
        linkSlug: "custom-websites",
      },
    ],
  },

  // ── WHY CHOOSE US ─────────────────────────────────────────────────────────
  whyUs: {
    sectionTitle: loc(
      "Why Tour Operators Choose Us",
      "Por Qué los Tour Operadores Nos Eligen",
    ),
    sectionSubtitle: locBlocks(
      "We live in the country's biggest excursion market — and we've already built for it.",
      "Vivimos en el mercado de excursiones más grande del país — y ya hemos construido para él.",
    ),
    items: [
      {
        _key: key(),
        icon: "Percent",
        title: loc(
          "Stop Paying 20–30% per Seat",
          "Deja de Pagar 20–30% por Asiento",
        ),
        description: locBlocks(
          "Marketplaces and hotel reps earn their cut on new customers — but referrals, repeat guests and people who scanned your QR shouldn't cost the same. Your own site makes those bookings commission-free.",
          "Los marketplaces y los representantes de hotel se ganan su parte con clientes nuevos — pero los referidos, los repetidores y quien escaneó tu QR no deberían costar lo mismo. Tu propio sitio hace esas reservas sin comisión.",
        ),
      },
      {
        _key: key(),
        icon: "BadgeCheck",
        title: loc(
          "We Built Punta Cana Tour Store's Site",
          "Construimos la de Punta Cana Tour Store",
        ),
        description: locBlocks(
          "This isn't theory — a tour business in the country's most competitive excursion market runs on a site we built, and delivered beyond their expectations, in their own words.",
          "Esto no es teoría — un negocio de tours en el mercado de excursiones más competitivo del país funciona con un sitio que construimos, y superó sus expectativas, en sus propias palabras.",
        ),
      },
      {
        _key: key(),
        icon: "Zap",
        title: loc(
          "Fast for Tourists on Roaming",
          "Rápida para Turistas con Roaming",
        ),
        description: locBlocks(
          "Your buyers browse on hotel wifi and roaming data. Our Next.js sites load in under two seconds with photo galleries included — because a tour page that stalls is a seat sold by someone else.",
          "Tus compradores navegan con wifi de hotel y datos de roaming. Nuestros sitios en Next.js cargan en menos de dos segundos con galerías incluidas — porque una página de tour que se traba es un asiento que vende otro.",
        ),
      },
      {
        _key: key(),
        icon: "Star",
        title: loc(
          "Your Reviews, Front and Center",
          "Tus Reseñas, al Frente y al Centro",
        ),
        description: locBlocks(
          "For excursions, reviews close the sale. We showcase your Google and TripAdvisor ratings on the site itself, so the social proof that lives on other platforms works on yours.",
          "En las excursiones, las reseñas cierran la venta. Mostramos tus calificaciones de Google y TripAdvisor en el sitio mismo, para que la prueba social que vive en otras plataformas trabaje en la tuya.",
        ),
      },
    ],
  },

  // ── PROCESS STEPS (the real 5-step process from your live landing pages) ──
  process: {
    sectionTitle: loc("How We Work", "Cómo Trabajamos"),
    sectionSubtitle: locBlocks(
      "A clear, structured process from first call to launch — planned around your high season.",
      "Un proceso claro y estructurado desde la primera llamada hasta el lanzamiento — planificado alrededor de tu temporada alta.",
    ),
    steps: [
      {
        _key: key(),
        number: 1,
        icon: "MessageCircle",
        stepTitle: loc("Discovery & Planning", "Descubrimiento y Planificación"),
        description: locBlocks(
          "We learn about your tours, your seasons and how your bookings arrive today. You complete our project questionnaire and we define the full scope, sitemap and timeline together.",
          "Conocemos tus tours, tus temporadas y cómo llegan tus reservas hoy. Completas nuestro cuestionario de proyecto y juntos definimos el alcance, mapa del sitio y cronograma.",
        ),
        duration: loc("3–5 days", "3–5 días"),
      },
      {
        _key: key(),
        number: 2,
        icon: "Palette",
        stepTitle: loc("Design & Prototyping", "Diseño y Prototipado"),
        description: locBlocks(
          "We create a custom visual design built around your best excursion photos. You review the design and we refine it across two revision rounds until it's perfect.",
          "Creamos un diseño visual personalizado construido alrededor de tus mejores fotos de excursión. Revisas el diseño y lo refinamos en dos rondas de revisión hasta que quede perfecto.",
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
          "We build your site with Next.js and connect it to Sanity CMS so you can add tours, change prices or update departure times yourself. SEO, performance and responsive design are built in.",
          "Construimos tu sitio con Next.js y lo conectamos a Sanity CMS para que agregues tours, cambies precios o actualices horarios de salida tú mismo. SEO, rendimiento y diseño responsivo vienen integrados.",
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
      "Websites we've built for tourism businesses — including one of Punta Cana's own tour operators.",
      "Páginas web que hemos creado para negocios turísticos — incluyendo un tour operador de Punta Cana.",
    ),
    // Attach real `project` references in Studio (max 3). Punta Cana Tour
    // Store FIRST — this is its page.
    projects: [],
    ctaText: loc("View Full Portfolio", "Ver Portafolio Completo"),
    ctaHref: "/portfolio",
  },

  // ── TESTIMONIALS (same three clients; the tour operator leads) ────────────
  testimonials: {
    sectionTitle: loc("What Our Clients Say", "Lo que Dicen Nuestros Clientes"),
    items: [
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
      "What tour operators ask us most.",
      "Lo que más nos preguntan los tour operadores.",
    ),
    items: [
      {
        _key: key(),
        question: loc(
          "How much does a tour operator website cost?",
          "¿Cuánto cuesta una página web para mi negocio de tours?",
        ),
        // Figures verified against your live landing pages (July 2026).
        answer: locBlocks(
          "Pricing starts at $400 USD for a landing page with your top tours and WhatsApp booking, and $950 for a complete multi-tour website — 50% upfront, 50% on delivery, with no hidden fees and no monthly platform charges.",
          "Los precios comienzan en $400 USD para una landing page con tus tours principales y reserva por WhatsApp, y $950 para un sitio web completo de varios tours — 50% al inicio y 50% al entregar, sin costos ocultos ni cuotas mensuales de plataforma.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Can I take direct bookings and payments?",
          "¿Puedo recibir reservas y pagos directos?",
        ),
        answer: locBlocks(
          "Yes. WhatsApp booking flows are standard on every site, and we can add online deposits to confirm seats instantly — or integrate the booking system you already use. Direct channels shouldn't cost you commission.",
          "Sí. Los flujos de reserva por WhatsApp son estándar en cada sitio, y podemos agregar depósitos en línea para confirmar asientos al instante — o integrar el sistema de reservas que ya uses. Los canales directos no deberían costarte comisión.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Should I leave Viator or GetYourGuide?",
          "¿Debo salirme de Viator o GetYourGuide?",
        ),
        answer: locBlocks(
          "No — marketplaces bring you travelers who've never heard of you, and that visibility is worth their commission. Your website's job is the other half: converting referrals, QR scans, Instagram followers and repeat customers into direct, commission-free bookings — so your channel mix improves without losing reach.",
          "No — los marketplaces te traen viajeros que nunca han oído de ti, y esa visibilidad vale su comisión. El trabajo de tu página web es la otra mitad: convertir referidos, escaneos de QR, seguidores de Instagram y clientes repetidores en reservas directas sin comisión — mejorando tu mezcla de canales sin perder alcance.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Will my tours be in English?",
          "¿Mis tours estarán en inglés?",
        ),
        answer: locBlocks(
          "Every site we build is fully bilingual — Spanish and English — at no extra platform cost. For tour operators, the English version is the priority: it's structured with international SEO so travelers find your excursions while planning from abroad.",
          "Cada sitio que construimos es completamente bilingüe — español e inglés — sin costo adicional de plataforma. Para tour operadores, la versión en inglés es la prioridad: se estructura con SEO internacional para que los viajeros encuentren tus excursiones planificando desde el exterior.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "How long until my website is live?",
          "¿En cuánto tiempo estará lista mi página web?",
        ),
        answer: locBlocks(
          "A landing page with your top tours takes 2–3 weeks; a complete multi-tour website takes 6–8 weeks. If high season is coming, tell us your target date and we'll plan the timeline backwards from it.",
          "Una landing page con tus tours principales toma 2–3 semanas; un sitio completo de varios tours toma 6–8 semanas. Si se acerca la temporada alta, dinos tu fecha objetivo y planificamos el cronograma hacia atrás desde ella.",
        ),
      },
    ],
  },

  // ── STRUCTURED DATA (industry-scoped Service — replaces the auto one) ─────
  structuredData: { en: tourServiceEn, es: tourServiceEs },
}

// ─────────────────────────────────────────────────────────────────────────────
// seo document (metadata)
// ─────────────────────────────────────────────────────────────────────────────

const tourOperadoresSeo = {
  _type: "seo",
  _id: "seo-paginas-web-para-tour-operadores",
  pageName: "paginas-web-para-tour-operadores",
  meta: {
    en: {
      title: "Tour Operator Web Design Dominican Republic | DR Web Studio",
      description:
        "Tour operator website design in the Dominican Republic: direct WhatsApp bookings and deposits, no 20–30% marketplace commissions. Free quotes.",
      keywords: [
        "tour operator website design dominican republic",
        "excursion website design punta cana",
        "tour booking website",
      ],
    },
    es: {
      title: "Diseño de Páginas Web para Tour Operadores | DR Web Studio",
      description:
        "Páginas web para tour operadores y excursiones en República Dominicana: reservas directas por WhatsApp, sin comisiones de plataformas. Cotización gratis.",
      keywords: [
        "páginas web para tour operadores",
        "página web para tours",
        "diseño web excursiones",
        "página web para mi negocio de tours",
        "diseño de páginas web para tour operadores",
      ],
    },
  },
  openGraph: {
    en: {
      title: "Tour Operator Websites — Sell Direct, Skip the Commissions",
      description:
        "Fast, English-first websites for excursions and tours in the Dominican Republic. WhatsApp bookings, online deposits, your reviews front and center.",
    },
    es: {
      title:
        "Páginas Web para Tours y Excursiones — Vende Directo, Sin Comisiones",
      description:
        "Páginas web rápidas con inglés de primera para excursiones y tours en República Dominicana. Reservas por WhatsApp, depósitos en línea y tus reseñas al frente.",
    },
    // image: upload in Studio (1200x630 — an excursion action shot)
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
    tourOperadoresPage as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded landing page: paginas-web-para-tour-operadores")

  await client.createOrReplace(
    tourOperadoresSeo as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded SEO doc: paginas-web-para-tour-operadores")

  console.log("")
  console.log("Next steps: see the header comment — all four tourism city")
  console.log("pages have a tours card that should link to this page.")
}

seed().catch(console.error)
