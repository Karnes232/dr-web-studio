import { Globe } from "lucide-react"
import React from "react"
import QuestionCard from "../QuestionCard"
import OptionButton from "../OptionButton"
import { FormData } from "@/types/form"

const WebsiteTypeStep = ({
  formData,
  setFormData,
}: {
  formData: FormData
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void
}) => {
  const websiteTypes = [
    {
      value: "business",
      label: "Business Website",
      description: "Professional site for your company",
    },
    {
      value: "ecommerce",
      label: "E-commerce Store",
      description: "Online store to sell products",
    },
    {
      value: "portfolio",
      label: "Portfolio",
      description: "Showcase your work and skills",
    },
    {
      value: "blog",
      label: "Blog/News Site",
      description: "Content-focused website",
    },
    {
      value: "landing",
      label: "Landing Page",
      description: "Single page for marketing campaigns",
    },
    {
      value: "nonprofit",
      label: "Non-Profit",
      description: "Website for charitable organization",
    },
  ]
  return (
    <QuestionCard
      icon={Globe}
      title="What type of website do you need?"
      description="Select the option that best describes your project"
      isActive={true}
      onClick={() => {}}
    >
      <div className="space-y-3">
        {websiteTypes.map(type => (
          <OptionButton
            key={type.value}
            selected={formData.websiteType === type.value}
            onClick={() =>
              setFormData(prev => ({ ...prev, websiteType: type.value }))
            }
            description={type.description}
          >
            {type.label}
          </OptionButton>
        ))}
      </div>
    </QuestionCard>
  )
}

export default WebsiteTypeStep
