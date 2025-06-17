import { FormData } from "@/types/form"
import React from "react"
import QuestionCard from "../QuestionCard"
import { Image } from "lucide-react"
import OptionButton from "../OptionButton"

const ContentStatusStep = ({
  formData,
  setFormData,
}: {
  formData: FormData
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void
}) => {
  const contentOptions = [
    {
      value: "ready",
      label: "Content Ready",
      description: "I have all text and images prepared",
    },
    {
      value: "partial",
      label: "Partially Ready",
      description: "I have some content, need help with the rest",
    },
    {
      value: "need-help",
      label: "Need Help",
      description: "I need assistance creating content",
    },
    {
      value: "professional",
      label: "Professional Writing",
      description: "I want professional copywriting services",
    },
  ]
  return (
    <QuestionCard
      icon={Image}
      title="What's your content status?"
      description="Do you have text, images, and other content ready?"
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
