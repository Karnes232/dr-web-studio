import { client } from "@/sanity/lib/client"

interface TrustSignalsData {
  title: {
    en: string
    es: string
  }
  subtitle: {
    en: string
    es: string
  }
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
}`

export async function getTrustSignals(): Promise<TrustSignalsData> {
  return client.fetch(trustSignalsQuery)
}
