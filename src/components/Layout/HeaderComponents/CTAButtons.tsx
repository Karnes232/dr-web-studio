import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import React from "react"
import { FaWhatsapp } from "react-icons/fa"
import TrackedLink from "@/components/Analytics/TrackedLink"
import { waHref } from "@/lib/contact"
import type { Locale } from "@/lib/slugs"

// Server component: the outbound WhatsApp link delegates to TrackedLink (a
// client component) so the click can be reported — it leaves the site, so it is
// otherwise invisible to analytics.
const CTAButtons = async ({
  className = "",
  phone,
  lang,
}: {
  className?: string
  phone?: string
  lang: Locale
}) => {
  const t = await getTranslations({ locale: lang })
  return (
    <div className={`flex items-center space-x-4 lg:ml-2 xl:ml-0 ${className}`}>
      <Link
        href="/project-planner"
        className="bg-gradient-to-r from-orange-500 to-yellow-500 text-slate-950 px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
      >
        {t("resources.start_project")}
      </Link>

      <Link
        href="/contact"
        className="bg-teal-700 lg:hidden xl:block text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
      >
        {t("resources.get_quote")}
      </Link>

      {phone && (
        <TrackedLink
          event="contact_whatsapp"
          eventParams={{ location: "header", lang }}
          href={waHref(phone, t("landingPage.whatsappMessage"))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("landingPage.whatsapp")}
          title={t("landingPage.whatsapp")}
          className="p-2 rounded-lg lg:hidden xl:block text-green-600 dark:text-green-500 hover:bg-green-50 dark:hover:bg-slate-800 transition-all duration-200 transform hover:scale-110"
        >
          <FaWhatsapp className="h-6 w-6" />
        </TrackedLink>
      )}
    </div>
  )
}

export default CTAButtons
