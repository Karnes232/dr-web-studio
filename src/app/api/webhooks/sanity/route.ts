import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import {
  isValidSanitySignature,
  indexNowUrlsForDocument,
  submitToIndexNow,
} from "@/lib/indexnow"

// Sanity publish webhook → IndexNow ping. Configure the webhook in Sanity to
// fire on published blogPost/serviceItem docs with this projection:
//   { _type, "slug": slug.current, "slugEs": slugEs.current }
// and a shared secret stored in SANITY_WEBHOOK_SECRET.
export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = (await headers()).get("sanity-webhook-signature")
  const secret = process.env.SANITY_WEBHOOK_SECRET

  if (!secret) {
    console.error("SANITY_WEBHOOK_SECRET is not set")
    return NextResponse.json({ error: "Not configured" }, { status: 500 })
  }
  if (!isValidSanitySignature(body, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  let doc: unknown
  try {
    doc = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const urls = indexNowUrlsForDocument(
    doc as Parameters<typeof indexNowUrlsForDocument>[0],
  )
  if (urls.length === 0) {
    // Unmapped type or missing slug — nothing to ping, but acknowledge so Sanity
    // doesn't retry.
    return NextResponse.json({ received: true, submitted: 0 })
  }

  const result = await submitToIndexNow(urls)
  if (!result.ok && !result.skipped) {
    console.error("IndexNow submission failed:", result.status, urls)
  }
  return NextResponse.json({
    received: true,
    submitted: urls.length,
    indexNowStatus: result.status,
    urls,
  })
}
