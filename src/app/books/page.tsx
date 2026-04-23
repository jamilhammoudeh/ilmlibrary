import { BooksBrowser } from "@/components/books-browser";
import { supabase } from "@/lib/supabase";

// Category order from the legacy site. Matching is keyword-based (lowercased
// `includes`) so small naming differences in the DB still sort correctly.
const CATEGORY_ORDER = [
  "aqeedah",
  "quran",
  "hadith",
  "jurisprudence",
  "arabic",
  "history",
  "hajj",
  "etiquette",
  "healing",
  "death",
  "family",
  "new",
  "brother",
  "sister",
  "youth",
  "dawah",
  "scholar",
  "knowledge",
  "economic",
  "fatwa",
  "deviated",
  "biograph",
];

function rankCategory(name: string) {
  const n = name.toLowerCase();
  for (let i = 0; i < CATEGORY_ORDER.length; i++) {
    if (n.includes(CATEGORY_ORDER[i])) return i;
  }
  return CATEGORY_ORDER.length;
}

async function getCategories() {
  const { data } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("content_type", "book")
    .eq("hidden", false);
  const cats = data ?? [];
  return [...cats].sort((a, b) => {
    const ra = rankCategory(a.name);
    const rb = rankCategory(b.name);
    if (ra !== rb) return ra - rb;
    return a.name.localeCompare(b.name);
  });
}

export const metadata = {
  title: "Books",
  description: "Browse 1000+ Islamic books across 22 categories",
};

export default async function BooksPage() {
  const categories = await getCategories();

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

      <BooksBrowser categories={categories} />
    </>
  );
}
