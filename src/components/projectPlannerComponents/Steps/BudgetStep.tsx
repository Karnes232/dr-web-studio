import { FormData } from "@/types/form"
import React from "react"
import QuestionCard from "../QuestionCard"
import { DollarSign } from "lucide-react"
import OptionButton from "../OptionButton"

const BudgetStep = ({
  formData,
  setFormData,
}: {
  formData: FormData
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void
}) => {
  const budgetOptions = [
    {
      value: "$300-$500",
      label: "$300 - $500",
      description: "Basic website with essential features",
    },
    {
      value: "$500-$1000",
      label: "$500 - $1,000",
      description: "Professional website with custom design",
    },
    {
      value: "$1000-$2500",
      label: "$1,000 - $2,500",
      description: "Advanced website with premium features",
    },
    {
      value: "$2500-$5000",
      label: "$2,500 - $5,000",
      description: "Complex website with custom functionality",
    },
    {
      value: "$5000+",
      label: "$5,000+",
      description: "Enterprise-level website with full customization",
    },
  ]
  return (
    <QuestionCard
      icon={DollarSign}
      title="What's your budget range?"
      description="Select the budget range that fits your project"
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
