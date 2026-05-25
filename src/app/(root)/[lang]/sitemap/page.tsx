import { getAllBlogPostsSitemap } from "@/sanity/queries/blog/blog"
import { getServiceItemsSitemap } from "@/sanity/queries/services/serviceItem"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { buildAlternates } from "@/lib/urls"
import { slugForLocale } from "@/lib/slugs"

type Href = Parameters<typeof Link>[0]["href"]

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
      "desarrollo-web-republica-dominicana":
        "Web Development — Dominican Republic",
      "diseno-web-republica-dominicana": "Web Design — Dominican Republic",
      "desarrollo-web-punta-cana": "Web Development — Punta Cana",
      "desarrollo-ecommerce-republica-dominicana":
        "E-commerce Development — Dominican Republic",
      "mantenimiento-web-republica-dominicana":
        "Website Maintenance — Dominican Republic",
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
      "desarrollo-web-republica-dominicana":
        "Desarrollo Web — República Dominicana",
      "diseno-web-republica-dominicana": "Diseño Web — República Dominicana",
      "desarrollo-web-punta-cana": "Desarrollo Web — Punta Cana",
      "desarrollo-ecommerce-republica-dominicana":
        "Desarrollo E-commerce — República Dominicana",
      "mantenimiento-web-republica-dominicana":
        "Mantenimiento Web — República Dominicana",
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

function SitemapLink({ href, label }: { href: Href; label: string }) {
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
            <SitemapLink href="/" label={l.home} />
            <SitemapLink href="/about-me" label={l.about} />
            <SitemapLink href="/our-services" label={l.servicesOverview} />
            <SitemapLink href="/portfolio" label={l.portfolio} />
            <SitemapLink href="/pricing" label={l.pricing} />
            <SitemapLink href="/blog" label={l.blog} />
            <SitemapLink href="/contact" label={l.contact} />
            <SitemapLink href="/project-planner" label={l.projectPlanner} />
            <SitemapLink href="/faqs" label={l.faqs} />
            <SitemapLink
              href="/guia-completa-desarrollo-web-moderno-negocios"
              label={l.guide}
            />
          </SitemapSection>

          {/* Service Pages */}
          {serviceItems.length > 0 && (
            <SitemapSection title={l.servicePages}>
              {serviceItems.map(item => (
                <SitemapLink
                  key={item._id}
                  href={{
                    pathname: "/our-services/[slug]",
                    params: { slug: slugForLocale(item, lang) },
                  }}
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
                href={`/${slug}` as Href}
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
                  href={{
                    pathname: "/blog/[slug]",
                    params: { slug: slugForLocale(post, lang) },
                  }}
                  label={post.title[lang] ?? post.title.en}
                />
              ))}
            </SitemapSection>
          )}

          {/* Legal */}
          <SitemapSection title={l.legal}>
            <SitemapLink href="/privacy-policy" label={l.privacyPolicy} />
            <SitemapLink href="/terms-of-service" label={l.termsOfService} />
          </SitemapSection>
        </div>
      </div>
    </main>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params

  const { canonical: canonicalUrl, languages } = buildAlternates({
    currentLocale: lang,
    hrefFor: () => "/sitemap",
  })

  return {
    title:
      lang === "es"
        ? "Mapa del Sitio | DR Web Studio"
        : "Sitemap | DR Web Studio",
    description:
      lang === "es"
        ? "Una lista completa de todas las páginas del sitio web de DR Web Studio."
        : "A complete list of all pages on the DR Web Studio website.",
    robots: { index: false, follow: false },
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
  }
}
