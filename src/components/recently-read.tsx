"use client";

import { useState, useEffect } from "react";
import { BookCard } from "@/components/book-card";
import { getRecentlyRead, type ReadingEntry } from "@/lib/reading-progress";
import type { Book } from "@/types/database";

export function RecentlyRead() {
  const [entries, setEntries] = useState<ReadingEntry[]>([]);
  const [books, setBooks] = useState<Map<string, Book>>(new Map());

  useEffect(() => {
    const stored = getRecentlyRead();
    setEntries(stored);
    if (stored.length === 0) return;

    // The localStorage history only holds slug/title — fetch covers and
    // author info so the cards render like everywhere else on the site.
    const slugs = stored.map((e) => e.slug).join(",");
    fetch(`/api/books/by-ids?slugs=${encodeURIComponent(slugs)}`)
      .then((r) => (r.ok ? (r.json() as Promise<{ rows: Book[] }>) : { rows: [] as Book[] }))
      .then(({ rows }) => setBooks(new Map(rows.map((b) => [b.slug, b]))))
      .catch(() => {});
  }, []);

  if (entries.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-5 pb-8">
      <h2 className="text-lg font-bold text-teal-900 mb-3">Continue Reading</h2>
      <div className="flex gap-4 overflow-x-auto pt-2 pb-4 -mx-5 px-5">
        {entries.map((entry) => {
          const book = books.get(entry.slug);
          return (
            <div key={entry.slug} className="shrink-0">
              <BookCard
                size="sm"
                href={entry.href}
                book={{
                  id: book?.id ?? entry.slug,
                  slug: entry.slug,
                  title: book?.title ?? entry.title,
                  author: book?.author ?? new Date(entry.lastRead).toLocaleDateString(),
                  cover_url: book?.cover_url ?? null,
                  language: book?.language,
                  title_alt: book?.title_alt,
                }}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
