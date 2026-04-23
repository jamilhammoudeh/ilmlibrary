"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { getRecentlyRead, type ReadingEntry } from "@/lib/reading-progress";

export function RecentlyRead() {
  const [entries, setEntries] = useState<ReadingEntry[]>([]);

  useEffect(() => {
    setEntries(getRecentlyRead());
  }, []);

  if (entries.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-5 pb-8">
      <h2 className="text-lg font-bold text-teal-900 mb-3">Continue Reading</h2>
      <div className="flex gap-4 overflow-x-auto pt-2 pb-4 -mx-5 px-5">
        {entries.map((entry) => (
          <Link
            key={entry.slug}
            href={entry.href}
            target="_blank"
            className="group shrink-0 bg-white rounded-2xl px-4 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200 flex items-center gap-3 max-w-[280px]"
          >
            <BookOpen size={16} className="text-teal-700 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-teal-900 truncate group-hover:text-teal-700 transition-colors duration-200">
                {entry.title}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(entry.lastRead).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
