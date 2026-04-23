"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Page } from "@/types/database";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  FileText,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Folder,
  FolderOpen,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { Modal } from "@/components/admin/modal";
import { Field, SelectField, PrimaryButton, GhostButton } from "@/components/admin/form-fields";
import { useToast } from "@/components/admin/toast";
import { FileUpload } from "@/components/file-upload";
import { useUrlString, useUrlUpdater } from "@/hooks/use-url-state";
import { logAudit } from "@/lib/audit";

export default function AdminPagesPage() {
  return (
    <Suspense fallback={<div className="h-40 bg-gray-100 rounded animate-pulse" />}>
      <PagesAdmin />
    </Suspense>
  );
}

type EditingPage = Partial<Page>;

function PagesAdmin() {
  const { notify } = useToast();
  const updateUrl = useUrlUpdater();

  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditingPage | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useUrlString("q", "");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editId] = useUrlString("edit", "");
  const [newFlag] = useUrlString("new", "");
  const [parentIdForNew] = useUrlString("parent", "");

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("pages")
      .select("*")
      .order("sort_order")
      .order("title");
    setPages(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Expand all on first load
  useEffect(() => {
    if (pages.length > 0 && expanded.size === 0) {
      setExpanded(new Set(pages.filter((p) => !p.parent_id).map((p) => p.id)));
    }
  }, [pages, expanded.size]);

  // Handle ?edit / ?new from URL
  useEffect(() => {
    if (newFlag === "1") {
      setEditing({
        parent_id: parentIdForNew || null,
        hidden: false,
        sort_order: 0,
      });
      setIsNew(true);
      updateUrl({ new: null, parent: null });
      return;
    }
    if (editId && pages.length > 0) {
      const page = pages.find((p) => p.id === editId);
      if (page) {
        setEditing({ ...page });
        setIsNew(false);
      }
      updateUrl({ edit: null });
    }
  }, [editId, newFlag, parentIdForNew, pages, updateUrl]);

  async function handleSave() {
    if (!editing) return;
    if (!editing.title?.trim() || !editing.slug?.trim()) {
      notify("Title and slug are required", "error");
      return;
    }
    setSaving(true);

    const pageData = {
      slug: editing.slug.trim().toLowerCase().replace(/\s+/g, "-"),
      parent_id: editing.parent_id || null,
      title: editing.title.trim(),
      subtitle: editing.subtitle?.trim() || null,
      hero_image_url: editing.hero_image_url?.trim() || null,
      body: editing.body?.trim() || null,
      meta_description: editing.meta_description?.trim() || null,
      sort_order: editing.sort_order ?? 0,
      hidden: editing.hidden ?? false,
    };

    const { data: saved, error } = isNew
      ? await supabase.from("pages").insert(pageData).select("id").single()
      : await supabase
          .from("pages")
          .update(pageData)
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
      resourceType: "page",
      resourceId: (saved as { id?: string } | null)?.id ?? editing.id ?? null,
      resourceTitle: pageData.title,
    });

    notify(isNew ? "Page created" : "Changes saved");
    setEditing(null);
    setIsNew(false);
    load();
    window.dispatchEvent(new CustomEvent("admin:pages:changed"));
  }

  async function handleDelete(page: Page) {
    const childCount = pages.filter((p) => p.parent_id === page.id).length;
    const msg = childCount > 0
      ? `Delete "${page.title}" and unparent its ${childCount} sub-page${childCount === 1 ? "" : "s"}?`
      : `Delete "${page.title}"? This cannot be undone.`;
    if (!confirm(msg)) return;
    const { error } = await supabase.from("pages").delete().eq("id", page.id);
    if (error) {
      notify(error.message, "error");
      return;
    }
    logAudit({
      action: "delete",
      resourceType: "page",
      resourceId: page.id,
      resourceTitle: page.title,
    });
    notify("Page deleted");
    load();
    window.dispatchEvent(new CustomEvent("admin:pages:changed"));
  }

  async function toggleHidden(page: Page) {
    const { error } = await supabase
      .from("pages")
      .update({ hidden: !page.hidden })
      .eq("id", page.id);
    if (error) {
      notify(error.message, "error");
      return;
    }
    notify(!page.hidden ? "Page hidden" : "Page visible");
    load();
    window.dispatchEvent(new CustomEvent("admin:pages:changed"));
  }

  async function move(page: Page, direction: -1 | 1) {
    const siblings = pages
      .filter((p) => p.parent_id === page.parent_id)
      .sort((a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title));
    const idx = siblings.findIndex((p) => p.id === page.id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= siblings.length) return;
    const other = siblings[swapIdx];
    await Promise.all([
      supabase.from("pages").update({ sort_order: other.sort_order }).eq("id", page.id),
      supabase.from("pages").update({ sort_order: page.sort_order }).eq("id", other.id),
    ]);
    load();
    window.dispatchEvent(new CustomEvent("admin:pages:changed"));
  }

  function updateField<K extends keyof Page>(field: K, value: Page[K] | null) {
    setEditing((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Build tree
  const tree = useMemo(() => {
    const byParent = new Map<string | null, Page[]>();
    pages.forEach((p) => {
      const key = p.parent_id ?? null;
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key)!.push(p);
    });
    byParent.forEach((list) =>
      list.sort((a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title))
    );
    return byParent;
  }, [pages]);

  // Parent options for the edit modal (excluding current + descendants)
  const parentOptions = useMemo(() => {
    if (!editing) return pages;
    const excludeIds = new Set<string>();
    if (editing.id) {
      excludeIds.add(editing.id);
      const stack = [editing.id];
      while (stack.length > 0) {
        const parent = stack.pop()!;
        pages.filter((p) => p.parent_id === parent).forEach((p) => {
          excludeIds.add(p.id);
          stack.push(p.id);
        });
      }
    }
    return pages.filter((p) => !excludeIds.has(p.id));
  }, [pages, editing]);

  const searchLower = search.trim().toLowerCase();
  const filteredPages = searchLower
    ? pages.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.slug.toLowerCase().includes(searchLower) ||
          p.subtitle?.toLowerCase().includes(searchLower)
      )
    : null;

  const stats = useMemo(() => {
    const topLevel = pages.filter((p) => !p.parent_id).length;
    const subPages = pages.filter((p) => p.parent_id).length;
    const hidden = pages.filter((p) => p.hidden).length;
    return { total: pages.length, topLevel, subPages, hidden };
  }, [pages]);

  return (
    <>
      <PageHeader
        title="Pages"
        subtitle="Manage every site page — landing pages, info pages, and nested sub-pages"
        actions={
          <PrimaryButton
            onClick={() => {
              setEditing({ parent_id: null, hidden: false, sort_order: 0 });
              setIsNew(true);
            }}
          >
            <Plus size={16} /> New Page
          </PrimaryButton>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Pages" value={stats.total} icon={FileText} />
        <StatCard label="Top-level" value={stats.topLevel} icon={Folder} />
        <StatCard label="Sub-pages" value={stats.subPages} icon={FolderOpen} />
        <StatCard
          label="Hidden"
          value={stats.hidden}
          icon={EyeOff}
          hint={stats.hidden > 0 ? "Not shown on site" : "All visible"}
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search pages by title, slug, or subtitle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : pages.length === 0 ? (
          <div className="py-16 text-center">
            <FileText size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No pages yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Create your first page to manage landing pages and info content.
            </p>
            <div className="mt-4">
              <PrimaryButton
                onClick={() => {
                  setEditing({ parent_id: null, hidden: false, sort_order: 0 });
                  setIsNew(true);
                }}
              >
                <Plus size={16} /> New Page
              </PrimaryButton>
            </div>
          </div>
        ) : filteredPages ? (
          <ul className="divide-y divide-gray-200">
            {filteredPages.map((page) => (
              <PageRow
                key={page.id}
                page={page}
                depth={0}
                expanded={expanded}
                onToggleExpand={toggleExpand}
                onEdit={() => {
                  setEditing({ ...page });
                  setIsNew(false);
                }}
                onDelete={() => handleDelete(page)}
                onToggleHidden={() => toggleHidden(page)}
                onMove={(dir) => move(page, dir)}
                onAddChild={() => {
                  setEditing({
                    parent_id: page.id,
                    hidden: false,
                    sort_order: 0,
                  });
                  setIsNew(true);
                }}
                hasChildren={pages.some((p) => p.parent_id === page.id)}
                flat
                canMoveUp={false}
                canMoveDown={false}
              />
            ))}
          </ul>
        ) : (
          <TreeRenderer
            parentId={null}
            tree={tree}
            depth={0}
            expanded={expanded}
            onToggleExpand={toggleExpand}
            onEdit={(p) => {
              setEditing({ ...p });
              setIsNew(false);
            }}
            onDelete={handleDelete}
            onToggleHidden={toggleHidden}
            onMove={move}
            onAddChild={(parent) => {
              setEditing({
                parent_id: parent.id,
                hidden: false,
                sort_order: 0,
              });
              setIsNew(true);
            }}
          />
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
        title={isNew ? "New Page" : "Edit Page"}
        subtitle={isNew ? "Create a new page or sub-page" : editing?.title}
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
                label="Slug"
                required
                hint="URL path, e.g. 'about' or 'why-islam/proving-islam'"
                value={editing.slug ?? ""}
                onChange={(e) => updateField("slug", e.target.value)}
              />
            </div>
            <Field
              label="Subtitle"
              value={editing.subtitle ?? ""}
              onChange={(e) => updateField("subtitle", e.target.value)}
            />
            <SelectField
              label="Parent Page"
              hint="Leave blank for a top-level page"
              value={editing.parent_id ?? ""}
              onChange={(e) => updateField("parent_id", e.target.value || null)}
            >
              <option value="">(No parent — top-level)</option>
              {parentOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.slug})
                </option>
              ))}
            </SelectField>

            <FileUpload
              bucket="covers"
              folder="page-heroes"
              accept="image/jpeg,image/png,image/webp"
              label="Hero Image"
              currentUrl={editing.hero_image_url ?? ""}
              onUpload={(url) => updateField("hero_image_url", url)}
            />

            <Field
              label="Body"
              textarea
              rows={10}
              hint="Plain text or Markdown"
              value={editing.body ?? ""}
              onChange={(e) => updateField("body", e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Meta Description"
                hint="For SEO / social previews"
                value={editing.meta_description ?? ""}
                onChange={(e) => updateField("meta_description", e.target.value)}
              />
              <Field
                label="Sort Order"
                type="number"
                hint="Lower numbers come first"
                value={String(editing.sort_order ?? 0)}
                onChange={(e) =>
                  updateField("sort_order", Number.parseInt(e.target.value, 10) || 0)
                }
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none bg-gray-50 px-4 py-3 rounded-lg">
              <input
                type="checkbox"
                checked={editing.hidden ?? false}
                onChange={(e) => updateField("hidden", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-teal-700 focus:ring-teal-700"
              />
              <span>
                <span className="font-medium">Hide this page from the public site</span>
                <span className="block text-xs text-gray-500 mt-0.5">
                  Admin can still edit it
                </span>
              </span>
            </label>

            <div className="flex gap-3 pt-2 border-t border-gray-100 mt-6">
              <PrimaryButton type="button" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : isNew ? "Create Page" : "Save Changes"}
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

function TreeRenderer({
  parentId,
  tree,
  depth,
  expanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onToggleHidden,
  onMove,
  onAddChild,
}: {
  parentId: string | null;
  tree: Map<string | null, Page[]>;
  depth: number;
  expanded: Set<string>;
  onToggleExpand: (id: string) => void;
  onEdit: (page: Page) => void;
  onDelete: (page: Page) => void;
  onToggleHidden: (page: Page) => void;
  onMove: (page: Page, dir: -1 | 1) => void;
  onAddChild: (parent: Page) => void;
}) {
  const rows = tree.get(parentId) ?? [];
  if (rows.length === 0) return null;

  return (
    <ul className={depth === 0 ? "divide-y divide-gray-200" : ""}>
      {rows.map((page, idx) => {
        const hasChildren = (tree.get(page.id) ?? []).length > 0;
        const isExpanded = expanded.has(page.id);
        return (
          <li key={page.id} className={depth > 0 ? "border-l border-gray-200 ml-4" : ""}>
            <PageRow
              page={page}
              depth={depth}
              expanded={expanded}
              onToggleExpand={onToggleExpand}
              onEdit={() => onEdit(page)}
              onDelete={() => onDelete(page)}
              onToggleHidden={() => onToggleHidden(page)}
              onMove={(dir) => onMove(page, dir)}
              onAddChild={() => onAddChild(page)}
              hasChildren={hasChildren}
              canMoveUp={idx > 0}
              canMoveDown={idx < rows.length - 1}
            />
            {hasChildren && isExpanded && (
              <TreeRenderer
                parentId={page.id}
                tree={tree}
                depth={depth + 1}
                expanded={expanded}
                onToggleExpand={onToggleExpand}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleHidden={onToggleHidden}
                onMove={onMove}
                onAddChild={onAddChild}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

function PageRow({
  page,
  depth,
  expanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onToggleHidden,
  onMove,
  onAddChild,
  hasChildren,
  canMoveUp,
  canMoveDown,
  flat,
}: {
  page: Page;
  depth: number;
  expanded: Set<string>;
  onToggleExpand: (id: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleHidden: () => void;
  onMove: (dir: -1 | 1) => void;
  onAddChild: () => void;
  hasChildren: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  flat?: boolean;
}) {
  const isExpanded = expanded.has(page.id);

  return (
    <div
      className={`group flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 transition-colors ${
        page.hidden ? "opacity-60" : ""
      }`}
      style={{ paddingLeft: `${16 + depth * 20}px` }}
    >
      <button
        onClick={() => hasChildren && onToggleExpand(page.id)}
        className={`w-5 h-5 flex items-center justify-center text-gray-400 shrink-0 ${
          hasChildren ? "hover:text-teal-700" : "invisible"
        }`}
      >
        {hasChildren && (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
      </button>

      <div className="w-5 h-5 flex items-center justify-center text-gray-400 shrink-0">
        {hasChildren ? <FolderOpen size={14} /> : <FileText size={14} />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-gray-900 truncate">{page.title}</span>
          <span className="text-xs text-gray-400 font-mono">/{page.slug}</span>
          {page.hidden && (
            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              Hidden
            </span>
          )}
          {flat && page.parent_id && (
            <span className="text-[10px] uppercase tracking-wider font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
              Sub-page
            </span>
          )}
        </div>
        {page.subtitle && (
          <p className="text-xs text-gray-500 truncate mt-0.5">{page.subtitle}</p>
        )}
      </div>

      <div className="flex gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {!flat && (
          <>
            <button
              onClick={() => onMove(-1)}
              disabled={!canMoveUp}
              title="Move up"
              className="text-gray-400 hover:text-teal-700 p-1.5 rounded-md hover:bg-teal-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowUp size={14} />
            </button>
            <button
              onClick={() => onMove(1)}
              disabled={!canMoveDown}
              title="Move down"
              className="text-gray-400 hover:text-teal-700 p-1.5 rounded-md hover:bg-teal-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowDown size={14} />
            </button>
          </>
        )}
        <button
          onClick={onAddChild}
          title="Add sub-page"
          className="text-gray-400 hover:text-teal-700 p-1.5 rounded-md hover:bg-teal-50 transition-colors"
        >
          <Plus size={14} />
        </button>
        <a
          href={`/${page.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          title="View on site"
          className="text-gray-400 hover:text-teal-700 p-1.5 inline-flex rounded-md hover:bg-teal-50 transition-colors"
        >
          <ExternalLink size={14} />
        </a>
        <button
          onClick={onToggleHidden}
          title={page.hidden ? "Show on site" : "Hide from site"}
          className="text-gray-400 hover:text-teal-700 p-1.5 rounded-md hover:bg-teal-50 transition-colors"
        >
          {page.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
        <button
          onClick={onEdit}
          title="Edit"
          className="text-gray-400 hover:text-teal-700 p-1.5 rounded-md hover:bg-teal-50 transition-colors"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={onDelete}
          title="Delete"
          className="text-gray-400 hover:text-rose-600 p-1.5 rounded-md hover:bg-rose-50 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
