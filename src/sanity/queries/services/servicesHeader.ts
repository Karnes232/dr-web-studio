import { client } from "@/sanity/lib/client"

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
  faq: {
    sectionTitle: {
      en: string
      es: string
    }
    sectionSubtitle: {
      en: string
      es: string
    }
    items: {
      question: {
        en: string
        es: string
      }
      answer: {
        en: string
        es: string
      }
    }[]
  }
}

const servicesHeaderQuery = `*[_type == "servicesHeader"][0] {
  badge,
  title,
  highlightedText,
  description,
  faq {
    sectionTitle { en, es },
    sectionSubtitle { en, es },
    items[] {
      question { en, es },
      answer { en, es }
    }
  }
}`

export async function getServicesHeader(): Promise<ServicesHeaderData> {
  return client.fetch(servicesHeaderQuery)
}
