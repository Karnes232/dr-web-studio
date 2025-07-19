import { client } from "@/sanity/lib/client"
import { NextRequest, NextResponse } from "next/server"
import { render } from "@react-email/render"
import PaymentConfirmationEmail from "@/emails/drwebstudioEmail"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const emailData = await client.fetch(`
      *[_type == "generalLayout"][0] {
        email
      }
    `)

    const { clientName, clientEmail, paymentAmount, transactionId, lang } =
      await request.json()
    console.log(lang)
    const emailHtml = await render(
      PaymentConfirmationEmail({
        clientName,
        clientEmail,
        paymentAmount,
        transactionId,
        email: emailData.email,
      }),
    )

    const res = await resend.emails.send({
      from: "Dr Web Studio <james@dr-webstudio.com>",
      to: [clientEmail],
      subject: "Payment Confirmation",
      html: emailHtml,
    })

    if (res.error) {
      console.error("Resend Error:", res.error)
      return NextResponse.json(
        { error: "Failed to send payment email", details: res.error },
        { status: 500 },
      )
    }

    return NextResponse.json(
      { message: "Email sent", data: res },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error sending payment email:", error)
    return NextResponse.json(
      { error: "Failed to send payment email", details: String(error) },
      { status: 500 },
    )
  }
}
