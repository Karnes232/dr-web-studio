"use client"
import React, { useState } from "react"
import WebsiteTypeStep from "./Steps/WebsiteTypeStep"
import PagesCountStep from "./Steps/PagesCountStep"
import DesignStyleStep from "./Steps/DesignStyleStep"
import FeaturesStep from "./Steps/FeaturesStep"
import BudgetStep from "./Steps/BudgetStep"
import TimelineStep from "./Steps/TimelineStep"
import ContentStatusStep from "./Steps/ContentStatusStep"
import LanguagesStep from "./Steps/LanguagesStep"
import ContactForm from "./Steps/ContactForm"
import ProjectSummary from "./ProjectSummary"
import { FormData } from "@/types/form"
import { ChevronLeft, Save, Send } from "lucide-react"
import { ChevronRight } from "lucide-react"
import ProgressBar from "./ProgressBar"
import NavigationButtons from "./NavigationButtons"
import QuestionnaireEnhancements from "./Steps/QuestionnaireEnhancements"
import StepNavigation from "./StepNavigation"

const WebsiteQuestionnaire = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    websiteType: "",
    pages: 5,
    designStyle: "",
    features: [] as string[],
    budget: "",
    timeline: "",
    contentStatus: "",
    languages: [] as string[],
    contact: {
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalSteps = 9
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      alert(
        "Thank you! Your project details have been submitted. We'll get back to you within 24 hours.",
      )
    }, 2000)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.websiteType
      case 2:
        return formData.pages
      case 3:
        return formData.designStyle
      case 4:
        return formData.features.length > 0
      case 5:
        return formData.budget
      case 6:
        return formData.timeline
      case 7:
        return formData.contentStatus
      case 8:
        return formData.languages.length > 0
      case 9:
        return formData.contact.name && formData.contact.email
      default:
        return true
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WebsiteTypeStep formData={formData} setFormData={setFormData} />
      case 2:
        return <PagesCountStep formData={formData} setFormData={setFormData} />
      case 3:
        return <DesignStyleStep formData={formData} setFormData={setFormData} />
      case 4:
        return <FeaturesStep formData={formData} setFormData={setFormData} />
      case 5:
        return <BudgetStep formData={formData} setFormData={setFormData} />
      case 6:
        return <TimelineStep formData={formData} setFormData={setFormData} />
      case 7:
        return (
          <ContentStatusStep formData={formData} setFormData={setFormData} />
        )
      case 8:
        return <LanguagesStep formData={formData} setFormData={setFormData} />
      // case 9:
      //   return <QuestionnaireEnhancements formData={formData} setFormData={setFormData} />
      case 9:
        return (
          <div className="space-y-6">
            <ContactForm formData={formData} setFormData={setFormData} />
            <ProjectSummary formData={formData} />
          </div>
        )
      default:
        return null
    }
  }
  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Website Project Questionnaire
        </h1>
        <p className="text-gray-600">
          Help us understand your project so we can provide you with the perfect
          solution
        </p>
      </div>
      <StepNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onStepClick={setCurrentStep}
        formData={formData}
      />

      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

      <div className="my-8">{renderStep()}</div>

      <NavigationButtons
        currentStep={currentStep}
        totalSteps={totalSteps}
        canProceed={canProceed() as boolean}
        isSubmitting={isSubmitting}
        onPrev={prevStep}
        onNext={nextStep}
        onSubmit={handleSubmit}
      />

      {/* Help Text */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          Need help? Contact us at{" "}
          <a
            href="mailto:info@drwebstudio.com"
            className="text-orange-500 hover:text-orange-600"
          >
            info@drwebstudio.com
          </a>{" "}
          or{" "}
          <a
            href="https://wa.me/18091234567"
            className="text-orange-500 hover:text-orange-600"
          >
            WhatsApp
          </a>
        </p>
      </div>
    </div>
  )
}

export default WebsiteQuestionnaire
