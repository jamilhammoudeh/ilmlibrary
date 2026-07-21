import { requireAdmin } from "@/lib/access-auth";
import { getDb } from "@/lib/db";

// Precomputed dashboard data: content counts, page-view counts, a 7-day daily
// series, top paths, and the most recently added items across content tables.
// The client passes ?tz= (minutes, from Date#getTimezoneOffset) so "today"
// buckets follow the admin's local calendar day.

type RecentItem = {
  id: string;
  title: string;
  subtitle?: string;
  created_at: string;
  type: "book" | "lecture" | "khutba" | "dua" | "wisdom";
  href: string;
};

function clampTz(raw: string | null): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) return 0;
  return Math.max(-840, Math.min(840, Math.trunc(n)));
}

/** UTC instant of the client-local midnight `daysAgo` days ago. */
function localDayStartUtc(tz: number, daysAgo: number): Date {
  const shifted = new Date(Date.now() - tz * 60000);
  shifted.setUTCHours(0, 0, 0, 0);
  shifted.setUTCDate(shifted.getUTCDate() - daysAgo);
  return new Date(shifted.getTime() + tz * 60000);
}

/** Client-local calendar day key (YYYY-MM-DD) `daysAgo` days ago. */
function localDayKey(tz: number, daysAgo: number): string {
  const shifted = new Date(Date.now() - tz * 60000);
  shifted.setUTCHours(0, 0, 0, 0);
  shifted.setUTCDate(shifted.getUTCDate() - daysAgo);
  return shifted.toISOString().slice(0, 10);
}

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (admin instanceof Response) return admin;

  const tz = clampTz(new URL(request.url).searchParams.get("tz"));
  // Shift UTC timestamps into the client's local clock for day bucketing.
  const tzModifier = `${-tz} minutes`;

  const now = Date.now();
  const dayMs = 86400000;
  const todayStart = localDayStartUtc(tz, 0).toISOString();
  const yesterdayStart = localDayStartUtc(tz, 1).toISOString();
  const weekStart = new Date(now - 7 * dayMs).toISOString();
  const prevWeekStart = new Date(now - 14 * dayMs).toISOString();
  const chartStart = localDayStartUtc(tz, 6).toISOString();

  const db = await getDb();
  const [
    contentR,
    viewsR,
    dailyR,
    topPathsR,
    booksR,
    lecturesR,
    khutbasR,
    duasR,
    wisdomR,
  ] = await db.batch<Record<string, unknown>>([
    db.prepare(
      `SELECT
         (SELECT COUNT(*) FROM books) AS books,
         (SELECT COUNT(*) FROM lectures) AS lectures,
         (SELECT COUNT(*) FROM khutbas) AS khutbas,
         (SELECT COUNT(*) FROM duas) AS duas,
         (SELECT COUNT(*) FROM wisdom) AS wisdom,
         (SELECT COUNT(*) FROM categories) AS categories`
    ),
    db
      .prepare(
        `SELECT
           (SELECT COUNT(*) FROM page_views) AS total,
           (SELECT COUNT(*) FROM page_views WHERE visited_at >= ?) AS today,
           (SELECT COUNT(*) FROM page_views WHERE visited_at >= ? AND visited_at < ?) AS yesterday,
           (SELECT COUNT(*) FROM page_views WHERE visited_at >= ?) AS week,
           (SELECT COUNT(*) FROM page_views WHERE visited_at >= ? AND visited_at < ?) AS prev_week`
      )
      .bind(todayStart, yesterdayStart, todayStart, weekStart, prevWeekStart, weekStart),
    db
      .prepare(
        `SELECT strftime('%Y-%m-%d', visited_at, ?) AS day, COUNT(*) AS count
         FROM page_views WHERE visited_at >= ? GROUP BY day`
      )
      .bind(tzModifier, chartStart),
    db
      .prepare(
        `SELECT path, COUNT(*) AS count FROM page_views
         WHERE visited_at >= ? GROUP BY path ORDER BY count DESC LIMIT 6`
      )
      .bind(weekStart),
    db.prepare(`SELECT id, title, author, slug, created_at FROM books ORDER BY created_at DESC LIMIT 4`),
    db.prepare(`SELECT id, title, speaker, slug, created_at FROM lectures ORDER BY created_at DESC LIMIT 4`),
    db.prepare(`SELECT id, title, speaker, slug, created_at FROM khutbas ORDER BY created_at DESC LIMIT 4`),
    db.prepare(`SELECT id, title, translation, created_at FROM duas ORDER BY created_at DESC LIMIT 3`),
    db.prepare(`SELECT id, quote_english, attribution, created_at FROM wisdom ORDER BY created_at DESC LIMIT 3`),
  ]);

  const content = (contentR.results?.[0] ?? {}) as Record<string, number>;
  const views = (viewsR.results?.[0] ?? {}) as Record<string, number>;

  // Daily buckets for the last 7 local days (oldest first).
  const dayCounts = new Map<string, number>();
  for (const r of dailyR.results ?? []) {
    dayCounts.set(String(r.day), Number(r.count));
  }
  const daily = Array.from({ length: 7 }, (_, i) => {
    const key = localDayKey(tz, 6 - i);
    // No zone suffix → the browser parses this as local midnight.
    return { date: `${key}T00:00:00`, count: dayCounts.get(key) ?? 0 };
  });

  const topPaths = (topPathsR.results ?? []).map((r) => ({
    path: String(r.path),
    count: Number(r.count),
  }));

  type BookRow = { id: string; title: string; author: string; slug: string; created_at: string };
  type SpeakerRow = { id: string; title: string; speaker: string; slug: string; created_at: string };
  type DuaRow = { id: string; title: string | null; translation: string; created_at: string };
  type WisdomRow = { id: string; quote_english: string; attribution: string; created_at: string };

  const recent: RecentItem[] = [
    ...((booksR.results ?? []) as unknown as BookRow[]).map((b) => ({
      id: b.id,
      title: b.title,
      subtitle: b.author,
      created_at: b.created_at,
      type: "book" as const,
      href: `/books/${b.slug}`,
    })),
    ...((lecturesR.results ?? []) as unknown as SpeakerRow[]).map((l) => ({
      id: l.id,
      title: l.title,
      subtitle: l.speaker,
      created_at: l.created_at,
      type: "lecture" as const,
      href: `/lectures/${l.slug}`,
    })),
    ...((khutbasR.results ?? []) as unknown as SpeakerRow[]).map((k) => ({
      id: k.id,
      title: k.title,
      subtitle: k.speaker,
      created_at: k.created_at,
      type: "khutba" as const,
      href: `/khutbas/${k.slug}`,
    })),
    ...((duasR.results ?? []) as unknown as DuaRow[]).map((d) => ({
      id: d.id,
      title: d.title || d.translation.slice(0, 60),
      created_at: d.created_at,
      type: "dua" as const,
      href: "/duas",
    })),
    ...((wisdomR.results ?? []) as unknown as WisdomRow[]).map((w) => ({
      id: w.id,
      title: w.quote_english.slice(0, 80) + (w.quote_english.length > 80 ? "…" : ""),
      subtitle: w.attribution,
      created_at: w.created_at,
      type: "wisdom" as const,
      href: "/wisdom",
    })),
  ]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  return Response.json({
    books: content.books ?? 0,
    lectures: content.lectures ?? 0,
    khutbas: content.khutbas ?? 0,
    duas: content.duas ?? 0,
    wisdom: content.wisdom ?? 0,
    categories: content.categories ?? 0,
    viewsTotal: views.total ?? 0,
    viewsToday: views.today ?? 0,
    viewsYesterday: views.yesterday ?? 0,
    viewsWeek: views.week ?? 0,
    viewsPrevWeek: views.prev_week ?? 0,
    daily,
    topPaths,
    recent,
  });
}
