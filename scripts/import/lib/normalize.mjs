/**
 * Arabic text normalization, transliteration, slugs and dedupe keys for the
 * staged Arabic-book import pipeline.
 *
 * Everything here is pure/synchronous — no I/O.
 */

/**
 * Normalize an Arabic string for matching:
 *  - strip tashkeel/diacritics (fathatan..sukun, dagger alif, maddah/hamza marks)
 *  - strip tatweel
 *  - unify alif variants: أ إ آ ٱ -> ا
 *  - ة -> ه, ى -> ي
 *  - collapse whitespace
 * Latin text passes through (lowercasing is left to callers that need it).
 */
export function normalizeArabic(input) {
  if (input == null) return "";
  return String(input)
    .replace(/[ً-ْٓ-ٰٕ]/g, "") // tashkeel + combining maddah/hamza + dagger alif
    .replace(/ـ/g, "") // tatweel
    .replace(/[أإآٱ]/g, "ا") // أ إ آ ٱ -> ا
    .replace(/ؤ/g, "و") // ؤ -> و
    .replace(/ئ/g, "ي") // ئ -> ي
    .replace(/ة/g, "ه") // ة -> ه
    .replace(/ى/g, "ي") // ى -> ي
    .replace(/\s+/g, " ")
    .trim();
}

/** Reduce a string to bare letters/digits (Arabic + Latin) for dedupe keys. */
function keyPart(s) {
  return normalizeArabic(String(s ?? "").toLowerCase()).replace(
    /[^0-9a-zء-ي٠-٩]+/g,
    ""
  );
}

/** Stable dedupe key for (title, author) built from normalized forms. */
export function dedupeKey(title, author) {
  return `${keyPart(title)}|${keyPart(author)}`;
}

/** Title-only dedupe key (used for looser possible-dupe checks). */
export function titleDedupeKey(title) {
  return keyPart(title);
}

const WORD_CHAR = /[0-9a-zء-ي٠-٩]/i;

/**
 * Token-boundary "contains" on normalized strings: `needle` must not be glued
 * to surrounding letters (so "مسلم" does not match inside "المسلم").
 * Both arguments are expected to be already normalized.
 */
export function containsToken(haystack, needle) {
  if (!needle || !haystack) return false;
  let idx = haystack.indexOf(needle);
  while (idx !== -1) {
    const before = idx === 0 ? "" : haystack[idx - 1];
    const after = idx + needle.length >= haystack.length ? "" : haystack[idx + needle.length];
    if ((!before || !WORD_CHAR.test(before)) && (!after || !WORD_CHAR.test(after))) return true;
    idx = haystack.indexOf(needle, idx + 1);
  }
  return false;
}

// Basic Arabic -> Latin transliteration map (applied AFTER normalizeArabic,
// so hamza/taa-marbuta/alif-maqsura variants are already folded).
// Good enough for slugs; a human reviewer can override title_translit in the CSV.
const TRANSLIT = {
  "ا": "a", // ا
  "ب": "b", // ب
  "ت": "t", // ت
  "ث": "th", // ث
  "ج": "j", // ج
  "ح": "h", // ح
  "خ": "kh", // خ
  "د": "d", // د
  "ذ": "dh", // ذ
  "ر": "r", // ر
  "ز": "z", // ز
  "س": "s", // س
  "ش": "sh", // ش
  "ص": "s", // ص
  "ض": "d", // ض
  "ط": "t", // ط
  "ظ": "z", // ظ
  "ع": "a", // ع
  "غ": "gh", // غ
  "ف": "f", // ف
  "ق": "q", // ق
  "ك": "k", // ك
  "ل": "l", // ل
  "م": "m", // م
  "ن": "n", // ن
  "ه": "h", // ه
  "و": "w", // و
  "ي": "y", // ي
  "ء": "", // ء (dropped)
  "٠": "0",
  "١": "1",
  "٢": "2",
  "٣": "3",
  "٤": "4",
  "٥": "5",
  "٦": "6",
  "٧": "7",
  "٨": "8",
  "٩": "9",
};

/**
 * Basic Latin transliteration of an Arabic string via a char map.
 * Keeps existing ASCII alphanumerics, everything unmapped becomes a space.
 */
export function translit(arabicString) {
  const norm = normalizeArabic(arabicString);
  let out = "";
  for (const ch of norm) {
    if (/[a-zA-Z0-9]/.test(ch)) out += ch.toLowerCase();
    else if (Object.hasOwn(TRANSLIT, ch)) out += TRANSLIT[ch];
    else out += " ";
  }
  return out.replace(/\s+/g, " ").trim();
}

/** Slug scheme matching the site (see scripts/migrate-books.mjs). */
export function slugify(latin) {
  return String(latin ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Return `slug` if unused, otherwise slug-2, slug-3, ...
 * The chosen slug is added to `existingSet`.
 */
export function ensureUniqueSlug(slug, existingSet) {
  let base = slug || "book";
  if (!existingSet.has(base)) {
    existingSet.add(base);
    return base;
  }
  let n = 2;
  while (existingSet.has(`${base}-${n}`)) n++;
  const out = `${base}-${n}`;
  existingSet.add(out);
  return out;
}
