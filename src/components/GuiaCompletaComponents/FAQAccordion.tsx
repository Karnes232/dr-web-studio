"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, HelpCircle, MessageCircle, Mail } from "lucide-react"

interface FAQ {
  question: string
  answer: string
}

interface FAQAccordionProps {
  data: FAQ[]
  language?: "en" | "es"
}

export function FAQAccordion({ data, language = "es" }: FAQAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const labels = {
    es: {
      title: "Preguntas Frecuentes",
      subtitle:
        "Todo lo que necesitas saber sobre nuestros servicios de desarrollo web",
      stillHaveQuestions: "¿Aún tienes preguntas?",
      contactUs: "Contáctanos",
      contactMessage:
        "Estamos aquí para ayudarte. Escríbenos y te responderemos en menos de 24 horas.",
    },
    en: {
      title: "Frequently Asked Questions",
      subtitle:
        "Everything you need to know about our web development services",
      stillHaveQuestions: "Still have questions?",
      contactUs: "Contact Us",
      contactMessage:
        "We're here to help. Write to us and we'll respond within 24 hours.",
    },
  }

  const t = labels[language]

  const toggleItem = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6"
          >
            <HelpCircle className="w-4 h-4" />
            FAQ
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
          >
            {t.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto"
          >
            {t.subtitle}
          </motion.p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="space-y-4">
            {data.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                index={index}
                isActive={activeIndex === index}
                onToggle={() => toggleItem(index)}
              />
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-3xl border-2 border-indigo-200 dark:border-indigo-800 p-8 md:p-12 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-indigo-600 dark:text-indigo-400" />

            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              {t.stillHaveQuestions}
            </h3>

            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {t.contactMessage}
            </p>

            <a
              href="mailto:james@dr-webstudio.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:shadow-2xl hover:shadow-indigo-500/30 transition-all transform hover:scale-105"
            >
              <Mail className="w-5 h-5" />
              {t.contactUs}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// FAQ Item Component
function FAQItem({
  faq,
  index,
  isActive,
  onToggle,
}: {
  faq: FAQ
  index: number
  isActive: boolean
  onToggle: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <div
        className={`bg-white dark:bg-slate-900 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
          isActive
            ? "border-indigo-500 shadow-2xl shadow-indigo-500/10"
            : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700"
        }`}
      >
        {/* Question */}
        <button
          onClick={onToggle}
          className="w-full px-6 py-5 md:px-8 md:py-6 flex items-center justify-between gap-4 text-left transition-colors"
        >
          <span className="text-lg md:text-xl font-bold text-slate-900 dark:text-white flex-1">
            {faq.question}
          </span>

          <motion.div
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0"
          >
            <ChevronDown
              className={`w-6 h-6 transition-colors ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-400 group-hover:text-indigo-500"
              }`}
            />
          </motion.div>
        </button>

        {/* Answer */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 md:px-8 md:pb-8 border-t border-slate-100 dark:border-slate-800">
                <motion.p
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-slate-600 dark:text-slate-400 leading-relaxed pt-6"
                >
                  {faq.answer}
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default FAQAccordion
