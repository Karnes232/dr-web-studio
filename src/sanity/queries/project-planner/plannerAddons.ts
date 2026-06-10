import { cache } from "react"
import { client } from "@/sanity/lib/client"
import type { PlannerAddon } from "@/lib/planner/types"

export const plannerAddonsQuery = `
*[_type == "plannerAddon"] | order(service asc, order asc) {
  key, service, title, description, price, order
}
`

export const getPlannerAddons = cache(async (): Promise<PlannerAddon[]> => {
  return client.fetch(plannerAddonsQuery)
})
