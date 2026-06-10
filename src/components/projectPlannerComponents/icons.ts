import {
  Briefcase,
  MousePointerClick,
  ShoppingCart,
  AppWindow,
  Database,
  Globe,
  RefreshCw,
  Workflow,
  Layers,
  type LucideIcon,
} from "lucide-react"

/**
 * Maps the string `icon` keys stored in Sanity to lucide components, so we
 * never store React in the CMS. `Layers` is the safe fallback.
 */
const ICONS: Record<string, LucideIcon> = {
  Briefcase,
  MousePointerClick,
  ShoppingCart,
  AppWindow,
  Database,
  Globe,
  RefreshCw,
  Workflow,
}

export function iconFor(key: string | undefined): LucideIcon {
  return (key && ICONS[key]) || Layers
}
