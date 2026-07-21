import Link from "next/link";
import type { Category } from "@/types/database";

// Pill links for book categories — the browsable replacement for a persistent
// sidebar. Used on the homepage and /arabic (with Arabic names when present).

export function CategoryChips({
  categories,
  hrefFor,
  arabicNames = false,
}: {
  categories: Pick<Category, "id" | "name" | "slug" | "name_ar">[];
  hrefFor?: (cat: Pick<Category, "slug">) => string;
  arabicNames?: boolean;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2.5" dir={arabicNames ? "rtl" : undefined}>
      {categories.map((cat) => {
        const label = arabicNames && cat.name_ar ? cat.name_ar : cat.name;
        const arabicLabel = arabicNames && Boolean(cat.name_ar);
        return (
          <Link
            key={cat.id}
            href={hrefFor ? hrefFor(cat) : `/books/${cat.slug}`}
            className={`px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-semibold text-teal-900 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:border-teal-700/40 hover:text-teal-700 hover:shadow-[0_4px_12px_rgba(0,77,64,0.12)] hover:-translate-y-0.5 transition-all duration-150 ${
              arabicLabel ? "font-[family-name:var(--font-amiri)] text-base" : ""
            }`}
            lang={arabicLabel ? "ar" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
