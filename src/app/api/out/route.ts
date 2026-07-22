import { getDb } from "@/lib/db";
import { newId } from "@/lib/d1-helpers";

// Outbound click tracker: logs the click in content_clicks, then 302-redirects
// to the destination. Used by sponsor cards and book purchase buttons so every
// paid placement has measurable click numbers.
//   /api/out?type=sponsor&id=<sponsorId>
//   /api/out?type=purchase&id=<bookId>

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const sp = new URL(request.url).searchParams;
  const type = sp.get("type");
  const id = sp.get("id") ?? "";
  if ((type !== "sponsor" && type !== "purchase") || !/^[\w-]{1,64}$/.test(id)) {
    return Response.json({ error: "Bad link" }, { status: 400 });
  }

  const db = await getDb();
  let dest: string | null = null;
  if (type === "sponsor") {
    const row = await db
      .prepare("SELECT url FROM sponsors WHERE id = ? AND active = 1")
      .bind(id)
      .first<{ url: string }>();
    dest = row?.url ?? null;
  } else {
    const row = await db
      .prepare("SELECT purchase_url FROM books WHERE id = ?")
      .bind(id)
      .first<{ purchase_url: string | null }>();
    dest = row?.purchase_url ?? null;
  }
  if (!dest || !/^https?:\/\//i.test(dest)) {
    return Response.json({ error: "Unknown destination" }, { status: 404 });
  }

  // Best-effort click log — never block the redirect on it.
  try {
    await db
      .prepare(
        "INSERT INTO content_clicks (id, content_type, content_id, path) VALUES (?, ?, ?, ?)"
      )
      .bind(newId(), type, id, (request.headers.get("referer") ?? "").slice(0, 500) || null)
      .run();
  } catch {
    // ignore
  }

  return Response.redirect(dest, 302);
}
