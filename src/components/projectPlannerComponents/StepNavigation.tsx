import { FormData } from "@/types/form"
import {
  Calendar,
  Mail,
  Languages,
  DollarSign,
  Building,
  FileText,
  Globe,
  Palette,
  ChevronRight,
  Check,
  Image,
} from "lucide-react"
import React from "react"

const StepNavigation = ({
  currentStep,
  totalSteps,
  onStepClick,
  formData,
}: {
  currentStep: number
  totalSteps: number
  onStepClick: (step: number) => void
  formData: FormData
}) => {
  const stepInfo = [
    { number: 1, title: "Website Type", icon: Globe, key: "websiteType" },
    { number: 2, title: "Pages", icon: FileText, key: "pages" },
    { number: 3, title: "Design Style", icon: Palette, key: "designStyle" },
    { number: 4, title: "Features", icon: Building, key: "features" },
    { number: 5, title: "Budget", icon: DollarSign, key: "budget" },
    { number: 6, title: "Timeline", icon: Calendar, key: "timeline" },
    { number: 7, title: "Content", icon: Image, key: "contentStatus" },
    { number: 8, title: "Languages", icon: Languages, key: "languages" },
    { number: 9, title: "Contact", icon: Mail, key: "contact" },
  ]
  const isStepCompleted = (step: any) => {
    switch (step.key) {
      case "websiteType":
        return formData.websiteType
      case "pages":
        return formData.pages
      case "designStyle":
        return formData.designStyle
      case "features":
        return formData.features.length > 0
      case "budget":
        return formData.budget
      case "timeline":
        return formData.timeline
      case "contentStatus":
        return formData.contentStatus
      case "languages":
        return formData.languages.length > 0
      case "contact":
        return formData.contact.name && formData.contact.email
      default:
        return false
    }
  }

  const canAccessStep = (stepNumber: number) => {
    // Allow access to the next step only if current step is completed
    if (stepNumber === currentStep + 1) {
      const currentStepInfo = stepInfo.find(s => s.number === currentStep)
      return currentStepInfo ? isStepCompleted(currentStepInfo) : false
    }

    // Allow access to any completed step
    const step = stepInfo.find(s => s.number === stepNumber)
    if (step && isStepCompleted(step)) return true

    // Allow access to current and previous steps
    return stepNumber <= currentStep
  }
  return (
    <div className="mb-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap justify-between items-center gap-2">
          {stepInfo.map((step, index) => {
            const Icon = step.icon
            console.log(step)
            const isCompleted = isStepCompleted(step)
            const isCurrent = currentStep === step.number
            const canAccess = canAccessStep(step.number)

            return (
              <React.Fragment key={step.number}>
                <button
                  onClick={() => canAccess && onStepClick(step.number)}
                  disabled={!canAccess}
                  className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 min-w-0 flex-1 max-w-[100px] ${
                    isCurrent
                      ? "bg-orange-500 text-white shadow-lg scale-105"
                      : isCompleted
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : canAccess
                          ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          : "bg-gray-50 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <div className="relative">
                    <Icon className="h-4 w-4" />
                    {isCompleted && !isCurrent && (
                      <Check className="h-3 w-3 absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-center leading-tight">
                    {step.title}
                  </span>
                  <span className="text-xs opacity-75">{step.number}</span>
                </button>

                {index < stepInfo.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0 hidden sm:block" />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Mobile-friendly step indicator */}
      <div className="sm:hidden mt-4 flex justify-center">
        <div className="flex space-x-2">
          {stepInfo.map(step => {
            const isCompleted = isStepCompleted(step)
            const isCurrent = currentStep === step.number

            return (
              <div
                key={step.number}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  isCurrent
                    ? "bg-orange-500 w-4"
                    : isCompleted
                      ? "bg-green-500"
                      : "bg-gray-300"
                }`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default StepNavigation
