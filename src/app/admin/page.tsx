"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/admin-api";
import {
  BookOpen,
  Mic,
  Speaker,
  HandHeart,
  Quote,
  FolderOpen,
  Eye,
  TrendingUp,
  Calendar,
  Plus,
  ArrowUpRight,
  Clock,
  FileText,
  AlertCircle,
  Activity as ActivityIcon,
  BarChart3,
} from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { PageHeader, SectionTitle } from "@/components/admin/page-header";

type RecentItem = {
  id: string;
  title: string;
  subtitle?: string;
  created_at: string;
  type: "book" | "lecture" | "khutba" | "dua" | "wisdom";
  href: string;
};

type DailyCount = { date: string; count: number };

type Stats = {
  books: number;
  lectures: number;
  khutbas: number;
  duas: number;
  wisdom: number;
  categories: number;
  viewsToday: number;
  viewsYesterday: number;
  viewsWeek: number;
  viewsPrevWeek: number;
  viewsTotal: number;
  daily: DailyCount[];
  topPaths: { path: string; count: number }[];
  recent: RecentItem[];
};

const typeMeta: Record<
  RecentItem["type"],
  { label: string; Icon: React.ComponentType<{ size?: number }> }
> = {
  book: { label: "Book", Icon: BookOpen },
  lecture: { label: "Lecture", Icon: Mic },
  khutba: { label: "Khutba", Icon: Speaker },
  dua: { label: "Dua", Icon: HandHeart },
  wisdom: { label: "Wisdom", Icon: Quote },
};

function relativeTime(iso: string) {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return new Date(iso).toLocaleDateString();
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function loadStats() {
      // All aggregation happens server-side; tz keeps "today" buckets on the
      // admin's local calendar day.
      const tz = new Date().getTimezoneOffset();
      try {
        const data = await adminApi.get<Stats>(`/api/admin/stats?tz=${tz}`);
        setStats(data);
      } catch {
        // Leave the loading skeletons in place on failure.
      }
    }
    loadStats();
  }, []);

  const totalContent = stats
    ? stats.books + stats.lectures + stats.khutbas + stats.duas + stats.wisdom
    : null;

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of content and reader activity"
        actions={
          <>
            <Link
              href="/admin/books"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-teal-900 text-sm font-medium px-4 py-2 rounded-md border border-gray-300"
            >
              <Plus size={14} /> Add Book
            </Link>
            <Link
              href="/admin/lectures"
              className="inline-flex items-center gap-2 bg-teal-900 hover:bg-teal-800 text-white text-sm font-medium px-4 py-2 rounded-md"
            >
              <Plus size={14} /> Add Lecture
            </Link>
          </>
        }
      />

      {/* Top analytics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
        <StatCard label="Views Today" value={stats?.viewsToday ?? null} icon={Eye} />
        <StatCard label="Views This Week" value={stats?.viewsWeek ?? null} icon={TrendingUp} />
        <StatCard label="Total Views" value={stats?.viewsTotal ?? null} icon={Calendar} hint="All time" />
        <StatCard
          label="Total Content"
          value={totalContent}
          icon={FileText}
          hint={stats ? `${stats.categories} categories` : undefined}
        />
      </div>

      {/* Insights quick links */}
      <SectionTitle title="Insights" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <Link
          href="/admin/analytics"
          className="group bg-white border border-gray-200 rounded-lg p-5 hover:border-teal-700 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={18} className="text-teal-700" />
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-teal-900">
              Analytics
            </h3>
            <ArrowUpRight
              size={14}
              className="ml-auto text-gray-300 group-hover:text-teal-700 group-hover:translate-x-0.5 transition-all"
            />
          </div>
          <p className="text-xs text-gray-500">
            Views, referrers, devices, and top content over time.
          </p>
        </Link>

        <Link
          href="/admin/activity"
          className="group bg-white border border-gray-200 rounded-lg p-5 hover:border-teal-700 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-2 mb-1">
            <ActivityIcon size={18} className="text-teal-700" />
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-teal-900">
              Activity
            </h3>
            <ArrowUpRight
              size={14}
              className="ml-auto text-gray-300 group-hover:text-teal-700 group-hover:translate-x-0.5 transition-all"
            />
          </div>
          <p className="text-xs text-gray-500">
            Recently added content across every type.
          </p>
        </Link>

        <Link
          href="/admin/needs-attention"
          className="group bg-white border border-gray-200 rounded-lg p-5 hover:border-teal-700 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={18} className="text-amber-600" />
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-teal-900">
              Content Health
            </h3>
            <ArrowUpRight
              size={14}
              className="ml-auto text-gray-300 group-hover:text-teal-700 group-hover:translate-x-0.5 transition-all"
            />
          </div>
          <p className="text-xs text-gray-500">
            Items missing fields, media, or categories.
          </p>
        </Link>
      </div>

      {/* Content overview */}
      <SectionTitle
        title="Content Library"
        right={
          <Link
            href="/admin/categories"
            className="text-xs text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
          >
            Manage categories <ArrowUpRight size={12} />
          </Link>
        }
      />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
        <StatCard label="Books" value={stats?.books ?? null} icon={BookOpen} href="/admin/books" />
        <StatCard label="Lectures" value={stats?.lectures ?? null} icon={Mic} href="/admin/lectures" />
        <StatCard label="Khutbas" value={stats?.khutbas ?? null} icon={Speaker} href="/admin/khutbas" />
        <StatCard label="Duas" value={stats?.duas ?? null} icon={HandHeart} href="/admin/duas" />
        <StatCard label="Wisdom" value={stats?.wisdom ?? null} icon={Quote} href="/admin/wisdom" />
        <StatCard label="Categories" value={stats?.categories ?? null} icon={FolderOpen} href="/admin/categories" />
      </div>

      {/* Recent activity */}
      <SectionTitle title="Recently Added" />
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {stats ? (
          stats.recent.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {stats.recent.map((item) => {
                const meta = typeMeta[item.type];
                const Icon = meta.Icon;
                return (
                  <li key={`${item.type}-${item.id}`}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                    >
                      <div className="w-8 h-8 rounded bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium uppercase text-gray-500">
                            {meta.label}
                          </span>
                          <p className="font-medium text-gray-900 truncate">{item.title}</p>
                        </div>
                        {item.subtitle && (
                          <p className="text-xs text-gray-500 truncate mt-0.5">{item.subtitle}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
                        <Clock size={12} />
                        {relativeTime(item.created_at)}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 text-center py-10">No content yet</p>
          )
        ) : (
          <div className="p-4 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
