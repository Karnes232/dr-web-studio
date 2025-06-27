import { Globe } from "lucide-react"
import React from "react"
import QuestionCard from "../QuestionCard"
import OptionButton from "../OptionButton"
import { FormData } from "@/types/form"
import { WebsiteType } from "@/sanity/queries/project-planner/websiteType"

const WebsiteTypeStep = ({
  formData,
  setFormData,
  title,
  description,
  websiteTypes,
}: {
  formData: FormData
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void
  title: string
  description: string
  websiteTypes: {
    value: string
    label: string
    description: string
  }[]
}) => {
  return (
    <QuestionCard
      icon={Globe}
      title={title}
      description={description}
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
