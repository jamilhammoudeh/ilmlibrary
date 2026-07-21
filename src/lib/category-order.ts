import type { Category } from "@/types/database";

// Category order from the legacy site. Matching is keyword-based (lowercased
// `includes`) so small naming differences in the DB still sort correctly.
// Shared by /books, the homepage category chips, and /arabic.
export const CATEGORY_ORDER = [
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

export function rankCategory(name: string): number {
  const n = name.toLowerCase();
  for (let i = 0; i < CATEGORY_ORDER.length; i++) {
    if (n.includes(CATEGORY_ORDER[i])) return i;
  }
  return CATEGORY_ORDER.length;
}

export function sortCategories<T extends Pick<Category, "name">>(cats: T[]): T[] {
  return [...cats].sort((a, b) => {
    const ra = rankCategory(a.name);
    const rb = rankCategory(b.name);
    if (ra !== rb) return ra - rb;
    return a.name.localeCompare(b.name);
  });
}
