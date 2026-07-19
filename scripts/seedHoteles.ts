/**
 * Seed script — INDUSTRY PAGE: Hoteles Boutique ONLY
 *
 * Creates the bilingual (en/es) landing page document AND its seo document for:
 *   slug "paginas-web-para-hoteles"
 *   → target: "páginas web para hoteles" / "diseño web hoteles" /
 *             "página web para mi hotel" / "hotel website design dominican
 *             republic"
 *
 * Slug targets the broad keyword; the COPY is deliberately boutique-focused
 * (small hotels, B&Bs, aparthotels, eco-lodges) — they're the buyers.
 *
 * INDUSTRY PAGE CONVENTIONS (same as seedRestaurantes.ts):
 *   • Flat slug: paginas-web-para-{industria}
 *   • EN route slug (translated): web-design-for-hotels — the EN
 *     structuredData URLs below assume this; adjust if you pick another.
 *   • structuredData: Service node with `audience` (boutique hotels) +
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
 *        title: "Páginas Web para Hoteles (Industry Landing)",
 *        value: "paginas-web-para-hoteles",
 *      },
 *
 * 2. ROUTES — ES route at:
 *      src/app/(root)/[lang]/paginas-web-para-hoteles/page.tsx
 *    and the EN route at web-design-for-hotels, both fetching
 *    getLandingPage("paginas-web-para-hoteles", lang).
 *
 * 3. INTERNAL LINKS (city ↔ industry grid) —
 *      • From the national hub: one contextual link, anchor
 *        "páginas web para hoteles".
 *      • From this page: one link to the hub and one to /es.
 *      • Cross-link once each with La Romana, Puerto Plata and Las Terrenas
 *        (the boutique-hotel markets) — this page's copy mentions those
 *        coasts; turn the mentions into anchors. On the Las Terrenas page,
 *        the "Hoteles Boutique y Villas" card copy is the natural spot to
 *        link here.
 *
 * 4. SITEMAP — confirm the slug is emitted for en + es with hreflang
 *    alternates.
 *
 * 5. STUDIO — attach portfolio projects: Grand Bay of the Sea FIRST (this is
 *    its page), and upload a 1200x630 OG image.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seedHoteles.ts
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
// structuredData — INDUSTRY-scoped Service node (audience: boutique hotels,
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

const hotelServiceEs = industryServiceNode({
  url: `${BASE}/es/paginas-web-para-hoteles`,
  name: "Páginas Web para Hoteles Boutique",
  serviceType: "Diseño de páginas web para hoteles",
  description:
    "Diseño de páginas web para hoteles boutique en República Dominicana: reservas directas sin comisiones OTA, sitios bilingües, rápidos y centrados en fotografía.",
  audienceType: "Hoteles boutique, B&Bs, aparthoteles y eco-lodges",
})

const hotelServiceEn = industryServiceNode({
  url: `${BASE}/en/web-design-for-hotels`,
  name: "Web Design for Boutique Hotels",
  serviceType: "Hotel website design",
  description:
    "Boutique hotel website design in the Dominican Republic: direct bookings without OTA commissions, bilingual, fast and photography-first.",
  audienceType: "Boutique hotels, B&Bs, aparthotels and eco-lodges",
})

// ─────────────────────────────────────────────────────────────────────────────
// Hoteles Boutique — industry landing page document
// Angle: the OTA commission argument at full strength. A boutique hotel's
// booking mix is the whole game: every night that moves from Booking/Expedia
// (15–25% commission) to the hotel's own site is margin recovered. Secondary
// angles: a boutique hotel's PRODUCT is its story and design — which an OTA
// listing flattens into a grid of thumbnails — and international guests
// research in English. Grand Bay of the Sea is the native proof; Franklin's
// testimonial leads.
// ─────────────────────────────────────────────────────────────────────────────

const hotelesPage: Record<string, unknown> = {
  _type: "landingPage",
  _id: "landingPage-paginas-web-para-hoteles",
  title: "Páginas Web para Hoteles Boutique (Industry Landing Page)",
  slug: { _type: "slug", current: "paginas-web-para-hoteles" },

  // ── HERO ──────────────────────────────────────────────────────────────────
  hero: {
    headline: loc(
      "Web Design for Boutique Hotels",
      "Páginas Web para Hoteles Boutique",
    ),
    subheadline: loc(
      "Photography-first, bilingual hotel websites that turn your repeat guests, referrals and Instagram followers into direct bookings — instead of 15–25% commissions.",
      "Páginas web bilingües y centradas en fotografía que convierten a tus huéspedes recurrentes, referidos y seguidores de Instagram en reservas directas — en lugar de comisiones del 15–25%.",
    ),
    primaryCta: loc("Get a Free Quote", "Solicitar Cotización Gratis"),
    primaryCtaHref: "/contact",
    secondaryCta: loc("View Our Portfolio", "Ver Nuestro Portafolio"),
    secondaryCtaHref: "/portfolio",
    badge: loc(
      "For boutique hotels, B&Bs, aparthotels and eco-lodges across the Dominican Republic",
      "Para hoteles boutique, B&Bs, aparthoteles y eco-lodges en toda República Dominicana",
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
      "What a Boutique Hotel's Website Must Do",
      "Lo que la Página Web de un Hotel Boutique Debe Hacer",
    ),
    sectionSubtitle: locBlocks(
      "An OTA listing shows a grid of thumbnails next to your competitors. Your own website is the only place your hotel gets to be the only option.",
      "Una ficha de OTA te muestra en una cuadrícula de miniaturas junto a tu competencia. Tu propia página web es el único lugar donde tu hotel es la única opción.",
    ),
    items: [
      {
        _key: key(),
        icon: "BedDouble",
        title: loc(
          "A Site Built to Book Direct",
          "Un Sitio Hecho para Reservar Directo",
        ),
        description: locBlocks(
          "Room pages with real photography, clear rates and availability inquiries by WhatsApp or form — plus integration with the booking engine you already use, so direct guests never get bounced to an OTA.",
          "Páginas de habitaciones con fotografía real, tarifas claras y consultas de disponibilidad por WhatsApp o formulario — más integración con el motor de reservas que ya uses, para que el huésped directo nunca termine en una OTA.",
        ),
        linkSlug: "custom-websites",
      },
      {
        _key: key(),
        icon: "Camera",
        title: loc(
          "Your Story, Not an OTA Listing",
          "Tu Historia, No Una Ficha de OTA",
        ),
        description: locBlocks(
          "A boutique hotel sells atmosphere, design and experience — things a thumbnail grid flattens. Fast, full-bleed galleries and pages for your restaurant, pool, tours and story, the way you'd show a guest around.",
          "Un hotel boutique vende atmósfera, diseño y experiencia — cosas que una cuadrícula de miniaturas aplana. Galerías rápidas a pantalla completa y páginas para tu restaurante, piscina, tours e historia, como si le mostraras el hotel a un huésped.",
        ),
        linkSlug: "landing-pages",
      },
      {
        _key: key(),
        icon: "CreditCard",
        title: loc("Online Payments & Deposits", "Pagos y Depósitos en Línea"),
        description: locBlocks(
          "Secure online deposits and payments for direct reservations — confirming bookings instantly, reducing no-shows, and keeping the whole transaction commission-free on your own site.",
          "Depósitos y pagos seguros en línea para reservas directas — confirmando al instante, reduciendo no-shows y manteniendo toda la transacción sin comisiones, en tu propio sitio.",
        ),
        linkSlug: "ecommerce",
      },
    ],
  },

  // ── WHY CHOOSE US ─────────────────────────────────────────────────────────
  whyUs: {
    sectionTitle: loc(
      "Why Boutique Hotels Choose Us",
      "Por Qué los Hoteles Boutique Nos Eligen",
    ),
    sectionSubtitle: locBlocks(
      "We're based in the country's biggest tourism zone — hospitality isn't a vertical we added, it's the market we live in.",
      "Tenemos base en la zona turística más grande del país — la hospitalidad no es un vertical que agregamos, es el mercado en el que vivimos.",
    ),
    items: [
      {
        _key: key(),
        icon: "Percent",
        title: loc(
          "Recover 15–25% of Every Night",
          "Recupera el 15–25% de Cada Noche",
        ),
        description: locBlocks(
          "Every booking that moves from an OTA to your own site is commission back in your pocket. For a small hotel, shifting even a few bookings a month to direct often pays for the website in its first season.",
          "Cada reserva que pasa de una OTA a tu propio sitio es comisión de vuelta a tu bolsillo. Para un hotel pequeño, mover aunque sea unas pocas reservas al mes al canal directo suele pagar la página web en su primera temporada.",
        ),
      },
      {
        _key: key(),
        icon: "Languages",
        title: loc("Bilingual for Your Guests", "Bilingüe para tus Huéspedes"),
        description: locBlocks(
          "Your guests book from the US, Canada and Europe. Every site ships fully bilingual — Spanish and English — with international SEO so travelers find you while planning from abroad.",
          "Tus huéspedes reservan desde EE. UU., Canadá y Europa. Cada sitio se entrega completamente bilingüe — español e inglés — con SEO internacional para que los viajeros te encuentren planificando desde el exterior.",
        ),
      },
      {
        _key: key(),
        icon: "BadgeCheck",
        title: loc("Proven in Hospitality", "Probado en Hospitalidad"),
        description: locBlocks(
          "Grand Bay of the Sea and other tourism businesses run on sites we built — fast-loading, beautiful on every device, and managed by the owners themselves.",
          "Grand Bay of the Sea y otros negocios turísticos funcionan con sitios que construimos — de carga rápida, hermosos en cualquier dispositivo y administrados por los propios dueños.",
        ),
      },
      {
        _key: key(),
        icon: "Zap",
        title: loc(
          "Fast Where Guests Book: Their Phone",
          "Rápida Donde Reservan: el Celular",
        ),
        description: locBlocks(
          "Most direct bookings start on a phone, often on hotel wifi or roaming data. Our Next.js sites load in under two seconds — because a slow gallery is an abandoned booking.",
          "La mayoría de las reservas directas empiezan en un celular, muchas veces con wifi de hotel o datos de roaming. Nuestros sitios en Next.js cargan en menos de dos segundos — porque una galería lenta es una reserva abandonada.",
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
          "We learn about your hotel, your guests and your current booking mix. You complete our project questionnaire and we define the full scope, sitemap and timeline together.",
          "Conocemos tu hotel, tus huéspedes y tu mezcla actual de reservas. Completas nuestro cuestionario de proyecto y juntos definimos el alcance, mapa del sitio y cronograma.",
        ),
        duration: loc("3–5 days", "3–5 días"),
      },
      {
        _key: key(),
        number: 2,
        icon: "Palette",
        stepTitle: loc("Design & Prototyping", "Diseño y Prototipado"),
        description: locBlocks(
          "We create a custom visual design that captures your hotel's atmosphere. You review the design and we refine it across two revision rounds until it's perfect.",
          "Creamos un diseño visual personalizado que captura la atmósfera de tu hotel. Revisas el diseño y lo refinamos en dos rondas de revisión hasta que quede perfecto.",
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
          "We build your site with Next.js and connect it to Sanity CMS so you can update rooms, rates, photos and seasonal offers yourself. SEO, performance and responsive design are built in.",
          "Construimos tu sitio con Next.js y lo conectamos a Sanity CMS para que actualices habitaciones, tarifas, fotos y ofertas de temporada tú mismo. SEO, rendimiento y diseño responsivo vienen integrados.",
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
      "Websites we've built for hospitality and tourism businesses.",
      "Páginas web que hemos creado para negocios de hospitalidad y turismo.",
    ),
    // Attach real `project` references in Studio (max 3). Grand Bay of the
    // Sea FIRST — it's the native proof for this page.
    projects: [],
    ctaText: loc("View Full Portfolio", "Ver Portafolio Completo"),
    ctaHref: "/portfolio",
  },

  // ── TESTIMONIALS (same three clients; hospitality proof leads) ────────────
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
      "What hotel owners ask us most.",
      "Lo que más nos preguntan los dueños de hoteles.",
    ),
    items: [
      {
        _key: key(),
        question: loc(
          "How much does a hotel website cost?",
          "¿Cuánto cuesta una página web para mi hotel?",
        ),
        // Figures verified against your live landing pages (July 2026).
        answer: locBlocks(
          "Pricing starts at $950 USD for a complete boutique hotel website; a focused landing page starts at $400 and web applications at $1,250 — 50% upfront, 50% on delivery, with no hidden fees and no monthly platform charges.",
          "Los precios comienzan en $950 USD para un sitio web completo de hotel boutique; una landing page enfocada comienza en $400 y las aplicaciones web en $1,250 — 50% al inicio y 50% al entregar, sin costos ocultos ni cuotas mensuales de plataforma.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Can my website take direct bookings?",
          "¿Mi página web puede recibir reservas directas?",
        ),
        answer: locBlocks(
          "Yes. Availability inquiries by WhatsApp and forms are standard on every site, and we can integrate the booking engine you already use — with online deposits to confirm reservations instantly. The goal: guests who found you directly book directly.",
          "Sí. Las consultas de disponibilidad por WhatsApp y formularios son estándar en cada sitio, y podemos integrar el motor de reservas que ya uses — con depósitos en línea para confirmar al instante. La meta: el huésped que te encontró directo, reserva directo.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Should I leave Booking and Expedia?",
          "¿Debo salirme de Booking y Expedia?",
        ),
        answer: locBlocks(
          "No — and we won't tell you otherwise. OTAs are visibility, especially for first-time guests. Your website's job is different: converting repeat guests, referrals, and travelers who found you on Instagram or Google into commission-free direct bookings, so your channel mix improves without losing OTA reach.",
          "No — y no te diremos lo contrario. Las OTAs son visibilidad, sobre todo para huéspedes nuevos. El trabajo de tu página web es otro: convertir a huéspedes recurrentes, referidos y viajeros que te encontraron en Instagram o Google en reservas directas sin comisión, mejorando tu mezcla de canales sin perder el alcance de las OTAs.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Can I update rooms, rates and photos myself?",
          "¿Puedo actualizar habitaciones, tarifas y fotos yo mismo?",
        ),
        answer: locBlocks(
          "Yes — that's what the CMS is for. Update rates for high season, swap photos, add an offer or close a room for maintenance, all from your phone or laptop. We train you and your team before launch.",
          "Sí — para eso está el CMS. Actualiza tarifas de temporada alta, cambia fotos, agrega una oferta o cierra una habitación por mantenimiento, todo desde tu celular o laptop. Te capacitamos a ti y a tu equipo antes del lanzamiento.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "How long until my website is live?",
          "¿En cuánto tiempo estará lista mi página web?",
        ),
        answer: locBlocks(
          "A complete hotel website takes 6–8 weeks; a focused landing page 2–3 weeks. If high season is approaching, tell us your target date and we'll plan the timeline backwards from it — launching with time to rank before your busiest months.",
          "Un sitio web completo de hotel toma 6–8 semanas; una landing page enfocada 2–3 semanas. Si se acerca la temporada alta, dinos tu fecha objetivo y planificamos el cronograma hacia atrás desde ella — lanzando con tiempo de posicionar antes de tus meses más ocupados.",
        ),
      },
    ],
  },

  // ── STRUCTURED DATA (industry-scoped Service — replaces the auto one) ─────
  structuredData: { en: hotelServiceEn, es: hotelServiceEs },
}

// ─────────────────────────────────────────────────────────────────────────────
// seo document (metadata)
// ─────────────────────────────────────────────────────────────────────────────

const hotelesSeo = {
  _type: "seo",
  _id: "seo-paginas-web-para-hoteles",
  pageName: "paginas-web-para-hoteles",
  meta: {
    en: {
      title: "Hotel Website Design Dominican Republic | DR Web Studio",
      description:
        "Boutique hotel website design in the Dominican Republic: direct bookings without OTA commissions, bilingual, fast and photography-first. Free quotes.",
      keywords: [
        "hotel website design dominican republic",
        "boutique hotel web design",
        "hotel web design punta cana",
      ],
    },
    es: {
      title: "Diseño de Páginas Web para Hoteles | DR Web Studio",
      description:
        "Diseño de páginas web para hoteles boutique en República Dominicana: reservas directas sin comisiones OTA, sitios bilingües y rápidos. Cotización gratis.",
      keywords: [
        "páginas web para hoteles",
        "diseño web hoteles",
        "página web para mi hotel",
        "diseño de páginas web para hoteles",
        "página web hotel boutique",
      ],
    },
  },
  openGraph: {
    en: {
      title: "Hotel Websites — Direct Bookings, Not Commissions",
      description:
        "Photography-first, bilingual websites for boutique hotels in the Dominican Republic. Turn repeat guests and referrals into direct bookings. Free quotes.",
    },
    es: {
      title: "Páginas Web para Hoteles — Reservas Directas, No Comisiones",
      description:
        "Páginas web bilingües y centradas en fotografía para hoteles boutique en República Dominicana. Convierte referidos y huéspedes recurrentes en reservas directas.",
    },
    // image: upload in Studio (1200x630 — a striking room or pool shot)
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
    hotelesPage as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded landing page: paginas-web-para-hoteles")

  await client.createOrReplace(
    hotelesSeo as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded SEO doc: paginas-web-para-hoteles")

  console.log("")
  console.log("Next steps: see the header comment (seo.ts dropdown option,")
  console.log("ES + EN routes, city↔industry cross-links, sitemap check).")
}

seed().catch(console.error)
