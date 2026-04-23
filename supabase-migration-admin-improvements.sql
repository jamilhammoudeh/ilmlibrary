-- Ilm Library — Admin improvements migration
-- Run this in the Supabase SQL Editor to enable reordering and richer analytics.
-- All additions are optional. The admin pages work without them, with reduced functionality.

------------------------------------------------------------
-- 1. Category reordering: add sort_order to categories
------------------------------------------------------------
alter table categories
  add column if not exists sort_order int not null default 0;

create index if not exists idx_categories_sort on categories(sort_order);

------------------------------------------------------------
-- 2. Richer analytics: extend page_views
------------------------------------------------------------
alter table page_views
  add column if not exists referrer text,
  add column if not exists visitor_id text,
  add column if not exists user_agent text;

create index if not exists idx_page_views_visitor on page_views(visitor_id);
create index if not exists idx_page_views_referrer on page_views(referrer);

------------------------------------------------------------
-- 3. Content engagement: clicks to specific content items
------------------------------------------------------------
create table if not exists content_clicks (
  id uuid default gen_random_uuid() primary key,
  content_type text not null,              -- 'book' | 'lecture' | 'khutba' | 'dua' | 'wisdom'
  content_id uuid not null,
  path text,
  visitor_id text,
  clicked_at timestamptz not null default now()
);

create index if not exists idx_content_clicks_type_id on content_clicks(content_type, content_id);
create index if not exists idx_content_clicks_time on content_clicks(clicked_at desc);

alter table content_clicks enable row level security;

-- Public can insert clicks (anonymous tracking)
create policy "Anyone can record a click" on content_clicks
  for insert with check (true);

-- Admins can read (via service role)
create policy "Admin read access" on content_clicks
  for select using (auth.role() = 'service_role');

------------------------------------------------------------
-- 4. Audit log for admin actions
------------------------------------------------------------
create table if not exists audit_log (
  id uuid default gen_random_uuid() primary key,
  actor_email text,
  action text not null,                    -- 'create' | 'update' | 'delete' | 'reorder' | ...
  resource_type text not null,             -- 'book' | 'lecture' | 'category' | 'page' | ...
  resource_id text,
  resource_title text,
  details jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_log_time on audit_log(created_at desc);
create index if not exists idx_audit_log_resource on audit_log(resource_type, resource_id);

alter table audit_log enable row level security;

-- Only service role can insert and read audit entries
create policy "Admin write access" on audit_log
  for all using (auth.role() = 'service_role');
