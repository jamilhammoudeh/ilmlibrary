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
  FileText,
  FolderOpen,
  Clock,
  Filter,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";

type ActivityType =
  | "book"
  | "lecture"
  | "khutba"
  | "dua"
  | "wisdom"
  | "page"
  | "category";

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

const typeMeta: Record<
  ActivityType,
  { label: string; Icon: React.ComponentType<{ size?: number; className?: string }>; tone: string }
> = {
  book: { label: "Book", Icon: BookOpen, tone: "bg-teal-50 text-teal-700" },
  lecture: { label: "Lecture", Icon: Mic, tone: "bg-sky-50 text-sky-700" },
  khutba: { label: "Khutba", Icon: Speaker, tone: "bg-violet-50 text-violet-700" },
  dua: { label: "Dua", Icon: HandHeart, tone: "bg-amber-50 text-amber-700" },
  wisdom: { label: "Wisdom", Icon: Quote, tone: "bg-rose-50 text-rose-700" },
  page: { label: "Page", Icon: FileText, tone: "bg-emerald-50 text-emerald-700" },
  category: { label: "Category", Icon: FolderOpen, tone: "bg-gray-100 text-gray-700" },
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

export default function AdminActivityPage() {
  const [items, setItems] = useState<Activity[] | null>(null);
  const [filter, setFilter] = useState<"all" | ActivityType>("all");

  useEffect(() => {
    async function load() {
      setItems(null);
      try {
        // Rows are merged and sorted server-side across every content table.
        const { items } = await adminApi.get<{ items: Activity[] }>(
          "/api/admin/activity"
        );
        setItems(items);
      } catch {
        // Leave the loading skeletons in place on failure.
      }
    }
    load();
  }, []);

  const visible = items
    ? filter === "all"
      ? items
      : items.filter((i) => i.type === filter)
    : null;

  const filterOptions: { key: "all" | ActivityType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "book", label: "Books" },
    { key: "lecture", label: "Lectures" },
    { key: "khutba", label: "Khutbas" },
    { key: "dua", label: "Duas" },
    { key: "wisdom", label: "Wisdom" },
    { key: "page", label: "Pages" },
    { key: "category", label: "Categories" },
  ];

  return (
    <>
      <PageHeader
        title="Activity"
        subtitle="Recently added and updated content across the site"
      />

      <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4 flex flex-wrap gap-1.5 items-center">
        <Filter size={12} className="text-gray-400 mr-1" />
        {filterOptions.map((o) => (
          <button
            key={o.key}
            onClick={() => setFilter(o.key)}
            className={`text-xs font-medium px-2.5 py-1 rounded-md transition-colors ${
              filter === o.key
                ? "bg-teal-50 text-teal-900"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {visible === null ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-16">
            No activity to show
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {visible.map((item) => {
              const meta = typeMeta[item.type];
              const Icon = meta.Icon;
              const stamp = item.created_at;
              return (
                <li
                  key={`${item.type}-${item.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                >
                  <div
                    className={`w-9 h-9 rounded flex items-center justify-center shrink-0 ${meta.tone}`}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase text-gray-500 tracking-wider">
                        {meta.label}
                      </span>
                      <Link
                        href={item.editHref}
                        className="font-medium text-gray-900 truncate hover:text-teal-700"
                      >
                        {item.title}
                      </Link>
                    </div>
                    {item.subtitle && (
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {item.publicHref && (
                      <a
                        href={item.publicHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-500 hover:text-teal-700"
                      >
                        View
                      </a>
                    )}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={12} />
                      {relativeTime(stamp)}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {visible && visible.length > 0 && (
        <p className="text-center text-xs text-gray-400 mt-3">
          Showing the latest {visible.length} items. Use the filter to narrow
          by type.
        </p>
      )}
    </>
  );
}
