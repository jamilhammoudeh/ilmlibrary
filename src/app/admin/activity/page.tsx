"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
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
      const [books, lectures, khutbas, duas, wisdom, pages, categories] =
        await Promise.all([
          supabase
            .from("books")
            .select("id,title,author,slug,created_at")
            .order("created_at", { ascending: false, nullsFirst: false })
            .limit(15),
          supabase
            .from("lectures")
            .select("id,title,speaker,slug,created_at")
            .order("created_at", { ascending: false, nullsFirst: false })
            .limit(15),
          supabase
            .from("khutbas")
            .select("id,title,speaker,slug,created_at")
            .order("created_at", { ascending: false, nullsFirst: false })
            .limit(15),
          supabase
            .from("duas")
            .select("id,title,translation,created_at")
            .order("created_at", { ascending: false, nullsFirst: false })
            .limit(15),
          supabase
            .from("wisdom")
            .select("id,quote_english,attribution,created_at")
            .order("created_at", { ascending: false, nullsFirst: false })
            .limit(15),
          supabase
            .from("pages")
            .select("id,title,slug,created_at,updated_at")
            .order("updated_at", { ascending: false, nullsFirst: false })
            .limit(15),
          supabase
            .from("categories")
            .select("id,name,content_type,created_at")
            .order("created_at", { ascending: false })
            .limit(10),
        ]);

      type BookRow = { id: string; title: string; author: string; slug: string; created_at: string };
      type SpeakerRow = { id: string; title: string; speaker: string; slug: string; created_at: string };
      type DuaRow = { id: string; title: string | null; translation: string; created_at: string };
      type WisdomRow = { id: string; quote_english: string; attribution: string; created_at: string };
      type PageRow = { id: string; title: string; slug: string; created_at: string; updated_at?: string };
      type CategoryRow = { id: string; name: string; content_type: string; created_at: string };

      const all: Activity[] = [
        ...((books.data as BookRow[]) ?? []).map((b) => ({
          id: b.id,
          type: "book" as const,
          title: b.title,
          subtitle: b.author,
          created_at: b.created_at,
          editHref: `/admin/books?edit=${b.id}`,
          publicHref: `/books/${b.slug}`,
        })),
        ...((lectures.data as SpeakerRow[]) ?? []).map((l) => ({
          id: l.id,
          type: "lecture" as const,
          title: l.title,
          subtitle: l.speaker,
          created_at: l.created_at,
          editHref: `/admin/lectures?edit=${l.id}`,
          publicHref: `/lectures/${l.slug}`,
        })),
        ...((khutbas.data as SpeakerRow[]) ?? []).map((k) => ({
          id: k.id,
          type: "khutba" as const,
          title: k.title,
          subtitle: k.speaker,
          created_at: k.created_at,
          editHref: `/admin/khutbas?edit=${k.id}`,
          publicHref: `/khutbas/${k.slug}`,
        })),
        ...((duas.data as DuaRow[]) ?? []).map((d) => ({
          id: d.id,
          type: "dua" as const,
          title: d.title || d.translation?.slice(0, 60) || "(Dua)",
          created_at: d.created_at,
          editHref: `/admin/duas?edit=${d.id}`,
          publicHref: "/duas",
        })),
        ...((wisdom.data as WisdomRow[]) ?? []).map((w) => ({
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
        ...((pages.data as PageRow[]) ?? []).map((p) => ({
          id: p.id,
          type: "page" as const,
          title: p.title,
          subtitle: `/${p.slug}`,
          created_at: p.updated_at ?? p.created_at,
          updated_at: p.updated_at,
          editHref: `/admin/pages?edit=${p.id}`,
          publicHref: `/${p.slug}`,
        })),
        ...((categories.data as CategoryRow[]) ?? []).map((c) => ({
          id: c.id,
          type: "category" as const,
          title: c.name,
          subtitle: `${c.content_type} category`,
          created_at: c.created_at,
          editHref: `/admin/categories`,
        })),
      ];

      all.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setItems(all.slice(0, 50));
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
