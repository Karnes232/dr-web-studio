import { getSupabase } from "@/lib/supabase/serverClient"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

/**
 * Zero the per-tenant monthly meters.
 *
 * `tenants.cost_this_month_usd` and `messages_this_month` are named for a month
 * but were only ever incremented — nothing reset them. That made the spend cap
 * at `runAgent` a **lifetime** kill switch: once cumulative spend crossed
 * `monthly_cost_cap_usd` the agent escalated every conversation and never
 * recovered, because the counter could only keep rising.
 *
 * It is harmless for DR Web Studio today only because its cap is NULL. Any
 * paying tenant would have a cap, which arms the trap on day one.
 *
 * Driven from outside the database for the same reason as `keep-alive`:
 * `pg_cron` runs inside Supabase and pauses along with it on the free plan.
 *
 * Running twice in a month is harmless — the meters are already zero. Missing a
 * month is not: the cap trips early. Both failure modes are logged.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = request.headers.get("authorization")
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json(
      { ok: false, reason: "Supabase not configured" },
      { status: 503 },
    )
  }

  // Read first so the figures being cleared end up in the logs — this is the
  // only per-month record of spend once the counters are gone. `messages` rows
  // keep the per-turn detail; this is just the roll-up.
  const { data: before, error: readErr } = await supabase
    .from("tenants")
    .select("tenant_id, cost_this_month_usd, messages_this_month")

  if (readErr) {
    console.error("reset-meters: read failed:", readErr)
    return NextResponse.json(
      { ok: false, error: readErr.message },
      { status: 502 },
    )
  }

  const { error } = await supabase
    .from("tenants")
    .update({
      cost_this_month_usd: 0,
      messages_this_month: 0,
      updated_at: new Date().toISOString(),
    })
    // PostgREST refuses an unfiltered UPDATE; this matches every row.
    .not("tenant_id", "is", null)

  if (error) {
    console.error("reset-meters: update failed:", error)
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 502 },
    )
  }

  for (const t of before ?? []) {
    console.log(
      `reset-meters: ${t.tenant_id} closed the month at ` +
        `$${Number(t.cost_this_month_usd ?? 0).toFixed(4)} over ` +
        `${t.messages_this_month ?? 0} messages`,
    )
  }

  return NextResponse.json({
    ok: true,
    at: new Date().toISOString(),
    reset: (before ?? []).length,
  })
}
