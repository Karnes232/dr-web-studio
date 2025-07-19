import { client } from "@/sanity/lib/client"

export interface PaymentSuccessStep {
  number: number
  description: {
    en: string
    es: string
  }
  color: string
}

export interface PaymentSuccessData {
  title: {
    en: string
    es: string
  }
  subtitle: {
    en: string
    es: string
  }
  whatsNext: {
    title: {
      en: string
      es: string
    }
    steps: PaymentSuccessStep[]
  }
}

const paymentSuccessQuery = `*[_type == "paymentSuccess"][0] {
  title,
  subtitle,
  whatsNext {
    title,
    steps[] {
      number,
      description,
      color
    }
  }
}`

export async function getPaymentSuccess(): Promise<PaymentSuccessData> {
  return client.fetch(paymentSuccessQuery)
}
