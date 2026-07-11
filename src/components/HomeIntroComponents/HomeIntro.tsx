import React from "react"
import { RichText } from "@/components/LandingPageComponents/RichText"
import type { HomeIntroData } from "@/sanity/queries/home/homeIntro"

/**
 * Homepage value-proposition prose between the hero and the services grid.
 * Renders nothing until the `homeIntro` doc is authored in Studio, so the
 * component can ship ahead of the content.
 */
const HomeIntro = ({
  data,
  lang,
}: {
  data: HomeIntroData | null
  lang: "en" | "es"
}) => {
  const body = data?.body?.[lang]
  if (!data || !body || body.length === 0) return null

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center"
          style={{ fontFamily: "var(--font-crimson-pro)" }}
        >
          {data.title[lang]}
        </h2>
        <div className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
          <RichText value={body} />
        </div>
      </div>
    </section>
  )
}

export default HomeIntro
