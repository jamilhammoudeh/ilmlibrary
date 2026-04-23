import Link from "next/link";
import Image from "next/image";
import { SearchBar } from "@/components/search-bar";
import { supabase } from "@/lib/supabase";
import { BookOpen, Mic, Speaker, HandHeart, Lightbulb, Compass } from "lucide-react";

export const metadata = {
  title: "Search",
};

async function runSearch(query: string) {
  const like = `%${query}%`;

  const [booksRes, lecturesRes, khutbasRes, duasRes, wisdomRes, guidesRes] =
    await Promise.all([
      supabase
        .from("books")
        .select("id, title, slug, author, cover_url, category_id")
        .or(`title.ilike.${like},author.ilike.${like},description.ilike.${like}`)
        .limit(12),
      supabase
        .from("lectures")
        .select("id, title, slug, speaker, description")
        .or(`title.ilike.${like},speaker.ilike.${like},description.ilike.${like}`)
        .limit(12),
      supabase
        .from("khutbas")
        .select("id, title, slug, speaker, description")
        .or(`title.ilike.${like},speaker.ilike.${like},description.ilike.${like}`)
        .limit(12),
      supabase
        .from("duas")
        .select("id, title, translation, source")
        .or(`title.ilike.${like},translation.ilike.${like},source.ilike.${like}`)
        .limit(12),
      supabase
        .from("wisdom")
        .select("id, quote_english, attribution, source")
        .or(`quote_english.ilike.${like},attribution.ilike.${like},source.ilike.${like}`)
        .limit(12),
      supabase
        .from("guides")
        .select("id, title, slug")
        .or(`title.ilike.${like},content.ilike.${like}`)
        .limit(12),
    ]);

  const books = booksRes.data ?? [];
  const lectures = lecturesRes.data ?? [];
  const khutbas = khutbasRes.data ?? [];
  const duas = duasRes.data ?? [];
  const wisdom = wisdomRes.data ?? [];
  const guides = guidesRes.data ?? [];

  // Resolve book category slugs so links work
  const categoryIds = [
    ...new Set(books.map((b) => b.category_id).filter((id): id is string => !!id)),
  ];
  const catMap = new Map<string, string>();
  if (categoryIds.length > 0) {
    const { data: cats } = await supabase
      .from("categories")
      .select("id, slug")
      .in("id", categoryIds);
    for (const c of cats ?? []) catMap.set(c.id, c.slug);
  }

  const booksWithCat = books.map((b) => ({
    ...b,
    categorySlug: (b.category_id && catMap.get(b.category_id)) ?? "uncategorized",
  }));

  const total =
    booksWithCat.length +
    lectures.length +
    khutbas.length +
    duas.length +
    wisdom.length +
    guides.length;

  return { books: booksWithCat, lectures, khutbas, duas, wisdom, guides, total };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  const results = query.length >= 2 ? await runSearch(query) : null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-playfair)] text-teal-900 mb-6 text-center">
        Search
      </h1>

      <SearchBar basePath="/search" placeholder="Search books, lectures, duas, and more..." />

      {!query && (
        <p className="mt-10 text-center text-gray-500">
          Enter a keyword above to search across the library.
        </p>
      )}

      {query && query.length < 2 && (
        <p className="mt-10 text-center text-gray-500">
          Type at least 2 characters to search.
        </p>
      )}

      {results && (
        <div className="mt-10">
          <p className="text-sm text-gray-600 mb-6">
            {results.total} result{results.total === 1 ? "" : "s"} for{" "}
            <span className="font-semibold">&ldquo;{query}&rdquo;</span>
          </p>

          {results.total === 0 && (
            <p className="text-gray-500 text-center py-8">
              No matches. Try a different keyword.
            </p>
          )}

          {/* Books */}
          {results.books.length > 0 && (
            <ResultGroup title="Books" icon={BookOpen} count={results.books.length}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {results.books.map((b) => (
                  <Link
                    key={b.id}
                    href={`/books/${b.categorySlug}/${b.slug}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <div className="relative aspect-[2/3] bg-gray-100">
                      {b.cover_url ? (
                        <Image
                          src={b.cover_url}
                          alt={b.title}
                          fill
                          sizes="(max-width: 640px) 50vw, 200px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs p-2 text-center">
                          {b.title}
                        </div>
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                        {b.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{b.author}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </ResultGroup>
          )}

          {/* Lectures */}
          {results.lectures.length > 0 && (
            <ResultGroup title="Lectures" icon={Mic} count={results.lectures.length}>
              <ul className="space-y-2">
                {results.lectures.map((l) => (
                  <ResultRow
                    key={l.id}
                    href={`/lectures/${l.slug}`}
                    title={l.title}
                    subtitle={l.speaker}
                  />
                ))}
              </ul>
            </ResultGroup>
          )}

          {/* Khutbas */}
          {results.khutbas.length > 0 && (
            <ResultGroup title="Khutbas" icon={Speaker} count={results.khutbas.length}>
              <ul className="space-y-2">
                {results.khutbas.map((k) => (
                  <ResultRow
                    key={k.id}
                    href={`/khutbas/${k.slug}`}
                    title={k.title}
                    subtitle={k.speaker}
                  />
                ))}
              </ul>
            </ResultGroup>
          )}

          {/* Duas */}
          {results.duas.length > 0 && (
            <ResultGroup title="Duas" icon={HandHeart} count={results.duas.length}>
              <ul className="space-y-2">
                {results.duas.map((d) => (
                  <ResultRow
                    key={d.id}
                    href="/duas"
                    title={d.title ?? d.translation.slice(0, 80)}
                    subtitle={d.source ?? undefined}
                  />
                ))}
              </ul>
            </ResultGroup>
          )}

          {/* Wisdom */}
          {results.wisdom.length > 0 && (
            <ResultGroup title="Wisdom" icon={Lightbulb} count={results.wisdom.length}>
              <ul className="space-y-2">
                {results.wisdom.map((w) => (
                  <ResultRow
                    key={w.id}
                    href="/wisdom"
                    title={w.quote_english.slice(0, 120)}
                    subtitle={w.attribution}
                  />
                ))}
              </ul>
            </ResultGroup>
          )}

          {/* Guides */}
          {results.guides.length > 0 && (
            <ResultGroup title="Islamic Guides" icon={Compass} count={results.guides.length}>
              <ul className="space-y-2">
                {results.guides.map((g) => (
                  <ResultRow
                    key={g.id}
                    href={`/guides/${g.slug}`}
                    title={g.title}
                  />
                ))}
              </ul>
            </ResultGroup>
          )}
        </div>
      )}
    </section>
  );
}

function ResultGroup({
  title,
  icon: Icon,
  count,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      <h2 className="flex items-center gap-2 text-xl font-bold text-teal-900 mb-4">
        <Icon size={20} className="text-teal-900" />
        {title}
        <span className="text-sm font-normal text-gray-500">({count})</span>
      </h2>
      {children}
    </div>
  );
}

function ResultRow({
  href,
  title,
  subtitle,
}: {
  href: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="block bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow"
      >
        <p className="text-sm font-semibold text-gray-900 line-clamp-2">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </Link>
    </li>
  );
}
