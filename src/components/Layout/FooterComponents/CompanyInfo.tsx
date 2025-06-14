"use client"

import React from "react"
import { MapPin, Mail, MessageCircle, Calendar } from "lucide-react"
import FooterLogo from "./FooterLogo"
import { useLocale } from "@/i18n/useLocale"

interface CompanyInfoProps {
  logo: {
    footerLogo: {
      asset: {
        url: string
      }
      alt: string
    }
    companyName: string
  }
  companyInfo: {
    email: string
    companyName: string
    footerText: {
      en: string
      es: string
    }
  }
}

const CompanyInfo = ({ logo, companyInfo }: CompanyInfoProps) => {
  const { currentLocale, t } = useLocale()
  return (
    <div className="lg:col-span-2">
      <FooterLogo logo={logo} />
      <p className="text-gray-300 mb-6 max-w-md">
        {
          companyInfo.footerText[
            currentLocale as keyof typeof companyInfo.footerText
          ]
        }
      </p>

      {/* Contact Info */}
      <div className="space-y-3">
        <div className="flex items-center text-gray-300">
          <MapPin className="h-5 w-5 text-orange-400 mr-3" />
          <span>{t("footer.address")}</span>
        </div>
        <div className="flex items-center text-gray-300">
          <Mail className="h-5 w-5 text-orange-400 mr-3" />
          <a
            href={`mailto:${companyInfo.email}`}
            className="hover:text-orange-400 transition-colors"
          >
            {companyInfo.email}
          </a>
        </div>
        {/* <div className="flex items-center text-gray-300">
          <MessageCircle className="h-5 w-5 text-orange-400 mr-3" />
          <a
            href="https://wa.me/18091234567"
            className="hover:text-orange-400 transition-colors"
          >
            WhatsApp
          </a>
        </div>
        <div className="flex items-center text-gray-300">
          <Calendar className="h-5 w-5 text-orange-400 mr-3" />
          <a href="#" className="hover:text-orange-400 transition-colors">
            Schedule a Call
          </a>
        </div> */}
      </div>
    </div>
  )
}

export default CompanyInfo
