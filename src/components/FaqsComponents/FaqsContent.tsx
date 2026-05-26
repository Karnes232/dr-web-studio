"use client"
import React, { useMemo, useState } from "react"
import {
  HelpCircle,
  Code,
  DollarSign,
  ShieldCheck,
  Palette,
  ShoppingCart,
  Search,
} from "lucide-react"
import FaqsHeader from "./FaqsHeader"
import SearchBar from "./SearchBar"
import QuickStats from "./QuickStats"
import FaqsCategories from "./FaqsCategories"
import { FaqsData } from "@/sanity/queries/faqs/faqs"
import { FaqsHeaderData } from "@/sanity/queries/faqs/faqsHeader"

const iconMap = {
  HelpCircle,
  Code,
  DollarSign,
  ShieldCheck,
  Palette,
  ShoppingCart,
  Search,
} as const

const FaqsContent = ({
  lang,
  faqData,
  faqsHeaderData,
}: {
  lang: string
  faqData: FaqsData
  faqsHeaderData: FaqsHeaderData
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null)

  const filteredFAQs = useMemo(() => {
    const categories = faqData.categories.map(category => ({
      id: category.id,
      title: category.title[lang as keyof typeof category.title],
      icon: iconMap[category.icon as keyof typeof iconMap] || HelpCircle,
      color: category.color,
      questions: category.questions.map(q => ({
        id: q.id,
        question: q.question[lang as keyof typeof q.question],
        answer: q.answer[lang as keyof typeof q.answer],
      })),
    }))

    if (!searchTerm) return categories

    return categories
      .map(category => ({
        ...category,
        questions: category.questions.filter(
          q =>
            q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.answer.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      }))
      .filter(category => category.questions.length > 0)
  }, [searchTerm, faqData.categories, lang])

  const toggleAccordion = (categoryId: string) => {
    setActiveAccordion(activeAccordion === categoryId ? null : categoryId)
  }
  return (
    <div className="bg-gradient-to-br from-slate-50 to-orange-50 pt-12 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FaqsHeader
          title={
            faqsHeaderData.title[lang as keyof typeof faqsHeaderData.title]
          }
          description={
            faqsHeaderData.description[
              lang as keyof typeof faqsHeaderData.description
            ]
          }
        />
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {/* <QuickStats /> */}
        <FaqsCategories
          filteredFAQs={filteredFAQs}
          activeAccordion={activeAccordion}
          toggleAccordion={toggleAccordion}
        />
      </div>
    </div>
  )
}

export default FaqsContent
