import "server-only"
import type Anthropic from "@anthropic-ai/sdk"
import { saveLead } from "@/lib/leads/saveLead"
import type { AgentKnowledge } from "@/sanity/queries/agent/agentKnowledge"
import type { Conversation, Tenant } from "@/lib/whatsapp/store"

/**
 * The agent's tools.
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

export interface ToolOutcome {
  /** Text handed back to the model as the tool result. */
  result: string
  /** Set when the agent must stop replying — a human is taking over. */
  escalated?: { reason: string; urgency: string }
}

// `strict: true` guarantees the arguments validate against the schema, so the
// handlers below can trust their shape.
export const TOOLS: Anthropic.Tool[] = [
  {
    name: "list_services",
    description:
      "List the services offered, with their starting prices and typical timelines. Use when the customer asks what you do, or to check a service exists before discussing it. Starting prices are NOT quotes.",
    strict: true,
    input_schema: {
      type: "object",
      properties: {},
      required: [],
      additionalProperties: false,
    },
  },
  {
    name: "save_lead",
    description:
      "Record the customer as a lead. Call once you know their name and roughly what they want. Safe to call again later with more detail.",
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
            "The matching key from list_services, or empty string if unclear. Never invent one.",
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
    case "list_services": {
      const lines = ctx.knowledge.plannerServices.map(
        s =>
          `${s.key}: ${ctx.locale === "en" ? s.title.en : s.title.es} — starting at $${s.basePrice}, ${ctx.locale === "en" ? s.timeline.en : s.timeline.es}`,
      )
      return {
        result:
          lines.join("\n") +
          "\n\nThese are STARTING prices, not quotes for a specific project.",
      }
    }

    case "save_lead": {
      const str = (k: string) =>
        typeof input[k] === "string" && (input[k] as string).trim()
          ? (input[k] as string).trim()
          : undefined

      // Reuses the same helper the web forms use, so a WhatsApp lead inherits
      // the Resend fallback and is exactly as durable as a form submission.
      const id = await saveLead({
        source: "whatsapp",
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
          ? "Lead saved."
          : "Lead could not be saved to the database; it has been emailed to the team instead. Continue the conversation normally.",
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
