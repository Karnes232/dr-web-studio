import { describe, expect, it } from "vitest"
import { hasCampaignParams } from "./analytics"

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
