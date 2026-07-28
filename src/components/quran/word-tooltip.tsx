"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { WbwWord } from "@/lib/quran-wbw";
import { parseVerseKey } from "./reader-data";

// Glass header height: anchoring above the word would tuck the tooltip under
// the fixed chrome, so targets this close to the top flip below instead.
const HEADER_FLIP_PX = 72;
// Hover-intent delay: a straight read-through never flashes tooltips.
const INTENT_MS = 150;
const EDGE_PAD_PX = 12;

type HoverSnapshot = {
  verseKey: string;
  position: number;
  glyphType: string;
  rect: DOMRect;
};

// Desktop-only hover tooltip for the mushaf's word glyphs. Pure event
// delegation off the buttons' existing data-verse-key / data-word-position /
// data-glyph-type attributes: ZERO props or re-render churn through the
// river's mounted cards. Mounted once in the mushaf branch of the
// orchestrator.
//
// Interplay guarantees: pointer-events-none (never intercepts clicks,
// double-clicks, context menus, or long-presses), not focusable, registers
// nowhere in anyOverlayOpen or the Escape chain, and never attaches on touch
// devices (capability gate + per-event pointerType check).
export function MushafWordTooltip({
  enabled,
  wbwByAyah,
  onNeedSurah,
}: {
  enabled: boolean;
  wbwByAyah: Record<string, WbwWord[]>;
  onNeedSurah: (surahId: number) => void;
}) {
  const [hoverCapable, setHoverCapable] = useState(false);
  const [snapshot, setSnapshot] = useState<HoverSnapshot | null>(null);
  const [tipWidth, setTipWidth] = useState(0);
  const tipRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const currentBtnRef = useRef<HTMLButtonElement | null>(null);
  const onNeedSurahRef = useRef(onNeedSurah);
  useEffect(() => {
    onNeedSurahRef.current = onNeedSurah;
  }, [onNeedSurah]);

  // Capability gate, kept live: plugging in a mouse (or detaching one)
  // flips the feature without a reload.
  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setHoverCapable(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const active = enabled && hoverCapable;

  useEffect(() => {
    if (!active) return;

    const clearTimer = () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
    const hide = () => {
      clearTimer();
      currentBtnRef.current = null;
      setSnapshot(null);
    };

    function onPointerOver(event: PointerEvent) {
      // Belt and suspenders under the capability gate: touch/pen never arms.
      if (event.pointerType !== "mouse") return;
      const target = event.target as Element | null;
      const btn = target?.closest?.(
        "button[data-verse-key]"
      ) as HTMLButtonElement | null;
      if (!btn || !btn.closest(".qpc-mushaf-page")) return;
      if (btn === currentBtnRef.current) return;
      // Entering a different button: drop the old tooltip and re-arm intent.
      clearTimer();
      currentBtnRef.current = btn;
      setSnapshot(null);
      const verseKey = btn.dataset.verseKey ?? "";
      const glyphType = btn.dataset.glyphType ?? "";
      const position = Number(btn.dataset.wordPosition);
      if (!verseKey || !Number.isFinite(position)) return;
      if (glyphType === "word") {
        // Fire the (idempotent) surah load immediately so a cold hover
        // self-heals: by the time intent fires, data is often ready.
        const parsed = parseVerseKey(verseKey);
        if (parsed) onNeedSurahRef.current(parsed.surahId);
      }
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        setSnapshot({
          verseKey,
          position,
          glyphType,
          rect: btn.getBoundingClientRect(),
        });
      }, INTENT_MS);
    }

    function onPointerOut(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      const current = currentBtnRef.current;
      if (!current) return;
      const target = event.target as Node | null;
      if (target && !current.contains(target)) return;
      const related = event.relatedTarget as Node | null;
      if (related && current.contains(related)) return;
      hide();
    }

    // ANY pointerdown hides: this includes right-click, which fires before
    // contextmenu, so the tooltip can never sit over the context menu or the
    // touch action sheet.
    function onPointerDown() {
      hide();
    }
    function onScroll() {
      hide();
    }

    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("pointerout", onPointerOut, { passive: true });
    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    // Capture catches nested scrollers too; the river scrolls the document.
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll, { capture: true });
      hide();
    };
  }, [active]);

  // Measure after paint so the x-clamp below uses the real width (the first
  // frame renders unclamped at the anchor; the equality guard prevents
  // loops). Content, and therefore width, is fully determined by the hover
  // snapshot and the loaded word data: those are the deps.
  useLayoutEffect(() => {
    const width = tipRef.current?.offsetWidth ?? 0;
    setTipWidth((current) => (current === width ? current : width));
  }, [snapshot, wbwByAyah]);

  if (!active || !snapshot) return null;

  // THE OFF-BY-ONE RULE: wbw arrays hold ONLY real words at p = 1..N; the
  // layout's positions are 1..N for type:"word" plus the single type:"end"
  // marker at N+1 (audit-verified for all 6236 verses). Look up translations
  // ONLY for type:"word", by exact w.p === position; never index the end
  // marker (it is an ayah number, not a word).
  const verse = parseVerseKey(snapshot.verseKey);
  const word =
    snapshot.glyphType === "word"
      ? wbwByAyah[snapshot.verseKey]?.find((w) => w.p === snapshot.position) ?? null
      : null;
  const ayahLabel =
    snapshot.glyphType === "end" && verse ? `Ayah ${verse.ayahNumber}` : null;
  // Word data not loaded yet (or a decor glyph): render nothing; prefetch
  // plus the onNeedSurah call above make this rare and self-healing.
  if (!word && !ayahLabel) return null;

  const { rect } = snapshot;
  const rawX = rect.left + rect.width / 2;
  const flipBelow = rect.top < HEADER_FLIP_PX;
  const y = flipBelow ? rect.bottom + 8 : rect.top - 8;
  const x =
    tipWidth > 0
      ? Math.min(
          Math.max(rawX, EDGE_PAD_PX + tipWidth / 2),
          window.innerWidth - EDGE_PAD_PX - tipWidth / 2
        )
      : rawX;
  const style: CSSProperties = {
    left: x,
    top: y,
    transform: flipBelow ? "translate(-50%, 0)" : "translate(-50%, -100%)",
  };

  return (
    <div
      ref={tipRef}
      role="tooltip"
      className="pointer-events-none fixed z-[70] rounded-xl border border-border bg-[var(--glass-paper-strong)] px-3 py-2 text-center shadow-[0_12px_30px_-8px_rgba(30,24,18,0.18)] backdrop-blur-xl motion-safe:transition-opacity"
      style={style}
    >
      {word ? (
        <>
          <div dir="rtl" lang="ar" className="font-arabic text-lg leading-[1.9] text-foreground">
            {word.a}
          </div>
          {word.t ? <div className="text-[11px] italic text-muted">{word.t}</div> : null}
          <div className="max-w-[14rem] text-xs font-medium text-foreground-soft">
            {word.e}
          </div>
        </>
      ) : (
        <div className="text-xs font-medium text-foreground-soft">{ayahLabel}</div>
      )}
    </div>
  );
}
