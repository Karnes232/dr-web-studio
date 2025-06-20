import { client } from "@/sanity/lib/client"

export interface PricingHeaderData {
  title: {
    en: string
    es: string
  }
  description: {
    en: string
    es: string
  }
}

const pricingHeaderQuery = `*[_type == "pricingHeader"][0] {
  title,
  description
}`

export async function getPricingHeader(): Promise<PricingHeaderData> {
  return client.fetch(pricingHeaderQuery)
}
