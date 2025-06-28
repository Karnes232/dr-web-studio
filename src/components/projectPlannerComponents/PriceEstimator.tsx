import { FormData } from "@/types/form"
import { Zap } from "lucide-react"
import React from "react"

const PriceEstimator = ({ formData }: { formData: FormData }) => {
  const calculateEstimate = () => {
    let basePrice = 0
    let complexity = 1
    // Base price by website type
    switch (formData.websiteType) {
      case "business":
        basePrice = 600
        break
      case "ecommerce":
        basePrice = 1200
        complexity = 1.5
        break
      case "portfolio":
        basePrice = 400
        break
      case "blog":
        basePrice = 500
        break
      case "landing":
        basePrice = 300
        break
      case "nonprofit":
        basePrice = 450
        break
      default:
        basePrice = 500
    }

    // Page count factor
    const pageMultiplier = Math.max(1, formData.pages / 5)

    // Feature complexity
    const featureMultiplier = 1 + (formData.features?.length || 0) * 0.15

    // Design complexity
    const designMultiplier =
      formData.designStyle === "creative" || formData.designStyle === "elegant"
        ? 1.3
        : 1

    const estimate = Math.round(
      basePrice *
        pageMultiplier *
        featureMultiplier *
        designMultiplier *
        complexity,
    )

    return {
      min: Math.round(estimate * 0.8),
      max: Math.round(estimate * 1.2),
      timeline:
        formData.pages > 10
          ? "4-6 weeks"
          : formData.pages > 5
            ? "2-4 weeks"
            : "1-2 weeks",
    }
  }

  const estimate = calculateEstimate()

  if (!formData.websiteType) return null
  return (
    <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-6 border border-teal-200">
      <div className="flex items-center mb-4">
        <Zap className="h-6 w-6 text-teal-600 mr-3" />
        <h3 className="text-lg font-semibold text-gray-800">
          Estimated Project Cost
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-teal-600">
            ${estimate.min.toLocaleString()} - ${estimate.max.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 mt-1">Estimated Range</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-teal-600">
            {estimate.timeline}
          </div>
          <div className="text-sm text-gray-600 mt-1">Timeline</div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        * Final price may vary based on specific requirements and additional
        features
      </div>
    </div>
  )
}

export default PriceEstimator
