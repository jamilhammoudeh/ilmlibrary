// Public read-side query layer over D1. Server components and public API
// routes go through these helpers; admin writes live in the /api/admin routes.

import { getDb } from "@/lib/db";
import { fromDbRow, fromDbRows, likePattern, placeholders } from "@/lib/d1-helpers";
import type {
  Book,
  BookWithCategory,
  Category,
  ContentType,
  Dua,
  Guide,
  Khutba,
  Lecture,
  Page,
  Sponsor,
  Wisdom,
} from "@/types/database";

type Row = Record<string, unknown>;

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export async function getCategories(opts?: {
  contentType?: ContentType;
  includeHidden?: boolean;
  orderBy?: "name" | "sort" | "type_sort_name";
}): Promise<Category[]> {
  const db = await getDb();
  const where: string[] = [];
  const binds: unknown[] = [];
  if (opts?.contentType) {
    where.push("content_type = ?");
    binds.push(opts.contentType);
  }
  if (!opts?.includeHidden) {
    where.push("hidden = 0");
  }
  const order =
    opts?.orderBy === "sort"
      ? "sort_order, name COLLATE NOCASE"
      : opts?.orderBy === "type_sort_name"
        ? "content_type, sort_order, name COLLATE NOCASE"
        : "name COLLATE NOCASE";
  const sql = `SELECT * FROM categories${where.length ? ` WHERE ${where.join(" AND ")}` : ""} ORDER BY ${order}`;
  const { results } = await db.prepare(sql).bind(...binds).all<Row>();
  return fromDbRows<Category>("categories", results);
}

export async function getCategoryBySlug(
  slug: string,
  contentType?: ContentType
): Promise<Category | null> {
  const db = await getDb();
  const sql = contentType
    ? "SELECT * FROM categories WHERE slug = ? AND content_type = ? LIMIT 1"
    : "SELECT * FROM categories WHERE slug = ? LIMIT 1";
  const binds = contentType ? [slug, contentType] : [slug];
  const row = await db.prepare(sql).bind(...binds).first<Row>();
  return row ? fromDbRow<Category>("categories", row) : null;
}

export async function getCategoriesByIds(
  ids: string[]
): Promise<Pick<Category, "id" | "slug" | "name">[]> {
  if (ids.length === 0) return [];
  const db = await getDb();
  const { results } = await db
    .prepare(`SELECT id, slug, name FROM categories WHERE id IN (${placeholders(ids.length)})`)
    .bind(...ids)
    .all<Row>();
  return results as unknown as Pick<Category, "id" | "slug" | "name">[];
}

// ---------------------------------------------------------------------------
// Books
// ---------------------------------------------------------------------------

export type BookSort = "default" | "newest" | "title";

function bookOrderClause(sort: BookSort | undefined, scopedToCategory: boolean): string {
  switch (sort) {
    case "newest":
      return "created_at DESC";
    case "title":
      return "title COLLATE NOCASE";
    default:
      // display_order is meaningful within a category; fall back to title globally.
      return scopedToCategory ? "display_order, title COLLATE NOCASE" : "title COLLATE NOCASE";
  }
}

export async function getBooksPage(opts: {
  categoryId?: string;
  lang?: string;
  q?: string;
  sort?: BookSort;
  offset?: number;
  limit?: number;
  withCount?: boolean;
}): Promise<{ rows: Book[]; total: number | null }> {
  const db = await getDb();
  const where: string[] = [];
  const binds: unknown[] = [];
  if (opts.categoryId) {
    where.push("category_id = ?");
    binds.push(opts.categoryId);
  }
  if (opts.lang) {
    where.push("language = ?");
    binds.push(opts.lang);
  }
  if (opts.q && opts.q.trim()) {
    where.push(
      "(title LIKE ? ESCAPE '\\' OR author LIKE ? ESCAPE '\\' OR title_alt LIKE ? ESCAPE '\\')"
    );
    const p = likePattern(opts.q);
    binds.push(p, p, p);
  }
  const whereSql = where.length ? ` WHERE ${where.join(" AND ")}` : "";
  const order = bookOrderClause(opts.sort, Boolean(opts.categoryId));
  const limit = Math.min(opts.limit ?? 60, 200);
  const offset = Math.max(opts.offset ?? 0, 0);

  const { results } = await db
    .prepare(`SELECT * FROM books${whereSql} ORDER BY ${order} LIMIT ? OFFSET ?`)
    .bind(...binds, limit, offset)
    .all<Row>();

  let total: number | null = null;
  if (opts.withCount) {
    const countRow = await db
      .prepare(`SELECT COUNT(*) AS n FROM books${whereSql}`)
      .bind(...binds)
      .first<{ n: number }>();
    total = countRow?.n ?? 0;
  }
  return { rows: fromDbRows<Book>("books", results), total };
}

export async function getBookBySlug(slug: string): Promise<BookWithCategory | null> {
  const db = await getDb();
  const row = await db
    .prepare(
      `SELECT b.*, c.slug AS category_slug, c.name AS category_name
       FROM books b LEFT JOIN categories c ON c.id = b.category_id
       WHERE b.slug = ? LIMIT 1`
    )
    .bind(slug)
    .first<Row>();
  return row ? fromDbRow<BookWithCategory>("books", row) : null;
}

export async function getBooksByIds(ids: string[]): Promise<Book[]> {
  if (ids.length === 0) return [];
  const db = await getDb();
  const { results } = await db
    .prepare(`SELECT * FROM books WHERE id IN (${placeholders(ids.length)})`)
    .bind(...ids)
    .all<Row>();
  return fromDbRows<Book>("books", results);
}

export async function getNewBooks(limit: number, lang?: string): Promise<Book[]> {
  const db = await getDb();
  const sql = lang
    ? "SELECT * FROM books WHERE language = ? ORDER BY created_at DESC LIMIT ?"
    : "SELECT * FROM books ORDER BY created_at DESC LIMIT ?";
  const binds = lang ? [lang, limit] : [limit];
  const { results } = await db.prepare(sql).bind(...binds).all<Row>();
  return fromDbRows<Book>("books", results);
}

export async function getRelatedBooks(
  categoryId: string,
  excludeBookId: string,
  limit: number
): Promise<Book[]> {
  const db = await getDb();
  const { results } = await db
    .prepare(
      `SELECT * FROM books WHERE category_id = ? AND id != ?
       ORDER BY display_order, title COLLATE NOCASE LIMIT ?`
    )
    .bind(categoryId, excludeBookId, limit)
    .all<Row>();
  return fromDbRows<Book>("books", results);
}

/** Recent books with their category slug (RSS feed). */
export async function getRecentBooksWithCategory(limit: number): Promise<BookWithCategory[]> {
  const db = await getDb();
  const { results } = await db
    .prepare(
      `SELECT b.*, c.slug AS category_slug, c.name AS category_name
       FROM books b LEFT JOIN categories c ON c.id = b.category_id
       ORDER BY b.created_at DESC LIMIT ?`
    )
    .bind(limit)
    .all<Row>();
  return fromDbRows<BookWithCategory>("books", results);
}

/** All book slugs with category slug (sitemap). */
export async function getAllBookSlugs(
  limit = 10000
): Promise<{ slug: string; created_at: string; category_slug: string | null }[]> {
  const db = await getDb();
  const { results } = await db
    .prepare(
      `SELECT b.slug, b.created_at, c.slug AS category_slug
       FROM books b LEFT JOIN categories c ON c.id = b.category_id LIMIT ?`
    )
    .bind(limit)
    .all<Row>();
  return results as unknown as { slug: string; created_at: string; category_slug: string | null }[];
}

// ---------------------------------------------------------------------------
// Authors
// ---------------------------------------------------------------------------

export async function getAuthorsIndex(
  lang?: string
): Promise<{ author: string; language: string; count: number }[]> {
  const db = await getDb();
  const sql = lang
    ? `SELECT author, language, COUNT(*) AS count FROM books WHERE language = ?
       GROUP BY author, language ORDER BY author COLLATE NOCASE`
    : `SELECT author, language, COUNT(*) AS count FROM books
       GROUP BY author, language ORDER BY author COLLATE NOCASE`;
  const binds = lang ? [lang] : [];
  const { results } = await db.prepare(sql).bind(...binds).all<Row>();
  return results as unknown as { author: string; language: string; count: number }[];
}

export async function getBooksByAuthor(author: string, lang?: string): Promise<Book[]> {
  const db = await getDb();
  const sql = lang
    ? "SELECT * FROM books WHERE author = ? AND language = ? ORDER BY title COLLATE NOCASE"
    : "SELECT * FROM books WHERE author = ? ORDER BY title COLLATE NOCASE";
  const binds = lang ? [author, lang] : [author];
  const { results } = await db.prepare(sql).bind(...binds).all<Row>();
  return fromDbRows<Book>("books", results);
}

// ---------------------------------------------------------------------------
// Media (lectures / khutbas)
// ---------------------------------------------------------------------------

export async function getLecturesByCategory(categoryId: string): Promise<Lecture[]> {
  const db = await getDb();
  const { results } = await db
    .prepare("SELECT * FROM lectures WHERE category_id = ? ORDER BY title COLLATE NOCASE")
    .bind(categoryId)
    .all<Row>();
  return results as unknown as Lecture[];
}

export async function getKhutbasByCategory(categoryId: string): Promise<Khutba[]> {
  const db = await getDb();
  const { results } = await db
    .prepare("SELECT * FROM khutbas WHERE category_id = ? ORDER BY title COLLATE NOCASE")
    .bind(categoryId)
    .all<Row>();
  return results as unknown as Khutba[];
}

// ---------------------------------------------------------------------------
// Duas / Wisdom / Guides
// ---------------------------------------------------------------------------

export async function getDuas(opts?: { categoryId?: string; limit?: number }): Promise<Dua[]> {
  const db = await getDb();
  const where: string[] = [];
  const binds: unknown[] = [];
  if (opts?.categoryId) {
    where.push("category_id = ?");
    binds.push(opts.categoryId);
  }
  const whereSql = where.length ? ` WHERE ${where.join(" AND ")}` : "";
  const limit = opts?.limit ?? 500;
  const { results } = await db
    .prepare(`SELECT * FROM duas${whereSql} ORDER BY created_at LIMIT ?`)
    .bind(...binds, limit)
    .all<Row>();
  return results as unknown as Dua[];
}

export async function getWisdom(opts?: { categoryId?: string; limit?: number }): Promise<Wisdom[]> {
  const db = await getDb();
  const where: string[] = [];
  const binds: unknown[] = [];
  if (opts?.categoryId) {
    where.push("category_id = ?");
    binds.push(opts.categoryId);
  }
  const whereSql = where.length ? ` WHERE ${where.join(" AND ")}` : "";
  const limit = opts?.limit ?? 500;
  const { results } = await db
    .prepare(`SELECT * FROM wisdom${whereSql} ORDER BY attribution COLLATE NOCASE LIMIT ?`)
    .bind(...binds, limit)
    .all<Row>();
  return results as unknown as Wisdom[];
}

export async function getGuides(categoryId?: string): Promise<Guide[]> {
  const db = await getDb();
  const sql = categoryId
    ? `SELECT * FROM guides WHERE category_id = ? ORDER BY "order", title COLLATE NOCASE`
    : `SELECT * FROM guides ORDER BY "order", title COLLATE NOCASE`;
  const binds = categoryId ? [categoryId] : [];
  const { results } = await db.prepare(sql).bind(...binds).all<Row>();
  return results as unknown as Guide[];
}

export async function getGuideBySlug(slug: string): Promise<Guide | null> {
  const db = await getDb();
  const row = await db.prepare("SELECT * FROM guides WHERE slug = ? LIMIT 1").bind(slug).first<Row>();
  return (row as unknown as Guide) ?? null;
}

// ---------------------------------------------------------------------------
// Pages (CMS)
// ---------------------------------------------------------------------------

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const db = await getDb();
  const row = await db.prepare("SELECT * FROM pages WHERE slug = ? LIMIT 1").bind(slug).first<Row>();
  return row ? fromDbRow<Page>("pages", row) : null;
}

export async function getPages(opts?: { includeHidden?: boolean }): Promise<Page[]> {
  const db = await getDb();
  const whereSql = opts?.includeHidden ? "" : " WHERE hidden = 0";
  const { results } = await db
    .prepare(`SELECT * FROM pages${whereSql} ORDER BY sort_order, title COLLATE NOCASE`)
    .all<Row>();
  return fromDbRows<Page>("pages", results);
}

/** Book counts per category per language (for hiding empty categories). */
export async function getBookLangCounts(): Promise<
  { category_id: string; language: string; n: number }[]
> {
  const db = await getDb();
  const { results } = await db
    .prepare(
      "SELECT category_id, language, COUNT(*) AS n FROM books WHERE category_id IS NOT NULL GROUP BY category_id, language"
    )
    .all<Row>();
  return results as unknown as { category_id: string; language: string; n: number }[];
}

// ---------------------------------------------------------------------------
// Sponsors
// ---------------------------------------------------------------------------

/** Active sponsors for a placement, respecting optional start/end windows. */
export async function getActiveSponsors(
  placement: "homepage" | "books",
  limit = 4
): Promise<Sponsor[]> {
  const db = await getDb();
  const now = new Date().toISOString();
  const { results } = await db
    .prepare(
      `SELECT * FROM sponsors
       WHERE active = 1
         AND (placement = ? OR placement = 'both')
         AND (starts_at IS NULL OR starts_at <= ?)
         AND (ends_at IS NULL OR ends_at >= ?)
       ORDER BY sort_order, created_at LIMIT ?`
    )
    .bind(placement, now, now, limit)
    .all<Row>();
  return fromDbRows<Sponsor>("sponsors", results);
}

// ---------------------------------------------------------------------------
// Search (site-wide)
// ---------------------------------------------------------------------------

export type SearchResults = {
  books: Pick<Book, "id" | "title" | "slug" | "author" | "cover_url" | "category_id" | "language" | "title_alt">[];
  lectures: Pick<Lecture, "id" | "title" | "slug" | "speaker" | "description">[];
  khutbas: Pick<Khutba, "id" | "title" | "slug" | "speaker" | "description">[];
  duas: Pick<Dua, "id" | "title" | "translation" | "source">[];
  wisdom: Pick<Wisdom, "id" | "quote_english" | "attribution" | "source">[];
  guides: Pick<Guide, "id" | "title" | "slug">[];
};

export async function searchAll(q: string, perType = 12): Promise<SearchResults> {
  const db = await getDb();
  const p = likePattern(q);
  const like = (col: string) => `${col} LIKE ? ESCAPE '\\'`;

  const [books, lectures, khutbas, duas, wisdom, guides] = await db.batch<Row>([
    db
      .prepare(
        `SELECT id, title, slug, author, cover_url, category_id, language, title_alt FROM books
         WHERE ${like("title")} OR ${like("author")} OR ${like("description")} OR ${like("title_alt")}
         ORDER BY title COLLATE NOCASE LIMIT ?`
      )
      .bind(p, p, p, p, perType),
    db
      .prepare(
        `SELECT id, title, slug, speaker, description FROM lectures
         WHERE ${like("title")} OR ${like("speaker")} OR ${like("description")} LIMIT ?`
      )
      .bind(p, p, p, perType),
    db
      .prepare(
        `SELECT id, title, slug, speaker, description FROM khutbas
         WHERE ${like("title")} OR ${like("speaker")} OR ${like("description")} LIMIT ?`
      )
      .bind(p, p, p, perType),
    db
      .prepare(
        `SELECT id, title, translation, source FROM duas
         WHERE ${like("title")} OR ${like("translation")} OR ${like("source")} LIMIT ?`
      )
      .bind(p, p, p, perType),
    db
      .prepare(
        `SELECT id, quote_english, attribution, source FROM wisdom
         WHERE ${like("quote_english")} OR ${like("attribution")} OR ${like("source")} LIMIT ?`
      )
      .bind(p, p, p, perType),
    db
      .prepare(`SELECT id, title, slug FROM guides WHERE ${like("title")} OR ${like("content")} LIMIT ?`)
      .bind(p, p, perType),
  ]);

  return {
    books: (books.results ?? []) as unknown as SearchResults["books"],
    lectures: (lectures.results ?? []) as unknown as SearchResults["lectures"],
    khutbas: (khutbas.results ?? []) as unknown as SearchResults["khutbas"],
    duas: (duas.results ?? []) as unknown as SearchResults["duas"],
    wisdom: (wisdom.results ?? []) as unknown as SearchResults["wisdom"],
    guides: (guides.results ?? []) as unknown as SearchResults["guides"],
  };
}
