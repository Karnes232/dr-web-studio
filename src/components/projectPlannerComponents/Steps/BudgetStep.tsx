import { FormData } from "@/types/form"
import React from "react"
import QuestionCard from "../QuestionCard"
import { DollarSign } from "lucide-react"
import OptionButton from "../OptionButton"

const BudgetStep = ({
  formData,
  setFormData,
  title,
  description,
  budgetOptions,
}: {
  formData: FormData
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void
  title: string
  description: string
  budgetOptions: {
    value: string
    label: string
    description: string
  }[]
}) => {
  return (
    <QuestionCard
      icon={DollarSign}
      title={title}
      description={description}
      isActive={true}
      onClick={() => {}}
    >
      <div className="space-y-3">
        {budgetOptions.map(budget => (
          <OptionButton
            key={budget.value}
            selected={formData.budget === budget.value}
            onClick={() =>
              setFormData(prev => ({ ...prev, budget: budget.value }))
            }
            description={budget.description}
          >
            {budget.label}
          </OptionButton>
        ))}
      </div>
    </QuestionCard>
  )
}

export default BudgetStep
