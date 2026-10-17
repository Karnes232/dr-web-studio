-- Stripe payments recorded by the webhook.
--
-- Apply via the Supabase dashboard SQL editor. Kept in the repo so the schema
-- is reproducible.
--
-- Additive only: a new table, nothing existing is touched. Apply it BEFORE
-- deploying the code that reads it (the Stripe webhook fails closed with a 500
-- if the table is missing, so Stripe would just keep retrying).
--
-- One row per succeeded PaymentIntent. The primary key is what makes the
-- webhook idempotent: Stripe can deliver the same event twice, and the second
-- insert is a no-op. Only SUCCEEDED payments are stored; failed attempts live
-- in Stripe.
--
-- Emails are sent from the webhook, once per kind (customer / owner):
--   1. claim:  set *_email_claimed_at where *_email_sent_at is null and the
--              claim is null or older than 2 minutes (a lease, so a crashed
--              attempt can be retried but two deliveries cannot both send);
--   2. send:   Resend call with an idempotency key (payment/<id>/<kind>);
--   3. mark:   set *_email_sent_at.
--
-- Test payments (Stripe test keys) land here with livemode = false, in the
-- same project as live ones, so filter on livemode when reporting.
--
-- RLS is on with NO policies: the publishable key can do nothing, and the
-- server's secret key bypasses RLS, exactly like `leads`.

create table if not exists public.payments (
  payment_intent_id         text primary key,
  created_at                timestamptz not null default now(),

  tenant_id                 text not null default 'drwebstudio',
  livemode                  boolean not null,

  -- Integer minor units (cents) and the lower-case ISO currency, as Stripe has them.
  amount                    integer not null check (amount > 0),
  currency                  text not null,

  customer_name             text not null default '',
  customer_email            text not null default '',
  locale                    text not null default 'es' check (locale in ('es', 'en')),

  paid_at                   timestamptz not null,
  last_event_id             text,

  customer_email_claimed_at timestamptz,
  customer_email_sent_at    timestamptz,
  owner_email_claimed_at    timestamptz,
  owner_email_sent_at       timestamptz
);

create index if not exists payments_created_at_idx on public.payments (created_at);

alter table public.payments enable row level security;
