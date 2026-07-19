/**
 * Seed script — La Romana ONLY
 *
 * Creates the bilingual (en/es) landing page document AND its seo document for:
 *   slug "diseno-de-paginas-web-la-romana"
 *   → target: "diseño de páginas web en La Romana" / "diseño web La Romana"
 *
 * Does NOT touch the Santo Domingo or Santiago documents.
 * Idempotent: safe to run repeatedly (createOrReplace) — but note it will
 * overwrite any edits made to these two La Romana documents in Studio.
 *
 * ── AFTER SEEDING ───────────────────────────────────────────────────────────
 *
 * 1. seo.ts — add this option to the pageName dropdown list:
 *      {
 *        title: "Diseño de Páginas Web La Romana (Landing)",
 *        value: "diseno-de-paginas-web-la-romana",
 *      },
 *
 * 2. ROUTE — create, mirroring an existing landing page route:
 *      src/app/(root)/[lang]/diseno-de-paginas-web-la-romana/page.tsx
 *    fetching with getLandingPage("diseno-de-paginas-web-la-romana", lang).
 *
 * 3. INTERNAL LINKS — one contextual link from the national hub
 *    /es/diseno-web-republica-dominicana with anchor
 *    "diseño de páginas web en La Romana"; from this page, one link back to
 *    the hub and one to /es (anchor "desarrollo web en República Dominicana").
 *    Your Bávaro / Las Terrenas tourism blog posts are the most natural posts
 *    to link here.
 *
 * 4. SITEMAP — confirm the slug is emitted for en + es with hreflang
 *    alternates, and verify the EN URLs inside the structuredData below if
 *    your English route uses a translated slug.
 *
 * 5. STUDIO — attach portfolio projects (lead with Punta Cana Tour Store and
 *    Grand Bay of the Sea) and upload a 1200x630 OG image.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seedLaRomana.ts
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

const lrAreas = [
  { "@type": "City", name: "La Romana" },
  { "@type": "AdministrativeArea", name: "Provincia La Romana" },
  { "@type": "City", name: "Bayahibe" },
  { "@type": "Place", name: "Casa de Campo" },
]

const lrCityServiceEs = serviceNode({
  url: `${BASE}/es/diseno-de-paginas-web-la-romana`,
  name: "Diseño de Páginas Web en La Romana",
  serviceType: "Diseño y desarrollo de páginas web",
  description:
    "Diseño de páginas web bilingües para hoteles, tours, villas y negocios en La Romana, Casa de Campo y Bayahibe, República Dominicana.",
  areaServed: lrAreas,
})

const lrCityServiceEn = serviceNode({
  url: `${BASE}/en/diseno-de-paginas-web-la-romana`,
  name: "Web Design in La Romana",
  serviceType: "Web design and development",
  description:
    "Bilingual web design for hotels, tours, villas and businesses in La Romana, Casa de Campo and Bayahibe, Dominican Republic.",
  areaServed: lrAreas,
})

// ─────────────────────────────────────────────────────────────────────────────
// La Romana — landing page document
// Angle: the eastern tourism corridor — and our own backyard (Punta Cana is
// under an hour away). Audience: tour/excursion operators (Saona, Bayahibe),
// villa rentals and real estate (Casa de Campo), hotels, restaurants and
// local commerce serving both visitors and romanenses.
// ─────────────────────────────────────────────────────────────────────────────

const laRomanaPage: Record<string, unknown> = {
  _type: "landingPage",
  _id: "landingPage-diseno-paginas-web-la-romana",
  title: "Diseño de Páginas Web en La Romana (City Landing Page)",
  slug: { _type: "slug", current: "diseno-de-paginas-web-la-romana" },

  // ── HERO ──────────────────────────────────────────────────────────────────
  hero: {
    headline: loc(
      "Web Design in La Romana",
      "Diseño de Páginas Web en La Romana",
    ),
    subheadline: loc(
      "Fast, bilingual websites for hotels, tours, villas and businesses in La Romana, Casa de Campo and Bayahibe — built to turn visitors into bookings.",
      "Páginas web rápidas y bilingües para hoteles, tours, villas y negocios de La Romana, Casa de Campo y Bayahibe — hechas para convertir visitantes en reservas.",
    ),
    primaryCta: loc("Get a Free Quote", "Solicitar Cotización Gratis"),
    primaryCtaHref: "/contact",
    secondaryCta: loc("View Our Portfolio", "Ver Nuestro Portafolio"),
    secondaryCtaHref: "/portfolio",
    badge: loc(
      "Based in Punta Cana — serving La Romana, Casa de Campo, Bayahibe and Dominicus",
      "Con base en Punta Cana — atendemos La Romana, Casa de Campo, Bayahibe y Dominicus",
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
      "Web Design for La Romana's Tourism Economy",
      "Diseño de Páginas Web para la Economía Turística de La Romana",
    ),
    sectionSubtitle: locBlocks(
      "From Casa de Campo villas to Bayahibe dive boats — La Romana runs on visitors, and your website is the first thing they see.",
      "Desde las villas de Casa de Campo hasta los botes de buceo de Bayahibe — La Romana vive del visitante, y tu página web es lo primero que ve.",
    ),
    items: [
      {
        _key: key(),
        icon: "Ship",
        title: loc(
          "Tour & Excursion Websites",
          "Páginas Web para Tours y Excursiones",
        ),
        description: locBlocks(
          "Booking-ready sites for Saona Island trips, catamarans, dive shops and buggy tours — with one-tap WhatsApp inquiries and the speed tourists on roaming data need.",
          "Sitios listos para reservas para excursiones a Isla Saona, catamaranes, escuelas de buceo y buggies — con consultas por WhatsApp de un toque y la velocidad que necesitan turistas con datos de roaming.",
        ),
        linkSlug: "landing-pages",
      },
      {
        _key: key(),
        icon: "Home",
        title: loc(
          "Villa Rental & Real Estate Websites",
          "Sitios Web para Villas y Bienes Raíces",
        ),
        description: locBlocks(
          "Photo-first websites for Casa de Campo villas and vacation rentals: fast galleries, availability inquiries and the polish a luxury property deserves.",
          "Sitios web centrados en fotografía para villas de Casa de Campo y alquileres vacacionales: galerías rápidas, consultas de disponibilidad y el acabado que merece una propiedad de lujo.",
        ),
        linkSlug: "custom-websites",
      },
      {
        _key: key(),
        icon: "UtensilsCrossed",
        title: loc(
          "Restaurants, Hotels & Local Commerce",
          "Restaurantes, Hoteles y Comercio Local",
        ),
        description: locBlocks(
          "Menus that load instantly, reservation and ordering flows, and online stores for local shops — built for both the visitor market and romanense customers.",
          "Menús que cargan al instante, flujos de reservas y pedidos, y tiendas online para comercios locales — hechos tanto para el mercado visitante como para el cliente romanense.",
        ),
        linkSlug: "ecommerce",
      },
    ],
  },

  // ── WHY CHOOSE US ─────────────────────────────────────────────────────────
  whyUs: {
    sectionTitle: loc(
      "Why La Romana Businesses Choose Us",
      "Por Qué los Negocios de La Romana Nos Eligen",
    ),
    sectionSubtitle: locBlocks(
      "We build for tourism because we live in it.",
      "Construimos para el turismo porque vivimos en él.",
    ),
    items: [
      {
        _key: key(),
        icon: "MapPin",
        title: loc("Your Neighbor in the East", "Tu Vecino en la Región Este"),
        description: locBlocks(
          "We're based in Punta Cana, under an hour up the coast. We know the eastern tourism corridor — its seasons, its visitors, its businesses — because we work and live in it.",
          "Estamos en Punta Cana, a menos de una hora por la costa. Conocemos el corredor turístico del Este — sus temporadas, sus visitantes, sus negocios — porque trabajamos y vivimos en él.",
        ),
      },
      {
        _key: key(),
        icon: "Languages",
        title: loc(
          "English-First for Tourists",
          "Inglés Primero para Turistas",
        ),
        description: locBlocks(
          "Your visitors search in English before they ever land. Every site ships fully bilingual, with the English version built as a first-class citizen — not an afterthought.",
          "Tus visitantes buscan en inglés antes de aterrizar. Cada sitio se entrega completamente bilingüe, con la versión en inglés construida como protagonista — no como algo secundario.",
        ),
      },
      {
        _key: key(),
        icon: "CalendarCheck",
        title: loc("Built to Win Bookings", "Hechos para Ganar Reservas"),
        description: locBlocks(
          "Tourists decide in seconds on their phones. We design for that moment: instant load, clear prices, and one-tap WhatsApp booking.",
          "Los turistas deciden en segundos desde su celular. Diseñamos para ese momento: carga instantánea, precios claros y reserva por WhatsApp con un toque.",
        ),
      },
      {
        _key: key(),
        icon: "Search",
        title: loc("Found Before the Flight", "Te Encuentran Antes del Vuelo"),
        description: locBlocks(
          "SEO built to capture travelers searching for Saona excursions or Casa de Campo villa rentals months before their trip — and locals searching in Spanish.",
          "SEO hecho para captar viajeros que buscan excursiones a Saona o alquiler de villas en Casa de Campo meses antes de su viaje — y a locales que buscan en español.",
        ),
      },
    ],
  },

  // ── PROCESS STEPS (the real 5-step process from your live landing pages) ──
  process: {
    sectionTitle: loc("How We Work", "Cómo Trabajamos"),
    sectionSubtitle: locBlocks(
      "A clear, structured process from first call to launch — timed around your high season, not against it.",
      "Un proceso claro y estructurado desde la primera llamada hasta el lanzamiento — planificado alrededor de tu temporada alta, no en su contra.",
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
          "We learn about your business, your seasons and your booking flow. You complete our project questionnaire and we define the full scope, sitemap and timeline together.",
          "Conocemos tu negocio, tus temporadas y tu flujo de reservas. Completas nuestro cuestionario de proyecto y juntos definimos el alcance, mapa del sitio y cronograma.",
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
      "Websites we've built for tourism and hospitality businesses in the East.",
      "Páginas web que hemos creado para negocios de turismo y hospitalidad en el Este.",
    ),
    // Attach real `project` references in Studio (max 3). Lead with your
    // tourism work — Punta Cana Tour Store and Grand Bay of the Sea are the
    // most persuasive proof for this audience.
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
      "What La Romana business owners ask us most.",
      "Lo que más nos preguntan los dueños de negocios en La Romana.",
    ),
    items: [
      {
        _key: key(),
        question: loc(
          "How much does a website cost in La Romana?",
          "¿Cuánto cuesta una página web en La Romana?",
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
          "Do you build websites for tours, villas and hotels in Casa de Campo and Bayahibe?",
          "¿Hacen páginas web para tours, villas y hoteles en Casa de Campo y Bayahibe?",
        ),
        answer: locBlocks(
          "Yes — tourism and hospitality are our home turf. We've built sites for tour operators and hospitality businesses in the East, with booking inquiries via WhatsApp, photo-heavy galleries that stay fast, and layouts designed around how travelers actually browse.",
          "Sí — el turismo y la hospitalidad son nuestro terreno. Hemos creado sitios para operadores de tours y negocios de hospitalidad en el Este, con reservas por WhatsApp, galerías llenas de fotos que siguen siendo rápidas y diseños pensados en cómo navegan realmente los viajeros.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Can my website be in English for international visitors?",
          "¿Mi página web puede estar en inglés para visitantes internacionales?",
        ),
        answer: locBlocks(
          "Every site we build is fully bilingual — Spanish and English — at no extra platform cost. For tourism businesses we structure the English version to rank internationally, so travelers find you while planning their trip.",
          "Cada sitio que construimos es completamente bilingüe — español e inglés — sin costo adicional de plataforma. Para negocios turísticos estructuramos la versión en inglés para posicionar internacionalmente, y que los viajeros te encuentren mientras planifican su viaje.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Are you close to La Romana?",
          "¿Están cerca de La Romana?",
        ),
        answer: locBlocks(
          "Yes — we're based in Punta Cana, under an hour away on the same eastern coast. The process runs remotely by video call and WhatsApp, which keeps it fast and convenient, but you're working with a neighbor who knows your market, not a distant agency.",
          "Sí — estamos en Punta Cana, a menos de una hora por la misma costa del Este. El proceso se realiza de forma remota por videollamada y WhatsApp, lo que lo hace rápido y conveniente, pero trabajas con un vecino que conoce tu mercado, no con una agencia distante.",
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

  // ── STRUCTURED DATA (city-scoped Service — see note above serviceNode) ────
  structuredData: { en: lrCityServiceEn, es: lrCityServiceEs },
}

// ─────────────────────────────────────────────────────────────────────────────
// seo document (metadata) — same content as seedCitySeo.ts's La Romana entry
// ─────────────────────────────────────────────────────────────────────────────

const laRomanaSeo = {
  _type: "seo",
  _id: "seo-diseno-de-paginas-web-la-romana",
  pageName: "diseno-de-paginas-web-la-romana",
  meta: {
    en: {
      title: "Web Design in La Romana, Dominican Republic | DR Web Studio",
      description:
        "Bilingual web design for hotels, tours, villas and businesses in La Romana, Casa de Campo and Bayahibe. Fast, Google-optimized sites built for bookings.",
      keywords: [
        "web design la romana dominican republic",
        "website design casa de campo",
        "web design bayahibe",
        "tour operator website dominican republic",
      ],
    },
    es: {
      title: "Diseño de Páginas Web en La Romana | DR Web Studio",
      description:
        "Diseño de páginas web bilingües para hoteles, tours, villas y negocios en La Romana y Bayahibe. Rápidas, optimizadas para Google y hechas para reservas.",
      keywords: [
        "diseño de páginas web en la romana",
        "diseño web la romana",
        "páginas web la romana",
        "diseño web bayahibe",
        "desarrollo web la romana",
      ],
    },
  },
  openGraph: {
    en: {
      title: "Web Design in La Romana — Bilingual Sites Built for Bookings",
      description:
        "Websites for tours, villas, hotels and restaurants in La Romana, Casa de Campo and Bayahibe. Built by your neighbors in Punta Cana. Get a free quote.",
    },
    es: {
      title:
        "Diseño de Páginas Web en La Romana — Bilingües y Hechas para Reservas",
      description:
        "Páginas web para tours, villas, hoteles y restaurantes en La Romana, Casa de Campo y Bayahibe. Creadas por tus vecinos en Punta Cana. Cotización gratis.",
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
    laRomanaPage as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded landing page: diseno-de-paginas-web-la-romana")

  await client.createOrReplace(
    laRomanaSeo as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded SEO doc: diseno-de-paginas-web-la-romana")

  console.log("")
  console.log("Next steps: see the header comment (seo.ts dropdown option,")
  console.log("route folder, internal links, sitemap check, Studio tasks).")
}

seed().catch(console.error)
