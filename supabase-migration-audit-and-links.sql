-- Ilm Library — Audit log policies + link-check results
-- Safe to re-run.

------------------------------------------------------------
-- 1. Open audit_log for authenticated admins
-- The original policy locked it to service_role only, which
-- prevents the client-side admin UI from writing entries.
-- Admins are the only authenticated users, so granting
-- authenticated read+insert is sufficient.
------------------------------------------------------------
drop policy if exists "Admin write access" on audit_log;
drop policy if exists "Admin read access"  on audit_log;
drop policy if exists "Authenticated insert audit" on audit_log;
drop policy if exists "Authenticated read audit"   on audit_log;

create policy "Authenticated insert audit"
  on audit_log for insert
  to authenticated
  with check (true);

create policy "Authenticated read audit"
  on audit_log for select
  to authenticated
  using (true);

------------------------------------------------------------
-- 2. Link-check results
-- Stores the outcome of broken-link scans so they persist
-- between admin sessions and surface in Needs Attention.
------------------------------------------------------------
create table if not exists link_check_results (
  id uuid default gen_random_uuid() primary key,
  resource_type text not null,            -- 'book' | 'lecture' | 'khutba'
  resource_id uuid not null,
  field text not null,                    -- 'cover_url' | 'pdf_url' | 'audio_url' | 'video_url'
  url text not null,
  status text not null,                   -- 'ok' | 'broken' | 'timeout' | 'error'
  http_code int,
  error_message text,
  checked_at timestamptz not null default now(),
  unique (resource_type, resource_id, field)
);

create index if not exists idx_link_check_status on link_check_results(status);
create index if not exists idx_link_check_time on link_check_results(checked_at desc);
create index if not exists idx_link_check_resource
  on link_check_results(resource_type, resource_id);

alter table link_check_results enable row level security;

drop policy if exists "Authenticated read link_check" on link_check_results;
drop policy if exists "Authenticated write link_check" on link_check_results;

create policy "Authenticated read link_check"
  on link_check_results for select
  to authenticated
  using (true);

create policy "Authenticated write link_check"
  on link_check_results for all
  to authenticated
  using (true)
  with check (true);
