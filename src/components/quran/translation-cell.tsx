"use client";

import { useState, type MouseEvent as ReactMouseEvent } from "react";
import { isRtlTafseer, type TafseerMeta } from "@/lib/quran-tafseer-data";
import type { TajweedSegment } from "@/lib/quran-tajweed";
import { useLongPress } from "./hooks";
import { QuranArabicText } from "./quran-arabic-text";
import type { Ayah, PlacedGlyphWord } from "./reader-data";
import { IconTile, OverflowPopover, ReaderIcon, cx, focusRing } from "./ui";

// Translation-view ayah block. Both edges stay balanced (active state is a
// full soft fill, never a one-edge bar); the stable ayah-{s}-{a} id is the
// deep-link scroll target. Theme precedence: theme is a fill, selection is a
// ring, so selecting a tinted ayah never destroys its theme color.
export function TranslationCell({
  ayah,
  fontSize,
  showTranslation,
  translationText,
  showTajweed,
  tajweedSegments,
  glyphWords,
  isActive,
  isBookmarked,
  themeTint,
  themeChip,
  tafseerOpen,
  tafseer,
  tafseerStatus,
  tafseerText,
  onPlay,
  onContinueFrom,
  onToggleBookmark,
  onToggleTafseer,
  onCopyArabic,
  onCopyWithMeaning,
  onCopyLink,
  onOpenSettingsTafsir,
  onOpenThemeDetails,
  onContextMenu,
  onLongPress,
}: {
  ayah: Ayah;
  fontSize: number;
  showTranslation: boolean;
  translationText: string | null;
  showTajweed: boolean;
  tajweedSegments: TajweedSegment[] | null;
  /** Mushaf-placed QPC glyph words; when present the Arabic renders from page-font glyphs. */
  glyphWords?: PlacedGlyphWord[] | null;
  isActive: boolean;
  isBookmarked: boolean;
  /** Thematic rest tint (low-alpha background fill), if this ayah carries one. */
  themeTint?: string | null;
  /** Theme label rendered on the first ayah of each contiguous same-theme run. */
  themeChip?: { name: string; color: string } | null;
  tafseerOpen: boolean;
  tafseer: TafseerMeta | undefined;
  tafseerStatus: "idle" | "loading" | "ready" | "error";
  tafseerText: string | null;
  onPlay: () => void;
  onContinueFrom: () => void;
  onToggleBookmark: () => void;
  onToggleTafseer: () => void;
  onCopyArabic: () => void;
  onCopyWithMeaning: () => void;
  onCopyLink: () => void;
  onOpenSettingsTafsir: () => void;
  onOpenThemeDetails: () => void;
  onContextMenu: (event: ReactMouseEvent) => void;
  onLongPress: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const longPressHandlers = useLongPress(onLongPress);

  return (
    <div
      id={`ayah-${ayah.id.replace(":", "-")}`}
      onContextMenu={onContextMenu}
      {...longPressHandlers}
      className={cx(
        "scroll-mt-36 border-b border-border py-6 transition-colors lg:scroll-mt-28",
        (isActive || themeTint) && "-mx-3 rounded-xl px-3",
        isActive && !themeTint && "bg-accent-soft",
        isActive && themeTint && "ring-1 ring-accent/35"
      )}
      style={themeTint ? { backgroundColor: themeTint } : undefined}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-1">
          <button
            type="button"
            onClick={onCopyLink}
            title="Copy ayah link"
            className={cx(
              "rounded-full bg-surface px-2 py-1 text-xs font-semibold text-muted transition-colors hover:bg-surface-deep hover:text-foreground",
              focusRing
            )}
          >
            {ayah.id}
          </button>
          {themeChip ? (
            <button
              type="button"
              title={themeChip.name}
              onClick={onOpenThemeDetails}
              className={cx(
                "inline-flex h-6 min-w-0 items-center gap-1.5 rounded-full bg-surface/70 px-2 text-[11px] font-semibold text-foreground-soft transition-colors hover:text-foreground",
                focusRing
              )}
            >
              <span
                aria-hidden
                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: themeChip.color }}
              />
              <span dir="auto" className="max-w-[10rem] truncate">
                {themeChip.name}
              </span>
            </button>
          ) : null}
          <IconTile size="sm" label="Play ayah" icon="play" onClick={onPlay} />
          <IconTile
            size="sm"
            label={isBookmarked ? "Remove bookmark" : "Bookmark ayah"}
            icon={isBookmarked ? "bookmark-filled" : "bookmark"}
            active={isBookmarked}
            onClick={onToggleBookmark}
            className={isBookmarked ? "text-accent-deep" : undefined}
          />
        </div>
        <div className="flex items-center gap-1">
          <IconTile
            size="sm"
            label="Copy Arabic"
            icon="copy"
            onClick={onCopyArabic}
            className="hidden lg:flex"
          />
          <div className="relative">
            <IconTile
              size="sm"
              label="More actions"
              icon="kebab"
              onClick={() => setMenuOpen((current) => !current)}
            />
            <OverflowPopover
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              anchor="down"
              items={[
                {
                  label: "Continue playing from here",
                  icon: "play",
                  onSelect: onContinueFrom,
                },
                {
                  label: "Copy Arabic",
                  icon: "copy",
                  onSelect: onCopyArabic,
                },
                {
                  label: "Copy Arabic + meaning",
                  icon: "copy",
                  disabled: !translationText,
                  onSelect: onCopyWithMeaning,
                },
                {
                  label: "Copy ayah link",
                  icon: "link",
                  onSelect: onCopyLink,
                },
                {
                  label: "Themes in this ayah",
                  icon: "palette",
                  onSelect: onOpenThemeDetails,
                },
                {
                  label: isBookmarked ? "Remove bookmark" : "Bookmark ayah",
                  icon: isBookmarked ? "bookmark-filled" : "bookmark",
                  onSelect: onToggleBookmark,
                },
              ]}
            />
          </div>
        </div>
      </div>

      <QuranArabicText
        ayah={ayah}
        fontSize={fontSize}
        showTajweed={showTajweed}
        tajweedSegments={tajweedSegments}
        glyphWords={glyphWords}
      />

      {showTranslation && translationText ? (
        <div className="mt-4">
          <p className="text-[15px] leading-7 text-foreground-soft">{translationText}</p>
          <p className="mt-1 text-xs text-muted">Saheeh International</p>
        </div>
      ) : null}

      <div className="mt-4">
        <button
          type="button"
          aria-expanded={tafseerOpen}
          onClick={onToggleTafseer}
          className={cx(
            "flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm transition-colors hover:bg-surface-deep/60",
            focusRing
          )}
        >
          <ReaderIcon name="book" className="h-3.5 w-3.5" />
          Tafsir
          <ReaderIcon
            name="chevron-down"
            className={cx("h-3.5 w-3.5 transition-transform", tafseerOpen && "rotate-180")}
          />
        </button>
        {tafseerOpen ? (
          <InlineTafseer
            tafseer={tafseer}
            text={tafseerText ?? undefined}
            status={tafseerStatus}
            onOpenSettingsTafsir={onOpenSettingsTafsir}
          />
        ) : null}
      </div>
    </div>
  );
}

// Tafsir panel: identical lazy-load logic, redesigned surface as a
// borderless white card on the canvas (no one-edge accent bars).
export function InlineTafseer({
  tafseer,
  text,
  status,
  onOpenSettingsTafsir,
}: {
  tafseer?: TafseerMeta;
  text?: string;
  status: "idle" | "loading" | "ready" | "error";
  onOpenSettingsTafsir?: () => void;
}) {
  const isRtl = isRtlTafseer(tafseer);
  const paragraphs =
    text
      ?.replace(/\r\n/g, "\n")
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean) ?? [];

  return (
    <div className="mt-3 rounded-xl bg-surface p-4 shadow-sm" dir={isRtl ? "rtl" : "ltr"}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="truncate text-xs font-semibold uppercase tracking-[0.12em] text-paper-meta">
          {tafseer ? tafseer.fullName : "Tafseer"}
        </div>
        {onOpenSettingsTafsir ? (
          <button
            type="button"
            onClick={onOpenSettingsTafsir}
            className={cx("shrink-0 text-xs font-semibold text-accent-deep", focusRing)}
          >
            Change
          </button>
        ) : null}
      </div>
      {paragraphs.length > 0 ? (
        <div className="space-y-3">
          {paragraphs.map((paragraph, index) => (
            // Arabic prose uses font-arabic-prose, NOT font-arabic: KFGQPCHafs
            // maps U+060C/U+061B/U+061F to a wrong composite glyph, and prose
            // keeps its punctuation (stripping would gut Muyassar's commas).
            // The prose face's unicode-range routes those marks to a fallback.
            <p
              key={index}
              lang={tafseer?.language === "ar" ? "ar" : undefined}
              className={
                tafseer?.language === "ar"
                  ? "font-arabic-prose text-xl leading-9 text-foreground"
                  : "text-sm leading-7 text-foreground-soft"
              }
            >
              {paragraph}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-sm leading-7 text-foreground-soft">
          {status === "loading"
            ? "Loading tafseer..."
            : status === "error"
              ? "Could not load this tafseer source right now."
              : "No tafseer entry is available for this ayah."}
        </p>
      )}
    </div>
  );
}
