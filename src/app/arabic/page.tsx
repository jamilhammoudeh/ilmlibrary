import Link from "next/link";
import { NewBooksCarousel } from "@/components/new-books-carousel";
import { BookGrid } from "@/components/book-grid";
import { CategoryChips } from "@/components/category-chips";
import { getCategories, getNewBooks, getBooksPage } from "@/lib/queries";
import { sortCategories } from "@/lib/category-order";
import type { BookCardBook } from "@/components/book-card";

export const dynamic = "force-dynamic";

export const metadata = {
  title: { absolute: "المكتبة العربية | Arabic Library" },
  description:
    "المكتبة العربية في مكتبة العلم — كتب أهل السنة والجماعة. The Arabic library at Ilm Library.",
};

export default async function ArabicLibraryPage() {
  const [allCategories, newBooks, browse] = await Promise.all([
    getCategories({ contentType: "book", includeHidden: true }),
    getNewBooks(12, "ar"),
    getBooksPage({ lang: "ar", sort: "title", limit: 18 }),
  ]);

  const catSlug = new Map(allCategories.map((c) => [c.id, c.slug]));
  const visibleCategories = sortCategories(allCategories.filter((c) => !c.hidden));
  const hrefFor = (b: BookCardBook & { category_id?: string | null }) =>
    `/books/${(b.category_id && catSlug.get(b.category_id)) || "uncategorized"}/${b.slug}?lang=ar`;

  const hasBooks = browse.rows.length > 0 || newBooks.length > 0;

  return (
    <div dir="rtl" lang="ar">
      {/* Hero */}
      <section className="bg-gradient-to-b from-teal-50 via-[#f6f4ef] to-[#f0f0f0] pt-10 md:pt-14 pb-10 px-5 text-center fade-in-up">
        <h1 className="text-[44px] sm:text-[58px] md:text-[72px] font-bold font-[family-name:var(--font-amiri)] text-teal-900 leading-[1.2] mb-2">
          المكتبة العربية
        </h1>
        <p className="text-[22px] sm:text-[26px] md:text-[30px] font-normal font-[family-name:var(--font-amiri)] text-teal-900/90 max-w-[600px] mx-auto px-2">
          كتب أهل السنة والجماعة
        </p>
        <p
          className="text-sm md:text-base font-semibold font-[family-name:var(--font-playfair)] text-teal-700 mt-2"
          dir="ltr"
          lang="en"
        >
          Arabic Library
        </p>
      </section>

      {hasBooks ? (
        <>
          {/* Newest Arabic books */}
          <div className="mt-10 md:mt-14">
            <NewBooksCarousel
              books={newBooks}
              hrefFor={hrefFor}
              title="أحدث الكتب"
              viewAllHref="/books?lang=ar"
            />
          </div>

          {/* Browse the Arabic collection */}
          {browse.rows.length > 0 && (
            <section className="max-w-[1300px] mx-auto px-5 mt-12 md:mt-16">
              <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-amiri)] text-teal-900 mb-5">
                تصفح المكتبة
              </h2>
              <BookGrid
                books={browse.rows}
                hrefFor={hrefFor}
                readHrefFor={(b) => `/read/${b.slug}`}
              />
              <div className="text-center mt-8">
                <Link
                  href="/books?lang=ar"
                  className="inline-block px-6 py-3 rounded-full bg-teal-700 text-white font-semibold font-[family-name:var(--font-amiri)] text-lg hover:bg-teal-800 shadow-[0_4px_12px_rgba(0,77,64,0.25)] hover:shadow-[0_8px_20px_rgba(0,77,64,0.3)] transition-all"
                >
                  جميع الكتب العربية
                </Link>
              </div>
            </section>
          )}

          {/* Categories */}
          <section className="max-w-[1100px] mx-auto px-5 mt-12 md:mt-16">
            <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-amiri)] text-teal-900 text-center mb-6">
              التصنيفات
            </h2>
            <CategoryChips
              categories={visibleCategories}
              arabicNames
              hrefFor={(cat) => `/books/${cat.slug}?lang=ar`}
            />
          </section>

          {/* Authors link row */}
          <section className="max-w-[1100px] mx-auto px-5 mt-12 md:mt-16 pb-20 md:pb-24 text-center">
            <Link
              href="/books/authors"
              className="inline-flex items-center gap-3 bg-white rounded-2xl card-shadow px-8 py-5 hover:-translate-y-1 transition-all duration-200"
            >
              <span className="text-xl md:text-2xl font-bold font-[family-name:var(--font-amiri)] text-teal-900">
                تصفح حسب المؤلف
              </span>
              <span className="text-sm font-semibold text-teal-700" dir="ltr" lang="en">
                Browse by author
              </span>
            </Link>
          </section>
        </>
      ) : (
        /* Empty state — no Arabic books yet */
        <section className="max-w-[700px] mx-auto px-5 mt-12 md:mt-16 pb-24 text-center fade-in-up">
          <div className="bg-white rounded-2xl card-shadow px-8 py-14">
            <p className="text-[30px] md:text-[38px] font-bold font-[family-name:var(--font-amiri)] text-teal-900 leading-relaxed mb-3">
              قريبًا إن شاء الله
            </p>
            <p className="text-base md:text-lg text-gray-600" dir="ltr" lang="en">
              The Arabic collection is coming soon.
            </p>
            <Link
              href="/books"
              className="inline-block mt-8 px-6 py-3 rounded-full bg-teal-700 text-white font-semibold hover:bg-teal-800 shadow-[0_4px_12px_rgba(0,77,64,0.25)] hover:shadow-[0_8px_20px_rgba(0,77,64,0.3)] transition-all"
              dir="ltr"
              lang="en"
            >
              Browse the English library
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
