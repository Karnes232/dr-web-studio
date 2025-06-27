import { useLocale } from "@/i18n/useLocale"
import React from "react"

const ProgressBar = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number
  totalSteps: number
}) => {
  const { t } = useLocale()
  const progress = (currentStep / totalSteps) * 100
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 mb-10">
      <div
        className="bg-gradient-to-r from-orange-500 to-yellow-500 h-3 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
      <div className="text-center mt-2 text-sm text-gray-600 ">
        {t("projectPlanner.step")} {currentStep} {t("projectPlanner.of")}{" "}
        {totalSteps} ({Math.round(progress)}% {t("projectPlanner.complete")})
      </div>
    </div>
  )
}

export default ProgressBar
