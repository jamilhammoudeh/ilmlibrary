"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Surah } from "./reader-data";
import { cx, focusRing } from "./ui";

// First ayah of each juz, enriched with its mushaf page for the directory's
// Juz rows ("Starts at {surah} {ayah} : Page {page}").
export type JuzDirectoryStart = {
  juz: number;
  surahId: number;
  surahName: string;
  ayahNumber: number;
  page: number;
};

// Shared shell for surah cards and juz rows: a borderless paper leaf at rest
// (separation via background contrast plus a gentle shadow, no stroke), soft
// lift with a slightly deeper shadow on hover (no one-edge accent bars
// anywhere). Transition lists colors and shadow explicitly so it never
// animates transform under Motion's hover/tap springs.
// scroll-mt keeps keyboard focus from landing hidden beneath the fixed site
// nav plus the stuck search toolbar (WCAG 2.4.11).
const CARD_CLASS = cx(
  "group flex w-full scroll-mt-36 items-center gap-3.5 rounded-2xl bg-paper p-4 text-left shadow-sm transition-[background-color,box-shadow] duration-200 hover:bg-surface hover:shadow-[0_16px_32px_-14px_rgba(30,24,18,0.22)]",
  focusRing
);

// Number rosette: two concentric rounded squares, the rear rotated 45deg,
// reading as a quiet rub-el-hizb octagram silhouette. The accent tone rests
// in sepia ink (a single quiet diamond); under the pointer the axis-aligned
// square blooms in and the marker turns green: vivid accent is reserved for
// the moment of intent. The bloom animates opacity only (scaling SVG rects
// is flaky across engines). The gold juz tone keeps its full octagram.
function Rosette({ value, tone }: { value: number; tone: "accent" | "gold" }) {
  const goldRect =
    "fill-[rgba(185,144,82,0.12)] stroke-[rgba(185,144,82,0.30)] transition-colors group-hover:fill-[rgba(185,144,82,0.18)]";
  return (
    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center">
      <svg viewBox="0 0 44 44" aria-hidden="true" className="absolute inset-0 h-full w-full">
        <rect
          x="9.5"
          y="9.5"
          width="25"
          height="25"
          rx="7"
          strokeWidth="1"
          transform="rotate(45 22 22)"
          className={
            tone === "accent"
              ? "fill-[var(--surface)] stroke-[var(--paper-rule)] transition-colors duration-200 group-hover:fill-[var(--accent-soft)] group-hover:stroke-[rgba(0,168,71,0.5)]"
              : goldRect
          }
        />
        <rect
          x="9.5"
          y="9.5"
          width="25"
          height="25"
          rx="7"
          strokeWidth="1"
          className={
            tone === "accent"
              ? "fill-none stroke-[rgba(0,168,71,0.4)] opacity-0 transition-opacity duration-200 group-hover:opacity-40"
              : goldRect
          }
        />
      </svg>
      <span
        className={cx(
          "relative text-sm font-semibold tabular-nums",
          tone === "accent"
            ? "text-paper-meta transition-colors duration-200 group-hover:text-accent-foreground"
            : "text-[color:var(--gold)]"
        )}
      >
        {value}
      </span>
    </span>
  );
}

export function SurahCard({
  surah,
  resumed,
  onSelect,
}: {
  surah: Surah;
  /** Marks the saved reading position's surah with a small accent dot. */
  resumed: boolean;
  onSelect: (id: number) => void;
}) {
  const reduce = useReducedMotion();
  // Where this surah sits in the physical mushaf, straight off its first ayah.
  const firstAyah = surah.ayahs[0];
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(surah.id)}
      whileHover={reduce ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      className={CARD_CLASS}
    >
      <Rosette value={surah.id} tone="accent" />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-[15px] font-semibold text-foreground">
            {surah.nameEnglish}
          </span>
          {resumed ? (
            <>
              <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span className="sr-only">Currently reading</span>
            </>
          ) : null}
        </span>
        <span className="mt-0.5 block truncate text-xs text-muted">{surah.nameTranslation}</span>
        <span className="mt-1 block truncate text-[11px] text-paper-meta tabular-nums">
          {firstAyah
            ? `${surah.ayahCount} ayahs : Juz ${firstAyah.juz} : Page ${firstAyah.page}`
            : `${surah.ayahCount} ayahs`}
        </span>
      </span>
      <span className="shrink-0 text-right">
        <span
          dir="rtl"
          lang="ar"
          className="block font-arabic text-[22px] leading-none text-foreground-soft transition-colors duration-200 group-hover:text-foreground"
        >
          {surah.nameArabic}
        </span>
        <span className="mt-1.5 block text-[10.5px] capitalize tracking-wide text-muted">
          {surah.revelationPlace}
        </span>
      </span>
    </motion.button>
  );
}

export function JuzCard({
  start,
  onSelect,
}: {
  start: JuzDirectoryStart;
  onSelect: (juz: number) => void;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(start.juz)}
      whileHover={reduce ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      className={CARD_CLASS}
    >
      <Rosette value={start.juz} tone="gold" />
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold text-foreground">Juz {start.juz}</span>
        <span className="block truncate text-xs text-muted">
          Starts at {start.surahName} {start.ayahNumber} : Page {start.page}
        </span>
      </span>
    </motion.button>
  );
}
