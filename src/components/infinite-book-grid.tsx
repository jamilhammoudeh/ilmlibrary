"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { Book } from "@/types/database";

const PAGE_SIZE = 30;

export function InfiniteBookGrid({
  categoryId,
  categorySlug,
  initialBooks,
  total,
}: {
  categoryId: string;
  categorySlug: string;
  initialBooks: Book[];
  total: number;
}) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialBooks.length < total);
  const observerRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const { data } = await supabase
      .from("books")
      .select("*")
      .eq("category_id", categoryId)
      .order("display_order")
      .range(books.length, books.length + PAGE_SIZE - 1);

    if (data) {
      setBooks((prev) => [...prev, ...data]);
      if (data.length < PAGE_SIZE) setHasMore(false);
    }
    setLoading(false);
  }, [loading, hasMore, books.length, categoryId]);

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
          <Link
            key={book.id}
            href={`/books/${categorySlug}/${book.slug}`}
            className="group bg-white rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
          >
            <div className="relative aspect-[2/3] bg-teal-50 overflow-hidden">
              {book.cover_url ? (
                <Image
                  src={book.cover_url}
                  alt={book.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2U4ZjVmMyIvPjwvc3ZnPg=="
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm p-2 text-center">
                  {book.title}
                </div>
              )}
              <div className="absolute inset-0 bg-teal-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="bg-white text-teal-900 font-bold text-sm px-4 py-2 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
                  View More
                </span>
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-semibold text-teal-900 line-clamp-2 group-hover:text-teal-700 transition-colors duration-200">
                {book.title}
              </h3>
              {book.author && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                  {book.author}
                </p>
              )}
            </div>
          </Link>
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
