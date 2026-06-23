/**
 * Seed script — Landing Pages
 *
 * Creates / replaces all 5 landing-page documents + their SEO documents.
 * Idempotent: safe to run multiple times (uses createOrReplace).
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seedLandingPages.ts
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
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

let _keyCounter = 0
const key = () => `key${++_keyCounter}`

const loc = (en: string, es: string) => ({ en, es })
const locArr = (en: string[], es: string[]) => ({ en, es })

// ─────────────────────────────────────────────────────────────────────────────
// Shared content blocks
// ─────────────────────────────────────────────────────────────────────────────

const sharedStats = [
  {
    _key: key(),
    value: "50+",
    label: loc("Websites Delivered", "Sitios Web Entregados"),
  },
  {
    _key: key(),
    value: "5+",
    label: loc("Years of Experience", "Años de Experiencia"),
  },
  {
    _key: key(),
    value: "4.9",
    label: loc("Average Rating", "Calificación Promedio"),
  },
  {
    _key: key(),
    value: "24/7",
    label: loc("Support Available", "Soporte Disponible"),
  },
]

const sharedTestimonials = [
  {
    _key: key(),
    quote: loc(
      "DR Web Studio transformed our online presence. Our new website loads in under 2 seconds and our inquiries increased by 60% in the first month.",
      "DR Web Studio transformó nuestra presencia online. Nuestro nuevo sitio carga en menos de 2 segundos y nuestras consultas aumentaron un 60% en el primer mes.",
    ),
    author: "María García",
    company: "Boutique Caribeña, Santo Domingo",
    rating: 5,
  },
  {
    _key: key(),
    quote: loc(
      "Professional, bilingual, and always available. James understood exactly what we needed for our Dominican market and delivered beyond expectations.",
      "Profesional, bilingüe y siempre disponible. James entendió exactamente lo que necesitábamos para el mercado dominicano y superó nuestras expectativas.",
    ),
    author: "Carlos Ramírez",
    company: "Restaurante El Mangú, Santiago",
    rating: 5,
  },
  {
    _key: key(),
    quote: loc(
      "The best investment we made for our business. Our e-commerce store now processes orders 24/7 and we've expanded to customers across all of the Dominican Republic.",
      "La mejor inversión que hemos hecho para nuestro negocio. Nuestra tienda en línea ahora procesa pedidos las 24 horas y hemos expandido a clientes en toda la República Dominicana.",
    ),
    author: "Ana Pérez",
    company: "Moda RD, La Romana",
    rating: 5,
  },
]

// NOTE: finalCta phone/WhatsApp intentionally omitted — the site contacts via
// email/forms only (no public phone). Structured data (LocalBusiness etc.) is
// now generated in code from the `generalLayout` singleton (src/lib/schema),
// NOT seeded here, so there's a single source of truth and no stale JSON.
const sharedFinalCta = {
  primaryCtaHref: "/contact",
  secondaryCtaHref: "/project-planner",
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 1 — desarrollo-web-republica-dominicana  (Hub)
// ─────────────────────────────────────────────────────────────────────────────

const page1: Record<string, unknown> = {
  _type: "landingPage",
  _id: "landingPage-desarrollo-web-republica-dominicana",
  title: "Desarrollo Web República Dominicana (Hub)",
  slug: { _type: "slug", current: "desarrollo-web-republica-dominicana" },
  hero: {
    headline: loc(
      "Professional Web Development in the Dominican Republic",
      "Desarrollo Web Profesional en República Dominicana",
    ),
    subheadline: loc(
      "We build fast, modern, and results-driven websites for businesses across the Dominican Republic. Bilingual support, transparent pricing, and local expertise.",
      "Creamos sitios web rápidos, modernos y orientados a resultados para empresas en toda la República Dominicana. Soporte bilingüe, precios transparentes y experiencia local.",
    ),
    primaryCta: loc("Get Free Quote", "Solicitar Cotización Gratis"),
    primaryCtaHref: "/contact",
    secondaryCta: loc("View Our Portfolio", "Ver Nuestro Portafolio"),
    secondaryCtaHref: "/portfolio",
    badge: loc(
      "Trusted by businesses across the Dominican Republic",
      "De confianza para empresas en toda la República Dominicana",
    ),
  },
  statsBar: sharedStats,
  servicesGrid: {
    sectionTitle: loc(
      "Everything Your Business Needs Online",
      "Todo lo que Tu Negocio Necesita en Línea",
    ),
    sectionSubtitle: loc(
      "From a simple landing page to a full e-commerce store, we have the right solution for your business.",
      "Desde una sencilla página de aterrizaje hasta una tienda en línea completa, tenemos la solución correcta para tu negocio.",
    ),
    items: [
      {
        _key: key(),
        icon: "Layout",
        title: loc("Landing Pages", "Páginas de Aterrizaje"),
        description: loc(
          "High-converting landing pages designed to turn visitors into customers. Perfect for campaigns, promotions, and specific services.",
          "Páginas de aterrizaje de alta conversión diseñadas para convertir visitantes en clientes. Perfectas para campañas, promociones y servicios específicos.",
        ),
        linkSlug: "landing-pages",
      },
      {
        _key: key(),
        icon: "ShoppingCart",
        title: loc("E-commerce Stores", "Tiendas en Línea"),
        description: loc(
          "Complete online stores with payment processing, inventory management, and order tracking. Accept Azul, PayPal, and more.",
          "Tiendas en línea completas con procesamiento de pagos, gestión de inventario y seguimiento de pedidos. Acepta Azul, PayPal y más.",
        ),
        linkSlug: "ecommerce",
      },
      {
        _key: key(),
        icon: "Globe",
        title: loc("Corporate Websites", "Sitios Web Corporativos"),
        description: loc(
          "Professional websites that represent your brand with authority. Custom design, fast loading, and optimized for Google.",
          "Sitios web profesionales que representan tu marca con autoridad. Diseño personalizado, carga rápida y optimizados para Google.",
        ),
        linkSlug: "custom-websites",
      },
      {
        _key: key(),
        icon: "Database",
        title: loc("CMS / WordPress", "CMS / WordPress"),
        description: loc(
          "Easy-to-manage websites built on WordPress or Sanity CMS. Update your own content without technical knowledge.",
          "Sitios web fáciles de gestionar construidos en WordPress o Sanity CMS. Actualiza tu propio contenido sin conocimientos técnicos.",
        ),
        linkSlug: "cms",
      },
      {
        _key: key(),
        icon: "Search",
        title: loc("SEO & Performance", "SEO y Rendimiento"),
        description: loc(
          "Get found on Google by Dominican customers. We optimize your site for speed, mobile, and local search rankings.",
          "Aparece en Google ante clientes dominicanos. Optimizamos tu sitio para velocidad, móvil y posicionamiento de búsqueda local.",
        ),
        linkSlug: "seo",
      },
      {
        _key: key(),
        icon: "Wrench",
        title: loc("Maintenance & Support", "Mantenimiento y Soporte"),
        description: loc(
          "Keep your website secure, fast, and up to date with our monthly maintenance plans. 24/7 monitoring included.",
          "Mantén tu sitio web seguro, rápido y actualizado con nuestros planes de mantenimiento mensuales. Monitoreo 24/7 incluido.",
        ),
        linkSlug: "maintenance",
      },
    ],
  },
  whyUs: {
    sectionTitle: loc(
      "Why Dominican Businesses Choose Us",
      "Por Qué los Negocios Dominicanos Nos Eligen",
    ),
    sectionSubtitle: loc(
      "We're not just another web agency — we understand the Dominican market, culture, and business needs.",
      "No somos solo otra agencia web — entendemos el mercado, la cultura y las necesidades de los negocios dominicanos.",
    ),
    items: [
      {
        _key: key(),
        icon: "Languages",
        title: loc("Fully Bilingual", "Completamente Bilingüe"),
        description: loc(
          "All our websites are available in Spanish and English, helping you reach both local and international customers.",
          "Todos nuestros sitios web están disponibles en español e inglés, ayudándote a llegar a clientes locales e internacionales.",
        ),
      },
      {
        _key: key(),
        icon: "Globe",
        title: loc("Local DR Expertise", "Experiencia Local en RD"),
        description: loc(
          "We know the Dominican market, payment systems (Azul), and customer behavior. Your site will be built for your audience.",
          "Conocemos el mercado dominicano, los sistemas de pago (Azul) y el comportamiento del cliente. Tu sitio será construido para tu audiencia.",
        ),
      },
      {
        _key: key(),
        icon: "Rocket",
        title: loc("Modern Technology", "Tecnología Moderna"),
        description: loc(
          "We use Next.js, React, and the latest web technologies to build sites that are fast, secure, and future-proof.",
          "Usamos Next.js, React y las últimas tecnologías web para construir sitios que son rápidos, seguros y preparados para el futuro.",
        ),
      },
      {
        _key: key(),
        icon: "Shield",
        title: loc("Transparent Pricing", "Precios Transparentes"),
        description: loc(
          "No hidden fees, no surprises. We provide clear quotes upfront and stick to our timelines and budgets.",
          "Sin costos ocultos, sin sorpresas. Proporcionamos cotizaciones claras por adelantado y cumplimos con nuestros plazos y presupuestos.",
        ),
      },
    ],
  },
  process: {
    sectionTitle: loc("Our Simple Process", "Nuestro Proceso Simple"),
    sectionSubtitle: loc(
      "From idea to launch in as little as 2-4 weeks. Here's how we work.",
      "De la idea al lanzamiento en tan solo 2-4 semanas. Así es como trabajamos.",
    ),
    steps: [
      {
        _key: key(),
        number: 1,
        icon: "MessageCircle",
        stepTitle: loc("Free Consultation", "Consulta Gratuita"),
        description: loc(
          "We discuss your goals, audience, and requirements. No obligation, no sales pressure — just a conversation about your project.",
          "Discutimos tus objetivos, audiencia y requisitos. Sin obligación, sin presión de ventas — solo una conversación sobre tu proyecto.",
        ),
        duration: loc("30-60 minutes", "30-60 minutos"),
      },
      {
        _key: key(),
        number: 2,
        icon: "Palette",
        stepTitle: loc("Design & Planning", "Diseño y Planificación"),
        description: loc(
          "We create wireframes and visual mockups for your approval before writing a single line of code.",
          "Creamos wireframes y maquetas visuales para tu aprobación antes de escribir una sola línea de código.",
        ),
        duration: loc("3-5 days", "3-5 días"),
      },
      {
        _key: key(),
        number: 3,
        icon: "Code",
        stepTitle: loc("Development", "Desarrollo"),
        description: loc(
          "We build your website with clean, fast, and secure code. Regular updates keep you informed throughout.",
          "Construimos tu sitio web con código limpio, rápido y seguro. Actualizaciones regulares te mantienen informado durante todo el proceso.",
        ),
        duration: loc("1-3 weeks", "1-3 semanas"),
      },
      {
        _key: key(),
        number: 4,
        icon: "Rocket",
        stepTitle: loc("Launch & Support", "Lanzamiento y Soporte"),
        description: loc(
          "We launch your site, train you on managing it, and provide 30 days of post-launch support at no extra cost.",
          "Lanzamos tu sitio, te capacitamos en su gestión y te brindamos 30 días de soporte post-lanzamiento sin costo adicional.",
        ),
        duration: loc("1-2 days", "1-2 días"),
      },
    ],
  },
  portfolioHighlight: {
    sectionTitle: loc("Recent Projects", "Proyectos Recientes"),
    sectionSubtitle: loc(
      "A sample of the websites we've built for Dominican businesses.",
      "Una muestra de los sitios web que hemos construido para negocios dominicanos.",
    ),
    projects: [],
    ctaText: loc("View Full Portfolio", "Ver Portafolio Completo"),
    ctaHref: "/portfolio",
  },
  testimonials: {
    sectionTitle: loc("What Our Clients Say", "Lo que Dicen Nuestros Clientes"),
    items: sharedTestimonials,
  },
  faq: {
    sectionTitle: loc("Frequently Asked Questions", "Preguntas Frecuentes"),
    sectionSubtitle: loc(
      "Everything you need to know about working with us.",
      "Todo lo que necesitas saber sobre trabajar con nosotros.",
    ),
    items: [
      {
        _key: key(),
        question: loc(
          "How much does a website cost in the Dominican Republic?",
          "¿Cuánto cuesta un sitio web en República Dominicana?",
        ),
        answer: loc(
          "Our websites start at $800 USD for a basic landing page and go up depending on complexity. We offer transparent pricing with no hidden fees. Contact us for a free quote tailored to your specific needs.",
          "Nuestros sitios web comienzan desde $800 USD para una página de aterrizaje básica y el precio varía según la complejidad. Ofrecemos precios transparentes sin costos ocultos. Contáctanos para una cotización gratuita adaptada a tus necesidades específicas.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "How long does it take to build a website?",
          "¿Cuánto tiempo tarda en desarrollarse un sitio web?",
        ),
        answer: loc(
          "A typical website takes 2-4 weeks from project start to launch. Simple landing pages can be done in 1-2 weeks, while complex e-commerce sites may take 6-8 weeks. We'll give you a specific timeline in your free consultation.",
          "Un sitio web típico tarda de 2 a 4 semanas desde el inicio del proyecto hasta el lanzamiento. Las páginas de aterrizaje simples pueden estar listas en 1-2 semanas, mientras que los sitios de e-commerce complejos pueden tomar 6-8 semanas. Te daremos un cronograma específico en tu consulta gratuita.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Do you work with clients across all of the Dominican Republic?",
          "¿Trabajan con clientes en todo el país?",
        ),
        answer: loc(
          "Yes! We work with clients across the entire Dominican Republic — Santo Domingo, Santiago, Punta Cana, La Romana, Puerto Plata, and everywhere in between. All consultations and meetings are available via video call.",
          "¡Sí! Trabajamos con clientes en toda la República Dominicana — Santo Domingo, Santiago, Punta Cana, La Romana, Puerto Plata y en todas partes. Todas las consultas y reuniones están disponibles por videollamada.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Will my website be in both Spanish and English?",
          "¿El sitio web será en español e inglés?",
        ),
        answer: loc(
          "Yes! All our websites are fully bilingual by default, available in both Spanish and English. This is especially valuable for Dominican businesses that serve international customers or tourists.",
          "¡Sí! Todos nuestros sitios web son completamente bilingüe por defecto, disponibles en español e inglés. Esto es especialmente valioso para negocios dominicanos que atienden a clientes internacionales o turistas.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Do you include hosting and domain?",
          "¿Incluyen hosting y dominio?",
        ),
        answer: loc(
          "Our development fees do not include hosting and domain (which typically run $100-300/year). However, we'll help you set up and configure everything. We recommend Vercel for hosting and Namecheap for domains.",
          "Nuestras tarifas de desarrollo no incluyen hosting y dominio (que típicamente cuestan $100-300/año). Sin embargo, te ayudaremos a configurar todo. Recomendamos Vercel para el hosting y Namecheap para los dominios.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "What happens after my website launches?",
          "¿Qué pasa después del lanzamiento de mi sitio?",
        ),
        answer: loc(
          "We provide 30 days of free post-launch support. After that, you can manage the site yourself or subscribe to one of our maintenance plans starting at $150/month, which includes updates, security monitoring, backups, and priority support.",
          "Proveemos 30 días de soporte post-lanzamiento gratuito. Después de eso, puedes gestionar el sitio tú mismo o suscribirte a uno de nuestros planes de mantenimiento desde $150/mes, que incluye actualizaciones, monitoreo de seguridad, respaldos y soporte prioritario.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Can you redesign my existing website?",
          "¿Pueden rediseñar mi sitio web existente?",
        ),
        answer: loc(
          "Absolutely! Website redesigns are one of our most common projects. We'll analyze your current site, identify what's working and what isn't, and build you something faster, more modern, and better converting.",
          "¡Absolutamente! Los rediseños de sitios web son uno de nuestros proyectos más comunes. Analizaremos tu sitio actual, identificaremos qué funciona y qué no, y te construiremos algo más rápido, más moderno y con mejor conversión.",
        ),
      },
    ],
  },
  finalCta: {
    headline: loc(
      "Ready to Grow Your Business Online?",
      "¿Listo para Hacer Crecer Tu Negocio en Línea?",
    ),
    subtext: loc(
      "Join 50+ Dominican businesses that trust DR Web Studio for their online presence. Get your free consultation today.",
      "Únete a más de 50 negocios dominicanos que confían en DR Web Studio para su presencia en línea. Obtén tu consulta gratuita hoy.",
    ),
    primaryBtn: loc("Get Free Quote", "Obtener Cotización Gratis"),
    primaryBtnHref: "/contact",
    secondaryBtn: loc("Plan My Project", "Planificar Mi Proyecto"),
    secondaryBtnHref: "/project-planner",
    ...sharedFinalCta,
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 2 — diseno-web-republica-dominicana
// ─────────────────────────────────────────────────────────────────────────────

const page2: Record<string, unknown> = {
  _type: "landingPage",
  _id: "landingPage-diseno-web-republica-dominicana",
  title: "Diseño Web República Dominicana",
  slug: { _type: "slug", current: "diseno-web-republica-dominicana" },
  hero: {
    headline: loc(
      "Web Design That Converts Visitors Into Customers",
      "Diseño Web que Convierte Visitantes en Clientes",
    ),
    subheadline: loc(
      "Beautiful, strategic web design for Dominican businesses. We create visual experiences that communicate your brand and drive real results.",
      "Diseño web hermoso y estratégico para negocios dominicanos. Creamos experiencias visuales que comunican tu marca y generan resultados reales.",
    ),
    primaryCta: loc(
      "Request Free Design Consultation",
      "Solicitar Consulta de Diseño Gratis",
    ),
    primaryCtaHref: "/contact",
    secondaryCta: loc("See Design Examples", "Ver Ejemplos de Diseño"),
    secondaryCtaHref: "/portfolio",
    badge: loc(
      "Award-winning web design in the Dominican Republic",
      "Diseño web galardonado en República Dominicana",
    ),
  },
  statsBar: sharedStats,
  servicesGrid: {
    sectionTitle: loc("Our Design Services", "Nuestros Servicios de Diseño"),
    sectionSubtitle: loc(
      "From brand identity to full website design, we cover every visual aspect of your online presence.",
      "Desde la identidad de marca hasta el diseño web completo, cubrimos cada aspecto visual de tu presencia en línea.",
    ),
    items: [
      {
        _key: key(),
        icon: "Monitor",
        title: loc("UI/UX Design", "Diseño UI/UX"),
        description: loc(
          "User-centered design that makes your website intuitive and enjoyable. We research your audience and design for how they actually think.",
          "Diseño centrado en el usuario que hace que tu sitio web sea intuitivo y agradable. Investigamos tu audiencia y diseñamos para cómo piensan realmente.",
        ),
      },
      {
        _key: key(),
        icon: "Layers",
        title: loc("Brand Identity", "Identidad de Marca"),
        description: loc(
          "Logo design, color palettes, typography, and brand guidelines that make your business instantly recognizable and memorable.",
          "Diseño de logo, paletas de colores, tipografía y guías de marca que hacen que tu negocio sea instantáneamente reconocible y memorable.",
        ),
      },
      {
        _key: key(),
        icon: "Smartphone",
        title: loc("Responsive Design", "Diseño Responsivo"),
        description: loc(
          "Every design we create works perfectly on phones, tablets, and desktops. Over 70% of Dominican users browse on mobile.",
          "Cada diseño que creamos funciona perfectamente en teléfonos, tabletas y escritorios. Más del 70% de los usuarios dominicanos navegan en móvil.",
        ),
      },
      {
        _key: key(),
        icon: "Layout",
        title: loc("Wireframing & Prototyping", "Wireframes y Prototipado"),
        description: loc(
          "Before we write code, we show you exactly how your site will look and work. Review and approve before development begins.",
          "Antes de escribir código, te mostramos exactamente cómo se verá y funcionará tu sitio. Revisa y aprueba antes de que comience el desarrollo.",
        ),
      },
      {
        _key: key(),
        icon: "ShoppingCart",
        title: loc("E-commerce Design", "Diseño de E-commerce"),
        description: loc(
          "Online store designs optimized for conversions. Product pages, cart flows, and checkout experiences that maximize sales.",
          "Diseños de tiendas en línea optimizados para conversiones. Páginas de productos, flujos de carrito y experiencias de pago que maximizan las ventas.",
        ),
      },
      {
        _key: key(),
        icon: "TrendingUp",
        title: loc("Conversion Optimization", "Optimización de Conversiones"),
        description: loc(
          "Data-driven design decisions that turn more visitors into leads and customers. A/B testing and heat mapping included.",
          "Decisiones de diseño basadas en datos que convierten más visitantes en clientes potenciales y clientes. Pruebas A/B y mapas de calor incluidos.",
        ),
      },
    ],
  },
  whyUs: {
    sectionTitle: loc(
      "Design That Works for the Dominican Market",
      "Diseño que Funciona para el Mercado Dominicano",
    ),
    sectionSubtitle: loc(
      "We don't just make things look good — we design for your specific audience and business goals.",
      "No solo hacemos que las cosas se vean bien — diseñamos para tu audiencia específica y objetivos de negocio.",
    ),
    items: [
      {
        _key: key(),
        icon: "Heart",
        title: loc(
          "Audience-First Approach",
          "Enfoque Centrado en la Audiencia",
        ),
        description: loc(
          "We research your target customer before designing a single pixel. The result: designs that resonate and convert.",
          "Investigamos tu cliente objetivo antes de diseñar un solo píxel. El resultado: diseños que resuenan y convierten.",
        ),
      },
      {
        _key: key(),
        icon: "Award",
        title: loc("Portfolio of 50+ Sites", "Portafolio de 50+ Sitios"),
        description: loc(
          "Our diverse portfolio spans restaurants, boutiques, agencies, e-commerce, and more — all designed for Dominican businesses.",
          "Nuestro portafolio diverso abarca restaurantes, boutiques, agencias, e-commerce y más — todos diseñados para negocios dominicanos.",
        ),
      },
      {
        _key: key(),
        icon: "Zap",
        title: loc(
          "Modern Animations & Interactions",
          "Animaciones e Interacciones Modernas",
        ),
        description: loc(
          "Subtle animations and micro-interactions that make your site feel premium and professional without slowing it down.",
          "Animaciones sutiles e interacciones que hacen que tu sitio se sienta premium y profesional sin ralentizarlo.",
        ),
      },
      {
        _key: key(),
        icon: "Shield",
        title: loc("Unlimited Revisions", "Revisiones Ilimitadas"),
        description: loc(
          "We iterate until you're 100% happy with the design. Your satisfaction is our only deadline for the design phase.",
          "Iteramos hasta que estés 100% satisfecho con el diseño. Tu satisfacción es nuestro único plazo para la fase de diseño.",
        ),
      },
    ],
  },
  process: {
    sectionTitle: loc("The Design Process", "El Proceso de Diseño"),
    sectionSubtitle: loc(
      "From research to pixel-perfect implementation.",
      "De la investigación a la implementación pixel perfecta.",
    ),
    steps: [
      {
        _key: key(),
        number: 1,
        icon: "Search",
        stepTitle: loc(
          "Research & Discovery",
          "Investigación y Descubrimiento",
        ),
        description: loc(
          "We analyze your competitors, audience, and brand to understand the design direction before touching any tools.",
          "Analizamos tus competidores, audiencia y marca para entender la dirección de diseño antes de tocar ninguna herramienta.",
        ),
        duration: loc("1-2 days", "1-2 días"),
      },
      {
        _key: key(),
        number: 2,
        icon: "Layout",
        stepTitle: loc("Wireframes", "Wireframes"),
        description: loc(
          "We map out the structure and layout of each page so you can see the information architecture before visual design.",
          "Trazamos la estructura y disposición de cada página para que puedas ver la arquitectura de información antes del diseño visual.",
        ),
        duration: loc("2-3 days", "2-3 días"),
      },
      {
        _key: key(),
        number: 3,
        icon: "Palette",
        stepTitle: loc("Visual Design", "Diseño Visual"),
        description: loc(
          "Full-color mockups with your brand, typography, and imagery. We present 2 design directions for you to choose from.",
          "Maquetas a todo color con tu marca, tipografía e imágenes. Presentamos 2 direcciones de diseño para que elijas.",
        ),
        duration: loc("3-5 days", "3-5 días"),
      },
      {
        _key: key(),
        number: 4,
        icon: "Code",
        stepTitle: loc("Development", "Desarrollo"),
        description: loc(
          "We bring the approved design to life with clean, fast code — pixel-perfect on every device.",
          "Damos vida al diseño aprobado con código limpio y rápido — pixel perfecto en cada dispositivo.",
        ),
        duration: loc("1-2 weeks", "1-2 semanas"),
      },
    ],
  },
  portfolioHighlight: {
    sectionTitle: loc(
      "Design Work We're Proud Of",
      "Trabajo de Diseño del que Estamos Orgullosos",
    ),
    sectionSubtitle: loc(
      "Real websites built for real Dominican businesses.",
      "Sitios web reales construidos para negocios dominicanos reales.",
    ),
    projects: [],
    ctaText: loc("View All Design Work", "Ver Todo el Trabajo de Diseño"),
    ctaHref: "/portfolio",
  },
  testimonials: {
    sectionTitle: loc(
      "Clients Love Our Design Work",
      "A Nuestros Clientes Les Encanta Nuestro Diseño",
    ),
    items: sharedTestimonials,
  },
  faq: {
    sectionTitle: loc("Design FAQ", "Preguntas sobre Diseño"),
    sectionSubtitle: loc(
      "Common questions about our web design process.",
      "Preguntas comunes sobre nuestro proceso de diseño web.",
    ),
    items: [
      {
        _key: key(),
        question: loc(
          "What's the difference between web design and using a template?",
          "¿Cuál es la diferencia entre el diseño web y usar una plantilla?",
        ),
        answer: loc(
          "Templates are generic and used by thousands of businesses. Custom web design is unique to your brand, optimized for your specific audience, and designed to achieve your exact business goals. The difference in conversion rates and brand perception is significant.",
          "Las plantillas son genéricas y las usan miles de negocios. El diseño web personalizado es único para tu marca, optimizado para tu audiencia específica y diseñado para lograr tus objetivos de negocio exactos. La diferencia en tasas de conversión y percepción de marca es significativa.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Do you work with my existing brand or create a new one?",
          "¿Trabajan con mi marca existente o crean una nueva?",
        ),
        answer: loc(
          "Both! If you have existing brand guidelines (logo, colors, fonts), we'll follow them precisely. If you need a new brand identity, we offer full branding packages as part of the design project.",
          "¡Ambos! Si tienes lineamientos de marca existentes (logo, colores, fuentes), los seguiremos con precisión. Si necesitas una nueva identidad de marca, ofrecemos paquetes de branding completos como parte del proyecto de diseño.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "How many design revisions are included?",
          "¿Cuántas revisiones de diseño están incluidas?",
        ),
        answer: loc(
          "We include unlimited revisions during the design phase. We won't move to development until you're completely happy with the design. Our goal is for you to love what we create.",
          "Incluimos revisiones ilimitadas durante la fase de diseño. No pasaremos al desarrollo hasta que estés completamente satisfecho con el diseño. Nuestro objetivo es que ames lo que creamos.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Will the design work on mobile phones?",
          "¿El diseño funcionará en teléfonos móviles?",
        ),
        answer: loc(
          "Always. Every design we create is fully responsive and mobile-first. We design for mobile screens first, then scale up to tablets and desktops. Given that 70%+ of web traffic in the Dominican Republic comes from mobile devices, this is non-negotiable.",
          "Siempre. Cada diseño que creamos es completamente responsivo y mobile-first. Diseñamos primero para pantallas móviles, luego escalamos a tabletas y escritorios. Dado que más del 70% del tráfico web en República Dominicana proviene de dispositivos móviles, esto no es negociable.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Can I see examples of your design work?",
          "¿Puedo ver ejemplos de su trabajo de diseño?",
        ),
        answer: loc(
          "Absolutely! Visit our portfolio page to see recent projects across different industries. We're happy to share additional examples relevant to your specific industry during a consultation.",
          "¡Absolutamente! Visita nuestra página de portafolio para ver proyectos recientes en diferentes industrias. Estamos felices de compartir ejemplos adicionales relevantes para tu industria específica durante una consulta.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Do you include animations and visual effects?",
          "¿Incluyen animaciones y efectos visuales?",
        ),
        answer: loc(
          "Yes! We include tasteful scroll animations, hover effects, and micro-interactions that make your site feel premium. All animations are optimized for performance so they won't slow down your site or hurt your SEO.",
          "¡Sí! Incluimos animaciones de desplazamiento elegantes, efectos de hover e interacciones que hacen que tu sitio se sienta premium. Todas las animaciones están optimizadas para el rendimiento para que no ralenticen tu sitio ni perjudiquen tu SEO.",
        ),
      },
    ],
  },
  finalCta: {
    headline: loc(
      "Let's Design Something Memorable Together",
      "Diseñemos Algo Memorable Juntos",
    ),
    subtext: loc(
      "Your brand deserves a website that stands out. Get a free design consultation and see what's possible.",
      "Tu marca merece un sitio web que destaque. Obtén una consulta de diseño gratuita y ve lo que es posible.",
    ),
    primaryBtn: loc("Start My Design Project", "Iniciar Mi Proyecto de Diseño"),
    primaryBtnHref: "/contact",
    secondaryBtn: loc("Plan My Project", "Planificar Mi Proyecto"),
    secondaryBtnHref: "/project-planner",
    ...sharedFinalCta,
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 3 — desarrollo-web-punta-cana
// ─────────────────────────────────────────────────────────────────────────────

const page3: Record<string, unknown> = {
  _type: "landingPage",
  _id: "landingPage-desarrollo-web-punta-cana",
  title: "Desarrollo Web Punta Cana",
  slug: { _type: "slug", current: "desarrollo-web-punta-cana" },
  hero: {
    headline: loc(
      "Web Development in Punta Cana",
      "Desarrollo Web en Punta Cana",
    ),
    subheadline: loc(
      "Fast, multilingual websites for hotels, restaurants, tour operators, and businesses in Punta Cana. Designed to attract international tourists and local customers alike.",
      "Sitios web rápidos y multilingüe para hoteles, restaurantes, operadoras de tours y negocios en Punta Cana. Diseñados para atraer turistas internacionales y clientes locales por igual.",
    ),
    primaryCta: loc("Get Free Quote", "Solicitar Cotización Gratis"),
    primaryCtaHref: "/contact",
    secondaryCta: loc("View Tourism Projects", "Ver Proyectos de Turismo"),
    secondaryCtaHref: "/portfolio",
    badge: loc(
      "Specialists in Punta Cana hospitality & tourism websites",
      "Especialistas en sitios web para hotelería y turismo en Punta Cana",
    ),
  },
  statsBar: sharedStats,
  servicesGrid: {
    sectionTitle: loc(
      "Web Solutions for Punta Cana Businesses",
      "Soluciones Web para Negocios en Punta Cana",
    ),
    sectionSubtitle: loc(
      "Tailored for the unique needs of the tourism and hospitality industry in the Punta Cana area.",
      "Adaptadas a las necesidades únicas de la industria turística y hotelera en la zona de Punta Cana.",
    ),
    items: [
      {
        _key: key(),
        icon: "Globe",
        title: loc("Hotel & Resort Websites", "Sitios para Hoteles y Resorts"),
        description: loc(
          "Stunning multilingual hotel websites with virtual tours, gallery, amenities, and direct booking capabilities to reduce OTA commissions.",
          "Impresionantes sitios web multilingüe para hoteles con tours virtuales, galería, amenidades y capacidades de reserva directa para reducir las comisiones de las OTAs.",
        ),
      },
      {
        _key: key(),
        icon: "Layout",
        title: loc("Restaurant & Menu Sites", "Sitios de Restaurantes y Menús"),
        description: loc(
          "Digital menus in English, Spanish, French, and more. Reservation systems, gallery, and online ordering for tourist-facing restaurants.",
          "Menús digitales en inglés, español, francés y más. Sistemas de reservas, galería y pedidos en línea para restaurantes orientados al turista.",
        ),
      },
      {
        _key: key(),
        icon: "Search",
        title: loc("Tourism SEO", "SEO Turístico"),
        description: loc(
          "Get found by tourists searching for things to do in Punta Cana. We optimize for international search in English, Spanish, and other languages.",
          "Sé encontrado por turistas buscando qué hacer en Punta Cana. Optimizamos para búsquedas internacionales en inglés, español y otros idiomas.",
        ),
      },
      {
        _key: key(),
        icon: "ShoppingCart",
        title: loc(
          "Tour & Activity Booking",
          "Reservas de Tours y Actividades",
        ),
        description: loc(
          "Online booking systems for excursions, activities, and experiences. Accept PayPal, Stripe, and credit cards from international visitors.",
          "Sistemas de reservas en línea para excursiones, actividades y experiencias. Acepta PayPal, Stripe y tarjetas de crédito de visitantes internacionales.",
        ),
      },
      {
        _key: key(),
        icon: "Smartphone",
        title: loc("Mobile-Optimized", "Optimizado para Móvil"),
        description: loc(
          "Tourists browse on phones. All our sites load in under 2 seconds on mobile data, ensuring you never lose a potential customer.",
          "Los turistas navegan en sus teléfonos. Todos nuestros sitios cargan en menos de 2 segundos en datos móviles, asegurando que nunca pierdas un cliente potencial.",
        ),
      },
      {
        _key: key(),
        icon: "Languages",
        title: loc("Multilingual Websites", "Sitios Web Multilingüe"),
        description: loc(
          "Reach tourists from the USA, Canada, Europe, and Latin America. We build sites in English, Spanish, French, German, and more.",
          "Llega a turistas de EE.UU., Canadá, Europa y América Latina. Construimos sitios en inglés, español, francés, alemán y más.",
        ),
      },
    ],
  },
  whyUs: {
    sectionTitle: loc(
      "Built for the Punta Cana Tourism Market",
      "Construido para el Mercado Turístico de Punta Cana",
    ),
    sectionSubtitle: loc(
      "We understand what international tourists expect from a website — and we deliver it.",
      "Entendemos lo que los turistas internacionales esperan de un sitio web — y lo entregamos.",
    ),
    items: [
      {
        _key: key(),
        icon: "Globe",
        title: loc(
          "Tourism Industry Experience",
          "Experiencia en la Industria Turística",
        ),
        description: loc(
          "We've built websites for hotels, tour operators, restaurants, and activity providers in the Punta Cana area.",
          "Hemos construido sitios web para hoteles, operadoras de tours, restaurantes y proveedores de actividades en la zona de Punta Cana.",
        ),
      },
      {
        _key: key(),
        icon: "Languages",
        title: loc("Multilingual by Default", "Multilingüe por Defecto"),
        description: loc(
          "Spanish + English included in every project, with French, German, and other languages available as add-ons.",
          "Español + inglés incluido en cada proyecto, con francés, alemán y otros idiomas disponibles como complementos.",
        ),
      },
      {
        _key: key(),
        icon: "Rocket",
        title: loc("Fast International Loading", "Carga Internacional Rápida"),
        description: loc(
          "We use global CDN networks to ensure your site loads fast for visitors from the USA, Canada, Europe, and Latin America.",
          "Usamos redes CDN globales para asegurar que tu sitio cargue rápido para visitantes de EE.UU., Canadá, Europa y América Latina.",
        ),
      },
      {
        _key: key(),
        icon: "Shield",
        title: loc("24/7 Monitoring", "Monitoreo 24/7"),
        description: loc(
          "Tourism is a 24/7 business. We monitor your site around the clock and respond to any issues within 2 hours.",
          "El turismo es un negocio 24/7. Monitoreamos tu sitio las 24 horas y respondemos a cualquier problema en 2 horas.",
        ),
      },
    ],
  },
  process: {
    sectionTitle: loc(
      "How We Work With Punta Cana Businesses",
      "Cómo Trabajamos con Negocios de Punta Cana",
    ),
    sectionSubtitle: loc(
      "All meetings via video call — no need to travel.",
      "Todas las reuniones por videollamada — sin necesidad de viajar.",
    ),
    steps: [
      {
        _key: key(),
        number: 1,
        icon: "MessageCircle",
        stepTitle: loc("Video Consultation", "Consulta por Video"),
        description: loc(
          "We meet via Zoom or WhatsApp video to understand your business, guests, and goals for your new website.",
          "Nos reunimos por Zoom o video de WhatsApp para entender tu negocio, huéspedes y objetivos para tu nuevo sitio web.",
        ),
        duration: loc("30-60 minutes", "30-60 minutos"),
      },
      {
        _key: key(),
        number: 2,
        icon: "Search",
        stepTitle: loc("Market Research", "Investigación de Mercado"),
        description: loc(
          "We analyze your competitors and international tourism search trends to position your site for maximum visibility.",
          "Analizamos tus competidores y las tendencias de búsqueda del turismo internacional para posicionar tu sitio para máxima visibilidad.",
        ),
        duration: loc("2-3 days", "2-3 días"),
      },
      {
        _key: key(),
        number: 3,
        icon: "Code",
        stepTitle: loc("Multilingual Development", "Desarrollo Multilingüe"),
        description: loc(
          "We build your site with all required languages simultaneously, ensuring consistent quality across every version.",
          "Construimos tu sitio con todos los idiomas requeridos simultáneamente, asegurando calidad consistente en cada versión.",
        ),
        duration: loc("2-3 weeks", "2-3 semanas"),
      },
      {
        _key: key(),
        number: 4,
        icon: "Rocket",
        stepTitle: loc("Launch & SEO Setup", "Lanzamiento y Configuración SEO"),
        description: loc(
          "We launch your site and set up Google Search Console, Google My Business, and local/international SEO foundations.",
          "Lanzamos tu sitio y configuramos Google Search Console, Google My Business y los fundamentos de SEO local/internacional.",
        ),
        duration: loc("1-2 days", "1-2 días"),
      },
    ],
  },
  portfolioHighlight: {
    sectionTitle: loc(
      "Punta Cana & Tourism Projects",
      "Proyectos de Punta Cana y Turismo",
    ),
    sectionSubtitle: loc(
      "Websites built for the hospitality and tourism sector.",
      "Sitios web construidos para el sector de hospitalidad y turismo.",
    ),
    projects: [],
    ctaText: loc("View All Projects", "Ver Todos los Proyectos"),
    ctaHref: "/portfolio",
  },
  testimonials: {
    sectionTitle: loc(
      "What Our Tourism Clients Say",
      "Lo que Dicen Nuestros Clientes del Sector Turístico",
    ),
    items: sharedTestimonials,
  },
  faq: {
    sectionTitle: loc(
      "Punta Cana Web Development FAQ",
      "Preguntas sobre Desarrollo Web en Punta Cana",
    ),
    sectionSubtitle: loc(
      "Common questions from Punta Cana businesses.",
      "Preguntas comunes de negocios en Punta Cana.",
    ),
    items: [
      {
        _key: key(),
        question: loc(
          "Can you build my site in multiple languages for international tourists?",
          "¿Pueden hacer el sitio en varios idiomas para turistas internacionales?",
        ),
        answer: loc(
          "Yes! We specialize in multilingual websites. Spanish and English are included in all projects. French, German, Italian, Portuguese, and other languages are available as add-ons. We work with professional translators to ensure natural-sounding content in every language.",
          "¡Sí! Nos especializamos en sitios web multilingüe. El español y el inglés están incluidos en todos los proyectos. El francés, alemán, italiano, portugués y otros idiomas están disponibles como complementos. Trabajamos con traductores profesionales para asegurar contenido natural en cada idioma.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Do you work with hotels and resorts in Punta Cana?",
          "¿Trabajan con hoteles y resorts en Punta Cana?",
        ),
        answer: loc(
          "Yes! We have experience working with hospitality businesses in the Punta Cana area. We understand the unique needs of hotel websites: direct booking, virtual tours, gallery management, restaurant menus, and connecting with international booking platforms.",
          "¡Sí! Tenemos experiencia trabajando con negocios hoteleros en la zona de Punta Cana. Entendemos las necesidades únicas de los sitios web de hoteles: reserva directa, tours virtuales, gestión de galería, menús de restaurante y conexión con plataformas de reserva internacionales.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Can you integrate online booking for tours and excursions?",
          "¿Integran sistemas de reserva online para tours y excursiones?",
        ),
        answer: loc(
          "Absolutely! We integrate booking systems that allow tourists to reserve and pay online directly through your website. This reduces reliance on third-party platforms and their commissions. We can integrate with popular booking platforms or build a custom booking system.",
          "¡Absolutamente! Integramos sistemas de reservas que permiten a los turistas reservar y pagar en línea directamente a través de tu sitio web. Esto reduce la dependencia de las plataformas de terceros y sus comisiones. Podemos integrarnos con plataformas de reservas populares o construir un sistema de reservas personalizado.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Will my site be optimized for tourists searching from abroad?",
          "¿El sitio estará optimizado para búsquedas de turistas desde el extranjero?",
        ),
        answer: loc(
          "Yes! Our SEO strategy includes international optimization so your site ranks for searches like 'things to do in Punta Cana', 'best restaurants Punta Cana', or 'Punta Cana hotels' from the US, Canada, Europe, and beyond.",
          "¡Sí! Nuestra estrategia de SEO incluye optimización internacional para que tu sitio aparezca en búsquedas como 'qué hacer en Punta Cana', 'mejores restaurantes Punta Cana' u 'hoteles Punta Cana' desde EE.UU., Canadá, Europa y más.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "How fast will my website load for international visitors?",
          "¿Qué tan rápido cargará mi sitio web para visitantes internacionales?",
        ),
        answer: loc(
          "We optimize all sites to load in under 2 seconds globally using Vercel's global CDN network with servers in the US, Europe, and Asia. This ensures tourists from any country see your site load instantly.",
          "Optimizamos todos los sitios para cargar en menos de 2 segundos globalmente usando la red CDN global de Vercel con servidores en EE.UU., Europa y Asia. Esto asegura que los turistas de cualquier país vean tu sitio cargando instantáneamente.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "How much does a hotel website cost in Punta Cana?",
          "¿Cuánto cuesta un sitio web para un hotel en Punta Cana?",
        ),
        answer: loc(
          "Hotel websites typically range from $1,500-4,000 USD depending on the number of languages, booking system complexity, and features needed. We'll provide a detailed quote after a free consultation. All prices are transparent — no hidden fees.",
          "Los sitios web de hoteles típicamente oscilan entre $1,500-4,000 USD dependiendo del número de idiomas, la complejidad del sistema de reservas y las funciones necesarias. Proporcionaremos una cotización detallada después de una consulta gratuita. Todos los precios son transparentes — sin costos ocultos.",
        ),
      },
    ],
  },
  finalCta: {
    headline: loc(
      "Ready to Attract More Tourists to Your Punta Cana Business?",
      "¿Listo para Atraer Más Turistas a Tu Negocio en Punta Cana?",
    ),
    subtext: loc(
      "Get a free consultation and discover how a professional website can grow your tourism business.",
      "Obtén una consulta gratuita y descubre cómo un sitio web profesional puede hacer crecer tu negocio turístico.",
    ),
    primaryBtn: loc("Get Free Quote", "Obtener Cotización Gratis"),
    primaryBtnHref: "/contact",
    secondaryBtn: loc("Plan My Project", "Planificar Mi Proyecto"),
    secondaryBtnHref: "/project-planner",
    ...sharedFinalCta,
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 4 — desarrollo-ecommerce-republica-dominicana
// ─────────────────────────────────────────────────────────────────────────────

const page4: Record<string, unknown> = {
  _type: "landingPage",
  _id: "landingPage-desarrollo-ecommerce-republica-dominicana",
  title: "Desarrollo E-commerce República Dominicana",
  slug: { _type: "slug", current: "desarrollo-ecommerce-republica-dominicana" },
  hero: {
    headline: loc(
      "Launch Your Online Store in the Dominican Republic",
      "Lanza Tu Tienda Online en República Dominicana",
    ),
    subheadline: loc(
      "Professional e-commerce websites built for the Dominican market. Accept Azul, PayPal, Stripe, and more. Start selling online in weeks.",
      "Sitios web de e-commerce profesionales construidos para el mercado dominicano. Acepta Azul, PayPal, Stripe y más. Empieza a vender online en semanas.",
    ),
    primaryCta: loc("Start My Online Store", "Iniciar Mi Tienda Online"),
    primaryCtaHref: "/contact",
    secondaryCta: loc("See E-commerce Examples", "Ver Ejemplos de Tiendas"),
    secondaryCtaHref: "/portfolio",
    badge: loc(
      "Dominican e-commerce specialists — Azul payment integration included",
      "Especialistas en e-commerce dominicano — integración de pago Azul incluida",
    ),
  },
  statsBar: sharedStats,
  servicesGrid: {
    sectionTitle: loc(
      "E-commerce Solutions for the Dominican Market",
      "Soluciones de E-commerce para el Mercado Dominicano",
    ),
    sectionSubtitle: loc(
      "Everything you need to sell online in the Dominican Republic and beyond.",
      "Todo lo que necesitas para vender online en República Dominicana y más allá.",
    ),
    items: [
      {
        _key: key(),
        icon: "ShoppingCart",
        title: loc(
          "Custom E-commerce Development",
          "Desarrollo de E-commerce Personalizado",
        ),
        description: loc(
          "Fully custom online stores built on Next.js or WooCommerce — optimized for Dominican customers and international buyers.",
          "Tiendas en línea completamente personalizadas construidas en Next.js o WooCommerce — optimizadas para clientes dominicanos y compradores internacionales.",
        ),
      },
      {
        _key: key(),
        icon: "Globe",
        title: loc("Azul Payment Integration", "Integración de Pago con Azul"),
        description: loc(
          "Accept Dominican credit and debit cards through Azul (Visanet). We handle the complete integration and certification process.",
          "Acepta tarjetas de crédito y débito dominicanas a través de Azul (Visanet). Manejamos el proceso completo de integración y certificación.",
        ),
      },
      {
        _key: key(),
        icon: "Database",
        title: loc("Inventory Management", "Gestión de Inventario"),
        description: loc(
          "Real-time inventory tracking, low stock alerts, variant management (size, color), and bulk import/export capabilities.",
          "Seguimiento de inventario en tiempo real, alertas de stock bajo, gestión de variantes (talla, color) y capacidades de importación/exportación masiva.",
        ),
      },
      {
        _key: key(),
        icon: "TrendingUp",
        title: loc("Sales Analytics", "Análisis de Ventas"),
        description: loc(
          "Dashboard with revenue reports, best-selling products, customer behavior, and conversion funnel analysis to grow your store.",
          "Dashboard con informes de ingresos, productos más vendidos, comportamiento del cliente y análisis del embudo de conversión para hacer crecer tu tienda.",
        ),
      },
      {
        _key: key(),
        icon: "Smartphone",
        title: loc("Mobile Commerce", "Comercio Móvil"),
        description: loc(
          "Mobile-first checkout experience optimized for Dominican shoppers on smartphones. Fast, simple, and secure.",
          "Experiencia de pago mobile-first optimizada para compradores dominicanos en smartphones. Rápida, simple y segura.",
        ),
      },
      {
        _key: key(),
        icon: "Zap",
        title: loc(
          "WhatsApp & Social Commerce",
          "Comercio por WhatsApp y Redes Sociales",
        ),
        description: loc(
          "Integration with WhatsApp Business, Instagram Shopping, and Facebook Shop to sell across all channels.",
          "Integración con WhatsApp Business, Instagram Shopping y Facebook Shop para vender en todos los canales.",
        ),
      },
    ],
  },
  whyUs: {
    sectionTitle: loc(
      "Why Dominican Businesses Choose Us for E-commerce",
      "Por Qué los Negocios Dominicanos Nos Eligen para E-commerce",
    ),
    sectionSubtitle: loc(
      "We know the Dominican e-commerce landscape — the payment systems, logistics, and customer expectations.",
      "Conocemos el panorama del e-commerce dominicano — los sistemas de pago, la logística y las expectativas del cliente.",
    ),
    items: [
      {
        _key: key(),
        icon: "Shield",
        title: loc(
          "Azul-Certified Integration",
          "Integración Certificada por Azul",
        ),
        description: loc(
          "We've integrated Azul payment processing for multiple Dominican businesses. We know the process, requirements, and technical details.",
          "Hemos integrado el procesamiento de pagos Azul para múltiples negocios dominicanos. Conocemos el proceso, los requisitos y los detalles técnicos.",
        ),
      },
      {
        _key: key(),
        icon: "Globe",
        title: loc("DOP & USD Pricing", "Precios en DOP y USD"),
        description: loc(
          "Sell in Dominican pesos or US dollars. We can configure automatic currency conversion so customers always see their preferred currency.",
          "Vende en pesos dominicanos o dólares americanos. Podemos configurar conversión automática de moneda para que los clientes siempre vean su moneda preferida.",
        ),
      },
      {
        _key: key(),
        icon: "Rocket",
        title: loc("Fast Store Performance", "Rendimiento Rápido de la Tienda"),
        description: loc(
          "Slow stores lose customers. Our stores load in under 2 seconds even with large product catalogs, reducing cart abandonment.",
          "Las tiendas lentas pierden clientes. Nuestras tiendas cargan en menos de 2 segundos incluso con grandes catálogos de productos, reduciendo el abandono del carrito.",
        ),
      },
      {
        _key: key(),
        icon: "Users",
        title: loc("Post-Launch Training", "Capacitación Post-Lanzamiento"),
        description: loc(
          "We train you and your team to manage products, orders, and customers. You'll be independent from day one.",
          "Te capacitamos a ti y a tu equipo para gestionar productos, pedidos y clientes. Serás independiente desde el primer día.",
        ),
      },
    ],
  },
  process: {
    sectionTitle: loc(
      "From Idea to Online Store",
      "De la Idea a la Tienda Online",
    ),
    sectionSubtitle: loc(
      "Launch your e-commerce store in 4-8 weeks.",
      "Lanza tu tienda en línea en 4-8 semanas.",
    ),
    steps: [
      {
        _key: key(),
        number: 1,
        icon: "MessageCircle",
        stepTitle: loc(
          "Free Strategy Session",
          "Sesión de Estrategia Gratuita",
        ),
        description: loc(
          "We discuss your products, target market, payment needs, and logistics to create the right e-commerce strategy for your business.",
          "Discutimos tus productos, mercado objetivo, necesidades de pago y logística para crear la estrategia de e-commerce correcta para tu negocio.",
        ),
        duration: loc("1 hour", "1 hora"),
      },
      {
        _key: key(),
        number: 2,
        icon: "Layout",
        stepTitle: loc(
          "Store Design & Structure",
          "Diseño y Estructura de la Tienda",
        ),
        description: loc(
          "We design your product catalog, category structure, and checkout flow for maximum conversions and ease of use.",
          "Diseñamos tu catálogo de productos, estructura de categorías y flujo de pago para máximas conversiones y facilidad de uso.",
        ),
        duration: loc("3-5 days", "3-5 días"),
      },
      {
        _key: key(),
        number: 3,
        icon: "Code",
        stepTitle: loc(
          "Development & Payment Integration",
          "Desarrollo e Integración de Pagos",
        ),
        description: loc(
          "We build your store and integrate Azul, PayPal, and other payment methods. Full testing before any payment goes live.",
          "Construimos tu tienda e integramos Azul, PayPal y otros métodos de pago. Pruebas completas antes de que cualquier pago sea procesado.",
        ),
        duration: loc("3-6 weeks", "3-6 semanas"),
      },
      {
        _key: key(),
        number: 4,
        icon: "Rocket",
        stepTitle: loc("Launch & Training", "Lanzamiento y Capacitación"),
        description: loc(
          "We launch your store, train your team, and provide 30 days of support to help you through your first sales.",
          "Lanzamos tu tienda, capacitamos a tu equipo y proveemos 30 días de soporte para ayudarte con tus primeras ventas.",
        ),
        duration: loc("1-2 days", "1-2 días"),
      },
    ],
  },
  portfolioHighlight: {
    sectionTitle: loc(
      "E-commerce Stores We've Built",
      "Tiendas E-commerce que Hemos Construido",
    ),
    sectionSubtitle: loc(
      "Real Dominican online stores generating real revenue.",
      "Tiendas en línea dominicanas reales generando ingresos reales.",
    ),
    projects: [],
    ctaText: loc("View E-commerce Portfolio", "Ver Portafolio de E-commerce"),
    ctaHref: "/portfolio",
  },
  testimonials: {
    sectionTitle: loc(
      "Dominican E-commerce Success Stories",
      "Historias de Éxito de E-commerce Dominicano",
    ),
    items: sharedTestimonials,
  },
  faq: {
    sectionTitle: loc(
      "E-commerce FAQ",
      "Preguntas Frecuentes sobre E-commerce",
    ),
    sectionSubtitle: loc(
      "Everything you need to know about selling online in the Dominican Republic.",
      "Todo lo que necesitas saber sobre vender online en República Dominicana.",
    ),
    items: [
      {
        _key: key(),
        question: loc(
          "What payment gateways do you integrate?",
          "¿Qué pasarelas de pago integran?",
        ),
        answer: loc(
          "We integrate Azul (local Dominican processing), PayPal, Stripe (for international cards), and credit/debit cards. We also support cash on delivery (contra reembolso) if needed for your business model.",
          "Integramos Azul (procesamiento dominicano local), PayPal, Stripe (para tarjetas internacionales) y tarjetas de crédito/débito. También soportamos pago contra reembolso si es necesario para tu modelo de negocio.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Can you integrate Azul as a payment gateway?",
          "¿Pueden integrar Azul como pasarela de pago?",
        ),
        answer: loc(
          "Yes! We have direct experience integrating Azul (Visanet) for Dominican businesses. We handle the technical integration and can guide you through the Azul merchant application process. This allows your customers to pay with local Dominican credit and debit cards.",
          "¡Sí! Tenemos experiencia directa integrando Azul (Visanet) para negocios dominicanos. Manejamos la integración técnica y podemos guiarte a través del proceso de solicitud de comerciante de Azul. Esto permite que tus clientes paguen con tarjetas de crédito y débito dominicanas locales.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "How many products can my store have?",
          "¿Cuántos productos puede tener mi tienda?",
        ),
        answer: loc(
          "No limits. Our e-commerce platforms handle stores from 10 to 10,000+ products. We can help you import large catalogs via CSV and manage them efficiently with categories, tags, and variants.",
          "Sin límites. Nuestras plataformas de e-commerce manejan tiendas desde 10 hasta más de 10,000 productos. Podemos ayudarte a importar catálogos grandes vía CSV y gestionarlos eficientemente con categorías, etiquetas y variantes.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Can I sell in both Dominican pesos (DOP) and US dollars (USD)?",
          "¿Puedo vender en pesos dominicanos (DOP) y dólares americanos (USD)?",
        ),
        answer: loc(
          "Yes! We can configure your store to display prices in DOP with automatic conversion to USD (or vice versa), or show both currencies simultaneously. The checkout currency depends on which payment gateway is used.",
          "¡Sí! Podemos configurar tu tienda para mostrar precios en DOP con conversión automática a USD (o viceversa), o mostrar ambas monedas simultáneamente. La moneda de pago depende de qué pasarela de pago se utilice.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Can I sell on Instagram and Facebook too?",
          "¿Puedo vender también en Instagram y Facebook?",
        ),
        answer: loc(
          "Yes! We integrate your store with Instagram Shopping and Facebook Shop so your products appear natively in both platforms. Customers can browse and buy without leaving social media.",
          "¡Sí! Integramos tu tienda con Instagram Shopping y Facebook Shop para que tus productos aparezcan nativamente en ambas plataformas. Los clientes pueden navegar y comprar sin salir de las redes sociales.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "How much does an e-commerce store cost in the Dominican Republic?",
          "¿Cuánto cuesta una tienda en línea en República Dominicana?",
        ),
        answer: loc(
          "E-commerce stores start at $1,200 USD for a basic store with up to 50 products. Larger stores with Azul integration, custom features, and extensive product catalogs typically range from $2,000-5,000 USD. We'll provide a detailed quote based on your specific needs.",
          "Las tiendas en línea comienzan desde $1,200 USD para una tienda básica con hasta 50 productos. Las tiendas más grandes con integración de Azul, características personalizadas y catálogos de productos extensos típicamente oscilan entre $2,000-5,000 USD. Proporcionaremos una cotización detallada basada en tus necesidades específicas.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "How do I manage my inventory?",
          "¿Cómo gestiono mi inventario?",
        ),
        answer: loc(
          "Your store comes with a complete admin dashboard where you can add/edit products, track stock levels, receive low-stock alerts, manage orders, and generate sales reports. We train you and your team completely before handover.",
          "Tu tienda viene con un dashboard administrativo completo donde puedes agregar/editar productos, rastrear niveles de stock, recibir alertas de stock bajo, gestionar pedidos y generar informes de ventas. Te capacitamos a ti y a tu equipo completamente antes de la entrega.",
        ),
      },
    ],
  },
  finalCta: {
    headline: loc(
      "Ready to Start Selling Online in the Dominican Republic?",
      "¿Listo para Empezar a Vender Online en República Dominicana?",
    ),
    subtext: loc(
      "Your online store awaits. Get a free strategy consultation and let's map out your e-commerce roadmap.",
      "Tu tienda en línea te espera. Obtén una consulta de estrategia gratuita y tracemos tu hoja de ruta de e-commerce.",
    ),
    primaryBtn: loc("Start My Online Store", "Iniciar Mi Tienda Online"),
    primaryBtnHref: "/contact",
    secondaryBtn: loc("Plan My Project", "Planificar Mi Proyecto"),
    secondaryBtnHref: "/project-planner",
    ...sharedFinalCta,
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 5 — mantenimiento-web-republica-dominicana
// ─────────────────────────────────────────────────────────────────────────────

const page5: Record<string, unknown> = {
  _type: "landingPage",
  _id: "landingPage-mantenimiento-web-republica-dominicana",
  title: "Mantenimiento Web República Dominicana",
  slug: { _type: "slug", current: "mantenimiento-web-republica-dominicana" },
  hero: {
    headline: loc(
      "Keep Your Website Running Perfectly — Always",
      "Mantén Tu Sitio Web Funcionando Perfectamente — Siempre",
    ),
    subheadline: loc(
      "Professional website maintenance for Dominican businesses. Security updates, daily backups, speed optimization, and priority support. Never worry about your website again.",
      "Mantenimiento web profesional para negocios dominicanos. Actualizaciones de seguridad, respaldos diarios, optimización de velocidad y soporte prioritario. Nunca más te preocupes por tu sitio web.",
    ),
    primaryCta: loc("View Maintenance Plans", "Ver Planes de Mantenimiento"),
    primaryCtaHref: "/pricing",
    secondaryCta: loc("Free Site Audit", "Auditoría Gratuita del Sitio"),
    secondaryCtaHref: "/contact",
    badge: loc(
      "Monthly maintenance plans starting at $150 USD",
      "Planes de mantenimiento mensual desde $150 USD",
    ),
  },
  statsBar: sharedStats,
  servicesGrid: {
    sectionTitle: loc(
      "What Our Maintenance Plans Include",
      "Qué Incluyen Nuestros Planes de Mantenimiento",
    ),
    sectionSubtitle: loc(
      "Everything your website needs to stay fast, secure, and effective — month after month.",
      "Todo lo que tu sitio web necesita para mantenerse rápido, seguro y efectivo — mes tras mes.",
    ),
    items: [
      {
        _key: key(),
        icon: "Shield",
        title: loc(
          "Security Monitoring & Updates",
          "Monitoreo y Actualizaciones de Seguridad",
        ),
        description: loc(
          "24/7 security scanning, malware removal, SSL certificate management, and immediate response to any security threats.",
          "Escaneo de seguridad 24/7, eliminación de malware, gestión de certificados SSL y respuesta inmediata a cualquier amenaza de seguridad.",
        ),
      },
      {
        _key: key(),
        icon: "Database",
        title: loc("Daily Backups", "Respaldos Diarios"),
        description: loc(
          "Automated daily backups of your entire site stored securely offsite. We can restore your site to any point in the last 30 days.",
          "Respaldos diarios automatizados de todo tu sitio almacenados de forma segura en ubicación externa. Podemos restaurar tu sitio a cualquier punto en los últimos 30 días.",
        ),
      },
      {
        _key: key(),
        icon: "Zap",
        title: loc(
          "Speed & Performance Optimization",
          "Optimización de Velocidad y Rendimiento",
        ),
        description: loc(
          "Monthly performance audits and optimizations to keep your Core Web Vitals scores high and your site loading fast.",
          "Auditorías y optimizaciones de rendimiento mensuales para mantener altas tus puntuaciones de Core Web Vitals y que tu sitio cargue rápido.",
        ),
      },
      {
        _key: key(),
        icon: "Wrench",
        title: loc(
          "Plugin & Software Updates",
          "Actualizaciones de Plugins y Software",
        ),
        description: loc(
          "We keep WordPress, plugins, and all software current so your site stays compatible and secure — without you lifting a finger.",
          "Mantenemos WordPress, plugins y todo el software al día para que tu sitio permanezca compatible y seguro — sin que tengas que hacer nada.",
        ),
      },
      {
        _key: key(),
        icon: "TrendingUp",
        title: loc("Monthly SEO Monitoring", "Monitoreo Mensual de SEO"),
        description: loc(
          "Track keyword rankings, identify issues, and receive monthly reports on your site's search visibility and traffic trends.",
          "Rastrea las clasificaciones de palabras clave, identifica problemas y recibe informes mensuales sobre la visibilidad de búsqueda y tendencias de tráfico de tu sitio.",
        ),
      },
      {
        _key: key(),
        icon: "MessageCircle",
        title: loc("Priority Support", "Soporte Prioritario"),
        description: loc(
          "Direct access to our team via WhatsApp. Maintenance clients get priority response — typically within 2-4 hours, not days.",
          "Acceso directo a nuestro equipo vía WhatsApp. Los clientes de mantenimiento obtienen respuesta prioritaria — típicamente dentro de 2-4 horas, no días.",
        ),
      },
    ],
  },
  whyUs: {
    sectionTitle: loc(
      "Website Maintenance You Can Actually Trust",
      "Mantenimiento Web en el que Realmente Puedes Confiar",
    ),
    sectionSubtitle: loc(
      "We treat your website like it's our own — proactive, thorough, and transparent.",
      "Tratamos tu sitio web como si fuera el nuestro — proactivos, minuciosos y transparentes.",
    ),
    items: [
      {
        _key: key(),
        icon: "Clock",
        title: loc("24-Hour Response Time", "Tiempo de Respuesta de 24 Horas"),
        description: loc(
          "If your site goes down or has a critical issue, we'll respond within 2 hours and resolve it within 24 hours, guaranteed.",
          "Si tu sitio se cae o tiene un problema crítico, responderemos dentro de 2 horas y lo resolveremos dentro de 24 horas, garantizado.",
        ),
      },
      {
        _key: key(),
        icon: "Database",
        title: loc("Daily Automatic Backups", "Respaldos Automáticos Diarios"),
        description: loc(
          "Your data is backed up every day and stored in multiple locations. If anything goes wrong, we can restore your site in under an hour.",
          "Tus datos se respaldan todos los días y se almacenan en múltiples ubicaciones. Si algo sale mal, podemos restaurar tu sitio en menos de una hora.",
        ),
      },
      {
        _key: key(),
        icon: "Lightbulb",
        title: loc("Monthly Reports", "Informes Mensuales"),
        description: loc(
          "Every month you receive a clear report showing uptime, speed scores, security scans completed, updates made, and traffic trends.",
          "Cada mes recibirás un informe claro que muestra el tiempo de actividad, puntuaciones de velocidad, escaneos de seguridad completados, actualizaciones realizadas y tendencias de tráfico.",
        ),
      },
      {
        _key: key(),
        icon: "Shield",
        title: loc("No Lock-in Contracts", "Sin Contratos de Permanencia"),
        description: loc(
          "Cancel anytime with 30 days notice. We earn your business every month by delivering real value — not by trapping you in a contract.",
          "Cancela en cualquier momento con 30 días de aviso. Nos ganamos tu negocio cada mes entregando valor real — no atrapándote en un contrato.",
        ),
      },
    ],
  },
  process: {
    sectionTitle: loc("Getting Started Is Easy", "Comenzar Es Fácil"),
    sectionSubtitle: loc(
      "From free audit to ongoing maintenance in 3 simple steps.",
      "De la auditoría gratuita al mantenimiento continuo en 3 pasos simples.",
    ),
    steps: [
      {
        _key: key(),
        number: 1,
        icon: "Search",
        stepTitle: loc("Free Site Audit", "Auditoría Gratuita del Sitio"),
        description: loc(
          "We analyze your current website for security vulnerabilities, performance issues, broken links, and outdated software. Completely free, no obligation.",
          "Analizamos tu sitio web actual en busca de vulnerabilidades de seguridad, problemas de rendimiento, enlaces rotos y software desactualizado. Completamente gratis, sin obligación.",
        ),
        duration: loc("24-48 hours", "24-48 horas"),
      },
      {
        _key: key(),
        number: 2,
        icon: "CheckCircle",
        stepTitle: loc("Choose Your Plan", "Elige Tu Plan"),
        description: loc(
          "Based on the audit findings, we recommend the right maintenance plan for your site. Review and choose — no pressure.",
          "Basándonos en los resultados de la auditoría, recomendamos el plan de mantenimiento adecuado para tu sitio. Revisa y elige — sin presión.",
        ),
        duration: loc("Same day", "El mismo día"),
      },
      {
        _key: key(),
        number: 3,
        icon: "Settings",
        stepTitle: loc("Ongoing Maintenance", "Mantenimiento Continuo"),
        description: loc(
          "We take over, fix immediate issues, and begin monthly maintenance. You'll receive your first report within 30 days.",
          "Nos hacemos cargo, solucionamos los problemas inmediatos y comenzamos el mantenimiento mensual. Recibirás tu primer informe en 30 días.",
        ),
        duration: loc("Ongoing monthly", "Mensual continuo"),
      },
      {
        _key: key(),
        number: 4,
        icon: "Send",
        stepTitle: loc("Monthly Reports", "Informes Mensuales"),
        description: loc(
          "Every month you receive a transparent report of everything we did, your site's performance metrics, and any recommendations.",
          "Cada mes recibirás un informe transparente de todo lo que hicimos, las métricas de rendimiento de tu sitio y cualquier recomendación.",
        ),
        duration: loc("Monthly", "Mensual"),
      },
    ],
  },
  portfolioHighlight: {
    sectionTitle: loc("Sites We Maintain", "Sitios que Mantenemos"),
    sectionSubtitle: loc(
      "A selection of Dominican businesses we keep running smoothly.",
      "Una selección de negocios dominicanos que mantenemos funcionando sin problemas.",
    ),
    projects: [],
    ctaText: loc("View Our Portfolio", "Ver Nuestro Portafolio"),
    ctaHref: "/portfolio",
  },
  testimonials: {
    sectionTitle: loc(
      "What Maintenance Clients Say",
      "Lo que Dicen los Clientes de Mantenimiento",
    ),
    items: sharedTestimonials,
  },
  faq: {
    sectionTitle: loc(
      "Maintenance Plan FAQ",
      "Preguntas sobre Planes de Mantenimiento",
    ),
    sectionSubtitle: loc(
      "Everything you need to know about our website maintenance service.",
      "Todo lo que necesitas saber sobre nuestro servicio de mantenimiento web.",
    ),
    items: [
      {
        _key: key(),
        question: loc(
          "What exactly is included in website maintenance?",
          "¿Qué incluye exactamente el mantenimiento del sitio web?",
        ),
        answer: loc(
          "Our maintenance plans include: security monitoring and malware scanning, daily automated backups, plugin and software updates, speed optimization, SSL certificate renewal, uptime monitoring, monthly performance reports, and priority support access via WhatsApp.",
          "Nuestros planes de mantenimiento incluyen: monitoreo de seguridad y escaneo de malware, respaldos automáticos diarios, actualizaciones de plugins y software, optimización de velocidad, renovación de certificado SSL, monitoreo de tiempo de actividad, informes de rendimiento mensuales y acceso a soporte prioritario vía WhatsApp.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "How often do you update the website?",
          "¿Con qué frecuencia actualizan el sitio web?",
        ),
        answer: loc(
          "Security updates are applied immediately when available. Plugin and theme updates are batched and applied weekly after testing on a staging environment. Content updates requested by you are typically completed within 24-48 hours.",
          "Las actualizaciones de seguridad se aplican inmediatamente cuando están disponibles. Las actualizaciones de plugins y temas se agrupan y aplican semanalmente después de probarlas en un entorno de prueba. Las actualizaciones de contenido solicitadas por ti se completan típicamente en 24-48 horas.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "What happens if my site goes down?",
          "¿Qué pasa si mi sitio se cae?",
        ),
        answer: loc(
          "Our monitoring alerts us within seconds of downtime. We'll contact you immediately and begin working on restoration. For maintenance clients, we guarantee acknowledgment within 2 hours and resolution within 24 hours for critical issues.",
          "Nuestro monitoreo nos alerta dentro de segundos de la caída. Te contactaremos de inmediato y comenzaremos a trabajar en la restauración. Para clientes de mantenimiento, garantizamos acuse de recibo dentro de 2 horas y resolución dentro de 24 horas para problemas críticos.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Do you back up my data?",
          "¿Hacen respaldo de mis datos?",
        ),
        answer: loc(
          "Yes! We create daily automated backups of your complete website — files and database. Backups are stored in secure offsite locations (not just on the same server). We retain 30 days of backup history, so we can restore your site to any point in the last month.",
          "¡Sí! Creamos respaldos automáticos diarios de tu sitio web completo — archivos y base de datos. Los respaldos se almacenan en ubicaciones externas seguras (no solo en el mismo servidor). Retenemos 30 días de historial de respaldos, para poder restaurar tu sitio a cualquier punto en el último mes.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Can I cancel my maintenance plan at any time?",
          "¿Puedo cancelar el plan de mantenimiento en cualquier momento?",
        ),
        answer: loc(
          "Yes! There are no long-term contracts or lock-in periods. Cancel anytime with 30 days notice. We'll provide a final report and transition assistance to ensure a smooth handover. We earn your business every month by delivering real value.",
          "¡Sí! No hay contratos a largo plazo ni períodos de permanencia. Cancela en cualquier momento con 30 días de aviso. Te proporcionaremos un informe final y asistencia de transición para asegurar una entrega fluida. Nos ganamos tu negocio cada mes entregando valor real.",
        ),
      },
      {
        _key: key(),
        question: loc(
          "Do content updates count as maintenance?",
          "¿Las actualizaciones de contenido cuentan como mantenimiento?",
        ),
        answer: loc(
          "Minor content changes (text updates, adding photos, updating business hours) are included in our higher-tier plans. Major content additions or redesigns are quoted separately. We'll always be transparent about what's included before doing any work.",
          "Los cambios de contenido menores (actualizaciones de texto, agregar fotos, actualizar horarios) están incluidos en nuestros planes de nivel superior. Las adiciones de contenido importantes o los rediseños se cotizan por separado. Siempre seremos transparentes sobre lo que está incluido antes de hacer cualquier trabajo.",
        ),
      },
    ],
  },
  finalCta: {
    headline: loc(
      "Stop Worrying About Your Website",
      "Deja de Preocuparte por Tu Sitio Web",
    ),
    subtext: loc(
      "Let us handle the technical side while you focus on growing your business. Start with a free site audit.",
      "Déjanos manejar el lado técnico mientras te enfocas en hacer crecer tu negocio. Comienza con una auditoría gratuita del sitio.",
    ),
    primaryBtn: loc("Get Free Site Audit", "Obtener Auditoría Gratuita"),
    primaryBtnHref: "/contact",
    secondaryBtn: loc("View Pricing", "Ver Precios"),
    secondaryBtnHref: "/pricing",
    ...sharedFinalCta,
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// SEO Documents
// ─────────────────────────────────────────────────────────────────────────────

const seoDocuments = [
  {
    _type: "seo",
    _id: "seo-desarrollo-web-republica-dominicana",
    pageName: "desarrollo-web-republica-dominicana",
    meta: {
      en: {
        title: "Web Development Dominican Republic | DR Web Studio",
        description:
          "Professional web development for businesses in the Dominican Republic. Fast, modern, bilingual websites. Free consultation — start your project today.",
        keywords: [
          "web development dominican republic",
          "website development DR",
          "web design dominican republic",
          "dr web studio",
        ],
      },
      es: {
        title: "Desarrollo Web República Dominicana | DR Web Studio",
        description:
          "Creamos sitios web profesionales para empresas en República Dominicana. Diseño moderno, rápido y optimizado para Google. Consulta gratuita — empieza tu proyecto hoy.",
        keywords: [
          "desarrollo web republica dominicana",
          "diseño web santo domingo",
          "agencia web dominicana",
          "empresa desarrollo web rd",
        ],
      },
    },
    openGraph: {
      en: {
        title:
          "Professional Web Development in the Dominican Republic | DR Web Studio",
        description:
          "Fast, modern, bilingual websites for Dominican businesses. 50+ projects delivered. Free consultation available.",
      },
      es: {
        title:
          "Desarrollo Web Profesional en República Dominicana | DR Web Studio",
        description:
          "Sitios web rápidos, modernos y bilingüe para negocios dominicanos. +50 proyectos entregados. Consulta gratuita disponible.",
      },
    },
    canonicalUrl: "desarrollo-web-republica-dominicana",
    noIndex: false,
    noFollow: false,
  },
  {
    _type: "seo",
    _id: "seo-diseno-web-republica-dominicana",
    pageName: "diseno-web-republica-dominicana",
    meta: {
      en: {
        title: "Web Design Dominican Republic | DR Web Studio",
        description:
          "Award-winning web design for Dominican businesses. Beautiful, strategic, mobile-first design that converts visitors into customers. Free consultation.",
        keywords: [
          "web design dominican republic",
          "website design santo domingo",
          "ui ux design dominican republic",
          "web designer dr",
        ],
      },
      es: {
        title: "Diseño Web República Dominicana | DR Web Studio",
        description:
          "Diseño web profesional y estratégico para negocios en RD. Interfaces modernas, responsive y orientadas a la conversión. Consulta de diseño gratuita.",
        keywords: [
          "diseño web republica dominicana",
          "diseño web santo domingo",
          "diseño de sitios web rd",
          "agencia diseño web dominicana",
        ],
      },
    },
    openGraph: {
      en: {
        title:
          "Web Design Dominican Republic — Beautiful Sites That Convert | DR Web Studio",
        description:
          "Strategic web design for Dominican businesses. Mobile-first, conversion-optimized, and uniquely yours.",
      },
      es: {
        title:
          "Diseño Web República Dominicana — Sitios Hermosos que Convierten | DR Web Studio",
        description:
          "Diseño web estratégico para negocios dominicanos. Mobile-first, optimizado para conversiones y único para tu marca.",
      },
    },
    canonicalUrl: "diseno-web-republica-dominicana",
    noIndex: false,
    noFollow: false,
  },
  {
    _type: "seo",
    _id: "seo-desarrollo-web-punta-cana",
    pageName: "desarrollo-web-punta-cana",
    meta: {
      en: {
        title: "Web Development in Punta Cana | DR Web Studio",
        description:
          "Multilingual websites for hotels, restaurants, and tourism businesses in Punta Cana. Attract international tourists. Fast, mobile-optimized, bilingual.",
        keywords: [
          "web development punta cana",
          "hotel website punta cana",
          "tourism website punta cana",
          "restaurant website punta cana",
        ],
      },
      es: {
        title: "Desarrollo Web en Punta Cana | DR Web Studio",
        description:
          "Sitios web multilingüe para hoteles, restaurantes y negocios turísticos en Punta Cana. Atrae turistas internacionales. Rápidos, mobile y bilingüe.",
        keywords: [
          "desarrollo web punta cana",
          "sitio web hotel punta cana",
          "pagina web punta cana",
          "diseño web punta cana",
        ],
      },
    },
    openGraph: {
      en: {
        title:
          "Web Development in Punta Cana — Tourism & Hospitality Specialists | DR Web Studio",
        description:
          "Multilingual websites for Punta Cana hotels, restaurants & tours. Built to attract international visitors.",
      },
      es: {
        title:
          "Desarrollo Web en Punta Cana — Especialistas en Turismo y Hotelería | DR Web Studio",
        description:
          "Sitios web multilingüe para hoteles, restaurantes y tours en Punta Cana. Construidos para atraer visitantes internacionales.",
      },
    },
    canonicalUrl: "desarrollo-web-punta-cana",
    noIndex: false,
    noFollow: false,
  },
  {
    _type: "seo",
    _id: "seo-desarrollo-ecommerce-republica-dominicana",
    pageName: "desarrollo-ecommerce-republica-dominicana",
    meta: {
      en: {
        title: "E-commerce Development Dominican Republic | DR Web Studio",
        description:
          "Launch your online store in the Dominican Republic. Azul payment integration, bilingual checkout, and full e-commerce setup. Free strategy consultation.",
        keywords: [
          "ecommerce dominican republic",
          "online store dominican republic",
          "tienda online republica dominicana",
          "azul payment integration",
        ],
      },
      es: {
        title: "Desarrollo E-commerce República Dominicana | DR Web Studio",
        description:
          "Crea tu tienda online en República Dominicana. Integración de pago Azul, checkout bilingüe y configuración e-commerce completa. Consulta de estrategia gratis.",
        keywords: [
          "tienda online republica dominicana",
          "ecommerce republica dominicana",
          "desarrollo ecommerce rd",
          "tienda virtual dominicana",
          "integración azul",
        ],
      },
    },
    openGraph: {
      en: {
        title:
          "E-commerce Dominican Republic — Sell Online with Azul Integration | DR Web Studio",
        description:
          "Complete online store setup for Dominican businesses. Azul, PayPal, and international payment support included.",
      },
      es: {
        title:
          "E-commerce República Dominicana — Vende Online con Integración Azul | DR Web Studio",
        description:
          "Configuración completa de tienda online para negocios dominicanos. Soporte de pago Azul, PayPal e internacional incluido.",
      },
    },
    canonicalUrl: "desarrollo-ecommerce-republica-dominicana",
    noIndex: false,
    noFollow: false,
  },
  {
    _type: "seo",
    _id: "seo-mantenimiento-web-republica-dominicana",
    pageName: "mantenimiento-web-republica-dominicana",
    meta: {
      en: {
        title: "Website Maintenance Dominican Republic | DR Web Studio",
        description:
          "Professional website maintenance for Dominican businesses. Daily backups, security monitoring, speed optimization & priority support. Starting at $150/month.",
        keywords: [
          "website maintenance dominican republic",
          "web maintenance rd",
          "website support dominican republic",
          "wordpress maintenance dr",
        ],
      },
      es: {
        title: "Mantenimiento Web República Dominicana | DR Web Studio",
        description:
          "Mantenimiento web profesional para negocios dominicanos. Respaldos diarios, monitoreo de seguridad, optimización de velocidad y soporte prioritario. Desde $150/mes.",
        keywords: [
          "mantenimiento web republica dominicana",
          "mantenimiento wordpress rd",
          "soporte web dominicana",
          "mantenimiento pagina web rd",
        ],
      },
    },
    openGraph: {
      en: {
        title:
          "Website Maintenance Plans for Dominican Businesses | DR Web Studio",
        description:
          "Keep your site fast, secure, and always online. Daily backups, security monitoring & priority support from $150/month.",
      },
      es: {
        title:
          "Planes de Mantenimiento Web para Negocios Dominicanos | DR Web Studio",
        description:
          "Mantén tu sitio rápido, seguro y siempre en línea. Respaldos diarios, monitoreo de seguridad y soporte prioritario desde $150/mes.",
      },
    },
    canonicalUrl: "mantenimiento-web-republica-dominicana",
    noIndex: false,
    noFollow: false,
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Seed runner
// ─────────────────────────────────────────────────────────────────────────────

async function seed() {
  const landingPages = [page1, page2, page3, page4, page5]

  console.log("🌱 Seeding landing pages...\n")

  for (const page of landingPages) {
    const slug = (page.slug as { current: string }).current
    try {
      await client.createOrReplace(
        page as Parameters<typeof client.createOrReplace>[0],
      )
      console.log(`  ✓ Landing page: ${slug}`)
    } catch (err) {
      console.error(`  ✗ Failed: ${slug}`, err)
    }
  }

  console.log("\n🌱 Seeding SEO documents...\n")

  for (const doc of seoDocuments) {
    try {
      await client.createOrReplace(doc)
      console.log(`  ✓ SEO: ${doc.pageName}`)
    } catch (err) {
      console.error(`  ✗ Failed: ${doc.pageName}`, err)
    }
  }

  console.log("\n✅ Seed complete!")
  console.log("\nNext steps:")
  console.log(
    "  1. Open /studio → Landing Pages to review and add portfolio project references",
  )
  console.log("  2. Open /studio → SEO to add OG images for each page")
  console.log(
    "  3. Update phone/WhatsApp numbers in finalCta if different from defaults",
  )
}

seed().catch(console.error)
