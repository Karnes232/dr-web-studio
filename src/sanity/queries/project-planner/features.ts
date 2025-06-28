import { client } from "@/sanity/lib/client"

export const featuresQuery = `
  *[_type == "features"][0] {
    title,
    description,
    selectedFeaturesText,
    features[] {
      value,
      label,
      description
    }
  }
`
export async function getFeatures(): Promise<Features> {
  return client.fetch(featuresQuery)
}

export interface Features {
  title: {
    en: string
    es: string
  }
  description: {
    en: string
    es: string
  }
  selectedFeaturesText: {
    en: string
    es: string
  }
  features: {
    value: {
      en: string
      es: string
    }
    label: {
      en: string
      es: string
    }
    description: {
      en: string
      es: string
    }
  }[]
}
