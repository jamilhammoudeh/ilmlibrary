"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/types/database";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  FolderOpen,
  BookOpen,
  Mic,
  Speaker,
  HandHeart,
  Quote,
  FileText,
  Search,
  CornerDownRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { Modal } from "@/components/admin/modal";
import { Field, SelectField, PrimaryButton, GhostButton } from "@/components/admin/form-fields";
import { useToast } from "@/components/admin/toast";
import { useUrlString, useUrlUpdater } from "@/hooks/use-url-state";
import { logAudit } from "@/lib/audit";

const contentTypes = ["book", "lecture", "khutba", "dua", "wisdom", "guide"] as const;
type ContentType = (typeof contentTypes)[number];

const typeMeta: Record<
  ContentType,
  { label: string; Icon: React.ComponentType<{ size?: number }>; tone: string }
> = {
  book: { label: "Books", Icon: BookOpen, tone: "bg-teal-50 text-teal-700" },
  lecture: { label: "Lectures", Icon: Mic, tone: "bg-sky-50 text-sky-700" },
  khutba: { label: "Khutbas", Icon: Speaker, tone: "bg-violet-50 text-violet-700" },
  dua: { label: "Duas", Icon: HandHeart, tone: "bg-amber-50 text-amber-700" },
  wisdom: { label: "Wisdom", Icon: Quote, tone: "bg-rose-50 text-rose-700" },
  guide: { label: "Guides", Icon: FileText, tone: "bg-emerald-50 text-emerald-700" },
};

export default function AdminCategoriesPage() {
  return (
    <Suspense fallback={<div className="h-40 bg-gray-100 rounded animate-pulse" />}>
      <CategoriesAdmin />
    </Suspense>
  );
}

function CategoriesAdmin() {
  const { notify } = useToast();
  const updateUrl = useUrlUpdater();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Category> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [search, setSearch] = useUrlString("q", "");
  const [saving, setSaving] = useState(false);
  const [editId] = useUrlString("edit", "");
  const [newFlag] = useUrlString("new", "");

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (newFlag === "1") {
      setEditing({ content_type: "book", hidden: false });
      setIsNew(true);
      updateUrl({ new: null });
      return;
    }
    if (editId && categories.length > 0) {
      const cat = categories.find((c) => c.id === editId);
      if (cat) {
        setEditing(cat);
        setIsNew(false);
      }
      updateUrl({ edit: null });
    }
  }, [editId, newFlag, categories, updateUrl]);

  async function loadCategories() {
    setLoading(true);
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("content_type")
      .order("sort_order")
      .order("name");
    setCategories(data ?? []);
    setLoading(false);
  }

  async function handleReorder(catId: string, direction: "up" | "down") {
    // Find the category and its sibling at the same parent level + content type
    const cat = categories.find((c) => c.id === catId);
    if (!cat) return;
    const siblings = categories
      .filter(
        (c) =>
          c.content_type === cat.content_type &&
          (c.parent_id ?? null) === (cat.parent_id ?? null)
      )
      .sort(
        (a, b) =>
          (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name)
      );
    const idx = siblings.findIndex((s) => s.id === catId);
    const siblingIdx = direction === "up" ? idx - 1 : idx + 1;
    if (siblingIdx < 0 || siblingIdx >= siblings.length) return;
    const a = siblings[idx];
    const b = siblings[siblingIdx];
    const aOrder = a.sort_order ?? 0;
    const bOrder = b.sort_order ?? 0;

    // Optimistic update
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === a.id) return { ...c, sort_order: bOrder };
        if (c.id === b.id) return { ...c, sort_order: aOrder };
        return c;
      })
    );

    const [r1, r2] = await Promise.all([
      supabase.from("categories").update({ sort_order: bOrder }).eq("id", a.id),
      supabase.from("categories").update({ sort_order: aOrder }).eq("id", b.id),
    ]);
    if (r1.error || r2.error) {
      notify("Reorder failed", "error");
      loadCategories();
    }
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.name?.trim() || !editing.content_type) {
      notify("Name and content type are required", "error");
      return;
    }
    setSaving(true);
    const catData = {
      name: editing.name.trim(),
      slug: editing.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      description: editing.description?.trim() || null,
      content_type: editing.content_type,
      image_url: editing.image_url?.trim() || null,
      hidden: editing.hidden ?? false,
      parent_id: editing.parent_id || null,
    };
    const { data: saved, error } = isNew
      ? await supabase.from("categories").insert(catData).select("id").single()
      : await supabase
          .from("categories")
          .update(catData)
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
      resourceType: "category",
      resourceId: (saved as { id?: string } | null)?.id ?? editing.id ?? null,
      resourceTitle: catData.name,
    });
    notify(isNew ? "Category added" : "Changes saved");
    setEditing(null);
    setIsNew(false);
    loadCategories();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? Items in it will become uncategorized.`)) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      notify(error.message, "error");
      return;
    }
    logAudit({
      action: "delete",
      resourceType: "category",
      resourceId: id,
      resourceTitle: name,
    });
    notify("Category deleted");
    loadCategories();
  }

  async function toggleHidden(cat: Category) {
    const { error } = await supabase
      .from("categories")
      .update({ hidden: !cat.hidden })
      .eq("id", cat.id);
    if (error) {
      notify(error.message, "error");
      return;
    }
    notify(!cat.hidden ? "Category hidden" : "Category visible");
    loadCategories();
  }

  function updateField<K extends keyof Category>(field: K, value: Category[K] | null) {
    setEditing((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return categories;
    return categories.filter(
      (c) => c.name.toLowerCase().includes(s) || c.slug.toLowerCase().includes(s)
    );
  }, [categories, search]);

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, Category[]>>((acc, cat) => {
      if (!acc[cat.content_type]) acc[cat.content_type] = [];
      acc[cat.content_type].push(cat);
      return acc;
    }, {});
  }, [filtered]);

  const stats = useMemo(
    () => ({
      total: categories.length,
      hidden: categories.filter((c) => c.hidden).length,
      types: new Set(categories.map((c) => c.content_type)).size,
    }),
    [categories]
  );

  return (
    <>
      <PageHeader
        title="Categories"
        subtitle="Organize content by topic across your library"
        actions={
          <PrimaryButton
            onClick={() => {
              setEditing({ content_type: "book", hidden: false });
              setIsNew(true);
            }}
          >
            <Plus size={16} /> Add Category
          </PrimaryButton>
        }
      />

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Total Categories" value={stats.total} icon={FolderOpen} tone="teal" />
        <StatCard
          label="Hidden"
          value={stats.hidden}
          icon={EyeOff}
          tone={stats.hidden > 0 ? "amber" : "teal"}
          hint={stats.hidden > 0 ? "Not shown on site" : "All visible"}
        />
        <StatCard label="Content Types" value={stats.types} icon={FileText} tone="violet" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 text-center py-16">
          <FolderOpen size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No categories found</p>
          <p className="text-xs text-gray-400 mt-1">
            {search ? "Try a different search." : "Add your first category to get started."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {contentTypes
            .filter((type) => grouped[type]?.length)
            .map((type) => {
              const meta = typeMeta[type];
              const Icon = meta.Icon;
              const cats = grouped[type];
              return (
                <div key={type}>
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${meta.tone}`}>
                      <Icon size={14} />
                    </div>
                    <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-500">
                      {meta.label}
                    </h2>
                    <span className="text-xs text-gray-400">({cats.length})</span>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100 overflow-hidden">
                    <CategoryTreeList
                      cats={cats}
                      parentId={null}
                      depth={0}
                      onEdit={(c) => {
                        setEditing(c);
                        setIsNew(false);
                      }}
                      onDelete={handleDelete}
                      onToggleHidden={toggleHidden}
                      onReorder={handleReorder}
                      onAddChild={(parent) => {
                        setEditing({
                          content_type: parent.content_type,
                          parent_id: parent.id,
                          hidden: false,
                        });
                        setIsNew(true);
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => {
          if (!saving) {
            setEditing(null);
            setIsNew(false);
          }
        }}
        title={isNew ? "Add Category" : "Edit Category"}
        subtitle={isNew ? "Create a new content grouping" : editing?.name}
        maxWidth="md"
      >
        {editing && (
          <div className="space-y-4">
            <Field
              label="Name"
              required
              value={editing.name ?? ""}
              onChange={(e) => updateField("name", e.target.value)}
            />
            <SelectField
              label="Content Type"
              required
              value={editing.content_type ?? "book"}
              onChange={(e) =>
                updateField("content_type", e.target.value as ContentType)
              }
            >
              {contentTypes.map((t) => (
                <option key={t} value={t}>
                  {typeMeta[t].label}
                </option>
              ))}
            </SelectField>
            <SelectField
              label="Parent Category"
              hint="Leave blank for a top-level category. Sub-categories nest under a parent of the same content type."
              value={editing.parent_id ?? ""}
              onChange={(e) => updateField("parent_id", e.target.value || null)}
            >
              <option value="">(No parent — top-level)</option>
              {categories
                .filter((c) => {
                  if (c.content_type !== editing.content_type) return false;
                  if (editing.id && c.id === editing.id) return false;
                  // Prevent assigning to own descendant
                  if (editing.id) {
                    const descendants = new Set<string>();
                    const stack = [editing.id];
                    while (stack.length > 0) {
                      const parent = stack.pop()!;
                      categories
                        .filter((x) => x.parent_id === parent)
                        .forEach((x) => {
                          descendants.add(x.id);
                          stack.push(x.id);
                        });
                    }
                    if (descendants.has(c.id)) return false;
                  }
                  return true;
                })
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </SelectField>
            <Field
              label="Description"
              textarea
              rows={3}
              value={editing.description ?? ""}
              onChange={(e) => updateField("description", e.target.value)}
            />
            <Field
              label="Image URL"
              type="url"
              placeholder="https://..."
              value={editing.image_url ?? ""}
              onChange={(e) => updateField("image_url", e.target.value)}
            />
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none bg-gray-50 px-4 py-3 rounded-lg">
              <input
                type="checkbox"
                checked={editing.hidden ?? false}
                onChange={(e) => updateField("hidden", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-teal-700 focus:ring-teal-700"
              />
              <span>
                <span className="font-medium">Hide this category from the public site</span>
                <span className="block text-xs text-gray-500 mt-0.5">
                  Items in this category won&apos;t appear in listings
                </span>
              </span>
            </label>
            <div className="flex gap-3 pt-2 border-t border-gray-100 mt-6">
              <PrimaryButton type="button" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : isNew ? "Add Category" : "Save Changes"}
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

function CategoryTreeList({
  cats,
  parentId,
  depth,
  onEdit,
  onDelete,
  onToggleHidden,
  onReorder,
  onAddChild,
}: {
  cats: Category[];
  parentId: string | null;
  depth: number;
  onEdit: (c: Category) => void;
  onDelete: (id: string, name: string) => void;
  onToggleHidden: (c: Category) => void;
  onReorder: (id: string, direction: "up" | "down") => void;
  onAddChild: (parent: Category) => void;
}) {
  const rows = cats
    .filter((c) => (c.parent_id ?? null) === parentId)
    .sort(
      (a, b) =>
        (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name)
    );

  if (rows.length === 0) return null;

  return (
    <>
      {rows.map((cat, idx) => {
        const hasChildren = cats.some((c) => c.parent_id === cat.id);
        const isFirst = idx === 0;
        const isLast = idx === rows.length - 1;
        return (
          <div key={cat.id}>
            <div
              className={`group flex items-center justify-between px-5 py-3 hover:bg-gray-50/60 transition-colors ${
                cat.hidden ? "opacity-60" : ""
              }`}
              style={{ paddingLeft: `${20 + depth * 24}px` }}
            >
              <div className="flex items-center gap-2 min-w-0">
                {depth > 0 && <CornerDownRight size={13} className="text-gray-300 shrink-0" />}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-900">{cat.name}</span>
                    <span className="text-xs text-gray-400 font-mono">/{cat.slug}</span>
                    {cat.hidden && (
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        Hidden
                      </span>
                    )}
                    {depth > 0 && (
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                        Sub
                      </span>
                    )}
                  </div>
                  {cat.description && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {cat.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <div className="flex items-center mr-1 opacity-40 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onReorder(cat.id, "up")}
                    disabled={isFirst}
                    title="Move up"
                    className="text-gray-400 hover:text-teal-700 p-1 rounded hover:bg-teal-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={() => onReorder(cat.id, "down")}
                    disabled={isLast}
                    title="Move down"
                    className="text-gray-400 hover:text-teal-700 p-1 rounded hover:bg-teal-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onAddChild(cat)}
                    title="Add sub-category"
                    className="text-gray-400 hover:text-teal-700 p-1.5 rounded-md hover:bg-teal-50 transition-colors"
                  >
                    <Plus size={15} />
                  </button>
                  <button
                    onClick={() => onToggleHidden(cat)}
                    title={cat.hidden ? "Show on site" : "Hide from site"}
                    className="text-gray-400 hover:text-teal-700 p-1.5 rounded-md hover:bg-teal-50 transition-colors"
                  >
                    {cat.hidden ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button
                    onClick={() => onEdit(cat)}
                    className="text-gray-400 hover:text-teal-700 p-1.5 rounded-md hover:bg-teal-50 transition-colors"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(cat.id, cat.name)}
                    className="text-gray-400 hover:text-rose-600 p-1.5 rounded-md hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
            {hasChildren && (
              <CategoryTreeList
                cats={cats}
                parentId={cat.id}
                depth={depth + 1}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleHidden={onToggleHidden}
                onReorder={onReorder}
                onAddChild={onAddChild}
              />
            )}
          </div>
        );
      })}
    </>
  );
}
