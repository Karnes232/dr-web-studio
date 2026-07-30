import { cache } from "react"
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

export const getLocationInfo = cache(async (): Promise<LocationInfo> => {
  // Plain template literal — importing the `groq` tag from next-sanity pulls
  // its visual-editing client components (@sanity/client + stega, ~57 KiB)
  // into the /contact browser bundle.
  const query = `
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
})
