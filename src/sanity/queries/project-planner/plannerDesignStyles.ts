import { cache } from "react"
import { client } from "@/sanity/lib/client"
import type { PlannerDesignStyle } from "@/lib/planner/types"

export const plannerDesignStylesQuery = `
*[_type == "plannerDesignStyle"] | order(order asc) {
  key, title, description, order
}
`

export const getPlannerDesignStyles = cache(
  async (): Promise<PlannerDesignStyle[]> => {
    return client.fetch(plannerDesignStylesQuery)
  },
)
