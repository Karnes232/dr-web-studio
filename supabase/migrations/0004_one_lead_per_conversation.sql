-- Make "one lead per conversation" a database guarantee, not a convention.
--
-- The previous attempt relied on conversations.lead_id being written after one
-- turn and read on the next. A 3-turn test still produced 3 lead rows, two of
-- them 93ms apart inside a single turn — the model called save_lead twice in
-- one turn, and both calls read the same null lead_id before either had
-- written. Application state cannot dedupe something that races with itself.
--
-- A unique constraint can. saveLead now upserts on it, so a duplicate is
-- impossible regardless of how many times the model calls the tool or how many
-- of those calls run concurrently.
--
-- Apply via the Supabase dashboard SQL editor.

alter table public.leads
  add column if not exists conversation_id uuid
    references public.conversations(id) on delete set null;

-- Partial: form leads have no conversation and must stay unconstrained.
create unique index if not exists leads_one_per_conversation
  on public.leads (conversation_id)
  where conversation_id is not null;

create index if not exists leads_conversation_idx
  on public.leads (conversation_id);
