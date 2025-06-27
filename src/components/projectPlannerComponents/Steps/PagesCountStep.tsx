import { FileText } from "lucide-react"
import React from "react"
import QuestionCard from "../QuestionCard"
import RangeSlider from "../RangeSlider"
import { FormData } from "@/types/form"
import { useLocale } from "@/i18n/useLocale"

const PagesCountStep = ({
  formData,
  setFormData,
  title,
  description,
  rangeConfig,
  tip,
}: {
  formData: FormData
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void
  title: string
  description: string
  rangeConfig: {
    min: number
    max: number
    step: number
    default: number
  }
  tip: string
}) => {
  const { t } = useLocale()
  return (
    <QuestionCard
      icon={FileText}
      title={title}
      description={description}
      isActive={true}
      onClick={() => {}}
    >
      <div className="space-y-6">
        <RangeSlider
          label={t("projectPlanner.pagesCount")}
          value={formData.pages || rangeConfig.default}
          onChange={value => setFormData(prev => ({ ...prev, pages: value }))}
          min={rangeConfig.min}
          max={rangeConfig.max}
          step={rangeConfig.step}
          formatValue={value =>
            `${value} ${t("projectPlanner.page")}${value !== 1 ? "s" : ""}`
          }
        />
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <strong>{t("projectPlanner.tip")}:</strong> {tip}
        </div>
      </div>
    </QuestionCard>
  )
}

export default PagesCountStep
