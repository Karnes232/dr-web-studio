import React from "react"
import CTASection from "./CTASection"
import CompanyInfo from "./CompanyInfo"
import QuickLinks from "./QuickLinks"
import ServicesLinks from "./ServicesLinks"
import ResourcesLinks from "./ResourcesLinks"
import CitiesLinks from "./CitiesLinks"
import SocialMedia from "./SocialMedia"
import BottomBar from "./BottomBar"
import { localizeServiceLinks } from "@/components/Layout/chrome"
import type { ServiceItemsLinks } from "@/sanity/queries/services/serviceItem"
import type { Locale } from "@/lib/slugs"

interface FooterProps {
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
    socialLinks: {
      linkedin: string
      github: string
      googleBusiness?: string
      trustpilot?: string
    }
  }
  serviceLinks: ServiceItemsLinks[]
  lang: Locale
}

// Server component: the entire footer is static markup except the
// LanguageSwitcher island inside SocialMedia.
const Footer = ({ logo, companyInfo, serviceLinks, lang }: FooterProps) => {
  const services = localizeServiceLinks(serviceLinks, lang)
  return (
    <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* CTA Section */}
        <CTASection lang={lang} />

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 mb-8">
          <CompanyInfo logo={logo} companyInfo={companyInfo} lang={lang} />
          <QuickLinks lang={lang} />
          <ServicesLinks services={services} lang={lang} />
          <ResourcesLinks lang={lang} />
          <CitiesLinks lang={lang} />
        </div>

        {/* Social Media */}
        <SocialMedia
          socialLinks={companyInfo.socialLinks}
          email={companyInfo.email}
          phone={companyInfo.telephone}
          lang={lang}
        />

        {/* Bottom Bar */}
        <BottomBar lang={lang} />
      </div>
    </footer>
  )
}

export default Footer
