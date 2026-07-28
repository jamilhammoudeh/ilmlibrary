"use client";

import { DIVIDER_H, type LeafSide } from "./river-geometry";

// A 14px open-spread glyph: two side-by-side rounded rects. The rect matching
// `leaf` is softly filled, the other outlined only, so the seam communicates
// right-leaf vs left-leaf at a glance.
export function LeafGlyph({ leaf, size = 14 }: { leaf: LeafSide; size?: number }) {
  const fillFor = (side: LeafSide) =>
    side === leaf ? "var(--paper-meta)" : "none";
  const fillOpacityFor = (side: LeafSide) => (side === leaf ? 0.3 : undefined);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="var(--paper-meta)" strokeOpacity={0.6} strokeWidth={1.25}>
        <rect
          x="1.2"
          y="2.6"
          width="6.1"
          height="10.8"
          rx="1.6"
          fill={fillFor("left")}
          fillOpacity={fillOpacityFor("left")}
        />
        <rect
          x="8.7"
          y="2.6"
          width="6.1"
          height="10.8"
          rx="1.6"
          fill={fillFor("right")}
          fillOpacity={fillOpacityFor("right")}
        />
      </g>
    </svg>
  );
}

// The slim seam between river pages: a full-width hairline (balanced both
// sides, never a one-edge bar) behind a centered leaf glyph. Height is
// exactly DIVIDER_H at every breakpoint so the river's block math stays
// trivial.
export function PageDivider({ leaf }: { leaf: LeafSide }) {
  return (
    <div
      className="relative mx-auto flex w-full max-w-[32rem] items-center justify-center"
      style={{ height: DIVIDER_H }}
    >
      <div aria-hidden className="rule-line absolute inset-x-0 top-1/2 h-px" />
      <span className="relative bg-background px-1.5 leading-none">
        <LeafGlyph leaf={leaf} />
      </span>
      <span className="sr-only">{leaf === "right" ? "Right page" : "Left page"}</span>
    </div>
  );
}
