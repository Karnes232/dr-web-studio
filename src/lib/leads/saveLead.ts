import "server-only"
import { getSupabase } from "@/lib/supabase/serverClient"
import { getContactEmail } from "@/sanity/queries/layout/generalLayout"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export type LeadSource = "whatsapp" | "contact-form" | "project-planner"

export interface LeadEstimateItem {
  key: string
  label: string
  amount: number
}

export interface SaveLeadInput {
  source: LeadSource
  /** When set, UPDATE this row instead of inserting a new one. A WhatsApp
   *  conversation is one lead however many times the agent refines it. */
  leadId?: string
  tenantId?: string
  name?: string
  email?: string
  phone?: string
  company?: string
  locale?: string
  message?: string
  projectType?: string
  budgetBand?: string
  timeline?: string
  serviceKey?: string
  serviceTitle?: string
  addons?: string[]
  sizeTier?: string
  content?: string
  rush?: boolean
  design?: string
  references?: string[]
  estimate?: {
    total: number
    currency?: string
    currencySymbol?: string
    items?: LeadEstimateItem[]
  }
}

/** Drop empty strings, blank arrays and undefined so rows stay readable. */
function compact<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue
    if (typeof v === "string" && !v.trim()) continue
    if (Array.isArray(v) && v.length === 0) continue
    out[k] = v
  }
  return out as Partial<T>
}

/** Map the camelCase input onto the snake_case `leads` columns. */
function toRow(input: SaveLeadInput): Record<string, unknown> {
  const { estimate } = input
  const hasEstimate = !!estimate && Number.isFinite(estimate.total)

  return {
    source: input.source,
    tenant_id: input.tenantId ?? "drwebstudio",
    // Only set on insert — updating must not undo a status you have changed.
    ...(input.leadId ? {} : { status: "new" }),
    ...compact({
      name: input.name,
      email: input.email,
      phone: input.phone,
      company: input.company,
      locale: input.locale,
      message: input.message,
      project_type: input.projectType,
      budget_band: input.budgetBand,
      timeline: input.timeline,
      service_key: input.serviceKey,
      service_title: input.serviceTitle,
      addons: input.addons,
      size_tier: input.sizeTier,
      content: input.content,
      design: input.design,
      // `references` is a reserved SQL keyword, hence the column rename.
      reference_urls: input.references,
    }),
    ...(typeof input.rush === "boolean" ? { rush: input.rush } : {}),
    ...(hasEstimate
      ? {
          estimate: {
            total: estimate!.total,
            currency: estimate!.currency ?? "USD",
            currencySymbol: estimate!.currencySymbol ?? "$",
            items: estimate!.items ?? [],
          },
          pricing_snapshot_at: new Date().toISOString(),
        }
      : {}),
  }
}

/**
 * Last line of defence: if the row could not be written, email the payload so
 * the lead is never simply lost.
 *
 * This covers every class of outage, not just one — a paused Supabase free-tier
 * project (which returns HTTP 540 until someone clicks Resume), a blown quota,
 * schema drift, a network blip. For the web forms a full notification email has
 * already gone out, so this is a data-integrity alert telling you a row is
 * missing; for the WhatsApp agent it is the only copy of the lead.
 */
async function emailFallback(input: SaveLeadInput, reason: string) {
  try {
    const cachedEmail = await getContactEmail()
    const toEmail = cachedEmail?.trim() || "james@dr-webstudio.com"

    await resend.emails.send({
      from: "Dr Web Studio <james@dr-webstudio.com>",
      to: [toEmail],
      subject: `⚠️ Lead not saved (${input.source}): ${input.name || "unknown"}`,
      text: [
        "A lead could not be written to the database.",
        "",
        `Reason: ${reason}`,
        `Source: ${input.source}`,
        `Time:   ${new Date().toISOString()}`,
        "",
        "Re-enter this row by hand, or fix the database and re-add it:",
        "",
        JSON.stringify(input, null, 2),
      ].join("\n"),
    })
  } catch (error) {
    // Nothing left to fall back to; make sure it is at least in the logs.
    console.error("saveLead: fallback email also failed:", error, input)
  }
}

/**
 * Persist a lead, then get out of the way.
 *
 * Every intake surface calls this *alongside* its existing notification email,
 * never instead of it. It never throws and never blocks a response — a database
 * outage must not cost a lead. Returns the new row id, or null if the write
 * failed (in which case the payload has been emailed).
 */
export async function saveLead(input: SaveLeadInput): Promise<string | null> {
  const supabase = getSupabase()

  if (!supabase) {
    console.warn("saveLead: Supabase not configured, falling back to email")
    await emailFallback(input, "Supabase is not configured")
    return null
  }

  try {
    const row = toRow(input)
    const query = input.leadId
      ? supabase.from("leads").update(row).eq("id", input.leadId)
      : supabase.from("leads").insert(row)

    const { data, error } = await query.select("id").single()

    // supabase-js returns errors in the payload rather than throwing.
    if (error) {
      console.error("saveLead: insert failed:", error)
      await emailFallback(input, error.message || "Unknown Supabase error")
      return null
    }

    return (data?.id as string) ?? null
  } catch (error) {
    console.error("saveLead: unexpected failure:", error)
    await emailFallback(input, String(error))
    return null
  }
}
