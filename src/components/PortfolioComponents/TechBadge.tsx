import React from "react"

export const TechBadge = ({ tech }: { tech: string }) => {
  return (
    <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">
      {tech}
    </span>
  )
}
