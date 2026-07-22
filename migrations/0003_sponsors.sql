-- Sponsorship & affiliate monetization
CREATE TABLE sponsors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  url TEXT NOT NULL,
  image_url TEXT,
  type TEXT NOT NULL DEFAULT 'business', -- 'business' | 'book' | 'publisher'
  placement TEXT NOT NULL DEFAULT 'homepage', -- 'homepage' | 'books' | 'both'
  active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  starts_at TEXT,
  ends_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_sponsors_active ON sponsors(active, placement, sort_order);

-- Per-book affiliate/purchase link ("Get the printed copy")
ALTER TABLE books ADD COLUMN purchase_url TEXT;
