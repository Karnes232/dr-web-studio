import { describe, expect, it, vi } from "vitest"

// tools.ts imports saveLead, which pulls in clients that need env vars.
// Only the tool schemas are under test here.
vi.mock("@/lib/leads/saveLead", () => ({ saveLead: vi.fn() }))

import { systemPersona } from "../prompt"
import { renderKnowledge } from "../knowledge"
import { TOOLS } from "../tools"
import fixture from "../__fixtures__/knowledge.json"
import type { AgentKnowledge } from "@/sanity/queries/agent/agentKnowledge"
import type { Tenant } from "@/lib/whatsapp/store"

/**
 * DR Web Studio's cached prefix, locked byte for byte.
 *
 * Everything up to the `cache_control` breakpoint — tools, then system[0]
 * (persona), then system[1] (knowledge) — is the prompt cache key. Changing a
 * single byte of it costs a cache WRITE on the next request, which at DR's
 * sparse traffic is the dominant cost of a conversation. Adding a second
 * tenant must not touch any of it, so these snapshots were committed BEFORE
 * the multi-tenant work began and must never be updated as part of it.
 *
 * If one of these fails, the change altered what DR sends to Claude. Fix the
 * change, do not re-record the snapshot — unless DR's prompt is being edited
 * on purpose, in which case that edit belongs in its own commit.
 */

const tenant = {
  tenant_id: "drwebstudio",
  business_name: "DR Web Studio",
  system_prompt: null,
  default_locale: "es",
} as unknown as Tenant

const kb = fixture as unknown as AgentKnowledge

const SNAPSHOTS = "./__snapshots__/drwebstudio"

describe("DR Web Studio cached prefix (golden)", () => {
  it("tools are unchanged", async () => {
    await expect(JSON.stringify(TOOLS, null, 2)).toMatchFileSnapshot(
      `${SNAPSHOTS}/tools.json`,
    )
  })

  it("system[0] persona is unchanged", async () => {
    await expect(systemPersona(tenant)).toMatchFileSnapshot(
      `${SNAPSHOTS}/persona.txt`,
    )
  })

  // run.ts renders exactly one locale per request: "en", otherwise "es".
  it.each(["es", "en"] as const)(
    "system[1] knowledge (%s) is unchanged",
    async lang => {
      await expect(renderKnowledge(kb, lang)).toMatchFileSnapshot(
        `${SNAPSHOTS}/knowledge.${lang}.txt`,
      )
    },
  )
})
