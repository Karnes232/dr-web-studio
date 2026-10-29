import { describe, expect, it } from "vitest"
import { formatStat, parseStat } from "./LandingStatsBar"

describe("formatStat", () => {
  it("keeps values that are not a single number exactly as written", () => {
    // These used to render as "247/" and "12–": every digit pulled out, the
    // rest glued on the end.
    expect(formatStat("24/7")).toBe("24/7")
    expect(formatStat("1–2")).toBe("1–2")
    expect(parseStat("24/7")).toBeNull()
  })

  it("keeps a prefix in front of the number", () => {
    expect(formatStat("~500")).toBe("~500")
    expect(formatStat("$95")).toBe("$95")
  })

  it("still splits single numbers with a suffix for the count-up", () => {
    expect(parseStat("50+")).toEqual({
      prefix: "",
      num: 50,
      decimals: 0,
      suffix: "+",
    })
    expect(formatStat("1yr")).toBe("1yr")
  })

  it("renders every stat used on the live landing pages as written", () => {
    // Captured from all landingPage statsBar values, 2026-10-29. "$900" came
    // out "900$", "$1,140" as "1140$," and "5.0" as "5" before.
    const live = [
      "24/7",
      "2",
      "~500",
      "1–2",
      "$900",
      "70%",
      "$0",
      "1yr",
      "$400",
      "150%",
      "2.3x",
      "50+",
      "5.0",
      "5",
      "100%",
      "90+",
      "$1,140",
      "99.9%",
      "0",
      "$95",
    ]
    for (const v of live) expect(formatStat(v)).toBe(v)
  })
})
