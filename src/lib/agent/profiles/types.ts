import type Anthropic from "@anthropic-ai/sdk"
import type { Tenant } from "@/lib/whatsapp/store"

/**
 * Everything that makes the agent one business's agent rather than another's.
 *
 * The routing has always been multi-tenant; the agent itself was DR Web Studio
 * all the way through — its persona, knowledge, tools and the name of the
 * person it hands off to. A profile gathers those so a second business is a
 * second profile, not a fork.
 *
 * Profiles live in CODE, not on the tenant row, because most of what they
 * produce is inside the cached prompt prefix (tools → persona → knowledge).
 * One stray byte there costs a cache write on every conversation, so it is
 * changed by a reviewed deploy, never by editing a database row.
 */
export interface AgentProfile {
  id: string

  /** Loads (cached) knowledge for one request. */
  loadKnowledge(): Promise<LoadedKnowledge>

  /** system[0]. Byte-stable per tenant. */
  persona(tenant: Tenant): string

  /** Tool definitions, frozen; first in the cached prefix. */
  tools: Anthropic.Tool[]

  /** What `escalate_to_human` tells the model to say before it stops. */
  escalatedResult: string

  /** For the clock line in the volatile system message. */
  timezone: string
  clockLabel: string

  /**
   * Said when the agent picks a conversation back up after a person or a
   * pause. Must name who the assistant is not (the human).
   */
  resumedNote: string

  /** What the customer hears when the tenant's spend cap is reached. */
  capReachedNotice(business: string, locale: string): string

  /**
   * Labels for the lead fields in the new-lead email. The tool fields are
   * shared, so a dive center's "company" is the customer's hotel.
   */
  leadLabels: {
    company: string
    service: string
    timeline: string
    notes: string
  }

  /** New-lead email footer: how to take the conversation over. */
  takeoverLines(tenant: Tenant): string[]

  /** Escalation email: how to reply to this customer. */
  replyLines(tenant: Tenant, waId: string, byPhone: boolean): string[]
}

/** The knowledge for one request, already shaped for the prompt. */
export interface LoadedKnowledge {
  /**
   * system[1]: the knowledge block for a conversation locale. Must be
   * byte-identical across calls with the same input — it is the cache key.
   */
  block(locale: string): string
  /** Valid `service_key` values for save_lead. Anything else is dropped. */
  catalogue: CatalogueEntry[]
}

export interface CatalogueEntry {
  key: string
  label: string
}
