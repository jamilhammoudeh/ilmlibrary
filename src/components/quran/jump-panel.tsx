"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "@/components/reveal";
import { useIsDesktop, useOutsideDismiss } from "./hooks";
import {
  parseSmartQuery,
  POPULAR_SURAH_IDS,
  TOTAL_MUSHAF_PAGES,
  type Surah,
} from "./reader-data";
import {
  BottomSheetShell,
  SearchField,
  SegmentedSwitch,
  cx,
  focusRing,
  focusRingOnAccent,
} from "./ui";

export type JumpTab = "surah" | "verse" | "juz" | "page";

export type JuzStart = {
  juz: number;
  surahId: number;
  ayahNumber: number;
  surahName: string;
};

const EXIT_EASE: [number, number, number, number] = [0.4, 0, 1, 1];

type JumpPanelProps = {
  open: boolean;
  initialTab: JumpTab;
  onClose: () => void;
  surahs: Surah[];
  surahById: Map<number, Surah>;
  activeSurahId: number;
  activeAyahNumber: number;
  currentPage: number;
  juzStarts: JuzStart[];
  bookmarks: string[];
  bookmarkMeta: (
    verseKey: string
  ) => { surahName: string; ayahNumber: number; page: number } | null;
  /** Page bookmarks ("mushaf ribbons"); toggled from the folio, jumped from here. */
  pageBookmarks: number[];
  onSelectSurah: (surahId: number) => void;
  onSelectVerse: (surahId: number, ayahNumber: number) => void;
  onSelectJuz: (juz: number) => void;
  onSelectPage: (page: number) => void;
  onSelectBookmark: (verseKey: string) => void;
  onSelectPageBookmark: (page: number) => void;
};

// On-demand navigation: Surah / Verse / Juz / Page tabs plus the saved
// bookmarks, as an anchored popover on desktop and a bottom sheet on mobile.
export function JumpPanel(props: JumpPanelProps) {
  const { open, initialTab, onClose } = props;
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();
  const popoverRef = useRef<HTMLDivElement>(null);
  const popoverListRef = useRef<HTMLDivElement>(null);
  const sheetListRef = useRef<HTMLDivElement>(null);

  const [tab, setTab] = useState<JumpTab>(initialTab);
  const [filter, setFilter] = useState("");
  const [popularOnly, setPopularOnly] = useState(false);
  const [pageInput, setPageInput] = useState("");

  // Reset the internal tab + filters whenever the panel opens (render-phase
  // state adjustment, per the React "derive state from props" pattern).
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setTab(initialTab);
      setFilter("");
      setPageInput("");
    }
  }

  useOutsideDismiss(popoverRef, onClose, open && isDesktop);

  // Center the active row inside whichever scroll container is visible.
  useEffect(() => {
    if (!open) return;
    const timeout = window.setTimeout(() => {
      for (const ref of [popoverListRef, sheetListRef]) {
        const container = ref.current;
        if (!container || container.offsetParent === null) continue;
        const target = container.querySelector<HTMLElement>("[data-jump-active='true']");
        if (!target) continue;
        container.scrollTop =
          target.offsetTop - container.clientHeight / 2 + target.clientHeight / 2;
      }
    }, 30);
    return () => window.clearTimeout(timeout);
  }, [open, tab]);

  const content = (listRef: RefObject<HTMLDivElement | null>) => (
    <JumpPanelContent
      {...props}
      tab={tab}
      onSetTab={setTab}
      filter={filter}
      onSetFilter={setFilter}
      popularOnly={popularOnly}
      onSetPopularOnly={setPopularOnly}
      pageInput={pageInput}
      onSetPageInput={setPageInput}
      listRef={listRef}
    />
  );

  return isDesktop ? (
    <>
      {/* Desktop: anchored popover under the context bar's surah chip. */}
      <div className="hidden lg:block">
        <AnimatePresence>
          {open ? (
            <motion.div
              ref={popoverRef}
              role="dialog"
              aria-label="Jump to a surah, verse, juz, or page"
              className="section-shell-wide absolute inset-x-0 top-full z-[55] mt-2"
              initial={reduce ? false : { opacity: 0, y: -8, scale: 0.98 }}
              animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={
                reduce
                  ? undefined
                  : {
                      opacity: 0,
                      y: -6,
                      scale: 0.985,
                      transition: { duration: 0.18, ease: EXIT_EASE },
                    }
              }
              transition={{ duration: 0.28, ease: EASE }}
            >
              <div className="flex max-h-[min(70vh,560px)] w-[360px] flex-col rounded-2xl border border-border bg-[var(--glass-paper-strong)] p-2 shadow-[0_18px_50px_-12px_rgba(30,24,18,0.28)] backdrop-blur-xl">
                {content(popoverListRef)}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  ) : (
    /* Mobile: the same content in a bottom sheet (portaled to <body>). */
    <BottomSheetShell
      open={open}
      onClose={onClose}
      zClass="z-[60]"
      maxHeightClass="max-h-[80svh]"
      ariaLabel="Jump to a surah, verse, juz, or page"
    >
      <div className="flex max-h-full flex-col p-3">{content(sheetListRef)}</div>
    </BottomSheetShell>
  );
}

function JumpPanelContent({
  surahs,
  surahById,
  activeSurahId,
  activeAyahNumber,
  currentPage,
  juzStarts,
  bookmarks,
  bookmarkMeta,
  pageBookmarks,
  onSelectSurah,
  onSelectVerse,
  onSelectJuz,
  onSelectPage,
  onSelectBookmark,
  onSelectPageBookmark,
  onClose,
  tab,
  onSetTab,
  filter,
  onSetFilter,
  popularOnly,
  onSetPopularOnly,
  pageInput,
  onSetPageInput,
  listRef,
}: JumpPanelProps & {
  tab: JumpTab;
  onSetTab: (tab: JumpTab) => void;
  filter: string;
  onSetFilter: (value: string) => void;
  popularOnly: boolean;
  onSetPopularOnly: (value: boolean) => void;
  pageInput: string;
  onSetPageInput: (value: string) => void;
  listRef: RefObject<HTMLDivElement | null>;
}) {
  const trimmedFilter = filter.trim();
  const normalizedFilter = trimmedFilter.toLowerCase();

  const filteredSurahs = useMemo(() => {
    let base = surahs;
    if (popularOnly && !normalizedFilter) {
      const popular = new Set(POPULAR_SURAH_IDS);
      base = surahs.filter((surah) => popular.has(surah.id));
    }
    if (!normalizedFilter) return base;
    return surahs.filter(
      (surah) =>
        String(surah.id) === normalizedFilter ||
        surah.nameEnglish.toLowerCase().includes(normalizedFilter) ||
        surah.nameTranslation.toLowerCase().includes(normalizedFilter) ||
        surah.nameArabic.includes(trimmedFilter)
    );
  }, [surahs, popularOnly, normalizedFilter, trimmedFilter]);

  const smart = parseSmartQuery(filter);
  const activeSurah = surahById.get(activeSurahId);
  const activeJuz = juzStarts.reduce(
    (current, start) =>
      start.surahId < activeSurahId ||
      (start.surahId === activeSurahId && start.ayahNumber <= activeAyahNumber)
        ? start.juz
        : current,
    1
  );

  const smartRows: ReactNode[] = [];
  if (smart.kind === "verse") {
    const surah = surahById.get(smart.surahId);
    if (surah && smart.ayahNumber <= surah.ayahs.length) {
      smartRows.push(
        <SmartRow
          key="smart-verse"
          label={`Go to ${surah.nameEnglish}, Ayah ${smart.ayahNumber}`}
          onClick={() => {
            onSelectVerse(smart.surahId, smart.ayahNumber);
            onClose();
          }}
        />
      );
    }
  } else if (smart.kind === "number") {
    const surah = smart.value <= 114 ? surahById.get(smart.value) : undefined;
    if (surah) {
      smartRows.push(
        <SmartRow
          key="smart-surah"
          label={`Go to Surah ${smart.value}: ${surah.nameEnglish}`}
          onClick={() => {
            onSelectSurah(smart.value);
            onClose();
          }}
        />
      );
    }
    if (smart.value <= 30) {
      smartRows.push(
        <SmartRow
          key="smart-juz"
          label={`Go to Juz ${smart.value}`}
          onClick={() => {
            onSelectJuz(smart.value);
            onClose();
          }}
        />
      );
    }
    smartRows.push(
      <SmartRow
        key="smart-page"
        label={`Go to Page ${smart.value}`}
        onClick={() => {
          onSelectPage(smart.value);
          onClose();
        }}
      />
    );
  }

  const visibleBookmarks = bookmarks.slice(0, 8);
  // Page bookmarks read as ribbons in a physical mushaf: ascending page order,
  // regardless of the order they were added.
  const sortedPageBookmarks = useMemo(
    () => [...pageBookmarks].sort((a, b) => a - b),
    [pageBookmarks]
  );
  const quickPages = useMemo(() => {
    const pages: number[] = [];
    for (let page = currentPage - 10; page <= currentPage + 10; page++) {
      if (page >= 1 && page <= TOTAL_MUSHAF_PAGES) pages.push(page);
    }
    return pages;
  }, [currentPage]);

  const isMac =
    typeof navigator !== "undefined" && /mac/i.test(navigator.platform ?? "");

  function submitPageInput() {
    const value = Number(pageInput);
    if (!Number.isFinite(value)) return;
    onSelectPage(Math.max(1, Math.min(TOTAL_MUSHAF_PAGES, Math.round(value))));
    onClose();
  }

  return (
    <>
      <SearchField
        value={filter}
        onChange={onSetFilter}
        placeholder="Surah name or number"
        onClear={() => onSetFilter("")}
        className="mb-2"
      />

      {smartRows.length > 0 ? <div className="mb-1">{smartRows}</div> : null}

      {tab === "surah" && !normalizedFilter ? (
        <div className="mb-2 flex items-center justify-between px-1">
          <button
            type="button"
            aria-pressed={popularOnly}
            onClick={() => onSetPopularOnly(!popularOnly)}
            className={cx(
              "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
              focusRing,
              popularOnly
                ? "bg-accent-soft text-accent-soft-text"
                : "bg-surface/70 text-muted hover:text-foreground"
            )}
          >
            Popular
          </button>
          <span className="text-xs text-muted">
            {filteredSurahs.length} of {surahs.length}
          </span>
        </div>
      ) : null}
      {tab === "surah" && normalizedFilter ? (
        <div className="mb-2 px-1 text-right text-xs text-muted">
          {filteredSurahs.length} of {surahs.length}
        </div>
      ) : null}

      <SegmentedSwitch<JumpTab>
        value={tab}
        size="sm"
        ariaLabel="Jump panel tab"
        className="mb-2"
        options={[
          { value: "surah", label: "Surah" },
          { value: "verse", label: "Verse" },
          { value: "juz", label: "Juz" },
          { value: "page", label: "Page" },
        ]}
        onChange={onSetTab}
      />

      <div ref={listRef} className="thin-scrollbar min-h-0 flex-1 overflow-y-auto pr-1">
        {tab === "surah" ? (
          filteredSurahs.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">No matching surahs.</p>
          ) : (
            filteredSurahs.map((surah) => {
              const active = surah.id === activeSurahId;
              return (
                <button
                  key={surah.id}
                  type="button"
                  data-jump-active={active || undefined}
                  onClick={() => {
                    onSelectSurah(surah.id);
                    onClose();
                  }}
                  className={cx(
                    "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-surface-deep/60",
                    focusRing,
                    active && "bg-accent-soft"
                  )}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface text-xs font-semibold text-muted">
                    {surah.id}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {surah.nameEnglish}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {surah.nameTranslation}
                    </span>
                  </span>
                  <span dir="rtl" className="shrink-0 font-arabic text-base text-foreground-soft">
                    {surah.nameArabic}
                  </span>
                </button>
              );
            })
          )
        ) : null}

        {tab === "verse" ? (
          <>
            <div className="px-1 pb-1 text-xs font-semibold text-muted">
              {activeSurah?.nameEnglish ?? `Surah ${activeSurahId}`}
            </div>
            <div className="grid grid-cols-5 gap-1">
              {Array.from({ length: activeSurah?.ayahs.length ?? 0 }, (_, index) => {
                const ayahNumber = index + 1;
                const active = ayahNumber === activeAyahNumber;
                return (
                  <button
                    key={ayahNumber}
                    type="button"
                    data-jump-active={active || undefined}
                    onClick={() => {
                      onSelectVerse(activeSurahId, ayahNumber);
                      onClose();
                    }}
                    className={cx(
                      "h-9 rounded-lg text-sm font-medium transition-colors",
                      focusRing,
                      active
                        ? "bg-accent-soft text-accent-soft-text"
                        : "bg-surface text-foreground hover:bg-surface-deep/60"
                    )}
                  >
                    {ayahNumber}
                  </button>
                );
              })}
            </div>
          </>
        ) : null}

        {tab === "juz" ? (
          juzStarts.map((start) => {
            const active = start.juz === activeJuz;
            return (
              <button
                key={start.juz}
                type="button"
                data-jump-active={active || undefined}
                onClick={() => {
                  onSelectJuz(start.juz);
                  onClose();
                }}
                className={cx(
                  "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-surface-deep/60",
                  focusRing,
                  active && "bg-accent-soft"
                )}
              >
                <span className="text-sm font-medium text-foreground">Juz {start.juz}</span>
                <span className="text-xs text-muted">
                  {start.surahName} {start.ayahNumber}
                </span>
              </button>
            );
          })
        ) : null}

        {tab === "page" ? (
          <>
            <form
              className="flex items-center gap-2 px-1 pb-2"
              onSubmit={(event) => {
                event.preventDefault();
                submitPageInput();
              }}
            >
              <input
                type="number"
                min={1}
                max={TOTAL_MUSHAF_PAGES}
                inputMode="numeric"
                value={pageInput}
                onChange={(event) => onSetPageInput(event.target.value)}
                placeholder={String(currentPage)}
                aria-label="Page number"
                className="h-9 w-24 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-accent"
              />
              <button
                type="submit"
                className={cx(
                  "h-9 rounded-full bg-primary px-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85",
                  focusRingOnAccent
                )}
              >
                Go
              </button>
            </form>
            {quickPages.map((page) => {
              const active = page === currentPage;
              return (
                <button
                  key={page}
                  type="button"
                  data-jump-active={active || undefined}
                  onClick={() => {
                    onSelectPage(page);
                    onClose();
                  }}
                  className={cx(
                    "flex w-full items-center rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors hover:bg-surface-deep/60",
                    focusRing,
                    active
                      ? "bg-accent-soft text-accent-soft-text"
                      : "text-foreground"
                  )}
                >
                  Page {page}
                </button>
              );
            })}
          </>
        ) : null}
      </div>

      <div className="mt-2 border-t border-border pt-2">
        <div className="flex items-center justify-between px-1 pb-1">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-paper-meta">
            Bookmarks
          </span>
          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent-soft-text">
            {bookmarks.length + sortedPageBookmarks.length}
          </span>
        </div>
        {sortedPageBookmarks.length > 0 ? (
          <>
            <div className="px-1 pb-1 text-xs font-semibold text-muted">Pages</div>
            <div className="flex flex-wrap gap-1.5 px-1 pb-2">
              {sortedPageBookmarks.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => {
                    onSelectPageBookmark(page);
                    onClose();
                  }}
                  className={cx(
                    "rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold tabular-nums text-accent-soft-text transition-colors hover:bg-accent-soft/70",
                    focusRing
                  )}
                >
                  Page {page}
                </button>
              ))}
            </div>
          </>
        ) : null}
        {sortedPageBookmarks.length > 0 && visibleBookmarks.length > 0 ? (
          <div className="px-1 pb-1 text-xs font-semibold text-muted">Ayahs</div>
        ) : null}
        {visibleBookmarks.length === 0 ? (
          sortedPageBookmarks.length === 0 ? (
            <p className="px-1 py-1 text-xs text-muted">
              Bookmark ayahs and they will stay here on this browser.
            </p>
          ) : null
        ) : (
          visibleBookmarks.map((verseKey) => {
            const meta = bookmarkMeta(verseKey);
            if (!meta) return null;
            return (
              <button
                key={verseKey}
                type="button"
                onClick={() => {
                  onSelectBookmark(verseKey);
                  onClose();
                }}
                className={cx(
                  "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left transition-colors hover:bg-surface-deep/60",
                  focusRing
                )}
              >
                <span className="text-sm font-medium text-foreground">
                  {meta.surahName} {meta.ayahNumber}
                </span>
                <span className="text-xs text-muted">Page {meta.page}</span>
              </button>
            );
          })
        )}
      </div>

      <div className="mt-2 border-t border-border pt-2">
        <p className="px-1 text-[11px] text-muted">
          Tip: press {isMac ? "Cmd" : "Ctrl"}+K to search the Quran
        </p>
      </div>
    </>
  );
}

function SmartRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "mb-1 flex w-full items-center gap-2 rounded-lg bg-accent-soft px-3 py-2 text-sm font-semibold text-accent-soft-text transition-colors hover:bg-accent-soft/70",
        focusRing
      )}
    >
      {label}
    </button>
  );
}
