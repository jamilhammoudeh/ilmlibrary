"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Eye,
  TrendingUp,
  Calendar,
  Users,
  Globe,
  Smartphone,
  BookOpen,
  Mic,
  Speaker,
  ArrowUpRight,
} from "lucide-react";
import { PageHeader, SectionTitle } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { ViewsChart, type RangeKey } from "@/components/admin/views-chart";

type DailyCount = { date: string; count: number };

const RANGE_DAYS: Record<RangeKey, number> = {
  "7d": 7,
  "14d": 14,
  "30d": 30,
  "90d": 90,
};

type ContentHit = {
  path: string;
  count: number;
  title: string | null;
  subtitle?: string | null;
  href: string;
  kind: "book" | "lecture" | "khutba" | "other";
};

type AnalyticsData = {
  viewsToday: number;
  viewsYesterday: number;
  viewsWeek: number;
  viewsPrevWeek: number;
  viewsMonth: number;
  viewsTotal: number;
  uniqueVisitorsWeek: number | null;
  topPaths: { path: string; count: number }[];
  topBooks: ContentHit[];
  topLectures: ContentHit[];
  topKhutbas: ContentHit[];
  topReferrers: { referrer: string; count: number }[] | null;
  topDevices: { category: string; count: number }[] | null;
};

type ChartData = {
  views: DailyCount[];
  viewsCompare: DailyCount[];
  visitors: DailyCount[];
  visitorsCompare: DailyCount[];
  uniqueVisitorsInRange: number;
  uniqueVisitorsCompare: number;
  returningVisitors: number;
  returningPct: number | null;
  viewsPerVisitor: number;
};

function deltaPct(now: number, prev: number) {
  if (prev === 0) return now > 0 ? 100 : 0;
  return Math.round(((now - prev) / prev) * 100);
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

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [range, setRange] = useState<RangeKey>("14d");
  const [chart, setChart] = useState<ChartData | null>(null);

  // Chart data: refetches when range changes
  useEffect(() => {
    async function loadChart() {
      const days = RANGE_DAYS[range];
      const dayMs = 86400000;
      const chartStart = new Date();
      chartStart.setHours(0, 0, 0, 0);
      chartStart.setDate(chartStart.getDate() - (days - 1));
      const compareStart = new Date(chartStart.getTime() - days * dayMs);
      const compareEnd = new Date(chartStart.getTime());

      type Row = { visited_at: string; visitor_id: string | null };

      const [currentR, compareR] = await Promise.all([
        supabase
          .from("page_views")
          .select("visited_at,visitor_id")
          .gte("visited_at", chartStart.toISOString())
          .limit(50000),
        supabase
          .from("page_views")
          .select("visited_at,visitor_id")
          .gte("visited_at", compareStart.toISOString())
          .lt("visited_at", compareEnd.toISOString())
          .limit(50000),
      ]);

      function emptyBuckets(startAtMidnight: Date): Record<string, number> {
        const b: Record<string, number> = {};
        for (let i = 0; i < days; i++) {
          const d = new Date(startAtMidnight);
          d.setDate(startAtMidnight.getDate() + i);
          d.setHours(0, 0, 0, 0);
          b[d.toISOString()] = 0;
        }
        return b;
      }

      function bucketizeViews(rows: Row[], startAtMidnight: Date): DailyCount[] {
        const buckets = emptyBuckets(startAtMidnight);
        rows.forEach((r) => {
          const d = new Date(r.visited_at);
          d.setHours(0, 0, 0, 0);
          const key = d.toISOString();
          if (key in buckets) buckets[key]++;
        });
        return Object.entries(buckets).map(([date, count]) => ({ date, count }));
      }

      function bucketizeVisitors(
        rows: Row[],
        startAtMidnight: Date
      ): DailyCount[] {
        const buckets = emptyBuckets(startAtMidnight);
        const seen: Record<string, Set<string>> = {};
        Object.keys(buckets).forEach((k) => (seen[k] = new Set()));
        rows.forEach((r) => {
          if (!r.visitor_id) return;
          const d = new Date(r.visited_at);
          d.setHours(0, 0, 0, 0);
          const key = d.toISOString();
          if (key in seen) seen[key].add(r.visitor_id);
        });
        return Object.entries(buckets).map(([date]) => ({
          date,
          count: seen[date].size,
        }));
      }

      const currentRows = (currentR.data as unknown as Row[]) ?? [];
      const compareRows = (compareR.data as unknown as Row[]) ?? [];

      const currentViewsDaily = bucketizeViews(currentRows, chartStart);
      const compareViewsDaily = bucketizeViews(compareRows, compareStart);
      const currentVisitorsDaily = bucketizeVisitors(currentRows, chartStart);
      const compareVisitorsDaily = bucketizeVisitors(compareRows, compareStart);

      const currentVisitorSet = new Set(
        currentRows.map((r) => r.visitor_id).filter((v): v is string => !!v)
      );
      const compareVisitorSet = new Set(
        compareRows.map((r) => r.visitor_id).filter((v): v is string => !!v)
      );
      const returningVisitors = Array.from(currentVisitorSet).filter((id) =>
        compareVisitorSet.has(id)
      ).length;

      const uniqueVisitorsInRange = currentVisitorSet.size;
      const uniqueVisitorsCompare = compareVisitorSet.size;
      const returningPct =
        uniqueVisitorsInRange > 0
          ? Math.round((returningVisitors / uniqueVisitorsInRange) * 100)
          : null;
      const viewsPerVisitor =
        uniqueVisitorsInRange > 0
          ? currentRows.length / uniqueVisitorsInRange
          : 0;

      setChart({
        views: currentViewsDaily,
        viewsCompare: compareViewsDaily,
        visitors: currentVisitorsDaily,
        visitorsCompare: compareVisitorsDaily,
        uniqueVisitorsInRange,
        uniqueVisitorsCompare,
        returningVisitors,
        returningPct,
        viewsPerVisitor,
      });
    }
    loadChart();
  }, [range]);

  useEffect(() => {
    async function load() {
      const now = Date.now();
      const dayMs = 86400000;
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const yesterdayStart = new Date(todayStart.getTime() - dayMs);
      const weekStart = new Date(now - 7 * dayMs);
      const prevWeekStart = new Date(now - 14 * dayMs);
      const monthStart = new Date(now - 30 * dayMs);

      const countOnly = { count: "exact" as const, head: true };

      const [
        viewsTotalR,
        viewsTodayR,
        viewsYesterdayR,
        viewsWeekR,
        viewsPrevWeekR,
        viewsMonthR,
        pathsR,
        visitorsR,
        referrerR,
        uaR,
      ] = await Promise.all([
        supabase.from("page_views").select("*", countOnly),
        supabase
          .from("page_views")
          .select("*", countOnly)
          .gte("visited_at", todayStart.toISOString()),
        supabase
          .from("page_views")
          .select("*", countOnly)
          .gte("visited_at", yesterdayStart.toISOString())
          .lt("visited_at", todayStart.toISOString()),
        supabase
          .from("page_views")
          .select("*", countOnly)
          .gte("visited_at", weekStart.toISOString()),
        supabase
          .from("page_views")
          .select("*", countOnly)
          .gte("visited_at", prevWeekStart.toISOString())
          .lt("visited_at", weekStart.toISOString()),
        supabase
          .from("page_views")
          .select("*", countOnly)
          .gte("visited_at", monthStart.toISOString()),
        supabase
          .from("page_views")
          .select("path")
          .gte("visited_at", weekStart.toISOString())
          .limit(20000),
        // Optional new columns — will quietly return error if missing
        supabase
          .from("page_views")
          .select("visitor_id")
          .gte("visited_at", weekStart.toISOString())
          .limit(10000),
        supabase
          .from("page_views")
          .select("referrer")
          .gte("visited_at", weekStart.toISOString())
          .not("referrer", "is", null)
          .limit(10000),
        supabase
          .from("page_views")
          .select("user_agent")
          .gte("visited_at", weekStart.toISOString())
          .not("user_agent", "is", null)
          .limit(10000),
      ]);

      // Top paths
      const pathCounts: Record<string, number> = {};
      ((pathsR.data as { path: string }[]) ?? []).forEach((r) => {
        pathCounts[r.path] = (pathCounts[r.path] ?? 0) + 1;
      });
      const topPathsArr = Object.entries(pathCounts)
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count);

      // Unique visitors (may be all null if column doesn't exist)
      let uniqueVisitorsWeek: number | null = null;
      const visitorRows =
        (visitorsR.data as unknown as { visitor_id: string | null }[]) ?? [];
      const visitorIds = new Set(
        visitorRows.map((r) => r.visitor_id).filter(Boolean) as string[]
      );
      if (visitorIds.size > 0) {
        uniqueVisitorsWeek = visitorIds.size;
      }

      // Referrers
      let topReferrers: { referrer: string; count: number }[] | null = null;
      if (
        referrerR.data &&
        Array.isArray(referrerR.data) &&
        !referrerR.error
      ) {
        const refCounts: Record<string, number> = {};
        (referrerR.data as unknown as { referrer: string | null }[]).forEach(
          (r) => {
            const host = categorizeReferrer(r.referrer);
            refCounts[host] = (refCounts[host] ?? 0) + 1;
          }
        );
        topReferrers = Object.entries(refCounts)
          .map(([referrer, count]) => ({ referrer, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);
      }

      // Device categorization
      let topDevices: { category: string; count: number }[] | null = null;
      if (uaR.data && Array.isArray(uaR.data) && !uaR.error) {
        const deviceCounts: Record<string, number> = {};
        (uaR.data as unknown as { user_agent: string | null }[]).forEach((r) => {
          const cat = categorizeUA(r.user_agent ?? "");
          deviceCounts[cat] = (deviceCounts[cat] ?? 0) + 1;
        });
        topDevices = Object.entries(deviceCounts)
          .map(([category, count]) => ({ category, count }))
          .sort((a, b) => b.count - a.count);
      }

      // Map top paths to content (join with books/lectures/khutbas by slug)
      function pathParts(p: string): { kind: string; slug: string } | null {
        const match = p.match(/^\/(books|lectures|khutbas)\/[^/]+\/([^/?#]+)/);
        if (match) return { kind: match[1], slug: match[2] };
        return null;
      }

      // Collect slugs
      const slugsByKind: Record<string, Set<string>> = {
        books: new Set(),
        lectures: new Set(),
        khutbas: new Set(),
      };
      topPathsArr.slice(0, 500).forEach((p) => {
        const parts = pathParts(p.path);
        if (parts) slugsByKind[parts.kind].add(parts.slug);
      });

      type ContentRow = { slug: string; title: string; author?: string; speaker?: string };

      const [booksRes, lecturesRes, khutbasRes] = await Promise.all([
        slugsByKind.books.size > 0
          ? supabase
              .from("books")
              .select("slug,title,author")
              .in("slug", Array.from(slugsByKind.books))
          : Promise.resolve({ data: [] as ContentRow[], error: null }),
        slugsByKind.lectures.size > 0
          ? supabase
              .from("lectures")
              .select("slug,title,speaker")
              .in("slug", Array.from(slugsByKind.lectures))
          : Promise.resolve({ data: [] as ContentRow[], error: null }),
        slugsByKind.khutbas.size > 0
          ? supabase
              .from("khutbas")
              .select("slug,title,speaker")
              .in("slug", Array.from(slugsByKind.khutbas))
          : Promise.resolve({ data: [] as ContentRow[], error: null }),
      ]);

      const slugLookup: Record<string, Record<string, ContentRow>> = {
        books: {},
        lectures: {},
        khutbas: {},
      };
      ((booksRes.data as ContentRow[]) ?? []).forEach((r) => {
        slugLookup.books[r.slug] = r;
      });
      ((lecturesRes.data as ContentRow[]) ?? []).forEach((r) => {
        slugLookup.lectures[r.slug] = r;
      });
      ((khutbasRes.data as ContentRow[]) ?? []).forEach((r) => {
        slugLookup.khutbas[r.slug] = r;
      });

      function enrich(kind: "books" | "lectures" | "khutbas"): ContentHit[] {
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
              kind: kind === "books" ? "book" : (kind === "lectures" ? "lecture" : "khutba"),
            } as ContentHit;
          })
          .filter((x): x is ContentHit => x !== null)
          .slice(0, 8);
      }

      setData({
        viewsTotal: viewsTotalR.count ?? 0,
        viewsToday: viewsTodayR.count ?? 0,
        viewsYesterday: viewsYesterdayR.count ?? 0,
        viewsWeek: viewsWeekR.count ?? 0,
        viewsPrevWeek: viewsPrevWeekR.count ?? 0,
        viewsMonth: viewsMonthR.count ?? 0,
        uniqueVisitorsWeek,
        topPaths: topPathsArr.slice(0, 12),
        topBooks: enrich("books"),
        topLectures: enrich("lectures"),
        topKhutbas: enrich("khutbas"),
        topReferrers,
        topDevices,
      });
    }
    load();
  }, []);

  const weekDelta = data ? deltaPct(data.viewsWeek, data.viewsPrevWeek) : null;
  const dayDelta = data ? deltaPct(data.viewsToday, data.viewsYesterday) : null;

  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle="Who's reading what, and where they come from"
      />

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Views Today"
          value={data?.viewsToday ?? null}
          icon={Eye}
          hint={
            dayDelta !== null
              ? `${dayDelta > 0 ? "+" : ""}${dayDelta}% vs yesterday`
              : undefined
          }
        />
        <StatCard
          label="Views This Week"
          value={data?.viewsWeek ?? null}
          icon={TrendingUp}
          hint={
            weekDelta !== null
              ? `${weekDelta > 0 ? "+" : ""}${weekDelta}% vs last week`
              : undefined
          }
        />
        <StatCard
          label="Views Last 30 Days"
          value={data?.viewsMonth ?? null}
          icon={Calendar}
        />
        <StatCard
          label="Unique Visitors (7d)"
          value={data?.uniqueVisitorsWeek ?? null}
          icon={Users}
          hint={
            data && data.uniqueVisitorsWeek === null
              ? "Tracking starting now"
              : undefined
          }
        />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg p-5 border border-gray-200 mb-6">
        <div className="flex items-start justify-between mb-4 gap-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-700">
              Page Views
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Daily volume with previous period comparison
            </p>
          </div>
          {data && (
            <div className="text-right">
              <p className="text-xl font-bold text-teal-900">
                {data.viewsTotal.toLocaleString()}
              </p>
              <p className="text-[11px] text-gray-500">All-time total</p>
            </div>
          )}
        </div>
        {chart ? (
          <ViewsChart
            views={chart.views}
            viewsCompare={chart.viewsCompare}
            visitors={chart.visitors}
            visitorsCompare={chart.visitorsCompare}
            uniqueVisitors={chart.uniqueVisitorsInRange}
            returningPct={chart.returningPct}
            viewsPerVisitor={chart.viewsPerVisitor}
            range={range}
            onRangeChange={setRange}
          />
        ) : (
          <div className="h-80 w-full bg-gradient-to-b from-gray-100 to-gray-50 rounded animate-pulse" />
        )}
      </div>

      {/* Top paths + Referrers + Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <SectionTitle title="Top Pages (7d)" />
          <div className="space-y-2">
            {data ? (
              data.topPaths.length > 0 ? (
                data.topPaths.map((p, i) => {
                  const max = data.topPaths[0].count;
                  const widthPct = Math.max(8, (p.count / max) * 100);
                  return (
                    <div key={p.path}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs text-gray-400 w-4 shrink-0">
                            {i + 1}
                          </span>
                          <a
                            href={p.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-800 hover:text-teal-700 truncate"
                          >
                            {p.path === "/" ? "Home" : p.path}
                          </a>
                        </div>
                        <span className="text-xs text-gray-500 shrink-0 ml-2">
                          {p.count.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded overflow-hidden">
                        <div
                          className="h-full bg-teal-600 rounded"
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 py-8 text-center">
                  No data yet
                </p>
              )
            ) : (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <SectionTitle
            title="Top Referrers (7d)"
            right={<Globe size={14} className="text-gray-400" />}
          />
          <div className="space-y-2">
            {data?.topReferrers ? (
              data.topReferrers.length > 0 ? (
                data.topReferrers.map((r, i) => {
                  const max = data.topReferrers![0].count;
                  const widthPct = Math.max(8, (r.count / max) * 100);
                  return (
                    <div key={r.referrer}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-800 truncate min-w-0 mr-2">
                          <span className="text-xs text-gray-400 mr-2">
                            {i + 1}
                          </span>
                          {r.referrer}
                        </span>
                        <span className="text-xs text-gray-500 shrink-0">
                          {r.count.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded overflow-hidden">
                        <div
                          className="h-full bg-teal-600 rounded"
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 py-8 text-center">
                  No referrer data yet
                </p>
              )
            ) : data ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500">
                  Referrer tracking not set up
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Run the admin improvements migration to enable
                </p>
              </div>
            ) : (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <SectionTitle
            title="Devices (7d)"
            right={<Smartphone size={14} className="text-gray-400" />}
          />
          <div className="space-y-2">
            {data?.topDevices ? (
              data.topDevices.length > 0 ? (
                data.topDevices.map((d) => {
                  const total = data.topDevices!.reduce(
                    (sum, x) => sum + x.count,
                    0
                  );
                  const pct = Math.round((d.count / total) * 100);
                  return (
                    <div key={d.category}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-800">{d.category}</span>
                        <span className="text-xs text-gray-500">
                          {d.count.toLocaleString()} ({pct}%)
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded overflow-hidden">
                        <div
                          className="h-full bg-teal-600 rounded"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 py-8 text-center">
                  No device data yet
                </p>
              )
            ) : data ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500">
                  Device tracking not set up
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Run the admin improvements migration to enable
                </p>
              </div>
            ) : (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Top Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-6">
        <TopContentCard
          title="Top Books"
          icon={BookOpen}
          items={data?.topBooks ?? null}
        />
        <TopContentCard
          title="Top Lectures"
          icon={Mic}
          items={data?.topLectures ?? null}
        />
        <TopContentCard
          title="Top Khutbas"
          icon={Speaker}
          items={data?.topKhutbas ?? null}
        />
      </div>
    </>
  );
}

function TopContentCard({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  items: ContentHit[] | null;
}) {
  return (
    <div className="bg-white rounded-lg p-5 border border-gray-200">
      <SectionTitle title={title} right={<Icon size={14} className="text-gray-400" />} />
      <div className="space-y-2">
        {items === null ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
          ))
        ) : items.length > 0 ? (
          items.map((item, i) => (
            <Link
              key={item.path}
              href={item.href}
              className="group flex items-center gap-2 text-sm py-1.5 px-2 -mx-2 rounded hover:bg-gray-50"
            >
              <span className="text-xs text-gray-400 w-4 shrink-0">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-900 group-hover:text-teal-700 truncate">
                  {item.title}
                </p>
                {item.subtitle && (
                  <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
                )}
              </div>
              <span className="text-xs text-gray-500 shrink-0 flex items-center gap-1">
                {item.count.toLocaleString()}
                <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </Link>
          ))
        ) : (
          <p className="text-sm text-gray-500 py-8 text-center">No data yet</p>
        )}
      </div>
    </div>
  );
}
