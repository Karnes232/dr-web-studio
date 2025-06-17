import { useLocale } from "@/i18n/useLocale"
import { CheckCircle } from "lucide-react"
import React from "react"

interface Benefit {
  en: string
  es: string
}

const ServiceBenefits = ({ benefits }: { benefits: Benefit[] }) => {
  const { currentLocale, t } = useLocale()
  return (
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
        {t("serviceCard.keyBenefits")}
      </h4>
      <ul className="space-y-2">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="h-4 w-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-sm text-slate-600">
              {benefit[currentLocale as keyof Benefit]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ServiceBenefits
