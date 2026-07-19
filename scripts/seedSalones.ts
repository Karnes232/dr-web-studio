/**
 * Seed script — INDUSTRY PAGE: Salones de Belleza, Spas y Barberías ONLY
 *
 * Creates the bilingual (en/es) landing page document AND its seo document for:
 *   slug "paginas-web-para-salones-de-belleza"
 *   → target: "páginas web para salones de belleza" / "página web para spa" /
 *             "página web para barbería"
 *
 * INDUSTRY PAGE CONVENTIONS (same as the other industry seeds):
 *   • Flat slug: paginas-web-para-{industria}
 *   • EN route slug (translated): web-design-for-salons-and-spas — the EN
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
 *        title: "Páginas Web para Salones de Belleza (Industry Landing)",
 *        value: "paginas-web-para-salones-de-belleza",
 *      },
 *
 * 2. ROUTES — ES route at:
 *      src/app/(root)/[lang]/paginas-web-para-salones-de-belleza/page.tsx
 *    and the EN route at web-design-for-salons-and-spas, both fetching
 *    getLandingPage("paginas-web-para-salones-de-belleza", lang).
 *
 * 3. INTERNAL LINKS (city ↔ industry grid) —
 *      • From the national hub: one contextual link, anchor
 *        "páginas web para salones de belleza".
 *      • From this page: one link to the hub and one to /es.
 *      • City anchors in: Punta Cana (its services card names spas) and
 *        Higüey (salones in its local-commerce card). This page links back
 *        to Punta Cana.
 *
 * 4. SITEMAP — confirm the slug is emitted for en + es with hreflang
 *    alternates.
 *
 * 5. STUDIO — attach portfolio projects (most visually striking work first)
 *    and upload a 1200x630 OG image.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seedSalones.ts
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
// structuredData — INDUSTRY-scoped Service node (audience: beauty businesses,
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

const salonServiceEs = industryServiceNode({
  url: `${BASE}/es/paginas-web-para-salones-de-belleza`,
  name: "Páginas Web para Salones de Belleza",
  serviceType: "Diseño de páginas web para salones de belleza",
  description:
    "Diseño de páginas web para salones de belleza, spas y barberías en República Dominicana: precios claros, citas por WhatsApp y depósitos que reducen no-shows.",
  audienceType: "Salones de belleza, spas, barberías y estudios de uñas",
})

const salonServiceEn = industryServiceNode({
  url: `${BASE}/en/web-design-for-salons-and-spas`,
  name: "Web Design for Salons & Spas",
  serviceType: "Salon and spa website design",
  description:
    "Website design for beauty salons, spas and barbershops in the Dominican Republic: clear price menus, WhatsApp bookings and fewer no-shows.",
  audienceType: "Beauty salons, spas, barbershops and nail studios",
})

// ─────────────────────────────────────────────────────────────────────────────
// Salones de Belleza — industry landing page document
// Angle: the Instagram-native, booking-chaos business. Three pains, three
// fixes: (1) "info por DM" — clients hate asking for prices; a public
// service menu with prices converts silently; (2) booking by DM/call means
// no-shows and double bookings — WhatsApp requests that capture service +
// preferred time, plus optional deposits for long appointments; (3) the feed
// wins hearts but can't structure prices, services or rank on Google — the
// site is the link-in-bio that closes. Tourist-zone spas/barbers get the
// English angle too.
// ─────────────────────────────────────────────────────────────────────────────

const salonesPage: Record<string, unknown> = {
  _type: "landingPage",
  _id: "landingPage-paginas-web-para-salones-de-belleza",
  title: "Páginas Web para Salones de Belleza (Industry Landing Page)",
  slug: { _type: "slug", current: "paginas-web-para-salones-de-belleza" },

  // ── HERO ──────────────────────────────────────────────────────────────────
  hero: {
    headline: loc(
      "Web Design for Salons, Spas & Barbershops",
      "Páginas Web para Salones, Spas y Barberías",
    ),
    subheadline: loc(
      "Your feed wins hearts — your website fills the chair. Clear prices, one-tap WhatsApp bookings and deposits that end no-shows.",
      "Tu feed enamora — tu página web llena el sillón. Precios claros, citas por WhatsApp con un toque y depósitos que acaban con los no-shows.",
    ),
    primaryCta: loc("Get a Free Quote", "Solicitar Cotización Gratis"),
    primaryCtaHref: "/contact",
    secondaryCta: loc("View Our Portfolio", "Ver Nuestro Portafolio"),
    secondaryCtaHref: "/portfolio",
    badge: loc(
      "For salons, spas, barbershops and nail studios across the Dominican Republic",
      "Para salones, spas, barberías y estudios de uñas en toda República Dominicana",
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
      "What a Salon's Website Must Do",
      "Lo que la Página Web de un Salón Debe Hacer",
    ),
    sectionSubtitle: locBlocks(
      "Nobody wants to DM 'info?' and wait an hour for a price. Your website answers instantly — and books while you work.",
      "Nadie quiere escribir 'info?' por DM y esperar una hora por un precio. Tu página web responde al instante — y agenda mientras trabajas.",
    ),
    items: [
      {
        _key: key(),
        icon: "Scissors",
        title: loc(
          "A Service Menu with Clear Prices",
          "Un Menú de Servicios con Precios Claros",
        ),
        description: locBlocks(
          "Every service, every price, always up to date — editable by you from your phone. Clients who see prices upfront book more and haggle less.",
          "Cada servicio, cada precio, siempre actualizado — editable por ti desde tu celular. El cliente que ve los precios de una vez agenda más y regatea menos.",
        ),
        linkSlug: "custom-websites",
      },
      {
        _key: key(),
        icon: "CalendarCheck",
        title: loc(
          "Bookings & Deposits that End No-Shows",
          "Citas y Depósitos que Acaban con los No-Shows",
        ),
        description: locBlocks(
          "One-tap WhatsApp booking that captures the service, preferred stylist and time — plus optional online deposits for long appointments, so a booked balayage actually shows up.",
          "Reserva por WhatsApp de un toque que captura el servicio, el estilista preferido y la hora — más depósitos en línea opcionales para citas largas, para que ese balayage agendado de verdad llegue.",
        ),
        linkSlug: "ecommerce",
      },
      {
        _key: key(),
        icon: "Sparkles",
        title: loc(
          "Landing Pages for Promos & Seasons",
          "Landing Pages para Promos y Temporadas",
        ),
        description: locBlocks(
          "Graduation season, December, Valentine's — focused pages for your promotions and ad campaigns, built to turn a boosted post into a full agenda.",
          "Graduaciones, diciembre, San Valentín — páginas enfocadas para tus promociones y campañas, hechas para convertir un post promocionado en una agenda llena.",
        ),
        linkSlug: "landing-pages",
      },
    ],
  },

  // ── WHY CHOOSE US ─────────────────────────────────────────────────────────
  whyUs: {
    sectionTitle: loc(
      "Why Beauty Businesses Choose Us",
      "Por Qué los Negocios de Belleza Nos Eligen",
    ),
    sectionSubtitle: locBlocks(
      "A salon website has one job: keep the chairs full. Everything below serves it.",
      "La página web de un salón tiene un solo trabajo: mantener los sillones llenos. Todo lo de abajo lo sirve.",
    ),
    items: [
      {
        _key: key(),
        icon: "Search",
        title: loc(
          "Found for 'Salon Near Me'",
          "Aparece en 'Salón Cerca de Mí'",
        ),
        description: locBlocks(
          "Local SEO built in — optimized titles, structured data with your services and hours — plus guidance to set up your Google Business Profile, so new clients nearby find you in Maps.",
          "SEO local integrado — títulos optimizados y datos estructurados con tus servicios y horarios — más orientación para configurar tu Perfil de Negocio de Google, para que clientes nuevos cerca de ti te encuentren en Maps.",
        ),
      },
      {
        _key: key(),
        icon: "Smartphone",
        title: loc(
          "The Link-in-Bio that Books",
          "El Link en la Bio que Agenda",
        ),
        description: locBlocks(
          "Instagram discovers you; your website converts the follower who's ready. One link in your bio takes them from admiring your work to picking a service and a time.",
          "Instagram te descubre; tu página web convierte al seguidor que ya está listo. Un solo link en tu bio lo lleva de admirar tu trabajo a elegir servicio y hora.",
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
          "For beauty services, reviews decide. We showcase your Google rating and client reviews on the site itself — social proof next to the booking button, where it counts.",
          "En los servicios de belleza, las reseñas deciden. Mostramos tu calificación de Google y las reseñas de tus clientas en el sitio mismo — prueba social al lado del botón de reservar, donde cuenta.",
        ),
      },
      {
        _key: key(),
        icon: "Globe",
        title: loc(
          "English for Tourists & Expats",
          "Inglés para Turistas y Expats",
        ),
        description: locBlocks(
          "Spas and barbershops in tourist zones serve visitors who search in English. Every site ships fully bilingual — so the tourist looking for a massage or a fade finds you, not the next shop.",
          "Los spas y barberías en zonas turísticas atienden visitantes que buscan en inglés. Cada sitio se entrega completamente bilingüe — para que el turista que busca un masaje o un fade te encuentre a ti, no al local de al lado.",
        ),
      },
    ],
  },

  // ── PROCESS STEPS (the real 5-step process from your live landing pages) ──
  process: {
    sectionTitle: loc("How We Work", "Cómo Trabajamos"),
    sectionSubtitle: locBlocks(
      "A clear, structured process from first call to launch — without taking you off the floor.",
      "Un proceso claro y estructurado desde la primera llamada hasta el lanzamiento — sin sacarte del salón.",
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
          "We learn about your salon, your services and your clientele. You complete our project questionnaire and we define the full scope, sitemap and timeline together.",
          "Conocemos tu salón, tus servicios y tu clientela. Completas nuestro cuestionario de proyecto y juntos definimos el alcance, mapa del sitio y cronograma.",
        ),
        duration: loc("3–5 days", "3–5 días"),
      },
      {
        _key: key(),
        number: 2,
        icon: "Palette",
        stepTitle: loc("Design & Prototyping", "Diseño y Prototipado"),
        description: locBlocks(
          "We create a custom visual design as polished as your work — built around your photos and your brand. Two revision rounds until it's perfect.",
          "Creamos un diseño visual personalizado tan cuidado como tu trabajo — construido alrededor de tus fotos y tu marca. Dos rondas de revisión hasta que quede perfecto.",
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
          "We build your site with Next.js and connect it to Sanity CMS so you can update services, prices and photos yourself. SEO, performance and responsive design are built in.",
          "Construimos tu sitio con Next.js y lo conectamos a Sanity CMS para que actualices servicios, precios y fotos sin depender de nadie. SEO, rendimiento y diseño responsivo vienen integrados.",
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
    // Attach real `project` references in Studio (max 3). Your most visually
    // striking work first — this audience buys with their eyes.
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
      "What salon and spa owners ask us most.",
      "Lo que más nos preguntan los dueños de salones y spas.",
    ),
    items: [
      {
        _key: key(),
        question: loc(
          "How much does a salon website cost?",
          "¿Cuánto cuesta una página web para mi salón?",
        ),
        // Figures verified against your live landing pages (July 2026).
        answer: locBlocks(
          "A landing page with your service menu, prices and WhatsApp booking starts at $400 USD; a complete salon website starts at $950 — 50% upfront, 50% on delivery, with no hidden fees and no monthly platform charges.",
          "Una landing page con tu menú de servicios, precios y reserva por WhatsApp comienza en $400 USD; un sitio web completo de salón comienza en $950 — 50% al inicio y 50% al entregar, sin costos ocultos ni cuotas mensuales de plataforma.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "I already have Instagram — why do I need a website?",
          "Ya tengo Instagram — ¿para qué una página web?",
        ),
        answer: locBlocks(
          "Instagram is where clients discover your work — keep it. But a feed can't show a structured price menu, can't rank on Google for 'salón cerca de mí', and makes every booking a conversation. Your website is the link in your bio that answers, prices and books on its own.",
          "Instagram es donde las clientas descubren tu trabajo — consérvalo. Pero un feed no puede mostrar un menú de precios estructurado, no posiciona en Google para 'salón cerca de mí', y convierte cada cita en una conversación. Tu página web es el link en tu bio que responde, cotiza y agenda por sí sola.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Can I update my prices and services without a developer?",
          "¿Puedo actualizar mis precios y servicios sin un programador?",
        ),
        answer: locBlocks(
          "Yes — change a price, add a service, update hours or swap photos from your phone, in minutes. We train you before launch, and everything publishes in both languages.",
          "Sí — cambia un precio, agrega un servicio, actualiza horarios o cambia fotos desde tu celular, en minutos. Te capacitamos antes del lanzamiento, y todo se publica en ambos idiomas.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "How does it help with no-shows?",
          "¿Cómo me ayuda con los no-shows?",
        ),
        answer: locBlocks(
          "Two ways: booking requests capture the service and time so confirmations happen by WhatsApp before the day, and for long or high-value appointments we can add optional online deposits — a client who paid a deposit shows up.",
          "De dos formas: las solicitudes de cita capturan el servicio y la hora para confirmar por WhatsApp antes del día, y para citas largas o de alto valor podemos agregar depósitos en línea opcionales — la clienta que pagó un depósito, llega.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "How long until my website is live?",
          "¿En cuánto tiempo estará lista mi página web?",
        ),
        answer: locBlocks(
          "A landing page with your menu and booking takes 2–3 weeks; a complete salon website takes 6–8 weeks. You'll receive a detailed timeline during the discovery phase.",
          "Una landing page con tu menú y reservas toma 2–3 semanas; un sitio web completo de salón toma 6–8 semanas. Recibirás un cronograma detallado durante la fase de descubrimiento.",
        ),
      },
    ],
  },

  // ── STRUCTURED DATA (industry-scoped Service — replaces the auto one) ─────
  structuredData: { en: salonServiceEn, es: salonServiceEs },
}

// ─────────────────────────────────────────────────────────────────────────────
// seo document (metadata)
// ─────────────────────────────────────────────────────────────────────────────

const salonesSeo = {
  _type: "seo",
  _id: "seo-paginas-web-para-salones-de-belleza",
  pageName: "paginas-web-para-salones-de-belleza",
  meta: {
    en: {
      title: "Salon & Spa Website Design | DR Web Studio",
      description:
        "Website design for beauty salons, spas and barbershops in the Dominican Republic: clear price menus, WhatsApp bookings and fewer no-shows. Free quotes.",
      keywords: [
        "salon website design dominican republic",
        "spa web design",
        "barbershop website",
      ],
    },
    es: {
      title: "Páginas Web para Salones de Belleza y Spas | DR Web Studio",
      description:
        "Páginas web para salones de belleza, spas y barberías en República Dominicana: precios claros, citas por WhatsApp y menos no-shows. Cotización gratis.",
      keywords: [
        "páginas web para salones de belleza",
        "página web para spa",
        "página web para barbería",
        "página web para mi salón",
        "diseño de páginas web para salones de belleza",
      ],
    },
  },
  openGraph: {
    en: {
      title: "Salon Websites — Your Feed Wins Hearts, Your Site Fills Chairs",
      description:
        "Clear prices, one-tap WhatsApp bookings and deposits that end no-shows. Bilingual websites for salons, spas and barbershops. Free quotes.",
    },
    es: {
      title:
        "Páginas Web para Salones — Tu Feed Enamora, Tu Página Llena Sillones",
      description:
        "Precios claros, citas por WhatsApp de un toque y depósitos que acaban con los no-shows. Páginas bilingües para salones, spas y barberías. Cotización gratis.",
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
    salonesPage as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded landing page: paginas-web-para-salones-de-belleza")

  await client.createOrReplace(
    salonesSeo as Parameters<typeof client.createOrReplace>[0],
  )
  console.log("✓ Seeded SEO doc: paginas-web-para-salones-de-belleza")

  console.log("")
  console.log("Next steps: see the header comment (seo.ts dropdown option,")
  console.log("ES + EN routes, city↔industry cross-links, sitemap check).")
}

seed().catch(console.error)
