import { FormData } from "@/types/form"
import React from "react"
import QuestionCard from "../QuestionCard"
import { Calendar } from "lucide-react"
import OptionButton from "../OptionButton"

const TimelineStep = ({
  formData,
  setFormData,
  title,
  description,
  timelineOptions,
}: {
  formData: FormData
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void
  title: string
  description: string
  timelineOptions: {
    value: string
    label: string
    description: string
  }[]
}) => {
  return (
    <QuestionCard
      icon={Calendar}
      title={title}
      description={description}
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
