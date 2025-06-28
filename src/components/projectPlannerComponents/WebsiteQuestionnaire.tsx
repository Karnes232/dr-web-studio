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
import ProgressBar from "./ProgressBar"
import NavigationButtons from "./NavigationButtons"
//import QuestionnaireEnhancements from "./Steps/QuestionnaireEnhancements"
import StepNavigation from "./StepNavigation"
import { WebsiteType } from "@/sanity/queries/project-planner/websiteType"
import { useLocale } from "@/i18n/useLocale"
import { ProjectPlannerHeader } from "@/sanity/queries/project-planner/projectPlannerHeader"
import { PagesCount } from "@/sanity/queries/project-planner/pagesCount"
import { DesignStyle } from "@/sanity/queries/project-planner/designStyle"
import { Features } from "@/sanity/queries/project-planner/features"
import { Budget } from "@/sanity/queries/project-planner/budget"
import { Timeline } from "@/sanity/queries/project-planner/timeline"
import { ContentStatus } from "@/sanity/queries/project-planner/contentStatus"
import { Languages } from "@/sanity/queries/project-planner/languages"
import { ContactFormType } from "@/sanity/queries/project-planner/contactForm"

const WebsiteQuestionnaire = ({
  projectPlannerHeader,
  websiteType,
  pagesCount,
  designStyle,
  features,
  budget,
  timeline,
  contentStatus,
  languages,
  contactForm,
  companyEmail,
}: {
  projectPlannerHeader: ProjectPlannerHeader
  websiteType: WebsiteType
  pagesCount: PagesCount
  designStyle: DesignStyle
  features: Features
  budget: Budget
  timeline: Timeline
  contentStatus: ContentStatus
  languages: Languages
  contactForm: ContactFormType
  companyEmail: string
}) => {
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
  const { currentLocale, t } = useLocale()
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
        return (
          <WebsiteTypeStep
            formData={formData}
            setFormData={setFormData}
            title={
              websiteType.title[currentLocale as keyof typeof websiteType.title]
            }
            description={
              websiteType.description[
                currentLocale as keyof typeof websiteType.description
              ]
            }
            websiteTypes={websiteType.websiteTypes.map(type => ({
              value: type.value[currentLocale as keyof typeof type.value],
              label: type.label[currentLocale as keyof typeof type.label],
              description:
                type.description[
                  currentLocale as keyof typeof type.description
                ],
            }))}
          />
        )
      case 2:
        return (
          <PagesCountStep
            formData={formData}
            setFormData={setFormData}
            title={
              pagesCount.title[currentLocale as keyof typeof pagesCount.title]
            }
            description={
              pagesCount.description[
                currentLocale as keyof typeof pagesCount.description
              ]
            }
            rangeConfig={pagesCount.rangeConfig}
            tip={pagesCount.tip[currentLocale as keyof typeof pagesCount.tip]}
          />
        )
      case 3:
        return (
          <DesignStyleStep
            formData={formData}
            setFormData={setFormData}
            title={
              designStyle.title[currentLocale as keyof typeof designStyle.title]
            }
            description={
              designStyle.description[
                currentLocale as keyof typeof designStyle.description
              ]
            }
            designStyles={designStyle.designStyles.map(style => ({
              value: style.value[currentLocale as keyof typeof style.value],
              label: style.label[currentLocale as keyof typeof style.label],
              description:
                style.description[
                  currentLocale as keyof typeof style.description
                ],
            }))}
          />
        )
      case 4:
        return (
          <FeaturesStep
            formData={formData}
            setFormData={setFormData}
            title={features.title[currentLocale as keyof typeof features.title]}
            description={
              features.description[currentLocale as keyof typeof features.title]
            }
            selectedFeaturesText={
              features.selectedFeaturesText[
                currentLocale as keyof typeof features.selectedFeaturesText
              ]
            }
            features={features.features.map(feature => ({
              value: feature.value[currentLocale as keyof typeof feature.value],
              label: feature.label[currentLocale as keyof typeof feature.label],
              description:
                feature.description[
                  currentLocale as keyof typeof feature.description
                ],
            }))}
          />
        )
      case 5:
        return (
          <BudgetStep
            formData={formData}
            setFormData={setFormData}
            title={budget.title[currentLocale as keyof typeof budget.title]}
            description={
              budget.description[
                currentLocale as keyof typeof budget.description
              ]
            }
            budgetOptions={budget.budgetOptions.map(option => ({
              value: option.value,
              label: option.label[currentLocale as keyof typeof option.label],
              description:
                option.description[
                  currentLocale as keyof typeof option.description
                ],
            }))}
          />
        )
      case 6:
        return (
          <TimelineStep
            formData={formData}
            setFormData={setFormData}
            title={timeline.title[currentLocale as keyof typeof timeline.title]}
            description={
              timeline.description[
                currentLocale as keyof typeof timeline.description
              ]
            }
            timelineOptions={timeline.timelineOptions.map(option => ({
              value: option.value[currentLocale as keyof typeof option.value],
              label: option.label[currentLocale as keyof typeof option.label],
              description:
                option.description[
                  currentLocale as keyof typeof option.description
                ],
            }))}
          />
        )
      case 7:
        return (
          <ContentStatusStep
            formData={formData}
            setFormData={setFormData}
            title={
              contentStatus.title[
                currentLocale as keyof typeof contentStatus.title
              ]
            }
            description={
              contentStatus.description[
                currentLocale as keyof typeof contentStatus.description
              ]
            }
            contentOptions={contentStatus.contentOptions.map(option => ({
              value: option.value[currentLocale as keyof typeof option.value],
              label: option.label[currentLocale as keyof typeof option.label],
              description:
                option.description[
                  currentLocale as keyof typeof option.description
                ],
            }))}
          />
        )
      case 8:
        return (
          <LanguagesStep
            formData={formData}
            setFormData={setFormData}
            title={
              languages.title[currentLocale as keyof typeof languages.title]
            }
            description={
              languages.description[
                currentLocale as keyof typeof languages.description
              ]
            }
            languageOptions={languages.languageOptions.map(option => ({
              value: option.value[currentLocale as keyof typeof option.value],
              label: option.label[currentLocale as keyof typeof option.label],
            }))}
            selectedLanguagesText={
              languages.selectedLanguagesText[
                currentLocale as keyof typeof languages.selectedLanguagesText
              ]
            }
          />
        )
      // case 9:
      //   return <QuestionnaireEnhancements formData={formData} setFormData={setFormData} />
      case 9:
        return (
          <div className="space-y-6">
            <ContactForm
              formData={formData}
              setFormData={setFormData}
              title={
                contactForm.title[
                  currentLocale as keyof typeof contactForm.title
                ]
              }
              description={
                contactForm.description[
                  currentLocale as keyof typeof contactForm.description
                ]
              }
              fullNameLabel={
                contactForm.formFields.fullName.label[
                  currentLocale as keyof typeof contactForm.formFields.fullName.label
                ]
              }
              fullNamePlaceholder={
                contactForm.formFields.fullName.placeholder[
                  currentLocale as keyof typeof contactForm.formFields.fullName.placeholder
                ]
              }
              emailLabel={
                contactForm.formFields.email.label[
                  currentLocale as keyof typeof contactForm.formFields.email.label
                ]
              }
              emailPlaceholder={
                contactForm.formFields.email.placeholder[
                  currentLocale as keyof typeof contactForm.formFields.email.placeholder
                ]
              }
              phoneLabel={
                contactForm.formFields.phone.label[
                  currentLocale as keyof typeof contactForm.formFields.phone.label
                ]
              }
              phonePlaceholder={
                contactForm.formFields.phone.placeholder[
                  currentLocale as keyof typeof contactForm.formFields.phone.placeholder
                ]
              }
              companyLabel={
                contactForm.formFields.company.label[
                  currentLocale as keyof typeof contactForm.formFields.company.label
                ]
              }
              companyPlaceholder={
                contactForm.formFields.company.placeholder[
                  currentLocale as keyof typeof contactForm.formFields.company.placeholder
                ]
              }
              messageLabel={
                contactForm.formFields.message.label[
                  currentLocale as keyof typeof contactForm.formFields.message.label
                ]
              }
              messagePlaceholder={
                contactForm.formFields.message.placeholder[
                  currentLocale as keyof typeof contactForm.formFields.message.placeholder
                ]
              }
            />
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
          {
            projectPlannerHeader.title[
              currentLocale as keyof typeof projectPlannerHeader.title
            ]
          }
        </h1>
        <p className="text-gray-600">
          {
            projectPlannerHeader.description[
              currentLocale as keyof typeof projectPlannerHeader.description
            ]
          }
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
          {t("projectPlanner.needHelp")}{" "}
          <a
            href={`mailto:${companyEmail}`}
            className="text-orange-500 hover:text-orange-600"
          >
            {companyEmail}
          </a>{" "}
        </p>
      </div>
    </div>
  )
}

export default WebsiteQuestionnaire
