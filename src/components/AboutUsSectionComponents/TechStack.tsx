import React from "react"
import { Code } from "lucide-react"
const TechStack = ({ technologies, title }: { technologies: { name: string, color: string }[], title: string }) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
        <Code className="h-6 w-6 text-orange-500 mr-2" />
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech, index) => (
          <span
            key={index}
            className={`px-3 py-1 rounded-full text-sm font-medium ${tech.color}`}
          >
            {tech.name}
          </span>
        ))}
      </div>
    </div>
  )
}

export default TechStack
