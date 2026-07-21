"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/admin-api";
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

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [range, setRange] = useState<RangeKey>("14d");
  const [chart, setChart] = useState<ChartData | null>(null);

  // Chart data: refetches when range changes
  useEffect(() => {
    let cancelled = false;
    async function loadChart() {
      const days = RANGE_DAYS[range];
      const tz = new Date().getTimezoneOffset();
      try {
        const data = await adminApi.get<ChartData>(
          `/api/admin/analytics?part=chart&days=${days}&tz=${tz}`
        );
        if (!cancelled) setChart(data);
      } catch {
        // Leave the chart skeleton in place on failure.
      }
    }
    loadChart();
    return () => {
      cancelled = true;
    };
  }, [range]);

  useEffect(() => {
    async function load() {
      const tz = new Date().getTimezoneOffset();
      try {
        const data = await adminApi.get<AnalyticsData>(
          `/api/admin/analytics?part=summary&tz=${tz}`
        );
        setData(data);
      } catch {
        // Leave the loading skeletons in place on failure.
      }
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
