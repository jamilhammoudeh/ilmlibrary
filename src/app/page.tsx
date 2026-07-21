import Link from "next/link";
import Image from "next/image";
import { DuaSlideshow } from "@/components/dua-slideshow";
import { SearchBarLive } from "@/components/search-bar-live";
import { RecentlyRead } from "@/components/recently-read";
import { NewBooksCarousel } from "@/components/new-books-carousel";
import { BookGrid } from "@/components/book-grid";
import { LanguageToggle } from "@/components/language-toggle";
import { CategoryChips } from "@/components/category-chips";
import { getCategories, getNewBooks, getBooksPage } from "@/lib/queries";
import { sortCategories } from "@/lib/category-order";
import type { BookCardBook } from "@/components/book-card";

export const dynamic = "force-dynamic";

const sections = [
  { href: "/books", label: "Books", image: "/images/sections/books.jpg" },
  { href: "/quran", label: "Quran", image: "/images/sections/quran.jpg" },
  { href: "/duas", label: "Duas", image: "/images/sections/duas.jpg" },
  { href: "/lectures", label: "Lectures", image: "/images/sections/lectures.jpg" },
  { href: "/why-islam", label: "Why Islam?", image: "/images/sections/kaabah.jpeg" },
  { href: "/guides", label: "Islamic Guides", image: "/images/sections/resources.jpg" },
  { href: "/wisdom", label: "Wisdom", image: "/images/sections/wisdom.jpeg" },
  { href: "/donate", label: "Donate", image: "/images/sections/donate.jpeg" },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang: rawLang } = await searchParams;
  const lang = rawLang === "en" || rawLang === "ar" ? rawLang : "";

  const [allCategories, newBooks, browse] = await Promise.all([
    getCategories({ contentType: "book", includeHidden: true }),
    getNewBooks(12),
    getBooksPage({
      lang: lang || undefined,
      sort: "newest",
      limit: 18,
      // Without a language filter the grid continues where the carousel ends.
      offset: lang ? 0 : 12,
    }),
  ]);

  const catSlug = new Map(allCategories.map((c) => [c.id, c.slug]));
  const visibleCategories = sortCategories(allCategories.filter((c) => !c.hidden));
  const hrefFor = (b: BookCardBook & { category_id?: string | null }) =>
    `/books/${(b.category_id && catSlug.get(b.category_id)) || "uncategorized"}/${b.slug}`;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-teal-50 via-[#f6f4ef] to-[#f0f0f0] pt-10 md:pt-14 pb-10 px-5 text-center">
        <p className="text-[26px] md:text-[32px] font-[family-name:var(--font-amiri)] text-teal-700 leading-none mb-1" lang="ar" dir="rtl">
          مكتبة العلم
        </p>
        <h1 className="text-[44px] sm:text-[60px] md:text-[76px] font-bold font-[family-name:var(--font-playfair)] text-teal-900 leading-none mb-2">
          Ilm Library
        </h1>
        <p className="text-[20px] sm:text-[24px] md:text-[28px] font-normal font-[family-name:var(--font-amiri)] text-teal-900/90 max-w-[600px] mx-auto px-2">
          Access Islamic Knowledge and Resources
        </p>
        <div className="mt-6 md:mt-8 px-2 max-w-3xl mx-auto">
          <SearchBarLive placeholder="Search books, lectures, duas..." />
        </div>
      </section>

      {/* Continue Reading (renders nothing for new visitors) */}
      <RecentlyRead />

      {/* New Books */}
      <div className="mt-10 md:mt-14">
        <NewBooksCarousel books={newBooks} hrefFor={hrefFor} />
      </div>

      {/* Browse the Library */}
      <section className="max-w-[1300px] mx-auto px-5 mt-12 md:mt-16">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-playfair)] text-teal-900">
            Browse the Library
          </h2>
          <LanguageToggle current={lang} basePath="/" />
        </div>
        {browse.rows.length > 0 ? (
          <BookGrid
            books={browse.rows}
            hrefFor={hrefFor}
            readHrefFor={(b) => `/read/${b.slug}`}
          />
        ) : (
          <p className="text-center text-gray-500 py-10">
            {lang === "ar"
              ? "الكتب العربية قادمة قريبًا إن شاء الله"
              : "No books found for this filter yet."}
          </p>
        )}
        <div className="text-center mt-8">
          <Link
            href={lang ? `/books?lang=${lang}` : "/books"}
            className="inline-block px-6 py-3 rounded-full bg-teal-700 text-white font-semibold hover:bg-teal-800 shadow-[0_4px_12px_rgba(0,77,64,0.25)] hover:shadow-[0_8px_20px_rgba(0,77,64,0.3)] transition-all"
          >
            Browse all books
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-[1100px] mx-auto px-5 mt-12 md:mt-16">
        <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-playfair)] text-teal-900 text-center mb-6">
          Explore by Category
        </h2>
        <CategoryChips categories={visibleCategories} />
      </section>

      {/* Dua / quote band */}
      <div className="mx-auto px-4 sm:px-8 md:px-12 mt-12 md:mt-16">
        <DuaSlideshow />
      </div>

      {/* Explore the rest of the site — compact strip */}
      <section className="max-w-[1300px] mx-auto px-5 mt-12 md:mt-16 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-playfair)] text-teal-900 text-center mb-6">
          More from Ilm Library
        </h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group bg-white rounded-xl p-2.5 card-shadow hover:-translate-y-1 transition-all duration-200 text-center"
            >
              <div className="w-full aspect-square relative rounded-lg overflow-hidden bg-teal-50 mb-2">
                <Image
                  src={section.image}
                  alt={section.label}
                  fill
                  sizes="(max-width: 768px) 25vw, 12vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="block text-[11px] md:text-xs font-bold text-teal-900 leading-tight">
                {section.label}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
