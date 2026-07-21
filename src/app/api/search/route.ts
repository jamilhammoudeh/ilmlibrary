import { searchAll } from "@/lib/queries";

// Public: cross-content live search. ?q=<query>&per=<perTypeLimit>

export async function GET(request: Request) {
  const sp = new URL(request.url).searchParams;
  const q = (sp.get("q") ?? "").trim();
  if (q.length < 2) {
    return Response.json({
      books: [], lectures: [], khutbas: [], duas: [], wisdom: [], guides: [],
    });
  }
  const per = Math.min(Number(sp.get("per") ?? 12) || 12, 25);
  const results = await searchAll(q, per);
  return Response.json(results);
}
