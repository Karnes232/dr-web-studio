import { useLocale } from "@/i18n/useLocale"
import { ArrowRight } from "lucide-react"
import { Link } from "@/i18n/navigation"
import React from "react"
import type { LocalizedSlugDoc } from "@/lib/slugs"

const ServiceCardActions = ({ service }: { service: LocalizedSlugDoc }) => {
  const { t, getServiceHref } = useLocale()
  return (
    <div className="flex gap-3">
      <Link
        href="/project-planner"
        className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-slate-950 px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center"
      >
        {t("serviceCard.getStarted")}
        <ArrowRight className="h-4 w-4 ml-1" />
      </Link>
      <Link
        href={getServiceHref(service)}
        className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
      >
        {t("serviceCard.learnMore")}
      </Link>
    </div>
  )
}

export default ServiceCardActions
