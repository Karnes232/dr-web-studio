// Pillar Page Data: Guía Completa de Desarrollo Web Moderno para Negocios

export interface PillarPageSection {
  id: string
  title: string
  subtitle?: string
  content: string[]
  subsections?: Subsection[]
}

export interface Subsection {
  title: string
  content: string[]
  list?: ListItem[]
  highlight?: HighlightBox
}

export interface ListItem {
  icon?: string
  title: string
  description: string
}

export interface HighlightBox {
  type: "info" | "warning" | "success" | "tip"
  title: string
  content: string
}

export interface ComparisonItem {
  feature: string
  traditional: {
    value: string
    icon: string
    description?: string
  }
  modern: {
    value: string
    icon: string
    description?: string
  }
}

export interface TechStackItem {
  name: string
  category: "frontend" | "backend" | "database" | "devops" | "tools"
  description: string
  icon: string
  benefits: string[]
  useCases: string[]
  popularity?: number
}

export interface ROIMetric {
  metric: string
  traditional: number
  modern: number
  improvement: string
  unit: string
}

export interface CaseStudy {
  id: string
  client: string
  industry: string
  challenge: string
  solution: string[]
  results: {
    metric: string
    before: string
    after: string
    improvement: string
  }[]
  technologies: string[]
  timeline: string
  testimonial?: {
    quote: string
    author: string
    role: string
  }
}

export interface ProcessStep {
  step: number
  title: string
  description: string
  duration: string
  deliverables: string[]
  icon: string
}

// ============================================
// HERO SECTION
// ============================================

export const heroData = {
  headline: "Guía Completa de Desarrollo Web Moderno para Negocios",
  subheadline:
    "Todo lo que necesitas saber para transformar tu presencia digital y acelerar el crecimiento de tu empresa con tecnología de vanguardia",
  stats: [
    { value: "300%", label: "Incremento promedio en conversiones" },
    { value: "5x", label: "Más rápido que sitios tradicionales" },
    { value: "70%", label: "Reducción en costos de mantenimiento" },
  ],
  readingTime: "15 min de lectura",
  lastUpdated: "Marzo 2026",
}

// ============================================
// TABLE OF CONTENTS
// ============================================

export const tableOfContents = [
  {
    id: "que-es-desarrollo-web-moderno",
    title: "¿Qué es el Desarrollo Web Moderno?",
    subsections: [
      { id: "definicion", title: "Definición y Conceptos Clave" },
      { id: "caracteristicas", title: "Características Principales" },
      { id: "evolucion", title: "Evolución Histórica" },
    ],
  },
  {
    id: "beneficios-vs-tradicional",
    title: "Beneficios vs Desarrollo Tradicional",
    subsections: [
      { id: "rendimiento", title: "Velocidad y Rendimiento" },
      { id: "experiencia-usuario", title: "Experiencia de Usuario" },
      { id: "mantenibilidad", title: "Mantenibilidad y Escalabilidad" },
      { id: "seo-conversion", title: "SEO y Conversión" },
    ],
  },
  {
    id: "stack-tecnologico",
    title: "Stack Tecnológico Actual",
    subsections: [
      { id: "frontend", title: "Frontend: React, Next.js y Más" },
      { id: "backend", title: "Backend y APIs Modernas" },
      { id: "infraestructura", title: "Infraestructura en la Nube" },
      { id: "herramientas", title: "Herramientas de Desarrollo" },
    ],
  },
  {
    id: "analisis-roi",
    title: "Análisis de ROI y Rentabilidad",
    subsections: [
      { id: "inversion", title: "Inversión Inicial vs Largo Plazo" },
      { id: "metricas", title: "Métricas de Éxito" },
      { id: "calculadora", title: "Calculadora de ROI" },
    ],
  },
  {
    id: "casos-estudio",
    title: "Casos de Estudio Reales",
  },
  {
    id: "como-empezar",
    title: "Cómo Empezar Tu Proyecto",
    subsections: [
      { id: "pasos-iniciales", title: "Primeros Pasos" },
      { id: "proceso", title: "Nuestro Proceso" },
      { id: "siguiente-paso", title: "Tu Siguiente Paso" },
    ],
  },
]

// ============================================
// MAIN CONTENT SECTIONS
// ============================================

export const sections: PillarPageSection[] = [
  {
    id: "que-es-desarrollo-web-moderno",
    title: "¿Qué es el Desarrollo Web Moderno?",
    subtitle:
      "Más allá de las páginas estáticas: la nueva era del desarrollo web",
    content: [
      "El desarrollo web moderno representa un cambio fundamental en cómo construimos experiencias digitales. Ya no se trata simplemente de crear páginas que muestren información, sino de desarrollar aplicaciones web complejas, interactivas y altamente optimizadas que funcionan como software nativo.",
      "A diferencia de los sitios web tradicionales que requieren recargar la página completa con cada interacción, las aplicaciones web modernas utilizan JavaScript avanzado para actualizar solo las partes necesarias de la interfaz, ofreciendo una experiencia fluida y rápida similar a las aplicaciones móviles.",
    ],
    subsections: [
      {
        title: "Características Principales",
        content: [
          "El desarrollo web moderno se caracteriza por un conjunto de prácticas y tecnologías que trabajan en conjunto para crear experiencias superiores:",
        ],
        list: [
          {
            icon: "Zap",
            title: "Aplicaciones de Página Única (SPA)",
            description:
              "Interfaces que se cargan una vez y actualizan contenido dinámicamente sin recargas completas, ofreciendo velocidad instantánea.",
          },
          {
            icon: "Smartphone",
            title: "Diseño Mobile-First Responsive",
            description:
              "Interfaces diseñadas primero para móviles y adaptadas a todos los tamaños de pantalla, garantizando una experiencia perfecta en cualquier dispositivo.",
          },
          {
            icon: "Server",
            title: "Arquitectura API-First",
            description:
              "Separación clara entre frontend y backend mediante APIs RESTful o GraphQL, permitiendo flexibilidad y escalabilidad.",
          },
          {
            icon: "Gauge",
            title: "Optimización de Rendimiento",
            description:
              "Técnicas avanzadas como lazy loading, code splitting y caching para tiempos de carga inferiores a 2 segundos.",
          },
          {
            icon: "Shield",
            title: "Seguridad Integrada",
            description:
              "Autenticación moderna, encriptación end-to-end y protección contra vulnerabilidades comunes desde el diseño.",
          },
          {
            icon: "TrendingUp",
            title: "SEO y Accesibilidad",
            description:
              "Renderizado del lado del servidor (SSR) para mejor indexación y cumplimiento de estándares WCAG para todos los usuarios.",
          },
        ],
      },
      {
        title: "Evolución del Desarrollo Web",
        content: [
          "Para entender el verdadero valor del desarrollo web moderno, es importante ver cómo hemos llegado aquí:",
        ],
        highlight: {
          type: "info",
          title: "La Transformación Digital",
          content:
            "Desde HTML estático en los 90s hasta aplicaciones web progresivas en 2026, cada evolución ha respondido a las crecientes expectativas de los usuarios y las necesidades de los negocios.",
        },
      },
    ],
  },
  {
    id: "beneficios-vs-tradicional",
    title: "Beneficios vs Desarrollo Tradicional",
    subtitle: "Por qué las empresas están migrando a tecnologías modernas",
    content: [
      "La diferencia entre un sitio web tradicional y una aplicación web moderna no es solo técnica, es estratégica. Las empresas que adoptan desarrollo web moderno reportan mejoras significativas en métricas clave de negocio.",
    ],
    subsections: [
      {
        title: "Velocidad y Rendimiento",
        content: [
          "El rendimiento web tiene un impacto directo en los resultados de negocio. Estudios demuestran que cada segundo de retraso en la carga puede reducir las conversiones hasta un 7%.",
        ],
        list: [
          {
            icon: "Rocket",
            title: "Tiempos de Carga Ultra-Rápidos",
            description:
              "Sitios modernos cargan en menos de 2 segundos vs 5-8 segundos de sitios tradicionales. El 53% de usuarios móviles abandona sitios que tardan más de 3 segundos.",
          },
          {
            icon: "RefreshCw",
            title: "Navegación Instantánea",
            description:
              "Las transiciones entre páginas son inmediatas sin recargas completas, mejorando la experiencia de usuario y reduciendo la tasa de rebote hasta un 40%.",
          },
          {
            icon: "BarChart",
            title: "Mejor Core Web Vitals",
            description:
              "Optimización automática de LCP, FID y CLS, factores que Google usa para ranking. Sitios modernos consistentemente obtienen scores 90+ en Lighthouse.",
          },
        ],
      },
      {
        title: "Experiencia de Usuario Superior",
        content: [
          "Los usuarios modernos esperan experiencias digitales que rivalizan con aplicaciones nativas. El desarrollo web moderno hace esto posible:",
        ],
        list: [
          {
            icon: "Heart",
            title: "Interfaces Intuitivas e Interactivas",
            description:
              "Componentes reutilizables y animaciones fluidas que guían al usuario naturalmente hacia la conversión.",
          },
          {
            icon: "Wifi",
            title: "Funcionalidad Offline",
            description:
              "Progressive Web Apps (PWA) permiten uso básico sin conexión, crucial para mercados con conectividad inestable.",
          },
          {
            icon: "Palette",
            title: "Personalización en Tiempo Real",
            description:
              "Contenido dinámico basado en comportamiento del usuario, ubicación, preferencias y contexto para experiencias únicas.",
          },
        ],
      },
      {
        title: "Mantenibilidad y Escalabilidad",
        content: [
          "La arquitectura moderna reduce drásticamente los costos de mantenimiento y permite escalar el negocio sin limitaciones técnicas:",
        ],
        list: [
          {
            icon: "Code",
            title: "Código Modular y Reutilizable",
            description:
              "Componentes que se usan en múltiples lugares reducen duplicación y facilitan actualizaciones. Un cambio se replica automáticamente en todo el sitio.",
          },
          {
            icon: "GitBranch",
            title: "Despliegues Continuos",
            description:
              "Integración y despliegue continuo (CI/CD) permite actualizaciones múltiples por día sin tiempo de inactividad.",
          },
          {
            icon: "Users",
            title: "Escalabilidad Horizontal",
            description:
              "Infraestructura cloud-native que crece automáticamente con el tráfico, soportando desde 100 hasta millones de usuarios sin rediseño.",
          },
        ],
      },
    ],
  },
  {
    id: "stack-tecnologico",
    title: "Stack Tecnológico del Desarrollo Web Moderno",
    subtitle:
      "Las herramientas que impulsan las mejores aplicaciones web del mundo",
    content: [
      "El stack tecnológico moderno es un ecosistema integrado de herramientas que trabajan juntas para crear experiencias web excepcionales. Cada componente tiene un propósito específico y juntos forman una arquitectura robusta y flexible.",
    ],
  },
  {
    id: "analisis-roi",
    title: "Análisis de ROI: ¿Vale la Pena la Inversión?",
    subtitle:
      "Números reales sobre retorno de inversión en desarrollo web moderno",
    content: [
      "La pregunta que todo director o dueño de negocio se hace: ¿justifica el costo? Los datos muestran que el desarrollo web moderno no es un gasto, es una inversión con retornos medibles y significativos.",
      "Empresas que migran a tecnologías modernas reportan retornos de inversión entre 200% y 500% en el primer año, con beneficios continuos en años posteriores.",
    ],
    subsections: [
      {
        title: "Inversión Inicial vs Valor a Largo Plazo",
        content: [
          "Si bien la inversión inicial en desarrollo web moderno puede ser mayor que un sitio tradicional, el costo total de propiedad (TCO) a 3 años es típicamente 40-60% menor.",
        ],
        highlight: {
          type: "success",
          title: "Ahorro Promedio en 3 Años",
          content:
            "Empresas que invierten en desarrollo web moderno ahorran entre $50,000 y $200,000 en costos de mantenimiento, actualizaciones y pérdida de conversiones comparado con soluciones tradicionales.",
        },
      },
    ],
  },
  {
    id: "como-empezar",
    title: "Cómo Empezar Tu Proyecto de Desarrollo Web Moderno",
    subtitle: "Una hoja de ruta clara desde la idea hasta el lanzamiento",
    content: [
      "Iniciar un proyecto de desarrollo web moderno puede parecer intimidante, pero con el enfoque correcto y el partner adecuado, el proceso es claro y manejable.",
    ],
  },
]

// ============================================
// COMPARISON DATA
// ============================================

export const comparisonData: ComparisonItem[] = [
  {
    feature: "Tiempo de Carga Inicial",
    traditional: {
      value: "5-8 segundos",
      icon: "Turtle",
      description: "Carga completa de página en cada visita",
    },
    modern: {
      value: "< 2 segundos",
      icon: "Rocket",
      description: "Optimización automática y caching inteligente",
    },
  },
  {
    feature: "Navegación Entre Páginas",
    traditional: {
      value: "3-5 segundos",
      icon: "Clock",
      description: "Recarga completa con cada clic",
    },
    modern: {
      value: "Instantáneo",
      icon: "Zap",
      description: "Transiciones sin recargas completas (SPA)",
    },
  },
  {
    feature: "Experiencia Móvil",
    traditional: {
      value: "Adaptado",
      icon: "Smartphone",
      description: "Diseño desktop reducido para móvil",
    },
    modern: {
      value: "Mobile-First",
      icon: "Heart",
      description:
        "Diseñado primero para móvil, perfecto en todos los dispositivos",
    },
  },
  {
    feature: "SEO",
    traditional: {
      value: "Básico",
      icon: "Search",
      description: "Meta tags manuales, sin optimización automática",
    },
    modern: {
      value: "Optimizado",
      icon: "TrendingUp",
      description: "SSR, meta tags dinámicos, structured data automático",
    },
  },
  {
    feature: "Escalabilidad",
    traditional: {
      value: "Limitada",
      icon: "AlertTriangle",
      description: "Requiere rediseño para crecer",
    },
    modern: {
      value: "Ilimitada",
      icon: "Layers",
      description: "Crece automáticamente con tu negocio",
    },
  },
  {
    feature: "Costo de Mantenimiento",
    traditional: {
      value: "$2,000-5,000/mes",
      icon: "DollarSign",
      description: "Actualizaciones manuales frecuentes",
    },
    modern: {
      value: "$500-1,500/mes",
      icon: "PiggyBank",
      description: "Actualizaciones automatizadas, menos intervención",
    },
  },
  {
    feature: "Tiempo de Actualización",
    traditional: {
      value: "1-2 semanas",
      icon: "Calendar",
      description: "Proceso manual de desarrollo y despliegue",
    },
    modern: {
      value: "Minutos",
      icon: "RefreshCw",
      description: "CI/CD permite cambios instantáneos",
    },
  },
  {
    feature: "Seguridad",
    traditional: {
      value: "Reactiva",
      icon: "Shield",
      description: "Parches manuales cuando surgen problemas",
    },
    modern: {
      value: "Proactiva",
      icon: "ShieldCheck",
      description: "Actualizaciones automáticas y monitoreo continuo",
    },
  },
]

// ============================================
// TECH STACK DATA
// ============================================

export const techStack: TechStackItem[] = [
  {
    name: "Next.js 14+",
    category: "frontend",
    description:
      "Framework React de producción con renderizado híbrido (SSR + SSG + CSR)",
    icon: "▲",
    benefits: [
      "SEO excepcional con Server-Side Rendering",
      "Velocidad extrema con Static Site Generation",
      "Rutas automáticas basadas en archivos",
      "Optimización de imágenes y fuentes automática",
      "API routes integradas",
    ],
    useCases: [
      "E-commerce de alto tráfico",
      "Sitios corporativos con mucho contenido",
      "SaaS y aplicaciones web complejas",
      "Landing pages de alta conversión",
    ],
    popularity: 98,
  },
  {
    name: "React 18+",
    category: "frontend",
    description:
      "Librería JavaScript para construir interfaces de usuario interactivas",
    icon: "⚛️",
    benefits: [
      "Componentes reutilizables = desarrollo más rápido",
      "Virtual DOM para actualizaciones ultra-rápidas",
      "Ecosistema masivo de librerías",
      "Concurrent rendering para mejor UX",
      "React Server Components para performance",
    ],
    useCases: [
      "Dashboards interactivos",
      "Aplicaciones de una sola página (SPA)",
      "Interfaces complejas con muchos estados",
      "Plataformas colaborativas en tiempo real",
    ],
    popularity: 95,
  },
  {
    name: "TypeScript",
    category: "frontend",
    description:
      "JavaScript con tipos estáticos para mayor seguridad y mantenibilidad",
    icon: "TS",
    benefits: [
      "Menos bugs en producción",
      "Autocompletado inteligente en editores",
      "Refactoring seguro a gran escala",
      "Documentación automática del código",
      "Mejor colaboración en equipos",
    ],
    useCases: [
      "Proyectos a largo plazo",
      "Equipos de desarrollo grandes",
      "Aplicaciones con lógica compleja",
      "Migración gradual desde JavaScript",
    ],
    popularity: 92,
  },
  {
    name: "Tailwind CSS",
    category: "frontend",
    description: "Framework CSS utility-first para diseño rápido y consistente",
    icon: "🎨",
    benefits: [
      "Desarrollo de UI 3x más rápido",
      "Diseño consistente sin esfuerzo",
      "Bundle CSS mínimo en producción",
      "Responsive design simplificado",
      "Dark mode integrado",
    ],
    useCases: [
      "Prototipado rápido",
      "Sistemas de diseño escalables",
      "Proyectos con deadlines ajustados",
      "Equipos con diseñadores y desarrolladores",
    ],
    popularity: 88,
  },
  {
    name: "Node.js",
    category: "backend",
    description:
      "Runtime de JavaScript para construir APIs y servicios backend escalables",
    icon: "🟢",
    benefits: [
      "Mismo lenguaje en frontend y backend",
      "Event-driven ideal para real-time",
      "NPM: ecosistema de paquetes más grande",
      "Excelente para microservicios",
      "Performance comparable a lenguajes compilados",
    ],
    useCases: [
      "APIs RESTful y GraphQL",
      "Aplicaciones en tiempo real (chat, notificaciones)",
      "Microservicios",
      "Serverless functions",
    ],
    popularity: 90,
  },
  {
    name: "NestJS",
    category: "backend",
    description:
      "Framework progresivo de Node.js para construir aplicaciones del lado del servidor eficientes y escalables",
    icon: "🐈",
    benefits: [
      "TypeScript-first con seguridad de tipos completa",
      "Arquitectura modular inspirada en Angular",
      "Inyección de dependencias integrada",
      "CLI extensivo para desarrollo rápido",
      "Soporte nativo para microservicios y GraphQL",
    ],
    useCases: [
      "Aplicaciones de nivel empresarial",
      "Arquitecturas de microservicios",
      "Aplicaciones en tiempo real con WebSockets",
      "APIs GraphQL",
    ],
    popularity: 86,
  },
  {
    name: "Express.js",
    category: "backend",
    description:
      "Framework web rápido, minimalista y sin opiniones para Node.js",
    icon: "🚂",
    benefits: [
      "Mínimo y flexible",
      "Enorme ecosistema de middleware",
      "Simple y fácil de aprender",
      "Sistema de enrutamiento rápido",
      "Estándar de la industria para APIs Node.js",
    ],
    useCases: [
      "APIs RESTful",
      "Servidores web simples",
      "Backend para SPAs",
      "Prototipado y MVPs",
    ],
    popularity: 91,
  },
  {
    name: "PostgreSQL",
    category: "database",
    description: "Base de datos relacional avanzada con soporte para JSON",
    icon: "🐘",
    benefits: [
      "ACID compliance para integridad de datos",
      "Soporte para JSON (flexibilidad NoSQL)",
      "Full-text search integrado",
      "Escalabilidad probada en producción",
      "Extensiones poderosas (PostGIS, TimescaleDB)",
    ],
    useCases: [
      "E-commerce (transacciones críticas)",
      "SaaS multi-tenant",
      "Aplicaciones con datos geoespaciales",
      "Analytics y reporting",
    ],
    popularity: 85,
  },
  {
    name: "Supabase",
    category: "database",
    description:
      "Alternativa open source a Firebase con base de datos PostgreSQL",
    icon: "⚡",
    benefits: [
      "Base de datos PostgreSQL con suscripciones en tiempo real",
      "Autenticación y autorización integradas",
      "APIs REST y GraphQL auto-generadas",
      "Almacenamiento de archivos incluido",
      "Open source con opción de auto-hosting",
    ],
    useCases: [
      "Desarrollo rápido de MVP",
      "Apps colaborativas en tiempo real",
      "Aplicaciones móviles y web",
      "Proyectos que requieren autenticación",
    ],
    popularity: 82,
  },
  {
    name: "Firebase",
    category: "database",
    description:
      "Plataforma de Google con base de datos NoSQL en tiempo real y servicios backend",
    icon: "🔥",
    benefits: [
      "Sincronización de datos en tiempo real",
      "Arquitectura serverless",
      "Proveedores de autenticación integrados",
      "Hosting y analytics incluidos",
      "Excelente soporte para SDK móvil",
    ],
    useCases: [
      "Aplicaciones móviles",
      "Chat y colaboración en tiempo real",
      "Prototipado rápido",
      "Aplicaciones web pequeñas a medianas",
    ],
    popularity: 84,
  },
  {
    name: "MongoDB",
    category: "database",
    description:
      "Base de datos NoSQL flexible orientada a documentos para aplicaciones modernas",
    icon: "🍃",
    benefits: [
      "Flexibilidad sin esquema fijo",
      "Escalado horizontal con sharding",
      "Lenguaje de consultas rico",
      "Almacenamiento nativo de documentos JSON",
      "Excelente para datos no estructurados",
    ],
    useCases: [
      "Sistemas de gestión de contenido",
      "Analytics en tiempo real",
      "IoT y datos de series temporales",
      "Aplicaciones con esquemas en evolución",
    ],
    popularity: 87,
  },
  {
    name: "Vercel / AWS",
    category: "devops",
    description:
      "Plataformas cloud para despliegue y hosting de aplicaciones modernas",
    icon: "☁️",
    benefits: [
      "Deploy automático desde Git",
      "CDN global incluido",
      "Escalado automático",
      "SSL/HTTPS gratis",
      "Preview deployments para cada PR",
    ],
    useCases: [
      "Aplicaciones Next.js (Vercel)",
      "Infraestructura enterprise (AWS)",
      "Aplicaciones serverless",
      "Sitios con tráfico variable",
    ],
    popularity: 87,
  },
  {
    name: "Netlify",
    category: "devops",
    description:
      "Plataforma moderna de desarrollo web con despliegue instantáneo y funciones serverless",
    icon: "💎",
    benefits: [
      "Deploy con un clic desde Git",
      "Pipelines CI/CD integrados",
      "Edge functions para lógica serverless",
      "Manejo de formularios y gestión de identidad",
      "Rollbacks instantáneos y previews de branches",
    ],
    useCases: [
      "Sitios estáticos y apps JAMstack",
      "Proyectos React, Vue y Angular",
      "Aplicaciones serverless",
      "Frontend con backend serverless",
    ],
    popularity: 83,
  },
  {
    name: "Prisma",
    category: "backend",
    description: "ORM next-gen para TypeScript con tipo-seguridad completa",
    icon: "🔷",
    benefits: [
      "Queries type-safe (sin errores SQL)",
      "Migraciones automáticas",
      "Introspección de base de datos existente",
      "Auto-completado en el IDE",
      "Performance optimizado automáticamente",
    ],
    useCases: [
      "Nuevos proyectos TypeScript",
      "Migración desde ORMs legacy",
      "Aplicaciones con esquemas complejos",
      "Equipos que valoran developer experience",
    ],
    popularity: 82,
  },
  {
    name: "Stripe / PayPal",
    category: "tools",
    description: "Pasarelas de pago modernas para e-commerce",
    icon: "💳",
    benefits: [
      "Integración en días, no meses",
      "PCI compliance incluido",
      "Soporte para múltiples monedas",
      "Webhooks para automatización",
      "Dashboard completo de analytics",
    ],
    useCases: [
      "E-commerce y marketplaces",
      "Suscripciones SaaS",
      "Donaciones y crowdfunding",
      "Pagos internacionales",
    ],
    popularity: 93,
  },
  {
    name: "Resend",
    category: "tools",
    description:
      "API moderna de email diseñada para desarrolladores con integración de React Email",
    icon: "📧",
    benefits: [
      "API simple e intuitiva",
      "React Email para emails basados en componentes",
      "Validación de email integrada",
      "Analytics detallados y logs",
      "Tier gratuito para desarrollo",
    ],
    useCases: [
      "Emails transaccionales",
      "Campañas de marketing",
      "Notificaciones de usuario",
      "Resets de contraseña y emails de auth",
    ],
    popularity: 78,
  },
  {
    name: "shadcn/ui",
    category: "frontend",
    description: "Colección de componentes UI accesibles y customizables",
    icon: "🎭",
    benefits: [
      "Componentes copy-paste (no NPM dependency)",
      "Totalmente customizables",
      "Accesibilidad (WCAG) integrada",
      "Basado en Radix UI (probado en batalla)",
      "Diseño profesional out-of-the-box",
    ],
    useCases: [
      "Dashboards empresariales",
      "SaaS y aplicaciones internas",
      "Proyectos que requieren accesibilidad",
      "Equipos que quieren control total del UI",
    ],
    popularity: 79,
  },
  {
    name: "Gatsby",
    category: "frontend",
    description:
      "Generador de sitios estáticos basado en React con potente capa de datos",
    icon: "🚀",
    benefits: [
      "Rendimiento ultrarrápido con pre-renderizado",
      "Capa de datos GraphQL para cualquier fuente",
      "Rico ecosistema de plugins",
      "Code splitting y optimización automática",
      "Carga progresiva de imágenes integrada",
    ],
    useCases: [
      "Sitios web de marketing y landing pages",
      "Blogs y sitios de documentación",
      "Tiendas e-commerce",
      "Portafolios y sitios de agencias",
    ],
    popularity: 76,
  },
]

// ============================================
// ROI METRICS
// ============================================

export const roiMetrics: ROIMetric[] = [
  {
    metric: "Tasa de Conversión",
    traditional: 2.3,
    modern: 4.8,
    improvement: "+109%",
    unit: "%",
  },
  {
    metric: "Tiempo de Carga",
    traditional: 6.5,
    modern: 1.8,
    improvement: "-72%",
    unit: "seg",
  },
  {
    metric: "Tasa de Rebote",
    traditional: 58,
    modern: 32,
    improvement: "-45%",
    unit: "%",
  },
  {
    metric: "Páginas por Sesión",
    traditional: 2.1,
    modern: 4.7,
    improvement: "+124%",
    unit: "páginas",
  },
  {
    metric: "Tiempo en Sitio",
    traditional: 1.3,
    modern: 3.8,
    improvement: "+192%",
    unit: "min",
  },
  {
    metric: "Costo por Lead",
    traditional: 85,
    modern: 32,
    improvement: "-62%",
    unit: "$",
  },
  {
    metric: "Velocidad de Checkout",
    traditional: 180,
    modern: 45,
    improvement: "-75%",
    unit: "seg",
  },
  {
    metric: "Mobile Conversion Rate",
    traditional: 1.2,
    modern: 3.9,
    improvement: "+225%",
    unit: "%",
  },
]

export const costBreakdown = {
  traditional: {
    initial: 15000,
    monthly: 3500,
    yearly: 42000,
    threeYear: 141000,
    items: [
      { category: "Desarrollo Inicial", cost: 15000 },
      { category: "Hosting", monthly: 300 },
      { category: "Mantenimiento", monthly: 1200 },
      { category: "Updates de Seguridad", monthly: 800 },
      { category: "Soporte Técnico", monthly: 600 },
      { category: "Bug Fixes", monthly: 400 },
      { category: "Content Updates", monthly: 200 },
    ],
  },
  modern: {
    initial: 28000,
    monthly: 1200,
    yearly: 14400,
    threeYear: 71200,
    items: [
      { category: "Desarrollo Inicial", cost: 28000 },
      { category: "Hosting Cloud", monthly: 150 },
      { category: "Mantenimiento Automatizado", monthly: 400 },
      { category: "Updates Automáticas", monthly: 0 },
      { category: "Soporte Técnico", monthly: 350 },
      { category: "Monitoring", monthly: 100 },
      { category: "CDN", monthly: 200 },
    ],
  },
  savings: {
    threeYear: 69800,
    percentage: 49,
  },
}

// ============================================
// CASE STUDIES
// ============================================

export const caseStudies: CaseStudy[] = [
  {
    id: "ecommerce-fashion",
    client: "Boutique de Moda Premium",
    industry: "E-commerce / Fashion",
    challenge:
      "Tienda online con tasa de rebote del 68%, tiempo de carga de 8 segundos en móvil, y solo 1.8% de conversión. Plataforma legacy difícil de actualizar.",
    solution: [
      "Migración a Next.js 14 con App Router",
      "Implementación de Stripe para checkout optimizado",
      "PWA con funcionalidad offline para catálogo",
      "Optimización de imágenes con Sharp y CDN",
      "Implementación de búsqueda inteligente con Algolia",
    ],
    results: [
      {
        metric: "Conversión",
        before: "1.8%",
        after: "5.2%",
        improvement: "+189%",
      },
      {
        metric: "Tiempo de Carga",
        before: "8.3 seg",
        after: "1.6 seg",
        improvement: "-81%",
      },
      {
        metric: "Revenue",
        before: "$52k/mes",
        after: "$167k/mes",
        improvement: "+221%",
      },
      {
        metric: "Mobile Sales",
        before: "23%",
        after: "61%",
        improvement: "+165%",
      },
    ],
    technologies: ["Next.js", "TypeScript", "Stripe", "PostgreSQL", "Vercel"],
    timeline: "12 semanas",
    testimonial: {
      quote:
        "En 3 meses recuperamos la inversión. Ahora podemos actualizar productos en minutos en lugar de días, y nuestras ventas móviles se triplicaron.",
      author: "María Rodríguez",
      role: "CEO, Boutique Premium",
    },
  },
  {
    id: "saas-platform",
    client: "Plataforma SaaS de Gestión",
    industry: "SaaS / B2B",
    challenge:
      "Dashboard lento con 12+ segundos de carga, difícil de escalar más allá de 500 usuarios concurrentes. Costos de servidor elevados ($8k/mes).",
    solution: [
      "Reescritura completa en React 18 con Server Components",
      "Migración a arquitectura serverless en AWS",
      "Implementación de caching estratégico con Redis",
      "GraphQL API para reducir overfetching",
      "Real-time updates con WebSockets",
    ],
    results: [
      {
        metric: "Carga de Dashboard",
        before: "12.4 seg",
        after: "2.1 seg",
        improvement: "-83%",
      },
      {
        metric: "Usuarios Concurrentes",
        before: "500",
        after: "15,000",
        improvement: "+2900%",
      },
      {
        metric: "Costos de Servidor",
        before: "$8,000/mes",
        after: "$2,100/mes",
        improvement: "-74%",
      },
      {
        metric: "Customer Satisfaction",
        before: "6.8/10",
        after: "9.3/10",
        improvement: "+37%",
      },
    ],
    technologies: [
      "React 18",
      "Node.js",
      "GraphQL",
      "PostgreSQL",
      "AWS Lambda",
      "Redis",
    ],
    timeline: "16 semanas",
    testimonial: {
      quote:
        "La nueva plataforma nos permitió escalar de 500 a 15,000 usuarios concurrentes mientras reducíamos costos en 74%. El ROI fue del 420% en el primer año.",
      author: "Carlos Méndez",
      role: "CTO, SaaS Platform",
    },
  },
  {
    id: "corporate-website",
    client: "Firma de Servicios Profesionales",
    industry: "Servicios Corporativos",
    challenge:
      "Sitio corporativo desactualizado, generando solo 3-5 leads cualificados por mes. Sin estrategia móvil, ranking SEO en declive.",
    solution: [
      "Sitio Next.js con SSG para máximo SEO",
      "Diseño mobile-first con Tailwind CSS",
      "CMS headless (Sanity) para gestión de contenido",
      "Formularios optimizados con validación avanzada",
      "Blog integrado con estrategia de contenido SEO",
    ],
    results: [
      {
        metric: "Leads Mensuales",
        before: "4 leads",
        after: "47 leads",
        improvement: "+1075%",
      },
      {
        metric: "Tráfico Orgánico",
        before: "1,200/mes",
        after: "8,900/mes",
        improvement: "+642%",
      },
      {
        metric: "Ranking Keywords",
        before: "23 top 10",
        after: "187 top 10",
        improvement: "+713%",
      },
      {
        metric: "Tiempo de Carga",
        before: "7.2 seg",
        after: "1.3 seg",
        improvement: "-82%",
      },
    ],
    technologies: [
      "Next.js",
      "Sanity CMS",
      "Tailwind CSS",
      "TypeScript",
      "Vercel",
    ],
    timeline: "8 semanas",
    testimonial: {
      quote:
        "Pasamos de 4 leads al mes a más de 45. El sitio se convirtió en nuestra mejor herramienta de venta. La inversión se pagó en menos de 2 meses.",
      author: "Ana Martínez",
      role: "Directora de Marketing",
    },
  },
]

// ============================================
// PROCESS STEPS
// ============================================

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: "Auditoría y Estrategia",
    description:
      "Analizamos tu situación actual, objetivos de negocio, audiencia y competencia para crear una estrategia digital personalizada.",
    duration: "1-2 semanas",
    deliverables: [
      "Auditoría técnica completa de sitio actual",
      "Análisis de competencia y mercado",
      "Definición de objetivos y KPIs",
      "Roadmap de proyecto detallado",
      "Estimación de presupuesto y timeline",
    ],
    icon: "Search",
  },
  {
    step: 2,
    title: "Diseño y Experiencia de Usuario",
    description:
      "Creamos wireframes, prototipos interactivos y diseño visual que maximizan la conversión y reflejan tu marca.",
    duration: "2-3 semanas",
    deliverables: [
      "Arquitectura de información",
      "Wireframes de páginas clave",
      "Diseño UI en Figma (desktop, tablet, mobile)",
      "Prototipo interactivo clickeable",
      "Sistema de diseño y guía de estilo",
    ],
    icon: "Palette",
  },
  {
    step: 3,
    title: "Desarrollo Frontend",
    description:
      "Construcción de la interfaz con las tecnologías más modernas, optimizada para velocidad, SEO y conversión.",
    duration: "4-6 semanas",
    deliverables: [
      "Código React/Next.js con TypeScript",
      "Componentes reutilizables y modulares",
      "Integración con CMS (si aplica)",
      "Optimización de rendimiento y SEO",
      "Responsive design perfecto en todos los dispositivos",
    ],
    icon: "Code",
  },
  {
    step: 4,
    title: "Desarrollo Backend e Integraciones",
    description:
      "APIs robustas, integraciones con servicios externos y configuración de infraestructura escalable.",
    duration: "3-4 semanas",
    deliverables: [
      "API RESTful o GraphQL",
      "Configuración de base de datos",
      "Integraciones (pagos, CRM, analytics, etc.)",
      "Autenticación y seguridad",
      "Configuración de hosting y CI/CD",
    ],
    icon: "Server",
  },
  {
    step: 5,
    title: "Testing y Optimización",
    description:
      "Pruebas exhaustivas en múltiples dispositivos, navegadores y escenarios. Optimización final de performance.",
    duration: "1-2 semanas",
    deliverables: [
      "Testing funcional completo",
      "Testing de usabilidad y accesibilidad",
      "Optimización de Core Web Vitals",
      "Testing de seguridad y penetración",
      "Corrección de bugs y refinamiento",
    ],
    icon: "CheckCircle",
  },
  {
    step: 6,
    title: "Lanzamiento y Monitoreo",
    description:
      "Deploy a producción con estrategia de lanzamiento, migración de contenido y monitoreo post-lanzamiento.",
    duration: "1 semana",
    deliverables: [
      "Migración de contenido y datos",
      "Deploy a producción",
      "Configuración de analytics y monitoreo",
      "Training para tu equipo",
      "Soporte post-lanzamiento (30 días)",
    ],
    icon: "Rocket",
  },
]

// ============================================
// FAQS
// ============================================

export const faqs = [
  {
    question: "¿Cuánto tiempo toma desarrollar un sitio web?",
    answer:
      "Depende del tipo de proyecto. Una landing page toma 2-3 semanas, un sitio corporativo personalizado 6-8 semanas, y aplicaciones web complejas 5-8 semanas. Usamos un proceso ágil que permite ver progreso cada semana y hacer ajustes según sea necesario.",
  },
  {
    question: "¿Cuál es el costo de un sitio web profesional?",
    answer:
      "Nuestros proyectos empiezan desde $400 para landing pages hasta $1,250+ para aplicaciones web personalizadas. Los sitios corporativos completos desde $950. Ofrecemos planes de pago (50% inicial, 50% al finalizar) y hosting gratuito por 1 año incluido en todos los proyectos.",
  },
  {
    question: "¿Qué pasa si necesito hacer cambios al sitio?",
    answer:
      "Incluimos hasta 2 rondas de revisiones durante el desarrollo para asegurarnos que el sitio quede perfecto. Después del lanzamiento, ofrecemos 30 días de soporte gratuito para ajustes menores. También implementamos un CMS (Sanity) que te permite actualizar contenido sin programar.",
  },
  {
    question: "¿Incluyen el hosting y dominio?",
    answer:
      "Sí. Todos nuestros proyectos incluyen hosting profesional gratuito por 1 año. También te ayudamos con el registro de dominio y configuración de correos corporativos si lo necesitas. Recomendamos servicios confiables y te guiamos en todo el proceso.",
  },
  {
    question: "¿Qué tipo de mantenimiento ofrecen después del lanzamiento?",
    answer:
      "Ofrecemos planes de mantenimiento desde $95/mes que incluyen: actualizaciones regulares de seguridad, optimizaciones de velocidad, corrección rápida de errores, monitoreo de seguridad y disponibilidad. Todos los proyectos también incluyen 30 días de soporte gratuito post-lanzamiento.",
  },
  {
    question: "¿Qué tecnologías utilizan para desarrollar los sitios?",
    answer:
      "Usamos tecnologías modernas y probadas: Next.js para el framework, TypeScript para código robusto, Tailwind CSS para diseño responsive, y Sanity CMS para gestión de contenido fácil. Esto garantiza sitios rápidos, seguros y fáciles de mantener.",
  },
  {
    question: "¿Recibiré capacitación para administrar mi sitio?",
    answer:
      "¡Absolutamente! Te proporcionamos capacitación completa sobre cómo actualizar contenido, agregar páginas, subir imágenes y más. También incluimos documentación detallada y 30 días de soporte gratuito después del lanzamiento para cualquier duda.",
  },
  {
    question:
      "¿Pueden integrar mi sitio con otras herramientas (email, pagos, CRM)?",
    answer:
      "Sí. Tenemos experiencia integrando sistemas de pago (Stripe, PayPal), plataformas de email marketing, CRMs, Google Analytics, y más. Nuestro servicio de integraciones API desde $500 conecta tu sitio con las herramientas que ya usas para automatizar tu negocio.",
  },
]

// ============================================
// LEAD MAGNET
// ============================================

export const leadMagnet = {
  title: "Checklist Gratuito: ¿Tu Sitio Web Está Listo para 2026?",
  description:
    "Descarga nuestro checklist de 47 puntos usado por empresas Fortune 500 para auditar su presencia digital. Incluye secciones de: Performance, SEO, UX, Seguridad, Conversión y Móvil.",
  benefits: [
    "Evalúa tu sitio en 20 minutos",
    "Identifica exactamente qué mejorar primero",
    "Benchmarks de la industria incluidos",
    "Recomendaciones específicas de herramientas",
    "Template de presentación para stakeholders",
  ],
  preview: [
    "✓ Performance: 8 checks críticos (Core Web Vitals, TTFB, etc.)",
    "✓ SEO: 12 checks técnicos y de contenido",
    "✓ UX: 9 checks de usabilidad y accesibilidad",
    "✓ Seguridad: 7 checks de vulnerabilidades comunes",
    "✓ Conversión: 11 checks de optimización CRO",
  ],
}

// ============================================
// CTAS
// ============================================

export const ctas = {
  primary: {
    text: "Solicitar Auditoría Gratuita",
    description:
      "Análisis completo de tu sitio actual + consulta de 30 min con recomendaciones específicas. Sin compromiso.",
  },
  secondary: {
    text: "Hablar con un Experto",
    description: "Agenda una llamada para discutir tu proyecto específico",
  },
  leadMagnet: {
    text: "Descargar Checklist Gratis",
    description:
      "Recibe el checklist completo de 47 puntos en tu email en menos de 1 minuto",
  },
}

// ============================================
// STATISTICS
// ============================================

export const statistics = {
  hero: [
    { value: "300%", label: "Incremento promedio en conversiones" },
    { value: "5x", label: "Más rápido que sitios tradicionales" },
    { value: "70%", label: "Reducción en costos de mantenimiento" },
  ],
  impact: [
    { value: "2.1 seg", label: "Tiempo de carga promedio", trend: "down" },
    { value: "4.8%", label: "Tasa de conversión promedio", trend: "up" },
    { value: "49%", label: "Ahorro en TCO a 3 años", trend: "down" },
    { value: "225%", label: "Aumento en conversión móvil", trend: "up" },
  ],
}

// ============================================
// EXPORT DEFAULT
// ============================================

export default {
  heroData,
  tableOfContents,
  sections,
  comparisonData,
  techStack,
  roiMetrics,
  costBreakdown,
  caseStudies,
  processSteps,
  faqs,
  leadMagnet,
  ctas,
  statistics,
}
