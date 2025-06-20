import { groq } from "next-sanity"
import { client } from "@/sanity/lib/client"

export interface LocationInfo {
  _id: string
  _type: "locationInfo"
  title: {
    en: string
    es: string
  }
  location: {
    en: string
    es: string
  }
  description: {
    en: string
    es: string
  }
  localAdvantage: {
    title: {
      en: string
      es: string
    }
    description: {
      en: string
      es: string
    }
  }
  emergencySupport: {
    title: {
      en: string
      es: string
    }
    description: {
      en: string
      es: string
    }
  }
}

export const getLocationInfo = async (): Promise<LocationInfo> => {
  const query = groq`
    *[_type == "locationInfo"][0] {
      _id,
      _type,
      title,
      location,
      description,
      localAdvantage,
      emergencySupport
    }
  `

  return await client.fetch(query)
} 