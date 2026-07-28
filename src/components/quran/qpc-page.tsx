"use client";

import {
  Fragment,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { BismillahGlyph } from "./bismillah";
import { useLongPress } from "./hooks";
import { SurahBanner } from "./surah-banner";
import { cx, focusRing, ReaderIcon } from "./ui";
import {
  parseVerseKey,
  type Ayah,
  type GlyphWord,
  type MushafLine,
  type MushafPageData,
  type Surah,
} from "./reader-data";
import type { PageChrome } from "./river-geometry";

export { QuranArabicText } from "./quran-arabic-text";

export const QPC_SOURCE_FONT_SIZE = 30;
export const QPC_LINE_SLOT_RATIO = 1.85;
export const QPC_GLYPH_LINE_HEIGHT_RATIO = 2.44;
export const QPC_LINE_COUNT = 15;
export const QPC_WORD_SEPARATOR = "\u200A";
export const QPC_BASE_CONTENT_WIDTH = 512;

export type MushafSurface = "bare" | "paper";

export function qpcPageId(pageNumber: number) {
  return String(pageNumber).padStart(3, "0");
}

export function qpcFontFamily(pageNumber: number) {
  return `QPCV4-${qpcPageId(pageNumber)}`;
}

export function MushafLayoutNotice({ message }: { message: string }) {
  return (
    <div className="grid min-h-[30rem] place-items-center rounded-xl bg-surface p-6 text-center text-sm text-muted">
      {message}
    </div>
  );
}

export function MushafPageCard({
  pageNumber,
  pageData,
  chrome,
  ayahById,
  surahById,
  activeAyahId,
  bookmarkedIds,
  bookmarkedPages,
  themeTintByVerseKey,
  fontSize,
  surface,
  placeholder = false,
  isAnchor = false,
  onSelect,
  onPlay,
  onContextMenu,
  onGlyphLongPress,
  onPagePillClick,
  onTogglePageBookmark,
}: {
  pageNumber: number;
  pageData?: MushafPageData;
  chrome: PageChrome;
  ayahById: Map<string, Ayah>;
  surahById: Map<number, Surah>;
  activeAyahId: string;
  bookmarkedIds: string[];
  /** Page bookmarks ("mushaf ribbons"): drives the folio ribbon toggle. */
  bookmarkedPages: number[];
  themeTintByVerseKey?: Record<string, string>;
  fontSize: number;
  surface: MushafSurface;
  /**
   * Skeleton tier of the river: render the full-geometry shell (header,
   * 15 line slots, footer) with NO font face and NO glyph text, so a wide
   * scroll window can never trigger a page-font fetch.
   */
  placeholder?: boolean;
  /** True when this page is the river's committed anchor page. */
  isAnchor?: boolean;
  onSelect: (ayah: Ayah) => void;
  onPlay: (ayah: Ayah) => void;
  onContextMenu: (ayah: Ayah, event: ReactMouseEvent) => void;
  onGlyphLongPress: (verseKey: string) => void;
  onPagePillClick: (page: number) => void;
  onTogglePageBookmark: (page: number) => void;
}) {
  const qpcSize = Math.max(18, Math.min(fontSize, 40));
  const fontFamily = qpcFontFamily(pageNumber);
  // Hold a same-geometry skeleton until this page's font is decoded:
  // QpcPageFontFace registers the @font-face in the same commit, so the
  // effect's fonts.load() both starts and awaits the download. Cached fonts
  // resolve within a frame. The not-ready reset on page change is a
  // render-phase state adjustment (React "derive state from props" pattern).
  const [fontState, setFontState] = useState({ family: fontFamily, ready: false });
  if (fontState.family !== fontFamily) {
    setFontState({ family: fontFamily, ready: false });
  }
  const fontReady = fontState.ready && fontState.family === fontFamily;
  useEffect(() => {
    // Placeholder cards register no @font-face, so fonts.load() would match
    // nothing; skip entirely to keep the skeleton tier fetch-free.
    if (placeholder) return;
    let cancelled = false;
    const markReady = () => {
      if (!cancelled) setFontState({ family: fontFamily, ready: true });
    };
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.load(`1em "${fontFamily}"`).then(markReady).catch(markReady);
    } else {
      // No FontFaceSet support: render immediately rather than never.
      Promise.resolve().then(markReady);
    }
    return () => {
      cancelled = true;
    };
  }, [fontFamily, placeholder]);
  const lineByNumber = useMemo(
    () => new Map(pageData?.lines.map((line) => [line.lineNumber, line]) ?? []),
    [pageData]
  );
  const qpcFontClamp = `clamp(18px, 5.35vw, ${qpcSize}px)`;
  // Content width must track the RESOLVED font size, not a fixed rem cap: the
  // QPC page fonts justify to 512px at their 30px source size, so a full line's
  // intrinsic width is fontSize * (512/30). A fixed cap narrower than that makes
  // justified RTL rows overflow to the visual left and the ink block reads as
  // off-center. Set on the <article> so header/footer share the same width.
  const cardStyle = {
    "--qpc-content-width": `calc(${qpcFontClamp} * ${
      QPC_BASE_CONTENT_WIDTH / QPC_SOURCE_FONT_SIZE
    })`,
  } as CSSProperties;
  const pageStyle = {
    fontSize: qpcFontClamp,
    maxWidth: "var(--qpc-content-width)",
    "--qpc-line-slot-height": `${QPC_LINE_SLOT_RATIO}em`,
    "--qpc-glyph-line-height": `${QPC_GLYPH_LINE_HEIGHT_RATIO}`,
    "--qpc-word-color": "var(--foreground)",
  } as CSSProperties;

  const skeletonLines = Array.from({ length: QPC_LINE_COUNT }, (_, index) => (
    <div key={index} className="qpc-line-slot flex items-center" aria-hidden="true">
      <div className="skeleton-shimmer h-[0.95em] w-full rounded-md" />
    </div>
  ));

  return (
    <article
      className={
        surface === "paper"
          ? "w-full max-w-[52rem] overflow-visible bg-transparent text-foreground lg:rounded-2xl lg:bg-paper lg:p-6 lg:shadow-[0_20px_64px_-30px_rgba(30,24,18,0.72)]"
          : "w-full max-w-[52rem] overflow-visible bg-transparent text-foreground"
      }
      style={cardStyle}
    >
      {/* The font face exists ONLY on full-tier cards: this is the river's
          font-storm guard. Placeholders carry neither the face nor glyph
          text, so no fetch can trigger. */}
      {!placeholder ? <QpcPageFontFace pageNumber={pageNumber} /> : null}

      <PrintedPageHeader chrome={chrome} />

      <div className="px-0 py-7 sm:py-9">
        {placeholder || !pageData ? (
          <div
            dir="rtl"
            className="qpc-mushaf-page mx-auto w-full text-right"
            style={pageStyle}
          >
            {skeletonLines}
          </div>
        ) : (
          <div
            dir="rtl"
            className="qpc-mushaf-page mx-auto w-full text-right"
            style={pageStyle}
          >
            {fontReady
              ? Array.from({ length: QPC_LINE_COUNT }, (_, index) => {
                  const lineNumber = index + 1;
                  const line = lineByNumber.get(lineNumber);
                  return (
                    <QpcMushafLine
                      key={lineNumber}
                      pageNumber={pageNumber}
                      line={line}
                      fontFamily={fontFamily}
                      surahById={surahById}
                      ayahById={ayahById}
                      activeAyahId={activeAyahId}
                      bookmarkedIds={bookmarkedIds}
                      themeTintByVerseKey={themeTintByVerseKey}
                      onSelect={onSelect}
                      onPlay={onPlay}
                      onContextMenu={onContextMenu}
                      onGlyphLongPress={onGlyphLongPress}
                    />
                  );
                })
              : skeletonLines}
          </div>
        )}
      </div>

      <PageIndicator
        chrome={chrome}
        isAnchor={isAnchor}
        bookmarked={bookmarkedPages.includes(pageNumber)}
        onPagePillClick={onPagePillClick}
        onToggleBookmark={onTogglePageBookmark}
      />
    </article>
  );
}

// Printed-page running head, ported from the iOS reader: surah names on the
// left, juz on the right, on EVERY page. Never parity-mirrored. Fixed h-9 so
// all 604 cards stay pixel-identical in height.
export function PrintedPageHeader({ chrome }: { chrome: PageChrome }) {
  const names = chrome.surahNames.length > 0 ? chrome.surahNames : ["Quran"];
  return (
    <header className="mx-auto flex h-9 w-full max-w-[var(--qpc-content-width,32rem)] items-center justify-between gap-3 text-[11px] font-semibold text-paper-meta">
      <span className="flex min-w-0 items-center truncate">
        {names.map((name, index) => (
          <Fragment key={`${name}-${index}`}>
            {index > 0 ? (
              <span aria-hidden className="mx-2 h-3 w-px shrink-0 bg-paper-rule" />
            ) : null}
            <span className="truncate">{name}</span>
          </Fragment>
        ))}
      </span>
      <span className="shrink-0">Juz {chrome.juz}</span>
    </header>
  );
}

// Printed-page folio, mirrored to the physical leaf (fixed h-8):
// pageIsOuterLeft = pageNumber % 2 === 0 (iOS MushafPageGlyph parity rule).
// EVEN page = LEFT leaf: pill first (outer edge), hizb last (spine side).
// ODD page = RIGHT leaf: hizb first (spine side), pill last (outer edge).
// Page 1 (Al-Fatiha) is a right leaf with its pill on the right, exactly
// like a printed RTL mushaf.
export function PageIndicator({
  chrome,
  isAnchor,
  bookmarked,
  onPagePillClick,
  onToggleBookmark,
}: {
  chrome: PageChrome;
  isAnchor: boolean;
  /** True when this page carries a "mushaf ribbon" (page bookmark). */
  bookmarked: boolean;
  onPagePillClick: (page: number) => void;
  onToggleBookmark: (page: number) => void;
}) {
  const pageIsOuterLeft = chrome.pageNumber % 2 === 0;
  const pill = (
    <button
      type="button"
      aria-label={`Page ${chrome.pageNumber}: jump to another page`}
      onClick={() => onPagePillClick(chrome.pageNumber)}
      className={cx(
        "flex h-6 min-w-[2.5rem] items-center justify-center rounded-full border bg-paper px-2.5 text-[11px] font-bold tabular-nums transition-colors hover:border-border-strong hover:text-foreground",
        isAnchor ? "border-border-strong text-foreground" : "border-paper-rule text-paper-meta",
        focusRing
      )}
    >
      {chrome.pageNumber}
    </button>
  );
  // The ribbon toggle rides the pill's side of the folio, on the spine side
  // of the pill so the page number stays at the outer edge. A filled accent
  // ribbon is one of the design system's meaningful green moments.
  const ribbon = (
    <button
      type="button"
      aria-pressed={bookmarked}
      aria-label={
        bookmarked
          ? `Remove bookmark from page ${chrome.pageNumber}`
          : `Bookmark page ${chrome.pageNumber}`
      }
      onClick={() => onToggleBookmark(chrome.pageNumber)}
      className={cx(
        "flex h-6 w-6 items-center justify-center rounded-full transition-colors",
        bookmarked ? "text-accent-deep" : "text-paper-meta hover:text-foreground",
        focusRing
      )}
    >
      <ReaderIcon
        name={bookmarked ? "bookmark-filled" : "bookmark"}
        className="h-3.5 w-3.5"
      />
    </button>
  );
  const pillGroup = (
    <span className="flex items-center gap-0.5">
      {pageIsOuterLeft ? pill : ribbon}
      {pageIsOuterLeft ? ribbon : pill}
    </span>
  );
  const hizb =
    chrome.hizbStart !== null ? (
      <span className="shrink-0 text-[11px] font-semibold text-paper-meta">
        Hizb {chrome.hizbStart}
      </span>
    ) : (
      // Invisible spacer keeps the row balanced when no hizb starts here.
      <span aria-hidden className="min-w-[2.5rem]" />
    );
  return (
    <footer className="mx-auto flex h-8 w-full max-w-[var(--qpc-content-width,32rem)] items-center justify-between">
      {pageIsOuterLeft ? pillGroup : hizb}
      {pageIsOuterLeft ? hizb : pillGroup}
    </footer>
  );
}

export function QpcPageFontFace({ pageNumber }: { pageNumber: number }) {
  const page = qpcPageId(pageNumber);
  return (
    <style>{`@font-face{font-family:"QPCV4-${page}";src:url("/fonts/qpc-v4/p${page}.woff2") format("woff2");font-weight:400;font-style:normal;font-display:block;}`}</style>
  );
}

export function QpcMushafLine({
  pageNumber,
  line,
  fontFamily,
  surahById,
  ayahById,
  activeAyahId,
  bookmarkedIds,
  themeTintByVerseKey,
  onSelect,
  onPlay,
  onContextMenu,
  onGlyphLongPress,
}: {
  pageNumber: number;
  line?: MushafLine;
  fontFamily: string;
  surahById: Map<number, Surah>;
  ayahById: Map<string, Ayah>;
  activeAyahId: string;
  bookmarkedIds: string[];
  themeTintByVerseKey?: Record<string, string>;
  onSelect: (ayah: Ayah) => void;
  onPlay: (ayah: Ayah) => void;
  onContextMenu: (ayah: Ayah, event: ReactMouseEvent) => void;
  onGlyphLongPress: (verseKey: string) => void;
}) {
  if (!line || line.lineType === "empty") {
    return <div className="qpc-line-slot" aria-hidden="true" />;
  }

  if (line.lineType === "surah_name" || line.lineType === "basmallah" || line.words.length === 0) {
    return (
      <QpcSpecialLine
        line={line}
        surah={line.surahNumber ? surahById.get(line.surahNumber) : undefined}
      />
    );
  }

  const useJustifiedRow = !line.isCentered && line.words.length > 1;

  // Justified rows do NOT use justify-between: the inter-word gaps would sit
  // outside the buttons and the highlight band could never paint them. Each
  // word instead absorbs its share of free space via flex-grow weights
  // (1, 2, ..., 2, 1) with logical text alignment, so ink positions match
  // justify-between exactly while every gap lives inside a button box.
  return (
    <div className="qpc-line-slot">
      <div
        className={
          useJustifiedRow
            ? "flex h-full w-full items-center overflow-visible"
            : "flex h-full w-full items-center justify-center overflow-visible"
        }
        dir="rtl"
        data-page={pageNumber}
      >
        {line.words.map((word, index) => {
          const isActive = word.verseKey === activeAyahId;
          const tint = themeTintByVerseKey?.[word.verseKey] ?? null;
          const banded = isActive || tint !== null;
          const isFirst = index === 0;
          const isLast = index === line.words.length - 1;
          return (
            <QpcWordGlyph
              key={`${word.verseKey}-${word.position}-${word.type}-${index}`}
              word={word}
              fontFamily={fontFamily}
              active={isActive}
              bandStart={
                banded &&
                (isFirst || line.words[index - 1].verseKey !== word.verseKey)
              }
              bandEnd={
                banded &&
                (isLast || line.words[index + 1].verseKey !== word.verseKey)
              }
              growWeight={useJustifiedRow ? (isFirst || isLast ? 1 : 2) : 0}
              align={
                !useJustifiedRow ? "center" : isFirst ? "start" : isLast ? "end" : "center"
              }
              bookmarked={bookmarkedIds.includes(word.verseKey)}
              tint={tint}
              trailingSpace={
                !useJustifiedRow && index < line.words.length - 1 ? QPC_WORD_SEPARATOR : ""
              }
              ayah={ayahById.get(word.verseKey)}
              onSelect={onSelect}
              onPlay={onPlay}
              onContextMenu={onContextMenu}
              onLongPress={onGlyphLongPress}
            />
          );
        })}
      </div>
    </div>
  );
}

export function QpcSpecialLine({
  line,
  surah,
}: {
  line: MushafLine;
  surah?: Surah;
}) {
  if (line.lineType === "surah_name") {
    // The app's ornamental Madani plaque, in the printed mushaf's own
    // geometry. It fills the fixed line slot (height-bound, width follows
    // the frame's aspect ratio) so the 15-line river metrics are untouched.
    const srName = surah
      ? `Surah ${surah.nameEnglish}`
      : line.surahNumber
        ? `Surah ${line.surahNumber}`
        : "Surah";
    return (
      <div className="qpc-line-slot flex items-center justify-center overflow-visible">
        {/* The banner is bitmap calligraphy, so keep BOTH names as real
            (hidden) text: announced, selectable-adjacent, and findable.
            lang="ar" makes screen readers switch voices for the Arabic. */}
        <span className="sr-only">{srName}</span>
        {surah?.nameArabic ? (
          <span lang="ar" dir="rtl" className="sr-only">
            {surah.nameArabic}
          </span>
        ) : null}
        <SurahBanner
          surahId={line.surahNumber ?? 0}
          // Full content width, matching the text column exactly (the app
          // draws its paged banner at contentWidth too). fill stretches the
          // ornament ~9.5% flatter than natural inside the fixed 1.85em
          // slot; the calligraphic name keeps its own aspect via mask-size
          // contain.
          fill
          className="h-[96%] w-full"
        />
      </div>
    );
  }

  if (line.lineType === "basmallah") {
    // The calligraphic U+FDFD ligature; sizing lives in .qpc-basmallah-slot
    // (globals.css) with a container-width guard. Slot height and page
    // geometry are untouched (river invariant).
    return (
      <div className="qpc-line-slot qpc-basmallah-slot flex items-center justify-center overflow-visible">
        <BismillahGlyph className="text-foreground" />
      </div>
    );
  }

  return <div className="qpc-line-slot" aria-hidden="true" />;
}

export function QpcWordGlyph({
  word,
  fontFamily,
  active,
  bandStart,
  bandEnd,
  growWeight,
  align,
  bookmarked,
  tint,
  trailingSpace,
  ayah,
  onSelect,
  onPlay,
  onContextMenu,
  onLongPress,
}: {
  word: GlyphWord;
  fontFamily: string;
  active: boolean;
  /** Reading-order first word of the banded run on this line (visual right edge in RTL). */
  bandStart: boolean;
  /** Reading-order last word of the banded run on this line (visual left edge in RTL). */
  bandEnd: boolean;
  /** Flex-grow share on justified rows (1 for edge words, 2 for middle, 0 on centered rows). */
  growWeight: number;
  /** Logical text alignment inside the grown box; resolves under dir="rtl". */
  align: "start" | "center" | "end";
  bookmarked: boolean;
  /** Thematic rest tint; selection keeps it (the band falls back to it). */
  tint?: string | null;
  trailingSpace: string;
  ayah?: Ayah;
  onSelect: (ayah: Ayah) => void;
  onPlay: (ayah: Ayah) => void;
  onContextMenu: (ayah: Ayah, event: ReactMouseEvent) => void;
  onLongPress: (verseKey: string) => void;
}) {
  const longPressHandlers = useLongPress(() => {
    if (ayah) onLongPress(word.verseKey);
  });
  const verse = parseVerseKey(word.verseKey);
  const label = verse ? `Select ${verse.surahId}:${verse.ayahNumber}` : "Select ayah";
  const banded = active || tint != null;
  // The band color falls back from the --ayah-tint theme variable (set here)
  // to accent-soft: selecting a tinted ayah never destroys its color.
  const glyphStyle = {
    fontFamily,
    ...(growWeight > 0 ? { flexGrow: growWeight } : null),
    ...(tint ? { "--ayah-tint": tint } : null),
  } as CSSProperties;

  return (
    <button
      type="button"
      aria-label={label}
      data-verse-key={word.verseKey}
      data-word-position={word.position}
      data-glyph-type={word.type}
      aria-pressed={active}
      disabled={!ayah}
      onClick={() => {
        if (ayah) onSelect(ayah);
      }}
      onDoubleClick={(event) => {
        event.preventDefault();
        if (ayah) onPlay(ayah);
      }}
      onContextMenu={(event) => {
        if (ayah) onContextMenu(ayah, event);
      }}
      {...longPressHandlers}
      className={cx(
        "qpc-word-glyph rounded-[0.15rem] border-0 px-[1px] text-inherit transition-colors",
        focusRing,
        // Logical text alignment: under the row's dir="rtl", text-start is
        // visual right and text-end is visual left. Never use the physical
        // text-right/text-left utilities here.
        align === "start" && "text-start",
        align === "end" && "text-end",
        align === "center" && "text-center",
        // ONE band mechanism for selection, audio follow, and thematic tint:
        // a vertically trimmed pseudo-element that paints the FULL button box.
        // Boxes abut (gaps absorbed by flex-grow), so inset-x-0 is seamless.
        // Never use negative x-insets here: abutting boxes would double-paint.
        // The 0.32em vertical trim keeps each line's fill inside its 1.85em
        // slot so a multi-line ayah cannot double-stack the low-alpha fill.
        // No transition on the pseudo: bands must not ghost during audio
        // auto-advance (transition-colors stays on the button itself).
        banded &&
          "relative isolate before:absolute before:inset-x-0 before:top-[0.32em] before:bottom-[0.32em] before:-z-10",
        banded &&
          (active
            ? "before:bg-[var(--ayah-tint,var(--accent-soft))]"
            : "before:bg-[var(--ayah-tint)]"),
        bandStart && "before:rounded-r-[0.3rem]",
        bandEnd && "before:rounded-l-[0.3rem]",
        // Hover paints the element-background layer, which renders UNDER the
        // -z-10 pseudo: hovering a tinted word darkens through the tint
        // instead of replacing it. Active words keep hover off (parity with
        // the previous behavior).
        !active && "hover:bg-surface-deep disabled:hover:bg-transparent",
        // Bookmarked-ayah indicator. text-accent-deep alone is INVISIBLE on
        // the COLR rosette glyphs (their palette colors are baked into the
        // font and ignore CurrentColor), which made bookmarks look lost the
        // moment the toolbar icon moved on to the next selection. Paint a
        // soft accent chip BEHIND the rosette instead - same wash strength
        // as the selection band, so it reads at a glance. after: keeps it
        // independent of the before: band pseudo; later DOM order paints it
        // above the band when both apply.
        bookmarked &&
          word.type === "end" &&
          "relative isolate text-accent-deep after:absolute after:inset-x-0 after:top-[0.36em] after:bottom-[0.36em] after:-z-10 after:rounded-full after:bg-accent-soft"
      )}
      style={glyphStyle}
    >
      {word.code}
      {trailingSpace}
    </button>
  );
}
