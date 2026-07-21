-- Ilm Library — D1 (SQLite) schema
-- Converted from the Supabase/Postgres schema:
--   supabase-schema.sql + supabase-migration-{pages,admin-improvements,audit-and-links}.sql
--   + live-schema drift captured in src/types/database.ts (books.display_order,
--     categories.hidden/sort_order/parent_id, page_views extra columns).
-- Conversions: uuid -> TEXT (app generates crypto.randomUUID()),
--   timestamptz -> TEXT ISO-8601 UTC, boolean -> INTEGER 0/1, jsonb -> TEXT.
-- The Postgres tsvector FTS column is intentionally dropped (unused; search is LIKE).
-- New expansion columns for the Arabic library are included up front:
--   books: language, source, source_url, title_alt, pages, published_year
--   categories: name_ar

CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('book', 'lecture', 'khutba', 'dua', 'wisdom', 'guide')),
  image_url TEXT,
  hidden INTEGER NOT NULL DEFAULT 0,
  parent_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  name_ar TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  author TEXT NOT NULL,
  translator TEXT,
  description TEXT,
  cover_url TEXT,
  pdf_url TEXT,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  language TEXT NOT NULL DEFAULT 'en',
  source TEXT,
  source_url TEXT,
  title_alt TEXT,
  pages INTEGER,
  published_year INTEGER,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE lectures (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  speaker TEXT NOT NULL,
  description TEXT,
  audio_url TEXT,
  video_url TEXT,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE khutbas (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  speaker TEXT NOT NULL,
  description TEXT,
  audio_url TEXT,
  video_url TEXT,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE duas (
  id TEXT PRIMARY KEY,
  title TEXT,
  arabic_text TEXT NOT NULL,
  translation TEXT NOT NULL,
  transliteration TEXT,
  source TEXT,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE wisdom (
  id TEXT PRIMARY KEY,
  quote_arabic TEXT,
  quote_english TEXT NOT NULL,
  attribution TEXT NOT NULL,
  source TEXT,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE guides (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE pages (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  parent_id TEXT REFERENCES pages(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  hero_image_url TEXT,
  body TEXT,
  meta_description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  hidden INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  -- updated_at is set explicitly by the pages update handler (no triggers in D1 app flow).
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE page_views (
  id TEXT PRIMARY KEY,
  path TEXT NOT NULL,
  visited_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  referrer TEXT,
  visitor_id TEXT,
  user_agent TEXT
);

CREATE TABLE content_clicks (
  id TEXT PRIMARY KEY,
  content_type TEXT NOT NULL,
  content_id TEXT NOT NULL,
  path TEXT,
  visitor_id TEXT,
  clicked_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE audit_log (
  id TEXT PRIMARY KEY,
  actor_email TEXT,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  resource_title TEXT,
  details TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE link_check_results (
  id TEXT PRIMARY KEY,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  field TEXT NOT NULL,
  url TEXT NOT NULL,
  status TEXT NOT NULL,
  http_code INTEGER,
  error_message TEXT,
  checked_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (resource_type, resource_id, field)
);

-- Indexes (mirrors Postgres, minus the dropped FTS gin index)
CREATE INDEX idx_books_category ON books(category_id);
CREATE INDEX idx_books_slug ON books(slug);
CREATE INDEX idx_books_language ON books(language);
CREATE INDEX idx_books_lang_cat ON books(language, category_id);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_lectures_category ON lectures(category_id);
CREATE INDEX idx_khutbas_category ON khutbas(category_id);
CREATE INDEX idx_duas_category ON duas(category_id);
CREATE INDEX idx_wisdom_category ON wisdom(category_id);
CREATE INDEX idx_guides_category ON guides(category_id);
CREATE INDEX idx_categories_content_type ON categories(content_type);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_sort ON categories(sort_order);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_pages_parent ON pages(parent_id);
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_sort ON pages(sort_order);
CREATE INDEX idx_page_views_time ON page_views(visited_at DESC);
CREATE INDEX idx_page_views_path ON page_views(path);
CREATE INDEX idx_page_views_visitor ON page_views(visitor_id);
CREATE INDEX idx_content_clicks_type_id ON content_clicks(content_type, content_id);
CREATE INDEX idx_content_clicks_time ON content_clicks(clicked_at DESC);
CREATE INDEX idx_audit_log_time ON audit_log(created_at DESC);
CREATE INDEX idx_audit_log_resource ON audit_log(resource_type, resource_id);
CREATE INDEX idx_link_check_status ON link_check_results(status);
CREATE INDEX idx_link_check_time ON link_check_results(checked_at DESC);
CREATE INDEX idx_link_check_resource ON link_check_results(resource_type, resource_id);
