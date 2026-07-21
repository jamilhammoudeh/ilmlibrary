import { requireAdmin } from "@/lib/access-auth";
import { getDb } from "@/lib/db";

// Recent content across every type, merged and sorted server-side.
// Returns { items } shaped exactly as the activity page renders them.

type ActivityType = "book" | "lecture" | "khutba" | "dua" | "wisdom" | "page" | "category";

type Activity = {
  id: string;
  type: ActivityType;
  title: string;
  subtitle?: string;
  created_at: string;
  updated_at?: string;
  editHref: string;
  publicHref?: string;
};

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (admin instanceof Response) return admin;

  const db = await getDb();
  const [booksR, lecturesR, khutbasR, duasR, wisdomR, pagesR, categoriesR] =
    await db.batch<Record<string, unknown>>([
      db.prepare(`SELECT id, title, author, slug, created_at FROM books ORDER BY created_at DESC LIMIT 15`),
      db.prepare(`SELECT id, title, speaker, slug, created_at FROM lectures ORDER BY created_at DESC LIMIT 15`),
      db.prepare(`SELECT id, title, speaker, slug, created_at FROM khutbas ORDER BY created_at DESC LIMIT 15`),
      db.prepare(`SELECT id, title, translation, created_at FROM duas ORDER BY created_at DESC LIMIT 15`),
      db.prepare(`SELECT id, quote_english, attribution, created_at FROM wisdom ORDER BY created_at DESC LIMIT 15`),
      db.prepare(`SELECT id, title, slug, created_at, updated_at FROM pages ORDER BY updated_at DESC LIMIT 15`),
      db.prepare(`SELECT id, name, content_type, created_at FROM categories ORDER BY created_at DESC LIMIT 10`),
    ]);

  type BookRow = { id: string; title: string; author: string; slug: string; created_at: string };
  type SpeakerRow = { id: string; title: string; speaker: string; slug: string; created_at: string };
  type DuaRow = { id: string; title: string | null; translation: string; created_at: string };
  type WisdomRow = { id: string; quote_english: string; attribution: string; created_at: string };
  type PageRow = { id: string; title: string; slug: string; created_at: string; updated_at?: string };
  type CategoryRow = { id: string; name: string; content_type: string; created_at: string };

  const all: Activity[] = [
    ...((booksR.results ?? []) as unknown as BookRow[]).map((b) => ({
      id: b.id,
      type: "book" as const,
      title: b.title,
      subtitle: b.author,
      created_at: b.created_at,
      editHref: `/admin/books?edit=${b.id}`,
      publicHref: `/books/${b.slug}`,
    })),
    ...((lecturesR.results ?? []) as unknown as SpeakerRow[]).map((l) => ({
      id: l.id,
      type: "lecture" as const,
      title: l.title,
      subtitle: l.speaker,
      created_at: l.created_at,
      editHref: `/admin/lectures?edit=${l.id}`,
      publicHref: `/lectures/${l.slug}`,
    })),
    ...((khutbasR.results ?? []) as unknown as SpeakerRow[]).map((k) => ({
      id: k.id,
      type: "khutba" as const,
      title: k.title,
      subtitle: k.speaker,
      created_at: k.created_at,
      editHref: `/admin/khutbas?edit=${k.id}`,
      publicHref: `/khutbas/${k.slug}`,
    })),
    ...((duasR.results ?? []) as unknown as DuaRow[]).map((d) => ({
      id: d.id,
      type: "dua" as const,
      title: d.title || d.translation?.slice(0, 60) || "(Dua)",
      created_at: d.created_at,
      editHref: `/admin/duas?edit=${d.id}`,
      publicHref: "/duas",
    })),
    ...((wisdomR.results ?? []) as unknown as WisdomRow[]).map((w) => ({
      id: w.id,
      type: "wisdom" as const,
      title:
        w.quote_english?.slice(0, 80) +
          (w.quote_english && w.quote_english.length > 80 ? "…" : "") ||
        "(Untitled)",
      subtitle: w.attribution,
      created_at: w.created_at,
      editHref: `/admin/wisdom?edit=${w.id}`,
      publicHref: "/wisdom",
    })),
    ...((pagesR.results ?? []) as unknown as PageRow[]).map((p) => ({
      id: p.id,
      type: "page" as const,
      title: p.title,
      subtitle: `/${p.slug}`,
      created_at: p.updated_at ?? p.created_at,
      updated_at: p.updated_at,
      editHref: `/admin/pages?edit=${p.id}`,
      publicHref: `/${p.slug}`,
    })),
    ...((categoriesR.results ?? []) as unknown as CategoryRow[]).map((c) => ({
      id: c.id,
      type: "category" as const,
      title: c.name,
      subtitle: `${c.content_type} category`,
      created_at: c.created_at,
      editHref: `/admin/categories`,
    })),
  ];

  all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return Response.json({ items: all.slice(0, 50) });
}
