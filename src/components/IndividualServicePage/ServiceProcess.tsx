import { useLocale } from "@/i18n/useLocale"
import React from "react"

const ServiceProcess = ({ steps }: { steps: any }) => {
  const { t } = useLocale()
  return (
    <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {t("individualService.howItWorks")}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t("individualService.ourProvenProcess")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step: any, index: any) => (
            <div key={index} className="relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-orange-500 to-teal-500 transform -translate-x-4"></div>
              )}

              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-orange-500 transition-all duration-200">
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-orange-500 to-teal-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold ml-4">{step.title}</h3>
                </div>
                <p className="text-gray-300 leading-relaxed md:h-24 lg:h-40">
                  {step.description}
                </p>
                <div className="mt-4 text-sm text-orange-400">
                  Duration: {step.duration}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServiceProcess
