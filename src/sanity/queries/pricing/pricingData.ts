import { client } from "@/sanity/lib/client"

export interface PricingFeature {
  text: {
    en: string
    es: string
  }
  included: boolean
}

export interface PricingBadge {
  text: {
    en: string
    es: string
  }
  variant: "default" | "popular" | "premium"
}

export interface PricingData {
  _id: string
  title: {
    en: string
    es: string
  }
  price: string
  description: {
    en: string
    es: string
  }
  iconName: string
  features: PricingFeature[]
  ctaText: {
    en: string
    es: string
  }
  ctaHref: string
  variant: "default" | "popular" | "premium"
  badge?: PricingBadge
}

const pricingDataQuery = `*[_type == "pricingData"] | order(variant asc) {
  _id,
  title,
  price,
  description,
  iconName,
  features[] {
    text,
    included
  },
  ctaText,
  ctaHref,
  variant,
  badge {
    text,
    variant
  }
}`

export async function getPricingData(): Promise<PricingData[]> {
  return client.fetch(pricingDataQuery)
} 