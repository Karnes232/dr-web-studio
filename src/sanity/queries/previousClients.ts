import { client } from "@/sanity/lib/client"

interface Client {
  companyName: string
  link: string
  logo: {
    asset: {
      _ref: string
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
      asset->,
      alt
    }
  }
}`

export async function getPreviousClients(): Promise<PreviousClientsData> {
  return client.fetch(previousClientsQuery)
} 