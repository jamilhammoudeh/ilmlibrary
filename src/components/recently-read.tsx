"use client";

import { useState, useEffect } from "react";
import { BookCard } from "@/components/book-card";
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
          <div key={entry.slug} className="shrink-0">
            <BookCard
              size="sm"
              href={entry.href}
              book={{
                id: entry.slug,
                slug: entry.slug,
                title: entry.title,
                author: new Date(entry.lastRead).toLocaleDateString(),
                cover_url: null,
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
