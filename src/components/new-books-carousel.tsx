import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BookCard, type BookCardBook } from "@/components/book-card";

// Horizontal scroll-snap strip of recently added books (pure CSS, no JS).

export function NewBooksCarousel({
  books,
  hrefFor,
  title = "New Books",
  viewAllHref = "/books?sort=newest",
}: {
  books: BookCardBook[];
  hrefFor: (book: BookCardBook) => string;
  title?: string;
  viewAllHref?: string;
}) {
  if (books.length === 0) return null;
  return (
    <section className="max-w-[1300px] mx-auto px-5">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-playfair)] text-teal-900">
          {title}
        </h2>
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700 hover:text-teal-900 transition-colors"
        >
          View all <ChevronRight size={16} />
        </Link>
      </div>
      <div className="scroll-strip">
        {books.map((book) => (
          <BookCard key={book.id} book={book} href={hrefFor(book)} size="sm" />
        ))}
      </div>
    </section>
  );
}
