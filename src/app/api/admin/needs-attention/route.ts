import { requireAdmin } from "@/lib/access-auth";
import { getDb } from "@/lib/db";

// Content-health lists in a single payload: items missing required fields or
// media, empty categories, and broken link-check results joined back to the
// owning item's title so the client never has to re-query.

const BROKEN_STATUSES = "('broken','timeout','error')";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (admin instanceof Response) return admin;

  const db = await getDb();
  const [
    booksNoPdfR,
    booksNoCoverR,
    booksNoDescR,
    booksNoCategoryR,
    lecturesNoMediaR,
    khutbasNoMediaR,
    duasNoArabicR,
    duasNoTranslationR,
    wisdomNoQuoteR,
    pagesNoBodyR,
    brokenBooksR,
    brokenLecturesR,
    brokenKhutbasR,
    emptyBookCatsR,
    emptyLectureCatsR,
    emptyKhutbaCatsR,
    emptyDuaCatsR,
    emptyWisdomCatsR,
    emptyGuideCatsR,
  ] = await db.batch<Record<string, unknown>>([
    db.prepare(`SELECT id, title, author FROM books WHERE pdf_url IS NULL LIMIT 50`),
    db.prepare(`SELECT id, title, author FROM books WHERE cover_url IS NULL LIMIT 50`),
    db.prepare(`SELECT id, title, author FROM books WHERE description IS NULL LIMIT 50`),
    db.prepare(`SELECT id, title, author FROM books WHERE category_id IS NULL LIMIT 50`),
    db.prepare(
      `SELECT id, title, speaker FROM lectures WHERE audio_url IS NULL AND video_url IS NULL LIMIT 30`
    ),
    db.prepare(
      `SELECT id, title, speaker FROM khutbas WHERE audio_url IS NULL AND video_url IS NULL LIMIT 30`
    ),
    db.prepare(`SELECT id, title, translation FROM duas WHERE arabic_text IS NULL LIMIT 30`),
    db.prepare(`SELECT id, title, arabic_text FROM duas WHERE translation IS NULL LIMIT 30`),
    db.prepare(`SELECT id, attribution FROM wisdom WHERE quote_english IS NULL LIMIT 30`),
    db.prepare(`SELECT id, slug, title FROM pages WHERE body IS NULL LIMIT 30`),
    db.prepare(
      `SELECT r.resource_type, r.resource_id, r.field, r.status, b.title AS title, b.author AS subtitle
       FROM link_check_results r JOIN books b ON b.id = r.resource_id
       WHERE r.resource_type = 'book' AND r.status IN ${BROKEN_STATUSES} LIMIT 500`
    ),
    db.prepare(
      `SELECT r.resource_type, r.resource_id, r.field, r.status, l.title AS title, l.speaker AS subtitle
       FROM link_check_results r JOIN lectures l ON l.id = r.resource_id
       WHERE r.resource_type = 'lecture' AND r.status IN ${BROKEN_STATUSES} LIMIT 500`
    ),
    db.prepare(
      `SELECT r.resource_type, r.resource_id, r.field, r.status, k.title AS title, k.speaker AS subtitle
       FROM link_check_results r JOIN khutbas k ON k.id = r.resource_id
       WHERE r.resource_type = 'khutba' AND r.status IN ${BROKEN_STATUSES} LIMIT 500`
    ),
    db.prepare(
      `SELECT c.id, c.name, c.content_type FROM categories c
       WHERE c.content_type = 'book' AND NOT EXISTS (SELECT 1 FROM books t WHERE t.category_id = c.id)`
    ),
    db.prepare(
      `SELECT c.id, c.name, c.content_type FROM categories c
       WHERE c.content_type = 'lecture' AND NOT EXISTS (SELECT 1 FROM lectures t WHERE t.category_id = c.id)`
    ),
    db.prepare(
      `SELECT c.id, c.name, c.content_type FROM categories c
       WHERE c.content_type = 'khutba' AND NOT EXISTS (SELECT 1 FROM khutbas t WHERE t.category_id = c.id)`
    ),
    db.prepare(
      `SELECT c.id, c.name, c.content_type FROM categories c
       WHERE c.content_type = 'dua' AND NOT EXISTS (SELECT 1 FROM duas t WHERE t.category_id = c.id)`
    ),
    db.prepare(
      `SELECT c.id, c.name, c.content_type FROM categories c
       WHERE c.content_type = 'wisdom' AND NOT EXISTS (SELECT 1 FROM wisdom t WHERE t.category_id = c.id)`
    ),
    db.prepare(
      `SELECT c.id, c.name, c.content_type FROM categories c
       WHERE c.content_type = 'guide' AND NOT EXISTS (SELECT 1 FROM guides t WHERE t.category_id = c.id)`
    ),
  ]);

  const rows = (r: { results?: Record<string, unknown>[] }) => r.results ?? [];

  return Response.json({
    books_missing_pdf: rows(booksNoPdfR),
    books_missing_cover: rows(booksNoCoverR),
    books_missing_description: rows(booksNoDescR),
    books_missing_category: rows(booksNoCategoryR),
    lectures_missing_media: rows(lecturesNoMediaR),
    khutbas_missing_media: rows(khutbasNoMediaR),
    duas_missing_arabic: rows(duasNoArabicR),
    duas_missing_translation: rows(duasNoTranslationR),
    wisdom_missing_quote: rows(wisdomNoQuoteR),
    pages_missing_body: rows(pagesNoBodyR),
    empty_categories: [
      ...rows(emptyBookCatsR),
      ...rows(emptyLectureCatsR),
      ...rows(emptyKhutbaCatsR),
      ...rows(emptyDuaCatsR),
      ...rows(emptyWisdomCatsR),
      ...rows(emptyGuideCatsR),
    ],
    broken_links: [...rows(brokenBooksR), ...rows(brokenLecturesR), ...rows(brokenKhutbasR)],
  });
}
