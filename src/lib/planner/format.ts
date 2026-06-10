import type { EstimateSettings } from "./types"

/** Currency formatting matching the prototype: "$1,234". */
export function formatCurrency(
  amount: number,
  settings: Pick<EstimateSettings, "currencySymbol">,
): string {
  return `${settings.currencySymbol}${Math.round(amount).toLocaleString("en-US")}`
}
