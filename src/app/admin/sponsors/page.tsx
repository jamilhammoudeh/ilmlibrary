"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { FileUpload } from "@/components/file-upload";
import type { Sponsor } from "@/types/database";
import { Plus, Pencil, Trash2, ExternalLink, BarChart3 } from "lucide-react";

type FormState = {
  id: string | null;
  name: string;
  tagline: string;
  url: string;
  image_url: string;
  type: Sponsor["type"];
  placement: Sponsor["placement"];
  active: boolean;
  sort_order: number;
};

const emptyForm: FormState = {
  id: null,
  name: "",
  tagline: "",
  url: "",
  image_url: "",
  type: "business",
  placement: "homepage",
  active: true,
  sort_order: 0,
};

export default function SponsorsAdminPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [clicks, setClicks] = useState<Map<string, number>>(new Map());
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const { rows } = await adminApi.list<Sponsor>("sponsors", {
        orderBy: [{ col: "sort_order" }, { col: "created_at" }],
      });
      setSponsors(rows);
      // click counts per sponsor (fine at this scale)
      const counts = new Map<string, number>();
      await Promise.all(
        rows.map(async (s) => {
          try {
            const r = await adminApi.list("content_clicks", {
              eq: { content_type: "sponsor", content_id: s.id },
              countOnly: true,
            });
            counts.set(s.id, r.count ?? 0);
          } catch {
            // non-critical
          }
        })
      );
      setClicks(counts);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load sponsors");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    if (!form) return;
    if (!form.name.trim() || !form.url.trim()) {
      setError("Name and URL are required");
      return;
    }
    setSaving(true);
    setError(null);
    const data = {
      name: form.name.trim(),
      tagline: form.tagline.trim() || null,
      url: form.url.trim(),
      image_url: form.image_url || null,
      type: form.type,
      placement: form.placement,
      active: form.active,
      sort_order: form.sort_order,
    };
    try {
      if (form.id) await adminApi.update("sponsors", form.id, data);
      else await adminApi.insert("sponsors", data);
      setForm(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(s: Sponsor) {
    if (!confirm(`Delete sponsor "${s.name}"?`)) return;
    try {
      await adminApi.remove("sponsors", s.id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  async function toggleActive(s: Sponsor) {
    try {
      await adminApi.update("sponsors", s.id, { active: !s.active });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  }

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sponsors</h1>
          <p className="text-sm text-gray-500 mt-1">
            Paid placements shown on the homepage. Clicks are tracked automatically.
          </p>
        </div>
        <button
          onClick={() => setForm({ ...emptyForm })}
          className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={16} /> Add sponsor
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-md px-4 py-3">
          {error}
        </div>
      )}

      {form && (
        <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            {form.id ? "Edit sponsor" : "New sponsor"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-medium text-gray-600">Name *</span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 outline-none"
                placeholder="Dar al-Kutub Bookstore"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-600">Link URL *</span>
              <input
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 outline-none"
                placeholder="https://..."
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-medium text-gray-600">Tagline</span>
              <input
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 outline-none"
                placeholder="One line about the business or book"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-600">Type</span>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as Sponsor["type"] })}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white"
              >
                <option value="business">Business</option>
                <option value="book">Book</option>
                <option value="publisher">Publisher</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-600">Placement</span>
              <select
                value={form.placement}
                onChange={(e) =>
                  setForm({ ...form, placement: e.target.value as Sponsor["placement"] })
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white"
              >
                <option value="homepage">Homepage</option>
                <option value="books">Books pages</option>
                <option value="both">Both</option>
              </select>
            </label>
            <div className="block">
              <span className="text-xs font-medium text-gray-600">Logo / image</span>
              <div className="mt-1">
                <FileUpload
                  bucket="covers"
                  folder="sponsors"
                  accept="image/jpeg,image/png,image/webp"
                  label="Logo"
                  currentUrl={form.image_url}
                  onUpload={(url) => setForm((f) => (f ? { ...f, image_url: url } : f))}
                />
              </div>
              {form.image_url && (
                <p className="text-xs text-gray-500 mt-1 truncate">{form.image_url}</p>
              )}
            </div>
            <div className="flex items-end gap-4">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="rounded border-gray-300"
                />
                Active
              </label>
              <label className="block">
                <span className="text-xs font-medium text-gray-600">Order</span>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) || 0 })}
                  className="mt-1 w-20 rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <button
              onClick={save}
              disabled={saving}
              className="bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setForm(null)}
              className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
        {sponsors.length === 0 && (
          <p className="p-6 text-sm text-gray-500">
            No sponsors yet. Add one and it appears on the homepage instantly.
          </p>
        )}
        {sponsors.map((s) => (
          <div key={s.id} className="flex items-center gap-4 p-4">
            <button
              onClick={() => toggleActive(s)}
              title={s.active ? "Active — click to pause" : "Paused — click to activate"}
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.active ? "bg-emerald-500" : "bg-gray-300"}`}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 truncate">{s.name}</p>
              <p className="text-xs text-gray-500 truncate">
                {s.type} · {s.placement}
                {s.tagline ? ` · ${s.tagline}` : ""}
              </p>
            </div>
            <span
              className="inline-flex items-center gap-1 text-xs text-gray-500 shrink-0"
              title="Tracked clicks"
            >
              <BarChart3 size={13} /> {clicks.get(s.id) ?? 0}
            </span>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-gray-400 hover:text-teal-700 shrink-0"
              title="Open link"
            >
              <ExternalLink size={15} />
            </a>
            <button
              onClick={() =>
                setForm({
                  id: s.id,
                  name: s.name,
                  tagline: s.tagline ?? "",
                  url: s.url,
                  image_url: s.image_url ?? "",
                  type: s.type,
                  placement: s.placement,
                  active: s.active,
                  sort_order: s.sort_order,
                })
              }
              className="p-1.5 text-gray-400 hover:text-teal-700 shrink-0"
              title="Edit"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => remove(s)}
              className="p-1.5 text-gray-400 hover:text-rose-600 shrink-0"
              title="Delete"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
