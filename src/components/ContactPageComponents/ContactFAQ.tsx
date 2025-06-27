"use client"
import React, { useState } from "react"

const ContactFAQ = ({
  title,
  faqs,
}: {
  title: string
  faqs: { question: string; answer: string }[]
}) => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-2xl font-bold text-slate-800 mb-6">{title}</h3>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-slate-200 rounded-lg">
            <button
              onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium text-slate-800">{faq.question}</span>
              <div
                className={`transform transition-transform ${openFAQ === index ? "rotate-180" : ""}`}
              >
                <svg
                  className="h-5 w-5 text-slate-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>
            {openFAQ === index && (
              <div className="px-4 pb-3">
                <p className="text-slate-600">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContactFAQ
