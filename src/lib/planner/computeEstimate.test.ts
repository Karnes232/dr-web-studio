import { describe, it, expect } from "vitest"
import { computeEstimate } from "./computeEstimate"
import type { PlannerPricing, PlannerSelections } from "./types"

const ls = (en: string) => ({ en, es: en })

const pricing: PlannerPricing = {
  services: [
    {
      key: "custom-business",
      title: ls("Custom Business"),
      description: ls(""),
      icon: "Briefcase",
      basePrice: 950,
      pageBased: true,
      timeline: ls("6–8 weeks"),
      included: [ls("Responsive Design")],
      order: 1,
    },
    {
      key: "landing-pages",
      title: ls("Landing Pages"),
      description: ls(""),
      icon: "MousePointerClick",
      basePrice: 400,
      pageBased: false,
      timeline: ls("2–3 weeks"),
      included: [ls("Responsive Design")],
      order: 2,
    },
  ],
  addons: [
    {
      key: "blog-system",
      service: "custom-business",
      title: ls("Blog System"),
      price: 200,
      order: 1,
    },
  ],
  sizeTiers: [
    {
      key: "up-to-5",
      label: ls("Up to 5 pages"),
      priceModifier: 0,
      pages: 5,
      order: 1,
    },
    {
      key: "6-10",
      label: ls("6–10 pages"),
      priceModifier: 200,
      pages: 10,
      order: 2,
    },
    {
      key: "11-20",
      label: ls("11–20 pages"),
      priceModifier: 500,
      pages: 20,
      order: 3,
    },
  ],
  contentPerPagePrice: 30,
  contentLine: ls("Content & copywriting"),
  rushLine: ls("Rush delivery (+{pct}%)"),
  settings: {
    currencyCode: "USD",
    currencySymbol: "$",
    rushPct: 0.2,
    rounding: 50,
    contentPerPagePrice: 30,
  },
}

const base: PlannerSelections = {
  service: "",
  addons: [],
  sizeTier: "",
  content: "",
  rush: false,
}

describe("computeEstimate", () => {
  it("returns zeros when no service is selected", () => {
    expect(computeEstimate(base, pricing, "en")).toEqual({
      items: [],
      subtotal: 0,
      total: 0,
      rushSurcharge: 0,
    })
  })

  it("service base only", () => {
    const r = computeEstimate(
      { ...base, service: "landing-pages" },
      pricing,
      "en",
    )
    expect(r.subtotal).toBe(400)
    expect(r.items).toHaveLength(1)
  })

  it("page-based: base + add-on + size tier", () => {
    const r = computeEstimate(
      {
        service: "custom-business",
        addons: ["blog-system"],
        sizeTier: "6-10",
        content: "ready",
        rush: false,
      },
      pricing,
      "en",
    )
    // 950 + 200 (blog) + 200 (6-10 tier)
    expect(r.subtotal).toBe(1350)
    expect(r.items.map(i => i.key)).toEqual(["service", "blog-system", "size"])
  })

  it("content = representative pages × per-page rate", () => {
    const r = computeEstimate(
      {
        service: "custom-business",
        addons: [],
        sizeTier: "11-20",
        content: "need",
        rush: false,
      },
      pricing,
      "en",
    )
    // size 500 + content 20 * 30 = 600
    const content = r.items.find(i => i.key === "content")
    expect(content?.amount).toBe(600)
    expect(content?.label).toBe("Content & copywriting")
    // 950 + 500 + 600
    expect(r.subtotal).toBe(2050)
  })

  it("content 'ready' adds no content line", () => {
    const r = computeEstimate(
      {
        service: "custom-business",
        addons: [],
        sizeTier: "6-10",
        content: "ready",
        rush: false,
      },
      pricing,
      "en",
    )
    expect(r.items.find(i => i.key === "content")).toBeUndefined()
  })

  it("non-page-based service ignores size & content even if provided", () => {
    const r = computeEstimate(
      {
        service: "landing-pages",
        addons: [],
        sizeTier: "11-20",
        content: "need",
        rush: false,
      },
      pricing,
      "en",
    )
    expect(r.items.map(i => i.key)).toEqual(["service"])
    expect(r.subtotal).toBe(400)
  })

  it("rush applies on the full subtotal (incl. size + content)", () => {
    const r = computeEstimate(
      {
        service: "custom-business",
        addons: [],
        sizeTier: "6-10",
        content: "need",
        rush: true,
      },
      pricing,
      "en",
    )
    // subtotal = 950 + 200 (tier) + 300 (10*30) = 1450; rush = round(1450*0.2 /50)*50 = 300
    expect(r.subtotal).toBe(1450)
    expect(r.rushSurcharge).toBe(300)
    expect(r.total).toBe(1750)
    expect(r.items.map(i => i.key)).toEqual([
      "service",
      "size",
      "content",
      "rush",
    ])
  })

  it("localizes labels by locale", () => {
    const pr: PlannerPricing = {
      ...pricing,
      sizeTiers: [
        { ...pricing.sizeTiers[0], label: { en: "Up to 5", es: "Hasta 5" } },
      ],
    }
    const r = computeEstimate(
      {
        service: "custom-business",
        addons: [],
        sizeTier: "up-to-5",
        content: "",
        rush: false,
      },
      pr,
      "es",
    )
    expect(r.items.find(i => i.key === "size")?.label).toBe("Hasta 5")
  })
})
