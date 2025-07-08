"use client"
import React, { useMemo, useState } from "react"
import { HelpCircle, Code, DollarSign, Shield } from "lucide-react"
import FaqsHeader from "./FaqsHeader"
import SearchBar from "./SearchBar"
import QuickStats from "./QuickStats"
import FaqsCategories from "./FaqsCategories"
import { FaqsData } from "@/sanity/queries/faqs/faqs"

const iconMap = {
  HelpCircle,
  Code,
  DollarSign,
  Shield,
} as const

const FaqsContent = ({ lang, faqData }: { lang: string, faqData: FaqsData }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null)

  const faqDataSample = [
    {
      id: "general",
      title: "General",
      icon: HelpCircle,
      color: "bg-blue-500",
      questions: [
        {
          id: "services",
          question: "What services do you offer?",
          answer:
            "We offer custom websites, web applications, e-commerce solutions, CMS development, API integrations, landing pages, SEO optimization, and ongoing maintenance & support.",
        },
        {
          id: "location",
          question: "Where are you located?",
          answer:
            "DR Web Studio is based in the Dominican Republic, but we serve clients internationally. We work with businesses locally and around the world.",
        },
        {
          id: "industries",
          question: "What industries do you work with?",
          answer:
            "We work with startups, small businesses, creatives, agencies, nonprofits, restaurants, real estate, healthcare, education, and many other industries.",
        },
        {
          id: "languages",
          question: "Do you work in Spanish and English?",
          answer:
            "Yes! We are fully bilingual and can work with clients in both Spanish and English, providing websites in either language.",
        },
        {
          id: "experience",
          question: "How much experience do you have?",
          answer:
            "We have extensive experience in web development using modern technologies like Next.js, React, and Tailwind CSS, with a focus on performance and user experience.",
        },
      ],
    },
    {
      id: "development",
      title: "Website Development",
      icon: Code,
      color: "bg-green-500",
      questions: [
        {
          id: "timeline",
          question: "How long does it take to build a website?",
          answer:
            "It depends on the project scope. Simple websites take 1-2 weeks, business websites 2-3 weeks, and complex e-commerce sites 3-4 weeks. We provide detailed timelines during consultation.",
        },
        {
          id: "cms",
          question: "Can I update my website myself?",
          answer:
            "Yes! Most websites are built with a user-friendly CMS (Content Management System) like Sanity or Contentful, so you can easily update content, images, and blog posts.",
        },
        {
          id: "technologies",
          question: "What technologies do you use?",
          answer:
            "We use Next.js, Gatsby, React, Tailwind CSS, Sanity, Contentful, Firebase, Vercel, Netlify, and other modern web technologies for optimal performance and scalability.",
        },
        {
          id: "mobile",
          question: "Will my website work on mobile devices?",
          answer:
            "Absolutely! All our websites are built mobile-first and fully responsive, ensuring they look great and function perfectly on all devices and screen sizes.",
        },
        {
          id: "seo",
          question: "Do you include SEO in your websites?",
          answer:
            "Yes, we build all websites with SEO best practices including proper meta tags, structured data, fast loading speeds, and mobile optimization.",
        },
        {
          id: "content",
          question: "Do you help with content creation?",
          answer:
            "We can provide guidance on content structure and best practices. For professional copywriting and content creation, we can recommend trusted partners.",
        },
      ],
    },
    {
      id: "pricing",
      title: "Pricing & Payments",
      icon: DollarSign,
      color: "bg-orange-500",
      questions: [
        {
          id: "cost",
          question: "How much do websites cost?",
          answer:
            "Our projects start at $400 for simple websites. Business websites typically range from $600-$1200, and e-commerce sites start at $900. We provide custom quotes based on your specific needs.",
        },
        {
          id: "deposit",
          question: "Do you require a deposit?",
          answer:
            "Yes, we typically request a 50% deposit before starting the project, with the remaining balance due upon completion and approval.",
        },
        {
          id: "payment-methods",
          question: "What payment methods do you accept?",
          answer:
            "We accept electronic payments and transfers via PayPal, bank transfers, and local Dominican Republic payment methods for convenience.",
        },
        {
          id: "pricing-factors",
          question: "What factors affect the price?",
          answer:
            "Pricing depends on the number of pages, complexity of features, custom design requirements, e-commerce functionality, integrations, and timeline requirements.",
        },
        {
          id: "payment-schedule",
          question: "How is payment structured?",
          answer:
            "For larger projects, we can arrange milestone-based payments. Typically: 50% deposit, 25% at midpoint, and 25% upon completion.",
        },
      ],
    },
    {
      id: "support",
      title: "Support & Maintenance",
      icon: Shield,
      color: "bg-purple-500",
      questions: [
        {
          id: "ongoing-support",
          question: "Do you offer ongoing support?",
          answer:
            "Yes! We offer monthly maintenance plans and on-demand updates to keep your website secure, updated, and performing optimally.",
        },
        {
          id: "hosting",
          question: "Will you host my website?",
          answer:
            "We help set up hosting on platforms like Vercel, Netlify, or other reliable hosting providers. We can also manage hosting as part of our maintenance plans.",
        },
        {
          id: "security",
          question: "Do you offer backups and security?",
          answer:
            "Yes, our managed plans include regular backups, SSL certificates, security monitoring, and updates to keep your website safe and secure.",
        },
        {
          id: "updates",
          question: "How do you handle website updates?",
          answer:
            "We provide training for basic updates, and our maintenance plans cover technical updates, security patches, and feature enhancements as needed.",
        },
        {
          id: "response-time",
          question: "What is your support response time?",
          answer:
            "For maintenance plan clients, we respond within 24 hours for non-urgent issues and within 2-4 hours for urgent matters during business hours.",
        },
      ],
    },
  ]

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FaqsHeader />
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
