import type Anthropic from "@anthropic-ai/sdk"

/**
 * Grand Bay's tool definitions.
 *
 * Same names and the same strict schema as DR's, so the shared `runTool`
 * handler (lib/agent/tools.ts) serves both and the leads table stays one
 * shape. Only the descriptions differ: they tell the model what a dive
 * center's lead looks like — the "company" field holds the customer's hotel,
 * "project_type" the activity and party size, "timeline" their dates.
 *
 * Frozen like DR's: these are the first bytes of Grand Bay's cached prefix.
 */
export const GRANDBAY_TOOLS: Anthropic.Tool[] = [
  {
    name: "save_lead",
    description:
      "Record the customer as a lead. Call ONCE, as soon as you know which activity they are interested in. Do not call it again on later turns just to add detail — every call costs a full extra request. Only call again if something material changes, such as a different activity or new dates.",
    strict: true,
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Customer's name." },
        company: {
          type: "string",
          description: "The hotel they are staying at, or empty string.",
        },
        email: {
          type: "string",
          description: "Email if given, else empty string.",
        },
        service_key: {
          type: "string",
          description:
            "The matching key from the catalogue in your knowledge base (e.g. course:openwater, trip:catalina, shark-dive), or empty string if unclear. Never invent one.",
        },
        project_type: {
          type: "string",
          description:
            "The activity and the party, e.g. '2 divers + 1 snorkeler'.",
        },
        timeline: {
          type: "string",
          description: "Their dates or length of stay, or empty string.",
        },
        notes: {
          type: "string",
          description:
            "Certification level, experience, language, and anything else the team should know.",
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
      "Hand the conversation to the Grand Bay team, who continue in this same chat. Call for prices you may not give, existing bookings, changes, refunds, complaints, medical questions, direct requests for a person, or when you are stuck. After calling this, say briefly that a team member will continue here, and stop.",
    strict: true,
    input_schema: {
      type: "object",
      properties: {
        reason: {
          type: "string",
          description: "Why this needs a person, one line.",
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
