import { client } from "@/sanity/lib/client"

interface ServiceSectionData {
  title: {
    en: string
    es: string
  }
  subtitle: {
    en: string
    es: string
  }
  ctaButton: {
    text: {
      en: string
      es: string
    }
  }
}

export const homePageServiceQuery = `*[_type == "serviceSection"][0] {
  title {
    en,
    es
  },
  subtitle {
    en,
    es
  },
  ctaButton {
    text {
      en,
      es
    }
  }
}`

export async function getHomePageService(): Promise<ServiceSectionData> {
  return client.fetch(homePageServiceQuery)
}
