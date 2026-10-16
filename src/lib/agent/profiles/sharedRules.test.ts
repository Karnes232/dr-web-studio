import { describe, expect, it } from "vitest"
import { systemPersona } from "../prompt"
import { SHARED_RULES } from "./sharedRules"
import type { Tenant } from "@/lib/whatsapp/store"

/**
 * The shared policy sentences were lifted from DR's persona. DR keeps its own
 * text (it is the cached prefix), so this is what stops the two drifting: if
 * DR's wording of a rule changes, the shared copy must change with it.
 */
describe("shared rules", () => {
  const dr = systemPersona({
    business_name: "DR Web Studio",
    system_prompt: null,
  } as unknown as Tenant)

  it.each(SHARED_RULES.map(r => [r.slice(0, 40), r]))(
    "DR's persona carries: %s…",
    (_, rule) => {
      expect(dr).toContain(rule)
    },
  )
})
