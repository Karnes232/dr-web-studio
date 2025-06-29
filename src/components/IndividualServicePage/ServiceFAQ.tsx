import { useLocale } from "@/i18n/useLocale"
import { ChevronDown, ChevronUp } from "lucide-react"
import React, { useState } from "react"

const ServiceFAQ = ({ faqs }: { faqs: any }) => {
  const [openIndex, setOpenIndex] = useState(null)
  const { t } = useLocale()
  const toggleFAQ = (index: any) => {
    setOpenIndex(openIndex === index ? null : index)
  }
  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            {t("individualService.frequentlyAskedQuestions")}
          </h2>
          <p className="text-xl text-gray-600">
            {t("individualService.gotQuestions")}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq: any, index: any) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-slate-800">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServiceFAQ
