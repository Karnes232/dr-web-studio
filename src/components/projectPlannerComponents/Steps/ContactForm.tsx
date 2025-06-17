import { FormData } from "@/types/form"
import React from "react"
import QuestionCard from "../QuestionCard"
import { Mail } from "lucide-react"

const ContactForm = ({
  formData,
  setFormData,
}: {
  formData: FormData
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void
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
      title="Contact Information"
      description="We'll use this information to send you a custom quote and get in touch"
      isActive={true}
      onClick={() => {}}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.contact.name}
              onChange={e => handleContactChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.contact.email}
              onChange={e => handleContactChange("email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.contact.phone}
              onChange={e => handleContactChange("phone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="+1 (809) 123-4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={formData.contact.company}
              onChange={e => handleContactChange("company", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Your company name"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Details
          </label>
          <textarea
            value={formData.contact.message}
            onChange={e => handleContactChange("message", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Tell us more about your project, specific requirements, or any questions you have..."
          />
        </div>
      </div>
    </QuestionCard>
  )
}

export default ContactForm
