import { useLocale } from "@/i18n/useLocale"
import { Check, X } from "lucide-react"
import React from "react"
import BlockContent from "./BlockContent/BlockContent"

const ServiceOverview = ({
  title,
  mainDescription,
  beforeState,
  afterState,
  service,
}: {
  title: string
  mainDescription: any
  beforeState: string[]
  afterState: string[]
  service: any
}) => {
  const { t } = useLocale()
  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            {t("individualService.whatIs")} {title}?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-teal-500 mx-auto rounded-full"></div>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="text-gray-700 leading-relaxed space-y-6">
            <BlockContent content={mainDescription} />
          </div>
        </div>

        {/* Transformation Box */}
        <div className="mt-12 bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
          <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center">
            The Transformation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-red-600 mb-3">Before:</h4>
              <ul className="space-y-2 text-gray-700">
                {beforeState.map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <X className="text-red-500 w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-600 mb-3">After:</h4>
              <ul className="space-y-2 text-gray-700">
                {afterState.map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <Check className="text-green-500 w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServiceOverview
