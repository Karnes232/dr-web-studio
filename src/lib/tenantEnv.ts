/**
 * Resolve a per-tenant secret from the NAME a tenant row gives for it.
 *
 * Tenant rows never hold secrets, only which Vercel env var to read
 * (`kapso_api_key_env`, `anthropic_api_key_env`, …). Two rules make that safe:
 *
 * - The name must be the shared default or `<DEFAULT>_<SUFFIX>`. A row can
 *   therefore never point the code at an unrelated secret such as
 *   `SUPABASE_SECRET_KEY` (the database enforces the same pattern; this is the
 *   second lock).
 * - A named variable that is not set is an error, never a fallback to the
 *   default. Falling back would quietly send one business's messages through
 *   another's Kapso account, or bill James for a client who brought their own
 *   Claude key.
 */
export type TenantSecret =
  | { ok: true; name: string; value: string }
  | { ok: false; name: string; error: string }

export function tenantSecret(
  name: string | null | undefined,
  defaultName: string,
): TenantSecret {
  const resolved = name ?? defaultName
  const allowed = new RegExp(`^${defaultName}(_[A-Z0-9]+)?$`)
  if (!allowed.test(resolved)) {
    return {
      ok: false,
      name: resolved,
      error: `${resolved} is not an allowed name for ${defaultName}`,
    }
  }
  // Trimmed: pasting into a hosting provider's env-var box readily picks up a
  // trailing newline.
  const value = process.env[resolved]?.trim()
  if (!value) {
    return { ok: false, name: resolved, error: `${resolved} is not set` }
  }
  return { ok: true, name: resolved, value }
}
