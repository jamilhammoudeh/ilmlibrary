-- Ilm Library Database Schema
-- Run this in the Supabase SQL Editor to set up your database

-- Categories (shared across content types)
create table categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  content_type text not null check (content_type in ('book', 'lecture', 'khutba', 'dua', 'wisdom', 'guide')),
  image_url text,
  hidden boolean not null default false,
  created_at timestamptz default now()
);

-- Books
create table books (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  author text not null,
  translator text,
  description text,
  cover_url text,
  pdf_url text,
  category_id uuid references categories(id) on delete set null,
  created_at timestamptz default now()
);

-- Lectures
create table lectures (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  speaker text not null,
  description text,
  audio_url text,
  video_url text,
  category_id uuid references categories(id) on delete set null,
  created_at timestamptz default now()
);

-- Khutbas
create table khutbas (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  speaker text not null,
  description text,
  audio_url text,
  video_url text,
  category_id uuid references categories(id) on delete set null,
  created_at timestamptz default now()
);

-- Duas
create table duas (
  id uuid default gen_random_uuid() primary key,
  title text,
  arabic_text text not null,
  translation text not null,
  transliteration text,
  source text,
  category_id uuid references categories(id) on delete set null,
  created_at timestamptz default now()
);

-- Wisdom quotes
create table wisdom (
  id uuid default gen_random_uuid() primary key,
  quote_arabic text,
  quote_english text not null,
  attribution text not null,
  source text,
  category_id uuid references categories(id) on delete set null,
  created_at timestamptz default now()
);

-- Guides
create table guides (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  content text not null,
  category_id uuid references categories(id) on delete set null,
  "order" int default 0,
  created_at timestamptz default now()
);

-- Indexes for common queries
create index idx_books_category on books(category_id);
create index idx_books_slug on books(slug);
create index idx_lectures_category on lectures(category_id);
create index idx_khutbas_category on khutbas(category_id);
create index idx_duas_category on duas(category_id);
create index idx_wisdom_category on wisdom(category_id);
create index idx_guides_category on guides(category_id);
create index idx_categories_content_type on categories(content_type);
create index idx_categories_slug on categories(slug);

-- Full text search on books
alter table books add column fts tsvector
  generated always as (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(author, '') || ' ' || coalesce(description, ''))) stored;
create index idx_books_fts on books using gin(fts);

-- Enable Row Level Security
alter table categories enable row level security;
alter table books enable row level security;
alter table lectures enable row level security;
alter table khutbas enable row level security;
alter table duas enable row level security;
alter table wisdom enable row level security;
alter table guides enable row level security;

-- Public read access for all tables
create policy "Public read access" on categories for select using (true);
create policy "Public read access" on books for select using (true);
create policy "Public read access" on lectures for select using (true);
create policy "Public read access" on khutbas for select using (true);
create policy "Public read access" on duas for select using (true);
create policy "Public read access" on wisdom for select using (true);
create policy "Public read access" on guides for select using (true);

-- Admin write access (authenticated users with service role)
create policy "Admin write access" on categories for all using (auth.role() = 'service_role');
create policy "Admin write access" on books for all using (auth.role() = 'service_role');
create policy "Admin write access" on lectures for all using (auth.role() = 'service_role');
create policy "Admin write access" on khutbas for all using (auth.role() = 'service_role');
create policy "Admin write access" on duas for all using (auth.role() = 'service_role');
create policy "Admin write access" on wisdom for all using (auth.role() = 'service_role');
create policy "Admin write access" on guides for all using (auth.role() = 'service_role');
