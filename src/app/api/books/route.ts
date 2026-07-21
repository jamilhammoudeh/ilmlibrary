import { getBooksPage, type BookSort } from "@/lib/queries";

// Public read endpoint for book listings/search.
// ?category=<id>&lang=<en|ar>&q=<search>&sort=<default|newest|title>&offset=&limit=&count=1

export async function GET(request: Request) {
  const sp = new URL(request.url).searchParams;
  const sort = sp.get("sort");
  const { rows, total } = await getBooksPage({
    categoryId: sp.get("category") ?? undefined,
    lang: sp.get("lang") ?? undefined,
    q: sp.get("q") ?? undefined,
    sort: (["default", "newest", "title"].includes(sort ?? "") ? sort : "default") as BookSort,
    offset: Number(sp.get("offset") ?? 0) || 0,
    limit: Number(sp.get("limit") ?? 60) || 60,
    withCount: sp.get("count") === "1",
  });
  return Response.json({ rows, total });
}
