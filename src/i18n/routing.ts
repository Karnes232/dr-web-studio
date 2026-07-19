import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "es",
  // Preserve the existing always-prefixed URL scheme (/en/..., /es/...).
  localePrefix: "always",
  // localeDetection is intentionally left at its default (true): un-prefixed
  // URLs redirect to the visitor's browser/cookie locale. This is a deliberate
  // UX change from the old "bare path always → /en" behavior. Don't disable it
  // without revisiting that decision.

  // Disable next-intl's automatic hreflang `Link` HTTP header. Its `x-default`
  // points at the un-prefixed root (e.g. "/", "/blog"), which 307-redirects —
  // Ahrefs flags that as "hreflang to redirect / non-canonical / duplicate
  // language". We emit our own correct on-page <link rel="alternate"> tags via
  // buildAlternates() (src/lib/urls.ts), so the header is redundant.
  alternateLinks: false,

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
    "/diseno-de-paginas-web-santo-domingo": {
      en: "/web-design-santo-domingo",
      es: "/diseno-de-paginas-web-santo-domingo",
    },
    "/diseno-de-paginas-web-santiago": {
      en: "/web-design-santiago",
      es: "/diseno-de-paginas-web-santiago",
    },
    "/diseno-de-paginas-web-la-romana": {
      en: "/web-design-la-romana",
      es: "/diseno-de-paginas-web-la-romana",
    },
    "/diseno-de-paginas-web-higuey": {
      en: "/web-design-higuey",
      es: "/diseno-de-paginas-web-higuey",
    },
    "/diseno-de-paginas-web-san-pedro-de-macoris": {
      en: "/web-design-san-pedro-de-macoris",
      es: "/diseno-de-paginas-web-san-pedro-de-macoris",
    },
    "/diseno-de-paginas-web-punta-cana": {
      en: "/web-design-punta-cana",
      es: "/diseno-de-paginas-web-punta-cana",
    },
    "/diseno-de-paginas-web-puerto-plata": {
      en: "/web-design-puerto-plata",
      es: "/diseno-de-paginas-web-puerto-plata",
    },
    "/diseno-de-paginas-web-las-terrenas": {
      en: "/web-design-las-terrenas",
      es: "/diseno-de-paginas-web-las-terrenas",
    },
    "/paginas-web-para-hoteles": {
      en: "/web-design-hotels",
      es: "/paginas-web-para-hoteles",
    },
    "/paginas-web-para-restaurantes": {
      en: "/web-design-restaurants",
      es: "/paginas-web-para-restaurantes",
    },
    "/paginas-web-para-alquileres-vacacionales": {
      en: "/web-design-vacation-rentals",
      es: "/paginas-web-para-alquileres-vacacionales",
    },
    "/paginas-web-para-bodas-y-eventos": {
      en: "/web-design-weddings-and-events",
      es: "/paginas-web-para-bodas-y-eventos",
    },
    "/paginas-web-para-dentistas": {
      en: "/web-design-dentists",
      es: "/paginas-web-para-dentistas",
    },
    "/paginas-web-para-tour-operadores": {
      en: "/web-design-tour-operators",
      es: "/paginas-web-para-tour-operadores",
    },
    "/paginas-web-para-abogados": {
      en: "/web-design-lawyers",
      es: "/paginas-web-para-abogados",
    },
    "/paginas-web-para-inmobiliarias": {
      en: "/web-design-real-estate-agents",
      es: "/paginas-web-para-inmobiliarias",
    },
    "/paginas-web-para-salones-de-belleza": {
      en: "/web-design-for-salons-and-spas",
      es: "/paginas-web-para-salones-de-belleza",
    },
    "/paginas-web-para-constructoras": {
      en: "/web-design-for-construction",
      es: "/paginas-web-para-constructoras",
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
