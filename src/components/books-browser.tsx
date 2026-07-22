"use client";

import { Search, X, Loader2, BookOpen } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BookCard } from "@/components/book-card";
import { EmptyState } from "@/components/empty-state";
import { useUrlString } from "@/hooks/use-url-state";
import type { Book, Category as CategoryRow } from "@/types/database";

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
  language: string;
  title_alt: string | null;
  categorySlug: string;
};

const LANG_TABS = [
  { value: "", label: "All" },
  { value: "en", label: "English" },
  { value: "ar", label: "العربية", arabic: true },
] as const;

export function BooksBrowser({
  categories,
  initialLang = "",
  initialSort = "default",
}: {
  categories: Category[];
  initialLang?: string;
  initialSort?: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ?lang= and ?sort= live in the URL so filtered views are shareable.
  const [lang, setLang] = useUrlString("lang", initialLang);
  const [sort] = useUrlString("sort", initialSort);

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
      try {
        const params = new URLSearchParams({
          q: trimmed,
          sort,
          limit: "30",
        });
        if (lang) params.set("lang", lang);

        const [booksRes, catsRes] = await Promise.all([
          fetch(`/api/books?${params.toString()}`).then((r) =>
            r.ok
              ? (r.json() as Promise<{ rows: Book[] }>)
              : { rows: [] as Book[] }
          ),
          fetch("/api/categories?type=book").then((r) =>
            r.ok
              ? (r.json() as Promise<{ rows: CategoryRow[] }>)
              : { rows: [] as CategoryRow[] }
          ),
        ]);

        if (cancelled) return;

        const catMap = new Map<string, string>();
        for (const c of catsRes.rows ?? []) catMap.set(c.id, c.slug);

        const merged: BookResult[] = (booksRes.rows ?? []).map((b) => ({
          id: b.id,
          title: b.title,
          slug: b.slug,
          author: b.author,
          cover_url: b.cover_url,
          language: b.language,
          title_alt: b.title_alt,
          categorySlug:
            (b.category_id && catMap.get(b.category_id)) ?? "uncategorized",
        }));

        setResults(merged);
        setLoading(false);
      } catch {
        if (cancelled) return;
        setResults([]);
        setLoading(false);
      }
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmed, searching, lang, sort]);

  const hasQuery = query.length > 0;
  const categoryQuery = lang ? `?lang=${lang}` : "";

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

      {/* Toolbar: language filter, sort, browse-by-author */}
      <section className="px-5 mt-4">
        <div className="w-[70%] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-full bg-white border border-gray-200 p-1 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              {LANG_TABS.map((tab) => {
                const active = lang === tab.value;
                return (
                  <button
                    key={tab.value || "all"}
                    type="button"
                    onClick={() => setLang(tab.value || null)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                      "arabic" in tab && tab.arabic
                        ? "font-[family-name:var(--font-amiri)] text-base leading-none"
                        : ""
                    } ${
                      active
                        ? "bg-teal-700 text-white"
                        : "text-teal-900 hover:bg-teal-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
          <Link
            href="/books/authors"
            className="text-sm font-semibold text-teal-700 hover:text-teal-900 transition-colors"
          >
            Browse by author →
          </Link>
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
                <BookCard
                  key={book.id}
                  book={book}
                  href={`/books/${book.categorySlug}/${book.slug}`}
                  readHref={`/read/${book.slug}`}
                />
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-wrap justify-center gap-4 max-w-7xl mx-auto fade-in-up">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/books/${cat.slug}${categoryQuery}`}
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
