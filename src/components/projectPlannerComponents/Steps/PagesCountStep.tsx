import { FileText } from "lucide-react"
import React from "react"
import QuestionCard from "../QuestionCard"
import RangeSlider from "../RangeSlider"
import { FormData } from "@/types/form"

const PagesCountStep = ({
  formData,
  setFormData,
}: {
  formData: FormData
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void
}) => {
  return (
    <QuestionCard
      icon={FileText}
      title="How many pages will your website need?"
      description="Include all main pages like Home, About, Services, Contact, etc."
      isActive={true}
      onClick={() => {}}
    >
      <div className="space-y-6">
        <RangeSlider
          label="Number of Pages"
          value={formData.pages || 0}
          onChange={value => setFormData(prev => ({ ...prev, pages: value }))}
          min={1}
          max={20}
          step={1}
          formatValue={value => `${value} page${value !== 1 ? "s" : ""}`}
        />
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <strong>Tip:</strong> Most business websites have 5-8 pages.
          E-commerce sites typically need more pages for product categories and
          individual products.
        </div>
      </div>
    </QuestionCard>
  )
}

export default PagesCountStep
