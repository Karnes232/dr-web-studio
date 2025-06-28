import { FormData } from "@/types/form"
import React from "react"
import QuestionCard from "../QuestionCard"
import { Mail } from "lucide-react"

const ContactForm = ({
  formData,
  setFormData,
  title,
  description,
  fullNameLabel,
  fullNamePlaceholder,
  emailLabel,
  emailPlaceholder,
  phoneLabel,
  phonePlaceholder,
  companyLabel,
  companyPlaceholder,
  messageLabel,
  messagePlaceholder,
}: {
  formData: FormData
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void
  title: string
  description: string
  fullNameLabel: string
  fullNamePlaceholder: string
  emailLabel: string
  emailPlaceholder: string
  phoneLabel: string
  phonePlaceholder: string
  companyLabel: string
  companyPlaceholder: string
  messageLabel: string
  messagePlaceholder: string
}) => {
  const handleContactChange = (field: any, value: any) => {
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value,
      },
    }))
  }
  return (
    <QuestionCard
      icon={Mail}
      title={title}
      description={description}
      isActive={true}
      onClick={() => {}}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {fullNameLabel}
            </label>
            <input
              type="text"
              value={formData.contact.name}
              onChange={e => handleContactChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder={fullNamePlaceholder}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {emailLabel}
            </label>
            <input
              type="email"
              value={formData.contact.email}
              onChange={e => handleContactChange("email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder={emailPlaceholder}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {phoneLabel}
            </label>
            <input
              type="tel"
              value={formData.contact.phone}
              onChange={e => handleContactChange("phone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder={phonePlaceholder}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {companyLabel}
            </label>
            <input
              type="text"
              value={formData.contact.company}
              onChange={e => handleContactChange("company", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder={companyPlaceholder}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {messageLabel}
          </label>
          <textarea
            value={formData.contact.message}
            onChange={e => handleContactChange("message", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder={messagePlaceholder}
          />
        </div>
      </div>
    </QuestionCard>
  )
}

export default ContactForm
