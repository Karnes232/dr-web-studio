import { getAllBlogPostsSitemap } from "@/sanity/queries/blog/blog"
import { getServiceItemsSitemap } from "@/sanity/queries/services/serviceItem"
import type { Metadata } from "next"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"

export const revalidate = 3600

interface PageProps {
  params: Promise<{ lang: "en" | "es" }>
}

// ─────────────────────────────────────────────────────────────────────────────
// Labels
// ─────────────────────────────────────────────────────────────────────────────

const labels = {
  en: {
    pageTitle: "Sitemap",
    pageSubtitle: "A complete list of all pages on DR Web Studio.",
    mainPages: "Main Pages",
    services: "Services",
    servicePages: "Individual Services",
    landingPages: "Landing Pages",
    blog: "Blog",
    legal: "Legal",
    home: "Home",
    about: "About Me",
    servicesOverview: "Our Services",
    portfolio: "Portfolio",
    pricing: "Pricing",
    contact: "Contact",
    projectPlanner: "Project Planner",
    guide: "Complete Web Dev Guide",
    faqs: "FAQs",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    landingPageLabels: {
      "desarrollo-web-republica-dominicana": "Web Development — Dominican Republic",
      "diseno-web-republica-dominicana": "Web Design — Dominican Republic",
      "desarrollo-web-punta-cana": "Web Development — Punta Cana",
      "desarrollo-ecommerce-republica-dominicana": "E-commerce Development — Dominican Republic",
      "mantenimiento-web-republica-dominicana": "Website Maintenance — Dominican Republic",
    },
  },
  es: {
    pageTitle: "Mapa del Sitio",
    pageSubtitle: "Una lista completa de todas las páginas de DR Web Studio.",
    mainPages: "Páginas Principales",
    services: "Servicios",
    servicePages: "Servicios Individuales",
    landingPages: "Páginas de Aterrizaje",
    blog: "Blog",
    legal: "Legal",
    home: "Inicio",
    about: "Sobre Mí",
    servicesOverview: "Nuestros Servicios",
    portfolio: "Portafolio",
    pricing: "Precios",
    contact: "Contacto",
    projectPlanner: "Planificador de Proyectos",
    guide: "Guía Completa de Desarrollo Web",
    faqs: "Preguntas Frecuentes",
    privacyPolicy: "Política de Privacidad",
    termsOfService: "Términos de Servicio",
    landingPageLabels: {
      "desarrollo-web-republica-dominicana": "Desarrollo Web — República Dominicana",
      "diseno-web-republica-dominicana": "Diseño Web — República Dominicana",
      "desarrollo-web-punta-cana": "Desarrollo Web — Punta Cana",
      "desarrollo-ecommerce-republica-dominicana": "Desarrollo E-commerce — República Dominicana",
      "mantenimiento-web-republica-dominicana": "Mantenimiento Web — República Dominicana",
    },
  },
}

const LANDING_PAGE_SLUGS = [
  "desarrollo-web-republica-dominicana",
  "diseno-web-republica-dominicana",
  "desarrollo-web-punta-cana",
  "desarrollo-ecommerce-republica-dominicana",
  "mantenimiento-web-republica-dominicana",
] as const

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function SitemapSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-4 pb-2 border-b border-slate-100">
        {title}
      </h2>
      <ul className="space-y-2">{children}</ul>
    </div>
  )
}

function SitemapLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-center gap-2 text-slate-600 hover:text-amber-600 transition-colors duration-150 text-sm"
      >
        <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-amber-400 transition-colors flex-shrink-0" />
        {label}
      </Link>
    </li>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default async function SitemapPage({ params }: PageProps) {
  const { lang } = await params
  const l = labels[lang]

  const [serviceItems, blogPosts] = await Promise.all([
    getServiceItemsSitemap(),
    getAllBlogPostsSitemap(),
  ])

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-950 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h1
            className="text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-crimson-pro)" }}
          >
            {l.pageTitle}
          </h1>
          <p className="text-slate-400 text-lg">{l.pageSubtitle}</p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          {/* Main Pages */}
          <SitemapSection title={l.mainPages}>
            <SitemapLink href={`/${lang}`} label={l.home} />
            <SitemapLink href={`/${lang}/about-me`} label={l.about} />
            <SitemapLink href={`/${lang}/our-services`} label={l.servicesOverview} />
            <SitemapLink href={`/${lang}/portfolio`} label={l.portfolio} />
            <SitemapLink href={`/${lang}/pricing`} label={l.pricing} />
            <SitemapLink href={`/${lang}/blog`} label={l.blog} />
            <SitemapLink href={`/${lang}/contact`} label={l.contact} />
            <SitemapLink href={`/${lang}/project-planner`} label={l.projectPlanner} />
            <SitemapLink href={`/${lang}/faqs`} label={l.faqs} />
            <SitemapLink href={`/${lang}/guia-completa-desarrollo-web-moderno-negocios`} label={l.guide} />
          </SitemapSection>

          {/* Service Pages */}
          {serviceItems.length > 0 && (
            <SitemapSection title={l.servicePages}>
              {serviceItems.map(item => (
                <SitemapLink
                  key={item._id}
                  href={`/${lang}/our-services/${item.slug.current}`}
                  label={item.title[lang] ?? item.title.en}
                />
              ))}
            </SitemapSection>
          )}

          {/* Landing Pages */}
          <SitemapSection title={l.landingPages}>
            {LANDING_PAGE_SLUGS.map(slug => (
              <SitemapLink
                key={slug}
                href={`/${lang}/${slug}`}
                label={l.landingPageLabels[slug]}
              />
            ))}
          </SitemapSection>

          {/* Blog Posts */}
          {blogPosts.length > 0 && (
            <SitemapSection title={l.blog}>
              {blogPosts.map((post, i) => (
                <SitemapLink
                  key={i}
                  href={`/${lang}/blog/${post.slug.current}`}
                  label={post.title[lang] ?? post.title.en}
                />
              ))}
            </SitemapSection>
          )}

          {/* Legal */}
          <SitemapSection title={l.legal}>
            <SitemapLink href={`/${lang}/privacy-policy`} label={l.privacyPolicy} />
            <SitemapLink href={`/${lang}/terms-of-service`} label={l.termsOfService} />
          </SitemapSection>

        </div>
      </div>
    </main>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params

  return {
    title: lang === "es" ? "Mapa del Sitio | DR Web Studio" : "Sitemap | DR Web Studio",
    description:
      lang === "es"
        ? "Una lista completa de todas las páginas del sitio web de DR Web Studio."
        : "A complete list of all pages on the DR Web Studio website.",
    robots: { index: false, follow: false },
    alternates: {
      canonical: `${SITE_URL}/${lang}/sitemap`,
      languages: {
        en: `${SITE_URL}/en/sitemap`,
        es: `${SITE_URL}/es/sitemap`,
        "x-default": `${SITE_URL}/en/sitemap`,
      },
    },
  }
}

