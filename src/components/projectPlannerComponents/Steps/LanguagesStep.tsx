import { FormData } from "@/types/form"
import React from "react"
import QuestionCard from "../QuestionCard"
import { Languages } from "lucide-react"
import CheckboxOption from "../CheckboxOption"

const LanguagesStep = ({
  formData,
  setFormData,
}: {
  formData: FormData
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void
}) => {
  const languageOptions = [
    { value: "english", label: "English" },
    { value: "spanish", label: "Spanish (Español)" },
    { value: "french", label: "French (Français)" },
    { value: "portuguese", label: "Portuguese (Português)" },
    { value: "italian", label: "Italian (Italiano)" },
    { value: "german", label: "German (Deutsch)" },
  ]
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
      title="What languages do you need?"
      description="Select all languages your website should support"
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
            <strong>Selected languages:</strong> {formData.languages.length}
          </div>
        </div>
      )}
    </QuestionCard>
  )
}

export default LanguagesStep
