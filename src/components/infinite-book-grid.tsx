"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { BookCard } from "@/components/book-card";
import type { Book } from "@/types/database";

const PAGE_SIZE = 30;

export function InfiniteBookGrid({
  categoryId,
  categorySlug,
  initialBooks,
  total,
  lang,
}: {
  categoryId: string;
  categorySlug: string;
  initialBooks: Book[];
  total: number;
  lang?: string;
}) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialBooks.length < total);
  const observerRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await fetch(
        `/api/books?category=${encodeURIComponent(categoryId)}&offset=${
          books.length
        }&limit=${PAGE_SIZE}${lang ? `&lang=${encodeURIComponent(lang)}` : ""}`
      );
      const data = res.ok
        ? ((await res.json()) as { rows: Book[] }).rows
        : null;

      if (data) {
        setBooks((prev) => [...prev, ...data]);
        if (data.length < PAGE_SIZE) setHasMore(false);
      }
    } catch {
      // Failed load: keep existing books, allow retry on next intersection.
    }
    setLoading(false);
  }, [loading, hasMore, books.length, categoryId, lang]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "400px" }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      <p className="text-sm text-gray-500 text-center mb-6">
        {total} book{total !== 1 ? "s" : ""}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 max-w-7xl mx-auto fade-in-up">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            href={`/books/${categorySlug}/${book.slug}`}
            readHref={`/read/${book.slug}`}
          />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={observerRef} className="h-10" />

      {loading && (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-3 border-teal-200 border-t-teal-700 rounded-full animate-spin" />
        </div>
      )}
    </>
  );
}
