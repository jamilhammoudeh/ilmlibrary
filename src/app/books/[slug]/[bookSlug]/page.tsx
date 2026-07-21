import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookBySlug } from "@/lib/queries";
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
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-teal-900 mb-4 leading-tight">
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
