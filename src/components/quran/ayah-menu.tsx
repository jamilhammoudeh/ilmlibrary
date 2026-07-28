"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "@/components/reveal";
import type { AyahActionContext } from "./reader-data";
import {
  BottomSheetShell,
  OverflowPopover,
  ReaderIcon,
  cx,
  focusRing,
  type ReaderIconName,
} from "./ui";

type AyahActionHandlers = {
  onPlay: () => void;
  onContinue: () => void;
  onToggleBookmark: () => void;
  onOpenTafsir: () => void;
  onThemeDetails: () => void;
  onCopyArabic: () => void;
  onCopyWithMeaning: () => void;
  onCopyLink: () => void;
  onClose: () => void;
};

type MenuItem = {
  label: string;
  icon: ReaderIconName;
  onSelect: () => void;
  disabled?: boolean;
};

function buildItems(ctx: AyahActionContext, handlers: AyahActionHandlers): MenuItem[] {
  return [
    { label: "Play ayah", icon: "play", onSelect: handlers.onPlay },
    { label: "Continue playing", icon: "skip-next", onSelect: handlers.onContinue },
    {
      label: ctx.isBookmarked ? "Remove bookmark" : "Bookmark ayah",
      icon: ctx.isBookmarked ? "bookmark-filled" : "bookmark",
      onSelect: handlers.onToggleBookmark,
    },
    { label: "Open tafseer", icon: "book", onSelect: handlers.onOpenTafsir },
    // Always present (discovery-from-text path): the details surface uses the
    // nearest-section fallback, so it is never empty.
    { label: "Themes in this ayah", icon: "palette", onSelect: handlers.onThemeDetails },
    { label: "Copy Arabic", icon: "copy", onSelect: handlers.onCopyArabic },
    {
      label: "Copy Arabic + meaning",
      icon: "copy",
      disabled: !ctx.hasTranslation,
      onSelect: handlers.onCopyWithMeaning,
    },
    { label: "Copy ayah link", icon: "link", onSelect: handlers.onCopyLink },
  ];
}

// Desktop right-click menu; dismissal (outside click, capture scroll, Escape)
// is wired by the orchestrator's existing listeners.
export function AyahContextMenu({
  state,
  ...handlers
}: AyahActionHandlers & {
  state: { x: number; y: number; ctx: AyahActionContext } | null;
}) {
  if (!state) return null;
  const { ctx } = state;
  return (
    <div
      role="menu"
      aria-label={`Actions for ayah ${ctx.verseKey}`}
      className="fixed z-[80] w-60 rounded-xl border border-border bg-[var(--glass-paper-strong)] py-1 shadow-[0_18px_50px_-12px_rgba(30,24,18,0.28)] backdrop-blur-xl"
      style={{ left: state.x, top: state.y }}
      onClick={(event) => event.stopPropagation()}
      onContextMenu={(event) => event.preventDefault()}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <div className="border-b border-border px-3 py-2">
        <div className="truncate text-sm font-semibold text-foreground">
          {ctx.surahName} {ctx.ayahNumber}
        </div>
        <div className="truncate text-xs text-muted">
          Page {ctx.page} : Juz {ctx.juz}
        </div>
      </div>
      {buildItems(ctx, handlers as AyahActionHandlers).map((item) => (
        <button
          key={item.label}
          type="button"
          role="menuitem"
          disabled={item.disabled}
          onClick={item.onSelect}
          className={cx(
            "flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium transition-colors",
            focusRing,
            item.disabled ? "cursor-default opacity-40" : "hover:bg-surface-deep/60"
          )}
        >
          <ReaderIcon name={item.icon} className="h-4 w-4 text-muted" />
          {item.label}
        </button>
      ))}
      <div className="border-t border-border">
        <button
          type="button"
          onClick={handlers.onClose}
          className={cx(
            "flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-muted transition-colors hover:bg-surface-deep/60",
            focusRing
          )}
        >
          <ReaderIcon name="x" className="h-4 w-4 text-muted" />
          Close
        </button>
      </div>
    </div>
  );
}

// Mobile long-press twin of the context menu.
export function AyahActionSheet({
  ctx,
  ...handlers
}: AyahActionHandlers & { ctx: AyahActionContext | null }) {
  return (
    <BottomSheetShell
      open={ctx !== null}
      onClose={handlers.onClose}
      zClass="z-[80]"
      maxHeightClass="max-h-[60svh]"
      ariaLabel={ctx ? `Actions for ayah ${ctx.verseKey}` : "Ayah actions"}
    >
      {ctx ? (
        <div className="px-2 pb-2">
          <div className="border-b border-border px-2 py-3">
            <div className="text-sm font-semibold text-foreground">
              {ctx.surahName} {ctx.ayahNumber}
            </div>
            <div className="text-xs text-muted">
              Page {ctx.page} : Juz {ctx.juz}
            </div>
          </div>
          {buildItems(ctx, handlers as AyahActionHandlers).map((item) => (
            <button
              key={item.label}
              type="button"
              disabled={item.disabled}
              onClick={item.onSelect}
              className={cx(
                "flex h-12 w-full items-center gap-3 px-4 text-left text-sm font-medium transition-colors",
                focusRing,
                item.disabled ? "cursor-default opacity-40" : "hover:bg-surface-deep/60"
              )}
            >
              <ReaderIcon name={item.icon} className="h-4 w-4 text-muted" />
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </BottomSheetShell>
  );
}

// Floating per-ayah toolbar for Reading view: the resurrected
// SelectedAyahPanel as chrome instead of a content card.
export function SelectedAyahToolbar({
  ctx,
  audioBarMounted,
  onPlay,
  onToggleBookmark,
  onOpenTafsir,
  onThemeDetails,
  onCopyArabic,
  onContinue,
  onCopyWithMeaning,
  onCopyLink,
  onClear,
}: {
  ctx: AyahActionContext | null;
  audioBarMounted: boolean;
  onPlay: () => void;
  onToggleBookmark: () => void;
  onOpenTafsir: () => void;
  onThemeDetails: () => void;
  onCopyArabic: () => void;
  onContinue: () => void;
  onCopyWithMeaning: () => void;
  onCopyLink: () => void;
  onClear: () => void;
}) {
  const reduce = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);

  const actionClass = cx(
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-surface-deep/60",
    focusRing
  );

  return (
    <AnimatePresence>
      {ctx ? (
        <motion.div
          initial={false}
          className={cx(
            "fixed z-[65] flex justify-center",
            "inset-x-3 lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2",
            audioBarMounted ? "bottom-[7.5rem] lg:bottom-28" : "bottom-3 lg:bottom-6"
          )}
        >
        <motion.div
          className="no-scrollbar flex h-11 w-full items-center gap-0.5 overflow-x-auto rounded-xl border border-border bg-[var(--glass-paper-strong)] px-1.5 shadow-[0_2px_4px_rgba(30,24,18,0.06),0_12px_30px_-8px_rgba(30,24,18,0.12)] backdrop-blur-xl lg:w-auto lg:overflow-visible"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: 8 }}
          transition={{ duration: 0.22, ease: EASE }}
        >
          <span className="px-2 text-sm font-semibold text-foreground">{ctx.verseKey}</span>
          <span aria-hidden className="h-5 w-px shrink-0 bg-border" />
          <button type="button" aria-label="Play ayah" title="Play ayah" onClick={onPlay} className={actionClass}>
            <ReaderIcon name="play" className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={ctx.isBookmarked ? "Remove bookmark" : "Bookmark ayah"}
            title={ctx.isBookmarked ? "Remove bookmark" : "Bookmark ayah"}
            aria-pressed={ctx.isBookmarked}
            onClick={onToggleBookmark}
            className={cx(actionClass, ctx.isBookmarked && "text-accent-deep")}
          >
            <ReaderIcon name={ctx.isBookmarked ? "bookmark-filled" : "bookmark"} className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Open tafsir" title="Open tafsir" onClick={onOpenTafsir} className={actionClass}>
            <ReaderIcon name="book" className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Copy Arabic" title="Copy Arabic" onClick={onCopyArabic} className={actionClass}>
            <ReaderIcon name="copy" className="h-4 w-4" />
          </button>
          <div className="relative">
            <button
              type="button"
              aria-label="More actions"
              title="More actions"
              onClick={() => setMenuOpen((current) => !current)}
              className={actionClass}
            >
              <ReaderIcon name="kebab" className="h-4 w-4" />
            </button>
            <OverflowPopover
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              anchor="up"
              items={[
                { label: "Continue playing", icon: "skip-next", onSelect: onContinue },
                {
                  label: "Themes in this ayah",
                  icon: "palette",
                  onSelect: onThemeDetails,
                },
                {
                  label: "Copy Arabic + meaning",
                  icon: "copy",
                  disabled: !ctx.hasTranslation,
                  onSelect: onCopyWithMeaning,
                },
                { label: "Copy ayah link", icon: "link", onSelect: onCopyLink },
              ]}
            />
          </div>
          <button type="button" aria-label="Clear selection" title="Clear selection" onClick={onClear} className={actionClass}>
            <ReaderIcon name="x" className="h-4 w-4" />
          </button>
        </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
