/**
 * Seed script — INDUSTRY PAGE: Dentistas ONLY
 *
 * Creates the bilingual (en/es) landing page document AND its seo document for:
 *   slug "paginas-web-para-dentistas"
 *   → target: "páginas web para dentistas" / "página web clínica dental" /
 *             "dental website design dominican republic"
 *
 * INDUSTRY PAGE CONVENTIONS (same as the other industry seeds):
 *   • Flat slug: paginas-web-para-{industria}
 *   • EN route slug (translated): web-design-for-dentists — the EN
 *     structuredData URLs below assume this; adjust if you pick another.
 *   • structuredData: Service node with `audience` (dentists) + `areaServed`
 *     Country. (The Service is YOUR web design service for dentists — no
 *     medical claims anywhere in schema or copy.)
 *
 * Does NOT touch any other documents.
 * Idempotent (createOrReplace) — but it will overwrite Studio edits to these
 * two documents.
 *
 * ── AFTER SEEDING ───────────────────────────────────────────────────────────
 *
 * 1. seo.ts — add this option to the pageName dropdown list:
 *      {
 *        title: "Páginas Web para Dentistas (Industry Landing)",
 *        value: "paginas-web-para-dentistas",
 *      },
 *
 * 2. ROUTES — ES route at:
 *      src/app/(root)/[lang]/paginas-web-para-dentistas/page.tsx
 *    and the EN route at web-design-for-dentists, both fetching
 *    getLandingPage("paginas-web-para-dentistas", lang).
 *
 * 3. INTERNAL LINKS (city ↔ industry grid) — first non-tourism industry, so
 *    the cross-links change coasts:
 *      • From the national hub: one contextual link, anchor
 *        "páginas web para dentistas".
 *      • From this page: one link to the hub and one to /es.
 *      • City anchors in: Santo Domingo (its corporate card names clínicas)
 *        and Higüey (clinics in its local-commerce card). This page links
 *        back to Santo Domingo.
 *
 * 4. SITEMAP — confirm the slug is emitted for en + es with hreflang
 *    alternates.
 *
 * 5. STUDIO — attach portfolio projects (most polished/professional work
 *    first) and upload a 1200x630 OG image.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seedDentistas.ts
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
// structuredData — INDUSTRY-scoped Service node (audience: dentists,
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

const dentServiceEs = industryServiceNode({
  url: `${BASE}/es/paginas-web-para-dentistas`,
  name: "Páginas Web para Dentistas",
  serviceType: "Diseño de páginas web para dentistas",
  description:
    "Diseño de páginas web para dentistas y clínicas dentales en República Dominicana: citas por WhatsApp, páginas en inglés para turismo dental y SEO local.",
  audienceType: "Dentistas, clínicas dentales y especialistas",
})

const dentServiceEn = industryServiceNode({
  url: `${BASE}/en/web-design-for-dentists`,
  name: "Web Design for Dentists",
  serviceType: "Dental website design",
  description:
    "Dental website design in the Dominican Republic: bilingual sites for dental tourism, WhatsApp appointment requests and local SEO.",
  audienceType: "Dentists, dental clinics and specialists",
})

// ─────────────────────────────────────────────────────────────────────────────
// Dentistas — industry landing page document
// Angle: trust before the first appointment — nobody hands their mouth to a
// clinic they haven't vetted online. Two markets, one site: local patients
// searching "dentista cerca de mí", and DENTAL TOURISM — patients in the US
// and Canada comparing Dominican clinics in English months before flying,
// where an English-first site with credentials and cases IS the deciding
// credential. Copy sells the website's job, never medical outcomes.
// ─────────────────────────────────────────────────────────────────────────────

const dentistasPage: Record<string, unknown> = {
  _type: "landingPage",
  _id: "landingPage-paginas-web-para-dentistas",
  title: "Páginas Web para Dentistas (Industry Landing Page)",
  slug: { _type: "slug", current: "paginas-web-para-dentistas" },

  // ── HERO ──────────────────────────────────────────────────────────────────
  hero: {
    headline: loc("Web Design for Dentists", "Páginas Web para Dentistas"),
    subheadline: loc(
      "Bilingual websites for dental clinics that turn nervous online research into booked appointments — from patients down the street and patients flying in from abroad.",
      "Páginas web bilingües para clínicas dentales que convierten la investigación nerviosa en línea en citas agendadas — de pacientes de tu ciudad y de pacientes que vuelan desde el exterior.",
    ),
    primaryCta: loc("Get a Free Quote", "Solicitar Cotización Gratis"),
    primaryCtaHref: "/contact",
    secondaryCta: loc("View Our Portfolio", "Ver Nuestro Portafolio"),
    secondaryCtaHref: "/portfolio",
    badge: loc(
      "For dentists, dental clinics and specialists across the Dominican Republic",
      "Para dentistas, clínicas dentales y especialistas en toda República Dominicana",
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
      "What a Dental Clinic's Website Must Do",
      "Lo que la Página Web de una Clínica Dental Debe Hacer",
    ),
    sectionSubtitle: locBlocks(
      "Choosing a dentist is a trust decision — and today, trust is decided online before anyone sits in your chair.",
      "Elegir dentista es una decisión de confianza — y hoy, la confianza se decide en línea antes de que alguien se siente en tu sillón.",
    ),
    items: [
      {
        _key: key(),
        icon: "Smile",
        title: loc(
          "A Site that Builds Trust",
          "Una Página que Transmite Confianza",
        ),
        description: locBlocks(
          "Your specialties, credentials, team and clinic — presented with the polish patients expect from someone they're trusting with their health. Plus case galleries, shared with your patients' consent.",
          "Tus especialidades, credenciales, equipo y clínica — presentados con el nivel que los pacientes esperan de alguien a quien le confían su salud. Más galerías de casos, compartidas con el consentimiento de tus pacientes.",
        ),
        linkSlug: "custom-websites",
      },
      {
        _key: key(),
        icon: "Plane",
        title: loc(
          "Dental Tourism: Patients from Abroad",
          "Turismo Dental: Pacientes desde el Exterior",
        ),
        description: locBlocks(
          "Patients in the US and Canada compare Dominican clinics for implants and veneers months before flying — in English. Dedicated English-first pages with your treatments and process for international patients put you in that comparison.",
          "Pacientes en EE. UU. y Canadá comparan clínicas dominicanas para implantes y carillas meses antes de volar — en inglés. Páginas dedicadas, con inglés de primera, con tus tratamientos y tu proceso para pacientes internacionales te ponen en esa comparación.",
        ),
        linkSlug: "landing-pages",
      },
      {
        _key: key(),
        icon: "CalendarCheck",
        title: loc(
          "Appointments & Online Deposits",
          "Citas y Depósitos en Línea",
        ),
        description: locBlocks(
          "One-tap WhatsApp and appointment request forms as standard — and for international treatment plans, optional online deposits that let a patient reserve their dates before booking flights.",
          "WhatsApp de un toque y formularios de solicitud de cita como estándar — y para planes de tratamiento internacionales, depósitos en línea opcionales que permiten al paciente reservar sus fechas antes de comprar vuelos.",
        ),
        linkSlug: "ecommerce",
      },
    ],
  },

  // ── WHY CHOOSE US ─────────────────────────────────────────────────────────
  whyUs: {
    sectionTitle: loc(
      "Why Dental Clinics Choose Us",
      "Por Qué las Clínicas Dentales Nos Eligen",
    ),
    sectionSubtitle: locBlocks(
      "A dental website has one job: make the next patient feel safe enough to book. Everything below serves it.",
      "La página web de un dentista tiene un solo trabajo: que el próximo paciente se sienta seguro de agendar. Todo lo de abajo lo sirve.",
    ),
    items: [
      {
        _key: key(),
        icon: "ShieldCheck",
        title: loc(
          "Trust Before the First Appointment",
          "Confianza Antes de la Primera Cita",
        ),
        description: locBlocks(
          "Patients google you before they call — and for high-value treatments, they compare several clinics. A fast, professional, credential-forward site is what turns research into a booking.",
          "Los pacientes te googlean antes de llamar — y para tratamientos de alto valor, comparan varias clínicas. Un sitio rápido, profesional y con credenciales al frente es lo que convierte la investigación en una cita.",
        ),
      },
      {
        _key: key(),
        icon: "Globe",
        title: loc("English for Dental Tourism", "Inglés para Turismo Dental"),
        description: locBlocks(
          "Every site ships fully bilingual with international SEO — so patients searching treatment options from abroad find your clinic, read your process in their language, and inquire with confidence.",
          "Cada sitio se entrega completamente bilingüe con SEO internacional — para que los pacientes que buscan opciones de tratamiento desde el exterior encuentren tu clínica, lean tu proceso en su idioma y consulten con confianza.",
        ),
      },
      {
        _key: key(),
        icon: "Search",
        title: loc(
          "Found for 'Dentist Near Me'",
          "Aparece en 'Dentista Cerca de Mí'",
        ),
        description: locBlocks(
          "Local SEO built in — optimized titles, structured data with your specialties and hours — plus guidance to set up your Google Business Profile, so nearby patients find you in Maps.",
          "SEO local integrado — títulos optimizados y datos estructurados con tus especialidades y horarios — más orientación para configurar tu Perfil de Negocio de Google, para que los pacientes cercanos te encuentren en Maps.",
        ),
      },
      {
        _key: key(),
        icon: "MessageSquare",
        title: loc("Frictionless Appointments", "Citas sin Fricción"),
        description: locBlocks(
          "Patients book where their thumbs already are: one-tap WhatsApp plus forms that capture the treatment they're interested in — so your front desk answers prepared, not from zero.",
          "Los pacientes agendan donde ya están sus pulgares: WhatsApp de un toque más formularios que capturan el tratamiento que les interesa — para que tu recepción responda preparada, no desde cero.",
        ),
      },
    ],
  },

  // ── PROCESS STEPS (the real 5-step process from your live landing pages) ──
  process: {
    sectionTitle: loc("How We Work", "Cómo Trabajamos"),
    sectionSubtitle: locBlocks(
      "A clear, structured process from first call to launch — without taking you away from your patients.",
      "Un proceso claro y estructurado desde la primera llamada hasta el lanzamiento — sin sacarte de tus pacientes.",
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
          "We learn about your clinic, your specialties and the patients you want more of. You complete our project questionnaire and we define the full scope, sitemap and timeline together.",
          "Conocemos tu clínica, tus especialidades y los pacientes que quieres atraer. Completas nuestro cuestionario de proyecto y juntos definimos el alcance, mapa del sitio y cronograma.",
        ),
        duration: loc("3–5 days", "3–5 días"),
      },
      {
        _key: key(),
        number: 2,
        icon: "Palette",
        stepTitle: loc("Design & Prototyping", "Diseño y Prototipado"),
        description: locBlocks(
          "We create a custom visual design with the clean, calm professionalism a health practice needs. You review the design and we refine it across two revision rounds until it's perfect.",
          "Creamos un diseño visual personalizado con el profesionalismo limpio y sereno que necesita una práctica de salud. Revisas el diseño y lo refinamos en dos rondas de revisión hasta que quede perfecto.",
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
          "We build your site with Next.js and connect it to Sanity CMS so you can update treatments, team members and hours yourself. SEO, performance and responsive design are built in.",
          "Construimos tu sitio con Next.js y lo conectamos a Sanity CMS para que actualices tratamientos, miembros del equipo y horarios tú mismo. SEO, rendimiento y diseño responsivo vienen integrados.",
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
    // Attach real `project` references in Studio (max 3). Your most polished,
    // professional-looking work first — the trust proxy for a health audience.
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
      "What dentists and clinic owners ask us most.",
      "Lo que más nos preguntan los dentistas y dueños de clínicas.",
    ),
    items: [
      {
        _key: key(),
        question: loc(
          "How much does a dental clinic website cost?",
          "¿Cuánto cuesta una página web para mi clínica dental?",
        ),
        // Figures verified against your live landing pages (July 2026).
        answer: locBlocks(
          "A complete clinic website starts at $950 USD; a focused landing page — for example, a dental tourism page for one treatment — starts at $400. 50% upfront, 50% on delivery, with no hidden fees and no monthly platform charges.",
          "Un sitio web completo de clínica comienza en $950 USD; una landing page enfocada — por ejemplo, una página de turismo dental para un tratamiento — comienza en $400. 50% al inicio y 50% al entregar, sin costos ocultos ni cuotas mensuales de plataforma.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Will it help me attract patients from abroad?",
          "¿Me ayudará a atraer pacientes del extranjero?",
        ),
        answer: locBlocks(
          "That's one of the strongest reasons a Dominican clinic invests in a website. Dental tourism patients research in English, compare several clinics, and decide before booking flights — an English-first site with your treatments, credentials and process for international patients is how you enter that comparison.",
          "Es una de las razones más fuertes por las que una clínica dominicana invierte en su página web. Los pacientes de turismo dental investigan en inglés, comparan varias clínicas y deciden antes de comprar vuelos — un sitio con inglés de primera, con tus tratamientos, credenciales y proceso para pacientes internacionales, es como entras en esa comparación.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Can I show before-and-after cases?",
          "¿Puedo mostrar casos de antes y después?",
        ),
        answer: locBlocks(
          "Yes — fast, high-resolution galleries are standard, and for treatment cases we structure them so you only publish with each patient's consent. Few things build trust with a new patient like real results, well presented.",
          "Sí — las galerías rápidas en alta resolución son estándar, y para casos de tratamiento las estructuramos para que publiques solo con el consentimiento de cada paciente. Pocas cosas generan tanta confianza en un paciente nuevo como resultados reales, bien presentados.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Can patients request appointments from the site?",
          "¿Los pacientes pueden agendar citas desde la página?",
        ),
        answer: locBlocks(
          "Yes — one-tap WhatsApp and appointment request forms are standard on every site. If your clinic uses a scheduling system, tell us during discovery and we'll assess the integration for your setup.",
          "Sí — el WhatsApp de un toque y los formularios de solicitud de cita son estándar en cada sitio. Si tu clínica usa un sistema de agenda, dínoslo en la fase de descubrimiento y evaluamos la integración para tu operación.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "How long until my website is live?",
          "¿En cuánto tiempo estará lista mi página web?",
        ),
        answer: locBlocks(
          "A complete clinic website takes 6–8 weeks; a focused landing page 2–3 weeks. You'll receive a detailed timeline during the discovery phase.",
          "Un sitio web completo de clínica toma 6–8 semanas; una landing page enfocada 2–3 semanas. Recibirás un cronograma detallado durante la fase de descubrimiento.",
        ),
      },
    ],
  },

  // ── STRUCTURED DATA (industry-scoped Service — replaces the auto one) ─────
  structuredData: { en: dentServiceEn, es: dentServiceEs },
}

// ─────────────────────────────────────────────────────────────────────────────
// seo document (metadata)
// ─────────────────────────────────────────────────────────────────────────────

const dentistasSeo = {
  _type: "seo",
  _id: "seo-paginas-web-para-dentistas",
  pageName: "paginas-web-para-dentistas",
  meta: {
    en: {
      title: "Dental Website Design Dominican Republic | DR Web Studio",
      description:
        "Dental website design in the Dominican Republic: bilingual sites for dental tourism, WhatsApp appointments and local SEO. Free quotes.",
      keywords: [
        "dental website design dominican republic",
        "dentist web design",
        "dental tourism website",
      ],
    },
    es: {
      title: "Diseño de Páginas Web para Dentistas | DR Web Studio",
      description:
        "Diseño de páginas web para dentistas y clínicas dentales en República Dominicana: citas por WhatsApp, turismo dental en inglés y SEO local. Cotización gratis.",
      keywords: [
        "páginas web para dentistas",
        "diseño web dentistas",
        "página web clínica dental",
        "página web para mi consultorio dental",
        "diseño de páginas web para dentistas",
      ],
    },
  },
  openGraph: {
    en: {
      title: "Dental Websites — Trust Before the First Appointment",
      description:
        "Bilingual websites for dental clinics in the Dominican Republic: dental tourism pages in English, WhatsApp appointments and local SEO. Free quotes.",
    },
    es: {
      title: "Páginas Web para Dentistas — Confianza Antes de la Primera Cita",
      description:
        "Páginas web bilingües para clínicas dentales en República Dominicana: turismo dental en inglés, citas por WhatsApp y SEO local. Cotización gratis.",
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
    dentistasPage as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded landing page: paginas-web-para-dentistas")

  await client.createOrReplace(
    dentistasSeo as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded SEO doc: paginas-web-para-dentistas")

  console.log("")
  console.log("Next steps: see the header comment (seo.ts dropdown option,")
  console.log("ES + EN routes, city↔industry cross-links, sitemap check).")
}

seed().catch(console.error)
