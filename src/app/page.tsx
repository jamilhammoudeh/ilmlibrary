import Link from "next/link";
import Image from "next/image";
import { DuaSlideshow } from "@/components/dua-slideshow";
import { SearchBarLive } from "@/components/search-bar-live";
import { RecentlyRead } from "@/components/recently-read";
import { BookGrid } from "@/components/book-grid";
import { LanguageToggle } from "@/components/language-toggle";
import { CategoryChips } from "@/components/category-chips";
import { getCategories, getBooksPage } from "@/lib/queries";
import { sortCategories } from "@/lib/category-order";
import type { BookCardBook } from "@/components/book-card";

export const dynamic = "force-dynamic";

const sections = [
  { href: "/quran", label: "Quran", image: "/images/sections/quran.jpg" },
  { href: "/duas", label: "Duas", image: "/images/sections/duas.jpg" },
  { href: "/why-islam", label: "Why Islam?", image: "/images/sections/kaabah.jpeg" },
  { href: "/guides", label: "Islamic Guides", image: "/images/sections/resources.jpg" },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang: rawLang } = await searchParams;
  const lang = rawLang === "en" || rawLang === "ar" ? rawLang : "";

  const [allCategories, browse] = await Promise.all([
    getCategories({ contentType: "book", includeHidden: true }),
    getBooksPage({
      lang: lang || undefined,
      sort: "newest",
      limit: 12,
      withCount: true,
    }),
  ]);

  const catSlug = new Map(allCategories.map((c) => [c.id, c.slug]));
  const visibleCategories = sortCategories(allCategories.filter((c) => !c.hidden));
  const hrefFor = (b: BookCardBook & { category_id?: string | null }) =>
    `/books/${(b.category_id && catSlug.get(b.category_id)) || "uncategorized"}/${b.slug}`;

  const bookCount = browse.total ?? 0;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-teal-50 via-[#f7f5f0] to-[#f0f0f0] pt-14 md:pt-20 pb-12 md:pb-16 px-5 text-center">
        <p
          className="text-[24px] md:text-[30px] font-[family-name:var(--font-amiri)] text-teal-700/90 leading-none mb-2"
          lang="ar"
          dir="rtl"
        >
          مكتبة العلم
        </p>
        <h1 className="text-[46px] sm:text-[60px] md:text-[74px] font-bold font-[family-name:var(--font-playfair)] text-teal-900 leading-none mb-3">
          Ilm Library
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto mb-7">
          A free library of authentic Islamic knowledge — books, Quran study,
          duas, and more.
        </p>
        <div className="px-2 max-w-2xl mx-auto">
          <SearchBarLive placeholder="Search books, lectures, duas..." />
        </div>
        <p className="mt-5 text-sm text-gray-500">
          {bookCount > 0 && lang === ""
            ? `${bookCount.toLocaleString()} books across ${visibleCategories.length} categories · English & العربية`
            : "English & العربية"}
        </p>
      </section>

      {/* Continue Reading (renders nothing for new visitors) */}
      <RecentlyRead />

      {/* Library */}
      <section className="max-w-[1300px] mx-auto px-5 mt-12 md:mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-playfair)] text-teal-900">
              New in the Library
            </h2>
            <p className="text-sm text-gray-500 mt-1">Recently added books</p>
          </div>
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
            className="inline-block px-7 py-3 rounded-full bg-teal-700 text-white font-semibold hover:bg-teal-800 shadow-[0_4px_12px_rgba(0,77,64,0.25)] hover:shadow-[0_8px_20px_rgba(0,77,64,0.3)] transition-all"
          >
            Browse all books
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-[1100px] mx-auto px-5 mt-14 md:mt-20">
        <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-playfair)] text-teal-900 text-center mb-6">
          Browse by Category
        </h2>
        <CategoryChips categories={visibleCategories} />
      </section>

      {/* Dua / quote band */}
      <div className="mx-auto px-4 sm:px-8 md:px-12 mt-14 md:mt-20">
        <DuaSlideshow />
      </div>

      {/* Explore */}
      <section className="max-w-[1000px] mx-auto px-5 mt-14 md:mt-20 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-playfair)] text-teal-900 text-center mb-6">
          More to Explore
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group bg-white rounded-2xl p-4 card-shadow hover:-translate-y-1 transition-all duration-200 text-center"
            >
              <div className="w-full aspect-[4/3] relative rounded-xl overflow-hidden bg-teal-50 mb-3">
                <Image
                  src={section.image}
                  alt={section.label}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="block text-base font-bold text-teal-900 group-hover:text-teal-700 transition-colors">
                {section.label}
              </span>
            </Link>
          ))}
        </div>
        <p className="text-center mt-6 text-sm text-gray-500">
          Also:{" "}
          <Link href="/wisdom" className="text-teal-700 font-semibold hover:underline">
            Wisdom
          </Link>
          {" · "}
          <Link href="/lectures" className="text-teal-700 font-semibold hover:underline">
            Lectures
          </Link>
          {" · "}
          <Link href="/books/authors" className="text-teal-700 font-semibold hover:underline">
            Authors
          </Link>
          {" · "}
          <Link href="/donate" className="text-teal-700 font-semibold hover:underline">
            Donate
          </Link>
        </p>
      </section>
    </>
  );
}
