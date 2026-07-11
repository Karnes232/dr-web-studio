import Navbar from "@/components/Layout/HeaderComponents/Navbar"
import Footer from "@/components/Layout/FooterComponents/Footer"
import { getCompanyInfo, getLogo } from "@/sanity/queries/layout/generalLayout"
import { getServiceItemsLinks } from "@/sanity/queries/services/serviceItem"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { Analytics } from "@vercel/analytics/next"
import DeferredAnalytics from "@/components/Analytics/DeferredAnalytics"
import ThemeProvider from "@/components/theme/ThemeProvider"
import { crimsonPro, inter } from "@/app/fonts"

export const revalidate = 3600

export function generateStaticParams() {
  return routing.locales.map(locale => ({ lang: locale }))
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
  const lang = hasLocale(routing.locales, rawLang)
    ? rawLang
    : routing.defaultLocale

  // Enables static rendering and scopes server-side translations to this locale.
  setRequestLocale(lang)

  const [logo, companyInfo, serviceLinks, messages] = await Promise.all([
    getLogo(),
    getCompanyInfo(),
    getServiceItemsLinks(),
    getMessages(),
  ])

  // The <html> tag lives here (not in the root layout) so `lang` reflects the
  // actual locale of the page, server-side and per statically-generated route.
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body className={`${crimsonPro.variable} ${inter.variable} antialiased`}>
        <ThemeProvider>
          <NextIntlClientProvider locale={lang} messages={messages}>
            <Navbar
              logo={logo}
              serviceLinks={serviceLinks}
              phone={companyInfo?.telephone}
            />
            {children}
            <Footer
              logo={logo}
              companyInfo={companyInfo}
              serviceLinks={serviceLinks}
            />
          </NextIntlClientProvider>
        </ThemeProvider>
        <DeferredAnalytics />
        <Analytics />
      </body>
    </html>
  )
}
