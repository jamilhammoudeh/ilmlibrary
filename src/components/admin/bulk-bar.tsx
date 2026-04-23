"use client";

import { X, Trash2, Tag } from "lucide-react";
import type { Category } from "@/types/database";

type BulkBarProps = {
  count: number;
  onClear: () => void;
  onDelete: () => void;
  onReassign: (categoryId: string | null) => void;
  categories: Category[];
  busy?: boolean;
};

export function BulkBar({ count, onClear, onDelete, onReassign, categories, busy }: BulkBarProps) {
  if (count === 0) return null;

  return (
    <div className="sticky top-0 z-30 -mx-6 lg:-mx-8 mb-4">
      <div className="mx-6 lg:mx-8 bg-teal-900 text-white rounded-md shadow-md flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={onClear}
            className="w-7 h-7 rounded hover:bg-teal-800 flex items-center justify-center"
            title="Clear selection"
            disabled={busy}
          >
            <X size={15} />
          </button>
          <span className="text-sm font-medium">
            {count} selected
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative inline-flex items-center">
            <Tag size={14} className="absolute left-2.5 text-teal-200 pointer-events-none" />
            <select
              onChange={(e) => {
                const val = e.target.value;
                if (val === "__noop") return;
                onReassign(val === "__none" ? null : val);
                e.target.value = "__noop";
              }}
              disabled={busy}
              className="appearance-none bg-teal-800 hover:bg-teal-700 text-white text-sm font-medium pl-8 pr-3 py-1.5 rounded border-0 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
              defaultValue="__noop"
            >
              <option value="__noop">Reassign category...</option>
              <option value="__none">Remove category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={onDelete}
            disabled={busy}
            className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-sm font-medium px-3 py-1.5 rounded transition-colors"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
