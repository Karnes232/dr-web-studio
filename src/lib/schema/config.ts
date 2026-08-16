import { SITE_URL } from "@/lib/site"

/**
 * Static, non-CMS business facts for schema.org structured data.
 *
 * Identity/contact data (name, email, phone, address, geo, hours, social links,
 * logo) is the single source of truth in the Sanity `generalLayout` singleton
 * and read via `getLayoutSchemaData()`. This file holds only the facts that
 * don't belong in the CMS: stable entity @ids, the service price list, and the
 * descriptive constants for the Person/Organization nodes.
 */

// Canonical entity @ids — referenced across pages so every node resolves to the
// same Organization / Person / WebSite regardless of which page emits it.
export const ORG_ID = `${SITE_URL}/#organization`
export const PERSON_ID = `${SITE_URL}/#james-karnes`
export const WEBSITE_ID = `${SITE_URL}/#website`

export const FOUNDING_DATE = "2023-01-01"
export const PRICE_RANGE = "$400 - $1,250"
export const CURRENCIES_ACCEPTED = "USD"
export const PAYMENT_ACCEPTED = "Credit Card, Bank Transfer, PayPal"

export const ORG_DESCRIPTION = {
  en: "Custom website development agency in Punta Cana, Dominican Republic. We build fast, modern, multilingual websites using Next.js, Sanity CMS, and Tailwind CSS for tourism, e-commerce, and local businesses.",
  es: "Agencia de desarrollo web a medida en Punta Cana, República Dominicana. Creamos sitios web rápidos, modernos y multilingües con Next.js, Sanity CMS y Tailwind CSS para turismo, comercio electrónico y negocios locales.",
} as const

// Areas the business serves — typed City/Country nodes with Wikipedia sameAs so
// AI/search can resolve the place entities.
export const AREA_SERVED = [
  {
    "@type": "City",
    name: "Punta Cana",
    sameAs: "https://en.wikipedia.org/wiki/Punta_Cana",
  },
  {
    "@type": "City",
    name: "Santo Domingo",
    sameAs: "https://en.wikipedia.org/wiki/Santo_Domingo",
  },
  {
    "@type": "City",
    name: "Santiago de los Caballeros",
    sameAs: "https://en.wikipedia.org/wiki/Santiago_de_los_Caballeros",
  },
  {
    "@type": "City",
    name: "La Romana",
    sameAs: "https://en.wikipedia.org/wiki/La_Romana,_Dominican_Republic",
  },
  {
    "@type": "City",
    name: "Higüey",
    sameAs: "https://en.wikipedia.org/wiki/Higüey,_Dominican_Republic",
  },
  {
    "@type": "City",
    name: "San Pedro de Macorís",
    sameAs: "https://en.wikipedia.org/wiki/San_Pedro_de_Macorís",
  },
  {
    "@type": "City",
    name: "Puerto Plata",
    sameAs: "https://en.wikipedia.org/wiki/Puerto_Plata",
  },
  {
    "@type": "City",
    name: "Las Terrenas",
    sameAs: "https://en.wikipedia.org/wiki/Las_Terrenas",
  },
  {
    "@type": "Country",
    name: "Dominican Republic",
    sameAs: "https://en.wikipedia.org/wiki/Dominican_Republic",
  },
] as const

// James Karnes (Person node).
export const PERSON_JOB_TITLE = "Founder & Web Developer"
export const PERSON_KNOWS_ABOUT = [
  "Next.js",
  "React",
  "TypeScript",
  "Sanity CMS",
  "Headless CMS",
  "Web Performance Optimization",
  "SEO",
  "E-commerce Development",
  "Tailwind CSS",
]
export const PERSON_KNOWS_LANGUAGE = ["en", "es"]

/**
 * Published base prices per service, keyed by the service's English slug.
 * Names/descriptions/URLs are pulled live from the `serviceItem` documents; only
 * the price lives here (kept out of the CMS to stay consistent with the public
 * pricing page). `unit: "MONTH"` marks recurring offers.
 */
export const SERVICE_PRICES: Record<string, { price: number; unit?: "MONTH" }> =
  {
    "landing-pages": { price: 400 },
    "website-migrations-or-rebuilds": { price: 600 },
    "headless-cms-development": { price: 700 },
    "multilingual-and-international-websites": { price: 800 },
    "e-commerce": { price: 900 },
    "custom-business": { price: 950 },
    "web-applications": { price: 1250 },
    "api-integrations-and-automation": { price: 500 },
    "ongoing-website-maintenance-and-support": { price: 95, unit: "MONTH" },
  }
