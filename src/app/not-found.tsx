import { Link } from "@/i18n/navigation"
import Navbar from "@/components/Layout/HeaderComponents/Navbar"
import Footer from "@/components/Layout/FooterComponents/Footer"
import { client } from "@/sanity/lib/client"
import { getServiceItemsLinks } from "@/sanity/queries/services/serviceItem"
import { NextIntlClientProvider } from "next-intl"
import { routing } from "@/i18n/routing"
import { crimsonPro, inter } from "@/app/fonts"

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
  const lang = routing.defaultLocale

  const [messages, logo, companyInfo, serviceLinks] = await Promise.all([
    import("@/i18n/locales/en/translation.json").then(m => m.default),
    getLogo(),
    getCompanyInfo(),
    getServiceItemsLinks(),
  ])

  // Top-level not-found: the root layout no longer renders <html>/<body>, so
  // provide the document shell here. This route is not localized (it catches
  // unmatched paths outside [lang]), so an English shell is correct.
  return (
    <html lang="en">
      <body className={`${crimsonPro.variable} ${inter.variable} antialiased`}>
        <NextIntlClientProvider locale={lang} messages={messages}>
          <Navbar logo={logo} serviceLinks={serviceLinks} />
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 flex items-center justify-center px-4">
            <div className="max-w-xl mx-auto text-center">
              <p className="text-6xl font-bold text-orange-600 mb-4">404</p>
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                Page Not Found
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                The page you are looking for does not exist or has been moved.
                Let us help you find what you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  locale="en"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
                >
                  Go to Homepage
                </Link>
                <Link
                  href="/contact"
                  locale="en"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-slate-300 text-slate-700 font-semibold hover:border-orange-500 hover:text-orange-600 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <Link
                  href="/our-services"
                  locale="en"
                  className="text-slate-500 hover:text-orange-600 transition-colors"
                >
                  Services
                </Link>
                <Link
                  href="/portfolio"
                  locale="en"
                  className="text-slate-500 hover:text-orange-600 transition-colors"
                >
                  Portfolio
                </Link>
                <Link
                  href="/blog"
                  locale="en"
                  className="text-slate-500 hover:text-orange-600 transition-colors"
                >
                  Blog
                </Link>
                <Link
                  href="/pricing"
                  locale="en"
                  className="text-slate-500 hover:text-orange-600 transition-colors"
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
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
