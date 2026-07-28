// Pure geometry for the continuous-scroll mushaf river. No DOM access in the
// math helpers: everything takes scroll positions and block heights as
// arguments so it stays trivially testable.

import type { Ayah, HizbIndex, Surah } from "./reader-data";

export const TOTAL_PAGES = 604;
export const DIVIDER_H = 32; // seam height, px, all breakpoints
export const READING_ANCHOR_RATIO = 0.38; // iOS READING_ANCHOR_VIEWPORT_RATIO
export const ANCHOR_HYSTERESIS_MS = 160; // iOS ACTIVE_POSITION_HYSTERESIS_MS
export const FULL_TIER_RADIUS = 2; // real cards: [anchor-2, anchor+2]
export const SKELETON_TIER_RADIUS = 4; // shells: [anchor-4, anchor+4]
export const END_CAP_SPACE = 240; // px reserved after page 604
export const AUDIO_FOLLOW_RECENCY_MS = 2500; // iOS manual-scroll recency window

// Fixed-height page chrome (PrintedPageHeader + PageIndicator in
// qpc-page.tsx). Load-bearing: every page card must be pixel-identical in
// height at a given (viewport width, fontSize) so the river can virtualize
// with one block measurement.
export const PAGE_HEADER_H = 36; // h-9
export const PAGE_FOOTER_H = 32; // h-8

// Pinned-chrome clearance for programmatic page jumps: matches the reader's
// pt-24 mobile read (merged chrome bar + view tabs) / lg:pt-14 desktop read
// paddings.
export const HEADER_OFFSET_MOBILE = 96;
export const HEADER_OFFSET_DESKTOP = 56;

// A navigation command issued before the river is mounted and measured
// (saved-position restore, deep links, browse-mode jumps). Executed once,
// instantly, when layout + block are ready and read mode is entered.
export type PendingScrollTarget =
  | { kind: "page"; page: number }
  | { kind: "ayah"; verseKey: string };

export type LeafSide = "right" | "left";

// THE PARITY RULE (ported verbatim from iOS MushafPageGlyph.tsx:2655):
// pageIsOuterLeft = pageNumber % 2 === 0
// ODD page  = RIGHT leaf of the physical spread (page 1, Al-Fatiha, is a right leaf).
// EVEN page = LEFT leaf.
// Spreads pair (odd, even) with the odd page on the right, like a printed RTL mushaf.
export function leafSideForPage(pageNumber: number): LeafSide {
  return pageNumber % 2 === 1 ? "right" : "left";
}

export type PageChrome = {
  pageNumber: number;
  leaf: LeafSide;
  surahNames: string[]; // localized English names of every surah on the page, in order of appearance
  juz: number; // juz of the FIRST ayah on the page
  hizbStart: number | null; // hizb number when this page starts a hizb, else null
};

export function buildPageChrome(
  pageNumber: number,
  pagesByNumber: Map<number, Ayah[]>,
  surahById: Map<number, Surah>,
  hizbIndex: HizbIndex
): PageChrome {
  const ayahs = pagesByNumber.get(pageNumber) ?? [];
  const surahNames: string[] = [];
  const seen = new Set<number>();
  for (const ayah of ayahs) {
    if (seen.has(ayah.surahId)) continue;
    seen.add(ayah.surahId);
    surahNames.push(
      surahById.get(ayah.surahId)?.nameEnglish ?? `Surah ${ayah.surahId}`
    );
  }
  return {
    pageNumber,
    leaf: leafSideForPage(pageNumber),
    surahNames,
    juz: ayahs[0]?.juz ?? 1,
    hizbStart: hizbIndex.pageStartsHizb(pageNumber),
  };
}

// The CSS clamp on the page body: clamp(18px, 5.35vw, min(max(fontSize, 18), 40)px).
export function resolveQpcFontPx(viewportW: number, fontSizeSetting: number): number {
  const qpcSize = Math.max(18, Math.min(fontSizeSetting, 40));
  return Math.max(18, Math.min(0.0535 * viewportW, qpcSize));
}

// Fixed (non-em) chrome inside one page card: header + footer + vertical
// paddings + the optional lg paper leaf padding/border.
export function cardFixedChromePx(viewportW: number, isLg: boolean, paperLeaf: boolean): number {
  const pyTotal = viewportW >= 640 ? 72 : 56; // py-7 below sm, sm:py-9
  const paperExtra = isLg && paperLeaf ? 48 + 2 : 0; // lg:p-6 + 2x 1px border
  return PAGE_HEADER_H + PAGE_FOOTER_H + pyTotal + paperExtra;
}

// Fixed chrome ABOVE the first line slot inside one page card: the paper
// leaf's top padding/border, the printed header, and the body's top padding.
// Used by scrollToAyah to compute a line's document offset.
export function cardTopChromePx(viewportW: number, isLg: boolean, paperLeaf: boolean): number {
  const pyTop = viewportW >= 640 ? 36 : 28; // py-7 below sm, sm:py-9
  const paperTop = isLg && paperLeaf ? 24 + 1 : 0; // lg:p-6 + 1px border
  return paperTop + PAGE_HEADER_H + pyTop;
}

// Estimate is used for the FIRST PAINT FRAME ONLY; ResizeObserver truth
// replaces it.
export function estimateCardHeight(
  viewportW: number,
  fontSizeSetting: number,
  isLg: boolean,
  paperLeaf = true
): number {
  const resolvedFont = resolveQpcFontPx(viewportW, fontSizeSetting);
  const body = 15 * 1.85 * resolvedFont;
  return body + cardFixedChromePx(viewportW, isLg, paperLeaf);
}

export function anchorPageForScroll(
  scrollY: number,
  anchorY: number,
  riverTop: number,
  block: number
): number {
  if (block <= 0) return 1;
  const raw = Math.floor((scrollY + anchorY - riverTop) / block) + 1;
  return Math.max(1, Math.min(TOTAL_PAGES, raw));
}

export function pageTop(page: number, riverTop: number, block: number): number {
  return riverTop + (page - 1) * block;
}

export type MountWindow = {
  // Outer mounted range (skeleton shells fill it outside the full range).
  skelStart: number;
  skelEnd: number;
  // Full-tier range; EMPTY (fullStart > fullEnd) while scrubbing so a rail
  // drag across the whole mushaf cannot accumulate font fetches.
  fullStart: number;
  fullEnd: number;
};

export function mountWindow(anchor: number, scrubbing: boolean): MountWindow {
  const skelStart = Math.max(1, anchor - SKELETON_TIER_RADIUS);
  const skelEnd = Math.min(TOTAL_PAGES, anchor + SKELETON_TIER_RADIUS);
  if (scrubbing) {
    return { skelStart, skelEnd, fullStart: 0, fullEnd: -1 };
  }
  return {
    skelStart,
    skelEnd,
    fullStart: Math.max(1, anchor - FULL_TIER_RADIUS),
    fullEnd: Math.min(TOTAL_PAGES, anchor + FULL_TIER_RADIUS),
  };
}

export function fullTierPages(anchor: number, scrubbing: boolean): number[] {
  const { fullStart, fullEnd } = mountWindow(anchor, scrubbing);
  const pages: number[] = [];
  for (let page = fullStart; page <= fullEnd; page += 1) pages.push(page);
  return pages;
}
