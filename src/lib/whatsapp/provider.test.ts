import { readFileSync } from "node:fs"
import path from "node:path"
import { createHmac } from "node:crypto"
import { describe, expect, it } from "vitest"
import { normalizeKapsoWebhook } from "./provider"
import { isValidKapsoSignature } from "./verify"

const fixture = (name: string) =>
  readFileSync(path.join(__dirname, "__fixtures__", name), "utf8")

const inboundRaw = fixture("inbound-text.json")
const statusRaw = fixture("status-failed.json")
const batchedRaw = fixture("batched.json")
const usernameRaw = fixture("inbound-username.json")

describe("normalizeKapsoWebhook — inbound", () => {
  it("maps an inbound text message onto the neutral shape", () => {
    const event = normalizeKapsoWebhook(
      JSON.parse(inboundRaw),
      "whatsapp.message.received",
    )

    expect(event.kind).toBe("message")
    if (event.kind !== "message") return
    const m = event.message

    expect(m.providerMessageId).toBe(
      "wamid.HBgNMTgyOTU1NTEyMzQVAgASGBQzQUJDRA==",
    )
    expect(m.waId).toBe("18295551234")
    expect(m.text).toBe("Hola, cuanto cuesta una pagina web?")
    expect(m.type).toBe("text")
    // The tenant key.
    expect(m.phoneNumberId).toBe("647015955153740")
    expect(m.isNewConversation).toBe(true)
    expect(m.providerConversationId).toBe("conv_abc123")
  })

  it("reads the profile name off the conversation, not the message", () => {
    const event = normalizeKapsoWebhook(JSON.parse(inboundRaw))
    if (event.kind !== "message") throw new Error("expected a message")
    expect(event.message.profileName).toBe("Ana Gomez")
  })

  it("parses the string-of-unix-seconds timestamp", () => {
    const event = normalizeKapsoWebhook(JSON.parse(inboundRaw))
    if (event.kind !== "message") throw new Error("expected a message")
    expect(event.message.timestamp.toISOString()).toBe(
      new Date(1730092800 * 1000).toISOString(),
    )
  })

  it("keeps the business-scoped user id, since phone is not always present", () => {
    const event = normalizeKapsoWebhook(JSON.parse(inboundRaw))
    if (event.kind !== "message") throw new Error("expected a message")
    expect(event.message.businessScopedUserId).toBe("US.13491208655302741918")
  })
})

describe("normalizeKapsoWebhook — status", () => {
  it("takes the LAST entry of the cumulative statuses array", () => {
    const event = normalizeKapsoWebhook(
      JSON.parse(statusRaw),
      "whatsapp.message.failed",
    )

    expect(event.kind).toBe("status")
    if (event.kind !== "status") return
    // `sent` is replayed in the same array; `failed` is the current state.
    expect(event.status.status).toBe("failed")
    expect(event.status.providerMessageId).toBe("wamid.OUTBOUND123")
  })

  it("surfaces error 131047 so the caller can fall back to a template", () => {
    const event = normalizeKapsoWebhook(JSON.parse(statusRaw))
    if (event.kind !== "status") throw new Error("expected a status")
    expect(event.status.errorCode).toBe(131047)
    expect(event.status.errorMessage).toContain("24 hours")
  })

  it("classifies an outbound payload as a status even with no event header", () => {
    const event = normalizeKapsoWebhook(JSON.parse(statusRaw), null)
    expect(event.kind).toBe("status")
  })
})

describe("normalizeKapsoWebhook — rejections", () => {
  it("ignores batched deliveries rather than mis-parsing them", () => {
    const event = normalizeKapsoWebhook(JSON.parse(batchedRaw))
    expect(event.kind).toBe("ignored")
    if (event.kind !== "ignored") return
    expect(event.reason).toContain("batched")
  })

  it("ignores a payload with no tenant key", () => {
    const body = JSON.parse(inboundRaw)
    delete body.phone_number_id
    delete body.conversation.phone_number_id
    const event = normalizeKapsoWebhook(body)
    expect(event.kind).toBe("ignored")
  })

  it("ignores junk without throwing", () => {
    expect(normalizeKapsoWebhook(null).kind).toBe("ignored")
    expect(normalizeKapsoWebhook("nope").kind).toBe("ignored")
    expect(normalizeKapsoWebhook({}).kind).toBe("ignored")
    expect(normalizeKapsoWebhook({ message: {} }).kind).toBe("ignored")
  })
})

describe("isValidKapsoSignature", () => {
  const secret = "test-webhook-secret"
  const sign = (body: string) =>
    createHmac("sha256", secret).update(body).digest("hex")

  it("accepts a correct hex HMAC over the raw body", () => {
    expect(isValidKapsoSignature(inboundRaw, sign(inboundRaw), secret)).toBe(
      true,
    )
  })

  it("rejects a missing or empty signature", () => {
    expect(isValidKapsoSignature(inboundRaw, null, secret)).toBe(false)
    expect(isValidKapsoSignature(inboundRaw, "", secret)).toBe(false)
  })

  it("rejects a signature made with the wrong secret", () => {
    const wrong = createHmac("sha256", "other").update(inboundRaw).digest("hex")
    expect(isValidKapsoSignature(inboundRaw, wrong, secret)).toBe(false)
  })

  it("rejects when the body was tampered with after signing", () => {
    const sig = sign(inboundRaw)
    const tampered = inboundRaw.replace("Ana Gomez", "Mallory")
    expect(isValidKapsoSignature(tampered, sig, secret)).toBe(false)
  })

  it("rejects a re-serialised body — signatures cover exact bytes", () => {
    // This is the trap in Kapso's own docs: JSON.stringify(parsed) changes
    // whitespace and key order, so it must NOT validate.
    const reserialised = JSON.stringify(JSON.parse(inboundRaw))
    expect(reserialised).not.toBe(inboundRaw)
    expect(isValidKapsoSignature(reserialised, sign(inboundRaw), secret)).toBe(
      false,
    )
  })

  it("does not throw on a signature of the wrong length", () => {
    expect(isValidKapsoSignature(inboundRaw, "abc", secret)).toBe(false)
  })
})

/**
 * WhatsApp usernames. Copied verbatim from the Kapso delivery log for the
 * first real message to +1 204-809-3662 — a payload with NO `message.from`
 * and NO `conversation.phone_number`, which the normaliser used to drop as
 * "no sender" while returning 200, so the provider recorded a successful
 * delivery and the customer got silence.
 */
describe("normalizeKapsoWebhook — username-only sender", () => {
  const event = normalizeKapsoWebhook(
    JSON.parse(usernameRaw),
    "whatsapp.message.received",
  )

  it("accepts a sender that has no phone number", () => {
    expect(event.kind).toBe("message")
  })

  it("keys the conversation on the business-scoped user id", () => {
    if (event.kind !== "message") throw new Error("expected a message")
    expect(event.message.waId).toBe("DO.1757134975438075")
    expect(event.message.businessScopedUserId).toBe("DO.1757134975438075")
  })

  it("falls back to the username for the profile name", () => {
    if (event.kind !== "message") throw new Error("expected a message")
    // There is no `contact_name` on a username-only conversation, and the
    // agent uses this as the lead's name.
    expect(event.message.profileName).toBe("Jameskarnes")
  })

  it("still reads the text, tenant key and message id", () => {
    if (event.kind !== "message") throw new Error("expected a message")
    expect(event.message.text).toBe("Hello, I am interested in a website")
    expect(event.message.phoneNumberId).toBe("1262180810319552")
    expect(event.message.providerMessageId).toMatch(/^wamid\./)
    expect(event.message.isNewConversation).toBe(true)
  })

  it("still ignores a payload with no identity of any kind", () => {
    const body = JSON.parse(usernameRaw)
    delete body.conversation.business_scoped_user_id
    delete body.conversation.username
    const none = normalizeKapsoWebhook(body, "whatsapp.message.received")
    expect(none.kind).toBe("ignored")
  })
})
