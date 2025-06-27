import React from "react"
import QuestionCard from "../QuestionCard"
import { Building } from "lucide-react"
import CheckboxOption from "../CheckboxOption"
import { FormData } from "@/types/form"

const FeaturesStep = ({
  formData,
  setFormData,
  title,
  description,
  selectedFeaturesText,
  features,
}: {
  formData: FormData
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void
  title: string
  description: string
  selectedFeaturesText: string
  features: {
    value: string
    label: string
    description: string
  }[]
}) => {
  const handleFeatureToggle = (feature: any) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature],
    }))
  }
  return (
    <QuestionCard
      icon={Building}
      title={title}
      description={description}
      isActive={true}
      onClick={() => {}}
    >
      <div className="space-y-2">
        {features.map(feature => (
          <CheckboxOption
            key={feature.value}
            checked={formData.features.includes(feature.value)}
            onChange={() => handleFeatureToggle(feature.value)}
            description={feature.description}
          >
            {feature.label}
          </CheckboxOption>
        ))}
      </div>
      {formData.features.length > 0 && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <div className="text-sm text-green-800">
            <strong>{selectedFeaturesText}:</strong> {formData.features.length}
          </div>
        </div>
      )}
    </QuestionCard>
  )
}

export default FeaturesStep
