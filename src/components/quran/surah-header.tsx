"use client";

import { BismillahGlyph } from "./bismillah";
import type { Surah } from "./reader-data";
import { SurahBanner } from "./surah-banner";
import { ReaderIcon, cx, focusRing, focusRingOnAccent } from "./ui";

// Surah header block: floats on the app background, no card. Carries
// #reader-top and the in-place Listen button; the pinned ReaderChromeBar
// switch is the single desktop view control.
export function SurahHeader({
  surah,
  onListen,
  onOpenTranslationSettings,
  showBismillah,
}: {
  surah: Surah;
  onListen: () => void;
  onOpenTranslationSettings: () => void;
  showBismillah: boolean;
}) {
  const place = surah.revelationPlace === "medinan" ? "Medinan" : "Meccan";
  return (
    <div
      id="reader-top"
      className="mx-auto w-full max-w-[50rem] px-4 pt-8 pb-2 scroll-mt-36 lg:scroll-mt-28"
    >
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onListen}
          className={cx(
            "flex h-9 items-center gap-1.5 rounded-full bg-accent px-3.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent-deep active:scale-[0.97]",
            focusRingOnAccent
          )}
        >
          <ReaderIcon name="play" className="h-4 w-4" />
          Listen
        </button>
        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={onOpenTranslationSettings}
            className={cx(
              "h-9 rounded-full bg-surface px-3 text-sm font-semibold text-muted shadow-sm transition-colors hover:bg-surface-deep/60",
              focusRing
            )}
          >
            Saheeh International
          </button>
        </div>
      </div>

      <div className="text-center">
        {/* The app's ornamental Madani plaque carries the Arabic name as
            calligraphy (decorative, aria-hidden). The h1 keeps the English
            name visible and the Arabic name as hidden REAL text so it stays
            announced, findable, and indexable; lang="ar" switches the
            screen-reader voice. */}
        <SurahBanner
          surahId={surah.id}
          className="mx-auto w-full max-w-[26rem]"
        />
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground">
          <span lang="ar" dir="rtl" className="sr-only">
            {surah.nameArabic}{" "}
          </span>
          {surah.nameEnglish}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {surah.nameTranslation} : {surah.ayahCount} ayahs : {place}
        </p>
      </div>

      {showBismillah ? (
        // Width budget for the 11.435em-wide ligature: 24px x 11.435 = 274px
        // vs the 288px minimum container (320px viewport); 30px -> 343px vs
        // >= 608px at sm. Both fit without a guard.
        <p dir="rtl" className="py-5 text-center text-foreground-soft">
          <BismillahGlyph className="text-2xl leading-[1.45] sm:text-3xl" />
        </p>
      ) : null}
    </div>
  );
}

// Translation-view footer navigation; prev/next deliberately wrap around
// (surah 1's previous is 114) so both buttons always render.
export function EndOfSurahControls({
  previousName,
  nextName,
  onPreviousSurah,
  onBeginningOfSurah,
  onNextSurah,
}: {
  previousName: string;
  nextName: string;
  onPreviousSurah: () => void;
  onBeginningOfSurah: () => void;
  onNextSurah: () => void;
}) {
  const buttonClass = cx(
    "flex h-10 items-center gap-1.5 rounded-full bg-surface px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-surface-deep/60",
    focusRing
  );
  return (
    <div className="flex flex-wrap justify-center gap-2 py-10">
      <button type="button" onClick={onPreviousSurah} title={previousName} className={buttonClass}>
        <ReaderIcon name="chevron-left" className="h-4 w-4" />
        Previous Surah
      </button>
      <button type="button" onClick={onBeginningOfSurah} className={buttonClass}>
        Beginning of Surah
      </button>
      <button type="button" onClick={onNextSurah} title={nextName} className={buttonClass}>
        Next Surah
        <ReaderIcon name="chevron-right" className="h-4 w-4" />
      </button>
    </div>
  );
}
