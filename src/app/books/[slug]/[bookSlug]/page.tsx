import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookBySlug } from "@/lib/queries";
import { isArabicBook } from "@/lib/arabic";
import { ContentHeader } from "@/components/content-header";
import { ShareButton } from "@/components/share-button";
import { AddToListButton } from "@/components/add-to-list-button";
import { BookmarkButton } from "@/components/bookmark-button";
import { BookRecommendations } from "@/components/book-recommendations";

export const dynamic = "force-dynamic";

async function getBook(bookSlug: string) {
  return getBookBySlug(bookSlug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; bookSlug: string }>;
}) {
  const { bookSlug } = await params;
  const book = await getBook(bookSlug);
  return {
    title: book?.title ?? "Book",
    description: book?.description?.slice(0, 160),
  };
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string; bookSlug: string }>;
}) {
  const { slug, bookSlug } = await params;
  const book = await getBook(bookSlug);
  if (!book) notFound();

  const arabic = isArabicBook(book);
  const showSource = Boolean(book.source && book.source_url && book.source !== "legacy");
  let sourceHost: string | null = null;
  if (showSource && book.source_url) {
    try {
      sourceHost = new URL(book.source_url).hostname;
    } catch {
      sourceHost = book.source_url;
    }
  }

  return (
    <>
      <ContentHeader
        title={book.title}
        breadcrumbs={[
          { label: "Books", href: "/books" },
          { label: book.category_name ?? "Category", href: `/books/${slug}` },
          { label: book.title },
        ]}
      />

      <section className="max-w-7xl mx-auto px-5 pt-6 pb-20 md:pb-24">

        <div className="flex flex-col md:flex-row items-start gap-8 flex-wrap fade-in-up">
          {/* Cover */}
          <div className="mx-auto md:mx-0 shrink-0 w-[240px] sm:w-[280px]">
            <div className="relative w-full aspect-[2/3]">
              {book.cover_url ? (
                <Image
                  src={book.cover_url}
                  alt={book.title}
                  fill
                  className="object-cover rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
                  sizes="280px"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400 text-center p-4">
                  {book.title}
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div
            className={`flex-1 text-center ${arabic ? "md:text-right" : "md:text-left"}`}
            dir={arabic ? "rtl" : undefined}
            lang={arabic ? "ar" : undefined}
          >
            <h2
              className={`font-bold text-teal-900 mb-4 ${
                arabic
                  ? "text-3xl font-[family-name:var(--font-amiri)] leading-snug"
                  : "text-2xl leading-tight"
              }`}
            >
              {book.title}
            </h2>

            <p className="text-lg text-gray-600 mb-1 leading-relaxed">
              <strong>Author:</strong> {book.author}
            </p>
            {book.translator && (
              <p className="text-lg text-gray-600 mb-1 leading-relaxed">
                <strong>Translator:</strong> {book.translator}
              </p>
            )}

            {/* Metadata pills */}
            <div className="flex flex-wrap items-center gap-2 mt-3 mb-4 justify-center md:justify-start">
              <span
                className={`inline-flex items-center rounded-full bg-teal-50 border border-teal-900/10 text-teal-900 font-semibold px-3 py-1 ${
                  arabic ? "font-[family-name:var(--font-amiri)] text-sm" : "text-xs"
                }`}
              >
                {arabic ? "العربية" : "English"}
              </span>
              {book.pages != null && (
                <span
                  className={`inline-flex items-center rounded-full bg-teal-50 border border-teal-900/10 text-teal-900 font-semibold px-3 py-1 ${
                    arabic ? "font-[family-name:var(--font-amiri)] text-sm" : "text-xs"
                  }`}
                >
                  {arabic ? `${book.pages} صفحة` : `${book.pages} pages`}
                </span>
              )}
              {book.published_year != null && (
                <span className="inline-flex items-center rounded-full bg-teal-50 border border-teal-900/10 text-teal-900 text-xs font-semibold px-3 py-1">
                  {book.published_year}
                </span>
              )}
            </div>

            {book.description && (
              <p className="text-lg text-gray-600 leading-relaxed mt-4 mb-6">
                <strong>Description:</strong> {book.description}
              </p>
            )}

            <div className="flex items-center gap-4 flex-wrap">
              {book.pdf_url && (
                <Link
                  href={`/read/${bookSlug}`}
                  target="_blank"
                  className="inline-block bg-teal-900 hover:bg-teal-800 text-white font-bold text-lg px-6 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 shadow-[0_4px_12px_rgba(0,77,64,0.25)]"
                >
                  Read Book
                </Link>
              )}
              {book.purchase_url && (
                <a
                  href={`/api/out?type=purchase&id=${book.id}`}
                  target="_blank"
                  rel="sponsored noopener"
                  className="inline-block bg-white text-teal-900 border-2 border-teal-900 hover:bg-teal-50 font-bold text-lg px-6 py-2 rounded-full transition-all duration-200 hover:-translate-y-0.5"
                >
                  Get the printed copy ↗
                </a>
              )}
              <ShareButton title={book.title} text={`Check out "${book.title}" on Ilm Library`} />
              <BookmarkButton
                id={book.id}
                type="book"
                title={book.title}
                href={`/books/${slug}/${bookSlug}`}
                coverUrl={book.cover_url ?? undefined}
              />
              <AddToListButton bookId={book.id} />
            </div>

            {showSource && book.source_url && (
              <p className="mt-4 text-sm text-gray-500">
                <span className="font-[family-name:var(--font-amiri)]" lang="ar">المصدر</span>
                {" / Source: "}
                <a
                  href={book.source_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-teal-700 hover:text-teal-900 underline underline-offset-2 transition-colors"
                >
                  {sourceHost} <span aria-hidden="true">↗</span>
                </a>
              </p>
            )}
          </div>
        </div>
      </section>

      <BookRecommendations
        currentBookId={book.id}
        categoryId={book.category_id}
        categorySlug={slug}
      />
    </>
  );
}
