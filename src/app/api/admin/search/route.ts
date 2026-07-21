import { requireAdmin } from "@/lib/access-auth";
import { getDb } from "@/lib/db";
import { likePattern } from "@/lib/d1-helpers";

// Cross-table search for the command palette. Returns small per-type arrays
// with exactly the fields the palette renders.

const EMPTY = {
  books: [],
  lectures: [],
  khutbas: [],
  duas: [],
  wisdom: [],
  pages: [],
};

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (admin instanceof Response) return admin;

  const q = (new URL(request.url).searchParams.get("q") ?? "").trim();
  if (q.length < 2) return Response.json(EMPTY);

  const like = likePattern(q);
  const db = await getDb();
  const [booksR, lecturesR, khutbasR, duasR, wisdomR, pagesR] = await db.batch<
    Record<string, unknown>
  >([
    db
      .prepare(`SELECT id, title, author FROM books WHERE title LIKE ? ESCAPE '\\' LIMIT 5`)
      .bind(like),
    db
      .prepare(`SELECT id, title, speaker FROM lectures WHERE title LIKE ? ESCAPE '\\' LIMIT 5`)
      .bind(like),
    db
      .prepare(`SELECT id, title, speaker FROM khutbas WHERE title LIKE ? ESCAPE '\\' LIMIT 5`)
      .bind(like),
    db
      .prepare(`SELECT id, title, translation FROM duas WHERE translation LIKE ? ESCAPE '\\' LIMIT 5`)
      .bind(like),
    db
      .prepare(
        `SELECT id, quote_english, attribution FROM wisdom WHERE quote_english LIKE ? ESCAPE '\\' LIMIT 5`
      )
      .bind(like),
    db
      .prepare(`SELECT id, title, slug, subtitle FROM pages WHERE title LIKE ? ESCAPE '\\' LIMIT 5`)
      .bind(like),
  ]);

  return Response.json({
    books: booksR.results ?? [],
    lectures: lecturesR.results ?? [],
    khutbas: khutbasR.results ?? [],
    duas: duasR.results ?? [],
    wisdom: wisdomR.results ?? [],
    pages: pagesR.results ?? [],
  });
}
