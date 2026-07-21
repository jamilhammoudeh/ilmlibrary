import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getBooksByAuthor, getCategories } from "@/lib/queries";
import { hasArabicChars } from "@/lib/arabic";
import { BookGrid } from "@/components/book-grid";
import type { BookCardBook } from "@/components/book-card";

export const dynamic = "force-dynamic";

function decodeAuthor(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ author: string }>;
}) {
  const { author: raw } = await params;
  const author = decodeAuthor(raw);
  return {
    title: author,
    description: `Books by ${author} on Ilm Library`,
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ author: string }>;
}) {
  const { author: raw } = await params;
  const author = decodeAuthor(raw);

  const [books, allCategories] = await Promise.all([
    getBooksByAuthor(author),
    getCategories({ contentType: "book", includeHidden: true }),
  ]);
  if (books.length === 0) notFound();

  const arabic = hasArabicChars(author);
  const catSlug = new Map(allCategories.map((c) => [c.id, c.slug]));
  const hrefFor = (b: BookCardBook & { category_id?: string | null }) =>
    `/books/${(b.category_id && catSlug.get(b.category_id)) || "uncategorized"}/${b.slug}`;

  return (
    <>
      {/* Hero */}
      <section className="bg-[#f0f0f0] pt-8 md:pt-10 pb-3 px-5 text-center fade-in-up">
        <h1
          dir={arabic ? "rtl" : undefined}
          lang={arabic ? "ar" : undefined}
          className={`text-[28px] sm:text-[38px] md:text-[48px] font-bold text-teal-900 leading-[1.2] mb-2 ${
            arabic
              ? "font-[family-name:var(--font-amiri)]"
              : "font-[family-name:var(--font-playfair)]"
          }`}
        >
          {author}
        </h1>
        <p className="text-[18px] sm:text-[22px] md:text-[26px] font-normal font-[family-name:var(--font-amiri)] text-teal-900 mx-auto px-2">
          {books.length} {books.length === 1 ? "book" : "books"}
        </p>
      </section>

      {/* Breadcrumbs */}
      <nav className="max-w-[1300px] mx-auto px-5 pt-5 flex items-center gap-1 text-sm text-gray-500 flex-wrap">
        <Link href="/" className="hover:text-teal-700 transition-colors">
          Home
        </Link>
        <ChevronRight size={14} className="text-gray-300" />
        <Link href="/books/authors" className="hover:text-teal-700 transition-colors">
          Authors
        </Link>
        <ChevronRight size={14} className="text-gray-300" />
        <span
          className="text-gray-700 font-medium"
          dir={arabic ? "rtl" : undefined}
          lang={arabic ? "ar" : undefined}
        >
          {author}
        </span>
      </nav>

      {/* Works */}
      <section className="max-w-[1300px] mx-auto px-5 pt-6 pb-20 md:pb-24 fade-in-up">
        <BookGrid
          books={books}
          hrefFor={hrefFor}
          readHrefFor={(b) => `/read/${b.slug}`}
        />
      </section>
    </>
  );
}
