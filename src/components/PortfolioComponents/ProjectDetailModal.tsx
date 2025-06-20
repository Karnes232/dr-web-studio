import { ExternalLink } from "lucide-react"
import React from "react"
import OutcomeMetric from "./OutcomeMetric"
import { TechBadge } from "./TechBadge"
import { useLocale } from "@/i18n/useLocale"
import Image from "next/image"
import { FiGithub } from "react-icons/fi"

const ProjectDetailModal = ({
  project,
  isOpen,
  onClose,
}: {
  project: any
  isOpen: boolean
  onClose: () => void
}) => {
  const { currentLocale, t } = useLocale()
  if (!isOpen || !project) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex-shrink-0 bg-white border-b border-slate-200 p-4 sm:p-6 flex justify-between items-center">
          <div className="min-w-0 flex-1 mr-4">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-800 truncate">
              {project.title[currentLocale as keyof typeof project.title]}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 truncate">
              {project.client}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-slate-400 hover:text-slate-600 text-2xl font-bold w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-4 sm:p-6">
            {/* Project Image */}
            <Image
              width={1000}
              height={1000}
              src={project.image.asset.url}
              alt={project.title[currentLocale as keyof typeof project.title]}
              className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-xl mb-4 sm:mb-6"
            />

            {/* Project Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">
                  {t("portfolio.theChallenge")}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
                  {
                    project.problem[
                      currentLocale as keyof typeof project.problem
                    ]
                  }
                </p>

                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">
                  {t("portfolio.ourSolution")}
                </h3>
                <p className="text-sm sm:text-base text-slate-600">
                  {
                    project.solution[
                      currentLocale as keyof typeof project.solution
                    ]
                  }
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">
                  {t("portfolio.technologiesUsed")}
                </h3>
                <div className="mb-4 sm:mb-6">
                  {project.technologies.map((tech: string, index: number) => (
                    <TechBadge key={index} tech={tech} />
                  ))}
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">
                  {t("portfolio.projectTimeline")}
                </h3>
                <p className="text-sm sm:text-base text-slate-600">
                  Completed in {project.year}
                </p>
              </div>
            </div>

            {/* Results */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">
                {t("portfolio.resultsImpact")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {project.outcomes.map(
                  (
                    outcome: {
                      metric: { en: string; es: string }
                      value: string
                      improvement: string
                    },
                    index: number,
                  ) => (
                    <OutcomeMetric key={index} {...outcome} />
                  ),
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href={project.liveUrl}
                className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 px-4 sm:px-6 rounded-lg font-medium text-center hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 text-sm sm:text-base"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="inline h-4 w-4 mr-2" />
                {t("portfolio.viewLiveSite")}
              </a>
              <a
                href={project.githubUrl}
                className="flex-1 bg-slate-800 text-white py-3 px-4 sm:px-6 rounded-lg font-medium text-center hover:bg-slate-700 transition-colors duration-200 text-sm sm:text-base"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiGithub className="inline h-4 w-4 mr-2" />
                {t("portfolio.viewCode")}
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default ProjectDetailModal
