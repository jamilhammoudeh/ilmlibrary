"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { loadQpcFont } from "./qpc-fonts";
import { qpcFontFamily, QPC_WORD_SEPARATOR } from "./qpc-page";
import type { Ayah, PlacedGlyphWord } from "./reader-data";

// Latches true permanently the first time the node comes within rootMargin of
// the viewport. One IntersectionObserver per instance; disconnected on latch.
// Environments without IntersectionObserver start latched (load immediately
// rather than never); the SSR pass also takes that branch, harmlessly, since
// the rendered output only depends on font readiness.
function useNearViewportOnce(
  ref: RefObject<HTMLElement | null>,
  rootMargin: string
): boolean {
  const [near, setNear] = useState(
    () => typeof IntersectionObserver === "undefined"
  );
  useEffect(() => {
    if (near) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setNear(true);
      },
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [near, ref, rootMargin]);
  return near;
}

// Study-view Arabic rendered from the same QPC v4 per-page word glyphs as the
// mushaf. The whole surah mounts unvirtualized, so page fonts must STREAM as
// the reader scrolls (800px lookahead gate), never storm on open. Until the
// fonts decode, an approximate-height skeleton holds the slot with no glyph
// text mounted, so no fetch can trigger early.
export function QpcAyahGlyphText({
  ayah,
  words,
  fontSize,
}: {
  ayah: Ayah;
  words: PlacedGlyphWord[];
  fontSize: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const near = useNearViewportOnce(ref, "800px");
  const [ready, setReady] = useState(false);

  // Audit fact: no verse spans a page break, so this is normally exactly one
  // group. Grouping by page anyway is a cheap defensive invariant.
  const groups = useMemo(() => {
    const out: Array<{ page: number; codes: string[] }> = [];
    for (const word of words) {
      const last = out[out.length - 1];
      if (last && last.page === word.page) {
        last.codes.push(word.code);
      } else {
        out.push({ page: word.page, codes: [word.code] });
      }
    }
    return out;
  }, [words]);

  useEffect(() => {
    if (!near || ready) return;
    let active = true;
    const distinctPages = [...new Set(groups.map((group) => group.page))];
    Promise.all(distinctPages.map(loadQpcFont)).then(() => {
      if (active) setReady(true);
    });
    return () => {
      active = false;
    };
  }, [near, ready, groups]);

  if (!ready) {
    return (
      <div
        ref={ref}
        aria-hidden
        className="skeleton-shimmer rounded-md"
        style={{
          height: `${Math.max(1, Math.ceil(words.length / 9)) * 2.44}em`,
          fontSize,
        }}
      />
    );
  }

  // ALL entries render in position order, including the single end marker.
  // The hair-space separator (the centered-row precedent) is a valid break
  // opportunity, so wrapped lines break at word boundaries. NEVER apply
  // letter-spacing here: it breaks Arabic shaping and would wedge gaps
  // between the glyphs of multi-codepoint word codes.
  return (
    <p
      dir="rtl"
      lang="ar"
      data-verse-key={ayah.id}
      className="qpc-mushaf-page qpc-study-arabic text-foreground"
      style={{ fontSize }}
    >
      {groups.map((group, index) => (
        <span key={group.page} style={{ fontFamily: qpcFontFamily(group.page) }}>
          {(index > 0 ? QPC_WORD_SEPARATOR : "") +
            group.codes.join(QPC_WORD_SEPARATOR)}
        </span>
      ))}
    </p>
  );
}
