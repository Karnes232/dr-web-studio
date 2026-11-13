import { describe, expect, it } from "vitest"
import { isRestrictedDestination } from "./restricted"

describe("isRestrictedDestination", () => {
  it.each([
    ["5549999990000", "Brazil, the prefix both lost Grand Bay chats had"],
    ["5562999990000", "Brazil"],
    ["6281234567890", "Indonesia"],
    ["BR.1757134975438075", "a Brazilian username contact"],
    ["ID.1757134975438075", "an Indonesian username contact"],
    ["br.1757134975438075", "lower-case country prefix"],
  ])("blocks %s (%s)", id => {
    expect(isRestrictedDestination(id)).toBe(true)
  })

  it.each([
    ["18295551234", "Dominican Republic"],
    ["12048093662", "North America"],
    ["573101234567", "Colombia (57)"],
    ["5491112345678", "Argentina (54)"],
    ["56912345678", "Chile (56)"],
    ["60123456789", "Malaysia (60)"],
    ["639171234567", "Philippines (63)"],
    ["447911123456", "United Kingdom"],
    ["DO.1757134975438075", "a Dominican username contact"],
    ["", "an empty id"],
  ])("allows %s (%s)", id => {
    expect(isRestrictedDestination(id)).toBe(false)
  })
})
