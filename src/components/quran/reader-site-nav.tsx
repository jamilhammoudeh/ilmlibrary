"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ReaderNavDrawer } from "./reader-drawer";
import {
  IconTile,
  SearchField,
  SegmentedSwitch,
  cx,
  focusRing,
  focusRingOnAccent,
} from "./ui";

export type SurahDirectoryFilter = "surah" | "juz" | "popular";

// The BROWSE-mode chrome, superseding the old site-nav row + in-page sticky
// toolbar pair (read mode uses the merged ReaderChromeBar). Rendered as the
// same floating compact pill the marketing pages use: inset from the edges,
// rounded, glassy, hovering over the content, always visible (no scroll
// auto-hide here - that stays a read-mode behavior). One bar: brand, the
// directory search field, and on desktop the Surah/Juz/Popular filter plus
// reader settings; Download and the menu drawer close the row. Below lg the
// filter + settings drop to a slim second row inside the pill. No marketing
// center links here - every site destination lives in the drawer.
export function ReaderSiteNav({
  query,
  onQueryChange,
  filter,
  onFilterChange,
  onOpenSettings,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  filter: SurahDirectoryFilter;
  onFilterChange: (f: SurahDirectoryFilter) => void;
  onOpenSettings: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduce = useReducedMotion();

  const filterOptions = [
    { value: "surah" as const, label: "Surah" },
    { value: "juz" as const, label: "Juz" },
    { value: "popular" as const, label: "Popular" },
  ];

  return (
    // pointer-events-none lets clicks land on content in the strips beside
    // the pill; the pill itself re-enables them. Geometry and surface mirror
    // the marketing Nav's compact pill EXACTLY (nav.tsx morph=1 state):
    // 12px top inset, 16px side insets, max(980px, 100% - 300px) width,
    // 18px radius, white/96 fill, white/62 border, blur 24 saturate 170,
    // and the same two-layer shadow.
    <div className="pointer-events-none flex justify-center px-4 pt-3">
      <header
        className="pointer-events-auto w-full rounded-[18px] shadow-[0_2px_4px_rgba(5,14,36,0.06),0_12px_30px_-8px_rgba(5,14,36,0.12)]"
        style={{
          maxWidth: "max(980px, calc(100% - 300px))",
          background: "rgba(255,255,255,0.96)",
          border: "1px solid rgba(255,255,255,0.62)",
          backdropFilter: "blur(24px) saturate(170%)",
          WebkitBackdropFilter: "blur(24px) saturate(170%)",
        }}
      >
        {/* Same inner insets as the marketing pill: 18px left, 12px right */}
        <div className="flex h-14 items-center gap-3 pl-[18px] pr-3 sm:gap-4">
        {/* Brand: same slot as always */}
        <Link
          href="/quran"
          aria-label="Ilm Library Quran"
          className={cx("flex shrink-0 items-center gap-2 rounded-lg", focusRing)}
        >
          <Image
            src="/logo.png"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 rounded-md object-contain"
          />
          <span className="hidden text-[1.05rem] font-bold leading-none tracking-tight text-foreground font-[family-name:var(--font-amiri)] sm:block">
            Ilm Library
          </span>
        </Link>

        {/* The directory search, promoted from the old in-page toolbar. Same
            input id so the "/" shortcut keeps focusing it. */}
        <SearchField
          value={query}
          onChange={onQueryChange}
          placeholder="Search by name, number, or meaning"
          onClear={() => onQueryChange("")}
          inputId="quran-search"
          className="min-w-0 flex-1 sm:max-w-[24rem]"
          hint={
            <kbd className="pointer-events-none hidden h-5 items-center rounded-md border border-border bg-surface px-1.5 text-[10px] font-medium text-muted sm:flex [@media(pointer:coarse)]:hidden">
              /
            </kbd>
          }
        />

        {/* Right: filter + settings (desktop), then the site chrome
            (gap-2.5 matches the marketing right cluster) */}
        <div className="ml-auto flex shrink-0 items-center gap-2.5">
          <div className="hidden items-center gap-2 lg:flex">
            <SegmentedSwitch
              value={filter}
              ariaLabel="Directory filter"
              options={filterOptions}
              onChange={onFilterChange}
            />
            <IconTile label="Reader settings" icon="gear" onClick={onOpenSettings} />
            <span aria-hidden className="h-5 w-px rounded-full bg-border" />
          </div>
          {/* Bookmarks + hamburger close the row: the site-chrome cluster,
              matching the pill treatment the rest of Ilm Library uses. */}
          <Link
            href="/bookmarks"
            className={cx(
              "hidden shrink-0 rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 sm:inline-flex",
              focusRingOnAccent
            )}
          >
            Bookmarks
          </Link>
          <motion.button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            initial={false}
            animate={menuOpen ? "open" : "closed"}
            whileHover={reduce ? undefined : "hover"}
            whileTap={reduce ? undefined : { scale: 0.92 }}
            className="group relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ease-out hover:bg-foreground/10 hover:shadow-[0_6px_16px_-3px_rgba(11,12,11,0.28)] focus-visible:outline-none"
          >
            <span aria-hidden className="relative h-5 w-5">
              {[
                {
                  key: "top",
                  closed: { y: -7, rotate: 0, width: 22, x: 0, opacity: 1 },
                  hover: { y: -7, rotate: 0, width: 22, x: -1, opacity: 1 },
                  open: { y: 0, rotate: 45, width: 22, x: 0, opacity: 1 },
                },
                {
                  key: "middle",
                  closed: { y: 0, rotate: 0, width: 14, x: 8, opacity: 1 },
                  hover: { y: 0, rotate: 0, width: 22, x: 0, opacity: 1 },
                  open: { y: 0, rotate: 0, width: 0, x: 11, opacity: 0 },
                },
                {
                  key: "bottom",
                  closed: { y: 7, rotate: 0, width: 18, x: 4, opacity: 1 },
                  hover: { y: 7, rotate: 0, width: 22, x: 1, opacity: 1 },
                  open: { y: 0, rotate: -45, width: 22, x: 0, opacity: 1 },
                },
              ].map((bar) => (
                <motion.span
                  key={bar.key}
                  variants={{
                    closed: bar.closed,
                    hover: bar.hover,
                    open: bar.open,
                  }}
                  transition={{ type: "spring", stiffness: 430, damping: 30 }}
                  className="absolute left-0 top-1/2 h-[3px] origin-center rounded-full bg-foreground"
                />
              ))}
            </span>
          </motion.button>
        </div>
        </div>

        {/* Below lg the filter + settings get their own slim row inside the
            pill (48px, keeps the search field usable up top). Desktop folds
            them into the bar. */}
        <div className="flex h-12 items-center gap-2 border-t border-border/60 pl-[18px] pr-3 lg:hidden">
          <SegmentedSwitch
            value={filter}
            ariaLabel="Directory filter"
            options={filterOptions}
            onChange={onFilterChange}
            className="flex-1"
          />
          <IconTile label="Reader settings" icon="gear" onClick={onOpenSettings} />
        </div>
      </header>

      <ReaderNavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} zClass="z-[70]" />
    </div>
  );
}
