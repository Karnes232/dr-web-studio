import Link from "next/link"
import Navbar from "@/components/Layout/HeaderComponents/Navbar"
import Footer from "@/components/Layout/FooterComponents/Footer"
import { client } from "@/sanity/lib/client"
import { getServiceItemsLinks } from "@/sanity/queries/services/serviceItem"
import { I18nProvider } from "@/i18n/I18nContext"
import { fallbackLng } from "@/i18n/settings"

async function getLogo() {
  return client.fetch(`
    *[_type == "generalLayout"][0] {
      logo {
        asset->{
          url,
          metadata {
            dimensions,
            lqip,
            palette
          }
        },
        alt,
        hotspot,
        crop
      },
      footerLogo {
        asset->{
          url,
          metadata {
            dimensions,
            lqip,
            palette
          }
        },
        alt,
        hotspot,
        crop
      },
      companyName,
    }
  `)
}

async function getCompanyInfo() {
  return client.fetch(`
    *[_type == "generalLayout"][0] {
      email,
      companyName,
      footerText {
        en,
        es
      },
      socialLinks {
        linkedin,
        github
      }
    }
  `)
}

export default async function NotFound() {
  const lang = fallbackLng

  const [translations, logo, companyInfo, serviceLinks] = await Promise.all([
    import("@/i18n/locales/en/translation.json").then(m => m.default),
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 flex items-center justify-center px-4">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-6xl font-bold text-orange-500 mb-4">404</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            The page you are looking for does not exist or has been moved. Let
            us help you find what you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/en"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
            >
              Go to Homepage
            </Link>
            <Link
              href="/en/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-slate-300 text-slate-700 font-semibold hover:border-orange-500 hover:text-orange-500 transition-colors"
            >
              Contact Us
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <Link
              href="/en/our-services"
              className="text-slate-500 hover:text-orange-500 transition-colors"
            >
              Services
            </Link>
            <Link
              href="/en/portfolio"
              className="text-slate-500 hover:text-orange-500 transition-colors"
            >
              Portfolio
            </Link>
            <Link
              href="/en/blog"
              className="text-slate-500 hover:text-orange-500 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/en/pricing"
              className="text-slate-500 hover:text-orange-500 transition-colors"
            >
              Pricing
            </Link>
          </div>
        </div>
      </div>
      <Footer
        logo={logo}
        companyInfo={companyInfo}
        serviceLinks={serviceLinks}
      />
    </I18nProvider>
  )
}
