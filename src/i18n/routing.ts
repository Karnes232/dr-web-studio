import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  // Preserve the existing always-prefixed URL scheme (/en/..., /es/...).
  localePrefix: "always",
  // localeDetection is intentionally left at its default (true): un-prefixed
  // URLs redirect to the visitor's browser/cookie locale. This is a deliberate
  // UX change from the old "bare path always → /en" behavior. Don't disable it
  // without revisiting that decision.

  // Localized URL pathnames. KEY = internal app-router folder name (do NOT
  // rename the folders); VALUE = per-locale external slug. next-intl rewrites
  // the localized prefix; the [slug] token is passed through unchanged and the
  // per-locale slug value is supplied by our own helpers (see src/lib/slugs.ts).
  pathnames: {
    "/": "/",
    "/about-me": { en: "/about-me", es: "/sobre-mi" },
    // /blog kept identical in both locales (only the post slug value localizes).
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/contact": { en: "/contact", es: "/contacto" },
    "/custom-payment": { en: "/custom-payment", es: "/pago-personalizado" },
    "/faqs": { en: "/faqs", es: "/preguntas-frecuentes" },
    "/our-services": { en: "/our-services", es: "/nuestros-servicios" },
    "/our-services/[slug]": {
      en: "/our-services/[slug]",
      es: "/nuestros-servicios/[slug]",
    },
    "/payment-success": { en: "/payment-success", es: "/pago-exitoso" },
    "/portfolio": { en: "/portfolio", es: "/portafolio" },
    "/pricing": { en: "/pricing", es: "/precios" },
    "/privacy-policy": {
      en: "/privacy-policy",
      es: "/politica-de-privacidad",
    },
    "/project-planner": {
      en: "/project-planner",
      es: "/planificador-de-proyectos",
    },
    "/sitemap": { en: "/sitemap", es: "/mapa-del-sitio" },
    "/terms-of-service": {
      en: "/terms-of-service",
      es: "/terminos-de-servicio",
    },

    // Bidirectional SEO landing pages. KEY = existing (Spanish) folder name;
    // English gets a translated slug, Spanish keeps the current slug.
    "/desarrollo-web-republica-dominicana": {
      en: "/web-development-dominican-republic",
      es: "/desarrollo-web-republica-dominicana",
    },
    "/desarrollo-ecommerce-republica-dominicana": {
      en: "/ecommerce-development-dominican-republic",
      es: "/desarrollo-ecommerce-republica-dominicana",
    },
    "/desarrollo-web-punta-cana": {
      en: "/web-development-punta-cana",
      es: "/desarrollo-web-punta-cana",
    },
    "/diseno-web-republica-dominicana": {
      en: "/web-design-dominican-republic",
      es: "/diseno-web-republica-dominicana",
    },
    "/mantenimiento-web-republica-dominicana": {
      en: "/website-maintenance-dominican-republic",
      es: "/mantenimiento-web-republica-dominicana",
    },
    "/guia-completa-desarrollo-web-moderno-negocios": {
      en: "/complete-guide-modern-web-development-business",
      es: "/guia-completa-desarrollo-web-moderno-negocios",
    },
  },
})

export type AppPathnames = keyof typeof routing.pathnames
