import { ChevronLeft, ChevronRight, Save, Send } from "lucide-react"
import React from "react"

const NavigationButtons = ({
  currentStep,
  totalSteps,
  canProceed,
  isSubmitting,
  onPrev,
  onNext,
  onSubmit,
}: {
  currentStep: number
  totalSteps: number
  canProceed: boolean
  isSubmitting: boolean
  onPrev: () => void
  onNext: () => void
  onSubmit: () => void
}) => {
  return (
    <div className="flex justify-between items-center">
      <button
        onClick={onPrev}
        disabled={currentStep === 1}
        className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
          currentStep === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        <ChevronLeft className="h-5 w-5 mr-2" />
        Previous
      </button>

      <div className="flex space-x-3">
        <button className="flex items-center px-4 py-3 rounded-lg font-medium bg-teal-100 text-teal-700 hover:bg-teal-200 transition-all duration-200">
          <Save className="h-5 w-5 mr-2" />
          Save Progress
        </button>

        {currentStep === totalSteps ? (
          <button
            onClick={onSubmit}
            disabled={!canProceed || isSubmitting}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              canProceed && !isSubmitting
                ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Submit Project
              </>
            )}
          </button>
        ) : (
          <button
            onClick={onNext}
            disabled={!canProceed}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              canProceed
                ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Next Step
            <ChevronRight className="h-5 w-5 ml-2" />
          </button>
        )}
      </div>
    </div>
  )
}

export default NavigationButtons
