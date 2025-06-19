import React from "react"
import OutcomeMetric from "./OutcomeMetric"
import { ExternalLink } from "lucide-react"
import { useLocale } from "@/i18n/useLocale"
import Image from "next/image"

const FeaturedProject = ({
  project,
  onViewDetails,
}: {
  project: any
  onViewDetails: (project: any) => void
}) => {
  const { currentLocale, t } = useLocale()
  return (
    <div className="bg-gradient-to-r from-slate-50 to-orange-50 rounded-2xl overflow-hidden shadow-xl mb-8 sm:mb-12">
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
        {/* Project Image */}
        <div className="relative order-1 lg:order-none">
          <Image
            width={1000}
            height={1000}
            src={project.image.asset.url}
            alt={project.title}
            className="w-full h-48 sm:h-56 lg:h-full object-cover rounded-xl shadow-lg"
          />
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold">
            🌟 {t("portfolio.featuredProject")}
          </div>
        </div>

        {/* Project Details */}
        <div className="flex flex-col justify-center order-2 lg:order-none">
          <div className="mb-4 sm:mb-6">
            <span className="text-orange-600 font-medium text-sm">
              {project.category[currentLocale as keyof typeof project.category]}
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mt-2 mb-2 leading-tight">
              {project.title[currentLocale as keyof typeof project.title]}
            </h3>
            <p className="text-slate-600 text-base sm:text-lg">{project.client}</p>
          </div>

          <div className="mb-4 sm:mb-6">
            <h4 className="font-semibold text-slate-800 mb-2 text-sm sm:text-base">{t("portfolio.theChallenge")}</h4>
            <p className="text-slate-600 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 text-sm sm:text-base">
              {project.problem[currentLocale as keyof typeof project.problem]}
            </p>

            <h4 className="font-semibold text-slate-800 mb-2 text-sm sm:text-base">{t("portfolio.ourSolution")}</h4>
            <p className="text-slate-600 line-clamp-2 sm:line-clamp-3 text-sm sm:text-base">
              {project.solution[currentLocale as keyof typeof project.solution]}
            </p>
          </div>

          {/* Key Outcomes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {project.outcomes.map((outcome: any, index: number) => (
              <OutcomeMetric key={index} {...outcome} />
            )).slice(0, 2)}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a
              href={project.liveUrl}
              className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 px-4 sm:px-6 rounded-lg font-medium text-center hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="inline h-4 w-4 mr-2" />
              {t("portfolio.viewLiveSite")}
            </a>
            <button
              onClick={() => onViewDetails(project)}
              className="flex-1 bg-slate-800 text-white py-3 px-4 sm:px-6 rounded-lg font-medium hover:bg-slate-700 transition-colors duration-200 text-sm sm:text-base"
            >
              {t("portfolio.fullCaseStudy")}
            </button>
          </div>
        </div>
      </div> 
    </div>
  )
}

export default FeaturedProject