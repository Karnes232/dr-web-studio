import { FormData } from "@/types/form"
import React from "react"
import QuestionCard from "../QuestionCard"
import { Languages } from "lucide-react"
import CheckboxOption from "../CheckboxOption"

const LanguagesStep = ({
  formData,
  setFormData,
  title,
  description,
  languageOptions,
  selectedLanguagesText,
}: {
  formData: FormData
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void
  title: string
  description: string
  languageOptions: {
    value: string
    label: string
  }[]
  selectedLanguagesText: string
}) => {
  const handleLanguageToggle = (language: any) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language],
    }))
  }
  return (
    <QuestionCard
      icon={Languages}
      title={title}
      description={description}
      isActive={true}
      onClick={() => {}}
    >
      <div className="space-y-2">
        {languageOptions.map(language => (
          <CheckboxOption
            key={language.value}
            checked={formData.languages.includes(language.value)}
            onChange={() => handleLanguageToggle(language.value)}
            // description={`Support for ${language.label}`}
          >
            {language.label}
          </CheckboxOption>
        ))}
      </div>
      {formData.languages.length > 0 && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <div className="text-sm text-green-800">
            <strong>{selectedLanguagesText}:</strong>{" "}
            {formData.languages.length}
          </div>
        </div>
      )}
    </QuestionCard>
  )
}

export default LanguagesStep
