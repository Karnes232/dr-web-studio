"use client"
import { useLocale } from "@/i18n/useLocale"
import React from "react"
import { ExternalLink } from "lucide-react"

const ResourcesLinks = () => {
  const { t, getLocalizedPath } = useLocale()
  const resources = [
    {
      href: getLocalizedPath("/project-planner"),
      label: t("resources.website_questionnaire"),
    },
    {
      href: getLocalizedPath("/contact"),
      label: t("resources.get_free_quote"),
    },
    { href: "#case-studies", label: t("resources.case_studies") },
    { href: "#testimonials", label: t("resources.client_reviews") },
    { href: "#faq", label: t("resources.faq") },
    { href: "#privacy", label: t("resources.privacy_policy") },
  ]
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
      <ul className="space-y-2">
        {resources.map((resource, index) => (
          <li key={index}>
            <a
              href={resource.href}
              className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center"
            >
              {resource.label}
              {(resource.href === "#questionnaire" ||
                resource.href === "#quote") && (
                <ExternalLink className="h-3 w-3 ml-1" />
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ResourcesLinks
