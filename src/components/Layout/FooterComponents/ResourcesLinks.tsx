"use client"
import { useLocale } from "@/i18n/useLocale"
import React from "react"
import { ExternalLink } from "lucide-react"
import { Link } from "@/i18n/navigation"

const ResourcesLinks = () => {
  const { t } = useLocale()
  const resources = [
    {
      href: "/project-planner",
      label: t("resources.website_questionnaire"),
    },
    {
      href: "/contact",
      label: t("resources.get_free_quote"),
    },
    {
      href: "/custom-payment",
      label: t("resources.custom_payment"),
    },
    //  { href: "#testimonials", label: t("resources.client_reviews") },
    { href: "/faqs", label: t("resources.faq") },
    {
      href: "/privacy-policy",
      label: t("resources.privacy_policy"),
    },
  ] as const
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">
        {t("resources.resources")}
      </h3>
      <ul className="space-y-2">
        {resources.map((resource, index) => (
          <li key={index}>
            <Link
              href={resource.href}
              className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center"
            >
              {resource.label}
              {((resource.href as string) === "#questionnaire" ||
                (resource.href as string) === "#quote") && (
                <ExternalLink className="h-3 w-3 ml-1" />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ResourcesLinks
