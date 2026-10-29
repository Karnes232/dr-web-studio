import { getLandingPage } from "@/sanity/queries/landingPages/landingPage"
import { getSEO } from "@/sanity/queries/seo"
import { LandingHero } from "@/components/LandingPageComponents/LandingHero"
import { LandingStatsBar } from "@/components/LandingPageComponents/LandingStatsBar"
import { LandingServicesGrid } from "@/components/LandingPageComponents/LandingServicesGrid"
import { LandingWhyUs } from "@/components/LandingPageComponents/LandingWhyUs"
import { LandingProcess } from "@/components/LandingPageComponents/LandingProcess"
import { LandingPortfolioHighlight } from "@/components/LandingPageComponents/LandingPortfolioHighlight"
import { LandingTestimonials } from "@/components/LandingPageComponents/LandingTestimonials"
import { LandingFaq } from "@/components/LandingPageComponents/LandingFaq"
import { LandingContactCta } from "@/components/LandingPageComponents/LandingContactCta"
import type { Metadata } from "next"
import { buildAlternates } from "@/lib/urls"
import { getLandingGraph } from "@/lib/schema/graph"
import { JsonLd } from "@/components/seo/JsonLd"
import { getTranslations } from "next-intl/server"
import { getLayoutSchemaData } from "@/sanity/queries/layout/generalLayout"
import { waHref } from "@/lib/contact"

export const revalidate = 86400

const PAGE_SLUG = "chatbot-whatsapp-republica-dominicana"
const PAGE_HREF = "/chatbot-whatsapp-republica-dominicana"

interface PageProps {
  params: Promise<{ lang: "en" | "es" }>
}

export default async function ChatbotWhatsappRepublicaDominicana({
  params,
}: PageProps) {
  const { lang } = await params
  const [data, layout, t] = await Promise.all([
    getLandingPage(PAGE_SLUG, lang),
    getLayoutSchemaData(),
    getTranslations({ locale: lang }),
  ])

  if (!data) return null

  // The product is its own demo: the hero CTA opens DR's WhatsApp, where the
  // live agent answers. The CMS href stays as the fallback if no number is set.
  const demoText = t("whatsappDemo.message")
  if (layout?.whatsapp) {
    data.hero.primaryCtaHref = waHref(layout.whatsapp, demoText)
  }

  const graph = await getLandingGraph({
    lang,
    pageName: PAGE_SLUG,
    href: PAGE_HREF,
    crumbs: [
      { name: lang === "es" ? "Inicio" : "Home", href: "/" },
      { name: data.hero.headline, href: PAGE_HREF },
    ],
    serviceName: data.hero.headline,
    serviceDescription: data.hero.subheadline,
    faqItems: data.faq.items.map(i => ({
      question: i.question,
      answer: i.answerText,
    })),
    structuredData: data.structuredData,
  })

  return (
    <main>
      <LandingHero data={data.hero} lang={lang} />
      {data.statsBar.length > 0 && <LandingStatsBar stats={data.statsBar} />}
      {data.servicesGrid.items.length > 0 && (
        <LandingServicesGrid
          sectionTitle={data.servicesGrid.sectionTitle}
          sectionSubtitle={data.servicesGrid.sectionSubtitle}
          items={data.servicesGrid.items}
          lang={lang}
        />
      )}
      {data.whyUs.items.length > 0 && (
        <LandingWhyUs
          sectionTitle={data.whyUs.sectionTitle}
          sectionSubtitle={data.whyUs.sectionSubtitle}
          items={data.whyUs.items}
        />
      )}
      {data.process.steps.length > 0 && (
        <LandingProcess
          sectionTitle={data.process.sectionTitle}
          sectionSubtitle={data.process.sectionSubtitle}
          steps={data.process.steps}
        />
      )}
      {data.portfolioHighlight.projects.length > 0 && (
        <LandingPortfolioHighlight
          sectionTitle={data.portfolioHighlight.sectionTitle}
          sectionSubtitle={data.portfolioHighlight.sectionSubtitle}
          projects={data.portfolioHighlight.projects}
          ctaText={data.portfolioHighlight.ctaText}
          ctaHref={data.portfolioHighlight.ctaHref}
          lang={lang}
        />
      )}
      {data.testimonials.items.length > 0 && (
        <LandingTestimonials
          sectionTitle={data.testimonials.sectionTitle}
          items={data.testimonials.items}
        />
      )}
      {data.faq.items.length > 0 && (
        <LandingFaq
          sectionTitle={data.faq.sectionTitle}
          sectionSubtitle={data.faq.sectionSubtitle}
          items={data.faq.items}
        />
      )}

      <LandingContactCta hero={data.hero} lang={lang} whatsappText={demoText} />

      <JsonLd data={graph} />
    </main>
  )
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params
  const seoData = await getSEO(PAGE_SLUG)

  if (!seoData) return {}

  const { canonical: canonicalUrl, languages } = buildAlternates({
    currentLocale: lang,
    hrefFor: () => "/chatbot-whatsapp-republica-dominicana",
  })

  return {
    title: seoData.meta[lang]?.title,
    description: seoData.meta[lang]?.description,
    keywords: seoData.meta[lang]?.keywords.join(", "),
    openGraph: {
      title: seoData.openGraph[lang]?.title || seoData.meta[lang]?.title,
      description:
        seoData.openGraph[lang]?.description || seoData.meta[lang]?.description,
      url: canonicalUrl,
      type: "website",
      locale: lang === "es" ? "es_ES" : "en_US",
      images: seoData.openGraph.image
        ? [
            {
              url: seoData.openGraph.image.url,
              width: seoData.openGraph.image.width,
              height: seoData.openGraph.image.height,
            },
          ]
        : [],
    },
    robots: { index: !seoData.noIndex, follow: !seoData.noFollow },
    twitter: {
      card: "summary_large_image",
      title: seoData.openGraph[lang]?.title || seoData.meta[lang]?.title,
      description:
        seoData.openGraph[lang]?.description || seoData.meta[lang]?.description,
      images: seoData.openGraph.image ? [seoData.openGraph.image.url] : [],
    },
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
  }
}
