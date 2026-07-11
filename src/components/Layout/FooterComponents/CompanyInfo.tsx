"use client"

import React from "react"
import { MapPin, Mail, Phone } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import FooterLogo from "./FooterLogo"
import { useLocale } from "@/i18n/useLocale"
import { telHref, waHref } from "@/lib/contact"

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
    telephone?: string
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
        {companyInfo.telephone && (
          <>
            <div className="flex items-center text-gray-300">
              <FaWhatsapp className="h-5 w-5 text-orange-400 mr-3" />
              <a
                href={waHref(
                  companyInfo.telephone,
                  t("landingPage.whatsappMessage"),
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-400 transition-colors"
              >
                {t("landingPage.whatsapp")}
              </a>
            </div>
            <div className="flex items-center text-gray-300">
              <Phone className="h-5 w-5 text-orange-400 mr-3" />
              <a
                href={telHref(companyInfo.telephone)}
                className="hover:text-orange-400 transition-colors"
              >
                {companyInfo.telephone}
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CompanyInfo
