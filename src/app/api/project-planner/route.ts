import ProjectPlannerSubmissionEmail, {
  type PlannerEstimateItem,
} from "@/emails/ProjectPlannerSubmissionEmail"
import ProjectPlannerCustomerEmail, {
  customerEmailSubject,
} from "@/emails/ProjectPlannerCustomerEmail"
import { getPlannerConfig } from "@/sanity/queries/project-planner/plannerConfig"
import { clampString, verifyBotpoisonSolution } from "@/lib/botpoison-verify"
import { saveLead } from "@/lib/leads/saveLead"
import { getContactEmail } from "@/sanity/queries/layout/generalLayout"
import { render } from "@react-email/render"
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const MAX_FIELD = 500
const MAX_MESSAGE = 10_000
const MAX_ARRAY_ITEMS = 40

function clampStringArray(
  arr: unknown,
  maxItems: number,
  maxLen: number,
): string[] {
  if (!Array.isArray(arr)) return []
  return arr
    .filter((x): x is string => typeof x === "string")
    .map(s => clampString(s, maxLen))
    .filter(Boolean)
    .slice(0, maxItems)
}

function toNumber(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value)
  return Number.isFinite(n) ? n : 0
}

function parseItems(arr: unknown): PlannerEstimateItem[] {
  if (!Array.isArray(arr)) return []
  return arr
    .filter(
      (x): x is { key?: unknown; label?: unknown; amount?: unknown } =>
        !!x && typeof x === "object",
    )
    .map((x, i) => ({
      key: clampString(x.key, 60) || `item-${i}`,
      label: clampString(x.label, MAX_FIELD),
      amount: toNumber(x.amount),
    }))
    .filter(it => !!it.label)
    .slice(0, MAX_ARRAY_ITEMS)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const botpoisonSolution =
      typeof body._botpoison === "string" ? body._botpoison : ""

    if (!botpoisonSolution) {
      return NextResponse.json(
        { error: "Verification required" },
        { status: 400 },
      )
    }

    const verified = await verifyBotpoisonSolution(botpoisonSolution)
    if (!verified) {
      return NextResponse.json(
        { error: "Verification failed" },
        { status: 403 },
      )
    }

    const name = clampString(body.name, MAX_FIELD)
    const email = clampString(body.email, MAX_FIELD)

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      )
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRe.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    const company = clampString(body.company, MAX_FIELD)
    const message = clampString(body.message, MAX_MESSAGE)
    const service = clampString(body.service, MAX_FIELD)
    // The stable slug the planner already sends; the display title above
    // is localised and can change, this is what matches a plannerService.
    const serviceKey = clampString(body.serviceKey, MAX_FIELD)
    const locale = clampString(body.locale, 8)
    const timeline = clampString(body.timeline, MAX_FIELD)
    const rush = body.rush === true
    const addons = clampStringArray(body.addons, MAX_ARRAY_ITEMS, MAX_FIELD)
    const design = clampString(body.design, MAX_FIELD)
    const size = clampString(body.size, MAX_FIELD)
    const content = clampString(body.content, MAX_FIELD)
    const references = clampStringArray(
      body.references,
      MAX_ARRAY_ITEMS,
      MAX_FIELD,
    )

    if (!service) {
      return NextResponse.json(
        { error: "A service is required" },
        { status: 400 },
      )
    }

    const estimate = (body.estimate ?? {}) as Record<string, unknown>
    const estimateTotal = toNumber(estimate.total)
    const currencySymbol = clampString(estimate.currencySymbol, 8) || "$"
    const items = parseItems(estimate.items)

    const [cachedEmail, plannerConfig] = await Promise.all([
      getContactEmail(),
      getPlannerConfig(),
    ])
    const toEmail = cachedEmail?.trim() || "james@dr-webstudio.com"
    const customerLocale: "en" | "es" = locale === "en" ? "en" : "es"

    const emailHtml = await render(
      ProjectPlannerSubmissionEmail({
        name,
        email,
        company,
        message,
        service,
        addons,
        design,
        references,
        size,
        content,
        rush,
        timeline,
        estimateTotal,
        currencySymbol,
        items,
      }),
    )

    // Persist alongside the email, in parallel so it costs no latency.
    // saveLead never throws — email stays the path of record.
    const [, res] = await Promise.all([
      saveLead({
        source: "project-planner",
        name,
        email,
        company,
        message,
        locale: locale || undefined,
        serviceKey,
        serviceTitle: service,
        addons,
        design,
        references,
        sizeTier: size,
        content,
        rush,
        timeline,
        estimate: {
          total: estimateTotal,
          currency: clampString(estimate.currency, 8) || "USD",
          currencySymbol,
          items,
        },
      }),
      resend.emails.send({
        from: "Dr Web Studio <james@dr-webstudio.com>",
        to: [toEmail],
        replyTo: email,
        subject: `Project planner: ${name}`,
        html: emailHtml,
      }),
      // The confirmation screen promises "we've sent a copy to your inbox".
      // Honour it — but never let it fail the submission: the business
      // notification above is the one that must not be lost.
      (async () => {
        try {
          if (!plannerConfig?.confirmation) return
          const customerHtml = await render(
            ProjectPlannerCustomerEmail({
              name,
              locale: customerLocale,
              confirmation: plannerConfig.confirmation,
              contactEmail: toEmail,
              service,
              addons,
              size,
              timeline,
              estimateTotal,
              currencySymbol,
              items,
            }),
          )
          await resend.emails.send({
            from: "Dr Web Studio <james@dr-webstudio.com>",
            to: [email],
            replyTo: toEmail,
            subject: customerEmailSubject(name, customerLocale),
            html: customerHtml,
          })
        } catch (err) {
          console.error("Project planner customer copy failed:", err)
        }
      })(),
    ])

    if (res.error) {
      console.error("Resend project planner error:", res.error)
      return NextResponse.json(
        { error: "Failed to send submission", details: res.error },
        { status: 500 },
      )
    }

    return NextResponse.json({ message: "Sent" }, { status: 200 })
  } catch (error) {
    console.error("Project planner API error:", error)
    return NextResponse.json(
      { error: "Failed to send submission", details: String(error) },
      { status: 500 },
    )
  }
}
