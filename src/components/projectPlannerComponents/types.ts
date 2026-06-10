import type { PlannerConfig } from "@/sanity/queries/project-planner/plannerConfig"
import type {
  PlannerAddon,
  PlannerDesignStyle,
  PlannerPricing,
  PlannerSelections,
  PlannerService,
  PlannerSizeTier,
} from "@/lib/planner/types"

/** All planner content fetched server-side and handed to the client component. */
export interface ProjectPlannerData {
  config: PlannerConfig
  services: PlannerService[]
  addons: PlannerAddon[]
  designStyles: PlannerDesignStyle[]
  sizeTiers: PlannerSizeTier[]
}

/** Full client state: estimate selections plus brief + contact fields. */
export interface PlannerState extends PlannerSelections {
  design: string
  references: string
  name: string
  email: string
  company: string
  message: string
}

export const initialPlannerState: PlannerState = {
  service: "",
  addons: [],
  sizeTier: "",
  content: "",
  rush: false,
  design: "",
  references: "",
  name: "",
  email: "",
  company: "",
  message: "",
}

/** Adapt CMS data into the focused shape the pure estimate engine expects. */
export function toPricing(data: ProjectPlannerData): PlannerPricing {
  return {
    services: data.services,
    addons: data.addons,
    sizeTiers: data.sizeTiers,
    contentPerPagePrice: data.config.estimateSettings.contentPerPagePrice,
    contentLine: data.config.estimatePanel.contentLine,
    rushLine: data.config.estimatePanel.rushLine,
    settings: data.config.estimateSettings,
  }
}
