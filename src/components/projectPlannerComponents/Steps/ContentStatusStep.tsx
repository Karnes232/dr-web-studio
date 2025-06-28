import { FormData } from "@/types/form"
import React from "react"
import QuestionCard from "../QuestionCard"
import { Image } from "lucide-react"
import OptionButton from "../OptionButton"

const ContentStatusStep = ({
  formData,
  setFormData,
  title,
  description,
  contentOptions,
}: {
  formData: FormData
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void
  title: string
  description: string
  contentOptions: {
    value: string
    label: string
    description: string
  }[]
}) => {
  return (
    <QuestionCard
      icon={Image}
      title={title}
      description={description}
      isActive={true}
      onClick={() => {}}
    >
      <div className="space-y-3">
        {contentOptions.map(content => (
          <OptionButton
            key={content.value}
            selected={formData.contentStatus === content.value}
            onClick={() =>
              setFormData(prev => ({ ...prev, contentStatus: content.value }))
            }
            description={content.description}
          >
            {content.label}
          </OptionButton>
        ))}
      </div>
    </QuestionCard>
  )
}

export default ContentStatusStep
