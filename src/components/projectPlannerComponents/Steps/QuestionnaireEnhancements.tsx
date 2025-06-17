import { FormData } from "@/types/form"
import React from "react"
import PriceEstimator from "../PriceEstimator"

const QuestionnaireEnhancements = ({
  formData,
  setFormData,
}: {
  formData: FormData
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Questionnaire Enhancement Components
        </h1>
        <p className="text-gray-600">
          Additional components to enhance the questionnaire experience
        </p>
      </div> */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Real-time Price Estimator
        </h2>
        <PriceEstimator formData={formData} />
      </div>
    </div>
  )
}

export default QuestionnaireEnhancements
