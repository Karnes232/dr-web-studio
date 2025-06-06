import { ExternalLink, Github } from "lucide-react"
import React from "react"
import OutcomeMetric from "./OutcomeMetric"
import { TechBadge } from "./TechBadge"

const ProjectDetailModal = ({
  project,
  isOpen,
  onClose,
}: {
  project: any
  isOpen: boolean
  onClose: () => void
}) => {
  if (!isOpen || !project) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {project.title}
            </h2>
            <p className="text-slate-600">{project.client}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Project Image */}
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-64 object-cover rounded-xl mb-6"
          />

          {/* Project Overview */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                The Challenge
              </h3>
              <p className="text-slate-600 mb-6">{project.problem}</p>

              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Our Solution
              </h3>
              <p className="text-slate-600">{project.solution}</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Technologies Used
              </h3>
              <div className="mb-6">
                {project.technologies.map((tech: string, index: number) => (
                  <TechBadge key={index} tech={tech} />
                ))}
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Project Timeline
              </h3>
              <p className="text-slate-600">Completed in {project.year}</p>
            </div>
          </div>

          {/* Results */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              Results & Impact
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {project.outcomes.map(
                (
                  outcome: {
                    metric: string
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
          <div className="flex space-x-4">
            <a
              href={project.liveUrl}
              className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 px-6 rounded-lg font-medium text-center hover:from-orange-600 hover:to-yellow-600 transition-all duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="inline h-4 w-4 mr-2" />
              View Live Site
            </a>
            <a
              href={project.githubUrl}
              className="flex-1 bg-slate-800 text-white py-3 px-6 rounded-lg font-medium text-center hover:bg-slate-700 transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="inline h-4 w-4 mr-2" />
              View Code
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailModal
