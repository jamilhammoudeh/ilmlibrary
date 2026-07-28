"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ReaderNavDrawer } from "./reader-drawer";
import type { ReaderView } from "./reader-data";
import { IconTile, ReaderIcon, SegmentedSwitch, cx, focusRing } from "./ui";

// THE read-mode header: one 56px bar carrying both the site chrome (brand,
// menu drawer) and the reading context (surah jump chip, view switch, page
// info, themes, bookmark, search, settings), replacing the old two-row
// ReaderSiteNav + ReaderContextBar stack. Full-bleed (edge padding, no
// centered shell) so the brand hugs the left like an app toolbar; no
// marketing CTAs here - Download lives in the drawer. A 2px accent hairline
// tracks reading progress along the bottom edge; the JumpPanel children
// anchor to this bar (relative + top-full).
//
// Width budget, tightest first: <sm shows back + surah chip | themes,
// bookmark, settings, menu. sm adds brand logo, page info, search and the
// tool/site divider; md adds the wordmark; lg adds the centered view switch.
// Everything cut below sm stays one tap away (drawer or jump panel).
export function ReaderChromeBar({
  onBack,
  onOpenSearch,
  surahChipLabel,
  jumpOpen,
  onToggleJump,
  readerView,
  onSetReaderView,
  pageNumber,
  juzLabel,
  hizbNumber,
  onOpenJumpAtPage,
  themesActive,
  themesLabel,
  onOpenThemes,
  activeAyahBookmarked,
  hasActiveAyah,
  onToggleActiveBookmark,
  onOpenSettings,
  progress,
  children,
}: {
  onBack: () => void;
  onOpenSearch: () => void;
  surahChipLabel: string;
  jumpOpen: boolean;
  onToggleJump: () => void;
  readerView: ReaderView;
  onSetReaderView: (v: ReaderView) => void;
  pageNumber: number;
  juzLabel: string;
  hizbNumber: number;
  onOpenJumpAtPage: () => void;
  themesActive: boolean;
  themesLabel: string;
  onOpenThemes: () => void;
  activeAyahBookmarked: boolean;
  hasActiveAyah: boolean;
  onToggleActiveBookmark: () => void;
  onOpenSettings: () => void;
  progress: number;
  children?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="relative border-b border-border bg-[var(--glass-paper)] backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between gap-2 px-3 sm:gap-3 sm:px-5">
        {/* Left: back at the very edge (conventional), then brand, then the
            surah jump chip; the chip gets extra air so it doesn't read as
            part of the wordmark */}
        <div className="flex min-w-0 items-center gap-3">
          <IconTile label="Back to surah list" icon="chevron-left" onClick={onBack} />
          <Link
            href="/quran"
            aria-label="Ilm Library Quran"
            className={cx(
              "hidden shrink-0 items-center gap-2 rounded-lg sm:-ml-1.5 sm:flex",
              focusRing
            )}
          >
            <Image
              src="/logo.png"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 rounded-md object-contain"
            />
            <span className="hidden text-[1.05rem] font-bold leading-none tracking-tight text-foreground font-[family-name:var(--font-amiri)] md:block">
              Ilm Library
            </span>
          </Link>
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={jumpOpen}
            onClick={onToggleJump}
            // Keep the panel's outside-mousedown dismissal from racing the
            // toggle (close-then-reopen on the same click).
            onMouseDown={(event) => event.stopPropagation()}
            className={cx(
              "flex h-9 max-w-[8.5rem] items-center gap-2 truncate rounded-full bg-surface px-3 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-surface-deep/60 sm:ml-2.5 sm:max-w-[11rem] lg:max-w-[16rem]",
              focusRing
            )}
          >
            <span className="truncate">{surahChipLabel}</span>
            <motion.span
              aria-hidden
              animate={reduce ? undefined : { rotate: jumpOpen ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 430, damping: 30 }}
              className="shrink-0"
            >
              <ReaderIcon name="chevron-down" className="h-4 w-4 text-muted" />
            </motion.span>
          </button>
        </div>

        {/* Centered view switch (desktop; MobileViewTabs covers < lg).
            Absolutely centered so the asymmetric side clusters can't shove
            it off the page's midline. */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 lg:flex">
          <SegmentedSwitch
            value={readerView}
            ariaLabel="Reader view"
            options={[
              { value: "study", label: "Translation", icon: "list" },
              { value: "mushaf", label: "Reading", icon: "book" },
            ]}
            onChange={onSetReaderView}
          />
        </div>

        {/* Right: reading tools, divider, site chrome */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onOpenJumpAtPage}
            className={cx(
              "hidden text-right leading-tight transition-opacity hover:opacity-75 sm:block",
              focusRing
            )}
          >
            <span className="block text-sm font-medium text-foreground">
              Page {pageNumber}
            </span>
            <span className="block text-xs text-muted">
              {juzLabel} : Hizb {hizbNumber}
            </span>
          </button>
          {/* The feature's only persistent entry: visible at ALL breakpoints. */}
          <IconTile
            label={themesLabel}
            icon="palette"
            active={themesActive}
            onClick={onOpenThemes}
          />
          <IconTile
            label={activeAyahBookmarked ? "Remove bookmark" : "Bookmark ayah"}
            icon={activeAyahBookmarked ? "bookmark-filled" : "bookmark"}
            active={activeAyahBookmarked}
            disabled={!hasActiveAyah}
            onClick={onToggleActiveBookmark}
            className={activeAyahBookmarked ? "text-accent-deep" : undefined}
          />
          <IconTile
            label="Search the Quran"
            icon="search"
            onClick={onOpenSearch}
            className="hidden sm:flex"
          />
          <IconTile label="Reader settings" icon="gear" onClick={onOpenSettings} />

          <span aria-hidden className="hidden h-5 w-px shrink-0 rounded-full bg-border sm:block" />

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className={cx(
              "flex h-9 w-9 items-center justify-center rounded-full bg-surface/70 text-foreground transition hover:bg-surface-deep/60 active:scale-95",
              focusRing
            )}
          >
            <span aria-hidden="true" className="flex flex-col items-center gap-[3.5px]">
              <span className="h-[1.5px] w-4 rounded-full bg-current" />
              <span className="h-[1.5px] w-4 rounded-full bg-current" />
              <span className="h-[1.5px] w-4 rounded-full bg-current" />
            </span>
          </button>
        </div>
      </div>

      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[2px]">
        <div
          className={cx(
            "h-full bg-accent",
            reduce ? "transition-none" : "transition-[width] duration-150 ease-linear"
          )}
          style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%` }}
        />
      </div>

      {children}

      {/* z-[70] clears the z-[65] selected-ayah toolbar. */}
      <ReaderNavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} zClass="z-[70]" />
    </div>
  );
}

// Mobile-only Translation/Reading tabs; rendered only while the navbar is
// visible, so the pinned reading state is just the slim context bar.
export function MobileViewTabs({
  readerView,
  onSetReaderView,
}: {
  readerView: ReaderView;
  onSetReaderView: (v: ReaderView) => void;
}) {
  const reduce = useReducedMotion();
  const underlineId = useId();
  const tabs: { value: ReaderView; label: string }[] = [
    { value: "study", label: "Translation" },
    { value: "mushaf", label: "Reading" },
  ];
  return (
    <div className="flex h-10 border-b border-border bg-[var(--glass-paper)] backdrop-blur-xl lg:hidden">
      {tabs.map((tab) => {
        const active = tab.value === readerView;
        return (
          <button
            key={tab.value}
            type="button"
            aria-pressed={active}
            onClick={() => onSetReaderView(tab.value)}
            className={cx(
              "relative flex flex-1 items-center justify-center gap-1.5 text-xs font-medium transition-colors",
              focusRing,
              active ? "text-foreground" : "text-muted"
            )}
          >
            {tab.label}
            {active ? (
              <motion.span
                layoutId={reduce ? undefined : `tab-underline-${underlineId}`}
                className="absolute bottom-0 h-[2px] w-12 rounded-full bg-foreground"
                transition={{ type: "spring", stiffness: 430, damping: 34 }}
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
