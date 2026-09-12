import "server-only"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Server-side Supabase client, holding the secret key.
 *
 * Customer records (leads, and later WhatsApp conversations) live here rather
 * than in Sanity because the `production` dataset is public: anonymous reads
 * work without a token, so any PII written there would be world-readable.
 * Sanity stays content-only.
 *
 * The secret key must never reach the browser, so the env var deliberately has
 * no `NEXT_PUBLIC_` prefix — that prefix would inline it into the client
 * bundle. `server-only` makes a stray client import a build error.
 *
 * Note `sb_secret_…` keys bypass every RLS policy, which is why `leads` has RLS
 * enabled with no policies at all: this client still writes, and the
 * publishable key can do nothing.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const secretKey = process.env.SUPABASE_SECRET_KEY

let cached: SupabaseClient | null = null

/** Returns null when Supabase isn't configured, so callers can fall back. */
export function getSupabase(): SupabaseClient | null {
  if (!url || !secretKey) return null
  if (!cached) {
    cached = createClient(url, secretKey, {
      // No end user and no session — this is a server-to-server writer.
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return cached
}

export function isSupabaseConfigured(): boolean {
  return Boolean(url && secretKey)
}
