import { cache } from "react"
import { client } from "@/sanity/lib/client"

export interface TrustStats {
  happyClients: number
  projectsCompleted: number
  averageRating: number
  supportAvailable: string
}

interface TrustSignalsData {
  title: {
    en: string
    es: string
  }
  subtitle: {
    en: string
    es: string
  }
  stats?: TrustStats
}

export const trustSignalsQuery = `*[_type == "trustSignals"][0] {
  title {
    en,
    es
  },
  subtitle {
    en,
    es
  },
  stats {
    happyClients,
    projectsCompleted,
    averageRating,
    supportAvailable
  }
}`

export const getTrustSignals = cache(async (): Promise<TrustSignalsData> => {
  return client.fetch(trustSignalsQuery)
})
