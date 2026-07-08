/**
 * Seed script — INDUSTRY PAGE: Restaurantes ONLY
 *
 * The first industry landing page (pattern-setter for hoteles, inmobiliarias,
 * etc.). Creates the bilingual (en/es) landing page document AND its seo
 * document for:
 *   slug "paginas-web-para-restaurantes"
 *   → target: "páginas web para restaurantes" / "diseño web restaurantes" /
 *             "página web para mi restaurante" / "menú digital"
 *
 * INDUSTRY PAGE CONVENTIONS (differ from city pages):
 *   • Slug pattern: paginas-web-para-{industria} (flat, at root — matches the
 *     decision to keep landing pages folderless).
 *   • EN route slug: web-design-for-restaurants (your EN routes use translated
 *     slugs, e.g. web-design-punta-cana — the EN structuredData URLs below
 *     assume this; adjust if you pick a different EN slug).
 *   • structuredData: the Service node uses `audience` (restaurants) +
 *     `areaServed` Country (nationwide) instead of city geography.
 *
 * NOTE ON THE DESIGN'S "checklist" SECTION: the Claude Design prompt includes
 * a section 6 ("Todo lo que tu restaurante necesita") that does NOT exist in
 * the landingPage schema. This seed covers every schema-supported section; the
 * checklist items are woven into services/FAQ copy meanwhile. If the approved
 * design keeps that section, it needs a schema object + component first —
 * then extend this document.
 *
 * Does NOT touch any other documents.
 * Idempotent: safe to run repeatedly (createOrReplace) — but it will overwrite
 * Studio edits to these two documents.
 *
 * ── AFTER SEEDING ───────────────────────────────────────────────────────────
 *
 * 1. seo.ts — add this option to the pageName dropdown list:
 *      {
 *        title: "Páginas Web para Restaurantes (Industry Landing)",
 *        value: "paginas-web-para-restaurantes",
 *      },
 *
 * 2. ROUTES — ES route at:
 *      src/app/(root)/[lang]/paginas-web-para-restaurantes/page.tsx
 *    and (following your translated-EN-slug pattern) the EN route at
 *    web-design-for-restaurants, both fetching
 *    getLandingPage("paginas-web-para-restaurantes", lang).
 *
 * 3. INTERNAL LINKS (city ↔ industry grid) —
 *      • From the national hub /es/diseno-web-republica-dominicana: one
 *        contextual link, anchor "páginas web para restaurantes".
 *      • From this page: one link to the hub and one to /es (anchor
 *        "desarrollo web en República Dominicana").
 *      • Cross-link once each with the Punta Cana and Las Terrenas city pages
 *        (the restaurant-dense markets) — e.g. this page mentions serving
 *        restaurants "en zonas turísticas como Punta Cana y Las Terrenas"
 *        with those anchors, and each city page's restaurant-related copy
 *        links here.
 *
 * 4. SITEMAP — confirm the slug is emitted for en + es with hreflang
 *    alternates.
 *
 * 5. STUDIO — attach portfolio projects (any restaurant/hospitality work
 *    first) and upload a 1200x630 OG image (food photography performs best).
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seedRestaurantes.ts
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
// structuredData — INDUSTRY-scoped Service node. Replaces the auto-generated
// Service (getLandingGraph/mergeCustomNodes, same mechanics as the city
// pages). Instead of city geography, it declares WHO the service is for
// (audience: restaurants) and covers the whole country (areaServed: DO).
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

const restServiceEs = industryServiceNode({
  url: `${BASE}/es/paginas-web-para-restaurantes`,
  name: "Páginas Web para Restaurantes",
  serviceType: "Diseño de páginas web para restaurantes",
  description:
    "Diseño de páginas web para restaurantes en República Dominicana: menú digital, reservas por WhatsApp y pedidos directos sin comisiones de aplicaciones.",
  audienceType: "Restaurantes, cafeterías y food trucks",
})

const restServiceEn = industryServiceNode({
  url: `${BASE}/en/web-design-for-restaurants`,
  name: "Web Design for Restaurants",
  serviceType: "Restaurant website design",
  description:
    "Restaurant website design in the Dominican Republic: instant-loading digital menus, WhatsApp reservations and commission-free direct orders.",
  audienceType: "Restaurants, cafés and food trucks",
})

// ─────────────────────────────────────────────────────────────────────────────
// Restaurantes — industry landing page document
// Angle: the restaurant owner's three online pains, solved: (1) the menu is a
// blurry PDF or an Instagram highlight, (2) delivery apps take 20–30% of
// orders from customers who already know the restaurant, (3) tourist-zone
// restaurants lose diners who search in English. The recurring sitewide
// thread — direct sales, no commissions — is the spine of this page.
// ─────────────────────────────────────────────────────────────────────────────

const restaurantesPage: Record<string, unknown> = {
  _type: "landingPage",
  _id: "landingPage-paginas-web-para-restaurantes",
  title: "Páginas Web para Restaurantes (Industry Landing Page)",
  slug: { _type: "slug", current: "paginas-web-para-restaurantes" },

  // ── HERO ──────────────────────────────────────────────────────────────────
  hero: {
    headline: loc(
      "Web Design for Restaurants",
      "Páginas Web para Restaurantes",
    ),
    subheadline: loc(
      "Fast, bilingual restaurant websites that turn hungry Google searches into occupied tables — with your menu, your reservations and your orders under your control.",
      "Páginas web rápidas y bilingües que convierten búsquedas de Google con hambre en mesas ocupadas — con tu menú, tus reservas y tus pedidos bajo tu control.",
    ),
    primaryCta: loc("Get a Free Quote", "Solicitar Cotización Gratis"),
    primaryCtaHref: "/contact",
    secondaryCta: loc("View Our Portfolio", "Ver Nuestro Portafolio"),
    secondaryCtaHref: "/portfolio",
    badge: loc(
      "For restaurants, cafés and food trucks across the Dominican Republic",
      "Para restaurantes, cafeterías y food trucks en toda República Dominicana",
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
      "Everything a Restaurant Website Should Do",
      "Todo lo que la Página Web de un Restaurante Debe Hacer",
    ),
    sectionSubtitle: locBlocks(
      "Your customers decide where to eat with their phone in one hand. These are the three jobs your website has to win.",
      "Tus clientes deciden dónde comer con el celular en la mano. Estos son los tres trabajos que tu página web tiene que ganar.",
    ),
    items: [
      {
        _key: key(),
        icon: "UtensilsCrossed",
        title: loc(
          "A Digital Menu that Loads Instantly",
          "Un Menú Digital que Carga al Instante",
        ),
        description: locBlocks(
          "No more blurry PDFs or outdated Instagram highlights. A real menu page with photos, prices and categories — that loads in under two seconds and that you update yourself, any time a price or dish changes.",
          "Se acabaron los PDFs borrosos y las historias destacadas desactualizadas. Una página de menú real con fotos, precios y categorías — que carga en menos de dos segundos y que tú mismo actualizas cada vez que cambia un precio o un plato.",
        ),
        linkSlug: "custom-websites",
      },
      {
        _key: key(),
        icon: "CalendarCheck",
        title: loc(
          "Direct Reservations & Orders",
          "Reservas y Pedidos Directos",
        ),
        description: locBlocks(
          "Delivery apps take 20–30% of every order — including from regulars who already know you. Your own site takes reservations and orders by WhatsApp with one tap, commission-free.",
          "Las aplicaciones de delivery se llevan un 20–30% de cada pedido — incluso de clientes fieles que ya te conocen. Tu propia página recibe reservas y pedidos por WhatsApp con un toque, sin comisiones.",
        ),
        linkSlug: "landing-pages",
      },
      {
        _key: key(),
        icon: "Languages",
        title: loc(
          "Bilingual for Tourists & Locals",
          "Bilingüe para Turistas y Locales",
        ),
        description: locBlocks(
          "In tourist zones like Punta Cana and Las Terrenas, half your tables search in English. Every site ships in Spanish and English, so no diner bounces because they couldn't read the menu.",
          "En zonas turísticas como Punta Cana y Las Terrenas, la mitad de tus mesas busca en inglés. Cada sitio se entrega en español e inglés, para que ningún comensal se vaya por no poder leer el menú.",
        ),
        linkSlug: "ecommerce",
      },
    ],
  },

  // ── WHY CHOOSE US ─────────────────────────────────────────────────────────
  whyUs: {
    sectionTitle: loc(
      "Why Restaurants Choose Us",
      "Por Qué los Restaurantes Nos Eligen",
    ),
    sectionSubtitle: locBlocks(
      "A restaurant website has one job: fill tables. Every decision below serves it.",
      "La página web de un restaurante tiene un solo trabajo: llenar mesas. Cada decisión de abajo lo sirve.",
    ),
    items: [
      {
        _key: key(),
        icon: "Search",
        title: loc(
          "Found for 'Restaurant Near Me'",
          "Aparece en 'Restaurante Cerca de Mí'",
        ),
        description: locBlocks(
          "Local SEO built in — optimized titles, structured data your cuisine and hours included — plus guidance to set up your Google Business Profile, so you show up in Maps when hungry people search.",
          "SEO local integrado — títulos optimizados y datos estructurados con tu cocina y horarios — más orientación para configurar tu Perfil de Negocio de Google, para que aparezcas en Maps cuando alguien busca con hambre.",
        ),
      },
      {
        _key: key(),
        icon: "Zap",
        title: loc("Fast on Mobile Data", "Rápida en Datos Móviles"),
        description: locBlocks(
          "Diners check your menu from the street, on cellular data. Our Next.js sites load in under two seconds — a menu that takes ten seconds to open is a customer walking next door.",
          "Los comensales revisan tu menú desde la calle, con datos móviles. Nuestros sitios en Next.js cargan en menos de dos segundos — un menú que tarda diez segundos en abrir es un cliente entrando al local de al lado.",
        ),
      },
      {
        _key: key(),
        icon: "MessageSquare",
        title: loc(
          "WhatsApp Reservations, One Tap",
          "Reservas por WhatsApp, con Un Toque",
        ),
        description: locBlocks(
          "Dominicans reserve by WhatsApp — so we put the button where thumbs land: menu, hours, location and reserve, all one tap from the first screen.",
          "En República Dominicana se reserva por WhatsApp — por eso ponemos el botón donde cae el pulgar: menú, horarios, ubicación y reservar, todo a un toque desde la primera pantalla.",
        ),
      },
      {
        _key: key(),
        icon: "Star",
        title: loc(
          "Your Reviews, Working for You",
          "Tus Reseñas, Trabajando para Ti",
        ),
        description: locBlocks(
          "We showcase your Google reviews and ratings on the site and connect your Maps profile — because for restaurants, social proof is the deciding vote.",
          "Mostramos tus reseñas y calificación de Google en el sitio y conectamos tu perfil de Maps — porque en los restaurantes, la prueba social es el voto decisivo.",
        ),
      },
    ],
  },

  // ── PROCESS STEPS (the real 5-step process from your live landing pages) ──
  process: {
    sectionTitle: loc("How We Work", "Cómo Trabajamos"),
    sectionSubtitle: locBlocks(
      "A clear, structured process from first call to launch — without taking you away from service.",
      "Un proceso claro y estructurado desde la primera llamada hasta el lanzamiento — sin sacarte del servicio.",
    ),
    steps: [
      {
        _key: key(),
        number: 1,
        icon: "MessageCircle",
        stepTitle: loc("Discovery & Planning", "Descubrimiento y Planificación"),
        description: locBlocks(
          "We learn about your restaurant, your menu and your customers. You complete our project questionnaire and we define the full scope, sitemap and timeline together.",
          "Conocemos tu restaurante, tu menú y tus clientes. Completas nuestro cuestionario de proyecto y juntos definimos el alcance, mapa del sitio y cronograma.",
        ),
        duration: loc("3–5 days", "3–5 días"),
      },
      {
        _key: key(),
        number: 2,
        icon: "Palette",
        stepTitle: loc("Design & Prototyping", "Diseño y Prototipado"),
        description: locBlocks(
          "We create a custom visual design that matches your restaurant's personality. You review the design and we refine it across two revision rounds until it's perfect.",
          "Creamos un diseño visual personalizado que refleja la personalidad de tu restaurante. Revisas el diseño y lo refinamos en dos rondas de revisión hasta que quede perfecto.",
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
          "We build your site with Next.js and connect it to Sanity CMS so you can update dishes, prices and hours yourself — no developer needed for a menu change. SEO, performance and responsive design are built in.",
          "Construimos tu sitio con Next.js y lo conectamos a Sanity CMS para que actualices platos, precios y horarios tú mismo — sin necesitar un desarrollador para cambiar el menú. SEO, rendimiento y diseño responsivo vienen integrados.",
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
    // Attach real `project` references in Studio (max 3). If you have any
    // restaurant or food-related work, it goes first here — on an industry
    // page, matching-industry proof outweighs your overall best work.
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
      "What restaurant owners ask us most.",
      "Lo que más nos preguntan los dueños de restaurantes.",
    ),
    items: [
      {
        _key: key(),
        question: loc(
          "How much does a restaurant website cost?",
          "¿Cuánto cuesta una página web para mi restaurante?",
        ),
        // Figures verified against your live landing pages (July 2026).
        answer: locBlocks(
          "Pricing starts at $400 USD for a landing page with your menu, hours and WhatsApp reservations, and $950 for a complete restaurant website — 50% upfront, 50% on delivery, with no hidden fees and no monthly platform charges.",
          "Los precios comienzan en $400 USD para una landing page con tu menú, horarios y reservas por WhatsApp, y $950 para un sitio web completo de restaurante — 50% al inicio y 50% al entregar, sin costos ocultos ni cuotas mensuales de plataforma.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Can I update the menu and prices myself?",
          "¿Puedo actualizar el menú y los precios yo mismo?",
        ),
        answer: locBlocks(
          "Yes — that's the point of the CMS we set up. Change a price, add a dish, mark something sold out or update your hours from your phone, no developer required. We train you (and your team) before launch.",
          "Sí — para eso configuramos el CMS. Cambia un precio, agrega un plato, marca algo agotado o actualiza tus horarios desde tu celular, sin necesitar un desarrollador. Te capacitamos (a ti y a tu equipo) antes del lanzamiento.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Does it work for orders and delivery?",
          "¿Funciona para pedidos y delivery?",
        ),
        answer: locBlocks(
          "Yes. Standard on every site: order and reservation flows through WhatsApp, where your customers already are. If your volume justifies it, we can integrate online ordering or payment systems — the goal is that orders from customers who already know you stop costing you 20–30% in app commissions.",
          "Sí. Estándar en cada sitio: flujos de pedidos y reservas por WhatsApp, donde ya están tus clientes. Si tu volumen lo justifica, podemos integrar sistemas de pedidos o pagos en línea — la meta es que los pedidos de clientes que ya te conocen dejen de costarte un 20–30% en comisiones de aplicaciones.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Will my menu be in English for tourists?",
          "¿Mi menú estará en inglés para los turistas?",
        ),
        answer: locBlocks(
          "Every site we build is fully bilingual — Spanish and English — including your menu, at no extra platform cost. For restaurants in tourist zones, the English version is structured to rank for searches like 'best restaurant near me'.",
          "Cada sitio que construimos es completamente bilingüe — español e inglés — incluyendo tu menú, sin costo adicional de plataforma. Para restaurantes en zonas turísticas, la versión en inglés se estructura para posicionar en búsquedas de visitantes.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "How long until my website is live?",
          "¿En cuánto tiempo estará lista mi página web?",
        ),
        answer: locBlocks(
          "A landing page with your menu and reservations takes 2–3 weeks; a complete restaurant website takes 6–8 weeks. You'll receive a detailed timeline during the discovery phase.",
          "Una landing page con tu menú y reservas toma 2–3 semanas; un sitio web completo de restaurante toma 6–8 semanas. Recibirás un cronograma detallado durante la fase de descubrimiento.",
        ),
      },
    ],
  },

  // ── STRUCTURED DATA (industry-scoped Service — replaces the auto one) ─────
  structuredData: { en: restServiceEn, es: restServiceEs },
}

// ─────────────────────────────────────────────────────────────────────────────
// seo document (metadata)
// ─────────────────────────────────────────────────────────────────────────────

const restaurantesSeo = {
  _type: "seo",
  _id: "seo-paginas-web-para-restaurantes",
  pageName: "paginas-web-para-restaurantes",
  meta: {
    en: {
      title: "Restaurant Web Design Dominican Republic | DR Web Studio",
      description:
        "Restaurant website design in the Dominican Republic: instant-loading digital menus, WhatsApp reservations and commission-free direct orders. Free quotes.",
      keywords: [
        "restaurant website design dominican republic",
        "restaurant web design punta cana",
        "digital menu website",
      ],
    },
    es: {
      title: "Diseño de Páginas Web para Restaurantes | DR Web Studio",
      description:
        "Diseño de páginas web para restaurantes en República Dominicana: menú digital, reservas por WhatsApp y pedidos directos sin comisiones. Cotización gratis.",
      keywords: [
        "páginas web para restaurantes",
        "diseño web restaurantes",
        "página web para mi restaurante",
        "menú digital república dominicana",
        "diseño de páginas web para restaurantes",
      ],
    },
  },
  openGraph: {
    en: {
      title: "Restaurant Websites — Fill More Tables, Pay Fewer Commissions",
      description:
        "Fast, bilingual restaurant websites with digital menus, WhatsApp reservations and direct orders. Built in the Dominican Republic. Free quotes.",
    },
    es: {
      title:
        "Páginas Web para Restaurantes — Llena Más Mesas, Paga Menos Comisiones",
      description:
        "Páginas web rápidas y bilingües con menú digital, reservas por WhatsApp y pedidos directos. Creadas en República Dominicana. Cotización gratis.",
    },
    // image: upload in Studio (1200x630 — food photography performs best)
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
    restaurantesPage as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded landing page: paginas-web-para-restaurantes")

  await client.createOrReplace(
    restaurantesSeo as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded SEO doc: paginas-web-para-restaurantes")

  console.log("")
  console.log("Next steps: see the header comment (seo.ts dropdown option,")
  console.log("ES + EN routes, city↔industry cross-links, sitemap check).")
}

seed().catch(console.error)
