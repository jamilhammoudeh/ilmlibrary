import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";
import { getBooksPage, getCategoryBySlug } from "@/lib/queries";
import { ContentHeader } from "@/components/content-header";
import { EmptyState } from "@/components/empty-state";
import { InfiniteBookGrid } from "@/components/infinite-book-grid";
import { LanguageToggle } from "@/components/language-toggle";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 30;

async function getCategory(slug: string) {
  return getCategoryBySlug(slug, "book");
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
  searchParams: Promise<{ lang?: string }>;
}) {
  const { slug } = await params;
  const { lang: langParam } = await searchParams;
  const lang = langParam === "en" || langParam === "ar" ? langParam : undefined;

  const category = await getCategory(slug);
  if (!category) notFound();

  // First page (filtered) plus a tiny probe so the language toggle only shows
  // when this category actually has Arabic books.
  const [{ rows: books, total }, arabicProbe] = await Promise.all([
    getBooksPage({
      categoryId: category.id,
      lang,
      offset: 0,
      limit: PAGE_SIZE,
      withCount: true,
    }),
    getBooksPage({ categoryId: category.id, lang: "ar", limit: 1 }),
  ]);

  const hasArabic = arabicProbe.rows.length > 0;
  const showLanguageToggle = hasArabic || Boolean(lang);

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
        {showLanguageToggle && (
          <div className="flex justify-center mb-6">
            <LanguageToggle current={lang ?? ""} basePath={`/books/${slug}`} />
          </div>
        )}

        {books.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={28} />}
            title="No books yet"
            message={
              lang
                ? `No ${lang === "ar" ? "Arabic" : "English"} books in this category yet. Try another language filter.`
                : "Books for this category are being prepared. Check back soon."
            }
          />
        ) : (
          <InfiniteBookGrid
            key={lang ?? "all"}
            categoryId={category.id}
            categorySlug={slug}
            initialBooks={books}
            total={total ?? 0}
            lang={lang}
          />
        )}
      </section>
    </>
  );
}
