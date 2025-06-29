import { useLocale } from "@/i18n/useLocale"
import { Check, Star } from "lucide-react"
import React from "react"

const ServiceFeatures = ({
  title,
  description,
  standardFeatures,
  optionalFeatures,
}: {
  title: string
  description: string
  standardFeatures: any
  optionalFeatures: any
}) => {
  const { t } = useLocale()
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">{title}</h2>
          <p className="text-xl text-gray-600">{description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Standard Features */}
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <div className="bg-green-500 p-2 rounded-lg mr-4">
                <Check className="w-6 h-6 text-white" />
              </div>
              {t("individualService.standardFeatures")}
            </h3>
            <div className="space-y-4">
              {standardFeatures.map((feature: any, index: any) => (
                <div key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      {feature.name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Add-ons */}
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <div className="bg-orange-500 p-2 rounded-lg mr-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              {t("individualService.optionalAddons")}
            </h3>
            <div className="space-y-4">
              {optionalFeatures.map((feature: any, index: any) => (
                <div key={index} className="flex items-start justify-between">
                  <div className="flex items-start">
                    <Star className="w-5 h-5 text-orange-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-800">
                        {feature.name}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-orange-600 font-semibold text-sm ml-4">
                    +${feature.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServiceFeatures
