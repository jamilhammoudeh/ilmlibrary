"use client";

import {
  Search,
  X,
  Loader2,
  BookOpen,
  Mic,
  Speaker,
  HandHeart,
  Lightbulb,
  FileText,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { GlyphText } from "@/components/glyph-text";

type ResultType = "book" | "lecture" | "khutba" | "dua" | "wisdom" | "guide";

type Result = {
  id: string;
  type: ResultType;
  title: string;
  subtitle?: string;
  href: string;
  thumbnail?: string | null;
};

const TYPE_ICON: Record<ResultType, React.ComponentType<{ size?: number }>> = {
  book: BookOpen,
  lecture: Mic,
  khutba: Speaker,
  dua: HandHeart,
  wisdom: Lightbulb,
  guide: FileText,
};

export function SearchBarLive({
  placeholder = "Search books, lectures, duas...",
}: {
  placeholder?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Close on outside click + Escape
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Debounced live search with request cancellation
  useEffect(() => {
    const q = query.trim();
    setActiveIndex(-1);
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    const timer = setTimeout(async () => {
      const like = `%${q}%`;

      const [books, lectures, khutbas, duas, wisdom, guides, cats] =
        await Promise.all([
          supabase
            .from("books")
            .select("id, title, slug, author, category_id, cover_url")
            .or(`title.ilike.${like},author.ilike.${like}`)
            .limit(4),
          supabase
            .from("lectures")
            .select("id, title, slug, speaker")
            .or(`title.ilike.${like},speaker.ilike.${like}`)
            .limit(3),
          supabase
            .from("khutbas")
            .select("id, title, slug, speaker")
            .or(`title.ilike.${like},speaker.ilike.${like}`)
            .limit(3),
          supabase
            .from("duas")
            .select("id, title, translation, source")
            .or(`title.ilike.${like},translation.ilike.${like}`)
            .limit(3),
          supabase
            .from("wisdom")
            .select("id, quote_english, attribution")
            .or(`quote_english.ilike.${like},attribution.ilike.${like}`)
            .limit(3),
          supabase
            .from("guides")
            .select("id, title, slug")
            .ilike("title", like)
            .limit(3),
          supabase.from("categories").select("id, slug"),
        ]);

      if (cancelled) return;

      const catMap = new Map<string, string>();
      for (const c of cats.data ?? []) catMap.set(c.id, c.slug);

      const merged: Result[] = [
        ...(books.data ?? []).map((b) => ({
          id: `b-${b.id}`,
          type: "book" as const,
          title: b.title,
          subtitle: b.author,
          href: `/books/${
            (b.category_id && catMap.get(b.category_id)) ?? "uncategorized"
          }/${b.slug}`,
          thumbnail: b.cover_url,
        })),
        ...(lectures.data ?? []).map((l) => ({
          id: `l-${l.id}`,
          type: "lecture" as const,
          title: l.title,
          subtitle: l.speaker,
          href: `/lectures/${l.slug}`,
        })),
        ...(khutbas.data ?? []).map((k) => ({
          id: `k-${k.id}`,
          type: "khutba" as const,
          title: k.title,
          subtitle: k.speaker,
          href: `/khutbas/${k.slug}`,
        })),
        ...(duas.data ?? []).map((d) => ({
          id: `d-${d.id}`,
          type: "dua" as const,
          title: d.title ?? d.translation.slice(0, 80),
          subtitle: d.source ?? undefined,
          href: "/duas",
        })),
        ...(wisdom.data ?? []).map((w) => ({
          id: `w-${w.id}`,
          type: "wisdom" as const,
          title: w.quote_english.slice(0, 100),
          subtitle: w.attribution,
          href: "/wisdom",
        })),
        ...(guides.data ?? []).map((g) => ({
          id: `g-${g.id}`,
          type: "guide" as const,
          title: g.title,
          href: `/guides/${g.slug}`,
        })),
      ];

      setResults(merged);
      setLoading(false);
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  function reset() {
    setOpen(false);
    setQuery("");
    setActiveIndex(-1);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 2) return;

    // If an item is highlighted via keyboard, navigate to it
    if (activeIndex >= 0 && results[activeIndex]) {
      router.push(results[activeIndex].href);
      reset();
      return;
    }

    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      if (query) {
        setQuery("");
        setActiveIndex(-1);
      } else {
        setOpen(false);
        inputRef.current?.blur();
      }
      return;
    }

    if (!showDropdown || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    }
  }

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const el = listRef.current.children[activeIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIndex]);

  const showDropdown = open && query.trim().length >= 2;
  const hasQuery = query.trim().length > 0;

  return (
    <div ref={containerRef} className="relative max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
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
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setFocused(true);
            setOpen(true);
          }}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-controls="search-results"
          className={`w-full pl-12 ${
            hasQuery ? "pr-11" : "pr-4"
          } py-3 rounded-full bg-white text-gray-900 border border-gray-200 outline-none transition-all duration-200 ${
            focused
              ? "shadow-[0_8px_24px_rgba(0,77,64,0.15)] border-teal-700/40 ring-2 ring-teal-700/15"
              : "shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
          }`}
        />
        {/* Clear / loading indicator */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {loading ? (
            <Loader2
              size={18}
              className="text-teal-700 animate-spin"
              aria-hidden="true"
            />
          ) : hasQuery ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveIndex(-1);
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X size={16} />
            </button>
          ) : null}
        </div>
      </form>

      {/* Dropdown */}
      <div
        className={`absolute z-40 left-0 right-0 mt-2 origin-top transition-all duration-200 ease-out ${
          showDropdown
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-[0.98] -translate-y-1 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden">
          {loading && results.length === 0 ? (
            <div className="px-4 py-8 text-sm text-gray-500 text-center flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              <span>Searching...</span>
            </div>
          ) : results.length === 0 ? (
            <p className="px-4 py-8 text-sm text-gray-500 text-center">
              No matches for{" "}
              <span className="font-medium">
                &ldquo;{query.trim()}&rdquo;
              </span>
            </p>
          ) : (
            <>
              <ul
                id="search-results"
                ref={listRef}
                role="listbox"
                className="py-2 max-h-[360px] overflow-y-auto overscroll-contain"
              >
                {results.map((r, i) => {
                  const Icon = TYPE_ICON[r.type];
                  return (
                    <li key={r.id} role="option" aria-selected={activeIndex === i}>
                      <Link
                        href={r.href}
                        onClick={reset}
                        onMouseEnter={() => setActiveIndex(i)}
                        className={`flex items-center gap-3 px-3 py-2 transition-colors duration-150 ${
                          activeIndex === i ? "bg-teal-50/70" : ""
                        }`}
                      >
                        {r.thumbnail ? (
                          <span className="relative shrink-0 w-10 h-14 rounded-md overflow-hidden bg-gray-100">
                            <Image
                              src={r.thumbnail}
                              alt=""
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </span>
                        ) : (
                          <span
                            className={`shrink-0 w-10 h-14 rounded-md flex items-center justify-center transition-colors ${
                              activeIndex === i
                                ? "bg-teal-100 text-teal-800"
                                : "bg-teal-50 text-teal-700"
                            }`}
                          >
                            <Icon size={18} />
                          </span>
                        )}
                        <span className="flex-1 min-w-0">
                          <span
                            className={`text-[10px] uppercase tracking-wider font-semibold transition-colors ${
                              activeIndex === i ? "text-teal-800" : "text-teal-700"
                            }`}
                          >
                            {r.type}
                          </span>
                          <span className="block text-sm font-medium text-gray-900 line-clamp-1">
                            <GlyphText>{r.title}</GlyphText>
                          </span>
                          {r.subtitle && (
                            <span className="block text-xs text-gray-500 line-clamp-1">
                              <GlyphText>{r.subtitle}</GlyphText>
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link
                href={`/search?q=${encodeURIComponent(query.trim())}`}
                onClick={reset}
                className="block border-t border-gray-100 px-4 py-3 text-sm text-teal-700 hover:bg-gray-50 font-medium text-center transition-colors"
              >
                See all results for &ldquo;{query.trim()}&rdquo; →
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
