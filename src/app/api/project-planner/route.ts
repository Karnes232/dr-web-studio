import ProjectPlannerSubmissionEmail, {
  type PlannerEstimateItem,
} from "@/emails/ProjectPlannerSubmissionEmail"
import { clampString, verifyBotpoisonSolution } from "@/lib/botpoison-verify"
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
      return NextResponse.json({ error: "Verification failed" }, { status: 403 })
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
    const timeline = clampString(body.timeline, MAX_FIELD)
    const rush = body.rush === true
    const addons = clampStringArray(body.addons, MAX_ARRAY_ITEMS, MAX_FIELD)
    const design = clampString(body.design, MAX_FIELD)
    const size = clampString(body.size, MAX_FIELD)
    const content = clampString(body.content, MAX_FIELD)
    const references = clampStringArray(body.references, MAX_ARRAY_ITEMS, MAX_FIELD)

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

    const cachedEmail = await getContactEmail()
    const toEmail = cachedEmail?.trim() || "james@dr-webstudio.com"

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

    const res = await resend.emails.send({
      from: "Dr Web Studio <james@dr-webstudio.com>",
      to: [toEmail],
      replyTo: email,
      subject: `Project planner: ${name}`,
      html: emailHtml,
    })

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
