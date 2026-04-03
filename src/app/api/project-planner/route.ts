import ProjectPlannerSubmissionEmail from "@/emails/ProjectPlannerSubmissionEmail"
import { clampString, verifyBotpoisonSolution } from "@/lib/botpoison-verify"
import { client } from "@/sanity/lib/client"
import { render } from "@react-email/render"
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const MAX_FIELD = 500
const MAX_MESSAGE = 10_000
const MAX_ARRAY_ITEMS = 40
const MAX_PAGES = 500

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

function parsePages(value: unknown): number | null {
  const n = typeof value === "number" ? value : parseInt(String(value), 10)
  if (!Number.isFinite(n) || n < 1 || n > MAX_PAGES) return null
  return n
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

    const pages = parsePages(body.pages)
    if (pages === null) {
      return NextResponse.json({ error: "Invalid pages value" }, { status: 400 })
    }

    const company = clampString(body.company, MAX_FIELD)
    const phone = clampString(body.phone, MAX_FIELD)
    const message = clampString(body.message, MAX_MESSAGE)
    const websiteType = clampString(body.websiteType ?? body.projectType, MAX_FIELD)
    const designStyle = clampString(body.designStyle, MAX_FIELD)
    const budget = clampString(body.budget, MAX_FIELD)
    const timeline = clampString(body.timeline, MAX_FIELD)
    const contentStatus = clampString(body.contentStatus, MAX_FIELD)
    const features = clampStringArray(body.features, MAX_ARRAY_ITEMS, MAX_FIELD)
    const languages = clampStringArray(
      body.languages,
      MAX_ARRAY_ITEMS,
      MAX_FIELD,
    )

    if (!websiteType || !designStyle || !budget || !timeline || !contentStatus) {
      return NextResponse.json(
        { error: "Incomplete project details" },
        { status: 400 },
      )
    }

    if (features.length === 0 || languages.length === 0) {
      return NextResponse.json(
        { error: "Features and languages are required" },
        { status: 400 },
      )
    }

    const emailData = await client.fetch<{ email?: string }>(`
      *[_type == "generalLayout"][0] {
        email
      }
    `)

    const toEmail =
      emailData?.email?.trim() || "james@dr-webstudio.com"

    const emailHtml = await render(
      ProjectPlannerSubmissionEmail({
        name,
        email,
        company,
        phone,
        websiteType,
        pages,
        designStyle,
        features,
        budget,
        timeline,
        contentStatus,
        languages,
        message,
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
