/**
 * Seed script — Punta Cana (diseño) ONLY
 *
 * Creates the bilingual (en/es) landing page document AND its seo document for:
 *   slug "diseno-de-paginas-web-punta-cana"
 *   → target: "diseño de páginas web en Punta Cana" / "diseño web Punta Cana" /
 *             "diseño web Bávaro"
 *
 * Does NOT touch the other city documents.
 * Idempotent: safe to run repeatedly (createOrReplace) — but note it will
 * overwrite any edits made to these two Punta Cana documents in Studio.
 *
 * ── IMPORTANT: THE EXISTING desarrollo-web-punta-cana PAGE ──────────────────
 * You already have a Punta Cana landing page targeting "desarrollo web punta
 * cana". This new page follows the same split you use nationally (desarrollo
 * vs diseño as separate pages). To keep them from cannibalizing each other:
 *   • Internal anchors "desarrollo web en Punta Cana" → the EXISTING page;
 *     anchors "diseño de páginas web en Punta Cana" → THIS page. Never mix.
 *   • Cross-link the two pages once each ("¿Buscas desarrollo a medida?" /
 *     "¿Necesitas diseño de tu página web?").
 *   • Keep this page's copy design/small-business focused (it is) and the
 *     desarrollo page's copy custom-development focused.
 *
 * ── AFTER SEEDING ───────────────────────────────────────────────────────────
 *
 * 1. seo.ts — add this option to the pageName dropdown list:
 *      {
 *        title: "Diseño de Páginas Web Punta Cana (Landing)",
 *        value: "diseno-de-paginas-web-punta-cana",
 *      },
 *
 * 2. ROUTE — create, mirroring an existing landing page route:
 *      src/app/(root)/[lang]/diseno-de-paginas-web-punta-cana/page.tsx
 *    fetching with getLandingPage("diseno-de-paginas-web-punta-cana", lang).
 *
 * 3. INTERNAL LINKS — one contextual link from the national hub
 *    /es/diseno-web-republica-dominicana with anchor
 *    "diseño de páginas web en Punta Cana"; from this page, one link back to
 *    the hub and one to /es (anchor "desarrollo web en República Dominicana").
 *    Cross-link once each with the Higüey page (same province) and the
 *    La Romana page (same tourism corridor).
 *
 * 4. SITEMAP — confirm the slug is emitted for en + es with hreflang
 *    alternates, and verify the EN URLs inside the structuredData below if
 *    your English route uses a translated slug.
 *
 * 5. STUDIO — attach portfolio projects (Punta Cana Tour Store and Grand Bay
 *    of the Sea first — they're local proof) and upload a 1200x630 OG image.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seedPuntaCana.ts
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

const pcAreas = [
  { "@type": "City", name: "Punta Cana" },
  { "@type": "City", name: "Bávaro" },
  { "@type": "City", name: "Verón" },
  { "@type": "Place", name: "Cap Cana" },
  { "@type": "Place", name: "Uvero Alto" },
]

const pcCityServiceEs = serviceNode({
  url: `${BASE}/es/diseno-de-paginas-web-punta-cana`,
  name: "Diseño de Páginas Web en Punta Cana",
  serviceType: "Diseño y desarrollo de páginas web",
  description:
    "Diseño de páginas web bilingües para tours, restaurantes, bienes raíces y negocios locales en Punta Cana, Bávaro y Cap Cana, República Dominicana.",
  areaServed: pcAreas,
})

const pcCityServiceEn = serviceNode({
  url: `${BASE}/en/diseno-de-paginas-web-punta-cana`,
  name: "Web Design in Punta Cana",
  serviceType: "Web design and development",
  description:
    "Bilingual web design for tours, restaurants, real estate and local businesses in Punta Cana, Bávaro and Cap Cana, Dominican Republic.",
  areaServed: pcAreas,
})

// ─────────────────────────────────────────────────────────────────────────────
// Punta Cana — landing page document
// Angle: HOME TURF. The only page where "local" is literal — in-person
// meetings possible, local portfolio proof (Punta Cana Tour Store, Grand Bay
// of the Sea), and the market we know best. Audience: tour/excursion
// operators drowning in OTA commissions, the Bávaro/Los Corales restaurant
// and services scene, and the Cap Cana/Bávaro real estate & vacation rental
// boom. Key hook: direct bookings, not commissions.
// ─────────────────────────────────────────────────────────────────────────────

const puntaCanaPage: Record<string, unknown> = {
  _type: "landingPage",
  _id: "landingPage-diseno-paginas-web-punta-cana",
  title: "Diseño de Páginas Web en Punta Cana (City Landing Page)",
  slug: { _type: "slug", current: "diseno-de-paginas-web-punta-cana" },

  // ── HERO ──────────────────────────────────────────────────────────────────
  hero: {
    headline: loc(
      "Web Design in Punta Cana",
      "Diseño de Páginas Web en Punta Cana",
    ),
    subheadline: loc(
      "Fast, bilingual websites for Punta Cana's tours, restaurants, rentals and local businesses — designed and built right here, by your neighbors.",
      "Páginas web rápidas y bilingües para los tours, restaurantes, alquileres y negocios de Punta Cana — diseñadas y construidas aquí mismo, por tus vecinos.",
    ),
    primaryCta: loc("Get a Free Quote", "Solicitar Cotización Gratis"),
    primaryCtaHref: "/contact",
    secondaryCta: loc("View Our Portfolio", "Ver Nuestro Portafolio"),
    secondaryCtaHref: "/portfolio",
    badge: loc(
      "Based in Punta Cana — serving Bávaro, Cap Cana, Verón and Uvero Alto",
      "Con base en Punta Cana — atendemos Bávaro, Cap Cana, Verón y Uvero Alto",
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
      "Websites for the Businesses That Make Punta Cana Run",
      "Páginas Web para los Negocios que Mueven Punta Cana",
    ),
    sectionSubtitle: locBlocks(
      "Millions of visitors a year, thousands of businesses competing for them — the ones that win have a website that works as hard as they do.",
      "Millones de visitantes al año, miles de negocios compitiendo por ellos — los que ganan tienen una página web que trabaja tan duro como ellos.",
    ),
    items: [
      {
        _key: key(),
        icon: "Compass",
        title: loc(
          "Tours, Excursions & Transfers",
          "Tours, Excursiones y Transfers",
        ),
        description: locBlocks(
          "Your own booking-ready website means direct reservations instead of paying commission on every sale. Fast pages, clear pricing, one-tap WhatsApp — built to convert travelers before and during their trip.",
          "Tu propia página web lista para reservas significa reservaciones directas en lugar de pagar comisión por cada venta. Páginas rápidas, precios claros, WhatsApp de un toque — hechas para convertir viajeros antes y durante su viaje.",
        ),
        linkSlug: "landing-pages",
      },
      {
        _key: key(),
        icon: "KeyRound",
        title: loc(
          "Real Estate & Vacation Rentals",
          "Bienes Raíces y Alquileres Vacacionales",
        ),
        description: locBlocks(
          "Photo-first websites for Cap Cana and Bávaro projects, condos and rental managers — bilingual for international buyers, with fast galleries and direct inquiry flows that reduce platform dependency.",
          "Sitios web centrados en fotografía para proyectos, apartamentos y administradores de alquileres en Cap Cana y Bávaro — bilingües para compradores internacionales, con galerías rápidas y consultas directas que reducen la dependencia de plataformas.",
        ),
        linkSlug: "custom-websites",
      },
      {
        _key: key(),
        icon: "ConciergeBell",
        title: loc(
          "Restaurants, Spas & Local Services",
          "Restaurantes, Spas y Servicios Locales",
        ),
        description: locBlocks(
          "Menus that load instantly, reservations and online ordering for the Bávaro and Los Corales scene — plus sites for the gyms, salons, clinics and services that keep the zone's residents covered.",
          "Menús que cargan al instante, reservas y pedidos en línea para la escena de Bávaro y Los Corales — más sitios para los gimnasios, salones, clínicas y servicios que atienden a los residentes de la zona.",
        ),
        linkSlug: "ecommerce",
      },
    ],
  },

  // ── WHY CHOOSE US ─────────────────────────────────────────────────────────
  whyUs: {
    sectionTitle: loc(
      "Why Punta Cana Businesses Choose Us",
      "Por Qué los Negocios de Punta Cana Nos Eligen",
    ),
    sectionSubtitle: locBlocks(
      "This isn't a market we studied. It's where we live.",
      "Este no es un mercado que estudiamos. Es donde vivimos.",
    ),
    items: [
      {
        _key: key(),
        icon: "MapPin",
        title: loc("Actually Local", "Realmente Locales"),
        description: locBlocks(
          "We're based in Punta Cana — the only web studio on this page's list of competitors that can say it. Prefer to meet in person before starting? We can do that.",
          "Estamos en Punta Cana. ¿Prefieres reunirte en persona antes de comenzar? Aquí sí se puede — somos los únicos que podemos ofrecerlo de verdad.",
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
          "Every booking through an OTA costs you 15–25%. Your own fast, trustworthy website turns your best marketing channel — guests who already found you — into commission-free sales.",
          "Cada reserva a través de una OTA te cuesta un 15–25%. Tu propia página web, rápida y confiable, convierte tu mejor canal — los clientes que ya te encontraron — en ventas sin comisión.",
        ),
      },
      {
        _key: key(),
        icon: "Languages",
        title: loc(
          "Built for International Visitors",
          "Pensadas para el Visitante Internacional",
        ),
        description: locBlocks(
          "Your customers arrive from the US, Canada and Europe. Every site ships fully bilingual with English treated as a first-class version — because that's who's searching for you.",
          "Tus clientes llegan de EE. UU., Canadá y Europa. Cada sitio se entrega completamente bilingüe con el inglés como versión protagonista — porque son ellos quienes te buscan.",
        ),
      },
      {
        _key: key(),
        icon: "BadgeCheck",
        title: loc("Proven Right Here", "Resultados Comprobados Aquí Mismo"),
        description: locBlocks(
          "Punta Cana Tour Store, Grand Bay of the Sea — our portfolio isn't from some other market. It's local businesses like yours, with results like 150% sales growth to show for it.",
          "Punta Cana Tour Store, Grand Bay of the Sea — nuestro portafolio no es de otro mercado. Son negocios locales como el tuyo, con resultados como un 150% de crecimiento en ventas que lo demuestran.",
        ),
      },
    ],
  },

  // ── PROCESS STEPS (the real 5-step process from your live landing pages) ──
  process: {
    sectionTitle: loc("How We Work", "Cómo Trabajamos"),
    sectionSubtitle: locBlocks(
      "A clear, structured process from first call — or first coffee — to launch.",
      "Un proceso claro y estructurado desde la primera llamada — o el primer café — hasta el lanzamiento.",
    ),
    steps: [
      {
        _key: key(),
        number: 1,
        icon: "MessageCircle",
        stepTitle: loc("Discovery & Planning", "Descubrimiento y Planificación"),
        description: locBlocks(
          "We learn about your business, your seasons and your customers — by video call or in person here in Punta Cana. You complete our project questionnaire and we define the full scope, sitemap and timeline together.",
          "Conocemos tu negocio, tus temporadas y tus clientes — por videollamada o en persona aquí en Punta Cana. Completas nuestro cuestionario de proyecto y juntos definimos el alcance, mapa del sitio y cronograma.",
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
          "We build your site with Next.js and connect it to Sanity CMS so you can update tours, menus or listings yourself. SEO, performance and responsive design are built in.",
          "Construimos tu sitio con Next.js y lo conectamos a Sanity CMS para que actualices tours, menús o propiedades tú mismo. SEO, rendimiento y diseño responsivo vienen integrados.",
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
          "30 days of free post-launch support plus a full year of hosting and maintenance included at no cost — valued at $1,140. And we're right here if you need us.",
          "30 días de soporte post-lanzamiento gratis más un año completo de hosting y mantenimiento incluido sin costo — valorado en $1,140. Y estamos aquí mismo si nos necesitas.",
        ),
        duration: loc("30 days + 1 year", "30 días + 1 año"),
      },
    ],
  },

  // ── PORTFOLIO HIGHLIGHT ───────────────────────────────────────────────────
  portfolioHighlight: {
    sectionTitle: loc(
      "Built for Punta Cana Businesses",
      "Creadas para Negocios de Punta Cana",
    ),
    sectionSubtitle: locBlocks(
      "Real websites for real businesses in this zone.",
      "Páginas web reales para negocios reales de esta zona.",
    ),
    // Attach real `project` references in Studio (max 3). This is the one page
    // where the portfolio should be ALL local: Punta Cana Tour Store and
    // Grand Bay of the Sea first.
    projects: [],
    ctaText: loc("View Full Portfolio", "Ver Portafolio Completo"),
    ctaHref: "/portfolio",
  },

  // ── TESTIMONIALS (same three clients; local tour business leads) ──────────
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
    ],
  },

  // ── FAQ (feeds auto-generated FAQPage JSON-LD — fill BOTH locales) ────────
  faq: {
    sectionTitle: loc("Frequently Asked Questions", "Preguntas Frecuentes"),
    sectionSubtitle: locBlocks(
      "What Punta Cana business owners ask us most.",
      "Lo que más nos preguntan los dueños de negocios en Punta Cana.",
    ),
    items: [
      {
        _key: key(),
        question: loc(
          "How much does a website cost in Punta Cana?",
          "¿Cuánto cuesta una página web en Punta Cana?",
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
          "Can we meet in person in Punta Cana?",
          "¿Podemos reunirnos en persona en Punta Cana?",
        ),
        answer: locBlocks(
          "Yes — we're based right here, so a face-to-face meeting is genuinely possible, not a sales line. Most clients still prefer the speed of video calls and WhatsApp, but the choice is yours.",
          "Sí — estamos aquí mismo, así que una reunión cara a cara es genuinamente posible, no una frase de ventas. La mayoría de los clientes prefiere la rapidez de las videollamadas y WhatsApp, pero tú eliges.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "I run a tour business — can my website take direct bookings?",
          "Tengo un negocio de tours — ¿mi página puede recibir reservas directas?",
        ),
        answer: locBlocks(
          "Yes. We build booking inquiry flows through WhatsApp and forms as standard, and can integrate booking systems as your operation needs. The goal is simple: guests who find you directly shouldn't cost you a 15–25% commission.",
          "Sí. Construimos flujos de reserva por WhatsApp y formularios de manera estándar, y podemos integrar sistemas de reservas según lo necesite tu operación. La meta es simple: los clientes que te encuentran directamente no deberían costarte un 15–25% de comisión.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Will my website be in English for tourists?",
          "¿Mi página web estará en inglés para los turistas?",
        ),
        answer: locBlocks(
          "Every site we build is fully bilingual — Spanish and English — at no extra platform cost. For tourism businesses we structure the English version to rank internationally, so travelers find you while planning their trip from abroad.",
          "Cada sitio que construimos es completamente bilingüe — español e inglés — sin costo adicional de plataforma. Para negocios turísticos estructuramos la versión en inglés para posicionar internacionalmente, y que los viajeros te encuentren mientras planifican su viaje desde el exterior.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "How long until my website is live?",
          "¿En cuánto tiempo estará lista mi página web?",
        ),
        answer: locBlocks(
          "Landing pages take 2–3 weeks, custom business websites 6–8 weeks, and web applications 5–8 weeks. If you're heading into high season, tell us your target date and we'll plan the timeline around it.",
          "Las landing pages toman 2–3 semanas, los sitios web empresariales 6–8 semanas y las aplicaciones web 5–8 semanas. Si se acerca tu temporada alta, dinos tu fecha objetivo y planificamos el cronograma alrededor de ella.",
        ),
      },
    ],
  },

  // ── STRUCTURED DATA (city-scoped Service — replaces the auto-generated) ───
  structuredData: { en: pcCityServiceEn, es: pcCityServiceEs },
}

// ─────────────────────────────────────────────────────────────────────────────
// seo document (metadata)
// ─────────────────────────────────────────────────────────────────────────────

const puntaCanaSeo = {
  _type: "seo",
  _id: "seo-diseno-de-paginas-web-punta-cana",
  pageName: "diseno-de-paginas-web-punta-cana",
  meta: {
    en: {
      title: "Web Design in Punta Cana, Dominican Republic | DR Web Studio",
      description:
        "Web design in Punta Cana and Bávaro for tours, restaurants, real estate and local businesses. Bilingual, fast, and built locally. Free quotes.",
      keywords: [
        "web design punta cana",
        "website design punta cana dominican republic",
        "web design bavaro",
        "web designer punta cana",
      ],
    },
    es: {
      title: "Diseño de Páginas Web en Punta Cana | DR Web Studio",
      description:
        "Diseño de páginas web en Punta Cana y Bávaro para tours, restaurantes, bienes raíces y más. Sitios bilingües y rápidos, creados aquí mismo. Cotización gratis.",
      keywords: [
        "diseño de páginas web en punta cana",
        "diseño web punta cana",
        "páginas web punta cana",
        "diseño web bávaro",
        "diseño de páginas web bávaro",
      ],
    },
  },
  openGraph: {
    en: {
      title: "Web Design in Punta Cana — Built Right Here",
      description:
        "Bilingual websites for Punta Cana's tours, restaurants, rentals and local businesses — by the web studio that actually lives here. Get a free quote.",
    },
    es: {
      title: "Diseño de Páginas Web en Punta Cana — Creadas Aquí Mismo",
      description:
        "Páginas web bilingües para los tours, restaurantes, alquileres y negocios de Punta Cana — por el estudio web que realmente vive aquí. Cotización gratis.",
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
    puntaCanaPage as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded landing page: diseno-de-paginas-web-punta-cana")

  await client.createOrReplace(
    puntaCanaSeo as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded SEO doc: diseno-de-paginas-web-punta-cana")

  console.log("")
  console.log("Next steps: see the header comment — especially the anchor-split")
  console.log("rules vs your existing desarrollo-web-punta-cana page.")
}

seed().catch(console.error)
