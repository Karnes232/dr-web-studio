-- Human takeover: record who actually typed an outbound message, and when a
-- conversation was handed to a person.
--
-- Apply via the Supabase dashboard SQL editor. Kept in the repo so the schema
-- is reproducible.
--
-- Why a new column rather than a new `role` value: `messages.role` has
-- `check (role in ('user','assistant','system'))` (0002), and a human reply
-- must still be `role = 'assistant'` so that `loadHistory` replays it to the
-- model as something the business said. Authorship is a separate axis from
-- conversational role, so it gets a separate column. Writing `role = 'human'`
-- would raise 23514, which `recordOutbound`'s error branch swallows silently —
-- the row would simply vanish with a console line.

alter table public.messages
  add column if not exists authored_by text
    check (authored_by in ('agent', 'human'));

comment on column public.messages.authored_by is
  'Who composed an outbound message: the AI agent, or a person replying from '
  'the provider inbox. NULL on inbound rows and on rows written before this '
  'column existed. Kapso cannot tell us this — every outbound message reports '
  'origin "cloud_api" whether the inbox or the API sent it — so it is inferred '
  'from whether we had already recorded the wamid ourselves.';

-- When the agent stood down for a person. Distinct from `escalated_at`, which
-- means the agent chose to hand off; this means a human simply started typing.
alter table public.conversations
  add column if not exists handed_off_at timestamptz;

comment on column public.conversations.handed_off_at is
  'When a human took the conversation over by replying from the inbox. The '
  'agent resumes after a quiet period measured from last_outbound_at.';

-- The takeover check looks up a wamid to decide whether we sent it. The
-- existing unique index is (tenant_id, provider_message_id), which serves that
-- lookup; this one serves `applyStatus`, which filters on provider_message_id
-- alone and would otherwise sequential-scan `messages` on every status event.
create index if not exists messages_provider_message_idx
  on public.messages (provider_message_id);

-- conversations.status needs no change: 'handed-off' is already permitted by
-- the 0002 check constraint (active | awaiting-human | handed-off | closed).
