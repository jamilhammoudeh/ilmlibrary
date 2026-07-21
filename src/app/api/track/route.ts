import { getDb } from "@/lib/db";
import { newId } from "@/lib/d1-helpers";

// Public: anonymous page-view tracking (sendBeacon target). Insert-only,
// length-capped fields; the only unauthenticated write in the app.

const cap = (v: unknown, n: number): string | null =>
  typeof v === "string" && v.length > 0 ? v.slice(0, n) : null;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    path?: string;
    visitor_id?: string;
    referrer?: string;
    user_agent?: string;
  } | null;

  const path = cap(body?.path, 500);
  if (!path || !path.startsWith("/")) {
    return Response.json({ error: "Invalid path" }, { status: 400 });
  }

  const db = await getDb();
  await db
    .prepare(
      "INSERT INTO page_views (id, path, referrer, visitor_id, user_agent) VALUES (?, ?, ?, ?, ?)"
    )
    .bind(
      newId(),
      path,
      cap(body?.referrer, 500),
      cap(body?.visitor_id, 100),
      cap(body?.user_agent, 300)
    )
    .run();

  return Response.json({ ok: true });
}
