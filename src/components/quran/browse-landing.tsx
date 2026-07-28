"use client";

import { useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { BISMILLAH } from "@/lib/quran-tajweed";
import {
  parseSmartQuery,
  POPULAR_SURAH_IDS,
  TOTAL_MUSHAF_PAGES,
  type Surah,
} from "./reader-data";
import { ReaderIcon, cx, focusRing } from "./ui";
import { BrowseHero, type BrowseResume } from "./browse-hero";
import { JuzCard, SurahCard, type JuzDirectoryStart } from "./surah-card";

export type BrowseLandingProps = {
  surahs: Surah[];
  loading: boolean;
  query: string;
  onQueryChange: (q: string) => void;
  filter: "surah" | "juz" | "popular";
  onFilterChange: (f: "surah" | "juz" | "popular") => void;
  resume: BrowseResume | null;
  onResume: () => void;
  onSelectSurah: (id: number) => void;
  onJumpToVerse: (surahId: number, ayahNumber: number) => void;
  onJumpToJuz: (juz: number) => void;
  onSelectPage: (page: number) => void;
  juzStarts: JuzDirectoryStart[];
  bookmarks: Array<{
    verseKey: string;
    surahName: string;
    ayahNumber: number;
    page: number;
  }>;
  onJumpToBookmark: (verseKey: string) => void;
};

// Shared action-chip treatment for smart-query hits, quick links, and the
// bookmarks strip. scroll-mt keeps keyboard focus clear of the fixed nav
// plus the stuck toolbar.
const CHIP_CLASS = cx(
  "inline-flex h-8 shrink-0 scroll-mt-36 items-center gap-1.5 rounded-full bg-surface px-3 text-xs font-semibold text-foreground-soft shadow-sm transition-colors hover:bg-surface-deep/40",
  focusRing
);

// Most-opened destinations, shown while the search field is empty.
const QUICK_VERSE = { label: "Ayat al-Kursi", surahId: 2, ayahNumber: 255 };
const QUICK_SURAHS = [
  { label: "Ya-Sin", surahId: 36 },
  { label: "Al-Kahf", surahId: 18 },
  { label: "Al-Mulk", surahId: 67 },
  { label: "Al-Waqi'ah", surahId: 56 },
  { label: "Ar-Rahman", surahId: 55 },
];

// The frontispiece reveal plays once per tab session; afterwards (and under
// reduced motion) the header renders fully static.
const FRONTISPIECE_KEY = "ilm-quran-frontispiece";

const GRID_CLASS = "grid gap-3 sm:grid-cols-2 xl:grid-cols-3";

// Hairline divider with a single rotated-square medallion: the title leaf
// ends, the directory begins. Forecasts the card badges.
function LeafDivider() {
  return (
    <div aria-hidden="true" className="relative mt-8">
      <div className="rule-line absolute inset-x-0 top-1/2 h-px" />
      <div className="relative flex justify-center">
        <span className="bg-background px-3">
          <span className="block h-[7px] w-[7px] rotate-45 rounded-[1px] border border-border-strong bg-paper" />
        </span>
      </div>
    </div>
  );
}

// Loading cells mirror the final card anatomy (badge, three text bars,
// Arabic name) so the swap to real cards is reflow-free. Shimmer phases are
// staggered per cell so the sheet breathes instead of strobing.
function DirectorySkeleton() {
  return (
    <>
      <div className={cx("mt-6", GRID_CLASS)} aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <div
            key={index}
            className="flex min-h-[5.75rem] items-center gap-3.5 rounded-2xl bg-paper p-4 shadow-sm"
          >
            <span
              className="skeleton-shimmer h-[26px] w-[26px] shrink-0 rotate-45 rounded-[3px]"
              style={{ animationDelay: `${index * 90}ms` }}
            />
            <span className="min-w-0 flex-1">
              <span
                className="skeleton-shimmer block h-3 w-24 rounded-md"
                style={{ animationDelay: `${index * 90}ms` }}
              />
              <span
                className="skeleton-shimmer mt-2 block h-2.5 w-32 rounded-md"
                style={{ animationDelay: `${index * 90 + 45}ms` }}
              />
              <span
                className="skeleton-shimmer mt-2 block h-2 w-28 rounded-md"
                style={{ animationDelay: `${index * 90 + 90}ms` }}
              />
            </span>
            <span
              className="skeleton-shimmer h-5 w-12 shrink-0 rounded-md"
              style={{ animationDelay: `${index * 90}ms` }}
            />
          </div>
        ))}
      </div>
      <div role="status" className="sr-only">
        Loading surahs
      </div>
    </>
  );
}

// The premium surah directory landing: bismillah frontispiece, continue-
// reading hero, sticky search toolbar with go-to chips, bookmarks strip,
// and the Surah / Juz / Popular directory.
export function BrowseLanding({
  surahs,
  loading,
  query,
  onQueryChange,
  filter,
  onFilterChange,
  resume,
  onResume,
  onSelectSurah,
  onJumpToVerse,
  onJumpToJuz,
  onSelectPage,
  juzStarts,
  bookmarks,
  onJumpToBookmark,
}: BrowseLandingProps) {
  const trimmedQuery = query.trim();
  const reduce = useReducedMotion();
  const frontRef = useRef<HTMLDivElement>(null);

  // Once per tab session the frontispiece writes itself in: the bismillah
  // ink-reveals right-to-left (the direction the pen travels), the flanking
  // rules draw outward, and the title rises beneath. GSAP runs in a layout
  // effect so the hidden initial states land before first paint; repeat
  // visits and reduced motion render fully static. The session flag is only
  // written when the timeline COMPLETES: writing it up front would let dev
  // StrictMode's double-effect consume it on the reverted first run, so the
  // reveal would never play in development.
  useGSAP(
    () => {
      if (reduce || !frontRef.current) return;
      try {
        if (window.sessionStorage.getItem(FRONTISPIECE_KEY)) return;
      } catch {
        return;
      }
      const q = gsap.utils.selector(frontRef);
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          try {
            window.sessionStorage.setItem(FRONTISPIECE_KEY, "1");
          } catch {
            // Session gating is a nicety only.
          }
          // Drop the clip entirely once done: Arabic stacked marks can paint
          // outside the border box, and a lingering inset(0) would truncate
          // them forever. The negative vertical insets below give the same
          // headroom while the reveal is running.
          gsap.set(q('[data-fp="bismillah"]'), { clearProps: "clipPath" });
        },
      });
      tl.fromTo(
        q('[data-fp="bismillah"]'),
        { clipPath: "inset(-25% 0% -25% 100%)" },
        { clipPath: "inset(-25% 0% -25% 0%)", duration: 1.1 },
        0.15
      )
        .fromTo(
          q('[data-fp="rule-left"]'),
          { scaleX: 0, transformOrigin: "right center" },
          { scaleX: 1, duration: 0.8 },
          0.9
        )
        .fromTo(
          q('[data-fp="rule-right"]'),
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.8 },
          0.9
        )
        .fromTo(
          q('[data-fp="title"]'),
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.5 },
          0.2
        )
        .fromTo(
          q('[data-fp="sub"]'),
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.5 },
          0.3
        );
    },
    { scope: frontRef, dependencies: [reduce] }
  );

  // "/" focuses the directory search (now living in the site nav), unless
  // the user is already typing or any drawer / sheet / menu layer is open.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "/" || event.ctrlKey || event.metaKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
      if (document.querySelector('[role="dialog"], [role="menu"]')) return;
      event.preventDefault();
      document.getElementById("quran-search")?.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Directory list: the Popular filter narrows to the curated set; any
  // active query overrides the filter and searches all 114 by name / number
  // / Arabic (the pre-redesign engine, moved in from the orchestrator).
  const displayedSurahs = useMemo(() => {
    const q = trimmedQuery.toLowerCase();
    if (!q) {
      if (filter === "popular") {
        const popular = new Set(POPULAR_SURAH_IDS);
        return surahs.filter((surah) => popular.has(surah.id));
      }
      return surahs;
    }
    return surahs.filter(
      (surah) =>
        String(surah.id) === q ||
        surah.nameEnglish.toLowerCase().includes(q) ||
        surah.nameTranslation.toLowerCase().includes(q) ||
        surah.nameArabic.includes(trimmedQuery)
    );
  }, [surahs, filter, trimmedQuery]);

  // "Go to" interpretations of the current query. Zero new parsing logic:
  // parseSmartQuery is the search drawer's engine; verse validity is checked
  // against the actual surah length here (the consumer's job).
  const smart = parseSmartQuery(trimmedQuery);
  const smartChips: Array<{ key: string; label: string; go: () => void }> = [];
  if (trimmedQuery) {
    if (smart.kind === "verse") {
      const surah = surahs.find((item) => item.id === smart.surahId);
      if (surah && smart.ayahNumber <= surah.ayahCount) {
        smartChips.push({
          key: "verse",
          label: `Ayah ${smart.surahId}:${smart.ayahNumber}`,
          go: () => onJumpToVerse(smart.surahId, smart.ayahNumber),
        });
      }
    } else if (smart.kind === "number") {
      const value = smart.value;
      const surah = surahs.find((item) => item.id === value);
      if (surah) {
        smartChips.push({
          key: "surah",
          label: `Surah ${surah.id}: ${surah.nameEnglish}`,
          go: () => onSelectSurah(surah.id),
        });
      }
      if (value <= 30) {
        smartChips.push({
          key: "juz",
          label: `Juz ${value}`,
          go: () => onJumpToJuz(value),
        });
      }
      if (value <= TOTAL_MUSHAF_PAGES) {
        smartChips.push({
          key: "page",
          label: `Page ${value}`,
          go: () => onSelectPage(value),
        });
      }
    }
  }

  const showJuzRows = !loading && !trimmedQuery && filter === "juz";
  const countLabel = loading
    ? "114 surahs"
    : showJuzRows
      ? "30 juz"
      : !trimmedQuery && filter === "popular"
        ? `${displayedSurahs.length} surahs`
        : `${displayedSurahs.length} of 114 surahs`;

  const fatihaArabicName = surahs.find((surah) => surah.id === 1)?.nameArabic ?? "";

  // The entrance cascade plays on mount and on filter switches (the grid is
  // keyed by filter). The card-enter class stays on permanently (toggling it
  // would restart finished animations when a query is cleared); while a
  // query is active the stagger drops to zero so new matches just fade in.
  const cardDelay = (index: number) => ({
    animationDelay: trimmedQuery ? "0ms" : `${Math.min(index, 20) * 22}ms`,
  });

  return (
    <div className="section-shell pt-12 pb-16">
      {/* Frontispiece: bismillah crown, title, subline */}
      <div ref={frontRef} className="mx-auto max-w-2xl">
        <div className="flex items-center justify-center gap-4">
          <div
            data-fp="rule-left"
            aria-hidden="true"
            className="rule-line hidden h-px max-w-[6.5rem] flex-1 sm:block"
          />
          <p
            dir="rtl"
            lang="ar"
            data-fp="bismillah"
            className="font-arabic text-[26px] leading-none text-paper-meta sm:text-[30px]"
          >
            {BISMILLAH}
          </p>
          <div
            data-fp="rule-right"
            aria-hidden="true"
            className="rule-line hidden h-px max-w-[6.5rem] flex-1 sm:block"
          />
        </div>
        <h1
          data-fp="title"
          className="mt-6 text-center font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
        >
          The <em>Noble</em> Quran
        </h1>
        <p data-fp="sub" className="mt-3 text-center text-sm text-muted tabular-nums">
          Read, listen, and reflect: 114 surahs across {TOTAL_MUSHAF_PAGES} pages.
        </p>
      </div>

      <BrowseHero
        resume={resume}
        loading={loading}
        onResume={onResume}
        onSelectSurah={onSelectSurah}
        fatihaArabicName={fatihaArabicName}
      />

      {/* Search + the Surah/Juz/Popular filter moved up into the site nav
          (ReaderSiteNav); only the result count stays with the directory.
          No aria-live: announcing on every keystroke is chatter, and screen
          readers can query the count on demand. */}
      <div className="mt-9 flex items-center justify-end">
        <span className="shrink-0 text-xs text-muted tabular-nums">{countLabel}</span>
      </div>

      {trimmedQuery && smartChips.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">Go to</span>
          {smartChips.map((chip) => (
            <button key={chip.key} type="button" onClick={chip.go} className={CHIP_CLASS}>
              {chip.label}
            </button>
          ))}
        </div>
      ) : null}

      {!trimmedQuery ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onJumpToVerse(QUICK_VERSE.surahId, QUICK_VERSE.ayahNumber)}
            className={CHIP_CLASS}
          >
            {QUICK_VERSE.label}
          </button>
          {QUICK_SURAHS.map((item) => (
            <button
              key={item.surahId}
              type="button"
              onClick={() => onSelectSurah(item.surahId)}
              className={CHIP_CLASS}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}

      {/* /mushaf#bookmarks target: hidden entirely when there is nothing
          saved. scroll-mt clears the site nav plus the stuck toolbar. */}
      {bookmarks.length > 0 ? (
        // Larger scroll margin below sm: the stacked two-row toolbar plus the
        // site nav reach ~168px, so 128px would land the heading beneath it.
        <div id="bookmarks" className="mt-8 scroll-mt-44 sm:scroll-mt-32">
          <h2 className="text-sm font-semibold text-foreground">Your bookmarks</h2>
          <div className="thin-scrollbar mt-3 flex gap-2 overflow-x-auto pb-2">
            {bookmarks.map((bookmark) => (
              <button
                key={bookmark.verseKey}
                type="button"
                onClick={() => onJumpToBookmark(bookmark.verseKey)}
                className={CHIP_CLASS}
              >
                {bookmark.surahName} {bookmark.ayahNumber}
                <span className="font-medium text-muted">p. {bookmark.page}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <LeafDivider />

      {loading ? (
        <DirectorySkeleton />
      ) : showJuzRows ? (
        <div key={`grid-${filter}`} className={cx("mt-6", GRID_CLASS)}>
          {juzStarts.map((start, index) => (
            <div key={start.juz} className="card-enter" style={cardDelay(index)}>
              <JuzCard start={start} onSelect={onJumpToJuz} />
            </div>
          ))}
        </div>
      ) : displayedSurahs.length === 0 ? (
        <div className="mx-auto mt-10 max-w-md rounded-2xl bg-paper px-8 py-10 text-center shadow-sm">
          <span className="mx-auto grid h-10 w-10 place-items-center">
            <span className="grid h-9 w-9 rotate-45 place-items-center rounded-[3px] border border-border-strong bg-surface">
              <ReaderIcon name="search" className="h-4 w-4 -rotate-45 text-paper-meta" />
            </span>
          </span>
          <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
            No matching surahs
          </h2>
          <p className="mt-1 text-[13px] text-muted">
            Try a name like Ya-Sin, a number like 36, or a meaning like Light.
          </p>
          <button
            type="button"
            onClick={() => onQueryChange("")}
            className={cx(
              "mt-5 inline-flex h-9 items-center rounded-full border border-border bg-surface px-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-deep/60",
              focusRing
            )}
          >
            Clear search
          </button>
        </div>
      ) : (
        <div key={`grid-${filter}`} className={cx("mt-6", GRID_CLASS)}>
          {displayedSurahs.map((surah, index) => (
            <div key={surah.id} className="card-enter" style={cardDelay(index)}>
              <SurahCard
                surah={surah}
                resumed={resume?.surahId === surah.id}
                onSelect={onSelectSurah}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
