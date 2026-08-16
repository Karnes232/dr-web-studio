import { cache } from "react"
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
  pricePeriod?: {
    en?: string
    es?: string
  }
  order?: number
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

const pricingDataQuery = `*[_type == "pricingData"] | order(coalesce(order, 99) asc, variant asc) {
  _id,
  title,
  price,
  pricePeriod,
  order,
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

export const getPricingData = cache(async (): Promise<PricingData[]> => {
  return client.fetch(pricingDataQuery)
})
