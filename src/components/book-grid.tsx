import { BookCard, type BookCardBook } from "@/components/book-card";

// Responsive cover grid used by the homepage, author pages, and /arabic.
// hrefFor lets each surface decide the detail URL (category slug lookups
// differ per context).

export function BookGrid({
  books,
  hrefFor,
  readHrefFor,
  columns = "wide",
}: {
  books: BookCardBook[];
  hrefFor: (book: BookCardBook) => string;
  readHrefFor?: (book: BookCardBook) => string;
  columns?: "wide" | "standard";
}) {
  const cols =
    columns === "wide"
      ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";
  return (
    <div className={`grid ${cols} gap-4 md:gap-6`}>
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          href={hrefFor(book)}
          readHref={readHrefFor?.(book)}
        />
      ))}
    </div>
  );
}
