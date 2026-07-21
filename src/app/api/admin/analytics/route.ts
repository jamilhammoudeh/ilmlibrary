import { requireAdmin } from "@/lib/access-auth";
import { getDb } from "@/lib/db";
import { placeholders } from "@/lib/d1-helpers";

// Server-side analytics aggregation over page_views.
//
//   GET /api/admin/analytics?part=chart&days=N&tz=M
//     → daily views/visitors series for the last N local days plus the
//       previous N-day comparison window, and visitor-loyalty aggregates.
//   GET /api/admin/analytics?part=summary&tz=M
//     → headline view counts, top paths, top content (joined to titles),
//       referrers, and device breakdown for the last 7 days.
//
// tz is the client's Date#getTimezoneOffset() in minutes so day buckets
// follow the admin's local calendar day.

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

function categorizeUA(ua: string): "Mobile" | "Tablet" | "Desktop" | "Bot" | "Other" {
  if (!ua) return "Other";
  const low = ua.toLowerCase();
  if (/bot|crawler|spider/.test(low)) return "Bot";
  if (/ipad|tablet/.test(low)) return "Tablet";
  if (/mobile|iphone|android/.test(low)) return "Mobile";
  if (/windows|macintosh|linux/.test(low)) return "Desktop";
  return "Other";
}

function categorizeReferrer(ref: string | null): string {
  if (!ref) return "Direct / none";
  try {
    const url = new URL(ref);
    const host = url.hostname.replace(/^www\./, "");
    return host || "Direct / none";
  } catch {
    return ref.slice(0, 40);
  }
}

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (admin instanceof Response) return admin;

  const params = new URL(request.url).searchParams;
  const tz = clampTz(params.get("tz"));
  const part = params.get("part") ?? "summary";

  if (part === "chart") {
    const days = Math.min(Math.max(Math.trunc(Number(params.get("days")) || 14), 1), 365);
    return chartResponse(tz, days);
  }
  return summaryResponse(tz);
}

// ---------------------------------------------------------------------------
// part=chart
// ---------------------------------------------------------------------------

async function chartResponse(tz: number, days: number) {
  // Shift UTC timestamps into the client's local clock for day bucketing.
  const tzModifier = `${-tz} minutes`;
  const chartStart = localDayStartUtc(tz, days - 1).toISOString();
  const compareStart = localDayStartUtc(tz, 2 * days - 1).toISOString();
  const compareEnd = chartStart;

  const db = await getDb();
  const [currentDailyR, compareDailyR, currentTotalsR, compareTotalsR, returningR] =
    await db.batch<Record<string, unknown>>([
      db
        .prepare(
          `SELECT strftime('%Y-%m-%d', visited_at, ?) AS day,
                  COUNT(*) AS views, COUNT(DISTINCT visitor_id) AS visitors
           FROM page_views WHERE visited_at >= ? GROUP BY day`
        )
        .bind(tzModifier, chartStart),
      db
        .prepare(
          `SELECT strftime('%Y-%m-%d', visited_at, ?) AS day,
                  COUNT(*) AS views, COUNT(DISTINCT visitor_id) AS visitors
           FROM page_views WHERE visited_at >= ? AND visited_at < ? GROUP BY day`
        )
        .bind(tzModifier, compareStart, compareEnd),
      db
        .prepare(
          `SELECT COUNT(*) AS views, COUNT(DISTINCT visitor_id) AS visitors
           FROM page_views WHERE visited_at >= ?`
        )
        .bind(chartStart),
      db
        .prepare(
          `SELECT COUNT(*) AS views, COUNT(DISTINCT visitor_id) AS visitors
           FROM page_views WHERE visited_at >= ? AND visited_at < ?`
        )
        .bind(compareStart, compareEnd),
      db
        .prepare(
          `SELECT COUNT(DISTINCT visitor_id) AS n FROM page_views
           WHERE visited_at >= ? AND visitor_id IS NOT NULL
             AND visitor_id IN (
               SELECT DISTINCT visitor_id FROM page_views
               WHERE visited_at >= ? AND visited_at < ? AND visitor_id IS NOT NULL
             )`
        )
        .bind(chartStart, compareStart, compareEnd),
    ]);

  type DayRow = { day: string; views: number; visitors: number };

  function series(
    rows: DayRow[],
    oldestDaysAgo: number,
    pick: "views" | "visitors"
  ): { date: string; count: number }[] {
    const byDay = new Map(rows.map((r) => [r.day, r]));
    return Array.from({ length: days }, (_, i) => {
      const key = localDayKey(tz, oldestDaysAgo - i);
      // No zone suffix → the browser parses this as local midnight.
      return { date: `${key}T00:00:00`, count: Number(byDay.get(key)?.[pick] ?? 0) };
    });
  }

  const currentRows = (currentDailyR.results ?? []) as unknown as DayRow[];
  const compareRows = (compareDailyR.results ?? []) as unknown as DayRow[];
  const currentTotals = (currentTotalsR.results?.[0] ?? {}) as { views?: number; visitors?: number };
  const compareTotals = (compareTotalsR.results?.[0] ?? {}) as { views?: number; visitors?: number };

  const uniqueVisitorsInRange = Number(currentTotals.visitors ?? 0);
  const uniqueVisitorsCompare = Number(compareTotals.visitors ?? 0);
  const returningVisitors = Number((returningR.results?.[0] as { n?: number } | undefined)?.n ?? 0);
  const totalViews = Number(currentTotals.views ?? 0);

  return Response.json({
    views: series(currentRows, days - 1, "views"),
    viewsCompare: series(compareRows, 2 * days - 1, "views"),
    visitors: series(currentRows, days - 1, "visitors"),
    visitorsCompare: series(compareRows, 2 * days - 1, "visitors"),
    uniqueVisitorsInRange,
    uniqueVisitorsCompare,
    returningVisitors,
    returningPct:
      uniqueVisitorsInRange > 0
        ? Math.round((returningVisitors / uniqueVisitorsInRange) * 100)
        : null,
    viewsPerVisitor: uniqueVisitorsInRange > 0 ? totalViews / uniqueVisitorsInRange : 0,
  });
}

// ---------------------------------------------------------------------------
// part=summary
// ---------------------------------------------------------------------------

async function summaryResponse(tz: number) {
  const now = Date.now();
  const dayMs = 86400000;
  const todayStart = localDayStartUtc(tz, 0).toISOString();
  const yesterdayStart = localDayStartUtc(tz, 1).toISOString();
  const weekStart = new Date(now - 7 * dayMs).toISOString();
  const prevWeekStart = new Date(now - 14 * dayMs).toISOString();
  const monthStart = new Date(now - 30 * dayMs).toISOString();

  const db = await getDb();
  const [countsR, uniqueR, pathsR, referrersR, uaR] = await db.batch<Record<string, unknown>>([
    db
      .prepare(
        `SELECT
           (SELECT COUNT(*) FROM page_views) AS total,
           (SELECT COUNT(*) FROM page_views WHERE visited_at >= ?) AS today,
           (SELECT COUNT(*) FROM page_views WHERE visited_at >= ? AND visited_at < ?) AS yesterday,
           (SELECT COUNT(*) FROM page_views WHERE visited_at >= ?) AS week,
           (SELECT COUNT(*) FROM page_views WHERE visited_at >= ? AND visited_at < ?) AS prev_week,
           (SELECT COUNT(*) FROM page_views WHERE visited_at >= ?) AS month`
      )
      .bind(todayStart, yesterdayStart, todayStart, weekStart, prevWeekStart, weekStart, monthStart),
    db
      .prepare(
        `SELECT COUNT(DISTINCT visitor_id) AS n FROM page_views WHERE visited_at >= ?`
      )
      .bind(weekStart),
    db
      .prepare(
        `SELECT path, COUNT(*) AS count FROM page_views
         WHERE visited_at >= ? GROUP BY path ORDER BY count DESC LIMIT 500`
      )
      .bind(weekStart),
    db
      .prepare(
        `SELECT referrer, COUNT(*) AS count FROM page_views
         WHERE visited_at >= ? AND referrer IS NOT NULL
         GROUP BY referrer ORDER BY count DESC LIMIT 1000`
      )
      .bind(weekStart),
    db
      .prepare(
        `SELECT user_agent, COUNT(*) AS count FROM page_views
         WHERE visited_at >= ? AND user_agent IS NOT NULL
         GROUP BY user_agent ORDER BY count DESC LIMIT 2000`
      )
      .bind(weekStart),
  ]);

  const counts = (countsR.results?.[0] ?? {}) as Record<string, number>;
  const uniqueCount = Number((uniqueR.results?.[0] as { n?: number } | undefined)?.n ?? 0);

  const topPathsArr = (pathsR.results ?? []).map((r) => ({
    path: String(r.path),
    count: Number(r.count),
  }));

  // Referrers: normalize to host, merge, top 10.
  const refCounts: Record<string, number> = {};
  for (const r of referrersR.results ?? []) {
    const host = categorizeReferrer(r.referrer as string | null);
    refCounts[host] = (refCounts[host] ?? 0) + Number(r.count);
  }
  const topReferrers = Object.entries(refCounts)
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Devices: categorize user agents, merge.
  const deviceCounts: Record<string, number> = {};
  for (const r of uaR.results ?? []) {
    const cat = categorizeUA(String(r.user_agent ?? ""));
    deviceCounts[cat] = (deviceCounts[cat] ?? 0) + Number(r.count);
  }
  const topDevices = Object.entries(deviceCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  // Join top content paths back to titles by slug.
  function pathParts(p: string): { kind: string; slug: string } | null {
    const match = p.match(/^\/(books|lectures|khutbas)\/[^/]+\/([^/?#]+)/);
    if (match) return { kind: match[1], slug: match[2] };
    return null;
  }

  const slugsByKind: Record<"books" | "lectures" | "khutbas", Set<string>> = {
    books: new Set(),
    lectures: new Set(),
    khutbas: new Set(),
  };
  for (const p of topPathsArr) {
    const parts = pathParts(p.path);
    if (parts) slugsByKind[parts.kind as "books" | "lectures" | "khutbas"].add(parts.slug);
  }

  type ContentRow = { slug: string; title: string; author?: string; speaker?: string };

  async function lookup(
    table: "books" | "lectures" | "khutbas",
    personCol: "author" | "speaker",
    slugs: Set<string>
  ): Promise<Record<string, ContentRow>> {
    const out: Record<string, ContentRow> = {};
    if (slugs.size === 0) return out;
    const list = Array.from(slugs).slice(0, 500);
    const { results } = await db
      .prepare(
        `SELECT slug, title, ${personCol} FROM ${table} WHERE slug IN (${placeholders(list.length)})`
      )
      .bind(...list)
      .all<ContentRow>();
    for (const r of results ?? []) out[r.slug] = r;
    return out;
  }

  const [bookLookup, lectureLookup, khutbaLookup] = await Promise.all([
    lookup("books", "author", slugsByKind.books),
    lookup("lectures", "speaker", slugsByKind.lectures),
    lookup("khutbas", "speaker", slugsByKind.khutbas),
  ]);
  const slugLookup: Record<string, Record<string, ContentRow>> = {
    books: bookLookup,
    lectures: lectureLookup,
    khutbas: khutbaLookup,
  };

  function enrich(kind: "books" | "lectures" | "khutbas") {
    return topPathsArr
      .map((p) => {
        const parts = pathParts(p.path);
        if (!parts || parts.kind !== kind) return null;
        const row = slugLookup[kind][parts.slug];
        return {
          path: p.path,
          count: p.count,
          title: row?.title ?? parts.slug,
          subtitle: row?.author ?? row?.speaker ?? null,
          href: p.path,
          kind: kind === "books" ? "book" : kind === "lectures" ? "lecture" : "khutba",
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .slice(0, 8);
  }

  return Response.json({
    viewsTotal: counts.total ?? 0,
    viewsToday: counts.today ?? 0,
    viewsYesterday: counts.yesterday ?? 0,
    viewsWeek: counts.week ?? 0,
    viewsPrevWeek: counts.prev_week ?? 0,
    viewsMonth: counts.month ?? 0,
    uniqueVisitorsWeek: uniqueCount > 0 ? uniqueCount : null,
    topPaths: topPathsArr.slice(0, 12),
    topBooks: enrich("books"),
    topLectures: enrich("lectures"),
    topKhutbas: enrich("khutbas"),
    topReferrers,
    topDevices,
  });
}
