import { describe, expect, it, vi } from "vitest"

vi.mock("@/lib/leads/saveLead", () => ({ saveLead: vi.fn() }))
vi.mock("@/sanity/queries/agent/agentKnowledge", () => ({
  getAgentKnowledge: vi.fn(),
}))
vi.mock("@/sanity/queries/agent/grandbayKnowledge", () => ({
  getGrandBayKnowledge: vi.fn(),
}))

import {
  escalationEmail,
  newLeadEmail,
  resumedEmail,
  waitingOnYouEmail,
} from "./notifications"
import { drwebstudio } from "./profiles/drwebstudio"
import { grandbay } from "./profiles/grandbay"
import type { Tenant } from "@/lib/whatsapp/store"

const dr = {
  tenant_id: "drwebstudio",
  business_name: "DR Web Studio",
  escalation_email: "james@dr-webstudio.com",
} as unknown as Tenant

const lead = {
  name: "Ana Gomez",
  email: "ana@example.com",
  company: "Café Ana",
  service_key: "landing-page",
  project_type: "Landing page",
  timeline: "November",
  message: "Bilingual please",
}

/**
 * DR's emails, word for word as run.ts composed them before profiles. The
 * expected strings are the old code's literals; a change here is a change to
 * what James receives.
 */
describe("DR Web Studio emails (unchanged)", () => {
  it("new lead", () => {
    const email = newLeadEmail({
      tenant: dr,
      profile: drwebstudio,
      customer: { waId: "18295551234", profileName: "Ana" },
      lead,
    })
    expect(email).toEqual({
      from: "Dr Web Studio <james@dr-webstudio.com>",
      to: ["james@dr-webstudio.com"],
      subject: "New WhatsApp lead: Ana Gomez",
      // No blank lines: the old code's `.filter(Boolean)` drops the ""
      // separators along with the empty fields. Kept as it was.
      text: [
        "The WhatsApp agent saved a new lead.",
        "Name:     Ana Gomez",
        "Contact:  +18295551234",
        "Email:    ana@example.com",
        "Company:  Café Ana",
        "Service:  landing-page",
        "Timeline: November",
        "Notes:    Bilingual please",
        "The agent is still handling this conversation. Reply in the inbox to",
        "take it over — it will stand down automatically: https://inbox.kapso.ai",
      ].join("\n"),
    })
  })

  it("escalation, phone contact", () => {
    const email = escalationEmail({
      tenant: dr,
      profile: drwebstudio,
      customer: { waId: "18295551234", profileName: "Ana" },
      reason: "custom quote",
      urgency: "normal",
      history: [
        { role: "user", content: "How much for 12 pages?" },
        { role: "assistant", content: "Let me get James." },
      ],
    })
    expect(email).toEqual({
      from: "Dr Web Studio <james@dr-webstudio.com>",
      to: ["james@dr-webstudio.com"],
      subject: "WhatsApp handoff (normal): Ana",
      text: [
        "The WhatsApp agent handed a conversation over.",
        "",
        "Reason:   custom quote",
        "Urgency:  normal",
        "Customer: Ana (+18295551234)",
        "",
        "Reply as DR Web Studio:  https://inbox.kapso.ai",
        "Reply from your own phone:  https://wa.me/18295551234",
        "  (that one reaches them from your personal number, not the",
        "   business number they have been talking to — prefer the inbox)",
        "",
        "The agent has stopped replying to this conversation.",
        "",
        "--- transcript ---\nCustomer: How much for 12 pages?\nAgent: Let me get James.",
      ].join("\n"),
    })
  })

  it("escalation, username-only contact", () => {
    const email = escalationEmail({
      tenant: dr,
      profile: drwebstudio,
      customer: { waId: "DO.1757134975438075" },
      reason: "r",
      urgency: "high",
      history: [],
    })
    expect(email?.text).toContain("Customer: unknown (@DO.1757134975438075)")
    expect(email?.text).toContain("the inbox is the ONLY way to reach them")
    expect(email?.text).not.toContain("wa.me")
  })

  it("sends nothing when the tenant has no escalation address", () => {
    const none = { ...dr, escalation_email: null } as Tenant
    expect(
      newLeadEmail({
        tenant: none,
        profile: drwebstudio,
        customer: { waId: "1" },
        lead,
      }),
    ).toBeNull()
  })
})

describe("per-tenant envelope", () => {
  it("uses the tenant's sender, reply-to and inbox", () => {
    const t = {
      ...dr,
      email_from:
        "Grand Bay of the Sea WhatsApp Assistant <agent@dr-webstudio.com>",
      email_reply_to: "james@dr-webstudio.com",
      inbox_url: "https://inbox.example.test",
    } as Tenant
    const email = newLeadEmail({
      tenant: t,
      profile: drwebstudio,
      customer: { waId: "1" },
      lead,
    })
    expect(email?.from).toBe(
      "Grand Bay of the Sea WhatsApp Assistant <agent@dr-webstudio.com>",
    )
    expect(email?.replyTo).toBe("james@dr-webstudio.com")
    expect(email?.text).toContain("https://inbox.example.test")
  })
})

describe("chat resumed email", () => {
  const base = {
    tenant: dr,
    profile: drwebstudio,
    customer: { waId: "18495551234", profileName: "Isabel" },
    customerText: "Hola James, ya lo pensé",
    agentReply: "¡Hola Isabel! Soy el asistente de DR Web Studio (no James)…",
  }

  it("says the agent took a chat the person had taken over", () => {
    const email = resumedEmail({ ...base, previousStatus: "handed-off" })
    expect(email?.to).toEqual(["james@dr-webstudio.com"])
    expect(email?.subject).toBe("WhatsApp chat resumed: Isabel")
    expect(email?.text).toContain("You had taken this chat over")
    expect(email?.text).toContain("They wrote:\nHola James, ya lo pensé")
    expect(email?.text).toContain("The agent replied:\n¡Hola Isabel!")
    expect(email?.text).toContain(
      "Reply as DR Web Studio:  https://inbox.kapso.ai",
    )
    expect(email?.text).toContain(
      "Reply from your own phone:  https://wa.me/18495551234",
    )
  })

  it("says the agent took back its own escalation", () => {
    const email = resumedEmail({ ...base, previousStatus: "awaiting-human" })
    expect(email?.text).toContain("The agent had handed this chat to you")
  })

  it("does not claim a reply that was never delivered", () => {
    const email = resumedEmail({
      ...base,
      previousStatus: "handed-off",
      agentReply: null,
    })
    expect(email?.text).toContain("The agent did not send a reply.")
    expect(email?.text).not.toContain("The agent replied")
  })

  it("sends nothing without an escalation address", () => {
    const none = { ...dr, escalation_email: null } as Tenant
    expect(
      resumedEmail({ ...base, tenant: none, previousStatus: "handed-off" }),
    ).toBeNull()
  })

  it("carries no DR wording for Grand Bay", () => {
    const gb = {
      tenant_id: "grandbay",
      business_name: "Grand Bay of the Sea",
      display_phone: "+1 829-374-1344",
      escalation_email: "dive@example.com",
    } as unknown as Tenant
    const email = resumedEmail({
      ...base,
      tenant: gb,
      profile: grandbay,
      customerText: "Do you have space tomorrow?",
      agentReply: "Hi! I'm the dive center's assistant.",
      previousStatus: "awaiting-human",
    })
    expect(email?.text).not.toMatch(/DR Web Studio|inbox\.kapso|James/)
    expect(email?.text).toContain("Grand Bay of the Sea WhatsApp")
  })
})

describe("chat is yours email", () => {
  const base = {
    tenant: dr,
    profile: drwebstudio,
    customer: { waId: "18495551234", profileName: "Isabel" },
    customerText: "Hola James",
  }

  it("tells James when the agent would step back in, in DR time", () => {
    const email = waitingOnYouEmail({
      ...base,
      // 16:46 UTC is 12:46 in Santo Domingo (UTC-4, no DST).
      resumesAt: new Date("2026-10-18T16:46:00Z"),
    })
    expect(email?.subject).toBe("WhatsApp: Isabel wrote — chat is yours")
    expect(email?.text).toContain("The agent is staying quiet.")
    expect(email?.text).toContain("They wrote:\nHola James")
    expect(email?.text).toContain(
      "picks the chat back up from Oct 18, 2026, 12:46 PM (America/Santo_Domingo)",
    )
    expect(email?.text).toContain("reopened the 24-hour window")
    expect(email?.text).toContain(
      "Reply as DR Web Studio:  https://inbox.kapso.ai",
    )
  })

  it("says so when the agent never takes the chat back", () => {
    const email = waitingOnYouEmail({ ...base, resumesAt: null })
    expect(email?.text).toContain("will not pick this chat back up on its own")
  })

  it("is never sent for a profile whose staff phones already ring", () => {
    expect(
      waitingOnYouEmail({ ...base, profile: grandbay, resumesAt: null }),
    ).toBeNull()
  })

  it("sends nothing without an escalation address", () => {
    const none = { ...dr, escalation_email: null } as Tenant
    expect(
      waitingOnYouEmail({ ...base, tenant: none, resumesAt: null }),
    ).toBeNull()
  })
})
