-- Ilm Library — Pages & subcategories migration
-- Run this in the Supabase SQL Editor AFTER the main schema.

------------------------------------------------------------
-- 1. Add subcategory support to `categories`
------------------------------------------------------------
alter table categories
  add column if not exists parent_id uuid references categories(id) on delete set null;

create index if not exists idx_categories_parent on categories(parent_id);

------------------------------------------------------------
-- 2. New `pages` table for editable site pages
--    Supports hierarchy via parent_id (page > sub-page).
------------------------------------------------------------
create table if not exists pages (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  parent_id uuid references pages(id) on delete set null,
  title text not null,
  subtitle text,
  hero_image_url text,
  body text,
  meta_description text,
  sort_order int not null default 0,
  hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_pages_parent on pages(parent_id);
create index if not exists idx_pages_slug on pages(slug);
create index if not exists idx_pages_sort on pages(sort_order);

-- Auto-update updated_at on row change
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists pages_updated_at on pages;
create trigger pages_updated_at
  before update on pages
  for each row execute function set_updated_at();

-- RLS
alter table pages enable row level security;

-- If you already ran this migration with the restrictive policy, drop the old one:
drop policy if exists "Public read access" on pages;

-- Fully public read (consistent with books/lectures/etc). Filter hidden pages
-- at query time in the app code. Admin sees all rows.
create policy "Public read access" on pages for select using (true);
create policy "Admin write access" on pages for all using (auth.role() = 'service_role');

------------------------------------------------------------
-- 3. Seed the pages table with the existing site sections
--    so an admin has a starting list to edit.
------------------------------------------------------------
insert into pages (slug, title, subtitle, sort_order) values
  ('home', 'Ilm Library', 'Access Islamic Knowledge and Resources', 0),
  ('about', 'About', 'About Ilm Library', 10),
  ('donate', 'Donate', 'Support Ilm Library', 20),
  ('why-islam', 'Why Islam?', 'Answers to the biggest questions', 30),
  ('guides', 'Islamic Guides', 'Step-by-step guides', 40)
on conflict (slug) do nothing;

-- Sub-pages under why-islam
insert into pages (slug, title, parent_id, sort_order)
select s.slug, s.title,
       (select id from pages where slug = 'why-islam'),
       s.sort_order
from (values
  ('why-islam/proving-islam', 'Proving Islam', 1),
  ('why-islam/defending-islam', 'Defending Islam', 2),
  ('why-islam/refutations', 'Refutations', 3)
) as s(slug, title, sort_order)
on conflict (slug) do nothing;
