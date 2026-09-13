-- Per-turn token accounting.
--
-- Added because the first live conversation cost 2.6x the estimate and the
-- cost column alone could not say why: a cache miss, an extra tool-loop
-- iteration, and thinking tokens all look identical from the total. These
-- columns separate them.
--
-- Also the foundation for per-client billing when the agent is resold: cost
-- per tenant per month is a sum over these rows.
--
-- Apply via the Supabase dashboard SQL editor.

alter table public.messages
  add column if not exists input_tokens       integer,
  add column if not exists output_tokens      integer,
  add column if not exists cache_read_tokens  integer,
  add column if not exists cache_write_tokens integer,
  add column if not exists cost_usd           numeric(10,6),
  -- How many Claude API calls this one customer-facing reply actually took.
  -- >1 means the model used tools; each iteration re-sends the whole prefix.
  add column if not exists api_calls          integer;
