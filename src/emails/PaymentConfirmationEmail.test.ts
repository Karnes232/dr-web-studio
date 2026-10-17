import { describe, expect, it } from "vitest"
import { createElement } from "react"
import { render } from "@react-email/render"
import PaymentConfirmationEmail from "./drwebstudioEmail"
import PaymentConfirmationEmailSpanish from "./PaymentConfirmationEmailSpanish"

const props = {
  clientName: "Ana Pérez",
  clientEmail: "ana@example.com",
  paymentAmount: 123456,
  currency: "usd",
  transactionId: "pi_3Abc123",
  email: "ayuda@dr-webstudio.com",
  paidAt: new Date("2026-01-16T01:30:00Z"), // still the 15th in Punta Cana
  whatsapp: "+1 204-809-3662",
  receiptUrl: "https://pay.stripe.com/receipts/abc",
}

describe("payment confirmation email (English)", async () => {
  const el = createElement(PaymentConfirmationEmail, {
    ...props,
    description: "Custom payment",
  })
  const html = await render(el)
  const text = await render(el, { plainText: true })

  it("shows business, amount with currency, id, date, purpose, contact", () => {
    expect(html).toContain("DR WEB")
    expect(html).toContain("$1,234.56")
    expect(html).toContain("pi_3Abc123")
    expect(html).toContain("January 15, 2026")
    expect(html).toContain("Custom payment")
    expect(html).toContain("ayuda@dr-webstudio.com")
    expect(html).toContain("+1 204-809-3662")
    expect(html).toContain("https://wa.me/12048093662")
  })

  it("links the Stripe receipt", () => {
    expect(html).toContain("View receipt")
    expect(html).toContain("https://pay.stripe.com/receipts/abc")
  })

  it("omits the receipt link when there is none", async () => {
    const out = await render(
      createElement(PaymentConfirmationEmail, {
        ...props,
        receiptUrl: undefined,
      }),
    )
    expect(out).not.toContain("View receipt")
  })

  it("has a plain-text fallback with the essentials", () => {
    expect(text).toContain("$1,234.56")
    expect(text).toContain("pi_3Abc123")
    expect(text).toContain("+1 204-809-3662")
  })
})

describe("payment confirmation email (Spanish)", async () => {
  const el = createElement(PaymentConfirmationEmailSpanish, {
    ...props,
    description: "Pago personalizado",
  })
  const html = await render(el)
  const text = await render(el, { plainText: true })

  it("is in Spanish with amount, currency, id, date, purpose, contact", () => {
    expect(html).toContain("¡Pago Confirmado!")
    expect(html).toContain("1,234.56")
    expect(html).toMatch(/US\$|\$/)
    expect(html).toContain("pi_3Abc123")
    expect(html.toLowerCase()).toContain("15 de enero de 2026")
    expect(html).toContain("Pago personalizado")
    expect(html).toContain("ayuda@dr-webstudio.com")
    expect(html).toContain("+1 204-809-3662")
    expect(html).toContain("https://wa.me/12048093662")
  })

  it("links the Stripe receipt in Spanish", () => {
    expect(html).toContain("Ver recibo")
    expect(html).toContain("https://pay.stripe.com/receipts/abc")
  })

  it("has a plain-text fallback", () => {
    expect(text).toContain("pi_3Abc123")
    expect(text).toContain("Pago personalizado")
  })
})
