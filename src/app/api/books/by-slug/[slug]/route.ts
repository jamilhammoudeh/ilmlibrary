import { getBookBySlug } from "@/lib/queries";

// Public: single book by slug (used by the PDF reader).

export async function GET(_request: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const book = await getBookBySlug(slug);
  if (!book) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ book });
}
