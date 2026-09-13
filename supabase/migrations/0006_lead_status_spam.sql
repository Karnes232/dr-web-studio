-- Allow leads to be filed as spam.
--
-- The contact form now flags bot submissions rather than rejecting them: the
-- request still returns 200 so the bot learns nothing about what tripped the
-- filter, but no email is sent and the row is stored as 'spam'. Nothing is ever
-- silently lost, and the filter can be reviewed and tuned against real traffic.
--
-- Without this the status check constraint rejects every flagged write.
--
-- Apply via the Supabase dashboard SQL editor.

alter table public.leads
  drop constraint if exists leads_status_check;

alter table public.leads
  add constraint leads_status_check
  check (status in ('new', 'qualified', 'handed-off', 'won', 'lost', 'spam'));

create index if not exists leads_status_created_idx
  on public.leads (status, created_at desc);
