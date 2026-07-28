"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { cx, focusRing } from "./ui";
import { TOTAL_PAGES } from "./river-geometry";
import type { HizbIndex } from "./reader-data";

const THUMB_H = 28;
const DRAG_THRESHOLD_PX = 3;

// Desktop-only (lg+) mushaf position rail on the right edge: 60 hizb ticks
// (juz starts emphasized), an accent thumb driven imperatively by the
// river's scroll fraction (no React render per frame), click to jump, drag
// to scrub (skeleton tier only while dragging), keyboard slider semantics,
// and a hover/drag tooltip naming the page, juz, and surah.
export function ProgressRail({
  anchorPage,
  hizbIndex,
  juzForPage,
  surahNameForPage,
  onJump,
  onScrubStart,
  onScrub,
  onScrubEnd,
  registerThumb,
  reducedMotion,
}: {
  anchorPage: number;
  hizbIndex: HizbIndex;
  juzForPage: (page: number) => number;
  surahNameForPage: (page: number) => string;
  onJump: (page: number) => void;
  onScrubStart: () => void;
  onScrub: (page: number) => void;
  onScrubEnd: () => void;
  registerThumb: (el: HTMLElement | null) => void;
  reducedMotion: boolean;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const pointerStateRef = useRef<{ startY: number; dragging: boolean } | null>(null);
  const [tooltip, setTooltip] = useState<{ y: number; page: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  // Scrub coalescing: pointermove can outrun the display (>60Hz mice), and
  // every onScrub re-renders the orchestrator. One rAF per frame reads the
  // latest pointer Y; pointerup flushes synchronously so the scrub always
  // lands exactly where the pointer released.
  const scrubRafRef = useRef(0);
  const scrubClientYRef = useRef(0);

  const cancelScrubFrame = useCallback(() => {
    if (scrubRafRef.current) {
      window.cancelAnimationFrame(scrubRafRef.current);
      scrubRafRef.current = 0;
    }
  }, []);

  useEffect(() => cancelScrubFrame, [cancelScrubFrame]);

  const pageFromClientY = useCallback((clientY: number): number => {
    const track = trackRef.current;
    if (!track) return 1;
    const rect = track.getBoundingClientRect();
    const fraction = Math.max(
      0,
      Math.min(1, (clientY - rect.top) / Math.max(1, rect.height))
    );
    return Math.round(1 + fraction * (TOTAL_PAGES - 1));
  }, []);

  const tooltipFor = useCallback(
    (clientY: number) => {
      const track = trackRef.current;
      if (!track) return null;
      const rect = track.getBoundingClientRect();
      const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
      return { y, page: pageFromClientY(clientY) };
    },
    [pageFromClientY]
  );

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerStateRef.current = { startY: event.clientY, dragging: false };
    setTooltip(tooltipFor(event.clientY));
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const state = pointerStateRef.current;
    if (!state) {
      // Pure hover.
      if (event.pointerType === "mouse") setTooltip(tooltipFor(event.clientY));
      return;
    }
    if (
      !state.dragging &&
      Math.abs(event.clientY - state.startY) > DRAG_THRESHOLD_PX
    ) {
      state.dragging = true;
      setDragging(true);
      onScrubStart();
    }
    if (state.dragging) {
      scrubClientYRef.current = event.clientY;
      if (!scrubRafRef.current) {
        scrubRafRef.current = window.requestAnimationFrame(() => {
          scrubRafRef.current = 0;
          if (!pointerStateRef.current?.dragging) return;
          const clientY = scrubClientYRef.current;
          setTooltip(tooltipFor(clientY));
          onScrub(pageFromClientY(clientY));
        });
      }
    }
  }

  function onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const state = pointerStateRef.current;
    pointerStateRef.current = null;
    if (!state) return;
    if (state.dragging) {
      setDragging(false);
      onScrubEnd();
    } else {
      // A tap without movement is a jump.
      onJump(pageFromClientY(event.clientY));
    }
    if (event.pointerType !== "mouse") setTooltip(null);
  }

  function onPointerCancel() {
    const state = pointerStateRef.current;
    pointerStateRef.current = null;
    setTooltip(null);
    if (state?.dragging) {
      setDragging(false);
      onScrubEnd();
    }
  }

  function onKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    let target: number | null = null;
    if (event.key === "ArrowUp") target = anchorPage - 1;
    else if (event.key === "ArrowDown") target = anchorPage + 1;
    else if (event.key === "PageUp") target = anchorPage - 10;
    else if (event.key === "PageDown") target = anchorPage + 10;
    else if (event.key === "Home") target = 1;
    else if (event.key === "End") target = TOTAL_PAGES;
    if (target === null) return;
    event.preventDefault();
    onJump(Math.max(1, Math.min(TOTAL_PAGES, target)));
  }

  const anchorJuz = juzForPage(anchorPage);
  const thumbStyle: CSSProperties = {
    ["--rail-f" as string]: String((anchorPage - 1) / (TOTAL_PAGES - 1)),
    top: `calc(var(--rail-f) * (100% - ${THUMB_H}px))`,
    height: THUMB_H,
    transition: reducedMotion ? "none" : undefined,
  };

  return (
    <div className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
      <div
        ref={trackRef}
        role="slider"
        aria-label="Mushaf position"
        aria-orientation="vertical"
        aria-valuemin={1}
        aria-valuemax={TOTAL_PAGES}
        aria-valuenow={anchorPage}
        aria-valuetext={`Page ${anchorPage}, Juz ${anchorJuz}`}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={() => {
          if (!pointerStateRef.current) setTooltip(null);
        }}
        onKeyDown={onKeyDown}
        className={cx(
          "group relative h-[min(60vh,480px)] w-6 cursor-pointer touch-none",
          focusRing
        )}
      >
        {/* Visible track. */}
        <div className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 rounded-full bg-border" />

        {/* Hizb ticks; juz starts (odd hizbs) wider and at full opacity. */}
        {hizbIndex.hizbStartPage.map((startPage, index) => {
          const hizb = index + 1;
          const isJuzStart = hizb % 2 === 1;
          return (
            <div
              key={hizb}
              aria-hidden
              className={cx(
                "absolute left-1/2 h-px -translate-x-1/2 bg-border-strong",
                isJuzStart ? "w-[10px] opacity-100" : "w-[7px] opacity-60"
              )}
              style={{ top: `${((startPage - 1) / (TOTAL_PAGES - 1)) * 100}%` }}
            />
          );
        })}

        {/* Thumb: position driven imperatively (CSS var) by the river's
            per-frame scroll fraction; the inline var below only seeds it. */}
        <div
          ref={registerThumb}
          aria-hidden
          className={cx(
            "absolute left-1/2 w-[5px] -translate-x-1/2 rounded-full bg-accent",
            dragging && "ring-2 ring-accent-glow",
            "group-hover:ring-2 group-hover:ring-accent-glow"
          )}
          style={thumbStyle}
        />

        {/* Hover / drag tooltip. */}
        {tooltip ? (
          <div
            className="pointer-events-none absolute right-8 -translate-y-1/2 whitespace-nowrap rounded-lg border border-border bg-[var(--glass-paper-strong)] px-2.5 py-1.5 text-xs shadow backdrop-blur"
            style={{ top: tooltip.y }}
          >
            <div className="font-semibold tabular-nums text-foreground">
              Page {tooltip.page} : Juz {juzForPage(tooltip.page)}
            </div>
            <div className="text-muted">{surahNameForPage(tooltip.page)}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
