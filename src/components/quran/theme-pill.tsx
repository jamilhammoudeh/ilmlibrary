"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "@/components/reveal";
import { THEME_COLOR_GUIDE } from "@/lib/quran-thematic";
import { EXIT_EASE, ReaderIcon, cx } from "./ui";

// What the active-theme pill needs to render; built by the orchestrator from
// the highlight state + (when loaded) the dataset. Colors and titles fall
// back gracefully while the dataset is still downloading.
export type ActiveThemePillModel =
  | { kind: "topic"; label: string; color: string | null }
  | { kind: "all" }
  | {
      kind: "sections";
      chips: Array<{ id: string; label: string; color: string | null }>;
    };

const PILL_SURFACE =
  "pointer-events-auto flex h-9 items-center gap-1 rounded-xl border border-border bg-[var(--glass-paper-strong)] shadow-[0_2px_4px_rgba(30,24,18,0.06),0_12px_30px_-8px_rgba(30,24,18,0.12)] backdrop-blur-xl";

const CLEAR_BUTTON_CLASS =
  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-deep/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50";

// Compact status pill that hangs below the header stack while highlighting
// is active: names the selection, reopens the panel, and clears. In section
// mode each selection gets its own chip with an individual x (clearing
// everything at once would be lossy); 4+ selections collapse to two chips
// plus a "+{n} more" overflow chip that opens the panel.
export function ActiveThemePill({
  model,
  onOpenPanel,
  onClearAll,
  onRemoveSection,
}: {
  model: ActiveThemePillModel | null;
  onOpenPanel: () => void;
  onClearAll: () => void;
  onRemoveSection: (sectionId: string) => void;
}) {
  const reduce = useReducedMotion();

  let content: ReactNode = null;
  if (model?.kind === "topic" || model?.kind === "all") {
    const label = model.kind === "all" ? "All Quran themes" : model.label;
    content = (
      <div className={cx(PILL_SURFACE, "px-1.5")}>
        <button
          type="button"
          aria-label={`Themes: ${label}. Open themes panel`}
          onClick={onOpenPanel}
          className="flex min-w-0 items-center gap-2 rounded-lg px-1.5 py-1 text-sm font-semibold text-foreground transition-colors hover:bg-surface-deep/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          {model.kind === "all" ? (
            <span aria-hidden className="flex h-3 w-7 shrink-0 overflow-hidden rounded-sm">
              {THEME_COLOR_GUIDE.map((item) => (
                <span
                  key={item.id}
                  className="h-full flex-1"
                  style={{ backgroundColor: item.color }}
                />
              ))}
            </span>
          ) : (
            <span
              aria-hidden
              className="h-3 w-3 shrink-0 rounded-sm"
              style={{ backgroundColor: model.color ?? "var(--border-strong)" }}
            />
          )}
          <span className="max-w-[14rem] truncate">{label}</span>
        </button>
        <button
          type="button"
          aria-label="Turn off highlighting"
          onClick={onClearAll}
          className={CLEAR_BUTTON_CLASS}
        >
          <ReaderIcon name="x" className="h-4 w-4" />
        </button>
      </div>
    );
  } else if (model?.kind === "sections" && model.chips.length > 0) {
    const overflow = model.chips.length > 3;
    const shown = overflow ? model.chips.slice(0, 2) : model.chips;
    const moreCount = model.chips.length - shown.length;
    const single = model.chips.length === 1;
    content = (
      <>
        {shown.map((chip) => (
          <div key={chip.id} className={cx(PILL_SURFACE, "px-1.5")}>
            <button
              type="button"
              aria-label={`Themes: ${chip.label}. Open themes panel`}
              onClick={onOpenPanel}
              className="flex min-w-0 items-center gap-2 rounded-lg px-1.5 py-1 text-sm font-semibold text-foreground transition-colors hover:bg-surface-deep/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              <span
                aria-hidden
                className="h-3 w-3 shrink-0 rounded-sm"
                style={{ backgroundColor: chip.color ?? "var(--border-strong)" }}
              />
              <span
                dir="auto"
                className={cx("truncate", single ? "max-w-[14rem]" : "max-w-[8rem]")}
              >
                {chip.label}
              </span>
            </button>
            <button
              type="button"
              aria-label={single ? "Turn off highlighting" : `Turn off ${chip.label}`}
              onClick={() => onRemoveSection(chip.id)}
              className={CLEAR_BUTTON_CLASS}
            >
              <ReaderIcon name="x" className="h-4 w-4" />
            </button>
          </div>
        ))}
        {moreCount > 0 ? (
          <div className={cx(PILL_SURFACE, "px-1.5")}>
            <button
              type="button"
              aria-label={`${moreCount} more themes. Open themes panel`}
              onClick={onOpenPanel}
              className="rounded-lg px-2 py-1 text-sm font-semibold text-foreground transition-colors hover:bg-surface-deep/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              +{moreCount} more
            </button>
          </div>
        ) : null}
      </>
    );
  }

  return (
    <AnimatePresence>
      {content ? (
        <motion.div
          key="active-theme-pill"
          className="pointer-events-none flex justify-center px-3 pt-2"
          initial={reduce ? false : { opacity: 0, y: -6 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          exit={
            reduce
              ? undefined
              : { opacity: 0, y: -6, transition: { duration: 0.18, ease: EXIT_EASE } }
          }
          transition={{ duration: 0.22, ease: EASE }}
        >
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {content}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
