import { useLocale } from "@/i18n/useLocale";
import React from "react"
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

interface SocialMediaProps {
  socialLinks: {
    linkedin: string
    github: string
  }
  email: string
}
const SocialMedia = ({ socialLinks, email }: SocialMediaProps) => {
  const { t } = useLocale()
  const socialLinksArray = [
    { icon: FiMail, href: `mailto:${email}`, label: "Email" },
    { icon: FiLinkedin, href: socialLinks.linkedin, label: "LinkedIn" },
    { icon: FiGithub, href: socialLinks.github, label: "GitHub" },
  ]

  return (
    <div className="mt-8 mb-4">
      <h3 className="text-lg font-semibold text-white mb-4">{t("footer.followUs")}</h3>
      <div className="flex space-x-4">
        {socialLinksArray.map((social, index) => {
          const Icon = social.icon
          return (
            <a
              key={index}
              href={social.href}
              className="bg-slate-700 p-3 rounded-full text-gray-300 hover:bg-orange-500 hover:text-white transition-all duration-200 transform hover:scale-110"
              aria-label={social.label}
              target="_blank"
            >
              <Icon className="h-5 w-5" />
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default SocialMedia
