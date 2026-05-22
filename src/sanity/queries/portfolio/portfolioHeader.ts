import { cache } from "react"
import { client } from "@/sanity/lib/client"

export interface PortfolioHeaderData {
  title: {
    en: string
    es: string
  }
  description: {
    en: string
    es: string
  }
}

const portfolioHeaderQuery = `*[_type == "portfolioHeader"][0] {
  title,
  description
}`

export const getPortfolioHeader = cache(
  async (): Promise<PortfolioHeaderData> => {
    return client.fetch(portfolioHeaderQuery)
  },
)
