import { describe, expect, it, vi } from "vitest"

// `nodes.ts` pulls in next-intl's navigation helpers through `@/lib/urls`,
// which need the Next runtime. None of that is involved in phone handling, so
// stub the one function it actually calls.
vi.mock("@/lib/urls", () => ({
  localizedUrl: (href: unknown, lang: string) =>
    `/${lang}${typeof href === "string" ? href : ""}`,
}))

import { offerCatalogNode, organizationNode, serviceNode } from "./nodes"
import type { LayoutSchemaData } from "@/sanity/queries/layout/generalLayout"

/**
 * `telephone` is the callable voice line; `whatsapp` is a Cloud API messaging
 * endpoint that cannot be dialled. Publishing the WhatsApp number as
 * `Organization.telephone` would contradict the Google Business Profile and
 * every directory citation, so the two must never be conflated.
 */

const base: LayoutSchemaData = {
  companyName: "DR Web Studio",
  email: "james@dr-webstudio.com",
  telephone: "18296405433",
  whatsapp: "18296405433",
}

const contactPoints = (layout: LayoutSchemaData) => {
  const cp = organizationNode(layout, { lang: "es" }).contactPoint
  return Array.isArray(cp) ? cp : [cp]
}

describe("organizationNode phone handling", () => {
  it("publishes the callable number as Organization.telephone", () => {
    expect(organizationNode(base, { lang: "es" }).telephone).toBe(
      "+18296405433",
    )
  })

  it("emits a single contactPoint while the two numbers are identical", () => {
    // Until `whatsapp` is populated in Sanity the GROQ coalesce makes them
    // equal, so this is the shape the live site has today — the split must be
    // a no-op until the field actually diverges.
    const cp = organizationNode(base, { lang: "es" }).contactPoint
    expect(Array.isArray(cp)).toBe(false)
    expect(cp).toMatchObject({ contactType: "customer service" })
  })

  it("adds a sales contactPoint once WhatsApp moves to its own number", () => {
    const points = contactPoints({ ...base, whatsapp: "18299998888" })
    expect(points).toHaveLength(2)
    expect(points[1]).toMatchObject({
      contactType: "sales",
      telephone: "+18299998888",
    })
  })

  it("never lets the WhatsApp number become Organization.telephone", () => {
    const node = organizationNode(
      { ...base, whatsapp: "18299998888" },
      { lang: "es" },
    )
    expect(node.telephone).toBe("+18296405433")
  })

  it("omits telephone entirely when no callable number is set", () => {
    const node = organizationNode(
      { ...base, telephone: undefined, whatsapp: "18299998888" },
      { lang: "es" },
    )
    expect(node.telephone).toBeUndefined()
    // The WhatsApp number still gets published, just never as the voice line.
    expect(contactPoints({ ...base, telephone: undefined })).toHaveLength(2)
  })
})

/**
 * The WhatsApp assistant is $49/month plus a $300 one-time setup. The two must
 * stay separate specs: a single "$349" or a monthly "$300" would misstate the
 * published price.
 */
describe("prices with a one-time setup fee", () => {
  const href = {
    pathname: "/our-services/[slug]" as const,
    params: { slug: "ai-whatsapp-assistant" },
  }

  it("emits the monthly price and the setup fee as two specs", () => {
    const offers = serviceNode({
      lang: "es",
      name: "Asistente de WhatsApp con IA",
      href,
      price: 49,
      unit: "MONTH",
      setup: 300,
    }).offers as Record<string, unknown>
    expect(offers.price).toBe("49")
    expect(offers.priceSpecification).toEqual([
      {
        "@type": "UnitPriceSpecification",
        price: "49",
        priceCurrency: "USD",
        unitText: "MONTH",
      },
      {
        "@type": "PriceSpecification",
        name: "Instalación (pago único)",
        price: "300",
        priceCurrency: "USD",
      },
    ])
  })

  it("leaves a plain recurring price as a single spec", () => {
    const offers = serviceNode({
      lang: "en",
      name: "Maintenance",
      href,
      price: 95,
      unit: "MONTH",
    }).offers as Record<string, unknown>
    expect(offers.priceSpecification).toEqual({
      "@type": "UnitPriceSpecification",
      price: "95",
      priceCurrency: "USD",
      unitText: "MONTH",
    })
  })

  it("carries the setup fee into the OfferCatalog", () => {
    const catalog = offerCatalogNode(
      [
        {
          title: { en: "AI WhatsApp Assistant", es: "Asistente" },
          slug: { current: "ai-whatsapp-assistant" },
        },
      ],
      "en",
    )
    const [offer] = catalog.itemListElement as Record<string, unknown>[]
    const specs = offer.priceSpecification as Record<string, unknown>[]
    expect(specs.map(x => x.price)).toEqual(["49", "300"])
    expect(specs[1].name).toBe("One-time setup fee")
  })
})
