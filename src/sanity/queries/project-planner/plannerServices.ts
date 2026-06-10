import { cache } from "react"
import { client } from "@/sanity/lib/client"
import type { PlannerService } from "@/lib/planner/types"

export const plannerServicesQuery = `
*[_type == "plannerService"] | order(order asc) {
  key, title, description, icon, basePrice, pageBased, timeline, included, slug, order
}
`

export const getPlannerServices = cache(async (): Promise<PlannerService[]> => {
  return client.fetch(plannerServicesQuery)
})
