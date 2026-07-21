// Helpers for language-aware rendering. Safe in both server and client code.

const ARABIC_CHAR_RE = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;

export function hasArabicChars(s: string | null | undefined): boolean {
  return typeof s === "string" && ARABIC_CHAR_RE.test(s);
}

/**
 * Whether a book should render as Arabic (RTL + Arabic typography).
 * Prefers the explicit language column; falls back to script detection for
 * legacy rows that predate it.
 */
export function isArabicBook(book: { language?: string | null; title?: string | null }): boolean {
  if (book.language === "ar") return true;
  if (book.language && book.language !== "ar") return false;
  return hasArabicChars(book.title);
}
