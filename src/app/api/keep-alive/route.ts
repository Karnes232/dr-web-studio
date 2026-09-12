import { getSupabase } from "@/lib/supabase/serverClient"
import { NextRequest, NextResponse } from "next/server"

// Must not be statically optimised — the whole point is to actually hit the
// database on every invocation.
export const dynamic = "force-dynamic"

/**
 * Keeps the Supabase free-tier project from being paused.
 *
 * Supabase pauses a free project after roughly a week of insufficient activity,
 * after which every request returns HTTP 540 until someone clicks Resume in the
 * dashboard — it does not wake on an incoming request. For a lead form that
 * means a quiet week silently breaks intake.
 *
 * This has to be driven from OUTSIDE Supabase: `pg_cron` runs inside the
 * database, so it pauses along with it and can never self-rescue. See
 * `.github/workflows/supabase-keep-alive.yml`.
 *
 * Note this is a mitigation for an undocumented edge of Supabase's free plan,
 * not a supported feature. `saveLead`'s email fallback is what actually
 * guarantees no lead is lost; this just makes the outage unlikely.
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

  const { error } = await supabase.from("leads").select("id").limit(1)

  if (error) {
    console.error("keep-alive: query failed:", error)
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true, at: new Date().toISOString() })
}
