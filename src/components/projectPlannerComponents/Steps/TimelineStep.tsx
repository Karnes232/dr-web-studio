import { FormData } from "@/types/form"
import React from "react"
import QuestionCard from "../QuestionCard"
import { Calendar } from "lucide-react"
import OptionButton from "../OptionButton"

const TimelineStep = ({
  formData,
  setFormData,
}: {
  formData: FormData
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void
}) => {
  const timelineOptions = [
    {
      value: "1-2 weeks",
      label: "1-2 weeks",
      description: "Fast turnaround for simple projects",
    },
    {
      value: "2-4 weeks",
      label: "2-4 weeks",
      description: "Standard timeline for most projects",
    },
    {
      value: "1-2 months",
      label: "1-2 months",
      description: "Complex projects with custom features",
    },
    {
      value: "2-3 months",
      label: "2-3 months",
      description: "Large-scale projects with extensive requirements",
    },
    {
      value: "flexible",
      label: "Flexible",
      description: "No specific deadline",
    },
  ]

  return (
    <QuestionCard
      icon={Calendar}
      title="What's your preferred timeline?"
      description="When do you need your website to be completed?"
      isActive={true}
      onClick={() => {}}
    >
      <div className="space-y-3">
        {timelineOptions.map(timeline => (
          <OptionButton
            key={timeline.value}
            selected={formData.timeline === timeline.value}
            onClick={() =>
              setFormData(prev => ({ ...prev, timeline: timeline.value }))
            }
            description={timeline.description}
          >
            {timeline.label}
          </OptionButton>
        ))}
      </div>
    </QuestionCard>
  )
}

export default TimelineStep
