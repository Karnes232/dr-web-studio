import type { Tenant } from "@/lib/whatsapp/store"
import { drwebstudio } from "./drwebstudio"
import type { AgentProfile } from "./types"

export type { AgentProfile, CatalogueEntry, LoadedKnowledge } from "./types"

const PROFILES: Record<string, AgentProfile> = {
  [drwebstudio.id]: drwebstudio,
}

/**
 * The profile a tenant row asks for.
 *
 * A row with no `agent_profile` (written before the column existed) is DR Web
 * Studio, the only tenant there was. An unknown name returns null rather than
 * falling back: answering a dive center's customers with a web studio's
 * prices is worse than handing the conversation to a person, which is what
 * the caller does with null.
 */
export function profileFor(
  tenant: Pick<Tenant, "agent_profile" | "tenant_id">,
): AgentProfile | null {
  const id = tenant.agent_profile ?? "drwebstudio"
  const profile = PROFILES[id]
  if (!profile) {
    console.error(
      `agent: tenant ${tenant.tenant_id} names unknown agent_profile "${id}"`,
    )
    return null
  }
  return profile
}
