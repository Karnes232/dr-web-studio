import React from "react"
import QuestionCard from "../QuestionCard"
import { Palette } from "lucide-react"
import OptionButton from "../OptionButton"
import { FormData } from "@/types/form"

const DesignStyleStep = ({
  formData,
  setFormData,
  title,
  description,
  designStyles,
}: {
  formData: FormData
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void
  title: string
  description: string
  designStyles: {
    value: string
    label: string
    description: string
  }[]
}) => {
  // const designStyles = [
  //   {
  //     value: "modern",
  //     label: "Modern & Clean",
  //     description: "Contemporary design with clean lines",
  //   },
  //   {
  //     value: "minimal",
  //     label: "Minimal",
  //     description: "Simple and focused design",
  //   },
  //   {
  //     value: "colorful",
  //     label: "Colorful & Vibrant",
  //     description: "Bold colors and energetic feel",
  //   },
  //   {
  //     value: "corporate",
  //     label: "Corporate",
  //     description: "Professional and trustworthy",
  //   },
  //   {
  //     value: "creative",
  //     label: "Creative & Artistic",
  //     description: "Unique and expressive design",
  //   },
  //   {
  //     value: "elegant",
  //     label: "Elegant & Luxurious",
  //     description: "Sophisticated and premium feel",
  //   },
  // ]

  return (
    <QuestionCard
      icon={Palette}
      title={title}
      description={description}
      isActive={true}
      onClick={() => {}}
    >
      <div className="space-y-3">
        {designStyles.map(style => (
          <OptionButton
            key={style.value}
            selected={formData.designStyle === style.value}
            onClick={() =>
              setFormData(prev => ({ ...prev, designStyle: style.value }))
            }
            description={style.description}
          >
            {style.label}
          </OptionButton>
        ))}
      </div>
    </QuestionCard>
  )
}

export default DesignStyleStep
