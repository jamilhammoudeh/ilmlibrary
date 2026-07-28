"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "@/components/reveal";
import { TAJWEED_LEGEND, type TajweedSegment } from "@/lib/quran-tajweed";
import {
  RECITER_CATEGORY_LABELS,
  recitersByCategory,
} from "@/lib/quran-reciter-data";
import { getTafseer, TAFSEERS, type TafseerLanguageCode } from "@/lib/quran-tafseer-data";
import { QuranArabicText } from "./quran-arabic-text";
import {
  FONT_SIZE_STEPS,
  snapFontSize,
  type Ayah,
  type PlacedGlyphWord,
} from "./reader-data";
import { DrawerShell, ReaderIcon, Stepper, ToggleSwitch, cx, focusRing } from "./ui";

export type SettingsSection = "font" | "translation" | "tafsir" | "audio";

const TAFSEER_LANGUAGE_ORDER: TafseerLanguageCode[] = [
  "en",
  "ar",
  "ur",
  "bn",
  "ru",
  "ku",
];

const TAFSEER_LANGUAGE_LABELS: Record<TafseerLanguageCode, string> = {
  en: "English",
  ar: "Arabic",
  ur: "Urdu",
  bn: "Bengali",
  ru: "Russian",
  ku: "Kurdish",
};

// Right glass drawer: every control applies instantly through orchestrator
// state (live preview, no Save button) and persists via the last-state effect.
export function SettingsDrawer({
  open,
  initialSection,
  onClose,
  fontSize,
  onSetFontSize,
  showTajweed,
  onSetShowTajweed,
  tajweedStatus,
  showTranslation,
  onSetShowTranslation,
  showWordTooltips,
  onSetShowWordTooltips,
  tafseerId,
  onSetTafseerId,
  reciterId,
  onSetReciterId,
  previewAyah,
  previewSegments,
  previewGlyphWords,
  previewTranslation,
  onReset,
}: {
  open: boolean;
  initialSection: SettingsSection | null;
  onClose: () => void;
  fontSize: number;
  onSetFontSize: (px: number) => void;
  showTajweed: boolean;
  onSetShowTajweed: (v: boolean) => void;
  tajweedStatus: "idle" | "loading" | "ready" | "error";
  showTranslation: boolean;
  onSetShowTranslation: (v: boolean) => void;
  showWordTooltips: boolean;
  onSetShowWordTooltips: (v: boolean) => void;
  tafseerId: string;
  onSetTafseerId: (id: string) => void;
  reciterId: string;
  onSetReciterId: (id: string) => void;
  previewAyah: Ayah | null;
  previewSegments: TajweedSegment[] | null;
  /** Glyph words for the preview ayah so the preview matches the study cards. */
  previewGlyphWords: PlacedGlyphWord[] | null;
  previewTranslation: string | null;
  onReset: () => void;
}) {
  const [subView, setSubView] = useState<"tafsir" | "audio" | null>(null);
  const reduce = useReducedMotion();
  // Sub-view push direction: +1 drilling in, -1 backing out.
  const [subDir, setSubDir] = useState(1);
  const fontRef = useRef<HTMLDivElement>(null);
  const translationRef = useRef<HTMLDivElement>(null);
  const tafsirRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLDivElement>(null);

  function openSub(view: "tafsir" | "audio") {
    setSubDir(1);
    setSubView(view);
  }

  function closeSub() {
    setSubDir(-1);
    setSubView(null);
  }

  // Reset the sub-list whenever the drawer closes (render-phase state
  // adjustment, per the React "derive state from props" pattern).
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (!open) setSubView(null);
  }

  useEffect(() => {
    if (!open || !initialSection) return;
    const timeout = window.setTimeout(() => {
      const target =
        initialSection === "font"
          ? fontRef.current
          : initialSection === "translation"
            ? translationRef.current
            : initialSection === "tafsir"
              ? tafsirRef.current
              : audioRef.current;
      target?.scrollIntoView({ block: "start" });
    }, 60);
    return () => window.clearTimeout(timeout);
  }, [open, initialSection]);

  const selectedTafseer = getTafseer(tafseerId);
  const reciterGroups = recitersByCategory({ includeHidden: true });
  const selectedReciter = reciterGroups
    .flatMap((group) => group.reciters)
    .find((item) => item.id === reciterId);

  return (
    <DrawerShell
      open={open}
      onClose={onClose}
      title="Settings"
      widthClass="w-[min(92vw,400px)]"
    >
      <AnimatePresence mode="popLayout" initial={false} custom={subDir}>
        <motion.div
          key={subView ?? "main"}
          custom={subDir}
          variants={{
            enter: (dir: number) => ({ opacity: 0, x: 24 * dir }),
            center: { opacity: 1, x: 0 },
            exit: (dir: number) => ({ opacity: 0, x: -24 * dir }),
          }}
          initial={reduce ? false : "enter"}
          animate={reduce ? undefined : "center"}
          exit={reduce ? undefined : "exit"}
          transition={{ duration: 0.25, ease: EASE }}
        >
      {subView === "tafsir" ? (
        <SubListHeader title="Tafsir source" onBack={closeSub}>
          {TAFSEER_LANGUAGE_ORDER.map((language) => {
            const group = TAFSEERS.filter((item) => item.language === language);
            if (group.length === 0) return null;
            return (
              <div key={language} className="mb-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-paper-meta">
                  {TAFSEER_LANGUAGE_LABELS[language]}
                </div>
                {group.map((item) => {
                  const selected = item.id === tafseerId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => onSetTafseerId(item.id)}
                      className={cx(
                        "mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-surface-deep/60",
                        focusRing,
                        selected && "bg-accent-soft text-accent-soft-text"
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block truncate">{item.name}</span>
                        <span className="block truncate text-xs font-normal text-muted">
                          {item.fullName}
                        </span>
                      </span>
                      {selected ? <ReaderIcon name="check" className="h-4 w-4 shrink-0" /> : null}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </SubListHeader>
      ) : subView === "audio" ? (
        <SubListHeader title="Reciter" onBack={closeSub}>
          {reciterGroups.map((group) => (
            <div key={group.category} className="mb-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-paper-meta">
                {RECITER_CATEGORY_LABELS[group.category]}
              </div>
              {group.reciters.map((item) => {
                const selected = item.id === reciterId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => onSetReciterId(item.id)}
                    className={cx(
                      "mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-surface-deep/60",
                      focusRing,
                      selected && "bg-accent-soft text-accent-soft-text"
                    )}
                  >
                    <span className="truncate">
                      {item.nameEnglish} : {item.bitrate}kbps
                    </span>
                    {selected ? <ReaderIcon name="check" className="h-4 w-4 shrink-0" /> : null}
                  </button>
                );
              })}
            </div>
          ))}
        </SubListHeader>
      ) : (
        <>
          {/* Quran Font */}
          <div ref={fontRef}>
            <SectionLabel>Quran Font</SectionLabel>
            {previewAyah ? (
              <div className="rounded-xl bg-paper p-4">
                <QuranArabicText
                  ayah={previewAyah}
                  fontSize={fontSize}
                  showTajweed={showTajweed}
                  tajweedSegments={previewSegments}
                  glyphWords={previewGlyphWords}
                />
                {showTranslation && previewTranslation ? (
                  <p className="mt-2 text-xs leading-5 text-muted">{previewTranslation}</p>
                ) : null}
              </div>
            ) : null}
            <div className="mt-4">
              <Stepper
                value={snapFontSize(fontSize)}
                steps={FONT_SIZE_STEPS}
                onChange={onSetFontSize}
                formatLabel={(value) => `${value} px`}
                decreaseLabel="Smaller Arabic text"
                increaseLabel="Larger Arabic text"
              />
            </div>
            <div className="mt-4">
              <ToggleSwitch
                label="Tajweed colors"
                checked={showTajweed}
                onChange={onSetShowTajweed}
              />
              {showTajweed ? (
                <>
                  <p className="text-xs text-muted">
                    {tajweedStatus === "loading"
                      ? "Loading colors..."
                      : tajweedStatus === "error"
                        ? "Could not load colors, showing plain text"
                        : "Colors ready"}
                  </p>
                  <p className="text-xs text-muted">
                    Tajweed colors use the standard text font.
                  </p>
                  <div className="mt-3 grid gap-1.5">
                    {TAJWEED_LEGEND.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center gap-2 text-xs font-semibold text-foreground"
                      >
                        <span
                          className="h-3 w-3 rounded-sm"
                          style={{ backgroundColor: entry.color }}
                        />
                        {entry.label}
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* Translation */}
          <div ref={translationRef} className="mt-5 border-t border-border pt-5">
            <SectionLabel>Translation</SectionLabel>
            <ToggleSwitch
              label="Show translation"
              checked={showTranslation}
              onChange={onSetShowTranslation}
            />
            <div className="mt-2">
              <ToggleSwitch
                label="Word meanings on hover"
                checked={showWordTooltips}
                onChange={onSetShowWordTooltips}
              />
              <p className="text-xs text-muted">
                Hover any word in the mushaf to see its meaning. Desktop only.
              </p>
            </div>
            <div className="mt-3 rounded-xl bg-surface p-3">
              <div className="text-sm font-semibold text-foreground">Saheeh International</div>
              <div className="text-xs text-muted">English</div>
              <p className="mt-2 text-xs leading-5 text-muted">
                Word-by-word translation: Dr. Shehnaz Shaikh and Ms. Kausar Khatri,
                via QUL / Quran.com.
              </p>
            </div>
          </div>

          {/* Tafsir */}
          <div ref={tafsirRef} className="mt-5 border-t border-border pt-5">
            <SectionLabel>Tafsir</SectionLabel>
            <SummaryCard
              title={selectedTafseer?.fullName ?? "Tafsir"}
              subtitle={selectedTafseer?.languageName ?? ""}
              onClick={() => openSub("tafsir")}
            />
          </div>

          {/* Audio */}
          <div ref={audioRef} className="mt-5 border-t border-border pt-5">
            <SectionLabel>Audio</SectionLabel>
            <SummaryCard
              title={selectedReciter?.nameEnglish ?? "Reciter"}
              subtitle={selectedReciter ? `${selectedReciter.bitrate}kbps` : ""}
              onClick={() => openSub("audio")}
            />
          </div>

          {/* Reset */}
          <div className="mt-5 border-t border-border pt-5">
            <button
              type="button"
              onClick={onReset}
              className={cx(
                "h-10 w-full rounded-full border border-border bg-surface text-sm font-semibold text-rose transition-colors hover:bg-rose/5",
                focusRing
              )}
            >
              Reset settings
            </button>
          </div>
        </>
      )}
        </motion.div>
      </AnimatePresence>
    </DrawerShell>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-paper-meta">
      {children}
    </div>
  );
}

function SummaryCard({
  title,
  subtitle,
  onClick,
}: {
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "flex w-full items-center justify-between gap-3 rounded-xl bg-surface p-3 text-left transition-colors hover:bg-surface-deep/40",
        focusRing
      )}
    >
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-foreground">{title}</span>
        <span className="block truncate text-xs text-muted">{subtitle}</span>
      </span>
      <ReaderIcon name="chevron-right" className="h-4 w-4 shrink-0 text-muted" />
    </button>
  );
}

function SubListHeader({
  title,
  onBack,
  children,
}: {
  title: string;
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <button
          type="button"
          aria-label="Back to settings"
          onClick={onBack}
          className={cx(
            "flex h-8 w-8 items-center justify-center rounded-full bg-surface/70 text-foreground transition-colors hover:bg-surface-deep/60",
            focusRing
          )}
        >
          <ReaderIcon name="chevron-left" className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold text-foreground">{title}</span>
      </div>
      {children}
    </div>
  );
}
