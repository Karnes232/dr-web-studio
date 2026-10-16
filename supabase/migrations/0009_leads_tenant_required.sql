-- leads.tenant_id: no default, and it must name a real tenant.
--
-- Apply via the Supabase dashboard SQL editor, AFTER the code that always
-- passes tenantId is deployed (saveLead now requires it). Kept in the repo so
-- the schema is reproducible.
--
-- The 'drwebstudio' default dates from when there was one business. With a
-- second one on the agent, a missing tenant must fail loudly — saveLead then
-- emails the payload — rather than file another business's customer under DR.

alter table public.leads
  alter column tenant_id drop default;

-- Every existing row is 'drwebstudio', which exists, so this validates.
alter table public.leads
  add constraint leads_tenant_fk
  foreign key (tenant_id) references public.tenants (tenant_id);
