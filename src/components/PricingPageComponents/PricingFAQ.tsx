"use client"
import React, { useState } from "react"

const faqs = [
  {
    question: "What's included in the project price?",
    answer:
      "All packages include design, development, basic SEO setup, mobile responsiveness, and 30 days of support after launch. Content creation and premium integrations may cost extra.",
  },
  {
    question: "How long does it take to complete a website?",
    answer:
      "Starter websites: 1-2 weeks, Business websites: 2-4 weeks, E-commerce: 3-6 weeks. Timeline depends on content readiness and revision rounds.",
  },
  {
    question: "Do you offer payment plans?",
    answer:
      "Yes! We offer 50% upfront and 50% on completion for all packages. Custom projects can have milestone-based payments.",
  },
  {
    question: "What if I need changes after launch?",
    answer:
      "Minor tweaks are included in the 30-day support period. Larger changes and additional features are quoted separately.",
  },
]

const PricingFAQ = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h3>
        <p className="text-gray-600">
          Get answers to common questions about our pricing and services.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900">{faq.question}</span>
              <span className="ml-6 flex-shrink-0">
                {openFAQ === index ? "−" : "+"}
              </span>
            </button>
            {openFAQ === index && (
              <div className="px-6 pb-4">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PricingFAQ
