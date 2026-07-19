/**
 * Seed script — Puerto Plata ONLY
 *
 * Creates the bilingual (en/es) landing page document AND its seo document for:
 *   slug "diseno-de-paginas-web-puerto-plata"
 *   → target: "diseño de páginas web en Puerto Plata" / "diseño web Puerto
 *             Plata" / "diseño web Sosúa" / "diseño web Cabarete" /
 *             "web design puerto plata / cabarete" (EN matters a lot here)
 *
 * Does NOT touch the other city documents.
 * Idempotent: safe to run repeatedly (createOrReplace) — but note it will
 * overwrite any edits made to these two Puerto Plata documents in Studio.
 *
 * NOTE: Sosúa and Cabarete are deliberately covered INSIDE this page (badge,
 * services, FAQ, areaServed) rather than as separate pages — they don't have
 * the volume to justify their own, and splitting them would dilute this one.
 *
 * ── AFTER SEEDING ───────────────────────────────────────────────────────────
 *
 * 1. seo.ts — add this option to the pageName dropdown list:
 *      {
 *        title: "Diseño de Páginas Web Puerto Plata (Landing)",
 *        value: "diseno-de-paginas-web-puerto-plata",
 *      },
 *
 * 2. ROUTE — create, mirroring an existing landing page route:
 *      src/app/(root)/[lang]/diseno-de-paginas-web-puerto-plata/page.tsx
 *    fetching with getLandingPage("diseno-de-paginas-web-puerto-plata", lang).
 *
 * 3. INTERNAL LINKS — one contextual link from the national hub
 *    /es/diseno-web-republica-dominicana with anchor
 *    "diseño de páginas web en Puerto Plata"; from this page, one link back
 *    to the hub and one to /es (anchor "desarrollo web en República
 *    Dominicana"). Cross-link once with the Punta Cana and La Romana pages —
 *    the three tourism-economy pages reinforce each other.
 *
 * 4. SITEMAP — confirm the slug is emitted for en + es with hreflang
 *    alternates, and verify the EN URLs inside the structuredData below if
 *    your English route uses a translated slug.
 *
 * 5. STUDIO — attach portfolio projects (tourism work first: Punta Cana Tour
 *    Store, Grand Bay of the Sea) and upload a 1200x630 OG image.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seedPuertoPlata.ts
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

const ppAreas = [
  { "@type": "City", name: "Puerto Plata" },
  { "@type": "AdministrativeArea", name: "Provincia Puerto Plata" },
  { "@type": "City", name: "Sosúa" },
  { "@type": "City", name: "Cabarete" },
  { "@type": "Place", name: "Cofresí" },
]

const ppCityServiceEs = serviceNode({
  url: `${BASE}/es/diseno-de-paginas-web-puerto-plata`,
  name: "Diseño de Páginas Web en Puerto Plata",
  serviceType: "Diseño y desarrollo de páginas web",
  description:
    "Diseño de páginas web bilingües para tours, escuelas, restaurantes y bienes raíces en Puerto Plata, Sosúa y Cabarete, República Dominicana.",
  areaServed: ppAreas,
})

const ppCityServiceEn = serviceNode({
  url: `${BASE}/en/diseno-de-paginas-web-puerto-plata`,
  name: "Web Design in Puerto Plata",
  serviceType: "Web design and development",
  description:
    "Bilingual web design for tours, schools, restaurants and real estate in Puerto Plata, Sosúa and Cabarete, Dominican Republic.",
  areaServed: ppAreas,
})

// ─────────────────────────────────────────────────────────────────────────────
// Puerto Plata — landing page document
// Angle: the north coast — a tourism economy with three markets none of the
// other pages own: (1) cruise excursions (Amber Cove + Taino Bay passengers
// book online BEFORE the ship docks), (2) the Cabarete kite/surf/dive school
// scene booking international students from abroad, (3) the Sosúa–Cabarete
// expat business and real estate corridor — owners who read this page in
// ENGLISH and want a developer they can work with in English.
// ─────────────────────────────────────────────────────────────────────────────

const puertoPlataPage: Record<string, unknown> = {
  _type: "landingPage",
  _id: "landingPage-diseno-paginas-web-puerto-plata",
  title: "Diseño de Páginas Web en Puerto Plata (City Landing Page)",
  slug: { _type: "slug", current: "diseno-de-paginas-web-puerto-plata" },

  // ── HERO ──────────────────────────────────────────────────────────────────
  hero: {
    headline: loc(
      "Web Design in Puerto Plata",
      "Diseño de Páginas Web en Puerto Plata",
    ),
    subheadline: loc(
      "Fast, bilingual websites for the north coast's tours, schools, restaurants and real estate — built to capture international visitors, in a process you can run entirely in English or Spanish.",
      "Páginas web rápidas y bilingües para los tours, escuelas, restaurantes y bienes raíces de la Costa Norte — hechas para captar al visitante internacional, con un proceso que puedes llevar completamente en inglés o español.",
    ),
    primaryCta: loc("Get a Free Quote", "Solicitar Cotización Gratis"),
    primaryCtaHref: "/contact",
    secondaryCta: loc("View Our Portfolio", "Ver Nuestro Portafolio"),
    secondaryCtaHref: "/portfolio",
    badge: loc(
      "Serving Puerto Plata, Sosúa, Cabarete and the whole north coast",
      "Atendemos Puerto Plata, Sosúa, Cabarete y toda la Costa Norte",
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
      "Websites for the North Coast's Businesses",
      "Páginas Web para los Negocios de la Costa Norte",
    ),
    sectionSubtitle: locBlocks(
      "Cruise passengers, kite students and property buyers all have one thing in common: they found their pick online before they ever arrived.",
      "Los cruceristas, los estudiantes de kite y los compradores de propiedades tienen algo en común: eligieron en línea antes de llegar.",
    ),
    items: [
      {
        _key: key(),
        icon: "Sailboat",
        title: loc(
          "Cruise Excursions & Tours",
          "Excursiones para Cruceristas y Tours",
        ),
        description: locBlocks(
          "Amber Cove and Taino Bay passengers book their shore excursions online weeks before docking. A fast, booking-ready site with English SEO puts your tour in front of them first — direct, without marketplace commissions.",
          "Los pasajeros de Amber Cove y Taino Bay reservan sus excursiones en línea semanas antes de atracar. Un sitio rápido y listo para reservas, con SEO en inglés, pone tu tour frente a ellos primero — directo, sin comisiones de plataformas.",
        ),
        linkSlug: "landing-pages",
      },
      {
        _key: key(),
        icon: "Wind",
        title: loc(
          "Kite, Surf & Dive Schools",
          "Escuelas de Kite, Surf y Buceo",
        ),
        description: locBlocks(
          "Cabarete's students book from Germany, Canada and the US months ahead. We build school sites with clear course pages, pricing and inquiry flows that convert international browsers into booked lessons.",
          "Los estudiantes de Cabarete reservan desde Alemania, Canadá y EE. UU. con meses de anticipación. Creamos sitios para escuelas con páginas de cursos claras, precios y flujos de consulta que convierten navegantes internacionales en clases reservadas.",
        ),
        linkSlug: "custom-websites",
      },
      {
        _key: key(),
        icon: "Store",
        title: loc(
          "Restaurants, Rentals & Local Businesses",
          "Restaurantes, Alquileres y Negocios Locales",
        ),
        description: locBlocks(
          "From Sosúa restaurants to Cabarete vacation rentals and Puerto Plata shops: bilingual sites with instant-loading menus and galleries, WhatsApp contact, and online ordering where it fits.",
          "Desde restaurantes en Sosúa hasta alquileres vacacionales en Cabarete y comercios en Puerto Plata: sitios bilingües con menús y galerías que cargan al instante, contacto por WhatsApp y pedidos en línea donde aplique.",
        ),
        linkSlug: "ecommerce",
      },
    ],
  },

  // ── WHY CHOOSE US ─────────────────────────────────────────────────────────
  whyUs: {
    sectionTitle: loc(
      "Why North Coast Businesses Choose Us",
      "Por Qué los Negocios de la Costa Norte Nos Eligen",
    ),
    sectionSubtitle: locBlocks(
      "A coast full of international owners and international customers needs a developer fluent in both.",
      "Una costa llena de dueños y clientes internacionales necesita un desarrollador que hable con ambos.",
    ),
    items: [
      {
        _key: key(),
        icon: "Globe",
        title: loc(
          "Run the Whole Project in English",
          "Todo el Proyecto en Inglés o Español",
        ),
        description: locBlocks(
          "Many north coast business owners are expats — so everything from the first call to training and support is available in English or Spanish, whichever you prefer. No translation friction, ever.",
          "Muchos dueños de negocios en la Costa Norte son extranjeros — por eso todo, desde la primera llamada hasta la capacitación y el soporte, está disponible en inglés o español, como prefieras. Sin fricción de idioma, nunca.",
        ),
      },
      {
        _key: key(),
        icon: "Anchor",
        title: loc("Win Cruise-Day Bookings", "Gana las Reservas del Crucero"),
        description: locBlocks(
          "Shore excursions are decided online before the ship arrives. We build the fast pages and pre-trip SEO that get your business into that decision — while competitors wait at the port.",
          "Las excursiones se deciden en línea antes de que llegue el barco. Construimos las páginas rápidas y el SEO previo al viaje que meten tu negocio en esa decisión — mientras la competencia espera en el puerto.",
        ),
      },
      {
        _key: key(),
        icon: "Video",
        title: loc(
          "Remote by Design, Nationwide",
          "Remotos por Diseño, en Todo el País",
        ),
        description: locBlocks(
          "We serve the north coast from Punta Cana the same way we serve every region: video calls, WhatsApp and email on your schedule, with the same developer from start to finish.",
          "Atendemos la Costa Norte desde Punta Cana igual que a todas las regiones: videollamadas, WhatsApp y correo según tu horario, con el mismo desarrollador de principio a fin.",
        ),
      },
      {
        _key: key(),
        icon: "Award",
        title: loc(
          "Tourism Is Our Specialty",
          "El Turismo Es Nuestra Especialidad",
        ),
        description: locBlocks(
          "We're based in the country's biggest tourism zone and our portfolio shows it — tour operators and hospitality businesses with results like 150% sales growth.",
          "Tenemos base en la zona turística más grande del país y nuestro portafolio lo demuestra — operadores de tours y negocios de hospitalidad con resultados como un 150% de crecimiento en ventas.",
        ),
      },
    ],
  },

  // ── PROCESS STEPS (the real 5-step process from your live landing pages) ──
  process: {
    sectionTitle: loc("How We Work", "Cómo Trabajamos"),
    sectionSubtitle: locBlocks(
      "A clear, structured process from first call to launch — in the language you prefer.",
      "Un proceso claro y estructurado desde la primera llamada hasta el lanzamiento — en el idioma que prefieras.",
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
          "We learn about your business, your seasons and your customers. You complete our project questionnaire and we define the full scope, sitemap and timeline together.",
          "Conocemos tu negocio, tus temporadas y tus clientes. Completas nuestro cuestionario de proyecto y juntos definimos el alcance, mapa del sitio y cronograma.",
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
          "We build your site with Next.js and connect it to Sanity CMS so you can update tours, courses, menus or listings yourself. SEO, performance and responsive design are built in.",
          "Construimos tu sitio con Next.js y lo conectamos a Sanity CMS para que actualices tours, cursos, menús o propiedades tú mismo. SEO, rendimiento y diseño responsivo vienen integrados.",
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
    // Attach real `project` references in Studio (max 3). Tourism work first —
    // Punta Cana Tour Store and Grand Bay of the Sea.
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
      "What north coast business owners ask us most.",
      "Lo que más nos preguntan los dueños de negocios en la Costa Norte.",
    ),
    items: [
      {
        _key: key(),
        question: loc(
          "How much does a website cost in Puerto Plata?",
          "¿Cuánto cuesta una página web en Puerto Plata?",
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
          "I'm an expat business owner — can we do the whole project in English?",
          "Soy dueño extranjero de un negocio — ¿podemos hacer todo el proyecto en inglés?",
        ),
        answer: locBlocks(
          "Absolutely — consultation, contracts, design reviews, training and ongoing support all happen in English if you prefer, and your finished site ships in both English and Spanish so you serve every customer.",
          "Por supuesto — la consulta, los acuerdos, las revisiones de diseño, la capacitación y el soporte continuo se hacen en inglés si lo prefieres, y tu sitio terminado se entrega en inglés y español para atender a todos tus clientes.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Can my site capture cruise passengers from Amber Cove and Taino Bay?",
          "¿Mi sitio puede captar cruceristas de Amber Cove y Taino Bay?",
        ),
        answer: locBlocks(
          "That's exactly what it should do. Cruise passengers research excursions online before their trip, mostly in English. We build fast excursion pages with English-first SEO and direct booking inquiries, so they book with you before the ship docks — commission-free.",
          "Eso es exactamente lo que debe hacer. Los cruceristas investigan excursiones en línea antes de su viaje, mayormente en inglés. Creamos páginas de excursiones rápidas con SEO en inglés y consultas de reserva directa, para que reserven contigo antes de que el barco atraque — sin comisiones.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Do you work with businesses in Sosúa and Cabarete?",
          "¿Trabajan con negocios en Sosúa y Cabarete?",
        ),
        answer: locBlocks(
          "Yes — the whole north coast, from Cofresí to Cabarete. The process runs remotely by video call and WhatsApp on your schedule, and you work directly with the developer building your site.",
          "Sí — toda la Costa Norte, desde Cofresí hasta Cabarete. El proceso se realiza de forma remota por videollamada y WhatsApp según tu horario, y trabajas directamente con el desarrollador que construye tu sitio.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "How long until my website is live?",
          "¿En cuánto tiempo estará lista mi página web?",
        ),
        answer: locBlocks(
          "Landing pages take 2–3 weeks, custom business websites 6–8 weeks, and web applications 5–8 weeks. If cruise high season is coming, tell us your target date and we'll plan the timeline around it.",
          "Las landing pages toman 2–3 semanas, los sitios web empresariales 6–8 semanas y las aplicaciones web 5–8 semanas. Si se acerca la temporada alta de cruceros, dinos tu fecha objetivo y planificamos el cronograma alrededor de ella.",
        ),
      },
    ],
  },

  // ── STRUCTURED DATA (city-scoped Service — replaces the auto-generated) ───
  structuredData: { en: ppCityServiceEn, es: ppCityServiceEs },
}

// ─────────────────────────────────────────────────────────────────────────────
// seo document (metadata)
// ─────────────────────────────────────────────────────────────────────────────

const puertoPlataSeo = {
  _type: "seo",
  _id: "seo-diseno-de-paginas-web-puerto-plata",
  pageName: "diseno-de-paginas-web-puerto-plata",
  meta: {
    en: {
      title: "Web Design in Puerto Plata & Cabarete | DR Web Studio",
      description:
        "Web design for tours, kite schools, restaurants and real estate in Puerto Plata, Sosúa and Cabarete. Bilingual, fast, fully English-friendly. Free quotes.",
      keywords: [
        "web design puerto plata",
        "web design cabarete",
        "website design sosua dominican republic",
        "web designer north coast dominican republic",
      ],
    },
    es: {
      title: "Diseño de Páginas Web en Puerto Plata | DR Web Studio",
      description:
        "Diseño de páginas web para tours, escuelas, restaurantes y bienes raíces en Puerto Plata, Sosúa y Cabarete. Sitios bilingües y rápidos. Cotización gratis.",
      keywords: [
        "diseño de páginas web en puerto plata",
        "diseño web puerto plata",
        "páginas web puerto plata",
        "diseño web sosúa",
        "diseño web cabarete",
      ],
    },
  },
  openGraph: {
    en: {
      title:
        "Web Design on the North Coast — English-Friendly, Built for Tourism",
      description:
        "Websites for cruise excursions, kite schools, restaurants and rentals in Puerto Plata, Sosúa and Cabarete. Run the whole project in English. Free quotes.",
    },
    es: {
      title: "Diseño de Páginas Web en Puerto Plata — Para Toda la Costa Norte",
      description:
        "Páginas web para excursiones de cruceros, escuelas de kite, restaurantes y alquileres en Puerto Plata, Sosúa y Cabarete. Cotización gratis.",
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
    puertoPlataPage as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded landing page: diseno-de-paginas-web-puerto-plata")

  await client.createOrReplace(
    puertoPlataSeo as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded SEO doc: diseno-de-paginas-web-puerto-plata")

  console.log("")
  console.log("Next steps: see the header comment (seo.ts dropdown option,")
  console.log("route folder, internal links, sitemap check, Studio tasks).")
}

seed().catch(console.error)
