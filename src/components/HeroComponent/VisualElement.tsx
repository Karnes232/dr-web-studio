"use client"
import React from "react"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import { ArrowUpRight } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useLocale } from "@/i18n/useLocale"
import type { Project } from "@/sanity/queries/portfolio/project"

const VisualElement = ({
  projects,
  currentLocale,
}: {
  projects: Project[]
  currentLocale: string
}) => {
  const { t } = useLocale()
  const locale = currentLocale as "en" | "es"

  if (!projects?.length) return null

  return (
    <div className="relative">
      <Swiper
        modules={[Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        pagination={{ clickable: true }}
        className="w-full xl:px-4"
      >
        {projects.map(project => (
          <SwiperSlide key={project._id}>
            <Link
              href="/portfolio"
              className="group block rounded-2xl border border-white/15 bg-white/10 p-2.5 shadow-2xl backdrop-blur-lg transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              {/* Real project screenshot */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-900">
                <Image
                  src={`${project.image.asset.url}?w=1200&q=70&auto=format&fit=max`}
                  alt={project.title[locale]}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-cover object-top"
                  {...(project.image.asset.metadata?.lqip
                    ? {
                        placeholder: "blur" as const,
                        blurDataURL: project.image.asset.metadata.lqip,
                      }
                    : {})}
                />
              </div>

              {/* Caption */}
              <div className="px-2 pb-1 pt-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-orange-300">
                      {project.category[locale]}
                    </p>
                    <h3 className="mt-1 truncate text-lg font-semibold text-white">
                      {project.title[locale]}
                    </h3>
                  </div>
                  <span className="mt-1 inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium text-white/90 transition-colors group-hover:text-orange-300">
                    {t("resources.view_project")}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map(tech => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/90"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default VisualElement
