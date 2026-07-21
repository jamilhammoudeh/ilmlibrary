import { BooksBrowser } from "@/components/books-browser";
import { sortCategories } from "@/lib/category-order";
import { getCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Books",
  description: "Browse 1000+ Islamic books across 22 categories",
};

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; sort?: string }>;
}) {
  const [{ lang, sort }, categories] = await Promise.all([
    searchParams,
    getCategories({ contentType: "book" }).then(sortCategories),
  ]);

  const initialLang = lang === "en" || lang === "ar" ? lang : "";
  const initialSort =
    sort === "newest" || sort === "title" ? sort : "default";

  return (
    <>
      {/* Hero / page title */}
      <section className="bg-[#f0f0f0] pt-8 md:pt-10 pb-3 px-5 text-center fade-in-up">
        <h1 className="text-[28px] sm:text-[38px] md:text-[48px] font-bold font-[family-name:var(--font-playfair)] text-teal-900 leading-[1.1] mb-2">
          Explore Different Book Categories
        </h1>
        <p className="text-[20px] sm:text-[26px] md:text-[30px] font-normal font-[family-name:var(--font-amiri)] text-teal-900 mx-auto px-2 whitespace-nowrap [text-shadow:1px_1px_16px_rgba(0,0,0,0.45)]">
          A Collection of Books Organized into Catagories
        </p>
      </section>

      <BooksBrowser
        categories={categories}
        initialLang={initialLang}
        initialSort={initialSort}
      />
    </>
  );
}
