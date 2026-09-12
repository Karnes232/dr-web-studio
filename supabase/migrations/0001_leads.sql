-- Lead capture for DR Web Studio.
--
-- Every intake surface writes one row type: the contact form, the project
-- planner, and (later) the WhatsApp agent. The column set is deliberately a
-- superset of all three so there is one table to read, not three.
--
-- Apply via the Supabase dashboard SQL editor. Kept in the repo so the schema
-- is reproducible.

create table if not exists public.leads (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),

  source              text not null
                        check (source in ('whatsapp', 'contact-form', 'project-planner')),
  -- Carried from day one so multi-tenancy is never a retrofit.
  tenant_id           text not null default 'drwebstudio',
  status              text not null default 'new'
                        check (status in ('new', 'qualified', 'handed-off', 'won', 'lost')),

  -- Contact details
  name                text,
  email               text,
  phone               text,
  company             text,
  locale              text,
  message             text,

  -- Qualification (contact form)
  project_type        text,
  budget_band         text,
  timeline            text,

  -- Scope (project planner)
  -- service_key is the stable slug (e.g. 'e-commerce'); service_title is the
  -- localised display name, which can change.
  service_key         text,
  service_title       text,
  addons              text[],
  size_tier           text,
  content             text,
  rush                boolean,
  design              text,
  reference_urls      text[],

  -- Estimate exactly as shown to the visitor at submit time.
  estimate            jsonb,
  pricing_snapshot_at timestamptz,

  notes               text
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx     on public.leads (status);
create index if not exists leads_tenant_idx     on public.leads (tenant_id);

-- Defence in depth. The `sb_secret_` key used by the server has BYPASSRLS, so
-- writes keep working; with RLS on and zero policies, the publishable key can
-- read and write nothing. This closes the failure mode where someone later adds
-- a client-side Supabase call against a table full of customer PII.
alter table public.leads enable row level security;
