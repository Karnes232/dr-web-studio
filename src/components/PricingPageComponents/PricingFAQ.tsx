"use client"
import React, { useState } from "react"

const PricingFAQ = ({
  title,
  subtitle,
  faqs,
  lang,
}: {
  title: string
  subtitle: string
  faqs: any
  lang: string
}) => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600">{subtitle}</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900">
                {faq.question[lang]}
              </span>
              <span className="ml-6 flex-shrink-0">
                {openFAQ === index ? "−" : "+"}
              </span>
            </button>
            {openFAQ === index && (
              <div className="px-6 pb-4">
                <p className="text-gray-600">{faq.answer[lang]}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PricingFAQ
