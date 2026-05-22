import { cache } from "react"
import { client } from "@/sanity/lib/client"

export interface CustomPaymentData {
  title: {
    en: string
    es: string
  }
  subtitle: {
    en: string
    es: string
  }
}

const customPaymentQuery = `*[_type == "customPayment"][0] {
  title,
  subtitle
}`

export const getCustomPayment = cache(async (): Promise<CustomPaymentData> => {
  return client.fetch(customPaymentQuery)
})
