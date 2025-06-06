import React from "react"
import OutcomeMetric from "./OutcomeMetric"
import { ExternalLink } from "lucide-react"

const FeaturedProject = ({
  project,
  onViewDetails,
}: {
  project: any
  onViewDetails: (project: any) => void
}) => {
  return (
    <div className="bg-gradient-to-r from-slate-50 to-orange-50 rounded-2xl overflow-hidden shadow-xl mb-12">
      <div className="grid lg:grid-cols-2 gap-8 p-8">
        {/* Project Image */}
        <div className="relative">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-64 lg:h-full object-cover rounded-xl shadow-lg"
          />
          <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold">
            🌟 Featured Project
          </div>
        </div>

        {/* Project Details */}
        <div className="flex flex-col justify-center">
          <div className="mb-4">
            <span className="text-orange-600 font-medium text-sm">
              {project.category}
            </span>
            <h3 className="text-3xl font-bold text-slate-800 mt-2 mb-2">
              {project.title}
            </h3>
            <p className="text-slate-600 text-lg">{project.client}</p>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-slate-800 mb-2">The Challenge</h4>
            <p className="text-slate-600 mb-4">{project.problem}</p>

            <h4 className="font-semibold text-slate-800 mb-2">Our Solution</h4>
            <p className="text-slate-600">{project.solution}</p>
          </div>

          {/* Key Outcomes */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {project.outcomes.map((outcome: any, index: number) => (
              <OutcomeMetric key={index} {...outcome} />
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex space-x-4">
            <a
              href={project.liveUrl}
              className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 px-6 rounded-lg font-medium text-center hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="inline h-4 w-4 mr-2" />
              View Live Site
            </a>
            <button
              onClick={() => onViewDetails(project)}
              className="flex-1 bg-slate-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-slate-700 transition-colors duration-200"
            >
              Full Case Study
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturedProject
