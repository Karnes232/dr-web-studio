import "server-only"
import { createElement } from "react"
import { render } from "@react-email/render"
import { Resend } from "resend"
import PaymentConfirmationEmail from "@/emails/drwebstudioEmail"
import PaymentConfirmationEmailSpanish from "@/emails/PaymentConfirmationEmailSpanish"
import {
  getCompanyInfo,
  getContactEmail,
} from "@/sanity/queries/layout/generalLayout"
import { FALLBACK_WHATSAPP, OWNER_EMAIL, type PaymentLocale } from "./config"
import { formatMoney } from "./format"
import { claimEmail, markEmailSent, type EmailKind } from "./store"

const FROM = "Dr Web Studio <james@dr-webstudio.com>"

export interface PaymentEmailInput {
  paymentIntentId: string
  /** Integer cents. */
  amount: number
  currency: string
  customerName: string
  customerEmail: string
  locale: PaymentLocale
  paidAt: Date
  /** Stripe's hosted receipt, if the charge has one. */
  receiptUrl?: string
}

const SUBJECT: Record<PaymentLocale, string> = {
  es: "Pago confirmado – DR Web Studio",
  en: "Payment confirmed – DR Web Studio",
}

const DESCRIPTION: Record<PaymentLocale, string> = {
  es: "Pago personalizado",
  en: "Custom payment",
}

/** CMS values with a safe fallback: a CMS hiccup must not block a receipt. */
async function contactDetails(): Promise<{ email: string; whatsapp: string }> {
  let email: string | null = null
  let whatsapp: string | null = null
  try {
    email = await getContactEmail()
  } catch (err) {
    console.error("payment email: contact email lookup failed", err)
  }
  try {
    const info = (await getCompanyInfo()) as { whatsapp?: string } | null
    whatsapp = info?.whatsapp ?? null
  } catch (err) {
    console.error("payment email: whatsapp lookup failed", err)
  }
  return {
    email: email?.trim() || OWNER_EMAIL,
    whatsapp: whatsapp?.trim() || FALLBACK_WHATSAPP,
  }
}

function templateFor(
  input: PaymentEmailInput,
  contact: { email: string; whatsapp: string },
) {
  const props = {
    clientName: input.customerName,
    clientEmail: input.customerEmail,
    paymentAmount: input.amount,
    currency: input.currency,
    transactionId: input.paymentIntentId,
    email: contact.email,
    paidAt: input.paidAt,
    description: DESCRIPTION[input.locale],
    whatsapp: contact.whatsapp,
    receiptUrl: input.receiptUrl,
  }
  return input.locale === "es"
    ? createElement(PaymentConfirmationEmailSpanish, props)
    : createElement(PaymentConfirmationEmail, props)
}

/**
 * Send one email, exactly once across retries and duplicate deliveries:
 * claim (atomic lease) -> render -> Resend with an idempotency key -> mark.
 * The key covers the gap between "Resend accepted it" and "we recorded that";
 * if Resend errors we throw, the claim lapses, and Stripe's retry sends it.
 */
async function sendOnce(
  resend: Resend,
  input: PaymentEmailInput,
  kind: EmailKind,
  build: () => Promise<{
    to: string[]
    subject: string
    html: string
    text: string
    replyTo?: string
  }>,
): Promise<boolean> {
  if (!(await claimEmail(input.paymentIntentId, kind))) return false

  const message = await build()
  const { error } = await resend.emails.send(
    { from: FROM, ...message },
    { idempotencyKey: `payment/${input.paymentIntentId}/${kind}` },
  )
  if (error) throw new Error(`Resend rejected the ${kind} email: ${error.name}`)

  await markEmailSent(input.paymentIntentId, kind)
  return true
}

/**
 * The customer confirmation (in their locale) and the owner notification.
 * Throws on any failure so the webhook answers 500 and Stripe retries; kinds
 * already sent are skipped on the retry.
 */
export async function sendPaymentEmails(
  input: PaymentEmailInput,
): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const contact = await contactDetails()

  if (input.customerEmail) {
    await sendOnce(resend, input, "customer", async () => {
      const element = templateFor(input, contact)
      return {
        to: [input.customerEmail],
        replyTo: contact.email,
        subject: SUBJECT[input.locale],
        html: await render(element),
        text: await render(element, { plainText: true }),
      }
    })
  }

  await sendOnce(resend, input, "owner", async () => {
    const amountText = formatMoney(input.amount, input.currency, "en")
    const element = templateFor({ ...input, locale: "en" }, contact)
    return {
      to: [OWNER_EMAIL],
      subject: `Payment received: ${amountText} from ${(input.customerName || input.customerEmail).replace(/[\r\n]+/g, " ")}`,
      html: await render(element),
      text: await render(element, { plainText: true }),
    }
  })
}
