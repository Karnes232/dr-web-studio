-- Fix 0004: a PARTIAL unique index cannot be an ON CONFLICT target.
--
-- 0004 created:
--   create unique index ... on leads (conversation_id) where conversation_id is not null
--
-- Postgres will only infer a partial index for ON CONFLICT if the statement
-- repeats the index predicate, and PostgREST emits no WHERE clause — so every
-- upsert failed with:
--   42P10: there is no unique or exclusion constraint matching the ON CONFLICT
--          specification
-- The agent's save_lead therefore fell through to the Resend fallback on every
-- call and no WhatsApp lead was ever written.
--
-- The predicate was never needed. A plain UNIQUE treats NULLs as distinct, so
-- form leads (conversation_id IS NULL) remain unconstrained and unlimited.
--
-- Apply via the Supabase dashboard SQL editor.

drop index if exists public.leads_one_per_conversation;

alter table public.leads
  drop constraint if exists leads_conversation_id_key;

alter table public.leads
  add constraint leads_conversation_id_key unique (conversation_id);
