"use client";

import { useState } from "react";
import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import { Search, Loader2 } from "lucide-react";

type SearchResult = {
  verse_key: string;
  text: string;
  translations: { text: string }[];
  highlighted?: string;
};

export default function QuranSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim() || query.trim().length < 2) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(
        `https://api.quran.com/api/v4/search?q=${encodeURIComponent(query.trim())}&size=20&language=en`
      );
      const data = await res.json();
      setResults(data.search?.results ?? []);
    } catch {
      setResults([]);
    }

    setLoading(false);
  }

  return (
    <>
      <ContentHeader
        title="Search the Quran"
        subtitle="Search across all 6,236 verses"
        breadcrumbs={[
          { label: "Quran", href: "/quran" },
          { label: "Search" },
        ]}
      />

      <section className="w-[92%] max-w-7xl mx-auto my-8 fade-in-up">
        <div className="bg-teal-100 rounded-2xl px-8 py-10 text-center shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[22px] leading-[1.6]">
            Search for any word, phrase, or topic across the entire Quran.
            Results include the original Arabic text and English translation.
          </p>
        </div>
      </section>

      {/* Search form */}
      <section className="max-w-4xl mx-auto px-5 pt-4 pb-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a word, phrase, or topic..."
            className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white text-gray-900 border border-gray-200 outline-none transition-all duration-200 focus:shadow-[0_8px_24px_rgba(0,77,64,0.15)] focus:border-teal-700/40 focus:ring-2 focus:ring-teal-700/15 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
          />
        </form>
      </section>

      {/* Results */}
      <section className="max-w-4xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="text-teal-700 animate-spin" />
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4 fade-in-up">
            <p className="text-sm text-gray-500 mb-4">{results.length} results found</p>
            {results.map((r, i) => {
              const [surah, ayah] = r.verse_key.split(":");
              return (
                <Link
                  key={i}
                  href={`/quran/read/${surah}`}
                  className="block bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {r.verse_key}
                    </span>
                  </div>
                  <p className="arabic-text text-xl text-gray-900 mb-2 leading-relaxed">
                    {r.text}
                  </p>
                  {r.translations?.[0] && (
                    <p
                      className="text-sm text-gray-600 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: r.translations[0].text,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        ) : searched ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No results found for &ldquo;{query}&rdquo;</p>
            <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
          </div>
        ) : null}
      </section>
    </>
  );
}
