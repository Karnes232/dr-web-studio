import ContactFormEmail from "@/emails/ContactFormEmail"
import { clampString, verifyBotpoisonSolution } from "@/lib/botpoison-verify"
import { client } from "@/sanity/lib/client"
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
      return NextResponse.json({ error: "Verification failed" }, { status: 403 })
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
    const budget = budgetRaw.startsWith("$") ? budgetRaw : budgetRaw ? `$${budgetRaw}` : ""
    const timeline = clampString(body.timeline, MAX_FIELD_LENGTH)

    const emailData = await client.fetch<{ email?: string }>(`
      *[_type == "generalLayout"][0] {
        email
      }
    `)

    const toEmail =
      emailData?.email?.trim() || "james@dr-webstudio.com"

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

    const res = await resend.emails.send({
      from: "Dr Web Studio <james@dr-webstudio.com>",
      to: [toEmail],
      replyTo: email,
      subject: `New contact: ${name}`,
      html: emailHtml,
    })

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
