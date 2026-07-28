"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { MushafPageCard } from "./qpc-page";
import { PageDivider } from "./page-divider";
import { cx, focusRing, focusRingOnAccent } from "./ui";
import {
  ANCHOR_HYSTERESIS_MS,
  DIVIDER_H,
  END_CAP_SPACE,
  HEADER_OFFSET_DESKTOP,
  HEADER_OFFSET_MOBILE,
  READING_ANCHOR_RATIO,
  TOTAL_PAGES,
  anchorPageForScroll,
  buildPageChrome,
  cardTopChromePx,
  estimateCardHeight,
  leafSideForPage,
  mountWindow,
  pageTop,
  resolveQpcFontPx,
  type PageChrome,
  type PendingScrollTarget,
} from "./river-geometry";
import type {
  Ayah,
  BuiltMushafLayout,
  HizbIndex,
  Surah,
} from "./reader-data";

export type RiverScrollBehavior = "smooth" | "instant";

export type MushafRiverHandle = {
  /** Layout mounted AND the authoritative block height has been measured. */
  ready(): boolean;
  scrollToPage(page: number, behavior: RiverScrollBehavior): void;
  scrollToAyah(verseKey: string, behavior: RiverScrollBehavior): void;
  /**
   * Whether the ayah's first line currently sits inside the readable
   * viewport band (below the pinned chrome, above the bottom edge).
   * Used by the audio-follow decision; false when geometry is unknown.
   */
  isAyahVisible(verseKey: string): boolean;
};

export type MushafRiverProps = {
  layout: BuiltMushafLayout;
  pagesByNumber: Map<number, Ayah[]>;
  surahById: Map<number, Surah>;
  ayahById: Map<string, Ayah>;
  hizbIndex: HizbIndex;
  fontSize: number;
  paperLeaf: boolean;
  activeAyahId: string;
  bookmarkedIds: string[];
  /** Page bookmarks ("mushaf ribbons"): pages carrying a folio ribbon toggle. */
  bookmarkedPages: number[];
  themeTintByVerseKey: Record<string, string>;
  /** The committed anchor page (orchestrator state); drives the mount window. */
  anchorPage: number;
  /** True during a rail drag: skeleton tier only, zero font fetches. */
  scrubbing: boolean;
  reducedMotion: boolean;
  /** Deferred navigation executed instantly once measurement is ready. */
  pendingTarget: PendingScrollTarget | null;
  onPendingHandled(): void;
  /** Post-hysteresis anchor commits. */
  onAnchorChange(anchor: { page: number; direction: 1 | -1 }): void;
  /** Every rAF frame while scrolling; drive imperative UI (rail thumb) only. */
  onScrollFraction(fraction: number): void;
  /** Genuine (non-programmatic) scroll frames: audio-follow stamps. */
  onUserScroll(): void;
  onPagePillClick(page: number): void;
  onTogglePageBookmark(page: number): void;
  onEndCapBeginning(): void;
  onEndCapAllSurahs(): void;
  onSelect(ayah: Ayah): void;
  onPlay(ayah: Ayah): void;
  onContextMenu(ayah: Ayah, event: ReactMouseEvent): void;
  onGlyphLongPress(verseKey: string): void;
};

function isDesktopViewport() {
  return typeof window !== "undefined" && window.innerWidth >= 1024;
}

function headerOffsetPx() {
  return isDesktopViewport() ? HEADER_OFFSET_DESKTOP : HEADER_OFFSET_MOBILE;
}

// The continuous vertical page stream: all 604 mushaf pages as one document-
// scrolled river. Identical-height cards make this the trivial virtualization
// case, so it is a custom absolute-position window (no library): a full tier
// of real cards around the anchor and a wider tier of skeleton shells, with
// empty space (zero DOM) everywhere else.
export const MushafRiver = forwardRef<MushafRiverHandle, MushafRiverProps>(
  function MushafRiver(props, ref) {
    const {
      layout,
      pagesByNumber,
      surahById,
      ayahById,
      hizbIndex,
      fontSize,
      paperLeaf,
      activeAyahId,
      bookmarkedIds,
      bookmarkedPages,
      themeTintByVerseKey,
      anchorPage,
      scrubbing,
      reducedMotion,
      pendingTarget,
      onPendingHandled,
      onPagePillClick,
      onTogglePageBookmark,
      onEndCapBeginning,
      onEndCapAllSurahs,
      onSelect,
      onPlay,
      onContextMenu,
      onGlyphLongPress,
    } = props;

    const riverRef = useRef<HTMLDivElement | null>(null);
    // Latest props for the stable scroll listener (re-registering a window
    // listener per render would defeat the rAF throttle). Synced in the
    // FIRST effect each commit so every later effect reads fresh values.
    const propsRef = useRef(props);
    useEffect(() => {
      propsRef.current = props;
    });

    // Block height: estimate for the first paint frame only, then the
    // ResizeObserver truth. One measurement covers all 604 pages.
    const [block, setBlock] = useState(() =>
      typeof window === "undefined"
        ? 900
        : estimateCardHeight(window.innerWidth, fontSize, isDesktopViewport(), paperLeaf) +
          DIVIDER_H
    );
    const [measured, setMeasured] = useState(false);
    const blockRef = useRef(block);
    const measuredRef = useRef(false);
    const riverTopRef = useRef(0);
    // Pending scroll correction applied after a block change re-lays-out the
    // river (keeps the reader on the same line through fontSize stepping).
    const blockAdjustRef = useRef<{ frac: number; anchor: number } | null>(null);

    // Programmatic-scroll bracket: while true, scroll frames neither stamp
    // user-scroll recency nor commit hysteresis anchors.
    const programmaticRef = useRef(false);
    const programmaticTimerRef = useRef<number | null>(null);
    // The bracket's active scrollend listener. Scrubs re-mark the bracket on
    // every pointermove, so the previous listener must be detached each time
    // (and on unmount) or stale finish closures stack up on one scrollend.
    const programmaticFinishRef = useRef<(() => void) | null>(null);

    // Anchor hysteresis state.
    const lastCandidateRef = useRef(anchorPage);
    const hysteresisTimerRef = useRef<number | null>(null);
    const directionRef = useRef<1 | -1>(1);
    const lastScrollYRef = useRef(0);

    const measureRiverTop = useCallback(() => {
      const node = riverRef.current;
      if (!node) return;
      riverTopRef.current = node.getBoundingClientRect().top + window.scrollY;
    }, []);

    const clearHysteresis = useCallback(() => {
      if (hysteresisTimerRef.current !== null) {
        window.clearTimeout(hysteresisTimerRef.current);
        hysteresisTimerRef.current = null;
      }
    }, []);

    // One frame of the river: rail fraction, user-scroll stamp, anchor
    // hysteresis. Reads everything through refs so it is registered once.
    const handleFrame = useCallback(() => {
      const blockNow = blockRef.current;
      if (blockNow <= 0) return;
      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollYRef.current;
      lastScrollYRef.current = scrollY;
      if (delta > 0) directionRef.current = 1;
      else if (delta < 0) directionRef.current = -1;

      const anchorY = window.innerHeight * READING_ANCHOR_RATIO;
      const continuous = (scrollY + anchorY - riverTopRef.current) / blockNow;
      const fraction = Math.max(0, Math.min(1, continuous / (TOTAL_PAGES - 1)));
      propsRef.current.onScrollFraction(fraction);

      const programmatic = programmaticRef.current || propsRef.current.scrubbing;
      if (!programmatic && delta !== 0) propsRef.current.onUserScroll();

      // Anchor derivation with hysteresis. Skipped while programmatic: jumps
      // pre-commit their target anchor (optimistic pre-positioning), so
      // intermediate travel must not churn the mount window.
      if (programmatic) {
        lastCandidateRef.current = propsRef.current.anchorPage;
        clearHysteresis();
        return;
      }
      const candidate = anchorPageForScroll(
        scrollY,
        anchorY,
        riverTopRef.current,
        blockNow
      );
      const committed = propsRef.current.anchorPage;
      if (candidate === committed) {
        lastCandidateRef.current = candidate;
        clearHysteresis();
        return;
      }
      if (candidate !== lastCandidateRef.current) {
        lastCandidateRef.current = candidate;
        clearHysteresis();
        hysteresisTimerRef.current = window.setTimeout(() => {
          hysteresisTimerRef.current = null;
          propsRef.current.onAnchorChange({
            page: lastCandidateRef.current,
            direction: directionRef.current,
          });
        }, ANCHOR_HYSTERESIS_MS);
      }
    }, [clearHysteresis]);

    // The single passive window scroll listener, rAF-throttled.
    useEffect(() => {
      let raf = 0;
      const onScroll = () => {
        if (raf) return;
        raf = window.requestAnimationFrame(() => {
          raf = 0;
          handleFrame();
        });
      };
      const onResize = () => {
        measureRiverTop();
        onScroll();
      };
      lastScrollYRef.current = window.scrollY;
      measureRiverTop();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        if (raf) window.cancelAnimationFrame(raf);
        clearHysteresis();
      };
    }, [handleFrame, measureRiverTop, clearHysteresis]);

    // Programmatic bracket: cleared on scrollend, with a timeout fallback for
    // browsers without the event (older Safari).
    const markProgrammatic = useCallback(() => {
      programmaticRef.current = true;
      if (programmaticFinishRef.current) {
        window.removeEventListener("scrollend", programmaticFinishRef.current);
        programmaticFinishRef.current = null;
      }
      if (programmaticTimerRef.current !== null) {
        window.clearTimeout(programmaticTimerRef.current);
      }
      const finish = () => {
        window.removeEventListener("scrollend", finish);
        if (programmaticFinishRef.current === finish) {
          programmaticFinishRef.current = null;
        }
        if (programmaticTimerRef.current !== null) {
          window.clearTimeout(programmaticTimerRef.current);
          programmaticTimerRef.current = null;
        }
        programmaticRef.current = false;
        lastScrollYRef.current = window.scrollY;
        handleFrame();
      };
      programmaticFinishRef.current = finish;
      window.addEventListener("scrollend", finish);
      programmaticTimerRef.current = window.setTimeout(finish, 800);
    }, [handleFrame]);

    useEffect(
      () => () => {
        if (programmaticTimerRef.current !== null) {
          window.clearTimeout(programmaticTimerRef.current);
        }
        if (programmaticFinishRef.current) {
          window.removeEventListener(
            "scrollend",
            programmaticFinishRef.current
          );
          programmaticFinishRef.current = null;
        }
      },
      []
    );

    const scrollToPageImpl = useCallback(
      (page: number, behavior: RiverScrollBehavior) => {
        const clamped = Math.max(1, Math.min(TOTAL_PAGES, Math.round(page)));
        const top = Math.max(
          0,
          pageTop(clamped, riverTopRef.current, blockRef.current) - headerOffsetPx()
        );
        markProgrammatic();
        // globals.css sets html { scroll-behavior: smooth }: "auto" would
        // still animate, so instant jumps MUST pass behavior: "instant".
        window.scrollTo({ top, behavior });
      },
      [markProgrammatic]
    );

    const lineGeometry = useCallback((verseKey: string) => {
      const ayah = propsRef.current.ayahById.get(verseKey);
      if (!ayah) return null;
      const lines = propsRef.current.layout.pages[ayah.page]?.lines;
      const line = lines?.find((item) =>
        item.words.some((word) => word.verseKey === verseKey)
      );
      if (!line) return { page: ayah.page, lineTop: null as number | null };
      const resolvedFont = resolveQpcFontPx(
        window.innerWidth,
        propsRef.current.fontSize
      );
      const topChrome = cardTopChromePx(
        window.innerWidth,
        isDesktopViewport(),
        propsRef.current.paperLeaf
      );
      const lineTop =
        pageTop(ayah.page, riverTopRef.current, blockRef.current) +
        topChrome +
        (line.lineNumber - 1) * 1.85 * resolvedFont;
      return { page: ayah.page, lineTop };
    }, []);

    const scrollToAyahImpl = useCallback(
      (verseKey: string, behavior: RiverScrollBehavior) => {
        const geometry = lineGeometry(verseKey);
        if (!geometry) return;
        if (geometry.lineTop === null) {
          scrollToPageImpl(geometry.page, behavior);
          return;
        }
        const anchorY = window.innerHeight * READING_ANCHOR_RATIO;
        markProgrammatic();
        window.scrollTo({
          top: Math.max(0, geometry.lineTop - anchorY),
          behavior,
        });
      },
      [lineGeometry, markProgrammatic, scrollToPageImpl]
    );

    useImperativeHandle(
      ref,
      () => ({
        ready: () => measuredRef.current,
        scrollToPage: scrollToPageImpl,
        scrollToAyah: scrollToAyahImpl,
        isAyahVisible: (verseKey: string) => {
          if (!measuredRef.current) return false;
          const geometry = lineGeometry(verseKey);
          if (!geometry || geometry.lineTop === null) return false;
          const resolvedFont = resolveQpcFontPx(
            window.innerWidth,
            propsRef.current.fontSize
          );
          const lineBottom = geometry.lineTop + 1.85 * resolvedFont;
          const bandTop = window.scrollY + headerOffsetPx();
          const bandBottom = window.scrollY + window.innerHeight - 24;
          return geometry.lineTop >= bandTop && lineBottom <= bandBottom;
        },
      }),
      [lineGeometry, scrollToAyahImpl, scrollToPageImpl]
    );

    // Authoritative block measurement: observe the first mounted card (both
    // tiers are pixel-identical by construction). Re-fires on viewport
    // resize and fontSize change; position is preserved across block changes.
    const [measureNode, setMeasureNode] = useState<HTMLDivElement | null>(null);
    useEffect(() => {
      if (!measureNode || typeof ResizeObserver === "undefined") {
        // No ResizeObserver: the estimate is the best truth available.
        if (!measureNode || measuredRef.current) return;
        measuredRef.current = true;
        setMeasured(true);
        return;
      }
      const observer = new ResizeObserver(() => {
        const height = measureNode.getBoundingClientRect().height;
        if (height <= 0) return;
        const nextBlock = height + DIVIDER_H;
        const prevBlock = blockRef.current;
        if (Math.abs(nextBlock - prevBlock) > 0.5) {
          if (measuredRef.current) {
            // Capture the fractional reading position under the OLD block so
            // the post-render adjustment lands on the same line.
            const anchorY = window.innerHeight * READING_ANCHOR_RATIO;
            const anchor = propsRef.current.anchorPage;
            const frac =
              (window.scrollY + anchorY - riverTopRef.current) / prevBlock -
              (anchor - 1);
            blockAdjustRef.current = { frac, anchor };
          }
          blockRef.current = nextBlock;
          setBlock(nextBlock);
        }
        if (!measuredRef.current) {
          measuredRef.current = true;
          setMeasured(true);
        }
      });
      observer.observe(measureNode);
      return () => observer.disconnect();
    }, [measureNode]);

    useLayoutEffect(() => {
      measureRiverTop();
      const adjust = blockAdjustRef.current;
      if (!adjust) return;
      blockAdjustRef.current = null;
      const anchorY = window.innerHeight * READING_ANCHOR_RATIO;
      const top =
        riverTopRef.current + (adjust.anchor - 1 + adjust.frac) * block - anchorY;
      markProgrammatic();
      window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
    }, [block, markProgrammatic, measureRiverTop]);

    // Deferred navigation: execute instantly once the block is measured.
    useEffect(() => {
      if (!measured || !pendingTarget) return;
      if (pendingTarget.kind === "page") {
        scrollToPageImpl(pendingTarget.page, "instant");
      } else {
        scrollToAyahImpl(pendingTarget.verseKey, "instant");
      }
      onPendingHandled();
    }, [measured, pendingTarget, onPendingHandled, scrollToAyahImpl, scrollToPageImpl]);

    const tier = mountWindow(anchorPage, scrubbing);

    // Static per-page chrome for the mounted window (a handful of pages;
    // cheap enough to recompute on each anchor commit).
    const chromeByPage = useMemo(() => {
      const map = new Map<number, PageChrome>();
      for (let page = tier.skelStart; page <= tier.skelEnd; page += 1) {
        map.set(page, buildPageChrome(page, pagesByNumber, surahById, hizbIndex));
      }
      return map;
    }, [tier.skelStart, tier.skelEnd, pagesByNumber, surahById, hizbIndex]);

    const mountedPages: number[] = [];
    for (let page = tier.skelStart; page <= tier.skelEnd; page += 1) {
      mountedPages.push(page);
    }

    return (
      <div
        ref={riverRef}
        className="relative"
        style={{ height: TOTAL_PAGES * block + END_CAP_SPACE }}
      >
        {mountedPages.map((page) => {
          const full = page >= tier.fullStart && page <= tier.fullEnd;
          const chrome =
            chromeByPage.get(page) ??
            buildPageChrome(page, pagesByNumber, surahById, hizbIndex);
          return (
            <div
              key={page}
              className="absolute inset-x-0"
              style={{ top: (page - 1) * block }}
            >
              <div
                ref={page === tier.skelStart ? setMeasureNode : undefined}
                className={cx(
                  "mx-auto w-full max-w-[52rem]",
                  full && !reducedMotion && "river-fade-in"
                )}
              >
                <MushafPageCard
                  pageNumber={page}
                  pageData={layout.pages[page]}
                  chrome={chrome}
                  ayahById={ayahById}
                  surahById={surahById}
                  activeAyahId={activeAyahId}
                  bookmarkedIds={bookmarkedIds}
                  bookmarkedPages={bookmarkedPages}
                  themeTintByVerseKey={themeTintByVerseKey}
                  fontSize={fontSize}
                  surface={paperLeaf ? "paper" : "bare"}
                  placeholder={!full}
                  isAnchor={page === anchorPage}
                  onSelect={onSelect}
                  onPlay={onPlay}
                  onContextMenu={onContextMenu}
                  onGlyphLongPress={onGlyphLongPress}
                  onPagePillClick={onPagePillClick}
                  onTogglePageBookmark={onTogglePageBookmark}
                />
              </div>
              <PageDivider leaf={leafSideForPage(page)} />
            </div>
          );
        })}

        <EndOfMushafCap
          top={TOTAL_PAGES * block}
          onBeginning={onEndCapBeginning}
          onAllSurahs={onEndCapAllSurahs}
        />
      </div>
    );
  }
);

// Past page 604 the river ends in an explicit destination, never a dead-end.
function EndOfMushafCap({
  top,
  onBeginning,
  onAllSurahs,
}: {
  top: number;
  onBeginning: () => void;
  onAllSurahs: () => void;
}) {
  return (
    <div className="absolute inset-x-0" style={{ top }}>
      <div className="mx-auto w-full max-w-[32rem] pb-32 pt-2">
        <div className="rounded-2xl bg-paper p-6 text-center shadow-sm">
          <h2 className="font-display text-lg text-foreground">End of the mushaf</h2>
          <p className="mt-1 text-sm text-muted">You have reached the final page.</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onBeginning}
              className={cx(
                "h-10 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/85 active:scale-[0.98]",
                focusRingOnAccent
              )}
            >
              Back to the beginning
            </button>
            <button
              type="button"
              onClick={onAllSurahs}
              className={cx(
                "h-10 rounded-full bg-surface px-4 text-sm font-semibold text-foreground-soft shadow-sm transition hover:bg-surface-deep/40",
                focusRing
              )}
            >
              All surahs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
