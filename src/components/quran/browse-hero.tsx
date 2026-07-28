"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE } from "@/components/reveal";
import { TOTAL_MUSHAF_PAGES } from "./reader-data";
import { cx, focusRing, focusRingOnAccent } from "./ui";

// Resume model for the continue-reading hero (built by the orchestrator from
// the saved reader state).
export type BrowseResume = {
  surahId: number;
  surahName: string;
  arabicName: string;
  ayahNumber: number;
  page: number;
  juz: number;
};

// Paper-leaf shell: borderless, same soft shadow recipe as the mushaf page
// card (the shadow alone lifts the leaf off the canvas).
const HERO_SHELL =
  "mx-auto mt-8 w-full max-w-3xl rounded-3xl bg-paper shadow-[0_18px_60px_-32px_rgba(30,24,18,0.62)]";

const PRIMARY_BUTTON = cx(
  "inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:bg-primary/85 active:scale-[0.98]",
  focusRingOnAccent
);

const GHOST_BUTTON = cx(
  "inline-flex h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-semibold text-foreground transition hover:bg-surface-deep/60 active:scale-[0.98]",
  focusRing
);

// How far through the 604-page mushaf the saved position sits. The fill
// sweeps in once with a transform-only scaleX (never width); a small rotated
// "bead" diamond marks the exact spot. Reduced motion renders both at their
// final state with no Motion involvement.
function ResumeProgress({ page }: { page: number }) {
  const reduce = useReducedMotion();
  const pct = Math.min(100, Math.max(0, (page / TOTAL_MUSHAF_PAGES) * 100));
  const fill = Math.max(0.015, Math.min(1, page / TOTAL_MUSHAF_PAGES));
  return (
    <>
      <div className="relative mt-4">
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuenow={page}
          aria-valuemax={TOTAL_MUSHAF_PAGES}
          aria-label={`Page ${page} of ${TOTAL_MUSHAF_PAGES}, ${Math.round(pct)}% of the mushaf`}
          className="h-1 w-full overflow-hidden rounded-full bg-surface-deep"
        >
          {reduce ? (
            <span className="block h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
          ) : (
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: fill }}
              transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
              className="block h-full w-full origin-left rounded-full bg-accent"
            />
          )}
        </div>
        {/* Opacity-only fade so Motion never touches the Tailwind transform. */}
        <motion.span
          aria-hidden="true"
          initial={reduce ? false : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
          transition={{ duration: 0.2, delay: 1.05 }}
          className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rotate-45 rounded-[1px] bg-accent-deep"
          style={{ left: `calc(${pct}% - 3px)` }}
        />
      </div>
      {/* Visual caption only: the progressbar's aria-label already carries
          both facts, so screen readers hear them once. */}
      <div aria-hidden="true" className="mt-1.5 flex justify-between text-[11px] text-muted tabular-nums">
        <span>
          Page {page} of {TOTAL_MUSHAF_PAGES}
        </span>
        <span>{Math.round(pct)}% of the mushaf</span>
      </div>
    </>
  );
}

// Decorative mushaf-leaf thumbnail: the surah's Arabic name centered over
// five faint ruled hairlines. A real page render is deferred to v2.
function LeafThumb({ arabicName }: { arabicName: string }) {
  return (
    <div className="relative flex aspect-[3/4] w-28 items-center justify-center overflow-hidden rounded-xl border border-paper-rule bg-surface">
      <div aria-hidden="true" className="absolute inset-x-3 inset-y-4 flex flex-col justify-between">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="rule-line h-px w-full opacity-70" />
        ))}
      </div>
      <span
        dir="rtl"
        lang="ar"
        className="relative font-arabic text-xl leading-tight text-foreground"
      >
        {arabicName}
      </span>
    </div>
  );
}

// Continue-reading hero: the landing's first interactive surface. Returning
// readers resume in one tap; new readers are pointed at Al-Fatihah.
export function BrowseHero({
  resume,
  loading,
  onResume,
  onSelectSurah,
  fatihaArabicName,
}: {
  resume: BrowseResume | null;
  loading: boolean;
  onResume: () => void;
  onSelectSurah: (id: number) => void;
  fatihaArabicName: string;
}) {
  if (loading) {
    // Height tracks the taller (resume) variant so the swap-in never shifts
    // the toolbar and grid below it.
    return <div aria-hidden="true" className={cx(HERO_SHELL, "skeleton-shimmer h-[15rem]")} />;
  }

  return (
    <section className={cx(HERO_SHELL, "p-6 sm:p-8")}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="min-w-0">
          {resume ? (
            <>
              <p className="font-display text-[15px] italic leading-none text-paper-meta">
                Continue reading
              </p>
              {/* Table-of-contents dot leader: surah name ... p. N */}
              <div className="mt-2 flex items-baseline gap-2">
                <h2 className="min-w-0 truncate font-display text-2xl font-semibold text-foreground sm:text-3xl">
                  <span className="sr-only">Continue reading: </span>
                  {resume.surahName}
                </h2>
                <div
                  aria-hidden="true"
                  className="mb-[0.45em] min-w-[1.25rem] flex-1 self-end border-b border-dotted border-border-strong"
                />
                <span className="whitespace-nowrap font-display text-base text-paper-meta tabular-nums">
                  p. {resume.page}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-muted">
                Ayah {resume.ayahNumber} : Juz {resume.juz}
              </p>
              <ResumeProgress page={resume.page} />
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button type="button" onClick={onResume} className={PRIMARY_BUTTON}>
                  Continue reading
                </button>
                <button
                  type="button"
                  onClick={() => onSelectSurah(resume.surahId)}
                  className={GHOST_BUTTON}
                >
                  Start over
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
                Begin with Al-Fatihah
              </h2>
              <p className="mt-1.5 text-sm text-muted">The opening of the Quran : 7 ayahs</p>
              <div className="mt-5">
                <button type="button" onClick={() => onSelectSurah(1)} className={PRIMARY_BUTTON}>
                  Start reading
                </button>
              </div>
            </>
          )}
        </div>
        <div className="hidden sm:block">
          <LeafThumb arabicName={resume ? resume.arabicName : fatihaArabicName} />
        </div>
      </div>
    </section>
  );
}
