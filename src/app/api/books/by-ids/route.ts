import { getBooksByIds } from "@/lib/queries";

// Public: fetch a set of books by id (used by the bookmarks/lists page).
// ?ids=a,b,c (max 200)

export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("ids") ?? "";
  const ids = raw.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 200);
  const rows = await getBooksByIds(ids);
  return Response.json({ rows });
}
