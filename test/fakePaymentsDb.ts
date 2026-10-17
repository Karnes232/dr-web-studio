/**
 * A tiny in-memory stand-in for the slice of supabase-js that
 * lib/payments/store.ts uses: `upsert` with ignoreDuplicates, and
 * `update().eq().is().or().select()`. It evaluates the same filters, so the
 * claim/lease behaviour under test is the real SQL-shaped logic, not a mock
 * that returns whatever the test wants.
 */
type Row = Record<string, unknown>

export class FakePaymentsDb {
  rows = new Map<string, Row>()
  /** Make the next call of this kind return a database error. */
  failNext: "upsert" | "update" | null = null
  /** Called each time an update runs (after filters), for assertions. */
  updates = 0

  client = {
    from: (table: string) => {
      if (table !== "payments") throw new Error(`unexpected table ${table}`)
      return {
        upsert: async (row: Row, opts?: { ignoreDuplicates?: boolean }) => {
          if (this.failNext === "upsert") {
            this.failNext = null
            return { error: { code: "XX000" } }
          }
          const id = row.payment_intent_id as string
          if (this.rows.has(id) && opts?.ignoreDuplicates) {
            return { error: null }
          }
          this.rows.set(id, {
            customer_email_claimed_at: null,
            customer_email_sent_at: null,
            owner_email_claimed_at: null,
            owner_email_sent_at: null,
            ...row,
          })
          return { error: null }
        },
        update: (patch: Row) => this.update(patch),
        select: (col: string) => ({
          eq: (key: string, val: unknown) => ({
            maybeSingle: async () => {
              const row = [...this.rows.values()].find(r => r[key] === val)
              return {
                data: row ? { [col]: row[col] ?? null } : null,
                error: null,
              }
            },
          }),
        }),
      }
    },
  }

  private update(patch: Row) {
    const filters: Array<(r: Row) => boolean> = []
    const run = () => {
      if (this.failNext === "update") {
        this.failNext = null
        return { data: null, error: { code: "XX000" } }
      }
      const hit = [...this.rows.values()].filter(r => filters.every(f => f(r)))
      for (const r of hit) Object.assign(r, patch)
      this.updates += hit.length
      return {
        data: hit.map(r => ({ payment_intent_id: r.payment_intent_id })),
        error: null,
      }
    }
    const builder = {
      eq: (col: string, val: unknown) => {
        filters.push(r => r[col] === val)
        return builder
      },
      is: (col: string, val: null) => {
        filters.push(r => (r[col] ?? null) === val)
        return builder
      },
      or: (expr: string) => {
        const conds = expr.split(",").map(part => {
          const [col, op, ...rest] = part.split(".")
          const val = rest.join(".")
          return (r: Row) => {
            const v = r[col] as string | null | undefined
            if (op === "is" && val === "null") return v == null
            if (op === "lt") return v != null && new Date(v) < new Date(val)
            throw new Error(`fake db: unsupported filter ${part}`)
          }
        })
        filters.push(r => conds.some(c => c(r)))
        return builder
      },
      select: () => builder,
      then: (
        resolve: (v: unknown) => unknown,
        reject?: (e: unknown) => unknown,
      ) => Promise.resolve(run()).then(resolve, reject),
    }
    return builder
  }
}
