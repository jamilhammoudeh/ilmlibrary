"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { Book, Category } from "@/types/database";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  BookOpen,
  FileX,
  ImageOff,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  GripVertical,
} from "lucide-react";
import { FileUpload } from "@/components/file-upload";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { Modal } from "@/components/admin/modal";
import { Field, SelectField, PrimaryButton, GhostButton } from "@/components/admin/form-fields";
import { useToast } from "@/components/admin/toast";
import { BulkBar } from "@/components/admin/bulk-bar";
import { useUrlString, useUrlNumber, useUrlUpdater } from "@/hooks/use-url-state";
import { logAudit } from "@/lib/audit";

type SortKey = "title" | "author" | "created_at" | "display_order";
type SortDir = "asc" | "desc";
const PAGE_SIZE = 20;

export default function AdminBooksPage() {
  return (
    <Suspense fallback={<div className="h-40 bg-gray-100 rounded animate-pulse" />}>
      <BooksAdmin />
    </Suspense>
  );
}

function BooksAdmin() {
  const { notify } = useToast();
  const updateUrl = useUrlUpdater();

  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Book> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const [counts, setCounts] = useState<{
    total: number;
    missingPdf: number;
    missingCover: number;
    missingDescription: number;
    missingCategory: number;
    truncated: boolean;
  } | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropIdx, setDropIdx] = useState<number | null>(null);

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

  const loadBooks = useCallback(async () => {
    setLoading(true);

    // Fetch accurate counts in parallel with the list
    const countOpts = { count: "exact" as const, head: true };
    const [listR, totalR, missingPdfR, missingCoverR, missingDescR, missingCatR] =
      await Promise.all([
        supabase.from("books").select("*").range(0, 999),
        supabase.from("books").select("*", countOpts),
        supabase.from("books").select("*", countOpts).is("pdf_url", null),
        supabase.from("books").select("*", countOpts).is("cover_url", null),
        supabase.from("books").select("*", countOpts).is("description", null),
        supabase.from("books").select("*", countOpts).is("category_id", null),
      ]);

    const list = listR.data ?? [];
    const total = totalR.count ?? list.length;

    setBooks(list);
    setCounts({
      total,
      missingPdf: missingPdfR.count ?? 0,
      missingCover: missingCoverR.count ?? 0,
      missingDescription: missingDescR.count ?? 0,
      missingCategory: missingCatR.count ?? 0,
      truncated: total > list.length,
    });
    setLoading(false);
  }, []);

  const loadCategories = useCallback(async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("content_type", "book")
      .order("name");
    setCategories(data ?? []);
  }, []);

  useEffect(() => {
    loadBooks();
    loadCategories();
  }, [loadBooks, loadCategories]);

  // Handle ?edit=<id> and ?new=1 from URL
  useEffect(() => {
    if (newFlag === "1") {
      setEditing({});
      setIsNew(true);
      updateUrl({ new: null });
      return;
    }
    if (!editId) return;
    if (books.length === 0) return;

    const local = books.find((b) => b.id === editId);
    if (local) {
      setEditing({ ...local });
      setIsNew(false);
      updateUrl({ edit: null });
      return;
    }
    // Fallback: book is not in the loaded list. Fetch it directly.
    supabase
      .from("books")
      .select("*")
      .eq("id", editId)
      .single()
      .then(({ data }) => {
        if (data) {
          setEditing({ ...data });
          setIsNew(false);
        } else {
          notify("Book not found", "error");
        }
        updateUrl({ edit: null });
      });
  }, [editId, newFlag, books, updateUrl, notify]);

  async function handleSave() {
    if (!editing) return;
    if (!editing.title?.trim() || !editing.author?.trim()) {
      notify("Title and author are required", "error");
      return;
    }
    setSaving(true);

    function slugify(s: string): string {
      return s
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    // Generate a unique slug for new books by appending a suffix if taken.
    // For existing books, only regenerate if the title changed AND the current
    // slug is empty or obviously derived from the old title.
    async function uniqueSlug(base: string): Promise<string> {
      let candidate = base;
      let suffix = 1;
      while (true) {
        const { count } = await supabase
          .from("books")
          .select("*", { count: "exact", head: true })
          .eq("slug", candidate)
          .neq("id", editing!.id ?? "");
        if ((count ?? 0) === 0) return candidate;
        suffix += 1;
        candidate = `${base}-${suffix}`;
      }
    }

    let slug: string;
    if (isNew) {
      slug = await uniqueSlug(slugify(editing.title));
    } else {
      // Preserve existing slug on edit to keep public URLs stable.
      slug = (editing as Book).slug ?? slugify(editing.title);
    }

    const bookData = {
      title: editing.title.trim(),
      slug,
      author: editing.author.trim(),
      translator: editing.translator?.trim() || null,
      description: editing.description?.trim() || null,
      cover_url: editing.cover_url || null,
      pdf_url: editing.pdf_url || null,
      category_id: editing.category_id || null,
    };

    const { data: saved, error } = isNew
      ? await supabase.from("books").insert(bookData).select("id").single()
      : await supabase
          .from("books")
          .update(bookData)
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
      resourceType: "book",
      resourceId: saved?.id ?? editing.id ?? null,
      resourceTitle: bookData.title,
    });

    notify(isNew ? "Book added" : "Changes saved");
    setEditing(null);
    setIsNew(false);
    loadBooks();
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (error) {
      notify(error.message, "error");
      return;
    }
    logAudit({
      action: "delete",
      resourceType: "book",
      resourceId: id,
      resourceTitle: title,
    });
    notify("Book deleted");
    loadBooks();
  }

  async function handleBulkDelete() {
    const ids = Array.from(selected);
    if (!confirm(`Delete ${ids.length} book${ids.length === 1 ? "" : "s"}? This cannot be undone.`))
      return;
    setBulkBusy(true);
    const titles = books.filter((b) => ids.includes(b.id)).map((b) => b.title);
    const { error } = await supabase.from("books").delete().in("id", ids);
    setBulkBusy(false);
    if (error) {
      notify(error.message, "error");
      return;
    }
    logAudit({
      action: "bulk_delete",
      resourceType: "book",
      resourceTitle: `${ids.length} books`,
      details: { count: ids.length, ids, titles },
    });
    notify(`${ids.length} book${ids.length === 1 ? "" : "s"} deleted`);
    setSelected(new Set());
    loadBooks();
  }

  async function handleBulkReassign(categoryId: string | null) {
    const ids = Array.from(selected);
    setBulkBusy(true);
    const { error } = await supabase
      .from("books")
      .update({ category_id: categoryId })
      .in("id", ids);
    setBulkBusy(false);
    if (error) {
      notify(error.message, "error");
      return;
    }
    logAudit({
      action: "bulk_update",
      resourceType: "book",
      resourceTitle: `${ids.length} books`,
      details: { count: ids.length, ids, changes: { category_id: categoryId } },
    });
    notify(`${ids.length} book${ids.length === 1 ? "" : "s"} updated`);
    setSelected(new Set());
    loadBooks();
  }

  function updateField<K extends keyof Book>(field: K, value: Book[K] | null) {
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
    return books
      .filter((b) => {
        if (categoryFilter === "none" && b.category_id !== null) return false;
        if (categoryFilter !== "all" && categoryFilter !== "none" && b.category_id !== categoryFilter)
          return false;
        if (!s) return true;
        return (
          b.title.toLowerCase().includes(s) ||
          b.author.toLowerCase().includes(s) ||
          (b.translator?.toLowerCase().includes(s) ?? false)
        );
      })
      .sort((a, b) => {
        let av: string | number = "";
        let bv: string | number = "";
        if (sortKey === "title") {
          av = a.title.toLowerCase();
          bv = b.title.toLowerCase();
        } else if (sortKey === "author") {
          av = a.author.toLowerCase();
          bv = b.author.toLowerCase();
        } else if (sortKey === "display_order") {
          av = (a as { display_order?: number }).display_order ?? 0;
          bv = (b as { display_order?: number }).display_order ?? 0;
        } else {
          av = new Date(a.created_at).getTime();
          bv = new Date(b.created_at).getTime();
        }
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [books, search, categoryFilter, sortKey, sortDir]);

  // Reset to page 1 when filter changes
  const filterKey = `${search}|${categoryFilter}|${sortRaw}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    if (page !== 1) setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);


  const allPagedSelected = paged.length > 0 && paged.every((b) => selected.has(b.id));
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
        paged.forEach((b) => next.delete(b.id));
      } else {
        paged.forEach((b) => next.add(b.id));
      }
      return next;
    });
  }

  async function handleDragReorder(draggedId: string, targetIdx: number) {
    // filtered is sorted ascending by display_order in this mode
    const sorted = filtered.slice();
    const fromIdx = sorted.findIndex((b) => b.id === draggedId);
    if (fromIdx === -1) return;

    // Normalize targetIdx: dropping on your own spot or the next one is a no-op
    const insertAt = fromIdx < targetIdx ? targetIdx - 1 : targetIdx;
    if (insertAt === fromIdx) return;

    const [moved] = sorted.splice(fromIdx, 1);
    sorted.splice(insertAt, 0, moved);

    const before = sorted[insertAt - 1] as (Book & { display_order?: number }) | undefined;
    const after = sorted[insertAt + 1] as (Book & { display_order?: number }) | undefined;
    const beforeOrder = before ? before.display_order ?? 0 : null;
    const afterOrder = after ? after.display_order ?? 0 : null;

    let newOrder: number;
    if (beforeOrder !== null && afterOrder !== null) {
      newOrder = (beforeOrder + afterOrder) / 2;
    } else if (afterOrder !== null) {
      newOrder = afterOrder - 100;
    } else if (beforeOrder !== null) {
      newOrder = beforeOrder + 100;
    } else {
      newOrder = 0;
    }

    const collision =
      (beforeOrder !== null && Math.abs(newOrder - beforeOrder) < 0.0001) ||
      (afterOrder !== null && Math.abs(newOrder - afterOrder) < 0.0001);

    if (collision) {
      // Rebalance: reassign sequential integers across the visible filtered set
      const updates = sorted.map((b, i) => ({ id: b.id, display_order: (i + 1) * 10 }));
      setBooks((prev) =>
        prev.map((bk) => {
          const u = updates.find((x) => x.id === bk.id);
          return u ? ({ ...bk, display_order: u.display_order } as Book) : bk;
        })
      );
      const results = await Promise.all(
        updates.map((u) =>
          supabase.from("books").update({ display_order: u.display_order }).eq("id", u.id)
        )
      );
      if (results.some((r) => r.error)) {
        notify("Reorder failed", "error");
        loadBooks();
      }
      return;
    }

    // Optimistic single-row update
    setBooks((prev) =>
      prev.map((bk) =>
        bk.id === draggedId ? ({ ...bk, display_order: newOrder } as Book) : bk
      )
    );
    const { error } = await supabase
      .from("books")
      .update({ display_order: newOrder })
      .eq("id", draggedId);
    if (error) {
      notify("Reorder failed", "error");
      loadBooks();
    }
  }

  async function handleReorder(bookId: string, direction: "up" | "down") {
    // Find the book and its sibling in the filtered (sorted) list
    const idx = filtered.findIndex((b) => b.id === bookId);
    if (idx === -1) return;
    const siblingIdx = direction === "up" ? idx - 1 : idx + 1;
    if (siblingIdx < 0 || siblingIdx >= filtered.length) return;
    const a = filtered[idx] as Book & { display_order?: number };
    const b = filtered[siblingIdx] as Book & { display_order?: number };
    const aOrder = a.display_order ?? 0;
    const bOrder = b.display_order ?? 0;

    // Optimistic update
    setBooks((prev) =>
      prev.map((bk) => {
        if (bk.id === a.id) return { ...bk, display_order: bOrder } as Book;
        if (bk.id === b.id) return { ...bk, display_order: aOrder } as Book;
        return bk;
      })
    );

    const [r1, r2] = await Promise.all([
      supabase.from("books").update({ display_order: bOrder }).eq("id", a.id),
      supabase.from("books").update({ display_order: aOrder }).eq("id", b.id),
    ]);
    if (r1.error || r2.error) {
      notify("Reorder failed", "error");
      loadBooks();
    }
  }

  return (
    <>
      <PageHeader
        title="Books"
        subtitle="Manage your library's book catalog"
        actions={
          <PrimaryButton
            onClick={() => {
              setEditing({});
              setIsNew(true);
            }}
          >
            <Plus size={16} /> Add Book
          </PrimaryButton>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        <StatCard
          label="Total Books"
          value={counts?.total ?? null}
          icon={BookOpen}
        />
        <StatCard
          label="Missing PDF"
          value={counts?.missingPdf ?? null}
          icon={FileX}
          hint={
            counts ? (counts.missingPdf > 0 ? "Needs upload" : "All set") : undefined
          }
        />
        <StatCard
          label="Missing Cover"
          value={counts?.missingCover ?? null}
          icon={ImageOff}
          hint={
            counts
              ? counts.missingCover > 0
                ? "Needs image"
                : "All set"
              : undefined
          }
        />
        <StatCard
          label="Missing Description"
          value={counts?.missingDescription ?? null}
          icon={FileX}
          hint={
            counts
              ? counts.missingDescription > 0
                ? "Needs copy"
                : "All set"
              : undefined
          }
        />
        <StatCard
          label="Uncategorized"
          value={counts?.missingCategory ?? null}
          icon={FileX}
          hint={
            counts
              ? counts.missingCategory > 0
                ? "Needs category"
                : "All set"
              : undefined
          }
        />
      </div>

      {counts?.truncated && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-md px-4 py-2.5 text-xs text-amber-900 flex items-start gap-2">
          <ArrowUpDown size={14} className="shrink-0 mt-0.5" />
          <div>
            Showing the first {books.length.toLocaleString()} of{" "}
            {counts.total.toLocaleString()} books in the table below. Counts
            above reflect the full library. Use search or filter to find older
            books beyond the first page set.
          </div>
        </div>
      )}

      <BulkBar
        count={selected.size}
        onClear={() => setSelected(new Set())}
        onDelete={handleBulkDelete}
        onReassign={handleBulkReassign}
        categories={categories}
        busy={bulkBusy}
      />

      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, author, translator..."
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

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="pl-3 py-3 w-8"></th>
                <th className="pl-1 py-3 w-8">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-teal-700 focus:ring-teal-700"
                    checked={allPagedSelected}
                    onChange={toggleAllPaged}
                    aria-label="Select all on page"
                  />
                </th>
                <th className="text-left px-3 py-3 font-medium text-gray-500 w-14"></th>
                <SortHeader
                  label="Title"
                  active={sortKey === "title"}
                  dir={sortDir}
                  onClick={() => toggleSort("title")}
                />
                <SortHeader
                  label="Author"
                  hiddenOnMobile
                  active={sortKey === "author"}
                  dir={sortDir}
                  onClick={() => toggleSort("author")}
                />
                <th className="text-left px-5 py-3 font-medium text-gray-500 hidden lg:table-cell">
                  Category
                </th>
                <th className="text-left px-5 py-3 font-medium text-gray-500 hidden md:table-cell">
                  Files
                </th>
                <SortHeader
                  label="Order"
                  active={sortKey === "display_order"}
                  dir={sortDir}
                  onClick={() => toggleSort("display_order")}
                />
                <th className="text-right px-5 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={8} className="px-5 py-3">
                      <div className="h-10 bg-gray-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <BookOpen size={32} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No books found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {search ? "Try a different search." : "Add your first book to get started."}
                    </p>
                  </td>
                </tr>
              ) : (
                paged.map((book) => {
                  const isSelected = selected.has(book.id);
                  const dndOn = sortKey === "display_order" && sortDir === "asc";
                  const bookFilteredIdx = filtered.findIndex((b) => b.id === book.id);
                  const isDragging = dragId === book.id;
                  const showDropBefore =
                    dndOn &&
                    dropIdx !== null &&
                    dropIdx === bookFilteredIdx &&
                    dragId !== null &&
                    dragId !== book.id;
                  return (
                    <tr
                      key={book.id}
                      draggable={dndOn}
                      onDragStart={(e) => {
                        if (!dndOn) return;
                        setDragId(book.id);
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("text/plain", book.id);
                      }}
                      onDragOver={(e) => {
                        if (!dndOn || !dragId) return;
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";
                        const rect = e.currentTarget.getBoundingClientRect();
                        const half = rect.top + rect.height / 2;
                        const idx =
                          e.clientY < half ? bookFilteredIdx : bookFilteredIdx + 1;
                        if (idx !== dropIdx) setDropIdx(idx);
                      }}
                      onDrop={(e) => {
                        if (!dndOn || !dragId) return;
                        e.preventDefault();
                        const target = dropIdx ?? bookFilteredIdx;
                        const dId = dragId;
                        setDragId(null);
                        setDropIdx(null);
                        handleDragReorder(dId, target);
                      }}
                      onDragEnd={() => {
                        setDragId(null);
                        setDropIdx(null);
                      }}
                      className={`hover:bg-gray-50/60 transition-colors ${
                        isSelected ? "bg-teal-50/50" : ""
                      } ${isDragging ? "opacity-40" : ""} ${
                        showDropBefore ? "!border-t-2 !border-t-teal-600" : ""
                      }`}
                    >
                      <td className="pl-3 pr-0 py-2.5 w-8">
                        {dndOn ? (
                          <div
                            className="text-gray-300 hover:text-gray-600 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-100"
                            title="Drag to reorder"
                          >
                            <GripVertical size={14} />
                          </div>
                        ) : null}
                      </td>
                      <td className="pl-1 py-2.5">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-teal-700 focus:ring-teal-700"
                          checked={isSelected}
                          onChange={() => toggleOne(book.id)}
                          aria-label={`Select ${book.title}`}
                        />
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="w-10 h-14 rounded-md overflow-hidden bg-gray-100 shrink-0 relative">
                          {book.cover_url ? (
                            <Image
                              src={book.cover_url}
                              alt=""
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <BookOpen size={14} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="font-medium text-gray-900 line-clamp-1">{book.title}</div>
                        <div className="text-xs text-gray-500 md:hidden line-clamp-1">
                          {book.author}
                        </div>
                        {book.translator && (
                          <div className="text-xs text-gray-400 italic line-clamp-1">
                            tr. {book.translator}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-2.5 text-gray-700 hidden md:table-cell">
                        {book.author}
                      </td>
                      <td className="px-5 py-2.5 text-gray-500 hidden lg:table-cell">
                        {book.category_id ? (
                          categoryMap.get(book.category_id) ?? (
                            <span className="text-gray-400 italic">Deleted</span>
                          )
                        ) : (
                          <span className="text-gray-400 italic">—</span>
                        )}
                      </td>
                      <td className="px-5 py-2.5 hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                          <Badge ok={!!book.pdf_url} label="PDF" />
                          <Badge ok={!!book.cover_url} label="Cover" />
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        {sortKey === "display_order" ? (
                          <div className="flex items-center gap-0.5">
                            <button
                              onClick={() => handleReorder(book.id, "up")}
                              disabled={filtered[0]?.id === book.id}
                              className="p-1 rounded hover:bg-teal-50 text-gray-500 hover:text-teal-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              title="Move up"
                            >
                              <ChevronUp size={14} />
                            </button>
                            <button
                              onClick={() => handleReorder(book.id, "down")}
                              disabled={filtered[filtered.length - 1]?.id === book.id}
                              className="p-1 rounded hover:bg-teal-50 text-gray-500 hover:text-teal-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              title="Move down"
                            >
                              <ChevronDown size={14} />
                            </button>
                            <span className="text-xs text-gray-400 ml-1 tabular-nums">
                              {(book as { display_order?: number }).display_order ?? 0}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">
                            {(book as { display_order?: number }).display_order ?? 0}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-2.5 text-right whitespace-nowrap">
                        {book.pdf_url && (
                          <a
                            href={book.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-teal-700 p-1.5 inline-flex rounded-md hover:bg-teal-50 transition-colors"
                            title="Open PDF"
                          >
                            <ExternalLink size={15} />
                          </a>
                        )}
                        <button
                          onClick={() => {
                            setEditing({ ...book });
                            setIsNew(false);
                          }}
                          className="text-gray-400 hover:text-teal-700 p-1.5 rounded-md hover:bg-teal-50 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(book.id, book.title)}
                          className="text-gray-400 hover:text-rose-600 p-1.5 rounded-md hover:bg-rose-50 transition-colors ml-1"
                          title="Delete"
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

      {/* Edit/Add modal */}
      <Modal
        open={!!editing}
        onClose={() => {
          if (!saving) {
            setEditing(null);
            setIsNew(false);
          }
        }}
        title={isNew ? "Add Book" : "Edit Book"}
        subtitle={isNew ? "Enter details for the new book" : editing?.title}
        maxWidth="lg"
      >
        {editing && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Title"
                required
                value={editing.title ?? ""}
                onChange={(e) => updateField("title", e.target.value)}
              />
              <Field
                label="Author"
                required
                value={editing.author ?? ""}
                onChange={(e) => updateField("author", e.target.value)}
              />
            </div>
            <Field
              label="Translator"
              value={editing.translator ?? ""}
              onChange={(e) => updateField("translator", e.target.value)}
            />
            <Field
              label="Description"
              textarea
              value={editing.description ?? ""}
              onChange={(e) => updateField("description", e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUpload
                bucket="covers"
                folder="uploads"
                accept="image/jpeg,image/png,image/webp"
                label="Cover Image"
                currentUrl={editing.cover_url ?? ""}
                onUpload={(url) => updateField("cover_url", url)}
              />
              <FileUpload
                bucket="books"
                folder="uploads"
                accept="application/pdf"
                label="PDF File"
                currentUrl={editing.pdf_url ?? ""}
                onUpload={(url) => updateField("pdf_url", url)}
              />
            </div>

            <SelectField
              label="Category"
              value={editing.category_id ?? ""}
              onChange={(e) => updateField("category_id", e.target.value || null)}
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </SelectField>

            <div className="flex gap-3 pt-2 border-t border-gray-100 mt-6">
              <PrimaryButton type="button" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : isNew ? "Add Book" : "Save Changes"}
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
