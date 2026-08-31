import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { gtag, hasCampaignParams, trackEvent } from "./analytics"

describe("hasCampaignParams", () => {
  it("detects paid click ids", () => {
    expect(hasCampaignParams("?gclid=test123")).toBe(true)
    expect(hasCampaignParams("?gbraid=abc")).toBe(true)
    expect(hasCampaignParams("?wbraid=abc")).toBe(true)
  })
  it("detects utm tagging", () => {
    expect(hasCampaignParams("?utm_source=google")).toBe(true)
    expect(hasCampaignParams("?utm_medium=cpc")).toBe(true)
    expect(hasCampaignParams("?utm_campaign=launch")).toBe(true)
  })
  it("ignores organic and unrelated params", () => {
    expect(hasCampaignParams("")).toBe(false)
    expect(hasCampaignParams("?ref=twitter")).toBe(false)
    expect(hasCampaignParams("?page=2&sort=asc")).toBe(false)
  })
  it("ignores empty campaign values", () => {
    expect(hasCampaignParams("?gclid=")).toBe(false)
    expect(hasCampaignParams("?utm_source=")).toBe(false)
  })
})

describe("gtag dataLayer shim", () => {
  // These run in vitest's node environment, so stand `window` up first — gtag()
  // guards on it and would otherwise no-op.
  const w = globalThis as unknown as { window?: unknown; dataLayer?: unknown[] }
  beforeEach(() => {
    w.window = globalThis
    w.dataLayer = []
  })
  afterEach(() => {
    delete w.window
    delete w.dataLayer
  })

  it("pushes a genuine Arguments object, not an Array", () => {
    // gtag.js ignores plain Arrays — pushing one means GA4 never initialises.
    gtag("config", "G-TEST")
    const entry = w.dataLayer![0]
    expect(Object.prototype.toString.call(entry)).toBe("[object Arguments]")
    expect(Array.isArray(entry)).toBe(false)
    expect(Array.from(entry as IArguments)).toEqual(["config", "G-TEST"])
  })

  it("queues events in command form", () => {
    trackEvent("generate_lead", { form: "contact" })
    expect(Array.from(w.dataLayer![0] as IArguments)).toEqual([
      "event",
      "generate_lead",
      { form: "contact" },
    ])
  })
})
