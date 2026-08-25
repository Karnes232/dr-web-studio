import LanguageSwitcher from "@/components/LanguageSwitcher"
import { getTranslations } from "next-intl/server"
import React from "react"
import { FiGithub, FiLinkedin, FiMail, FiMapPin, FiStar } from "react-icons/fi"
import { FaWhatsapp } from "react-icons/fa"
import { waHref } from "@/lib/contact"
import type { Locale } from "@/lib/slugs"

interface SocialMediaProps {
  socialLinks: {
    linkedin: string
    github: string
    googleBusiness?: string
    trustpilot?: string
  }
  email: string
  phone?: string
  lang: Locale
}

// Server component; LanguageSwitcher remains the only client island.
const SocialMedia = async ({
  socialLinks,
  email,
  phone,
  lang,
}: SocialMediaProps) => {
  const t = await getTranslations({ locale: lang })
  const socialLinksArray = [
    { icon: FiMail, href: `mailto:${email}`, label: "Email" },
    ...(phone
      ? [
          {
            icon: FaWhatsapp,
            href: waHref(phone, t("landingPage.whatsappMessage")),
            label: "WhatsApp",
          },
        ]
      : []),
    { icon: FiLinkedin, href: socialLinks.linkedin, label: "LinkedIn" },
    { icon: FiGithub, href: socialLinks.github, label: "GitHub" },
    // Visible counterparts to the schema sameAs profiles: local-SEO signals
    // shouldn't exist only in invisible JSON-LD.
    ...(socialLinks.googleBusiness
      ? [
          {
            icon: FiMapPin,
            href: socialLinks.googleBusiness,
            label: "Google Maps",
          },
        ]
      : []),
    ...(socialLinks.trustpilot
      ? [{ icon: FiStar, href: socialLinks.trustpilot, label: "Trustpilot" }]
      : []),
  ]

  return (
    <div className="mt-8 mb-4">
      <h3 className="text-lg font-semibold text-white mb-4">
        {t("footer.followUs")}
      </h3>
      {/* Wraps, and uses gap rather than space-x: `space-x-*` only sets
          margin-inline-end, which leaves no vertical spacing once the row wraps
          onto a second line. Six 44px icons + the 78px switcher + gaps need
          ~438px, so this row was forcing a 454px min document width and an
          x-scroll on every phone. */}
      <div className="flex flex-wrap gap-4">
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
        <LanguageSwitcher color="gray-300" />
      </div>
    </div>
  )
}

export default SocialMedia
