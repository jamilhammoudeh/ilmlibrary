"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/types/database";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Mic,
  Headphones,
  Video,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "./page-header";
import { StatCard } from "./stat-card";
import { Modal } from "./modal";
import { Field, SelectField, PrimaryButton, GhostButton } from "./form-fields";
import { useToast } from "./toast";
import { BulkBar } from "./bulk-bar";
import { useUrlString, useUrlNumber, useUrlUpdater } from "@/hooks/use-url-state";
import { logAudit } from "@/lib/audit";

type MediaItem = {
  id: string;
  title: string;
  slug: string;
  speaker: string;
  description: string | null;
  audio_url: string | null;
  video_url: string | null;
  category_id: string | null;
  created_at: string;
};

type SortKey = "title" | "speaker" | "created_at";
type SortDir = "asc" | "desc";
const PAGE_SIZE = 20;

type MediaAdminProps = {
  table: "lectures" | "khutbas";
  contentType: "lecture" | "khutba";
  singularLabel: string;
  pluralLabel: string;
  subtitle: string;
};

export function MediaAdmin(props: MediaAdminProps) {
  return (
    <Suspense fallback={<div className="h-40 bg-gray-100 rounded animate-pulse" />}>
      <MediaAdminInner {...props} />
    </Suspense>
  );
}

function MediaAdminInner({
  table,
  contentType,
  singularLabel,
  pluralLabel,
  subtitle,
}: MediaAdminProps) {
  const { notify } = useToast();
  const updateUrl = useUrlUpdater();

  const [items, setItems] = useState<MediaItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<MediaItem> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  // URL-synced state
  const [search, setSearch] = useUrlString("q", "");
  const [categoryFilter, setCategoryFilter] = useUrlString("cat", "all");
  const [sortRaw, setSortRaw] = useUrlString("sort", "title:asc");
  const [page, setPage] = useUrlNumber("p", 1);
  const [editId] = useUrlString("edit", "");
  const [newFlag] = useUrlString("new", "");

  const [sortKey, sortDir] = useMemo(() => {
    const [k, d] = sortRaw.split(":");
    return [
      (k as SortKey) || "title",
      (d as SortDir) || "asc",
    ] as const;
  }, [sortRaw]);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from(table).select("*").limit(1000);
    setItems((data as MediaItem[]) ?? []);
    setLoading(false);
  }, [table]);

  useEffect(() => {
    load();
    supabase
      .from("categories")
      .select("*")
      .eq("content_type", contentType)
      .order("name")
      .then(({ data }) => setCategories(data ?? []));
  }, [contentType, load]);

  // Handle ?edit=<id> and ?new=1 from URL
  useEffect(() => {
    if (newFlag === "1") {
      setEditing({});
      setIsNew(true);
      updateUrl({ new: null });
      return;
    }
    if (editId && items.length > 0) {
      const item = items.find((i) => i.id === editId);
      if (item) {
        setEditing({ ...item });
        setIsNew(false);
      }
      updateUrl({ edit: null });
    }
  }, [editId, newFlag, items, updateUrl]);

  async function handleSave() {
    if (!editing) return;
    if (!editing.title?.trim() || !editing.speaker?.trim()) {
      notify("Title and speaker are required", "error");
      return;
    }
    setSaving(true);
    const d = {
      title: editing.title.trim(),
      slug: editing.title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      speaker: editing.speaker.trim(),
      description: editing.description?.trim() || null,
      audio_url: editing.audio_url?.trim() || null,
      video_url: editing.video_url?.trim() || null,
      category_id: editing.category_id || null,
    };
    const { data: saved, error } = isNew
      ? await supabase.from(table).insert(d).select("id").single()
      : await supabase
          .from(table)
          .update(d)
          .eq("id", editing.id!)
          .select("id")
          .single();
    setSaving(false);
    if (error) {
      notify(error.message, "error");
      return;
    }
    logAudit({
      action: isNew ? "create" : "update",
      resourceType: contentType,
      resourceId: (saved as { id?: string } | null)?.id ?? editing.id ?? null,
      resourceTitle: d.title,
    });
    notify(isNew ? `${singularLabel} added` : "Changes saved");
    setEditing(null);
    setIsNew(false);
    load();
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      notify(error.message, "error");
      return;
    }
    logAudit({
      action: "delete",
      resourceType: contentType,
      resourceId: id,
      resourceTitle: title,
    });
    notify(`${singularLabel} deleted`);
    load();
  }

  async function handleBulkDelete() {
    const ids = Array.from(selected);
    if (
      !confirm(`Delete ${ids.length} ${singularLabel.toLowerCase()}${ids.length === 1 ? "" : "s"}? This cannot be undone.`)
    )
      return;
    setBulkBusy(true);
    const titles = items.filter((i) => ids.includes(i.id)).map((i) => i.title);
    const { error } = await supabase.from(table).delete().in("id", ids);
    setBulkBusy(false);
    if (error) {
      notify(error.message, "error");
      return;
    }
    logAudit({
      action: "bulk_delete",
      resourceType: contentType,
      resourceTitle: `${ids.length} ${pluralLabel.toLowerCase()}`,
      details: { count: ids.length, ids, titles },
    });
    notify(`${ids.length} ${singularLabel.toLowerCase()}${ids.length === 1 ? "" : "s"} deleted`);
    setSelected(new Set());
    load();
  }

  async function handleBulkReassign(categoryId: string | null) {
    const ids = Array.from(selected);
    setBulkBusy(true);
    const { error } = await supabase
      .from(table)
      .update({ category_id: categoryId })
      .in("id", ids);
    setBulkBusy(false);
    if (error) {
      notify(error.message, "error");
      return;
    }
    logAudit({
      action: "bulk_update",
      resourceType: contentType,
      resourceTitle: `${ids.length} ${pluralLabel.toLowerCase()}`,
      details: { count: ids.length, ids, changes: { category_id: categoryId } },
    });
    notify(`${ids.length} item${ids.length === 1 ? "" : "s"} updated`);
    setSelected(new Set());
    load();
  }

  function updateField<K extends keyof MediaItem>(field: K, value: MediaItem[K] | null) {
    setEditing((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortRaw(`${key}:${sortDir === "asc" ? "desc" : "asc"}`);
    else setSortRaw(`${key}:asc`);
  }

  const categoryMap = useMemo(() => {
    const m = new Map<string, string>();
    categories.forEach((c) => m.set(c.id, c.name));
    return m;
  }, [categories]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return items
      .filter((item) => {
        if (categoryFilter === "none" && item.category_id !== null) return false;
        if (categoryFilter !== "all" && categoryFilter !== "none" && item.category_id !== categoryFilter)
          return false;
        if (!s) return true;
        return item.title.toLowerCase().includes(s) || item.speaker.toLowerCase().includes(s);
      })
      .sort((a, b) => {
        let av: string | number = "";
        let bv: string | number = "";
        if (sortKey === "title") {
          av = a.title.toLowerCase();
          bv = b.title.toLowerCase();
        } else if (sortKey === "speaker") {
          av = a.speaker.toLowerCase();
          bv = b.speaker.toLowerCase();
        } else {
          av = new Date(a.created_at).getTime();
          bv = new Date(b.created_at).getTime();
        }
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [items, search, categoryFilter, sortKey, sortDir]);

  const filterKey = `${search}|${categoryFilter}|${sortRaw}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    if (page !== 1) setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const stats = useMemo(
    () => ({
      total: items.length,
      audio: items.filter((i) => i.audio_url).length,
      video: items.filter((i) => i.video_url).length,
    }),
    [items]
  );

  const allPagedSelected = paged.length > 0 && paged.every((i) => selected.has(i.id));
  const someSelected = selected.size > 0;

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllPaged() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allPagedSelected) {
        paged.forEach((i) => next.delete(i.id));
      } else {
        paged.forEach((i) => next.add(i.id));
      }
      return next;
    });
  }

  return (
    <>
      <PageHeader
        title={pluralLabel}
        subtitle={subtitle}
        actions={
          <PrimaryButton
            onClick={() => {
              setEditing({});
              setIsNew(true);
            }}
          >
            <Plus size={16} /> Add {singularLabel}
          </PrimaryButton>
        }
      />

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label={`Total ${pluralLabel}`} value={stats.total} icon={Mic} />
        <StatCard label="With Audio" value={stats.audio} icon={Headphones} />
        <StatCard label="With Video" value={stats.video} icon={Video} />
      </div>

      <BulkBar
        count={selected.size}
        onClear={() => setSelected(new Set())}
        onDelete={handleBulkDelete}
        onReassign={handleBulkReassign}
        categories={categories}
        busy={bulkBusy}
      />

      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${pluralLabel.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="sm:w-52 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent"
        >
          <option value="all">All categories</option>
          <option value="none">Uncategorized</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="pl-5 py-3 w-8">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-teal-700 focus:ring-teal-700"
                    checked={allPagedSelected}
                    onChange={toggleAllPaged}
                    aria-label="Select all on page"
                  />
                </th>
                <SortHeader
                  label="Title"
                  active={sortKey === "title"}
                  dir={sortDir}
                  onClick={() => toggleSort("title")}
                />
                <SortHeader
                  label="Speaker"
                  hiddenOnMobile
                  active={sortKey === "speaker"}
                  dir={sortDir}
                  onClick={() => toggleSort("speaker")}
                />
                <th className="text-left px-5 py-3 font-medium text-gray-500 hidden lg:table-cell">
                  Category
                </th>
                <th className="text-left px-5 py-3 font-medium text-gray-500 hidden md:table-cell">
                  Media
                </th>
                <th className="text-right px-5 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-5 py-3">
                      <div className="h-10 bg-gray-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <Mic size={32} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No {pluralLabel.toLowerCase()} found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {search
                        ? "Try a different search."
                        : `Add your first ${singularLabel.toLowerCase()} to get started.`}
                    </p>
                  </td>
                </tr>
              ) : (
                paged.map((item) => {
                  const isSelected = selected.has(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50/60 transition-colors ${
                        isSelected ? "bg-teal-50/50" : ""
                      }`}
                    >
                      <td className="pl-5 py-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-teal-700 focus:ring-teal-700"
                          checked={isSelected}
                          onChange={() => toggleOne(item.id)}
                          aria-label={`Select ${item.title}`}
                        />
                      </td>
                      <td className="px-5 py-3">
                        <div className="font-medium text-gray-900 line-clamp-1">{item.title}</div>
                        <div className="text-xs text-gray-500 md:hidden line-clamp-1">
                          {item.speaker}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-700 hidden md:table-cell">
                        {item.speaker}
                      </td>
                      <td className="px-5 py-3 text-gray-500 hidden lg:table-cell">
                        {item.category_id ? (
                          categoryMap.get(item.category_id) ?? (
                            <span className="text-gray-400 italic">Deleted</span>
                          )
                        ) : (
                          <span className="text-gray-400 italic">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                          <Badge ok={!!item.audio_url} label="Audio" />
                          <Badge ok={!!item.video_url} label="Video" />
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        {(item.audio_url || item.video_url) && (
                          <a
                            href={item.video_url || item.audio_url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-teal-700 p-1.5 inline-flex rounded-md hover:bg-teal-50 transition-colors"
                            title="Open media"
                          >
                            <ExternalLink size={15} />
                          </a>
                        )}
                        <button
                          onClick={() => {
                            setEditing({ ...item });
                            setIsNew(false);
                          }}
                          className="text-gray-400 hover:text-teal-700 p-1.5 rounded-md hover:bg-teal-50 transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="text-gray-400 hover:text-rose-600 p-1.5 rounded-md hover:bg-rose-50 transition-colors ml-1"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/40">
            <p className="text-xs text-gray-500">
              {someSelected && (
                <span className="mr-2 text-teal-700 font-semibold">{selected.size} selected · </span>
              )}
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, filtered.length)}
              </span>{" "}
              of <span className="font-semibold text-gray-700">{filtered.length}</span>
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md text-gray-500 hover:bg-white hover:text-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-medium text-gray-600 px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md text-gray-500 hover:bg-white hover:text-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={!!editing}
        onClose={() => {
          if (!saving) {
            setEditing(null);
            setIsNew(false);
          }
        }}
        title={isNew ? `Add ${singularLabel}` : `Edit ${singularLabel}`}
        subtitle={isNew ? `Enter details for the new ${singularLabel.toLowerCase()}` : editing?.title}
        maxWidth="lg"
      >
        {editing && (
          <div className="space-y-4">
            <Field
              label="Title"
              required
              value={editing.title ?? ""}
              onChange={(e) => updateField("title", e.target.value)}
            />
            <Field
              label="Speaker"
              required
              value={editing.speaker ?? ""}
              onChange={(e) => updateField("speaker", e.target.value)}
            />
            <Field
              label="Description"
              textarea
              value={editing.description ?? ""}
              onChange={(e) => updateField("description", e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Audio URL"
                type="url"
                placeholder="https://..."
                value={editing.audio_url ?? ""}
                onChange={(e) => updateField("audio_url", e.target.value)}
              />
              <Field
                label="Video URL"
                type="url"
                placeholder="https://..."
                value={editing.video_url ?? ""}
                onChange={(e) => updateField("video_url", e.target.value)}
              />
            </div>
            <SelectField
              label="Category"
              value={editing.category_id ?? ""}
              onChange={(e) => updateField("category_id", e.target.value || null)}
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </SelectField>

            <div className="flex gap-3 pt-2 border-t border-gray-100 mt-6">
              <PrimaryButton type="button" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : isNew ? `Add ${singularLabel}` : "Save Changes"}
              </PrimaryButton>
              <GhostButton
                type="button"
                onClick={() => {
                  setEditing(null);
                  setIsNew(false);
                }}
              >
                Cancel
              </GhostButton>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

function Badge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${
        ok ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-400"
      }`}
    >
      {label}
    </span>
  );
}

function SortHeader({
  label,
  active,
  dir,
  onClick,
  hiddenOnMobile,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
  hiddenOnMobile?: boolean;
}) {
  return (
    <th
      className={`text-left px-5 py-3 font-medium text-gray-500 ${
        hiddenOnMobile ? "hidden md:table-cell" : ""
      }`}
    >
      <button
        onClick={onClick}
        className={`inline-flex items-center gap-1 hover:text-teal-700 transition-colors ${
          active ? "text-teal-900" : ""
        }`}
      >
        {label}
        <ArrowUpDown
          size={12}
          className={`transition-transform ${active && dir === "desc" ? "rotate-180" : ""}`}
        />
      </button>
    </th>
  );
}
