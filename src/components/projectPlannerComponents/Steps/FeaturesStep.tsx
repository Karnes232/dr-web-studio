import React from "react"
import QuestionCard from "../QuestionCard"
import { Building } from "lucide-react"
import CheckboxOption from "../CheckboxOption"
import { FormData } from "@/types/form"

const FeaturesStep = ({
  formData,
  setFormData,
}: {
  formData: FormData
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void
}) => {
  const featureOptions = [
    {
      value: "contact-form",
      label: "Contact Form",
      description: "Let visitors get in touch",
    },
    {
      value: "booking",
      label: "Booking System",
      description: "Online appointment scheduling",
    },
    {
      value: "blog",
      label: "Blog/News Section",
      description: "Content management system",
    },
    {
      value: "ecommerce",
      label: "Online Store",
      description: "Sell products online",
    },
    {
      value: "multilingual",
      label: "Multilingual",
      description: "Multiple language support",
    },
    {
      value: "payments",
      label: "Payment Processing",
      description: "Accept online payments",
    },
    {
      value: "gallery",
      label: "Photo Gallery",
      description: "Showcase images and media",
    },
    {
      value: "social",
      label: "Social Media Integration",
      description: "Connect with social platforms",
    },
    {
      value: "analytics",
      label: "Analytics & Tracking",
      description: "Monitor website performance",
    },
    {
      value: "seo",
      label: "SEO Optimization",
      description: "Search engine optimization",
    },
  ]
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
      title="What features do you need?"
      description="Select all features that you want to include in your website"
      isActive={true}
      onClick={() => {}}
    >
      <div className="space-y-2">
        {featureOptions.map(feature => (
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
            <strong>Selected features:</strong> {formData.features.length}
          </div>
        </div>
      )}
    </QuestionCard>
  )
}

export default FeaturesStep
