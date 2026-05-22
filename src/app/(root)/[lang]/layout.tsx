import Navbar from "@/components/Layout/HeaderComponents/Navbar"
import Footer from "@/components/Layout/FooterComponents/Footer"
import {
  getCompanyInfo,
  getLogo,
} from "@/sanity/queries/layout/generalLayout"
import { getServiceItemsLinks } from "@/sanity/queries/services/serviceItem"
import { I18nProvider } from "@/i18n/I18nContext"
import { languages, fallbackLng } from "@/i18n/settings"

export const revalidate = 3600

export async function generateStaticParams() {
  return languages.map(lang => ({ lang }))
}

interface LangLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export default async function LangLayout({
  children,
  params,
}: LangLayoutProps) {
  const { lang: rawLang } = await params
  const lang = languages.includes(rawLang) ? rawLang : fallbackLng

  const [translations, logo, companyInfo, serviceLinks] = await Promise.all([
    lang === "es"
      ? import("@/i18n/locales/es/translation.json").then(m => m.default)
      : import("@/i18n/locales/en/translation.json").then(m => m.default),
    getLogo(),
    getCompanyInfo(),
    getServiceItemsLinks(),
  ])

  return (
    <I18nProvider
      locale={lang}
      translations={translations as Record<string, unknown>}
    >
      <Navbar logo={logo} serviceLinks={serviceLinks} />
      {children}
      <Footer
        logo={logo}
        companyInfo={companyInfo}
        serviceLinks={serviceLinks}
      />
    </I18nProvider>
  )
}
