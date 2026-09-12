-- WhatsApp conversation storage.
--
-- Apply via the Supabase dashboard SQL editor. Kept in the repo so the schema
-- is reproducible.

-- ---------------------------------------------------------------------------
-- tenants — one row per WhatsApp number the agent answers on.
--
-- There is exactly one row today (DR Web Studio), but every conversation and
-- message carries the tenant from day one: retrofitting a tenant key later is
-- a migration *and* a cross-tenant leak vector, and it costs one column now.
--
-- Secrets are NOT stored here. The provider API key lives in Vercel env,
-- keyed by tenant (e.g. KAPSO_API_KEY), never in the database.
-- ---------------------------------------------------------------------------
create table if not exists public.tenants (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  tenant_id             text not null unique,
  business_name         text not null,
  active                boolean not null default true,

  -- Routing: this is the key inbound webhooks are resolved by.
  provider              text not null default 'kapso',
  phone_number_id       text not null unique,
  display_phone         text,

  -- Behaviour
  model                 text not null default 'claude-opus-5',
  locales               text[] not null default array['es','en'],
  default_locale        text not null default 'es',
  system_prompt         text,
  greeting              jsonb,
  escalation_email      text,
  escalation_whatsapp   text,

  -- Cost control. Built now even though nothing increments it yet —
  -- retrofitting cost accounting after a surprise bill is the classic mistake.
  monthly_message_cap   integer,
  monthly_cost_cap_usd  numeric(10,4),
  cost_this_month_usd   numeric(10,4) not null default 0,
  messages_this_month   integer not null default 0
);

-- ---------------------------------------------------------------------------
-- conversations — one per (tenant, WhatsApp user).
-- ---------------------------------------------------------------------------
create table if not exists public.conversations (
  id                       uuid primary key default gen_random_uuid(),
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),

  tenant_id                text not null references public.tenants(tenant_id) on delete cascade,
  provider_conversation_id text,

  wa_id                    text not null,
  -- WhatsApp can now send identity without a phone number, so wa_id alone is
  -- not always a safe user key. Kept alongside it.
  business_scoped_user_id  text,
  profile_name             text,

  -- Detected once on the first message and then left alone; re-detecting per
  -- turn is what makes these bots flip language mid-conversation.
  locale                   text,

  status                   text not null default 'active'
                             check (status in ('active','awaiting-human','handed-off','closed')),
  escalated_at             timestamptz,
  escalation_reason        text,

  -- Meta exposes no "is the 24h window open" flag, so the app computes it:
  -- open  <=>  now() - last_inbound_at < interval '24 hours'.
  last_inbound_at          timestamptz,
  last_outbound_at         timestamptz,

  turn_count               integer not null default 0,
  cost_usd                 numeric(10,4) not null default 0,
  summary                  text,
  lead_id                  uuid references public.leads(id) on delete set null,

  unique (tenant_id, wa_id)
);

create index if not exists conversations_tenant_idx      on public.conversations (tenant_id);
create index if not exists conversations_status_idx      on public.conversations (status);
create index if not exists conversations_last_inbound_idx on public.conversations (last_inbound_at desc);

-- ---------------------------------------------------------------------------
-- messages — the transcript.
--
-- Rows, not a JSON array on the conversation: no ~40-message cap, no
-- read-modify-write race between two messages arriving at once.
-- ---------------------------------------------------------------------------
create table if not exists public.messages (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),

  conversation_id       uuid not null references public.conversations(id) on delete cascade,
  tenant_id             text not null,

  -- Meta's wamid. Unique per tenant, which is what makes a redelivered inbound
  -- message a no-op instead of a duplicate transcript entry.
  provider_message_id   text not null,

  direction             text not null check (direction in ('inbound','outbound')),
  role                  text check (role in ('user','assistant','system')),
  type                  text,
  body                  text,

  -- Outbound only; updated by status webhooks, which arrive after the send.
  status                text,
  error_code            integer,
  error_message         text,

  sent_at               timestamptz,
  raw                   jsonb,

  unique (tenant_id, provider_message_id)
);

create index if not exists messages_conversation_idx on public.messages (conversation_id, created_at);

-- ---------------------------------------------------------------------------
-- webhook_deliveries — delivery-level idempotency.
--
-- Kapso retries at 10s and 40s on any non-200 and warns that duplicate
-- delivery is expected, so the handler must be idempotent for EVERY event
-- type, not just inbound messages. Inserting the delivery key first turns a
-- redelivery into a primary-key conflict: cheap, and it covers status events
-- which carry no new message id of their own.
--
-- Rows accumulate forever; prune anything older than ~30 days periodically.
-- ---------------------------------------------------------------------------
create table if not exists public.webhook_deliveries (
  idempotency_key text primary key,
  event           text,
  received_at     timestamptz not null default now()
);

create index if not exists webhook_deliveries_received_idx on public.webhook_deliveries (received_at);

-- Defence in depth, same posture as `leads`: the server's secret key has
-- BYPASSRLS so it still writes; the publishable key can do nothing.
alter table public.tenants            enable row level security;
alter table public.conversations      enable row level security;
alter table public.messages           enable row level security;
alter table public.webhook_deliveries enable row level security;
