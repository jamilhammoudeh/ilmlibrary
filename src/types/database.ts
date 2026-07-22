// Plain row types for the D1 (SQLite) database.
// Booleans are stored as INTEGER 0/1 in D1 and coerced to boolean at the
// query/API boundary (src/lib/d1-helpers.ts), so app code keeps `boolean`.

export type ContentType = "book" | "lecture" | "khutba" | "dua" | "wisdom" | "guide";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  content_type: ContentType;
  image_url: string | null;
  hidden: boolean;
  parent_id: string | null;
  sort_order: number;
  name_ar: string | null;
  created_at: string;
};

export type Book = {
  id: string;
  title: string;
  slug: string;
  author: string;
  translator: string | null;
  description: string | null;
  cover_url: string | null;
  pdf_url: string | null;
  category_id: string | null;
  display_order: number;
  language: string; // 'en' | 'ar'
  source: string | null; // 'legacy' | 'waqfeya' | 'islamhouse' | 'archive-org' | null
  source_url: string | null;
  title_alt: string | null; // transliterated/English title for Arabic books
  pages: number | null;
  published_year: number | null;
  purchase_url: string | null; // affiliate/store link for the print edition
  created_at: string;
};

export type Sponsor = {
  id: string;
  name: string;
  tagline: string | null;
  url: string;
  image_url: string | null;
  type: "business" | "book" | "publisher";
  placement: "homepage" | "books" | "both";
  active: boolean;
  sort_order: number;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
};

export type Lecture = {
  id: string;
  title: string;
  slug: string;
  speaker: string;
  description: string | null;
  audio_url: string | null;
  video_url: string | null;
  category_id: string | null;
  created_at: string;
};

export type Khutba = {
  id: string;
  title: string;
  slug: string;
  speaker: string;
  description: string | null;
  audio_url: string | null;
  video_url: string | null;
  category_id: string | null;
  created_at: string;
};

export type Dua = {
  id: string;
  title: string | null;
  arabic_text: string;
  translation: string;
  transliteration: string | null;
  source: string | null;
  category_id: string | null;
  created_at: string;
};

export type Wisdom = {
  id: string;
  quote_arabic: string | null;
  quote_english: string;
  attribution: string;
  source: string | null;
  category_id: string | null;
  created_at: string;
};

export type Guide = {
  id: string;
  title: string;
  slug: string;
  content: string;
  category_id: string | null;
  order: number;
  created_at: string;
};

export type Page = {
  id: string;
  slug: string;
  parent_id: string | null;
  title: string;
  subtitle: string | null;
  hero_image_url: string | null;
  body: string | null;
  meta_description: string | null;
  sort_order: number;
  hidden: boolean;
  created_at: string;
  updated_at: string;
};

export type PageView = {
  id: string;
  path: string;
  visited_at: string;
  referrer: string | null;
  visitor_id: string | null;
  user_agent: string | null;
};

export type ContentClick = {
  id: string;
  content_type: string;
  content_id: string;
  path: string | null;
  visitor_id: string | null;
  clicked_at: string;
};

export type AuditLogEntry = {
  id: string;
  actor_email: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  resource_title: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
};

export type LinkCheckResult = {
  id: string;
  resource_type: "book" | "lecture" | "khutba";
  resource_id: string;
  field: "cover_url" | "pdf_url" | "audio_url" | "video_url";
  url: string;
  status: "ok" | "broken" | "timeout" | "error";
  http_code: number | null;
  error_message: string | null;
  checked_at: string;
};

// Common shape for a book row joined with its category slug/name.
export type BookWithCategory = Book & {
  category_slug: string | null;
  category_name: string | null;
};
