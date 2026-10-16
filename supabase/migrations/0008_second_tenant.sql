-- A second tenant: Grand Bay of the Sea, on a coexistence number.
--
-- Apply via the Supabase dashboard SQL editor. Kept in the repo so the schema
-- is reproducible.
--
-- Additive only, and safe to apply BEFORE the code that reads it is deployed:
-- the running code selects `*` and ignores columns it does not know, and every
-- new column defaults to today's behaviour for DR Web Studio. Apply it first —
-- `/api/reset-meters` writes `kapso_messages_this_month` once deployed, and
-- would fail on the 1st of the month if the column did not exist yet.
--
-- Secrets are still NOT stored here. The *_env columns hold the NAME of a
-- Vercel environment variable, constrained to an allowlisted prefix so a row
-- can never point the code at an arbitrary variable.

-- ---------------------------------------------------------------------------
-- Which agent persona, knowledge and tools this tenant gets. The prompt lives
-- in code, per profile, because it is inside the cached prefix.
-- ---------------------------------------------------------------------------
alter table public.tenants
  add column if not exists agent_profile text not null default 'drwebstudio'
    check (agent_profile ~ '^[a-z0-9-]+$');

-- ---------------------------------------------------------------------------
-- Per-tenant credentials, by env-var name. NULL = the shared default
-- (KAPSO_API_KEY / ANTHROPIC_API_KEY). A named variable that is unset makes
-- the code fail closed — it never falls back to someone else's key.
-- ---------------------------------------------------------------------------
alter table public.tenants
  add column if not exists kapso_api_key_env text
    check (kapso_api_key_env ~ '^KAPSO_API_KEY(_[A-Z0-9]+)?$'),
  add column if not exists anthropic_api_key_env text
    check (anthropic_api_key_env ~ '^ANTHROPIC_API_KEY(_[A-Z0-9]+)?$'),
  -- Kapso generates project-webhook secrets itself (they cannot be supplied),
  -- so each client's account has its own.
  add column if not exists kapso_project_secret_env text
    check (kapso_project_secret_env ~ '^KAPSO_PROJECT_WEBHOOK_SECRET(_[A-Z0-9]+)?$');

-- ---------------------------------------------------------------------------
-- Where notifications point and who they come from. NULL = DR's defaults.
-- ---------------------------------------------------------------------------
alter table public.tenants
  add column if not exists inbox_url text,
  add column if not exists email_from text,
  add column if not exists email_reply_to text;

-- ---------------------------------------------------------------------------
-- How long a chat a person spoke in stays theirs. NULL = for good, which is
-- what a coexistence number staffed from phones needs. Agent escalations
-- (awaiting-human) are not governed by this; they resume after 5 days for
-- every tenant.
-- ---------------------------------------------------------------------------
alter table public.tenants
  add column if not exists resume_after_hours integer
    check (resume_after_hours is null or resume_after_hours > 0);

-- DR keeps exactly the behaviour it has today (5 days).
update public.tenants
  set resume_after_hours = 120
  where tenant_id = 'drwebstudio' and resume_after_hours is null;

-- ---------------------------------------------------------------------------
-- Kapso's plan allowance. On the free plan Kapso counts every message in and
-- out — staff messages from the app included — and at exhaustion it may stop
-- delivering inbound webhooks with no error we can detect. So we keep our own
-- count and warn at 80%. NULL allowance = no limit (paid plan), no meter.
--
-- Send breaker: consecutive failed sends pause the agent (no Claude calls)
-- until paused_until, because Kapso gives no reliable error code for "out of
-- messages".
-- ---------------------------------------------------------------------------
alter table public.tenants
  add column if not exists kapso_monthly_allowance integer
    check (kapso_monthly_allowance is null or kapso_monthly_allowance > 0),
  add column if not exists kapso_messages_this_month integer not null default 0,
  add column if not exists send_failures integer not null default 0,
  add column if not exists paused_until timestamptz;

-- Atomic, so concurrent webhooks cannot lose counts, and so exactly one caller
-- sees `crossed` — the one whose increment passed 80% of the allowance.
create or replace function public.bump_kapso_meter(p_tenant text, p_by integer default 1)
returns table (messages integer, allowance integer, crossed boolean)
language sql
as $$
  update public.tenants
     set kapso_messages_this_month = kapso_messages_this_month + p_by
   where tenant_id = p_tenant
     and kapso_monthly_allowance is not null
  returning
    kapso_messages_this_month,
    kapso_monthly_allowance,
    kapso_messages_this_month >= ceil(kapso_monthly_allowance * 0.8)
      and kapso_messages_this_month - p_by < ceil(kapso_monthly_allowance * 0.8);
$$;

-- One atomic step per send. A success clears the streak; the failure that
-- reaches p_threshold pauses the tenant and reports `tripped` exactly once per
-- incident. Later failures keep re-pausing without reporting again, until a
-- send succeeds.
create or replace function public.record_send_result(
  p_tenant text,
  p_ok boolean,
  p_threshold integer default 3,
  p_pause interval default interval '1 hour'
)
returns table (failures integer, paused_until timestamptz, tripped boolean)
language sql
as $$
  update public.tenants t
     set send_failures = case when p_ok then 0 else t.send_failures + 1 end,
         paused_until = case
           when p_ok then null
           when t.send_failures + 1 >= p_threshold then now() + p_pause
           else t.paused_until
         end
   where t.tenant_id = p_tenant
  returning t.send_failures, t.paused_until, (not p_ok and t.send_failures = p_threshold);
$$;

-- Server-only: the secret key (service_role) calls these; nobody else may.
revoke execute on function public.bump_kapso_meter(text, integer) from public, anon, authenticated;
revoke execute on function public.record_send_result(text, boolean, integer, interval) from public, anon, authenticated;
grant execute on function public.bump_kapso_meter(text, integer) to service_role;
grant execute on function public.record_send_result(text, boolean, integer, interval) to service_role;

-- applyStatus and webhook_deliveries stay unscoped by tenant deliberately:
-- wamids and Kapso event ids are globally unique, so a status or delivery key
-- cannot collide across tenants.
