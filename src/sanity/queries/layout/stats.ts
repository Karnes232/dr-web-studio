import { cache } from "react"
import { client } from "@/sanity/lib/client"

interface StatsData {
  websitesDelivered: number
  yearsExperience: number
}

export const statsQuery = `*[_type == "stats"][0] {
  websitesDelivered,
  yearsExperience
}`

export const getStats = cache(async (): Promise<StatsData> => {
  return client.fetch(statsQuery)
})
