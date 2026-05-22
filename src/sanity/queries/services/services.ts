import { cache } from "react"
import { client } from "@/sanity/lib/client"

interface Service {
  title: {
    en: string
    es: string
  }
  description: {
    en: string
    es: string
  }
  color: string
  icon: string
}

export const servicesQuery = `*[_type == "service"] {
  title {
    en,
    es
  },
  description {
    en,
    es
  },
  color,
  icon,
}`

export const getServices = cache(async (): Promise<Service[]> => {
  return client.fetch(servicesQuery)
})
