import { useLocale } from "@/i18n/useLocale"
import React from "react"
import {
  Briefcase,
  Layout,
  Server,
  Database,
  RefreshCcw,
  Workflow,
  ShieldCheck,
  Globe,
  ShoppingCart
} from "lucide-react"

const ServiceCardHeader = ({ service }: { service: any }) => {
  const { currentLocale, t } = useLocale()

  const icons = {
    Briefcase,
    Layout,
    Server,
    Database,
    RefreshCcw,
    Workflow,
    ShieldCheck,
    Globe,
    ShoppingCart
  }
  const Icon = icons[service.iconName as keyof typeof icons]
  return (
    <div className="bg-gradient-to-r from-orange-100 to-yellow-50 p-6 border-b border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-500">{t("serviceCard.startingFrom")}</div>
          <div className="text-2xl font-bold text-slate-800">
            ${service.priceRange}
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-2 truncate">{service.title[currentLocale as keyof typeof service.title]}</h3>
      <p className="text-slate-600">{service.description[currentLocale as keyof typeof service.description]}</p>
    </div>
  )
}

export default ServiceCardHeader
