"use client"
import React, { useState } from "react"

const faqs = [
  {
    question: "How quickly can you respond to my inquiry?",
    answer:
      "We typically respond to WhatsApp messages within 1 hour during business hours, and emails within 24 hours. For urgent matters, WhatsApp is your best bet!",
  },
  {
    question: "Do you offer free consultations?",
    answer:
      "Yes! We offer a free 30-minute consultation to discuss your project, understand your needs, and provide initial recommendations.",
  },
  {
    question: "What information should I include in my message?",
    answer:
      "Tell us about your business, the type of website you need, your timeline, budget range, and any specific features or requirements you have in mind.",
  },
  {
    question: "Do you work with clients outside the Dominican Republic?",
    answer:
      "Absolutely! While we're based in the DR, we work with clients throughout the Caribbean, Latin America, and internationally.",
  },
  {
    question: "What's the typical project timeline?",
    answer:
      "Simple websites take 1-2 weeks, business websites 2-4 weeks, and complex e-commerce sites 4-8 weeks. Timeline depends on project scope and content readiness.",
  },
]

const ContactFAQ = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-2xl font-bold text-slate-800 mb-6">
        Frequently Asked Questions
      </h3>

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
