"use client";

import { Search, X, Loader2, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { EmptyState } from "@/components/empty-state";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type BookResult = {
  id: string;
  title: string;
  slug: string;
  author: string;
  cover_url: string | null;
  categorySlug: string;
};

export function BooksBrowser({ categories }: { categories: Category[] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmed = query.trim();
  const searching = trimmed.length >= 2;

  useEffect(() => {
    if (!searching) {
      setResults([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const timer = setTimeout(async () => {
      const like = `%${trimmed}%`;
      const [booksRes, catsRes] = await Promise.all([
        supabase
          .from("books")
          .select("id, title, slug, author, cover_url, category_id")
          .or(`title.ilike.${like},author.ilike.${like}`)
          .order("title")
          .limit(30),
        supabase.from("categories").select("id, slug"),
      ]);

      if (cancelled) return;

      const catMap = new Map<string, string>();
      for (const c of catsRes.data ?? []) catMap.set(c.id, c.slug);

      const merged: BookResult[] = (booksRes.data ?? []).map((b) => ({
        id: b.id,
        title: b.title,
        slug: b.slug,
        author: b.author,
        cover_url: b.cover_url,
        categorySlug:
          (b.category_id && catMap.get(b.category_id)) ?? "uncategorized",
      }));

      setResults(merged);
      setLoading(false);
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmed, searching]);

  const hasQuery = query.length > 0;

  return (
    <>
      {/* Description card — hidden while searching */}
      {!searching && (
        <section className="w-[92%] mx-auto my-8 fade-in-up">
          <div className="bg-teal-100 rounded-2xl px-8 py-10 text-center shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
            <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[22px] leading-[1.6]">
              Explore a comprehensive collection of Islamic literature,
              systematically categorized for easy navigation. From Seerah and
              Hadith to Fiqh and Aqeedah, access detailed knowledge in each
              section.
            </p>
          </div>
        </section>
      )}

      {/* Search input */}
      <section className={`px-5 ${searching ? "mt-8" : "mt-2"} mb-1`}>
        <div className="w-[70%] mx-auto relative">
          <Search
            className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
              focused ? "text-teal-700" : "text-gray-400"
            }`}
            size={20}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search for books..."
            className={`w-full pl-12 ${
              hasQuery ? "pr-11" : "pr-4"
            } py-3 rounded-full bg-white text-gray-900 border border-gray-200 outline-none transition-all duration-200 ${
              focused
                ? "shadow-[0_8px_24px_rgba(0,77,64,0.15)] border-teal-700/40 ring-2 ring-teal-700/15"
                : "shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
            }`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {loading ? (
              <Loader2 size={18} className="text-teal-700 animate-spin" />
            ) : hasQuery ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X size={16} />
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {/* Results or categories */}
      <section className="py-8 pb-20 md:pb-24 px-5">
        {searching ? (
          loading && results.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-12 text-gray-500 fade-in">
              <Loader2 size={18} className="animate-spin" />
              <span>Searching...</span>
            </div>
          ) : results.length === 0 ? (
            <EmptyState
              icon={<BookOpen size={28} />}
              title="No books found"
              message={`We couldn't find anything matching "${trimmed}". Try a different title, author, or category.`}
            />
          ) : (
            <div
              key={results[0]?.id ?? "empty"}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-7xl mx-auto fade-in-up"
            >
              {results.map((book) => (
                <Link
                  key={book.id}
                  href={`/books/${book.categorySlug}/${book.slug}`}
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
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm p-2 text-center">
                        {book.title}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-teal-900 line-clamp-2 group-hover:text-teal-700 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      {book.author}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-wrap justify-center gap-4 max-w-7xl mx-auto fade-in-up">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/books/${cat.slug}`}
                className="group w-[calc(50%-0.5rem)] sm:w-[230px] h-[58px] bg-white rounded-2xl flex items-center justify-center text-center font-[family-name:var(--font-roboto)] text-[17px] font-bold text-teal-900 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
              >
                <span className="group-hover:text-teal-700 transition-colors px-2">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
