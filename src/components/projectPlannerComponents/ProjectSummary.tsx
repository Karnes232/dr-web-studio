import { Check } from "lucide-react"
import React from "react"

const ProjectSummary = ({ formData }: { formData: any }) => {
  const getSummaryData = () => {
    const summary = []

    if (formData.websiteType) {
      summary.push({ label: "Website Type", value: formData.websiteType })
    }
    if (formData.pages) {
      summary.push({
        label: "Number of Pages",
        value: `${formData.pages} pages`,
      })
    }
    if (formData.designStyle) {
      summary.push({ label: "Design Style", value: formData.designStyle })
    }
    if (formData.features?.length > 0) {
      summary.push({ label: "Features", value: formData.features.join(", ") })
    }
    if (formData.budget) {
      summary.push({ label: "Budget Range", value: formData.budget })
    }
    if (formData.timeline) {
      summary.push({ label: "Timeline", value: formData.timeline })
    }
    if (formData.contentStatus) {
      summary.push({ label: "Content Status", value: formData.contentStatus })
    }
    if (formData.languages?.length > 0) {
      summary.push({ label: "Languages", value: formData.languages.join(", ") })
    }

    return summary
  }

  const summaryData = getSummaryData()

  return (
    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6 border border-orange-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Check className="h-5 w-5 text-green-500 mr-2" />
        Project Summary
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {summaryData.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 border-b border-orange-200 last:border-b-0"
          >
            <span className="text-gray-600 font-medium">{item.label}:</span>
            <span className="text-gray-800">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectSummary
