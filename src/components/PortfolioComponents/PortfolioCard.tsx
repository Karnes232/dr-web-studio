import { ExternalLink, Eye } from "lucide-react"
import React from "react"
import { TechBadge } from "./TechBadge"
import { useLocale } from "@/i18n/useLocale"
import Image from "next/image"

const PortfolioCard = ({
  project,
  onViewDetails,
}: {
  project: any
  onViewDetails: (project: any) => void
}) => {
  const { currentLocale, t } = useLocale()
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      {/* Project Image */}
      <div className="relative group">
        <Image
          src={project?.image?.asset?.url}
          alt={project?.title[currentLocale as keyof typeof project.title]}
          width={1000}
          height={1000}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-3">
            <a
              href={project.liveUrl}
              className="bg-white text-slate-800 p-3 rounded-full hover:bg-orange-500 hover:text-white transition-all duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
            <button
              onClick={() => onViewDetails(project)}
              className="bg-white text-slate-800 p-3 rounded-full hover:bg-teal-500 hover:text-white transition-all duration-200"
            >
              <Eye className="h-5 w-5" />
            </button>
          </div>
        </div>
        {project.featured && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {t("portfolio.featuredProject")}
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-orange-600 font-medium">
            {project.category[currentLocale as keyof typeof project.category]}
          </span>
          <span className="text-sm text-slate-500">{project.year}</span>
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-2">
          {project.title[currentLocale as keyof typeof project.title]}
        </h3>
        <p className="text-slate-600 mb-4">{project.client[currentLocale as keyof typeof project.client]}</p>

        {/* Tech Stack */}
        <div className="mb-4 truncate">
          {project.technologies.slice(0, 3).map((tech: any, index: number) => (
            <TechBadge key={index} tech={tech} />
          ))}
          {project.technologies.length > 3 && (
            <span className="text-sm text-slate-500">
              +{project.technologies.length - 3} more
            </span>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-teal-600">
              {project.outcomes[0]?.value}
            </div>
            <div className="text-xs text-slate-600 truncate">
              {project.outcomes[0]?.metric[currentLocale as 'en' | 'es']}
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">
              {project.outcomes[1]?.value}
            </div>
            <div className="text-xs text-slate-600 truncate">
              {project.outcomes[1]?.metric[currentLocale as 'en' | 'es']}
            </div>
          </div>
        </div>

        <button
          onClick={() => onViewDetails(project)}
          className="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200 font-medium"
        >
          {t("portfolio.fullCaseStudy")}
        </button>
      </div>
    </div>
  )
}

export default PortfolioCard
