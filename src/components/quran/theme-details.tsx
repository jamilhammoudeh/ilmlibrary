"use client";

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "@/components/reveal";
import {
  cleanThematicTopicText,
  formatSurahSectionRange,
  getSurahSectionTitle,
  getThematicTopicColorGuideItem,
  isArabicText,
  type SurahSection,
  type ThematicData,
  type ThematicTopic,
} from "@/lib/quran-thematic";
import { useBodyScrollLock, useIsDesktop } from "./hooks";
import {
  BottomSheetShell,
  EXIT_EASE,
  ReaderIcon,
  cx,
  focusRing,
  focusRingOnAccent,
} from "./ui";

export type ThemeDataStatus = "idle" | "loading" | "ready" | "error";

// What the details surface is describing: a topic, a section, or "whatever
// themes this ayah carries" (resolved lazily so the per-ayah entry works even
// before the dataset has loaded).
export type ThemeDetailsTarget =
  | { kind: "topic"; topicId: string }
  | { kind: "section"; sectionId: string }
  | { kind: "ayah"; ayahId: string };

const SECTION_EXPLAINER =
  "This highlight groups the ayahs around this idea so you can read or memorize them as one connected section.";

type ResolvedDetails =
  | { kind: "topic"; topic: ThematicTopic }
  | { kind: "section"; section: SurahSection }
  | {
      kind: "ayah";
      ayahId: string;
      section: SurahSection | null;
      topics: ThematicTopic[];
    };

function resolveDetails(
  target: ThemeDetailsTarget,
  data: ThematicData,
  activeSectionIds: readonly string[]
): ResolvedDetails | null {
  if (target.kind === "topic") {
    const topic = data.topics.topic(target.topicId);
    return topic ? { kind: "topic", topic } : null;
  }
  if (target.kind === "section") {
    const section = data.sections.section(target.sectionId);
    return section ? { kind: "section", section } : null;
  }
  // Per-ayah discovery: the winning selected section first, then the primary
  // (nearest-fallback) section, plus this ayah's topics sorted most-specific
  // first (ayahCount ascending) so "Story of Talut" beats "Belief".
  const section =
    (activeSectionIds.length > 0
      ? data.sections.matchingSectionForAyah(target.ayahId, activeSectionIds)
      : null) ?? data.sections.primarySectionForAyah(target.ayahId);
  const topics = [...data.topics.topicsForAyah(target.ayahId)]
    .sort(
      (a, b) => a.ayahCount - b.ayahCount || a.name.localeCompare(b.name)
    )
    .slice(0, 8);
  return { kind: "ayah", ayahId: target.ayahId, section, topics };
}

// One component, two presentations: a centered dialog on desktop, a bottom
// sheet on mobile. z-[80] so it beats the z-[60] ThemesPanel.
export function ThemeDetails({
  target,
  onClose,
  data,
  status,
  onRetry,
  activeTopicId,
  activeSectionIds,
  allSections,
  onActivateTopic,
  onToggleSection,
}: {
  target: ThemeDetailsTarget | null;
  onClose: () => void;
  data: ThematicData | null;
  status: ThemeDataStatus;
  onRetry: () => void;
  activeTopicId: string | null;
  activeSectionIds: string[];
  allSections: boolean;
  onActivateTopic: (topicId: string) => void;
  onToggleSection: (sectionId: string) => void;
}) {
  const isDesktop = useIsDesktop();
  const reduce = useReducedMotion();
  const open = target !== null;
  useBodyScrollLock(open && isDesktop);

  // Topmost-layer Escape in the capture phase (the OverflowPopover
  // convention) so the orchestrator's bubble-phase chain never sees it.
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    }
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, onClose]);

  const resolved = data && target ? resolveDetails(target, data, activeSectionIds) : null;

  let body: ReactNode = null;
  if (target) {
    if (status === "error") {
      body = (
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">Theme details</h2>
          <p className="mt-2 text-sm text-muted">Could not load themes right now.</p>
          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onRetry}
              className={cx(
                "h-9 rounded-full border border-border bg-surface px-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-deep/60",
                focusRing
              )}
            >
              Retry
            </button>
            <CloseButton onClose={onClose} />
          </div>
        </div>
      );
    } else if (!data) {
      body = (
        <div>
          <div className="space-y-2" aria-hidden>
            <div className="h-6 w-2/3 animate-pulse rounded-lg bg-surface-deep/60" />
            <div className="h-16 w-full animate-pulse rounded-xl bg-surface-deep/60" />
            <div className="h-24 w-full animate-pulse rounded-xl bg-surface-deep/60" />
          </div>
          <p className="mt-3 text-xs text-muted">Loading themes...</p>
        </div>
      );
    } else if (!resolved) {
      body = (
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">Theme details</h2>
          <p className="mt-2 text-sm text-muted">No theme details available.</p>
          <div className="mt-5 flex items-center justify-end">
            <CloseButton onClose={onClose} />
          </div>
        </div>
      );
    } else if (resolved.kind === "topic") {
      body = (
        <TopicDetails
          topic={resolved.topic}
          isActive={activeTopicId === resolved.topic.id}
          onHighlight={() => onActivateTopic(resolved.topic.id)}
          onClose={onClose}
        />
      );
    } else if (resolved.kind === "section") {
      body = (
        <SectionDetails
          data={data}
          section={resolved.section}
          isActive={allSections || activeSectionIds.includes(resolved.section.id)}
          onHighlight={() => onToggleSection(resolved.section.id)}
          onClose={onClose}
        />
      );
    } else {
      body = (
        <AyahDetails
          data={data}
          resolved={resolved}
          activeTopicId={activeTopicId}
          activeSectionIds={activeSectionIds}
          allSections={allSections}
          onActivateTopic={onActivateTopic}
          onToggleSection={onToggleSection}
          onClose={onClose}
        />
      );
    }
  }

  if (isDesktop) {
    return (
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[80]"
            initial={false}
            exit={{ pointerEvents: "none" }}
          >
            <motion.div
              onClick={onClose}
              className="absolute inset-0 bg-night/40 backdrop-blur-sm"
              initial={reduce ? false : { opacity: 0 }}
              animate={reduce ? undefined : { opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            />
            <div className="pointer-events-none absolute inset-0 grid place-items-center p-4">
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Theme details"
                className="thin-scrollbar pointer-events-auto max-h-[min(80vh,40rem)] w-[min(92vw,400px)] overflow-y-auto rounded-xl border border-border bg-[var(--glass-paper-strong)] p-5 shadow-[0_18px_50px_-12px_rgba(30,24,18,0.28)] backdrop-blur-xl"
                initial={reduce ? false : { opacity: 0, y: 8, scale: 0.98 }}
                animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
                exit={
                  reduce
                    ? undefined
                    : {
                        opacity: 0,
                        y: 8,
                        scale: 0.98,
                        transition: { duration: 0.18, ease: EXIT_EASE },
                      }
                }
                transition={{ duration: 0.24, ease: EASE }}
              >
                {body}
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  }

  return (
    <BottomSheetShell
      open={open}
      onClose={onClose}
      zClass="z-[80]"
      maxHeightClass="max-h-[60svh]"
      ariaLabel="Theme details"
    >
      <div className="px-5 pb-6 pt-2">{body}</div>
    </BottomSheetShell>
  );
}

function DetailsTitle({ text }: { text: string }) {
  return (
    <h2
      dir="auto"
      className={cx(
        "font-display text-lg font-semibold text-foreground",
        isArabicText(text) && "font-arabic"
      )}
    >
      {text}
    </h2>
  );
}

function GuideStrip({
  color,
  title,
  description,
}: {
  color: string;
  title: string;
  description: string;
}) {
  return (
    <div
      className="mt-3 flex items-start gap-2.5 rounded-lg p-3"
      style={{ backgroundColor: `${color}14` }}
    >
      <span
        aria-hidden
        className="mt-1 h-1 w-6 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      <div className="min-w-0">
        <div className="text-xs font-semibold text-foreground">{title}</div>
        <div className="mt-0.5 text-xs leading-4 text-muted">{description}</div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-paper-meta">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm leading-6 text-foreground-soft">{value}</dd>
    </div>
  );
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      className={cx(
        "h-9 rounded-full border border-border bg-surface px-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-deep/60",
        focusRing
      )}
    >
      Close
    </button>
  );
}

function FooterButtons({
  isActive,
  onHighlight,
  onClose,
}: {
  isActive: boolean;
  onHighlight: () => void;
  onClose: () => void;
}) {
  return (
    <div className="mt-5 flex items-center justify-end gap-2">
      {!isActive ? (
        <button
          type="button"
          onClick={onHighlight}
          className={cx(
            "h-9 rounded-full bg-primary px-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85",
            focusRingOnAccent
          )}
        >
          Highlight this
        </button>
      ) : null}
      <CloseButton onClose={onClose} />
    </div>
  );
}

function TopicDetails({
  topic,
  isActive,
  onHighlight,
  onClose,
}: {
  topic: ThematicTopic;
  isActive: boolean;
  onHighlight: () => void;
  onClose: () => void;
}) {
  const guide = getThematicTopicColorGuideItem(topic);
  return (
    <div>
      <DetailsTitle text={cleanThematicTopicText(topic.name)} />
      <GuideStrip color={guide.color} title={guide.title} description={guide.description} />
      <dl className="mt-4 space-y-3">
        <DetailRow
          label="What it is about"
          value={cleanThematicTopicText(topic.description) || "No description available."}
        />
        <DetailRow label="Verses in theme" value={String(topic.ayahCount)} />
        <DetailRow label="Category" value={cleanThematicTopicText(topic.category)} />
        <DetailRow label="Domain" value={cleanThematicTopicText(topic.domain)} />
      </dl>
      <FooterButtons isActive={isActive} onHighlight={onHighlight} onClose={onClose} />
    </div>
  );
}

function SectionDetails({
  data,
  section,
  isActive,
  onHighlight,
  onClose,
}: {
  data: ThematicData;
  section: SurahSection;
  isActive: boolean;
  onHighlight: () => void;
  onClose: () => void;
}) {
  const guide = data.sections.sectionColorGuideItem(section);
  const plural = section.ayahCount === 1 ? "ayah" : "ayahs";
  return (
    <div>
      <DetailsTitle text={getSurahSectionTitle(section)} />
      <GuideStrip color={guide.color} title={guide.title} description={guide.description} />
      <dl className="mt-4 space-y-3">
        <DetailRow
          label="Ayahs"
          value={`${formatSurahSectionRange(section)} : ${section.ayahCount} ${plural} in this section.`}
        />
        <DetailRow label="What it is about" value={SECTION_EXPLAINER} />
      </dl>
      <FooterButtons isActive={isActive} onHighlight={onHighlight} onClose={onClose} />
    </div>
  );
}

function AyahDetails({
  data,
  resolved,
  activeTopicId,
  activeSectionIds,
  allSections,
  onActivateTopic,
  onToggleSection,
  onClose,
}: {
  data: ThematicData;
  resolved: Extract<ResolvedDetails, { kind: "ayah" }>;
  activeTopicId: string | null;
  activeSectionIds: string[];
  allSections: boolean;
  onActivateTopic: (topicId: string) => void;
  onToggleSection: (sectionId: string) => void;
  onClose: () => void;
}) {
  const { ayahId, section, topics } = resolved;
  const sectionActive = section
    ? allSections || activeSectionIds.includes(section.id)
    : false;
  const sectionGuide = section ? data.sections.sectionColorGuideItem(section) : null;
  const sectionTitle = section ? getSurahSectionTitle(section) : "";

  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-foreground">
        Themes in {ayahId}
      </h2>

      {section && sectionGuide ? (
        <div className="mt-3">
          <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-paper-meta">
            Section
          </div>
          <div
            className="mt-2 rounded-xl p-3"
            style={{
              backgroundColor: `${sectionGuide.color}18`,
            }}
          >
            <div className="text-[11px] font-bold uppercase tracking-wide text-foreground-soft">
              {formatSurahSectionRange(section)}
            </div>
            <div
              dir="auto"
              className={cx(
                "mt-0.5 text-sm font-semibold text-foreground",
                isArabicText(sectionTitle) && "font-arabic"
              )}
            >
              {sectionTitle}
            </div>
            <div className="mt-0.5 text-xs text-muted">
              {section.ayahCount} {section.ayahCount === 1 ? "ayah" : "ayahs"} : {sectionGuide.title}
            </div>
            <div className="mt-2">
              {sectionActive ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground-soft">
                  <ReaderIcon name="check" className="h-3.5 w-3.5" />
                  Highlighted
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onToggleSection(section.id)}
                  className={cx(
                    "h-8 rounded-full bg-primary px-3 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/85",
                    focusRingOnAccent
                  )}
                >
                  Highlight this
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {topics.length > 0 ? (
        <div className="mt-4">
          <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-paper-meta">
            Topics in this ayah
          </div>
          <div className="mt-2 space-y-1">
            {topics.map((topic) => {
              const color = getThematicTopicColorGuideItem(topic).color;
              const active = activeTopicId === topic.id;
              const plural = topic.ayahCount === 1 ? "ayah" : "ayahs";
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => onActivateTopic(topic.id)}
                  className={cx(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                    !active && "hover:bg-surface-deep/60"
                  )}
                  style={active ? { backgroundColor: `${color}24` } : undefined}
                >
                  <span
                    aria-hidden
                    className="h-3 w-3 shrink-0 rounded-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                    {cleanThematicTopicText(topic.name)}
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-muted">
                    {topic.ayahCount} {plural}
                  </span>
                  {active ? (
                    <ReaderIcon name="check" className="h-4 w-4 shrink-0 text-foreground" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {!section && topics.length === 0 ? (
        <p className="mt-3 text-sm text-muted">No themes found for this ayah.</p>
      ) : null}

      <div className="mt-5 flex items-center justify-end">
        <CloseButton onClose={onClose} />
      </div>
    </div>
  );
}
