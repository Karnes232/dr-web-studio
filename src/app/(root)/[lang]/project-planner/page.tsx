import { Metadata } from "next"
import { getContactEmail } from "@/sanity/queries/layout/generalLayout"
import { getPlannerConfig } from "@/sanity/queries/project-planner/plannerConfig"
import { getPlannerServices } from "@/sanity/queries/project-planner/plannerServices"
import { getPlannerAddons } from "@/sanity/queries/project-planner/plannerAddons"
import { getPlannerDesignStyles } from "@/sanity/queries/project-planner/plannerDesignStyles"
import { getPlannerSizeTiers } from "@/sanity/queries/project-planner/plannerSizeTiers"
import { getSEO, getSeoSchema } from "@/sanity/queries/seo"
import { buildAlternates } from "@/lib/urls"
import ProjectPlanner from "@/components/projectPlannerComponents/ProjectPlanner"

export const revalidate = 86400

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}

export default async function ProjectPlannerPage({ params }: PageProps) {
  const { lang } = await params
  const [
    seoData,
    config,
    services,
    addons,
    designStyles,
    sizeTiers,
    companyEmail,
  ] = await Promise.all([
    getSeoSchema("project-planner"),
    getPlannerConfig(),
    getPlannerServices(),
    getPlannerAddons(),
    getPlannerDesignStyles(),
    getPlannerSizeTiers(),
    getContactEmail(),
  ])

  const contactEmail =
    config?.contactEmail?.trim() ||
    companyEmail?.trim() ||
    "james@dr-webstudio.com"

  return (
    <>
      {seoData?.structuredData?.[lang] && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: seoData.structuredData[lang] }}
        />
      )}
      <section
        id="project-planner"
        className="bg-slate-50 dark:bg-slate-950 py-10 lg:py-16"
      >
        {config ? (
          <ProjectPlanner
            data={{ config, services, addons, designStyles, sizeTiers }}
            locale={lang}
            contactEmail={contactEmail}
          />
        ) : (
          <div className="mx-auto max-w-xl px-6 py-20 text-center text-slate-500 dark:text-slate-400">
            The project planner is being set up. Please check back shortly.
          </div>
        )}
      </section>
    </>
  )
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params
  const seoData = await getSEO("project-planner")

  if (!seoData) return {}

  const { canonical: canonicalUrl, languages } = buildAlternates({
    currentLocale: lang,
    hrefFor: () => "/project-planner",
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
    robots: {
      index: !seoData.noIndex,
      follow: !seoData.noFollow,
    },
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
