"use client";

import { useEffect, useMemo, useState } from "react";
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
  Plus,
  Pencil,
  Trash2,
  ArrowUpDown,
  Layers,
  User,
  Clock,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";

type ResourceType =
  | "book"
  | "lecture"
  | "khutba"
  | "dua"
  | "wisdom"
  | "page"
  | "category";
type ActionType =
  | "create"
  | "update"
  | "delete"
  | "reorder"
  | "bulk_delete"
  | "bulk_update";

type AuditEntry = {
  id: string;
  actor_email: string | null;
  action: ActionType | string;
  resource_type: ResourceType | string;
  resource_id: string | null;
  resource_title: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
};

const resourceMeta: Record<
  ResourceType,
  {
    label: string;
    Icon: React.ComponentType<{ size?: number; className?: string }>;
    tone: string;
    editBase: string;
  }
> = {
  book: { label: "Book", Icon: BookOpen, tone: "bg-teal-50 text-teal-700", editBase: "/admin/books" },
  lecture: { label: "Lecture", Icon: Mic, tone: "bg-sky-50 text-sky-700", editBase: "/admin/lectures" },
  khutba: { label: "Khutba", Icon: Speaker, tone: "bg-violet-50 text-violet-700", editBase: "/admin/khutbas" },
  dua: { label: "Dua", Icon: HandHeart, tone: "bg-amber-50 text-amber-700", editBase: "/admin/duas" },
  wisdom: { label: "Wisdom", Icon: Quote, tone: "bg-rose-50 text-rose-700", editBase: "/admin/wisdom" },
  page: { label: "Page", Icon: FileText, tone: "bg-emerald-50 text-emerald-700", editBase: "/admin/pages" },
  category: { label: "Category", Icon: FolderOpen, tone: "bg-gray-100 text-gray-700", editBase: "/admin/categories" },
};

const actionMeta: Record<
  ActionType,
  { label: string; Icon: React.ComponentType<{ size?: number; className?: string }>; tone: string }
> = {
  create: { label: "Created", Icon: Plus, tone: "text-emerald-700" },
  update: { label: "Updated", Icon: Pencil, tone: "text-sky-700" },
  delete: { label: "Deleted", Icon: Trash2, tone: "text-rose-700" },
  reorder: { label: "Reordered", Icon: ArrowUpDown, tone: "text-gray-700" },
  bulk_delete: { label: "Bulk deleted", Icon: Trash2, tone: "text-rose-700" },
  bulk_update: { label: "Bulk updated", Icon: Layers, tone: "text-sky-700" },
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
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const PAGE_SIZE = 50;

export default function AuditLogPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [resourceFilter, setResourceFilter] = useState<"all" | ResourceType>("all");
  const [actionFilter, setActionFilter] = useState<"all" | ActionType>("all");
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      let query = supabase
        .from("audit_log")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
      if (resourceFilter !== "all") {
        query = query.eq("resource_type", resourceFilter);
      }
      if (actionFilter !== "all") {
        query = query.eq("action", actionFilter);
      }
      const { data, error, count } = await query;
      if (!error) {
        setEntries((data as unknown as AuditEntry[]) ?? []);
        setTotal(count ?? null);
        setHasMore(((data?.length ?? 0) === PAGE_SIZE));
      }
      setLoading(false);
    }
    load();
  }, [page, resourceFilter, actionFilter]);

  useEffect(() => {
    setPage(0);
  }, [resourceFilter, actionFilter]);

  const groups = useMemo(() => {
    const byDay: { day: string; items: AuditEntry[] }[] = [];
    let currentDay = "";
    let currentGroup: { day: string; items: AuditEntry[] } | null = null;
    for (const e of entries) {
      const d = new Date(e.created_at);
      const day = d.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      if (day !== currentDay) {
        currentDay = day;
        currentGroup = { day, items: [] };
        byDay.push(currentGroup);
      }
      currentGroup!.items.push(e);
    }
    return byDay;
  }, [entries]);

  const resourceFilters: ("all" | ResourceType)[] = [
    "all",
    "book",
    "lecture",
    "khutba",
    "dua",
    "wisdom",
    "page",
    "category",
  ];
  const actionFilters: ("all" | ActionType)[] = [
    "all",
    "create",
    "update",
    "delete",
    "bulk_delete",
    "bulk_update",
    "reorder",
  ];

  return (
    <>
      <PageHeader
        title="Audit Log"
        subtitle="Who changed what, and when"
      />

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-5">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 mr-1">
            Resource:
          </span>
          {resourceFilters.map((r) => {
            const label = r === "all" ? "All" : resourceMeta[r as ResourceType].label;
            return (
              <button
                key={r}
                onClick={() => setResourceFilter(r)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  resourceFilter === r
                    ? "bg-teal-700 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 mr-1">
            Action:
          </span>
          {actionFilters.map((a) => {
            const label = a === "all" ? "All" : actionMeta[a as ActionType].label;
            return (
              <button
                key={a}
                onClick={() => setActionFilter(a)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  actionFilter === a
                    ? "bg-teal-700 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Entries */}
      {loading && entries.length === 0 ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 py-14 text-center">
          <Clock size={28} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm font-medium text-gray-900">No entries yet</p>
          <p className="text-xs text-gray-500 mt-1">
            Admin actions (save, delete, bulk ops) will appear here as you make them.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((g) => (
            <div key={g.day}>
              <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2 px-1">
                {g.day}
              </h3>
              <ul className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                {g.items.map((e) => {
                  const rMeta =
                    resourceMeta[e.resource_type as ResourceType] ??
                    resourceMeta.category;
                  const aMeta =
                    actionMeta[e.action as ActionType] ?? {
                      label: e.action,
                      Icon: Pencil,
                      tone: "text-gray-700",
                    };
                  const RIcon = rMeta.Icon;
                  const AIcon = aMeta.Icon;
                  const hasEditLink =
                    e.resource_id &&
                    e.action !== "delete" &&
                    e.action !== "bulk_delete";
                  const href = hasEditLink
                    ? `${rMeta.editBase}?edit=${e.resource_id}`
                    : rMeta.editBase;
                  const detailsStr = e.details
                    ? summarizeDetails(e.details)
                    : null;
                  return (
                    <li key={e.id}>
                      <Link
                        href={href}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <span
                          className={`shrink-0 w-8 h-8 rounded-md flex items-center justify-center ${rMeta.tone}`}
                        >
                          <RIcon size={14} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 text-sm">
                            <AIcon size={12} className={aMeta.tone} />
                            <span className={`font-medium ${aMeta.tone}`}>
                              {aMeta.label}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500 text-xs uppercase tracking-wider">
                              {rMeta.label}
                            </span>
                          </div>
                          <p className="font-medium text-gray-900 truncate mt-0.5">
                            {e.resource_title ?? (
                              <span className="text-gray-400 italic">
                                (untitled)
                              </span>
                            )}
                          </p>
                          {detailsStr && (
                            <p className="text-xs text-gray-500 mt-0.5 truncate">
                              {detailsStr}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span className="inline-flex items-center gap-1">
                              <User size={11} />
                              {e.actor_email ?? "unknown"}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock size={11} />
                              {relativeTime(e.created_at)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {entries.length > 0 && (
        <div className="flex items-center justify-between mt-5 text-sm">
          <div className="text-gray-500">
            {total !== null && (
              <>
                Showing {page * PAGE_SIZE + 1}–
                {page * PAGE_SIZE + entries.length} of {total.toLocaleString()}
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0 || loading}
              className="px-3 py-1.5 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasMore || loading}
              className="px-3 py-1.5 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function summarizeDetails(d: Record<string, unknown>): string | null {
  if (typeof d.count === "number") {
    const parts: string[] = [`${d.count} items`];
    if (d.changes && typeof d.changes === "object") {
      const changes = Object.entries(d.changes as Record<string, unknown>)
        .map(([k, v]) => `${k}=${v === null ? "(none)" : String(v)}`)
        .join(", ");
      if (changes) parts.push(changes);
    }
    return parts.join(" • ");
  }
  return null;
}
