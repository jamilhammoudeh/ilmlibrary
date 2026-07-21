import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { isArabicBook } from "@/lib/arabic";

// THE shared book card. Every book surface (homepage grids, category pages,
// search results, recommendations) should render this so covers, hover
// behavior, and Arabic/RTL handling stay consistent.
//
// The whole card is clickable via a stretched link (no nested anchors); the
// optional "Read" action is a sibling link layered above it.

export type BookCardBook = {
  id: string;
  title: string;
  slug: string;
  author: string;
  cover_url: string | null;
  language?: string | null;
  title_alt?: string | null;
};

export function BookCard({
  book,
  href,
  readHref,
  size = "md",
  priority = false,
}: {
  book: BookCardBook;
  /** Detail-page link, e.g. /books/<categorySlug>/<bookSlug> */
  href: string;
  /** Optional direct reader link shown on hover (desktop) */
  readHref?: string;
  size?: "sm" | "md";
  priority?: boolean;
}) {
  const arabic = isArabicBook(book);
  const titleClass = arabic
    ? "arabic-title font-semibold text-teal-900 line-clamp-2 group-hover:text-teal-700 transition-colors"
    : "text-sm font-semibold text-teal-900 line-clamp-2 group-hover:text-teal-700 transition-colors";

  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden card-shadow hover:-translate-y-1 transition-all duration-200 ${
        size === "sm" ? "w-[150px]" : ""
      }`}
    >
      <div className="relative aspect-[2/3] bg-teal-50 overflow-hidden">
        {book.cover_url ? (
          <Image
            src={book.cover_url}
            alt={book.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes={size === "sm" ? "150px" : "(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"}
          />
        ) : (
          <div
            dir={arabic ? "rtl" : undefined}
            lang={arabic ? "ar" : undefined}
            className={`w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400 p-3 text-center ${
              arabic ? "arabic-title" : "text-sm"
            }`}
          >
            <BookOpen size={22} className="opacity-60" />
            <span className="line-clamp-4">{book.title}</span>
          </div>
        )}
      </div>
      <div
        className={size === "sm" ? "p-2.5" : "p-3"}
        dir={arabic ? "rtl" : undefined}
        lang={arabic ? "ar" : undefined}
      >
        <h3 className={titleClass}>{book.title}</h3>
        <p
          className={`text-xs text-gray-500 mt-1 line-clamp-1 ${arabic ? "font-[family-name:var(--font-amiri)]" : ""}`}
        >
          {book.author}
        </p>
      </div>

      {/* Stretched link makes the whole card clickable without nesting anchors */}
      <Link href={href} className="absolute inset-0 z-10" aria-label={book.title} />

      {readHref && (
        <div className="absolute inset-x-0 top-[45%] hidden md:flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none">
          <span className="rounded-full bg-white/95 text-teal-900 text-[11px] font-semibold px-3 py-1 shadow">
            Details
          </span>
          <Link
            href={readHref}
            className="pointer-events-auto rounded-full bg-teal-700 text-white text-[11px] font-semibold px-3 py-1 shadow hover:bg-teal-800"
          >
            Read
          </Link>
        </div>
      )}
    </div>
  );
}
