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
  icon: {
    asset: {
      _ref: string
    }
    alt: string
  }
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
  icon {
    asset->,
    alt
  }
}`

export async function getServices(): Promise<Service[]> {
  return client.fetch(servicesQuery)
}
