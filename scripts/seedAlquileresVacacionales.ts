/**
 * Seed script — INDUSTRY PAGE: Alquileres Vacacionales ONLY
 *
 * Creates the bilingual (en/es) landing page document AND its seo document for:
 *   slug "paginas-web-para-alquileres-vacacionales"
 *   → target: "páginas web para alquileres vacacionales" / "página web para
 *             villa" / "vacation rental website design"
 *
 * SCOPE SPLIT (declared in seedInmobiliarias.ts — respect it):
 *   • THIS page = RENTALS: property managers, Airbnb/VRBO operators, villa
 *     and condo owners renting out. Anchors with "alquileres vacacionales"
 *     point HERE.
 *   • The inmobiliarias page = SALES. Anchors with "inmobiliaria(s)" /
 *     "bienes raíces" point THERE. Cross-link the two pages once each.
 *
 * INDUSTRY PAGE CONVENTIONS (same as the other industry seeds):
 *   • Flat slug: paginas-web-para-{industria}
 *   • EN route slug (translated): web-design-for-vacation-rentals — the EN
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
 *        title: "Páginas Web para Alquileres Vacacionales (Industry Landing)",
 *        value: "paginas-web-para-alquileres-vacacionales",
 *      },
 *
 * 2. ROUTES — ES route at:
 *      src/app/(root)/[lang]/paginas-web-para-alquileres-vacacionales/page.tsx
 *    and the EN route at web-design-for-vacation-rentals, both fetching
 *    getLandingPage("paginas-web-para-alquileres-vacacionales", lang).
 *
 * 3. INTERNAL LINKS (city ↔ industry grid) —
 *      • From the national hub: one contextual link, anchor
 *        "páginas web para alquileres vacacionales".
 *      • From this page: one link to the hub and one to /es.
 *      • City anchors in: the "alquileres" halves of the Punta Cana and San
 *        Pedro (Juan Dolio) real-estate cards, plus Las Terrenas (villas) and
 *        Puerto Plata (Cabarete rentals). This page links back to Punta Cana
 *        and Las Terrenas.
 *      • Siblings: one cross-link each with the hoteles page (adjacent
 *        audience) and the inmobiliarias page (the declared split).
 *
 * 4. SITEMAP — confirm the slug is emitted for en + es with hreflang
 *    alternates.
 *
 * 5. STUDIO — attach portfolio projects (Grand Bay of the Sea first) and
 *    upload a 1200x630 OG image (a villa/pool shot).
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seedAlquileresVacacionales.ts
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
// structuredData — INDUSTRY-scoped Service node (audience: vacation rentals,
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

const rentalServiceEs = industryServiceNode({
  url: `${BASE}/es/paginas-web-para-alquileres-vacacionales`,
  name: "Páginas Web para Alquileres Vacacionales",
  serviceType: "Diseño de páginas web para alquileres vacacionales",
  description:
    "Diseño de páginas web para alquileres vacacionales y villas en República Dominicana: reservas directas sin comisiones de plataformas, con pagos en línea.",
  audienceType:
    "Alquileres vacacionales, villas y administradores de propiedades",
})

const rentalServiceEn = industryServiceNode({
  url: `${BASE}/en/web-design-for-vacation-rentals`,
  name: "Web Design for Vacation Rentals",
  serviceType: "Vacation rental website design",
  description:
    "Vacation rental website design in the Dominican Republic: direct bookings without platform commissions, bilingual and with online payments.",
  audienceType: "Vacation rentals, villas and property managers",
})

// ─────────────────────────────────────────────────────────────────────────────
// Alquileres Vacacionales — industry landing page document
// Angle: the commission argument with the rentals twist — vacation rental
// guests COME BACK. Platforms charge host + guest fees (often 15–18% of a
// stay combined) and own the guest relationship; a direct-booking site turns
// returning guests, referrals and Instagram followers into commission-free
// stays the operator owns. Also: platform risk (algorithm, delisting) makes
// an owned channel insurance. Serves both property managers with portfolios
// and single-villa owners (dedicated landing pages).
// ─────────────────────────────────────────────────────────────────────────────

const alquileresPage: Record<string, unknown> = {
  _type: "landingPage",
  _id: "landingPage-paginas-web-para-alquileres-vacacionales",
  title: "Páginas Web para Alquileres Vacacionales (Industry Landing Page)",
  slug: { _type: "slug", current: "paginas-web-para-alquileres-vacacionales" },

  // ── HERO ──────────────────────────────────────────────────────────────────
  hero: {
    headline: loc(
      "Web Design for Vacation Rentals",
      "Páginas Web para Alquileres Vacacionales",
    ),
    subheadline: loc(
      "Direct-booking websites for villas, condos and property managers — so your returning guests and referrals stop paying platform fees to reach you.",
      "Páginas web de reserva directa para villas, apartamentos y administradores de propiedades — para que tus huéspedes que regresan y tus referidos dejen de pagar comisiones de plataforma para llegar a ti.",
    ),
    primaryCta: loc("Get a Free Quote", "Solicitar Cotización Gratis"),
    primaryCtaHref: "/contact",
    secondaryCta: loc("View Our Portfolio", "Ver Nuestro Portafolio"),
    secondaryCtaHref: "/portfolio",
    badge: loc(
      "For villas, condos and property managers across the Dominican Republic",
      "Para villas, apartamentos y administradores de propiedades en toda República Dominicana",
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
      "What a Vacation Rental Website Must Do",
      "Lo que la Página Web de un Alquiler Vacacional Debe Hacer",
    ),
    sectionSubtitle: locBlocks(
      "On a platform, your villa is inventory. On your own site, it's a brand guests can return to — without the fees.",
      "En una plataforma, tu villa es inventario. En tu propio sitio, es una marca a la que los huéspedes pueden volver — sin las comisiones.",
    ),
    items: [
      {
        _key: key(),
        icon: "KeyRound",
        title: loc(
          "A Portfolio Site for Your Properties",
          "Un Sitio para tu Portafolio de Propiedades",
        ),
        description: locBlocks(
          "For property managers: every unit with its own page — fast galleries, amenities, rates by season and availability inquiries — all manageable by you, unit by unit.",
          "Para administradores: cada unidad con su propia página — galerías rápidas, amenidades, tarifas por temporada y consultas de disponibilidad — todo administrable por ti, unidad por unidad.",
        ),
        linkSlug: "custom-websites",
      },
      {
        _key: key(),
        icon: "CreditCard",
        title: loc(
          "Direct Bookings & Online Payments",
          "Reservas Directas y Pagos en Línea",
        ),
        description: locBlocks(
          "Availability inquiries by WhatsApp plus online deposits and payments to confirm stays instantly — keeping the entire transaction commission-free on your own channel.",
          "Consultas de disponibilidad por WhatsApp más depósitos y pagos en línea para confirmar estadías al instante — manteniendo toda la transacción sin comisiones, en tu propio canal.",
        ),
        linkSlug: "ecommerce",
      },
      {
        _key: key(),
        icon: "Home",
        title: loc(
          "One Villa, One Landing Page",
          "Una Villa, Una Landing Page",
        ),
        description: locBlocks(
          "Own a single villa or a couple of condos? A dedicated landing page with photos, rates and direct booking gives your property its own address online — starting at $400.",
          "¿Tienes una sola villa o un par de apartamentos? Una landing page dedicada con fotos, tarifas y reserva directa le da a tu propiedad su propia dirección en línea — desde $400.",
        ),
        linkSlug: "landing-pages",
      },
    ],
  },

  // ── WHY CHOOSE US ─────────────────────────────────────────────────────────
  whyUs: {
    sectionTitle: loc(
      "Why Rental Operators Choose Us",
      "Por Qué los Operadores de Alquileres Nos Eligen",
    ),
    sectionSubtitle: locBlocks(
      "We're based in Punta Cana, surrounded by the country's densest vacation rental market.",
      "Tenemos base en Punta Cana, rodeados del mercado de alquileres vacacionales más denso del país.",
    ),
    items: [
      {
        _key: key(),
        icon: "Percent",
        title: loc(
          "Stop Losing 15–18% per Stay",
          "Deja de Perder 15–18% por Estadía",
        ),
        description: locBlocks(
          "Between host and guest fees, platforms take a serious cut of every booking. Direct stays cost you nothing in commission — and because the guest skips the service fee, you can even price better and earn more.",
          "Entre comisiones de anfitrión y huésped, las plataformas se llevan una parte seria de cada reserva. Las estadías directas no te cuestan comisión — y como el huésped se ahorra la tarifa de servicio, hasta puedes dar mejor precio y ganar más.",
        ),
      },
      {
        _key: key(),
        icon: "Repeat",
        title: loc(
          "Your Guests Come Back — Straight to You",
          "Tus Huéspedes Vuelven — Directo a Ti",
        ),
        description: locBlocks(
          "Vacation rental guests return year after year. A card with your website at checkout means next year's stay books direct — the highest-margin booking a rental can get.",
          "Los huéspedes de alquileres vacacionales regresan año tras año. Una tarjeta con tu página web al hacer checkout significa que la estadía del próximo año se reserva directo — la reserva de mayor margen que existe.",
        ),
      },
      {
        _key: key(),
        icon: "Globe",
        title: loc(
          "Bilingual for International Guests",
          "Bilingüe para Huéspedes Internacionales",
        ),
        description: locBlocks(
          "Your guests book from the US, Canada and Europe. Every site ships fully bilingual — Spanish and English — with international SEO so travelers find your properties while planning from abroad.",
          "Tus huéspedes reservan desde EE. UU., Canadá y Europa. Cada sitio se entrega completamente bilingüe — español e inglés — con SEO internacional para que los viajeros encuentren tus propiedades planificando desde el exterior.",
        ),
      },
      {
        _key: key(),
        icon: "ShieldCheck",
        title: loc("Your Channel, Your Rules", "Tu Canal, Tus Reglas"),
        description: locBlocks(
          "Algorithm changes, ranking drops, account issues — platform risk is real. Your own website is the channel nobody can suspend, reorder or bury.",
          "Cambios de algoritmo, caídas de posicionamiento, problemas de cuenta — el riesgo de plataforma es real. Tu propia página web es el canal que nadie puede suspender, reordenar ni esconder.",
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
        stepTitle: loc(
          "Discovery & Planning",
          "Descubrimiento y Planificación",
        ),
        description: locBlocks(
          "We learn about your properties, your guests and your current channel mix. You complete our project questionnaire and we define the full scope, sitemap and timeline together.",
          "Conocemos tus propiedades, tus huéspedes y tu mezcla actual de canales. Completas nuestro cuestionario de proyecto y juntos definimos el alcance, mapa del sitio y cronograma.",
        ),
        duration: loc("3–5 days", "3–5 días"),
      },
      {
        _key: key(),
        number: 2,
        icon: "Palette",
        stepTitle: loc("Design & Prototyping", "Diseño y Prototipado"),
        description: locBlocks(
          "We create a custom visual design built around your best property photography. You review the design and we refine it across two revision rounds until it's perfect.",
          "Creamos un diseño visual personalizado construido alrededor de tu mejor fotografía de propiedades. Revisas el diseño y lo refinamos en dos rondas de revisión hasta que quede perfecto.",
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
          "We build your site with Next.js and connect it to Sanity CMS so you can update units, seasonal rates and photos yourself. SEO, performance and responsive design are built in.",
          "Construimos tu sitio con Next.js y lo conectamos a Sanity CMS para que actualices unidades, tarifas de temporada y fotos tú mismo. SEO, rendimiento y diseño responsivo vienen integrados.",
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
      "Websites we've built for hospitality and property businesses.",
      "Páginas web que hemos creado para negocios de hospitalidad y propiedades.",
    ),
    // Attach real `project` references in Studio (max 3). Grand Bay of the
    // Sea first — closest match for this audience.
    projects: [],
    ctaText: loc("View Full Portfolio", "Ver Portafolio Completo"),
    ctaHref: "/portfolio",
  },

  // ── TESTIMONIALS (same three clients; property/hospitality proof first) ───
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
      "What rental owners and managers ask us most.",
      "Lo que más nos preguntan los dueños y administradores de alquileres.",
    ),
    items: [
      {
        _key: key(),
        question: loc(
          "How much does a vacation rental website cost?",
          "¿Cuánto cuesta una página web para mi alquiler vacacional?",
        ),
        // Figures verified against your live landing pages (July 2026).
        answer: locBlocks(
          "A dedicated single-property landing page starts at $400 USD; a complete multi-unit portfolio website starts at $950 — 50% upfront, 50% on delivery, with no hidden fees and no monthly platform charges.",
          "Una landing page dedicada para una sola propiedad comienza en $400 USD; un sitio web completo de portafolio con varias unidades comienza en $950 — 50% al inicio y 50% al entregar, sin costos ocultos ni cuotas mensuales de plataforma.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Should I leave Airbnb or Booking?",
          "¿Debo salirme de Airbnb o Booking?",
        ),
        answer: locBlocks(
          "No — platforms fill calendar gaps and bring guests who've never heard of you. Your website's job is the other half: converting returning guests, referrals and Instagram followers into direct, commission-free stays, so your channel mix improves without losing reach.",
          "No — las plataformas llenan huecos del calendario y traen huéspedes que nunca han oído de ti. El trabajo de tu página web es la otra mitad: convertir huéspedes que regresan, referidos y seguidores de Instagram en estadías directas sin comisión, mejorando tu mezcla de canales sin perder alcance.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Can I take direct payments and deposits?",
          "¿Puedo recibir pagos y depósitos directos?",
        ),
        answer: locBlocks(
          "Yes. Availability inquiries by WhatsApp are standard, and we can integrate online payments so deposits confirm stays instantly. If you use a channel manager or booking calendar, tell us during discovery and we'll assess the integration for your setup.",
          "Sí. Las consultas de disponibilidad por WhatsApp son estándar, y podemos integrar pagos en línea para que los depósitos confirmen estadías al instante. Si usas un channel manager o calendario de reservas, dínoslo en la fase de descubrimiento y evaluamos la integración para tu operación.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Is it worth it if I only have one or two properties?",
          "¿Vale la pena si solo tengo una o dos propiedades?",
        ),
        answer: locBlocks(
          "Yes — that's exactly what the $400 single-property landing page is for. One good page with photos, rates and direct booking often pays for itself with the first two or three direct stays it captures.",
          "Sí — exactamente para eso es la landing page de una sola propiedad desde $400. Una buena página con fotos, tarifas y reserva directa suele pagarse sola con las primeras dos o tres estadías directas que capta.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Will my site be in English for international guests?",
          "¿Mi sitio estará en inglés para huéspedes internacionales?",
        ),
        answer: locBlocks(
          "Every site we build is fully bilingual — Spanish and English — at no extra platform cost, with international SEO so travelers searching from abroad find your properties while planning their trip.",
          "Cada sitio que construimos es completamente bilingüe — español e inglés — sin costo adicional de plataforma, con SEO internacional para que los viajeros buscando desde el exterior encuentren tus propiedades mientras planifican su viaje.",
        ),
      },
    ],
  },

  // ── STRUCTURED DATA (industry-scoped Service — replaces the auto one) ─────
  structuredData: { en: rentalServiceEn, es: rentalServiceEs },
}

// ─────────────────────────────────────────────────────────────────────────────
// seo document (metadata)
// ─────────────────────────────────────────────────────────────────────────────

const alquileresSeo = {
  _type: "seo",
  _id: "seo-paginas-web-para-alquileres-vacacionales",
  pageName: "paginas-web-para-alquileres-vacacionales",
  meta: {
    en: {
      title: "Vacation Rental Website Design | DR Web Studio",
      description:
        "Vacation rental website design in the Dominican Republic: direct bookings without platform commissions, bilingual, fast, with online payments. Free quotes.",
      keywords: [
        "vacation rental website design dominican republic",
        "villa website design punta cana",
        "direct booking website",
      ],
    },
    es: {
      title: "Páginas Web para Alquileres Vacacionales | DR Web Studio",
      description:
        "Páginas web para alquileres vacacionales en República Dominicana: reservas directas sin comisiones de plataformas, bilingües y rápidas. Cotización gratis.",
      keywords: [
        "páginas web para alquileres vacacionales",
        "página web para villa",
        "página web alquiler vacacional",
        "diseño web administrador de propiedades",
        "diseño de páginas web para alquileres vacacionales",
      ],
    },
  },
  openGraph: {
    en: {
      title: "Vacation Rental Websites — Your Guests Come Back Direct",
      description:
        "Direct-booking websites for villas, condos and property managers in the Dominican Republic. Online payments, no platform fees. Free quotes.",
    },
    es: {
      title:
        "Páginas Web para Alquileres Vacacionales — Tus Huéspedes Vuelven Directo",
      description:
        "Páginas web de reserva directa para villas, apartamentos y administradores en República Dominicana. Pagos en línea, sin comisiones de plataforma. Cotización gratis.",
    },
    // image: upload in Studio (1200x630 — a villa/pool shot)
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
    alquileresPage as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded landing page: paginas-web-para-alquileres-vacacionales")

  await client.createOrReplace(
    alquileresSeo as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded SEO doc: paginas-web-para-alquileres-vacacionales")

  console.log("")
  console.log("Next steps: see the header comment — respect the anchor split")
  console.log("with the inmobiliarias page when wiring internal links.")
}

seed().catch(console.error)
