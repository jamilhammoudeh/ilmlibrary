"use client";

import { stripUnrenderableMarks } from "@/lib/quran-tajweed";
import type { Ayah, SmartQueryResult } from "./reader-data";
import { DrawerShell, SearchField, cx, focusRing } from "./ui";

export type SearchResultItem = {
  ayah: Ayah;
  surahName: string;
  translationText: string | null;
};

const RESULT_CAP = 80;

// Right drawer over the reader: the existing 80-cap ayah search engine plus
// smart "2:255" / bare-number navigation rows. Closing never clears the
// query; the field's X does.
export function SearchDrawer({
  open,
  query,
  onSetQuery,
  onClose,
  results,
  smart,
  smartSurahName,
  onGoToVerse,
  onGoToSurah,
  onGoToJuz,
  onGoToPage,
  onSelectResult,
}: {
  open: boolean;
  query: string;
  onSetQuery: (q: string) => void;
  onClose: () => void;
  results: SearchResultItem[];
  smart: SmartQueryResult;
  smartSurahName: string | null;
  onGoToVerse: (surahId: number, ayahNumber: number) => void;
  onGoToSurah: (surahId: number) => void;
  onGoToJuz: (juz: number) => void;
  onGoToPage: (page: number) => void;
  onSelectResult: (ayah: Ayah) => void;
}) {
  const trimmed = query.trim();
  const active = trimmed.length >= 2;

  return (
    <DrawerShell
      open={open}
      onClose={onClose}
      title="Search"
      widthClass="w-[min(92vw,440px)]"
      headerExtra={
        <div className="min-w-0 flex-1">
          <SearchField
            value={query}
            onChange={onSetQuery}
            placeholder="Search ayah text, translations, or surah names"
            autoFocus
            onClear={() => onSetQuery("")}
            className="h-11"
          />
          <p className="mt-1.5 text-xs text-muted">
            {!active
              ? "Type at least two characters to search every ayah."
              : results.length >= RESULT_CAP
                ? `Showing the first ${RESULT_CAP} results`
                : `${results.length} result${results.length === 1 ? "" : "s"}`}
          </p>
        </div>
      }
    >
      {smart.kind === "verse" && smartSurahName ? (
        <SmartRow
          label={`Go to ${smartSurahName}, Ayah ${smart.ayahNumber}`}
          onClick={() => {
            onGoToVerse(smart.surahId, smart.ayahNumber);
            onClose();
          }}
        />
      ) : null}
      {smart.kind === "number" ? (
        <>
          {smart.value <= 114 && smartSurahName ? (
            <SmartRow
              label={`Go to Surah ${smart.value}: ${smartSurahName}`}
              onClick={() => {
                onGoToSurah(smart.value);
                onClose();
              }}
            />
          ) : null}
          {smart.value <= 30 ? (
            <SmartRow
              label={`Go to Juz ${smart.value}`}
              onClick={() => {
                onGoToJuz(smart.value);
                onClose();
              }}
            />
          ) : null}
          <SmartRow
            label={`Go to Page ${smart.value}`}
            onClick={() => {
              onGoToPage(smart.value);
              onClose();
            }}
          />
        </>
      ) : null}

      {active && results.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">No ayahs found.</p>
      ) : null}

      {results.map((item) => (
        <button
          key={item.ayah.id}
          type="button"
          onClick={() => {
            onSelectResult(item.ayah);
            onClose();
          }}
          className={cx(
            "mb-2 w-full rounded-xl bg-surface p-3 text-left transition-colors hover:bg-surface-deep/40",
            focusRing
          )}
        >
          <span className="flex items-center gap-2">
            <span className="rounded-full bg-background px-1.5 py-0.5 text-xs font-semibold text-muted">
              {item.ayah.id}
            </span>
            <span className="truncate text-xs text-muted">{item.surahName}</span>
          </span>
          {/* Defensive strip: today's corpus has no U+060C/U+061B/U+061F, but
              KFGQPCHafs renders them wrong, so guard against a corpus swap. */}
          <span dir="rtl" className="mt-1 block pt-0.5 font-arabic text-lg leading-[2.1] text-foreground line-clamp-2">
            {stripUnrenderableMarks(item.ayah.textUthmani)}
          </span>
          {item.translationText ? (
            <span className="mt-1 block text-xs leading-5 text-muted line-clamp-2">
              {item.translationText}
            </span>
          ) : null}
        </button>
      ))}
    </DrawerShell>
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
