import Link from "next/link";
import { getAuthorsIndex } from "@/lib/queries";
import { hasArabicChars } from "@/lib/arabic";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Authors",
  description: "Browse Islamic books by author on Ilm Library",
};

type AuthorEntry = {
  author: string;
  count: number;
  languages: Set<string>;
};

/** First Latin letter of the name (skips quotes/diacritic marks), or "#". */
function latinLetter(name: string): string {
  const m = name.match(/[a-zA-Z]/);
  return m ? m[0].toUpperCase() : "#";
}

/** First Arabic letter of the name, with alef variants folded together. */
function arabicLetter(name: string): string {
  const m = name.match(/[ء-يٱ]/);
  if (!m) return name.charAt(0) || "؟";
  return "أإآٱ".includes(m[0]) ? "ا" : m[0];
}

function groupBy(
  entries: AuthorEntry[],
  letterOf: (name: string) => string,
  locale: string
): [string, AuthorEntry[]][] {
  const groups = new Map<string, AuthorEntry[]>();
  for (const entry of entries) {
    const letter = letterOf(entry.author);
    const bucket = groups.get(letter);
    if (bucket) bucket.push(entry);
    else groups.set(letter, [entry]);
  }
  const sorted = [...groups.entries()].sort(([a], [b]) => {
    // "#" (no Latin letter found) sinks to the end of the English section.
    if (a === "#") return 1;
    if (b === "#") return -1;
    return a.localeCompare(b, locale);
  });
  for (const [, bucket] of sorted) {
    bucket.sort((a, b) => a.author.localeCompare(b.author, locale));
  }
  return sorted;
}

function AuthorChip({ entry, arabic }: { entry: AuthorEntry; arabic?: boolean }) {
  return (
    <Link
      href={`/books/author/${encodeURIComponent(entry.author)}`}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-semibold text-teal-900 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:border-teal-700/40 hover:text-teal-700 hover:shadow-[0_4px_12px_rgba(0,77,64,0.12)] hover:-translate-y-0.5 transition-all duration-150 ${
        arabic ? "font-[family-name:var(--font-amiri)] text-base" : ""
      }`}
    >
      <span>{entry.author}</span>
      <span className="text-[11px] font-bold text-teal-700/70 bg-teal-50 rounded-full px-2 py-0.5 leading-tight">
        {entry.count}
      </span>
    </Link>
  );
}

export default async function AuthorsPage() {
  const rows = await getAuthorsIndex();

  // Merge rows for the same author across languages.
  const merged = new Map<string, AuthorEntry>();
  for (const row of rows) {
    const existing = merged.get(row.author);
    if (existing) {
      existing.count += row.count;
      existing.languages.add(row.language);
    } else {
      merged.set(row.author, {
        author: row.author,
        count: row.count,
        languages: new Set([row.language]),
      });
    }
  }

  const entries = [...merged.values()];
  const latinAuthors = entries.filter((e) => !hasArabicChars(e.author));
  const arabicAuthors = entries.filter((e) => hasArabicChars(e.author));

  const latinGroups = groupBy(latinAuthors, latinLetter, "en");
  const arabicGroups = groupBy(arabicAuthors, arabicLetter, "ar");

  return (
    <>
      {/* Hero / page title */}
      <section className="bg-[#f0f0f0] pt-8 md:pt-10 pb-3 px-5 text-center fade-in-up">
        <h1 className="text-[28px] sm:text-[38px] md:text-[48px] font-bold font-[family-name:var(--font-playfair)] text-teal-900 leading-[1.1] mb-2">
          Browse by Author
        </h1>
        <p
          className="text-[20px] sm:text-[26px] md:text-[30px] font-normal font-[family-name:var(--font-amiri)] text-teal-900 mx-auto px-2 [text-shadow:1px_1px_16px_rgba(0,0,0,0.45)]"
          lang="ar"
          dir="rtl"
        >
          تصفح الكتب حسب المؤلف
        </p>
      </section>

      <div className="max-w-[1100px] mx-auto px-5 pt-8 pb-20 md:pb-24">
        {/* Latin-script authors, A–Z */}
        {latinGroups.length > 0 && (
          <section className="fade-in-up">
            <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-playfair)] text-teal-900 mb-6">
              Authors
            </h2>
            <div className="space-y-8">
              {latinGroups.map(([letter, authors]) => (
                <div key={letter}>
                  <h3 className="text-lg font-bold font-[family-name:var(--font-playfair)] text-teal-700 border-b border-teal-900/10 pb-1 mb-3">
                    {letter}
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {authors.map((entry) => (
                      <AuthorChip key={entry.author} entry={entry} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Arabic-script authors */}
        {arabicGroups.length > 0 && (
          <section
            className={`fade-in-up ${latinGroups.length > 0 ? "mt-14" : ""}`}
            dir="rtl"
            lang="ar"
          >
            <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-amiri)] text-teal-900 mb-6">
              المؤلفون بالعربية
            </h2>
            <div className="space-y-8">
              {arabicGroups.map(([letter, authors]) => (
                <div key={letter}>
                  <h3 className="text-xl font-bold font-[family-name:var(--font-amiri)] text-teal-700 border-b border-teal-900/10 pb-1 mb-3">
                    {letter}
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {authors.map((entry) => (
                      <AuthorChip key={entry.author} entry={entry} arabic />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {latinGroups.length === 0 && arabicGroups.length === 0 && (
          <p className="text-center text-gray-500 py-10">No authors found yet.</p>
        )}
      </div>
    </>
  );
}
