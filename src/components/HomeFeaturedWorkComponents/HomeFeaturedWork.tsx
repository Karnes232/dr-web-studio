"use client"
import React from "react"
import Image from "next/image"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useLocale } from "@/i18n/useLocale"
import type { LocalizedProject } from "@/sanity/queries/portfolio/project"

const COPY = {
  en: {
    title: "Recent work",
    subtitle:
      "A few sites built for Dominican and international businesses. The work is the proof.",
    challenge: "Challenge",
  },
  es: {
    title: "Trabajo reciente",
    subtitle:
      "Algunos sitios creados para negocios dominicanos e internacionales. El trabajo es la prueba.",
    challenge: "El reto",
  },
} as const

function TechTags({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.slice(0, 3).map(tech => (
        <span
          key={tech}
          className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200"
        >
          {tech}
        </span>
      ))}
    </div>
  )
}

const HomeFeaturedWork = ({
  projects,
  title,
  subtitle,
  lang,
}: {
  projects: LocalizedProject[]
  title?: string
  subtitle?: string
  lang: string
}) => {
  const { t } = useLocale()
  const locale = lang as "en" | "es"
  const fallback = COPY[locale] ?? COPY.en
  const copy = {
    title: title || fallback.title,
    subtitle: subtitle || fallback.subtitle,
    challenge: fallback.challenge,
  }

  if (!projects?.length) return null
  const [lead, ...rest] = projects

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left-aligned header with the all-work link on the right */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              {copy.title}
            </h2>
            <p className="mt-3 max-w-xl text-lg text-slate-600 dark:text-slate-400">
              {copy.subtitle}
            </p>
          </div>
          <Link
            href="/portfolio"
            className="group inline-flex shrink-0 items-center gap-1.5 font-semibold text-orange-700 dark:text-orange-400 hover:text-orange-800"
          >
            {t("resources.view_all_work")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Lead project — image-led split */}
        <Link
          href="/portfolio"
          className="group block overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg transition-shadow hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          <div className="grid items-stretch gap-0 lg:grid-cols-2">
            <div className="relative aspect-[16/10] w-full overflow-hidden lg:aspect-auto lg:min-h-[22rem]">
              <Image
                src={lead.image.asset.url}
                alt={lead.title}
                fill
                sizes="(max-width: 1024px) 100vw, 608px"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-700 dark:text-orange-400">
                {lead.category}
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                {lead.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {lead.client}
              </p>
              <p className="line-clamp-3 text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  {copy.challenge}:{" "}
                </span>
                {lead.problem}
              </p>
              {lead.outcomes?.length > 0 && (
                <div className="flex flex-wrap gap-6 pt-1">
                  {lead.outcomes.slice(0, 2).map((o, i) => (
                    <div key={i}>
                      <div className="text-2xl font-bold text-teal-700 dark:text-teal-400">
                        {o.value}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {o.metric}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between pt-2">
                <TechTags items={lead.technologies} />
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-orange-700 dark:text-orange-400 group-hover:text-orange-800">
                  {t("resources.view_project")}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Secondary projects */}
        {rest.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {rest.map(project => (
              <Link
                key={project._id}
                href="/portfolio"
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-md transition-shadow hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={project.image.asset.url}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 592px"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-orange-700 dark:text-orange-400">
                    {project.category}
                  </p>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {project.title}
                  </h3>
                  <div className="mt-auto pt-1">
                    <TechTags items={project.technologies} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default HomeFeaturedWork
