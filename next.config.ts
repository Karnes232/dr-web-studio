import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"
import { createClient } from "@sanity/client"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

// ── Localized-pathname migration: permanent (308) redirects from old URLs ──
// es static routes whose slug changed (old English slug → new Spanish slug).
const ES_STATIC_REDIRECTS: Record<string, string> = {
  "about-me": "sobre-mi",
  contact: "contacto",
  "custom-payment": "pago-personalizado",
  faqs: "preguntas-frecuentes",
  "our-services": "nuestros-servicios",
  "payment-success": "pago-exitoso",
  portfolio: "portafolio",
  pricing: "precios",
  "privacy-policy": "politica-de-privacidad",
  "project-planner": "planificador-de-proyectos",
  sitemap: "mapa-del-sitio",
  "terms-of-service": "terminos-de-servicio",
}

// en landing pages whose slug changed (old Spanish folder slug → new English slug).
const EN_LANDING_REDIRECTS: Record<string, string> = {
  "desarrollo-web-republica-dominicana": "web-development-dominican-republic",
  "desarrollo-ecommerce-republica-dominicana":
    "ecommerce-development-dominican-republic",
  "desarrollo-web-punta-cana": "web-development-punta-cana",
  "diseno-web-republica-dominicana": "web-design-dominican-republic",
  "mantenimiento-web-republica-dominicana":
    "website-maintenance-dominican-republic",
  "guia-completa-desarrollo-web-moderno-negocios":
    "complete-guide-modern-web-development-business",
}

// Per-document es slug 301/308s, built from Sanity at build time. Falls back to
// an empty list if Sanity is unreachable so the build never fails on this.
async function dynamicSlugRedirects() {
  const out: { source: string; destination: string; permanent: boolean }[] = []
  try {
    const sanity = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-06-01",
      useCdn: true,
    })
    const [services, posts] = await Promise.all([
      sanity.fetch<{ en: string | null; es: string | null }[]>(
        `*[_type == "serviceItem"]{ "en": slug.current, "es": slugEs.current }`,
      ),
      sanity.fetch<
        { en: string | null; es: string | null; previous: string[] | null }[]
      >(
        `*[_type == "blogPost"]{ "en": slug.current, "es": slugEs.current, "previous": previousSlugs }`,
      ),
    ])

    for (const s of services) {
      if (!s.en) continue
      const es = s.es ?? s.en
      // old: /es/our-services/<enSlug> → new: /es/nuestros-servicios/<esSlug>
      out.push({
        source: `/es/our-services/${s.en}`,
        destination: `/es/nuestros-servicios/${es}`,
        permanent: true,
      })
      // new prefix carrying the old (en) slug → localized es slug
      if (es !== s.en) {
        out.push({
          source: `/es/nuestros-servicios/${s.en}`,
          destination: `/es/nuestros-servicios/${es}`,
          permanent: true,
        })
      }
    }

    for (const p of posts) {
      if (!p.en) continue

      // The /blog prefix is identical in both locales; only the slug value
      // localizes. Redirect each locale's path that carries the OTHER locale's
      // slug to that locale's canonical slug (when the two slugs differ).
      if (p.es && p.es !== p.en) {
        // es path on the en slug → es slug
        out.push({
          source: `/es/blog/${p.en}`,
          destination: `/es/blog/${p.es}`,
          permanent: true,
        })
        // en path on the es slug → en slug (covers recent posts whose old /en
        // URL was the Spanish slug, now preserved as slugEs)
        out.push({
          source: `/en/blog/${p.es}`,
          destination: `/en/blog/${p.en}`,
          permanent: true,
        })
      }

      // Retired slugs: 301 any old slug to the current canonical for each locale.
      for (const prev of p.previous ?? []) {
        if (!prev || prev === p.en || prev === p.es) continue
        out.push({
          source: `/en/blog/${prev}`,
          destination: `/en/blog/${p.en}`,
          permanent: true,
        })
        out.push({
          source: `/es/blog/${prev}`,
          destination: `/es/blog/${p.es ?? p.en}`,
          permanent: true,
        })
      }
    }
  } catch (err) {
    console.warn(
      "[next.config] Skipping per-document slug redirects (Sanity unreachable):",
      err instanceof Error ? err.message : err,
    )
  }
  return out
}

// Content-Security-Policy. Shipped in Report-Only mode first: violations surface
// in the browser console (and any report endpoint) without breaking the page.
// Once the console is clean across checkout/Studio/analytics flows, switch the
// header key below to "Content-Security-Policy" to enforce.
// 'unsafe-inline' on script-src is required by Next.js RSC inline bootstrap and
// the next/font + next/image inline styles (no nonce pipeline in use).
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://js.stripe.com https://vercel.live https://www.googletagmanager.com https://analytics.ahrefs.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://*.stripe.com https://www.googletagmanager.com https://www.google-analytics.com",
  "font-src 'self' data:",
  "connect-src 'self' https://cdn.sanity.io https://api.stripe.com https://vercel.live https://www.google-analytics.com https://*.analytics.google.com https://analytics.ahrefs.com",
  "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://vercel.live",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join("; ")

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy-Report-Only",
    value: contentSecurityPolicy,
  },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2_678_400, // 31 days — Sanity assets are immutable per URL
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: "/api/webhooks/stripe",
        destination: "/api/webhooks/stripe",
      },
    ]
  },
  async redirects() {
    const dynamic = await dynamicSlugRedirects()
    const esStatic = Object.entries(ES_STATIC_REDIRECTS).map(
      ([oldSlug, newSlug]) => ({
        source: `/es/${oldSlug}`,
        destination: `/es/${newSlug}`,
        permanent: true,
      }),
    )
    const enLanding = Object.entries(EN_LANDING_REDIRECTS).map(
      ([oldSlug, newSlug]) => ({
        source: `/en/${oldSlug}`,
        destination: `/en/${newSlug}`,
        permanent: true,
      }),
    )
    // Generic fallback for any es service detail not covered by a per-doc rule
    // (must come AFTER the specific per-doc rules above).
    const esServicePrefixFallback = [
      {
        source: "/es/our-services/:slug",
        destination: "/es/nuestros-servicios/:slug",
        permanent: true,
      },
    ]
    return [...dynamic, ...esStatic, ...enLanding, ...esServicePrefixFallback]
  },
}

export default withNextIntl(nextConfig)
