/**
 * Seed script — INDUSTRY PAGE: Bodas y Eventos ONLY
 *
 * Creates the bilingual (en/es) landing page document AND its seo document for:
 *   slug "paginas-web-para-bodas-y-eventos"
 *   → target: "páginas web para bodas y eventos" / "página web wedding
 *             planner" / "página web organizador de eventos" / "wedding
 *             planner website design"
 *
 * Native proof: Sertuin Events — Grecia Mejía's testimonial (and the 150%
 * sales stat) belong to this industry. Her quote leads, her project goes
 * first in the portfolio.
 *
 * INDUSTRY PAGE CONVENTIONS (same as the other industry seeds):
 *   • Flat slug: paginas-web-para-{industria}
 *   • EN route slug (translated): web-design-for-weddings-and-events — the
 *     EN structuredData URLs below assume this; adjust if you pick another.
 *   • structuredData: Service node with `audience` (wedding/event pros) +
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
 *        title: "Páginas Web para Bodas y Eventos (Industry Landing)",
 *        value: "paginas-web-para-bodas-y-eventos",
 *      },
 *
 * 2. ROUTES — ES route at:
 *      src/app/(root)/[lang]/paginas-web-para-bodas-y-eventos/page.tsx
 *    and the EN route at web-design-for-weddings-and-events, both fetching
 *    getLandingPage("paginas-web-para-bodas-y-eventos", lang).
 *
 * 3. INTERNAL LINKS (city ↔ industry grid) —
 *      • From the national hub: one contextual link, anchor
 *        "páginas web para bodas y eventos".
 *      • From this page: one link to the hub and one to /es.
 *      • City cross-links: Punta Cana (the country's destination-wedding
 *        capital) and La Romana (Casa de Campo weddings) — one anchor each
 *        way. This page's destination-wedding copy mentions both zones.
 *
 * 4. SITEMAP — confirm the slug is emitted for en + es with hreflang
 *    alternates.
 *
 * 5. STUDIO — attach portfolio projects: Sertuin Events FIRST (this is its
 *    page), and upload a 1200x630 OG image (a real event/wedding shot).
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seedBodasEventos.ts
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
// structuredData — INDUSTRY-scoped Service node (audience: wedding & event
// professionals, areaServed: DO). Same replace-the-auto-Service mechanics.
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

const bodasServiceEs = industryServiceNode({
  url: `${BASE}/es/paginas-web-para-bodas-y-eventos`,
  name: "Páginas Web para Bodas y Eventos",
  serviceType: "Diseño de páginas web para bodas y eventos",
  description:
    "Diseño de páginas web para wedding planners y organizadores de eventos en República Dominicana: portafolios que enamoran, SEO para bodas destino y consultas calificadas.",
  audienceType:
    "Wedding planners, organizadores de eventos, decoradores y venues",
})

const bodasServiceEn = industryServiceNode({
  url: `${BASE}/en/web-design-for-weddings-and-events`,
  name: "Web Design for Weddings & Events",
  serviceType: "Wedding and event website design",
  description:
    "Website design for wedding planners and event producers in the Dominican Republic: stunning portfolios, destination-wedding SEO and qualified inquiries.",
  audienceType: "Wedding planners, event producers, decorators and venues",
})

// ─────────────────────────────────────────────────────────────────────────────
// Bodas y Eventos — industry landing page document
// Angle: the website IS the portfolio. Couples — especially destination
// couples planning from abroad, in English, 12+ months out — discover
// planners on Instagram but decide on the website: real weddings, packages,
// testimonials, credibility. Second hook: qualified inquiries (forms that
// capture date, venue and guest count so consultations arrive ready).
// Native proof at full strength: Sertuin Events and the 150% stat.
// ─────────────────────────────────────────────────────────────────────────────

const bodasEventosPage: Record<string, unknown> = {
  _type: "landingPage",
  _id: "landingPage-paginas-web-para-bodas-y-eventos",
  title: "Páginas Web para Bodas y Eventos (Industry Landing Page)",
  slug: { _type: "slug", current: "paginas-web-para-bodas-y-eventos" },

  // ── HERO ──────────────────────────────────────────────────────────────────
  hero: {
    headline: loc(
      "Web Design for Weddings & Events",
      "Páginas Web para Bodas y Eventos",
    ),
    subheadline: loc(
      "Portfolio-first websites for wedding planners and event producers — built to turn couples who found you on Instagram into booked dates and signed contracts.",
      "Páginas web centradas en portafolio para wedding planners y organizadores de eventos — hechas para convertir a las parejas que te encontraron en Instagram en fechas apartadas y contratos firmados.",
    ),
    primaryCta: loc("Get a Free Quote", "Solicitar Cotización Gratis"),
    primaryCtaHref: "/contact",
    secondaryCta: loc("View Our Portfolio", "Ver Nuestro Portafolio"),
    secondaryCtaHref: "/portfolio",
    badge: loc(
      "For wedding planners, event producers, decorators and venues across the Dominican Republic",
      "Para wedding planners, organizadores de eventos, decoradores y venues en toda República Dominicana",
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
      "What a Wedding & Event Website Must Do",
      "Lo que la Página Web de Bodas y Eventos Debe Hacer",
    ),
    sectionSubtitle: locBlocks(
      "Instagram gets you discovered. Your website gets you hired — it's where couples decide you're the one they trust with the most important day of their lives.",
      "Instagram hace que te descubran. Tu página web hace que te contraten — es donde las parejas deciden que eres a quien le confían el día más importante de sus vidas.",
    ),
    items: [
      {
        _key: key(),
        icon: "Heart",
        title: loc("A Portfolio that Wins Hearts", "Un Portafolio que Enamora"),
        description: locBlocks(
          "Full-bleed galleries of your real weddings and events — organized by style and venue, loading instantly even packed with photos. Your best work, presented the way it deserves.",
          "Galerías a pantalla completa de tus bodas y eventos reales — organizadas por estilo y venue, cargando al instante aun llenas de fotos. Tu mejor trabajo, presentado como se merece.",
        ),
        linkSlug: "custom-websites",
      },
      {
        _key: key(),
        icon: "Target",
        title: loc(
          "Landing Pages for Destination Weddings",
          "Landing Pages para Bodas Destino",
        ),
        description: locBlocks(
          "Couples in New York and Toronto plan their Punta Cana or Casa de Campo wedding a year ahead — in English. Focused, English-first pages with packages and real weddings put you in their search.",
          "Parejas en Nueva York y Toronto planifican su boda en Punta Cana o Casa de Campo con un año de anticipación — en inglés. Páginas enfocadas, con inglés de primera, con paquetes y bodas reales te ponen en su búsqueda.",
        ),
        linkSlug: "landing-pages",
      },
      {
        _key: key(),
        icon: "CalendarCheck",
        title: loc(
          "Reserve Dates with Online Deposits",
          "Aparta Fechas con Depósitos en Línea",
        ),
        description: locBlocks(
          "When a couple is ready, don't make them wait for a bank transfer. Secure online deposits lock the date on the spot — and a locked date is a client who stops shopping around.",
          "Cuando una pareja está lista, no la hagas esperar una transferencia bancaria. Los depósitos seguros en línea apartan la fecha al momento — y una fecha apartada es un cliente que deja de cotizar con otros.",
        ),
        linkSlug: "ecommerce",
      },
    ],
  },

  // ── WHY CHOOSE US ─────────────────────────────────────────────────────────
  whyUs: {
    sectionTitle: loc(
      "Why Event Professionals Choose Us",
      "Por Qué los Profesionales de Eventos Nos Eligen",
    ),
    sectionSubtitle: locBlocks(
      "We're based in the country's destination-wedding capital — and we've already built for this industry.",
      "Tenemos base en la capital de las bodas destino del país — y ya hemos construido para esta industria.",
    ),
    items: [
      {
        _key: key(),
        icon: "BadgeCheck",
        title: loc(
          "We Built Sertuin Events' Site",
          "Construimos la de Sertuin Events",
        ),
        description: locBlocks(
          "An events company runs on a site we built — and grew its sales 150% in three months after launch, in their own words. This industry isn't a guess for us; it's a result.",
          "Una empresa de eventos funciona con un sitio que construimos — y creció sus ventas un 150% en tres meses tras el lanzamiento, en sus propias palabras. Esta industria no es una suposición para nosotros; es un resultado.",
        ),
      },
      {
        _key: key(),
        icon: "Globe",
        title: loc(
          "English for Destination Couples",
          "Inglés para Parejas del Exterior",
        ),
        description: locBlocks(
          "Destination couples search 'wedding planner Punta Cana' from abroad, months before contacting anyone. Every site ships fully bilingual with international SEO — so you're in that search.",
          "Las parejas del exterior buscan 'wedding planner Punta Cana' desde su país, meses antes de contactar a nadie. Cada sitio se entrega completamente bilingüe con SEO internacional — para que estés en esa búsqueda.",
        ),
      },
      {
        _key: key(),
        icon: "Images",
        title: loc(
          "Galleries that Never Keep Them Waiting",
          "Galerías que Nunca los Hacen Esperar",
        ),
        description: locBlocks(
          "Wedding sites drown in photos and video — and a gallery that stutters undercuts the elegance you're selling. Ours load in under two seconds, full resolution, on any device.",
          "Los sitios de bodas se ahogan en fotos y video — y una galería que se traba contradice la elegancia que vendes. Las nuestras cargan en menos de dos segundos, en alta resolución, en cualquier dispositivo.",
        ),
      },
      {
        _key: key(),
        icon: "MessageSquare",
        title: loc(
          "Qualified Inquiries, Not Just Messages",
          "Consultas Calificadas, No Solo Mensajes",
        ),
        description: locBlocks(
          "Inquiry forms capture the date, venue, guest count and budget range — so your first call starts with the essentials answered. Plus one-tap WhatsApp for the couples who'd rather just write.",
          "Los formularios de consulta capturan la fecha, el venue, la cantidad de invitados y el rango de presupuesto — para que tu primera llamada empiece con lo esencial respondido. Más WhatsApp de un toque para las parejas que prefieren simplemente escribir.",
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
          "We learn about your style, your services and the clients you want more of. You complete our project questionnaire and we define the full scope, sitemap and timeline together.",
          "Conocemos tu estilo, tus servicios y los clientes que quieres atraer más. Completas nuestro cuestionario de proyecto y juntos definimos el alcance, mapa del sitio y cronograma.",
        ),
        duration: loc("3–5 days", "3–5 días"),
      },
      {
        _key: key(),
        number: 2,
        icon: "Palette",
        stepTitle: loc("Design & Prototyping", "Diseño y Prototipado"),
        description: locBlocks(
          "We create a custom visual design as elegant as the events you produce. You review the design and we refine it across two revision rounds until it's perfect.",
          "Creamos un diseño visual personalizado tan elegante como los eventos que produces. Revisas el diseño y lo refinamos en dos rondas de revisión hasta que quede perfecto.",
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
          "We build your site with Next.js and connect it to Sanity CMS so you can add real weddings, update packages and refresh galleries yourself. SEO, performance and responsive design are built in.",
          "Construimos tu sitio con Next.js y lo conectamos a Sanity CMS para que agregues bodas reales, actualices paquetes y renueves galerías tú mismo. SEO, rendimiento y diseño responsivo vienen integrados.",
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
      "Websites we've built for event and tourism businesses.",
      "Páginas web que hemos creado para negocios de eventos y turismo.",
    ),
    // Attach real `project` references in Studio (max 3). Sertuin Events
    // FIRST — this is its page.
    projects: [],
    ctaText: loc("View Full Portfolio", "Ver Portafolio Completo"),
    ctaHref: "/portfolio",
  },

  // ── TESTIMONIALS (same three clients; the events company leads) ───────────
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
      "What wedding and event professionals ask us most.",
      "Lo que más nos preguntan los profesionales de bodas y eventos.",
    ),
    items: [
      {
        _key: key(),
        question: loc(
          "How much does a wedding planner website cost?",
          "¿Cuánto cuesta una página web para mi negocio de eventos?",
        ),
        // Figures verified against your live landing pages (July 2026).
        answer: locBlocks(
          "A complete portfolio website starts at $950 USD; a focused landing page — for example, a destination-wedding page for ad campaigns — starts at $400 — 50% upfront, 50% on delivery, with no hidden fees and no monthly platform charges.",
          "Un sitio web completo de portafolio comienza en $950 USD; una landing page enfocada — por ejemplo, una página de bodas destino para campañas — comienza en $400 — 50% al inicio y 50% al entregar, sin costos ocultos ni cuotas mensuales de plataforma.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Isn't my Instagram enough?",
          "¿Mi Instagram no es suficiente?",
        ),
        answer: locBlocks(
          "Instagram is where couples discover you — and it's excellent at that. But couples searching Google for 'wedding planner Punta Cana' never see your Instagram, and a feed can't present packages, testimonials and full galleries the way a site can. They're not competitors: Instagram discovers, your website closes.",
          "Instagram es donde las parejas te descubren — y es excelente para eso. Pero las parejas que buscan 'wedding planner Punta Cana' en Google nunca ven tu Instagram, y un feed no puede presentar paquetes, testimonios y galerías completas como lo hace un sitio. No compiten entre sí: Instagram descubre, tu página web cierra.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Does it work for destination weddings?",
          "¿Sirve para bodas destino?",
        ),
        answer: locBlocks(
          "That's where it works hardest. Destination couples plan from the US, Canada and Europe up to a year ahead, researching in English. Your site ships fully bilingual with international SEO, so you appear in those searches with the packages and real weddings that win the inquiry.",
          "Ahí es donde más trabaja. Las parejas del exterior planifican desde EE. UU., Canadá y Europa hasta con un año de anticipación, investigando en inglés. Tu sitio se entrega completamente bilingüe con SEO internacional, para que aparezcas en esas búsquedas con los paquetes y bodas reales que ganan la consulta.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Can I update my portfolio myself?",
          "¿Puedo actualizar mi portafolio yo mismo?",
        ),
        answer: locBlocks(
          "Yes — after every event, add the new gallery, update your packages or refresh your featured weddings from your phone or laptop. We train you before launch, and everything publishes in both languages.",
          "Sí — después de cada evento, agrega la nueva galería, actualiza tus paquetes o renueva tus bodas destacadas desde tu celular o laptop. Te capacitamos antes del lanzamiento, y todo se publica en ambos idiomas.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "How long until my website is live?",
          "¿En cuánto tiempo estará lista mi página web?",
        ),
        answer: locBlocks(
          "A complete portfolio website takes 6–8 weeks; a focused landing page 2–3 weeks. If you're heading into wedding season, tell us your target date and we'll plan the timeline backwards from it.",
          "Un sitio web completo de portafolio toma 6–8 semanas; una landing page enfocada 2–3 semanas. Si se acerca la temporada de bodas, dinos tu fecha objetivo y planificamos el cronograma hacia atrás desde ella.",
        ),
      },
    ],
  },

  // ── STRUCTURED DATA (industry-scoped Service — replaces the auto one) ─────
  structuredData: { en: bodasServiceEn, es: bodasServiceEs },
}

// ─────────────────────────────────────────────────────────────────────────────
// seo document (metadata)
// ─────────────────────────────────────────────────────────────────────────────

const bodasEventosSeo = {
  _type: "seo",
  _id: "seo-paginas-web-para-bodas-y-eventos",
  pageName: "paginas-web-para-bodas-y-eventos",
  meta: {
    en: {
      title: "Wedding & Event Website Design | DR Web Studio",
      description:
        "Website design for wedding planners and event producers in the Dominican Republic: stunning portfolios, destination-wedding SEO and qualified inquiries.",
      keywords: [
        "wedding planner website design",
        "destination wedding website punta cana",
        "event planner web design dominican republic",
      ],
    },
    es: {
      title: "Diseño de Páginas Web para Bodas y Eventos | DR Web Studio",
      description:
        "Páginas web para wedding planners y organizadores de eventos en República Dominicana: portafolios que enamoran y consultas calificadas. Cotización gratis.",
      keywords: [
        "páginas web para bodas y eventos",
        "página web wedding planner",
        "página web organizador de eventos",
        "diseño web bodas destino",
        "diseño de páginas web para bodas y eventos",
      ],
    },
  },
  openGraph: {
    en: {
      title: "Wedding & Event Websites — Portfolios that Book Clients",
      description:
        "Full-bleed galleries, destination-wedding SEO and online date deposits for planners in the Dominican Republic. Built by the team behind Sertuin Events' site.",
    },
    es: {
      title:
        "Páginas Web para Bodas y Eventos — Portafolios que Cierran Clientes",
      description:
        "Galerías a pantalla completa, SEO para bodas destino y depósitos en línea para apartar fechas. Creadas por el equipo detrás del sitio de Sertuin Events.",
    },
    // image: upload in Studio (1200x630 — a real event/wedding shot)
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
    bodasEventosPage as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded landing page: paginas-web-para-bodas-y-eventos")

  await client.createOrReplace(
    bodasEventosSeo as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded SEO doc: paginas-web-para-bodas-y-eventos")

  console.log("")
  console.log("Next steps: see the header comment (seo.ts dropdown option,")
  console.log("ES + EN routes, Punta Cana + La Romana cross-links).")
}

seed().catch(console.error)
