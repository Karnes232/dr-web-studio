import "server-only"
import type Anthropic from "@anthropic-ai/sdk"
import { saveLead } from "@/lib/leads/saveLead"
import type { AgentKnowledge } from "@/sanity/queries/agent/agentKnowledge"
import type { Conversation, Tenant } from "@/lib/whatsapp/store"

/**
 * The agent's tools.
 *
 * `list_services` was removed after measurement: the knowledge base already
 * contains the same catalogue, and every tool call costs a second Claude
 * request that re-sends the entire cached prefix — it doubled the price of any
 * turn where it fired, to re-state text the model could already read.
 *
 * Deliberately NO `compute_quote`. The agent may repeat published package
 * prices verbatim but must never calculate one for a specific project — a
 * custom-price question escalates instead. Quoting is a later, additive phase:
 * `src/lib/planner/computeEstimate.ts` is already pure and tested and can be
 * wrapped in a tool whenever that decision changes.
 */

export interface ToolContext {
  tenant: Tenant
  conversation: Conversation
  knowledge: AgentKnowledge
  waId: string
  profileName?: string
  locale: string
}

/**
 * Strip tool-call markup the model sometimes emits inside argument strings.
 *
 * A real turn stored this as a `timeline` value:
 *   "</parameter>\n<parameter name=\"notes\">Centro de buceo..."
 *
 * `strict: true` does not catch it — the value IS a string, just a malformed
 * one — so it has to be scrubbed at the boundary before it reaches the database.
 */
export function cleanToolString(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined
  const cleaned = raw
    .replace(/<\/?(?:antml:)?(?:parameter|invoke|function_calls)[^>]*>/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
  return cleaned || undefined
}

export interface ToolOutcome {
  /** Text handed back to the model as the tool result. */
  result: string
  /** Set when the agent must stop replying — a human is taking over. */
  escalated?: { reason: string; urgency: string }
  /** Set the first time a lead row is created, so the conversation can be
   *  linked to it and later calls update rather than duplicate. */
  leadId?: string
}

// `strict: true` guarantees the arguments validate against the schema, so the
// handlers below can trust their shape.
export const TOOLS: Anthropic.Tool[] = [
  {
    name: "save_lead",
    description:
      "Record the customer as a lead. Call ONCE, when you first know their name and roughly what they want. Do not call it again on later turns just to add detail — every call costs a full extra request. Only call again if something material changes, such as a different service or a firm deadline.",
    strict: true,
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Customer's name." },
        company: {
          type: "string",
          description: "Their business name, or empty string.",
        },
        email: {
          type: "string",
          description: "Email if given, else empty string.",
        },
        service_key: {
          type: "string",
          description:
            "The matching key from the service catalogue in your knowledge base, or empty string if unclear. Never invent one.",
        },
        project_type: {
          type: "string",
          description: "Short plain description of what they want.",
        },
        timeline: {
          type: "string",
          description: "When they need it, or empty string.",
        },
        notes: {
          type: "string",
          description: "Anything else useful for the follow-up call.",
        },
      },
      required: [
        "name",
        "company",
        "email",
        "service_key",
        "project_type",
        "timeline",
        "notes",
      ],
      additionalProperties: false,
    },
  },
  {
    name: "escalate_to_human",
    description:
      "Hand the conversation to James. Call for custom pricing questions, existing projects, invoices, complaints, direct requests for him, or when you are stuck. After calling this, say briefly that James will pick it up, and stop.",
    strict: true,
    input_schema: {
      type: "object",
      properties: {
        reason: {
          type: "string",
          description: "Why this needs a human, one line.",
        },
        urgency: {
          type: "string",
          enum: ["low", "normal", "high"],
          description: "high only if the customer is upset or time-critical.",
        },
      },
      required: ["reason", "urgency"],
      additionalProperties: false,
    },
  },
]

export async function runTool(
  name: string,
  input: Record<string, unknown>,
  ctx: ToolContext,
): Promise<ToolOutcome> {
  switch (name) {
    case "save_lead": {
      const str = (k: string) => cleanToolString(input[k])

      // Reuses the same helper the web forms use, so a WhatsApp lead inherits
      // the Resend fallback and is exactly as durable as a form submission.
      // One lead per conversation. Without this the agent inserts a fresh row
      // every time it refines its understanding — a real 9-turn conversation
      // produced six duplicate leads for one prospect.
      const id = await saveLead({
        source: "whatsapp",
        leadId: ctx.conversation.lead_id ?? undefined,
        tenantId: ctx.tenant.tenant_id,
        name: str("name") ?? ctx.profileName,
        phone: ctx.waId,
        company: str("company"),
        email: str("email"),
        locale: ctx.locale,
        serviceKey: str("service_key"),
        projectType: str("project_type"),
        timeline: str("timeline"),
        message: str("notes"),
      })

      return {
        result: id
          ? "Lead saved. Do not call save_lead again unless you learn something materially new."
          : "Lead could not be saved to the database; it has been emailed to the team instead. Continue the conversation normally.",
        leadId: ctx.conversation.lead_id ? undefined : (id ?? undefined),
      }
    }

    case "escalate_to_human": {
      const reason = String(input.reason ?? "unspecified")
      const urgency = String(input.urgency ?? "normal")
      return {
        result:
          "Escalated. Tell the customer briefly that James will pick this up, then stop.",
        escalated: { reason, urgency },
      }
    }

    default:
      return { result: `Unknown tool: ${name}` }
  }
}
