import { getCategories } from "@/lib/queries";
import type { ContentType } from "@/types/database";

// Public: category listing. ?type=book&hidden=1 (hidden only for admin-ish uses; harmless)

const TYPES = new Set(["book", "lecture", "khutba", "dua", "wisdom", "guide"]);

export async function GET(request: Request) {
  const sp = new URL(request.url).searchParams;
  const type = sp.get("type");
  const rows = await getCategories({
    contentType: type && TYPES.has(type) ? (type as ContentType) : undefined,
    includeHidden: sp.get("hidden") === "1",
    orderBy: "name",
  });
  return Response.json({ rows });
}
