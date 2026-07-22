import { getBooksByIds } from "@/lib/queries";
import { getDb } from "@/lib/db";
import { fromDbRows, placeholders } from "@/lib/d1-helpers";
import type { Book } from "@/types/database";

// Public: fetch a set of books by id or slug (bookmarks/lists, continue-reading).
// ?ids=a,b,c or ?slugs=x,y,z (max 200)

function parseList(raw: string | null): string[] {
  return (raw ?? "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 200);
}

export async function GET(request: Request) {
  const sp = new URL(request.url).searchParams;
  const ids = parseList(sp.get("ids"));
  const slugs = parseList(sp.get("slugs"));

  if (slugs.length > 0) {
    const db = await getDb();
    const { results } = await db
      .prepare(`SELECT * FROM books WHERE slug IN (${placeholders(slugs.length)})`)
      .bind(...slugs)
      .all<Record<string, unknown>>();
    return Response.json({ rows: fromDbRows<Book>("books", results) });
  }

  const rows = await getBooksByIds(ids);
  return Response.json({ rows });
}
