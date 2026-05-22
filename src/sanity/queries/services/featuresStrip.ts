import { cache } from "react"
import { client } from "@/sanity/lib/client"

interface Feature {
  iconName: "Smartphone" | "Search" | "Zap"
  title: {
    en: string
    es: string
  }
  description: {
    en: string
    es: string
  }
  gradient: string
}

export interface FeaturesStripData {
  features: Feature[]
}

const featuresStripQuery = `*[_type == "featuresStrip"][0] {
  features[] {
    iconName,
    title,
    description,
    gradient
  }
}`

export const getFeaturesStrip = cache(async (): Promise<FeaturesStripData> => {
  return client.fetch(featuresStripQuery)
})
