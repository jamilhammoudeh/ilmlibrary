"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Dua } from "@/types/database";
import { Plus, Pencil, Trash2, Search, HandHeart, BookMarked, Globe } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { Modal } from "@/components/admin/modal";
import { Field, PrimaryButton, GhostButton } from "@/components/admin/form-fields";
import { useToast } from "@/components/admin/toast";
import { useUrlString, useUrlUpdater } from "@/hooks/use-url-state";
import { logAudit } from "@/lib/audit";

export default function AdminDuasPage() {
  return (
    <Suspense fallback={<div className="h-40 bg-gray-100 rounded animate-pulse" />}>
      <DuasAdmin />
    </Suspense>
  );
}

function DuasAdmin() {
  const { notify } = useToast();
  const updateUrl = useUrlUpdater();
  const [items, setItems] = useState<Dua[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Dua> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [search, setSearch] = useUrlString("q", "");
  const [saving, setSaving] = useState(false);
  const [editId] = useUrlString("edit", "");
  const [newFlag] = useUrlString("new", "");

  useEffect(() => {
    load();
  }, []);

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

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("duas")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    setItems(data ?? []);
    setLoading(false);
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.arabic_text?.trim() || !editing.translation?.trim()) {
      notify("Arabic text and translation are required", "error");
      return;
    }
    setSaving(true);
    const d = {
      title: editing.title?.trim() || null,
      arabic_text: editing.arabic_text.trim(),
      translation: editing.translation.trim(),
      transliteration: editing.transliteration?.trim() || null,
      source: editing.source?.trim() || null,
      category_id: null,
    };
    const { data: saved, error } = isNew
      ? await supabase.from("duas").insert(d).select("id").single()
      : await supabase
          .from("duas")
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
      resourceType: "dua",
      resourceId: (saved as { id?: string } | null)?.id ?? editing.id ?? null,
      resourceTitle: d.title ?? d.translation?.slice(0, 80) ?? null,
    });
    notify(isNew ? "Dua added" : "Changes saved");
    setEditing(null);
    setIsNew(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this dua? This cannot be undone.")) return;
    const target = items.find((d) => d.id === id);
    const { error } = await supabase.from("duas").delete().eq("id", id);
    if (error) {
      notify(error.message, "error");
      return;
    }
    logAudit({
      action: "delete",
      resourceType: "dua",
      resourceId: id,
      resourceTitle: target?.title ?? target?.translation?.slice(0, 80) ?? null,
    });
    notify("Dua deleted");
    load();
  }

  function updateField<K extends keyof Dua>(field: K, value: Dua[K] | null) {
    setEditing((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return items;
    return items.filter(
      (d) =>
        d.title?.toLowerCase().includes(s) ||
        d.translation.toLowerCase().includes(s) ||
        d.source?.toLowerCase().includes(s)
    );
  }, [items, search]);

  const stats = useMemo(
    () => ({
      total: items.length,
      withSource: items.filter((d) => d.source).length,
      withTransliteration: items.filter((d) => d.transliteration).length,
    }),
    [items]
  );

  return (
    <>
      <PageHeader
        title="Duas"
        subtitle="Manage supplications with Arabic text, translations, and transliterations"
        actions={
          <PrimaryButton
            onClick={() => {
              setEditing({});
              setIsNew(true);
            }}
          >
            <Plus size={16} /> Add Dua
          </PrimaryButton>
        }
      />

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Total Duas" value={stats.total} icon={HandHeart} tone="amber" />
        <StatCard label="With Source" value={stats.withSource} icon={BookMarked} tone="teal" />
        <StatCard
          label="With Transliteration"
          value={stats.withTransliteration}
          icon={Globe}
          tone="sky"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, translation, or source..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 text-center py-16">
          <HandHeart size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No duas found</p>
          <p className="text-xs text-gray-400 mt-1">
            {search ? "Try a different search." : "Add your first dua to get started."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  {item.title && (
                    <h3 className="font-semibold text-teal-900 mb-2">{item.title}</h3>
                  )}
                  <p className="text-gray-800 arabic-text text-lg mb-2">{item.arabic_text}</p>
                  {item.transliteration && (
                    <p className="text-sm text-gray-500 italic mb-1">{item.transliteration}</p>
                  )}
                  <p className="text-sm text-gray-700">{item.translation}</p>
                  {item.source && (
                    <p className="text-xs text-gray-400 mt-2 inline-flex items-center gap-1">
                      <BookMarked size={11} /> {item.source}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
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
                    onClick={() => handleDelete(item.id)}
                    className="text-gray-400 hover:text-rose-600 p-1.5 rounded-md hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
        title={isNew ? "Add Dua" : "Edit Dua"}
        subtitle={isNew ? "Enter the supplication details" : editing?.title ?? "Edit supplication"}
        maxWidth="lg"
      >
        {editing && (
          <div className="space-y-4">
            <Field
              label="Title (optional)"
              value={editing.title ?? ""}
              onChange={(e) => updateField("title", e.target.value)}
            />
            <Field
              label="Arabic Text"
              required
              textarea
              rows={3}
              value={editing.arabic_text ?? ""}
              onChange={(e) => updateField("arabic_text", e.target.value)}
            />
            <Field
              label="Translation"
              required
              textarea
              rows={3}
              value={editing.translation ?? ""}
              onChange={(e) => updateField("translation", e.target.value)}
            />
            <Field
              label="Transliteration"
              value={editing.transliteration ?? ""}
              onChange={(e) => updateField("transliteration", e.target.value)}
            />
            <Field
              label="Source"
              hint="e.g., Sahih al-Bukhari, Quran 2:286"
              value={editing.source ?? ""}
              onChange={(e) => updateField("source", e.target.value)}
            />
            <div className="flex gap-3 pt-2 border-t border-gray-100 mt-6">
              <PrimaryButton type="button" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : isNew ? "Add Dua" : "Save Changes"}
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
