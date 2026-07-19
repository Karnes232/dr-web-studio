/**
 * Seed script — INDUSTRY PAGE: Abogados ONLY
 *
 * Creates the bilingual (en/es) landing page document AND its seo document for:
 *   slug "paginas-web-para-abogados"
 *   → target: "páginas web para abogados" / "página web para bufete" /
 *             "law firm website design dominican republic"
 *
 * INDUSTRY PAGE CONVENTIONS (same as the other industry seeds):
 *   • Flat slug: paginas-web-para-{industria}
 *   • EN route slug (translated): web-design-for-lawyers — the EN
 *     structuredData URLs below assume this; adjust if you pick another.
 *   • structuredData: Service node with `audience` (lawyers) + `areaServed`
 *     Country.
 *
 * Does NOT touch any other documents.
 * Idempotent (createOrReplace) — but it will overwrite Studio edits to these
 * two documents.
 *
 * ── AFTER SEEDING ───────────────────────────────────────────────────────────
 *
 * 1. seo.ts — add this option to the pageName dropdown list:
 *      {
 *        title: "Páginas Web para Abogados (Industry Landing)",
 *        value: "paginas-web-para-abogados",
 *      },
 *
 * 2. ROUTES — ES route at:
 *      src/app/(root)/[lang]/paginas-web-para-abogados/page.tsx
 *    and the EN route at web-design-for-lawyers, both fetching
 *    getLandingPage("paginas-web-para-abogados", lang).
 *
 * 3. INTERNAL LINKS (city ↔ industry grid) —
 *      • From the national hub: one contextual link, anchor
 *        "páginas web para abogados".
 *      • From this page: one link to the hub and one to /es.
 *      • City anchors in: Santo Domingo (its corporate card literally names
 *        bufetes) and Puerto Plata (its expat audience is exactly who needs
 *        English-speaking lawyers). This page links back to Santo Domingo.
 *
 * 4. SITEMAP — confirm the slug is emitted for en + es with hreflang
 *    alternates.
 *
 * 5. STUDIO — attach portfolio projects (most professional/corporate work
 *    first) and upload a 1200x630 OG image.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seedAbogados.ts
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
// structuredData — INDUSTRY-scoped Service node (audience: lawyers,
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

const legalServiceEs = industryServiceNode({
  url: `${BASE}/es/paginas-web-para-abogados`,
  name: "Páginas Web para Abogados",
  serviceType: "Diseño de páginas web para abogados",
  description:
    "Diseño de páginas web para abogados y bufetes en República Dominicana: páginas por área de práctica, inglés para clientes extranjeros y consultas directas.",
  audienceType: "Abogados, bufetes y firmas legales",
})

const legalServiceEn = industryServiceNode({
  url: `${BASE}/en/web-design-for-lawyers`,
  name: "Web Design for Lawyers",
  serviceType: "Law firm website design",
  description:
    "Law firm website design in the Dominican Republic: practice-area pages that rank, English for foreign clients and direct consultation requests.",
  audienceType: "Lawyers, law firms and legal practices",
})

// ─────────────────────────────────────────────────────────────────────────────
// Abogados — industry landing page document
// Angle: authority + the foreign-client machine. Every expat buying property,
// filing residency or forming a company needs an English-speaking Dominican
// lawyer — and finds one online, from abroad, before wiring a retainer.
// Second hook: practice-area SEO — one page per area (inmobiliario,
// migración, corporativo, familia), each ranking for its own searches.
// Third: confidential, low-friction consultation requests.
// ─────────────────────────────────────────────────────────────────────────────

const abogadosPage: Record<string, unknown> = {
  _type: "landingPage",
  _id: "landingPage-paginas-web-para-abogados",
  title: "Páginas Web para Abogados (Industry Landing Page)",
  slug: { _type: "slug", current: "paginas-web-para-abogados" },

  // ── HERO ──────────────────────────────────────────────────────────────────
  hero: {
    headline: loc("Web Design for Lawyers", "Páginas Web para Abogados"),
    subheadline: loc(
      "Authority-building websites for law firms — with practice-area pages that rank on Google and an English version that wins the foreign clients other firms can't reach.",
      "Páginas web que proyectan autoridad para bufetes — con páginas por área de práctica que posicionan en Google y una versión en inglés que gana los clientes extranjeros que otras firmas no alcanzan.",
    ),
    primaryCta: loc("Get a Free Quote", "Solicitar Cotización Gratis"),
    primaryCtaHref: "/contact",
    secondaryCta: loc("View Our Portfolio", "Ver Nuestro Portafolio"),
    secondaryCtaHref: "/portfolio",
    badge: loc(
      "For lawyers, law firms and legal practices across the Dominican Republic",
      "Para abogados, bufetes y firmas legales en toda República Dominicana",
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
      "What a Law Firm's Website Must Do",
      "Lo que la Página Web de un Bufete Debe Hacer",
    ),
    sectionSubtitle: locBlocks(
      "Legal services are hired on trust and found on Google. Your website is where both happen — or don't.",
      "Los servicios legales se contratan por confianza y se encuentran en Google. Tu página web es donde ambas cosas suceden — o no.",
    ),
    items: [
      {
        _key: key(),
        icon: "Scale",
        title: loc(
          "A Site that Projects Authority",
          "Un Sitio que Proyecta Autoridad",
        ),
        description: locBlocks(
          "Attorney profiles with credentials, your firm's history and the cases you handle — presented with the sobriety and polish clients expect before trusting you with what's at stake.",
          "Perfiles de abogados con credenciales, la historia de tu firma y los casos que manejas — presentados con la seriedad y el acabado que los clientes esperan antes de confiarte lo que está en juego.",
        ),
        linkSlug: "custom-websites",
      },
      {
        _key: key(),
        icon: "FileText",
        title: loc(
          "One Page per Practice Area",
          "Una Página por Área de Práctica",
        ),
        description: locBlocks(
          "Real estate law, immigration, corporate, family — each practice area gets its own page, each ranking for its own searches. That's how a firm appears for 'abogado inmobiliario' and 'immigration lawyer' at the same time.",
          "Derecho inmobiliario, migración, corporativo, familia — cada área de práctica tiene su propia página, cada una posicionando para sus propias búsquedas. Así una firma aparece para 'abogado inmobiliario' y para 'immigration lawyer' a la vez.",
        ),
        linkSlug: "landing-pages",
      },
      {
        _key: key(),
        icon: "Globe",
        title: loc(
          "English for Foreign Clients",
          "Inglés para Clientes del Exterior",
        ),
        description: locBlocks(
          "Foreigners buying property, filing residency or opening companies need an English-speaking Dominican lawyer — and they search from abroad, in English, before wiring a retainer. Your English version is how they find and choose you.",
          "Los extranjeros que compran propiedades, tramitan residencia o abren empresas necesitan un abogado dominicano que hable inglés — y buscan desde el exterior, en inglés, antes de enviar un anticipo. Tu versión en inglés es como te encuentran y te eligen.",
        ),
        linkSlug: "ecommerce",
      },
    ],
  },

  // ── WHY CHOOSE US ─────────────────────────────────────────────────────────
  whyUs: {
    sectionTitle: loc(
      "Why Law Firms Choose Us",
      "Por Qué los Bufetes Nos Eligen",
    ),
    sectionSubtitle: locBlocks(
      "We're based in Punta Cana, where foreign investment meets Dominican law — we know exactly who's searching for you.",
      "Tenemos base en Punta Cana, donde la inversión extranjera se encuentra con el derecho dominicano — sabemos exactamente quién te está buscando.",
    ),
    items: [
      {
        _key: key(),
        icon: "ShieldCheck",
        title: loc(
          "The First Impression of a Serious Firm",
          "La Primera Impresión de un Bufete Serio",
        ),
        description: locBlocks(
          "Clients vet lawyers online before the first call — foreign clients doubly so, since they're trusting a firm in another country. A fast, professional, bilingual site is the credential that opens that door.",
          "Los clientes evalúan abogados en línea antes de la primera llamada — los clientes extranjeros el doble, porque están confiando en una firma de otro país. Un sitio rápido, profesional y bilingüe es la credencial que abre esa puerta.",
        ),
      },
      {
        _key: key(),
        icon: "Search",
        title: loc("Rank by Practice Area", "Posiciona por Área de Práctica"),
        description: locBlocks(
          "From 'abogado inmobiliario en Punta Cana' to 'residency lawyer Dominican Republic' — structured practice-area pages with bilingual SEO put your firm in both markets' searches.",
          "Desde 'abogado inmobiliario en Punta Cana' hasta 'residency lawyer Dominican Republic' — las páginas por área de práctica con SEO bilingüe ponen tu firma en las búsquedas de ambos mercados.",
        ),
      },
      {
        _key: key(),
        icon: "Lock",
        title: loc("Confidential Consultations", "Consultas Confidenciales"),
        description: locBlocks(
          "Legal matters are private. Consultation forms are discreet and secure by design, and inquiries arrive only to you — a detail clients notice before they've written a word.",
          "Los asuntos legales son privados. Los formularios de consulta son discretos y seguros por diseño, y las solicitudes llegan solo a ti — un detalle que los clientes notan antes de escribir una palabra.",
        ),
      },
      {
        _key: key(),
        icon: "MessageSquare",
        title: loc(
          "From Visit to Consultation, No Friction",
          "De la Visita a la Consulta, sin Fricción",
        ),
        description: locBlocks(
          "One-tap WhatsApp plus forms that capture the type of matter — so your first conversation starts with context, not from zero, whether the client writes from Naco or New York.",
          "WhatsApp de un toque más formularios que capturan el tipo de asunto — para que tu primera conversación empiece con contexto, no desde cero, ya sea que el cliente escriba desde Naco o desde Nueva York.",
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
          "We learn about your firm, your practice areas and the clients you want more of. You complete our project questionnaire and we define the full scope, sitemap and timeline together.",
          "Conocemos tu firma, tus áreas de práctica y los clientes que quieres atraer. Completas nuestro cuestionario de proyecto y juntos definimos el alcance, mapa del sitio y cronograma.",
        ),
        duration: loc("3–5 days", "3–5 días"),
      },
      {
        _key: key(),
        number: 2,
        icon: "Palette",
        stepTitle: loc("Design & Prototyping", "Diseño y Prototipado"),
        description: locBlocks(
          "We create a custom visual design with the sobriety and authority a legal practice demands. You review the design and we refine it across two revision rounds until it's perfect.",
          "Creamos un diseño visual personalizado con la seriedad y autoridad que exige una práctica legal. Revisas el diseño y lo refinamos en dos rondas de revisión hasta que quede perfecto.",
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
          "We build your site with Next.js and connect it to Sanity CMS so you can update practice areas, attorney profiles and articles yourself. SEO, performance and responsive design are built in.",
          "Construimos tu sitio con Next.js y lo conectamos a Sanity CMS para que actualices áreas de práctica, perfiles de abogados y artículos tú mismo. SEO, rendimiento y diseño responsivo vienen integrados.",
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
    // Attach real `project` references in Studio (max 3). Your most
    // professional, corporate-looking work first — the authority proxy for a
    // legal audience.
    projects: [],
    ctaText: loc("View Full Portfolio", "Ver Portafolio Completo"),
    ctaHref: "/portfolio",
  },

  // ── TESTIMONIALS (same three clients; results story first) ────────────────
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
      "What lawyers and firm partners ask us most.",
      "Lo que más nos preguntan los abogados y socios de bufetes.",
    ),
    items: [
      {
        _key: key(),
        question: loc(
          "How much does a law firm website cost?",
          "¿Cuánto cuesta una página web para mi bufete?",
        ),
        // Figures verified against your live landing pages (July 2026).
        answer: locBlocks(
          "A complete firm website with practice-area pages starts at $950 USD; a focused landing page for a single practice area starts at $400. 50% upfront, 50% on delivery, with no hidden fees and no monthly platform charges.",
          "Un sitio web completo de firma con páginas por área de práctica comienza en $950 USD; una landing page enfocada para una sola área comienza en $400. 50% al inicio y 50% al entregar, sin costos ocultos ni cuotas mensuales de plataforma.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Will it help me attract foreign clients?",
          "¿Me ayudará a atraer clientes extranjeros?",
        ),
        answer: locBlocks(
          "It's the strongest case for a Dominican firm's website. Foreigners buying property, filing residency or forming companies need an English-speaking local lawyer — and they choose one online, from abroad, before ever landing. An English version with international SEO puts your firm in front of them at that moment.",
          "Es el caso más fuerte para la página web de una firma dominicana. Los extranjeros que compran propiedades, tramitan residencia o forman empresas necesitan un abogado local que hable inglés — y lo eligen en línea, desde el exterior, antes de aterrizar. Una versión en inglés con SEO internacional pone tu firma frente a ellos en ese momento.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "What should a lawyer's website include?",
          "¿Qué debe tener la página web de un abogado?",
        ),
        answer: locBlocks(
          "Four things do most of the work: clear practice-area pages, attorney profiles with real credentials, articles or answers that demonstrate expertise, and a frictionless way to request a consultation. We build all four in from day one.",
          "Cuatro cosas hacen la mayor parte del trabajo: páginas claras por área de práctica, perfiles de abogados con credenciales reales, artículos o respuestas que demuestren experiencia, y una vía sin fricción para solicitar una consulta. Construimos las cuatro desde el primer día.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Can clients request consultations from the site?",
          "¿Los clientes pueden solicitar consultas desde la página?",
        ),
        answer: locBlocks(
          "Yes — discreet consultation forms that capture the type of matter, plus one-tap WhatsApp, are standard. If your firm charges for initial consultations, we can integrate online payment so a booked consultation arrives already confirmed.",
          "Sí — formularios de consulta discretos que capturan el tipo de asunto, más WhatsApp de un toque, son estándar. Si tu firma cobra la consulta inicial, podemos integrar pago en línea para que una consulta agendada llegue ya confirmada.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "How long until my website is live?",
          "¿En cuánto tiempo estará lista mi página web?",
        ),
        answer: locBlocks(
          "A complete firm website takes 6–8 weeks; a focused practice-area landing page 2–3 weeks. You'll receive a detailed timeline during the discovery phase.",
          "Un sitio web completo de firma toma 6–8 semanas; una landing page enfocada de área de práctica 2–3 semanas. Recibirás un cronograma detallado durante la fase de descubrimiento.",
        ),
      },
    ],
  },

  // ── STRUCTURED DATA (industry-scoped Service — replaces the auto one) ─────
  structuredData: { en: legalServiceEn, es: legalServiceEs },
}

// ─────────────────────────────────────────────────────────────────────────────
// seo document (metadata)
// ─────────────────────────────────────────────────────────────────────────────

const abogadosSeo = {
  _type: "seo",
  _id: "seo-paginas-web-para-abogados",
  pageName: "paginas-web-para-abogados",
  meta: {
    en: {
      title: "Law Firm Website Design Dominican Republic | DR Web Studio",
      description:
        "Law firm website design in the Dominican Republic: practice-area pages that rank, English for foreign clients and direct consultation requests. Free quotes.",
      keywords: [
        "law firm website design dominican republic",
        "lawyer web design",
        "attorney website design",
      ],
    },
    es: {
      title: "Diseño de Páginas Web para Abogados | DR Web Studio",
      description:
        "Diseño de páginas web para abogados y bufetes en RD: áreas de práctica que posicionan, inglés para clientes extranjeros y consultas directas. Cotización gratis.",
      keywords: [
        "páginas web para abogados",
        "diseño web abogados",
        "página web para bufete",
        "página web firma de abogados",
        "diseño de páginas web para abogados",
      ],
    },
  },
  openGraph: {
    en: {
      title: "Law Firm Websites — Authority that Wins Foreign Clients",
      description:
        "Practice-area pages that rank, English for international clients, and confidential consultation requests. Built in the Dominican Republic. Free quotes.",
    },
    es: {
      title: "Páginas Web para Abogados — Autoridad que Gana Clientes",
      description:
        "Páginas por área de práctica que posicionan, inglés para clientes internacionales y consultas confidenciales. Creadas en República Dominicana. Cotización gratis.",
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
    abogadosPage as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded landing page: paginas-web-para-abogados")

  await client.createOrReplace(
    abogadosSeo as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded SEO doc: paginas-web-para-abogados")

  console.log("")
  console.log("Next steps: see the header comment (seo.ts dropdown option,")
  console.log("ES + EN routes, city↔industry cross-links, sitemap check).")
}

seed().catch(console.error)
