import ContactFormEmail from "@/emails/ContactFormEmail"
import { clampString, verifyBotpoisonSolution } from "@/lib/botpoison-verify"
import { saveLead } from "@/lib/leads/saveLead"
import { isSpammySubmission } from "@/lib/spam"
import { getContactEmail } from "@/sanity/queries/layout/generalLayout"
import { render } from "@react-email/render"
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const MAX_MESSAGE_LENGTH = 10_000
const MAX_FIELD_LENGTH = 500

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

    const name = clampString(body.name, MAX_FIELD_LENGTH)
    const email = clampString(body.email, MAX_FIELD_LENGTH)
    const message = clampString(body.message, MAX_MESSAGE_LENGTH)

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 },
      )
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRe.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    const company = clampString(body.company, MAX_FIELD_LENGTH)
    const phone = clampString(body.phone, MAX_FIELD_LENGTH)
    const projectType = clampString(body.projectType, MAX_FIELD_LENGTH)
    const budgetRaw = clampString(body.budget, MAX_FIELD_LENGTH)
    const budget = budgetRaw.startsWith("$")
      ? budgetRaw
      : budgetRaw
        ? `$${budgetRaw}`
        : ""
    const timeline = clampString(body.timeline, MAX_FIELD_LENGTH)
    const locale = clampString(body.locale, 8) || undefined

    // Content filtering, after every field is clamped and before any outbound
    // call. BotPoison already passed — it is proof-of-work, so a headless
    // browser clears it every time; this is the layer that reads what was
    // actually typed.
    const verdict = isSpammySubmission({ name, company, message })
    if (verdict.spam) {
      // Stored, never emailed, and answered with the same 200 a real
      // submission gets: the bot learns nothing about what tripped the filter.
      // Nothing is lost either — it is reviewable in the leads table.
      console.warn(
        `contact: flagged as spam (score ${verdict.score}): ${verdict.reasons.join("; ")}`,
      )
      await saveLead({
        source: "contact-form",
        status: "spam",
        name,
        email,
        phone,
        company,
        message,
        projectType,
        budgetBand: budget,
        timeline,
        locale,
      })
      return NextResponse.json({ message: "Sent" }, { status: 200 })
    }

    const cachedEmail = await getContactEmail()
    const toEmail = cachedEmail?.trim() || "james@dr-webstudio.com"

    const emailHtml = await render(
      ContactFormEmail({
        name,
        email,
        company,
        phone,
        projectType,
        budget,
        timeline,
        message,
      }),
    )

    // Persist alongside the email, in parallel so it costs no latency.
    // saveLead never throws — email stays the path of record.
    const [, res] = await Promise.all([
      saveLead({
        source: "contact-form",
        name,
        email,
        phone,
        company,
        message,
        projectType,
        budgetBand: budget,
        timeline,
        locale,
      }),
      resend.emails.send({
        from: "Dr Web Studio <james@dr-webstudio.com>",
        to: [toEmail],
        replyTo: email,
        subject: `New contact: ${name}`,
        html: emailHtml,
      }),
    ])

    if (res.error) {
      console.error("Resend contact error:", res.error)
      return NextResponse.json(
        { error: "Failed to send message", details: res.error },
        { status: 500 },
      )
    }

    return NextResponse.json({ message: "Sent" }, { status: 200 })
  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json(
      { error: "Failed to send message", details: String(error) },
      { status: 500 },
    )
  }
}
