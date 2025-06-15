import { client } from '@/sanity/lib/client'

export interface ServicesHeaderData {
  badge: {
    en: string
    es: string
  }
  title: {
    en: string
    es: string
  }
  highlightedText: {
    en: string
    es: string
  }
  description: {
    en: string
    es: string
  }
}

const servicesHeaderQuery = `*[_type == "servicesHeader"][0] {
  badge,
  title,
  highlightedText,
  description
}`

export async function getServicesHeader(): Promise<ServicesHeaderData> {
  return client.fetch(servicesHeaderQuery)
} 