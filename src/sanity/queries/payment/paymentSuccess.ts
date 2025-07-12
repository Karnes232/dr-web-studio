import { client } from "@/sanity/lib/client"

export interface PaymentSuccessData {
  title: {
    en: string
    es: string
  }
  subtitle: {
    en: string
    es: string
  }
}

const paymentSuccessQuery = `*[_type == "paymentSuccess"][0] {
  title,
  subtitle
}`

export async function getPaymentSuccess(): Promise<PaymentSuccessData> {
  return client.fetch(paymentSuccessQuery)
} 