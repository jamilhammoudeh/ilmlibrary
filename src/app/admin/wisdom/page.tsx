"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Wisdom } from "@/types/database";
import { Plus, Pencil, Trash2, Search, Quote, User } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { Modal } from "@/components/admin/modal";
import { Field, PrimaryButton, GhostButton } from "@/components/admin/form-fields";
import { useToast } from "@/components/admin/toast";
import { useUrlString, useUrlUpdater } from "@/hooks/use-url-state";
import { logAudit } from "@/lib/audit";

export default function AdminWisdomPage() {
  return (
    <Suspense fallback={<div className="h-40 bg-gray-100 rounded animate-pulse" />}>
      <WisdomAdmin />
    </Suspense>
  );
}

function WisdomAdmin() {
  const { notify } = useToast();
  const updateUrl = useUrlUpdater();
  const [items, setItems] = useState<Wisdom[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Wisdom> | null>(null);
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
      .from("wisdom")
      .select("*")
      .order("attribution")
      .limit(500);
    setItems(data ?? []);
    setLoading(false);
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.quote_english?.trim() || !editing.attribution?.trim()) {
      notify("Quote and attribution are required", "error");
      return;
    }
    setSaving(true);
    const d = {
      quote_arabic: editing.quote_arabic?.trim() || null,
      quote_english: editing.quote_english.trim(),
      attribution: editing.attribution.trim(),
      source: editing.source?.trim() || null,
      category_id: null,
    };
    const { data: saved, error } = isNew
      ? await supabase.from("wisdom").insert(d).select("id").single()
      : await supabase
          .from("wisdom")
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
      resourceType: "wisdom",
      resourceId: (saved as { id?: string } | null)?.id ?? editing.id ?? null,
      resourceTitle: d.attribution,
    });
    notify(isNew ? "Quote added" : "Changes saved");
    setEditing(null);
    setIsNew(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this quote? This cannot be undone.")) return;
    const target = items.find((w) => w.id === id);
    const { error } = await supabase.from("wisdom").delete().eq("id", id);
    if (error) {
      notify(error.message, "error");
      return;
    }
    logAudit({
      action: "delete",
      resourceType: "wisdom",
      resourceId: id,
      resourceTitle: target?.attribution ?? null,
    });
    notify("Quote deleted");
    load();
  }

  function updateField<K extends keyof Wisdom>(field: K, value: Wisdom[K] | null) {
    setEditing((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return items;
    return items.filter(
      (w) =>
        w.quote_english.toLowerCase().includes(s) ||
        w.attribution.toLowerCase().includes(s) ||
        w.source?.toLowerCase().includes(s)
    );
  }, [items, search]);

  const stats = useMemo(() => {
    const attributions = new Set(items.map((w) => w.attribution));
    return {
      total: items.length,
      withArabic: items.filter((w) => w.quote_arabic).length,
      attributions: attributions.size,
    };
  }, [items]);

  return (
    <>
      <PageHeader
        title="Wisdom"
        subtitle="Timeless quotes and reflections from scholars and the Sunnah"
        actions={
          <PrimaryButton
            onClick={() => {
              setEditing({});
              setIsNew(true);
            }}
          >
            <Plus size={16} /> Add Quote
          </PrimaryButton>
        }
      />

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Total Quotes" value={stats.total} icon={Quote} tone="rose" />
        <StatCard label="With Arabic" value={stats.withArabic} icon={Quote} tone="teal" />
        <StatCard
          label="Unique Attributions"
          value={stats.attributions}
          icon={User}
          tone="violet"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search quotes, attributions, or sources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 text-center py-16">
          <Quote size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No quotes found</p>
          <p className="text-xs text-gray-400 mt-1">
            {search ? "Try a different search." : "Add your first quote to get started."}
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
                  {item.quote_arabic && (
                    <p className="arabic-text text-lg text-teal-900 mb-2">{item.quote_arabic}</p>
                  )}
                  <p className="text-gray-800 italic leading-relaxed">
                    <Quote size={14} className="inline text-teal-600 mr-1 -mt-1" />
                    {item.quote_english}
                  </p>
                  <p className="text-sm text-teal-700 font-medium mt-2">— {item.attribution}</p>
                  {item.source && (
                    <p className="text-xs text-gray-400 mt-1">{item.source}</p>
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
        title={isNew ? "Add Quote" : "Edit Quote"}
        subtitle={isNew ? "Enter the wisdom quote details" : editing?.attribution}
        maxWidth="lg"
      >
        {editing && (
          <div className="space-y-4">
            <Field
              label="Quote (English)"
              required
              textarea
              rows={3}
              value={editing.quote_english ?? ""}
              onChange={(e) => updateField("quote_english", e.target.value)}
            />
            <Field
              label="Quote (Arabic)"
              textarea
              rows={3}
              value={editing.quote_arabic ?? ""}
              onChange={(e) => updateField("quote_arabic", e.target.value)}
            />
            <Field
              label="Attribution"
              required
              hint="e.g., Imam al-Ghazali, Prophet Muhammad ﷺ"
              value={editing.attribution ?? ""}
              onChange={(e) => updateField("attribution", e.target.value)}
            />
            <Field
              label="Source"
              hint="e.g., Ihya Ulum al-Din"
              value={editing.source ?? ""}
              onChange={(e) => updateField("source", e.target.value)}
            />
            <div className="flex gap-3 pt-2 border-t border-gray-100 mt-6">
              <PrimaryButton type="button" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : isNew ? "Add Quote" : "Save Changes"}
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
