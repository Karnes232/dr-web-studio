import CustomQuoteCard from "@/components/PricingPageComponents/CustomQuoteCard"
import PricingCard from "@/components/PricingPageComponents/PricingCard"
import PricingFAQ from "@/components/PricingPageComponents/PricingFAQ"
import { getSEO, getSeoSchema } from "@/sanity/queries/seo"
import { Globe, MessageCircle, ShoppingCart, Zap } from "lucide-react"
import { Metadata } from "next"
import React from "react"

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}

type PricingPackage = {
  title: string
  price: string
  originalPrice: string
  description: string
  iconName: "Zap" | "Globe" | "ShoppingCart"
  variant?: "default" | "popular" | "premium"
  badge?: { text: string; variant: string }
  features: (string | { text: string; included?: boolean })[]
  ctaText: string
  ctaHref: string
}

const pricingData: PricingPackage[] = [
  {
    title: "Starter Website",
    price: "300",
    originalPrice: "400",
    description: "Perfect for small businesses and personal brands",
    iconName: "Zap",
    features: [
      "1-3 responsive pages",
      "Modern, clean design",
      "Mobile-first approach",
      "Basic SEO optimization",
      "Contact form integration",
      "Social media links",
      "30 days support",
      { text: "CMS integration", included: false },
      { text: "E-commerce features", included: false },
    ],
    ctaText: "Get Started",
    ctaHref: "#quote",
  },
  {
    title: "Business Website",
    price: "600",
    originalPrice: "800",
    description: "Ideal for growing businesses with dynamic content needs",
    iconName: "Globe",
    variant: "popular",
    badge: { text: "Most Popular", variant: "popular" },
    features: [
      "4-8 responsive pages",
      "Custom design & branding",
      "CMS integration (Sanity)",
      "Blog functionality",
      "Advanced SEO setup",
      "Google Analytics",
      "Contact forms & maps",
      "Performance optimization",
      "60 days support",
    ],
    ctaText: "Choose Business",
    ctaHref: "#quote",
  },
  {
    title: "E-commerce Package",
    price: "900",
    originalPrice: "1200",
    description: "Complete online store solution for selling products",
    iconName: "ShoppingCart",
    variant: "premium",
    features: [
      "Product catalog pages",
      "Shopping cart & checkout",
      "Payment gateway integration",
      "Inventory management",
      "Order tracking system",
      "Customer accounts",
      "Admin dashboard",
      "Mobile commerce optimized",
      "90 days support",
    ],
    ctaText: "Start Selling",
    ctaHref: "#quote",
  },
]

export default async function Pricing({ params }: PageProps) {
  const { lang } = await params
  const seoData = await getSeoSchema("pricing")

  return (
    <>
      {seoData?.structuredData?.[lang] && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: seoData.structuredData[lang] }}
        />
      )}
      <section
        id="pricing"
        className="py-20 bg-gradient-to-br from-slate-50 to-orange-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect package for your business needs. All prices
              include design, development, and post-launch support.
            </p>

            {/* Price Toggle could go here for monthly/yearly if needed */}
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {pricingData.map((pkg, index) => (
              <PricingCard key={index} {...pkg} />
            ))}
          </div>

          {/* Custom Quote Card */}
          <div className="max-w-md mx-auto mb-16">
            <CustomQuoteCard />
          </div>

          {/* Additional CTA Section */}
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-8 text-center text-white mb-16">
            <h3 className="text-2xl font-bold mb-4">
              Not sure which package is right for you?
            </h3>
            <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
              Take our quick questionnaire to get a personalized recommendation
              and custom quote tailored to your specific business needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#questionnaire"
                className="bg-white text-orange-600 px-8 py-3 rounded-lg font-medium hover:bg-orange-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Take Questionnaire
              </a>
              <a
                href="https://wa.me/18091234567"
                className="bg-teal-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-teal-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* FAQ Section */}
          <PricingFAQ />
        </div>
      </section>
    </>
  )
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params
  const seoData = await getSEO("pricing")

  if (!seoData) return {}

  return {
    title: seoData.meta[lang]?.title,
    description: seoData.meta[lang]?.description,
    openGraph: {
      title: seoData.openGraph[lang]?.title || seoData.meta[lang]?.title,
      description:
        seoData.openGraph[lang]?.description || seoData.meta[lang]?.description,
      images: seoData.openGraph.image ? [seoData.openGraph.image] : [],
    },
    robots: {
      index: !seoData.noIndex,
      follow: !seoData.noFollow,
    },
    ...(seoData.canonicalUrl && { canonical: seoData.canonicalUrl }),
    alternates: {
      canonical: seoData.canonicalUrl,
    },
  }
}
