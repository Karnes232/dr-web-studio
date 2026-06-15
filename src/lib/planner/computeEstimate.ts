import type {
  EstimateItem,
  EstimateResult,
  Locale,
  PlannerPricing,
  PlannerSelections,
} from "./types"

const roundTo = (n: number, step: number): number =>
  step > 0 ? Math.round(n / step) * step : Math.round(n)

/**
 * Pure project estimate for the service + add-ons model. Every price comes from
 * `pricing`; nothing is hardcoded. Total = service base + selected add-ons
 * (filtered to that service), plus an optional rush surcharge.
 */
export function computeEstimate(
  s: PlannerSelections,
  pricing: PlannerPricing,
  locale: Locale,
): EstimateResult {
  const empty: EstimateResult = {
    items: [],
    subtotal: 0,
    total: 0,
    rushSurcharge: 0,
  }

  const service = pricing.services.find(x => x.key === s.service)
  if (!service) return empty

  const items: EstimateItem[] = [
    { key: "service", label: service.title[locale], amount: service.basePrice },
  ]

  for (const addonKey of s.addons) {
    const addon = pricing.addons.find(
      a => a.service === service.key && a.key === addonKey,
    )
    if (addon) {
      items.push({
        key: addon.key,
        label: addon.title[locale],
        amount: addon.price,
      })
    }
  }

  // Size & content apply only to page-based services.
  if (service.pageBased) {
    const tier = pricing.sizeTiers.find(t => t.key === s.sizeTier)
    if (tier) {
      items.push({
        key: "size",
        label: tier.label[locale],
        amount: tier.priceModifier,
      })
      if (s.content === "need") {
        items.push({
          key: "content",
          label: pricing.contentLine[locale],
          amount: tier.pages * pricing.contentPerPagePrice,
        })
      }
    }
  }

  const subtotal = items.reduce((sum, it) => sum + it.amount, 0)

  let rushSurcharge = 0
  let total = subtotal
  if (s.rush) {
    rushSurcharge = roundTo(
      subtotal * pricing.settings.rushPct,
      pricing.settings.rounding,
    )
    const pct = Math.round(pricing.settings.rushPct * 100)
    items.push({
      key: "rush",
      label: pricing.rushLine[locale].replace("{pct}", String(pct)),
      amount: rushSurcharge,
    })
    total = subtotal + rushSurcharge
  }

  return { items, subtotal, total, rushSurcharge }
}
