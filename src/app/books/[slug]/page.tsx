import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ContentHeader } from "@/components/content-header";
import { EmptyState } from "@/components/empty-state";

const PAGE_SIZE = 30;

async function getCategory(slug: string) {
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("content_type", "book")
    .single();
  return data;
}

async function getBooks(categoryId: string, page: number) {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const { data, count } = await supabase
    .from("books")
    .select("*", { count: "exact" })
    .eq("category_id", categoryId)
    .order("display_order")
    .range(from, to);
  return { books: data ?? [], total: count ?? 0 };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategory(slug);
  return { title: category?.name ?? "Category" };
}

export default async function BookCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10));

  const category = await getCategory(slug);
  if (!category) notFound();

  const { books, total } = await getBooks(category.id, page);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <ContentHeader
        title={category.name}
        subtitle={category.description ?? undefined}
        breadcrumbs={[
          { label: "Books", href: "/books" },
          { label: category.name },
        ]}
      />

      <section className="py-10 pb-20 md:pb-24 px-5">

        {books.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={28} />}
            title="No books yet"
            message="Books for this category are being prepared. Check back soon."
          />
        ) : (
          <>
            <p className="text-sm text-gray-500 text-center mb-6">
              {total} book{total !== 1 ? "s" : ""}
              {totalPages > 1 && ` — Page ${page} of ${totalPages}`}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 max-w-7xl mx-auto fade-in-up">
              {books.map((book) => (
                <Link
                  key={book.id}
                  href={`/books/${slug}/${book.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="relative aspect-[2/3] bg-teal-50 overflow-hidden">
                    {book.cover_url ? (
                      <Image
                        src={book.cover_url}
                        alt={book.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2U4ZjVmMyIvPjwvc3ZnPg=="
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm p-2 text-center">
                        {book.title}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-teal-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="bg-white text-teal-900 font-bold text-sm px-4 py-2 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
                        View More
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-teal-900 line-clamp-2 group-hover:text-teal-700 transition-colors duration-200">
                      {book.title}
                    </h3>
                    {book.author && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {book.author}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {page > 1 && (
                  <Link
                    href={`/books/${slug}?page=${page - 1}`}
                    className="px-4 py-2 text-sm font-medium text-teal-900 bg-white rounded-full shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                  >
                    Previous
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/books/${slug}?page=${p}`}
                    className={`w-9 h-9 flex items-center justify-center text-sm font-medium rounded-full transition-all ${
                      p === page
                        ? "bg-teal-900 text-white"
                        : "bg-white text-teal-900 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    }`}
                  >
                    {p}
                  </Link>
                ))}
                {page < totalPages && (
                  <Link
                    href={`/books/${slug}?page=${page + 1}`}
                    className="px-4 py-2 text-sm font-medium text-teal-900 bg-white rounded-full shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
