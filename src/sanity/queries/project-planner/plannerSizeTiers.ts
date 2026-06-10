import { cache } from "react"
import { client } from "@/sanity/lib/client"
import type { PlannerSizeTier } from "@/lib/planner/types"

export const plannerSizeTiersQuery = `
*[_type == "plannerSizeTier"] | order(order asc) {
  key, label, priceModifier, pages, order
}
`

export const getPlannerSizeTiers = cache(async (): Promise<PlannerSizeTier[]> => {
  return client.fetch(plannerSizeTiersQuery)
})
