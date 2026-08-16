import { cache } from "react"
import { client } from "@/sanity/lib/client"

interface Client {
  companyName: string
  link: string
  logo: {
    asset: {
      url: string
    }
    alt: string
  }
}

interface PreviousClientsData {
  title: {
    en: string
    es: string
  }
  clients: Client[]
}

export const previousClientsQuery = `*[_type == "previousClients"][0] {
  title {
    en,
    es
  },
  clients[] {
    companyName,
    link,
    logo {
      // Only the URL: expanding the whole asset doc dragged dimensions/lqip/
      // palette metadata for every logo into the RSC flight payload.
      asset-> { url },
      alt
    }
  }
}`

export const getPreviousClients = cache(
  async (): Promise<PreviousClientsData> => {
    return client.fetch(previousClientsQuery)
  },
)
