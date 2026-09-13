import "server-only"

/**
 * Outbound WhatsApp messages.
 *
 * Deliberately plain `fetch` and deliberately Meta-shaped. Kapso proxies Meta's
 * Cloud API with identical request bodies and responses, so writing to the Meta
 * contract keeps a future move to `graph.facebook.com/v24.0/{id}/messages` a
 * base-URL and auth-header change rather than a rewrite. The first-party SDK
 * would buy typed builders for interactive payloads we do not send yet.
 */

const DEFAULT_BASE = "https://api.kapso.ai/meta/whatsapp/v24.0"

export type SendResult =
  | { ok: true; messageId: string }
  | { ok: false; errorCode?: number; errorMessage: string }

/** Meta error code for "outside the 24-hour customer service window". */
export const WINDOW_EXPIRED = 131047

/**
 * A business-scoped user id, e.g. `DO.1757134975438075` — a two-letter country
 * prefix, a dot, then digits. Phone numbers never contain a dot, so the shape
 * is an unambiguous discriminator.
 *
 * This matters because `to` is **phone-numbers-only**: a BSUID must be sent as
 * `recipient` instead, and Meta rejects it in `to`. Detecting from the value
 * rather than threading a flag through every caller means a reply composed from
 * a stored `conversations.wa_id` is addressed correctly too, with no extra
 * column to keep in sync.
 */
export const isBusinessScopedUserId = (id: string): boolean =>
  /^[A-Za-z]{2}\.\d+$/.test(id)

/**
 * Address a recipient the way Meta expects for its identity type.
 *
 * `recipient_type: "individual"` belongs to the phone-number form only; the
 * documented BSUID body carries neither it nor `to`.
 */
function addressed(id: string): Record<string, unknown> {
  return isBusinessScopedUserId(id)
    ? { recipient: id }
    : { recipient_type: "individual", to: id }
}

function config() {
  return {
    base: process.env.KAPSO_API_BASE || DEFAULT_BASE,
    apiKey: process.env.KAPSO_API_KEY,
  }
}

async function post(
  phoneNumberId: string,
  payload: Record<string, unknown>,
): Promise<SendResult> {
  const { base, apiKey } = config()
  if (!apiKey) {
    return { ok: false, errorMessage: "KAPSO_API_KEY is not configured" }
  }

  try {
    const res = await fetch(`${base}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        ...payload,
      }),
    })

    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>

    if (!res.ok) {
      // Meta's error envelope passes straight through Kapso.
      const error = (json.error ?? {}) as Record<string, unknown>
      return {
        ok: false,
        errorCode: typeof error.code === "number" ? error.code : undefined,
        errorMessage:
          (typeof error.message === "string" && error.message) ||
          `HTTP ${res.status}`,
      }
    }

    const messages = json.messages as { id?: string }[] | undefined
    const messageId = messages?.[0]?.id
    if (!messageId) {
      return { ok: false, errorMessage: "no message id in response" }
    }

    return { ok: true, messageId }
  } catch (error) {
    return { ok: false, errorMessage: String(error) }
  }
}

/**
 * Free-form text. Only valid inside the 24-hour customer service window —
 * outside it this fails with {@link WINDOW_EXPIRED} and the caller must fall
 * back to an approved template.
 */
export function sendText(
  phoneNumberId: string,
  to: string,
  body: string,
): Promise<SendResult> {
  return post(phoneNumberId, {
    ...addressed(to),
    type: "text",
    text: { body },
  })
}

export function sendTemplate(
  phoneNumberId: string,
  to: string,
  name: string,
  languageCode: string,
  components?: unknown[],
): Promise<SendResult> {
  return post(phoneNumberId, {
    ...addressed(to),
    type: "template",
    template: {
      name,
      language: { code: languageCode },
      ...(components ? { components } : {}),
    },
  })
}
