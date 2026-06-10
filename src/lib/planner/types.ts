export type Locale = "en" | "es"

export interface LocalizedString {
  en: string
  es: string
}

export interface PlannerService {
  key: string
  title: LocalizedString
  description: LocalizedString
  icon: string
  basePrice: number
  /** When true, the planner shows the Size & Content step for this service. */
  pageBased?: boolean
  timeline: LocalizedString
  included: LocalizedString[]
  slug?: string
  order: number
}

export interface PlannerDesignStyle {
  key: string
  title: LocalizedString
  description: LocalizedString
  order: number
}

export interface PlannerSizeTier {
  key: string
  label: LocalizedString
  priceModifier: number
  /** Representative page count used for the per-page content calc. */
  pages: number
  order: number
}

export type ContentChoice = "" | "ready" | "need"

export interface PlannerAddon {
  key: string
  /** plannerService.key this add-on belongs to. */
  service: string
  title: LocalizedString
  description?: LocalizedString
  price: number
  order: number
}

export interface EstimateSettings {
  currencyCode: string
  currencySymbol: string
  /** 0.2 = +20% rush surcharge on the subtotal. */
  rushPct: number
  rounding: number
  /** Per-page content/copywriting rate (page-based services). */
  contentPerPagePrice: number
}

/** The minimal pricing/label data the pure estimate engine needs. */
export interface PlannerPricing {
  services: PlannerService[]
  addons: PlannerAddon[]
  sizeTiers: PlannerSizeTier[]
  contentPerPagePrice: number
  /** Localized line label for the content & copywriting row. */
  contentLine: LocalizedString
  /** Localized rush line label; may contain a `{pct}` placeholder. */
  rushLine: LocalizedString
  settings: EstimateSettings
}

export interface PlannerSelections {
  service: string
  addons: string[]
  /** Page-based services only. */
  sizeTier: string
  content: ContentChoice
  rush: boolean
}

export interface EstimateItem {
  key: string
  label: string
  amount: number
}

export interface EstimateResult {
  items: EstimateItem[]
  subtotal: number
  total: number
  rushSurcharge: number
}
