-- Secure the public email credentials lookup.
--
-- Before: the public /email-lookup page queried email_credentials directly with the
-- anon key, so every search downloaded matching rows *including plaintext passwords*,
-- and the registration-number check only ran in the browser.
--
-- After: anon has no direct access to email_credentials. The public page goes through
-- three SECURITY DEFINER functions that never return a password until the
-- registration number has been checked on the server, and only once per credential.
--
-- Run this in the Supabase SQL editor (or `supabase db push`) BEFORE deploying the
-- frontend that calls these functions.

-- ── 1. Lock the table down to signed-in admins ──

alter table public.email_credentials enable row level security;

-- Remove every existing policy (including any that let anon read or update rows).
do $$
declare
  p record;
begin
  for p in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'email_credentials'
  loop
    execute format('drop policy %I on public.email_credentials', p.policyname);
  end loop;
end $$;

create policy "Admins manage email credentials"
  on public.email_credentials
  for all
  to authenticated
  using (true)
  with check (true);

revoke all on public.email_credentials from anon;

-- ── 2. Helpers and public RPCs ──

-- Mirrors extractRegNumber() in src/lib/utils.ts: the longest all-digit (5+) part of
-- the username split on "_", first one wins on a tie.
create or replace function public.credential_reg_number(p_email text)
returns text
language sql
immutable
as $$
  select t.part
  from unnest(string_to_array(split_part(p_email, '@', 1), '_')) with ordinality as t(part, ord)
  where t.part ~ '^\d{5,}$'
  order by length(t.part) desc, t.ord asc
  limit 1
$$;

-- Search by name or email. Returns no email and no password; one row per email,
-- taken from the highest-priority credential file.
create or replace function public.search_credentials(p_query text)
returns table (id text, name text, claimed_at timestamptz, source text, priority integer)
language sql
stable
security definer
set search_path = public
as $$
  select distinct on (lower(c.email))
    c.id::text,
    c.name::text,
    c.claimed_at::timestamptz,
    f.display_name::text,
    coalesce(f.priority, 0)::integer
  from email_credentials c
  left join credential_files f on f.id = c.file_id
  where coalesce(trim(p_query), '') <> ''
    and (c.name ilike '%' || trim(p_query) || '%' or c.email ilike '%' || trim(p_query) || '%')
  order by lower(c.email), coalesce(f.priority, 0) desc
  limit 50
$$;

-- True when p_reg matches the unclaimed credential's registration number
-- (or the part before "@" when the email has no numeric part).
create or replace function public.verify_credential(p_id text, p_reg text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_email text;
  v_reg   text;
  v_input text := regexp_replace(coalesce(p_reg, ''), '\s+', '', 'g');
begin
  select c.email into v_email
  from email_credentials c
  where c.id::text = p_id and c.claimed_at is null;

  if v_email is null or v_input = '' then
    return false;
  end if;

  v_reg := credential_reg_number(v_email);
  if v_reg is null then
    return lower(v_input) = lower(split_part(v_email, '@', 1));
  end if;

  return v_input = v_reg;
end $$;

-- Verifies again, marks the credential as claimed and returns it. A credential can be
-- claimed only once: later calls (or a second tab) get an error.
create or replace function public.claim_credential(p_id text, p_reg text)
returns table (cred_email text, cred_password text)
language plpgsql
volatile
security definer
set search_path = public
as $$
begin
  if not verify_credential(p_id, p_reg) then
    raise exception 'Verification failed or credential already claimed'
      using errcode = '28000';
  end if;

  return query
    update email_credentials c
    set claimed_at = now()
    where c.id::text = p_id and c.claimed_at is null
    returning c.email::text, c.password::text;
end $$;

-- ── 3. Permissions ──

revoke all on function public.credential_reg_number(text) from public;
revoke all on function public.search_credentials(text) from public;
revoke all on function public.verify_credential(text, text) from public;
revoke all on function public.claim_credential(text, text) from public;

grant execute on function public.search_credentials(text) to anon, authenticated;
grant execute on function public.verify_credential(text, text) to anon, authenticated;
grant execute on function public.claim_credential(text, text) to anon, authenticated;
