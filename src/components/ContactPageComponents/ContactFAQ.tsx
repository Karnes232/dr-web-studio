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
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8">
      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
        {title}
      </h3>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-slate-200 dark:border-slate-700 rounded-lg"
          >
            <button
              onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="font-medium text-slate-800 dark:text-slate-100">
                {faq.question}
              </span>
              <div
                className={`transform transition-transform ${openFAQ === index ? "rotate-180" : ""}`}
              >
                <svg
                  className="h-5 w-5 text-slate-500 dark:text-slate-400"
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
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                openFAQ === index
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-3">
                  <p className="text-slate-600 dark:text-slate-400">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContactFAQ
