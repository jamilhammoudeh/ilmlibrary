"use client";

import { useMemo, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  cleanThematicTopicText,
  formatSurahSectionRange,
  getSurahSectionTitle,
  getThematicTopicColorGuideItem,
  isArabicText,
  THEME_COLOR_GUIDE,
  type SurahSection,
  type ThematicData,
  type ThematicTopic,
  type ThemeColorGuideId,
} from "@/lib/quran-thematic";
import { useIsDesktop } from "./hooks";
import type { ThemeDataStatus, ThemeDetailsTarget } from "./theme-details";
import {
  BottomSheetShell,
  DrawerShell,
  IconTile,
  ReaderIcon,
  SearchField,
  ToggleSwitch,
  cx,
  focusRing,
} from "./ui";

// What the panel is scoped to: the visible mushaf page(s) in Reading view,
// the current surah in Translation view.
export type ThemeScope =
  | { kind: "page"; pageLabel: string; scopeName: string; ayahIds: string[] }
  | { kind: "surah"; surahId: number; surahName: string };

const QSAC_FALLBACK_URL =
  "https://github.com/dev-ahmadbilal/quran-semantic-annotation-corpus";

// Shortened web titles for the 7-card color guide grid; descriptions come
// verbatim from the ported guide data.
const GUIDE_WEB_TITLES: Record<ThemeColorGuideId, string> = {
  signs: "Signs of Allah",
  prophets: "Prophets and believers",
  law: "Law and worship",
  stories: "Stories of the prophets",
  quran: "Quran and character",
  afterlife: "The afterlife",
  hell: "Hellfire",
};

type ThemesPanelProps = {
  open: boolean;
  onClose: () => void;
  data: ThematicData | null;
  status: ThemeDataStatus;
  onRetry: () => void;
  scope: ThemeScope;
  activeTopicId: string | null;
  activeSectionIds: string[];
  allSections: boolean;
  onSetAllSections: (on: boolean) => void;
  onToggleSection: (sectionId: string) => void;
  onActivateTopic: (topicId: string) => void;
  onOpenDetails: (target: ThemeDetailsTarget) => void;
};

// Themes picker: a right drawer on desktop, a tall bottom sheet on mobile,
// mirroring the iOS ThematicTopicSheet section-for-section.
export function ThemesPanel(props: ThemesPanelProps) {
  const { open, onClose, scope } = props;
  const isDesktop = useIsDesktop();

  // Transient browse state, reset on EVERY open (ports the iOS open-nonce
  // reset) via a render-phase state adjustment.
  const [query, setQuery] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [guideExpanded, setGuideExpanded] = useState(false);
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setQuery("");
      setSearchExpanded(false);
      setGuideExpanded(false);
      setExpandedDomain(null);
      setExpandedCategory(null);
    }
  }

  const hint =
    scope.kind === "page"
      ? "Pick a story or theme on this page"
      : "Pick a story or theme in this surah";

  const header = (
    <div className="min-w-0">
      <h2 className="font-display text-xl font-semibold text-foreground">Themes</h2>
      <p className="text-xs text-muted">{hint}</p>
    </div>
  );

  const content = (
    <ThemesPanelContent
      {...props}
      isDesktop={isDesktop}
      query={query}
      onSetQuery={setQuery}
      searchExpanded={searchExpanded}
      onSetSearchExpanded={(expanded) => {
        setSearchExpanded(expanded);
        if (!expanded) {
          // Collapsing clears the query and the browse expansion (iOS parity).
          setQuery("");
          setExpandedDomain(null);
          setExpandedCategory(null);
        }
      }}
      guideExpanded={guideExpanded}
      onSetGuideExpanded={setGuideExpanded}
      expandedDomain={expandedDomain}
      onSetExpandedDomain={setExpandedDomain}
      expandedCategory={expandedCategory}
      onSetExpandedCategory={setExpandedCategory}
    />
  );

  return isDesktop ? (
    <DrawerShell
      open={open}
      onClose={onClose}
      title="Themes"
      widthClass="w-[min(92vw,420px)]"
      headerExtra={header}
    >
      {content}
    </DrawerShell>
  ) : (
    <BottomSheetShell
      open={open}
      onClose={onClose}
      zClass="z-[60]"
      maxHeightClass="max-h-[92svh]"
      ariaLabel="Themes"
    >
      <div className="flex items-start justify-between gap-3 px-5 pt-2 pb-3">
        {header}
        <IconTile label="Close themes" icon="x" onClick={onClose} />
      </div>
      <div className="px-5 pb-6">{content}</div>
    </BottomSheetShell>
  );
}

function ThemesPanelContent({
  data,
  status,
  onRetry,
  scope,
  activeTopicId,
  activeSectionIds,
  allSections,
  onSetAllSections,
  onToggleSection,
  onActivateTopic,
  onOpenDetails,
  isDesktop,
  query,
  onSetQuery,
  searchExpanded,
  onSetSearchExpanded,
  guideExpanded,
  onSetGuideExpanded,
  expandedDomain,
  onSetExpandedDomain,
  expandedCategory,
  onSetExpandedCategory,
}: ThemesPanelProps & {
  isDesktop: boolean;
  query: string;
  onSetQuery: (value: string) => void;
  searchExpanded: boolean;
  onSetSearchExpanded: (expanded: boolean) => void;
  guideExpanded: boolean;
  onSetGuideExpanded: (expanded: boolean) => void;
  expandedDomain: string | null;
  onSetExpandedDomain: (domain: string | null) => void;
  expandedCategory: string | null;
  onSetExpandedCategory: (category: string | null) => void;
}) {
  const loading = status === "loading" || status === "idle";
  const errored = status === "error";
  const trimmedQuery = query.trim();
  const searching = searchExpanded && trimmedQuery.length > 0;

  // Sections in scope: page scope counts only the visible ayahs; surah scope
  // lists every section of the surah with its full ayah count.
  const scopedSections = useMemo(() => {
    if (!data) return [];
    if (scope.kind === "page") {
      return data.sections
        .sectionsForAyahs(scope.ayahIds, 40)
        .map((match) => ({ section: match.section, count: match.ayahCountInScope }));
    }
    return data.sections
      .sectionsForSurah(scope.surahId)
      .map((section) => ({ section, count: section.ayahCount }));
  }, [data, scope]);

  const relatedTopics = useMemo(() => {
    if (!data) return [];
    if (scope.kind === "page") {
      return data.topics
        .topicsForAyahs(scope.ayahIds, 18)
        .map((match) => ({ topic: match.topic, count: match.ayahCountInScope }));
    }
    return data.topics
      .topicsForSurah(scope.surahId, 18)
      .map((match) => ({ topic: match.topic, count: match.ayahCountInSurah }));
  }, [data, scope]);

  const searchResults = useMemo(() => {
    if (!data || !searching) return [];
    return data.topics.search(trimmedQuery, 80);
  }, [data, searching, trimmedQuery]);

  const activeTopicName = useMemo(() => {
    const topic = data?.topics.topic(activeTopicId);
    return topic ? cleanThematicTopicText(topic.name) : null;
  }, [data, activeTopicId]);

  const toggleDescription = loading
    ? "Loading themes..."
    : allSections
      ? "All Quran themes"
      : activeSectionIds.length > 0
        ? `${activeSectionIds.length} ${activeSectionIds.length === 1 ? "section" : "sections"} on`
        : activeTopicName
          ? `Theme: ${activeTopicName}`
          : "Color every ayah by its theme";

  const scopeHelper =
    scope.kind === "page"
      ? `Only the ayahs visible on page ${scope.pageLabel}`
      : `All sections in ${scope.surahName}`;

  return (
    <div className="space-y-4">
      {/* A. Master toggle (hidden during search) */}
      {!searching ? (
        <div className="rounded-xl bg-surface p-3">
          <ToggleSwitch
            label="Thematic Highlighting"
            checked={allSections}
            disabled={loading || errored}
            onChange={onSetAllSections}
            description={toggleDescription}
          />
        </div>
      ) : null}

      {/* B. Scoped sections (hidden during search) */}
      {!searching ? (
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.12em] text-paper-meta">
            {scope.kind === "page" ? "Themes on this page" : "Themes in this surah"}
          </div>
          <p className="mt-1 text-xs text-muted">{scopeHelper}</p>

          {errored ? (
            <div className="mt-3 rounded-xl bg-surface p-4 text-center">
              <p className="text-sm text-muted">Could not load themes right now.</p>
              <button
                type="button"
                onClick={onRetry}
                className={cx(
                  "mt-3 h-9 rounded-full border border-border bg-surface px-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-deep/60",
                  focusRing
                )}
              >
                Retry
              </button>
            </div>
          ) : loading || !data ? (
            <div className="mt-3 space-y-2" aria-hidden>
              <div className="h-14 w-full animate-pulse rounded-xl bg-surface-deep/60" />
              <div className="h-14 w-[92%] animate-pulse rounded-xl bg-surface-deep/60" />
              <div className="h-14 w-[84%] animate-pulse rounded-xl bg-surface-deep/60" />
            </div>
          ) : scopedSections.length === 0 ? (
            <p className="mt-3 py-4 text-center text-sm text-muted">
              No sections in this scope.
            </p>
          ) : (
            <div
              role="group"
              aria-label="Sections in scope"
              className="mt-3 space-y-2"
            >
              {scopedSections.map(({ section, count }) => (
                <SectionRow
                  key={section.id}
                  section={section}
                  color={data.sections.sectionAccent(section)}
                  count={count}
                  selected={allSections || activeSectionIds.includes(section.id)}
                  onToggle={() => onToggleSection(section.id)}
                  onInfo={() =>
                    onOpenDetails({ kind: "section", sectionId: section.id })
                  }
                />
              ))}
            </div>
          )}
        </div>
      ) : null}

      {/* C. Search more themes */}
      <ExpanderCard
        title="Search more themes"
        subtitle="Full Quran topic list"
        expanded={searchExpanded}
        disabled={loading || errored}
        onToggle={() => onSetSearchExpanded(!searchExpanded)}
      >
        <SearchField
          value={query}
          onChange={onSetQuery}
          placeholder="Search patience, mercy, Musa..."
          onClear={() => onSetQuery("")}
          autoFocus={isDesktop}
          className="mb-3"
        />

        {data && searching ? (
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.12em] text-paper-meta">
              Search results
            </div>
            {searchResults.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted">No themes found.</p>
            ) : (
              <div className="mt-2 space-y-0.5">
                {searchResults.map((topic) => (
                  <TopicRow
                    key={topic.id}
                    topic={topic}
                    active={activeTopicId === topic.id}
                    onActivate={() => onActivateTopic(topic.id)}
                    onInfo={() => onOpenDetails({ kind: "topic", topicId: topic.id })}
                  />
                ))}
              </div>
            )}
          </div>
        ) : data ? (
          <div className="space-y-4">
            {relatedTopics.length > 0 ? (
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-paper-meta">
                  Related themes
                </div>
                <p className="mt-1 text-xs text-muted">{scopeHelper}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {relatedTopics.map(({ topic, count }) => (
                    <TopicChip
                      key={topic.id}
                      topic={topic}
                      count={count}
                      active={activeTopicId === topic.id}
                      onActivate={() => onActivateTopic(topic.id)}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            <div>
              <div className="text-xs font-bold uppercase tracking-[0.12em] text-paper-meta">
                Browse by domain
              </div>
              <div className="mt-2">
                <DomainAccordion
                  data={data}
                  expandedDomain={expandedDomain}
                  onSetExpandedDomain={onSetExpandedDomain}
                  expandedCategory={expandedCategory}
                  onSetExpandedCategory={onSetExpandedCategory}
                  activeTopicId={activeTopicId}
                  onActivateTopic={onActivateTopic}
                  onOpenDetails={onOpenDetails}
                />
              </div>
            </div>
          </div>
        ) : null}
      </ExpanderCard>

      {/* D. Color meanings (hidden during search) */}
      {!searching ? (
        <ExpanderCard
          title="Color meanings"
          subtitle="Highlight color categories"
          expanded={guideExpanded}
          disabled={loading || errored}
          onToggle={() => onSetGuideExpanded(!guideExpanded)}
        >
          <ColorGuideGrid />
        </ExpanderCard>
      ) : null}

      {/* E. Attribution (CC BY 4.0 attribution is REQUIRED) */}
      <p className="text-[11px] leading-4 text-muted">
        Theme data:{" "}
        <a
          href={data?.topics.source.url || QSAC_FALLBACK_URL}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 transition-colors hover:text-foreground"
        >
          Quran Semantic Annotation Corpus
        </a>{" "}
        (CC BY 4.0) : section data from Quranpedia.
      </p>
    </div>
  );
}

// Pointer affordance for the inline-tinted rows and chips: Tailwind hover
// background classes cannot override an inline backgroundColor, so deepen the
// tint with a translucent inset wash instead (drawn above the fill, below the
// text).
const tintHoverWash =
  "transition-[background-color,border-color,box-shadow] hover:shadow-[inset_0_0_0_999px_rgba(21,24,26,0.05)]";

// The check-disc glyph sits on the solid theme color. The light swatches
// (yellow, orange, green) cannot carry a white glyph on the warm paper
// palette, so pick the glyph color from the swatch's contrast against white.
function swatchGlyphClass(hex: string): string {
  const channel = (offset: number) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  };
  const luminance =
    0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
  const whiteContrast = 1.05 / (luminance + 0.05);
  return whiteContrast >= 3 ? "text-white" : "text-night";
}

// Borderless tinted row; selection is the filled check disc plus the deeper
// tint fill (never a one-edge bar, no stroke). The info affordance is a
// sibling button (long-press is unreliable on web).
function SectionRow({
  section,
  color,
  count,
  selected,
  onToggle,
  onInfo,
}: {
  section: SurahSection;
  color: string;
  count: number;
  selected: boolean;
  onToggle: () => void;
  onInfo: () => void;
}) {
  const title = getSurahSectionTitle(section);
  const plural = count === 1 ? "ayah" : "ayahs";
  return (
    <div
      className={cx(
        "flex min-h-[3.5rem] w-full items-center gap-1 rounded-xl",
        tintHoverWash
      )}
      style={{
        backgroundColor: `${color}${selected ? "36" : "18"}`,
      }}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={selected}
        onClick={onToggle}
        className="flex min-w-0 flex-1 items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      >
        <span className="min-w-0">
          <span className="block text-[11px] font-bold uppercase tracking-wide text-foreground-soft">
            {formatSurahSectionRange(section)}
          </span>
          <span
            dir="auto"
            className={cx(
              "block text-sm font-semibold leading-snug text-foreground line-clamp-2",
              isArabicText(title) && "font-arabic"
            )}
          >
            {title}
          </span>
        </span>
        <span className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-xs tabular-nums text-muted">
            {count} {plural}
          </span>
          {selected ? (
            <span
              className={cx(
                "flex h-6 w-6 items-center justify-center rounded-full",
                swatchGlyphClass(color)
              )}
              style={{ backgroundColor: color }}
            >
              <ReaderIcon name="check" className="h-3.5 w-3.5" />
            </span>
          ) : (
            <span aria-hidden className="h-6 w-6 rounded-full border border-border-strong" />
          )}
        </span>
      </button>
      <button
        type="button"
        aria-label={`About ${title}`}
        onClick={onInfo}
        className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      >
        <ReaderIcon name="info" className="h-4 w-4" />
      </button>
    </div>
  );
}

// Tinted pill chip (borderless; the fill alpha plus check glyph carry the
// active state); tap activates the topic.
function TopicChip({
  topic,
  count,
  active,
  onActivate,
}: {
  topic: ThematicTopic;
  count: number;
  active: boolean;
  onActivate: () => void;
}) {
  const color = getThematicTopicColorGuideItem(topic).color;
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onActivate}
      className={cx(
        "inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
        tintHoverWash
      )}
      style={{
        backgroundColor: `${color}${active ? "2B" : "18"}`,
      }}
    >
      {active ? (
        <ReaderIcon name="check" className="h-3 w-3" />
      ) : (
        <span aria-hidden className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
      )}
      <span className="max-w-[9rem] truncate">{cleanThematicTopicText(topic.name)}</span>
      <span className="text-muted">{count}</span>
    </button>
  );
}

// Flat topic row (browse level 2 + search results). The swatch replaces the
// iOS 4pt edge bar, which is banned on web.
function TopicRow({
  topic,
  active,
  onActivate,
  onInfo,
}: {
  topic: ThematicTopic;
  active: boolean;
  onActivate: () => void;
  onInfo: () => void;
}) {
  const color = getThematicTopicColorGuideItem(topic).color;
  const name = cleanThematicTopicText(topic.name);
  const plural = topic.ayahCount === 1 ? "ayah" : "ayahs";
  return (
    <div
      className="flex w-full items-center gap-1 rounded-lg transition-colors"
      style={active ? { backgroundColor: `${color}24` } : undefined}
    >
      <button
        type="button"
        onClick={onActivate}
        className={cx(
          "flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2.5 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
          !active && "hover:bg-surface-deep/60"
        )}
      >
        <span
          aria-hidden
          className="h-3 w-3 shrink-0 rounded-sm"
          style={{ backgroundColor: color }}
        />
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline gap-2">
            <span className="truncate text-sm font-semibold text-foreground">{name}</span>
            <span className="shrink-0 text-xs tabular-nums text-muted">
              {topic.ayahCount} {plural}
            </span>
          </span>
          <span className="block truncate text-xs text-muted">
            {cleanThematicTopicText(topic.category)}
          </span>
        </span>
        {active ? (
          <ReaderIcon name="check" className="h-4 w-4 shrink-0 text-foreground" />
        ) : null}
      </button>
      <button
        type="button"
        aria-label={`About ${name}`}
        onClick={onInfo}
        className="mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      >
        <ReaderIcon name="info" className="h-4 w-4" />
      </button>
    </div>
  );
}

// Domain > category > topic accordion; one expanded entry per level.
function DomainAccordion({
  data,
  expandedDomain,
  onSetExpandedDomain,
  expandedCategory,
  onSetExpandedCategory,
  activeTopicId,
  onActivateTopic,
  onOpenDetails,
}: {
  data: ThematicData;
  expandedDomain: string | null;
  onSetExpandedDomain: (domain: string | null) => void;
  expandedCategory: string | null;
  onSetExpandedCategory: (category: string | null) => void;
  activeTopicId: string | null;
  onActivateTopic: (topicId: string) => void;
  onOpenDetails: (target: ThemeDetailsTarget) => void;
}) {
  return (
    <div className="space-y-0.5">
      {data.topics.domains.map((domain) => {
        const domainExpanded = expandedDomain === domain.name;
        const domainPlural = domain.topicCount === 1 ? "topic" : "topics";
        return (
          <div key={domain.name}>
            <button
              type="button"
              aria-expanded={domainExpanded}
              onClick={() => {
                onSetExpandedDomain(domainExpanded ? null : domain.name);
                onSetExpandedCategory(null);
              }}
              className="flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-surface-deep/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-soft-text">
                  <ReaderIcon
                    name="chevron-right"
                    className={cx(
                      "h-3.5 w-3.5 transition-transform",
                      domainExpanded && "rotate-90"
                    )}
                  />
                </span>
                <span className="truncate text-sm font-semibold text-foreground">
                  {cleanThematicTopicText(domain.name)}
                </span>
              </span>
              <span className="shrink-0 text-xs text-muted">
                {domain.topicCount} {domainPlural}
              </span>
            </button>

            {domainExpanded
              ? data.topics.categoriesForDomain(domain.name).map((category) => {
                  const categoryExpanded = expandedCategory === category.name;
                  const categoryPlural = category.topicCount === 1 ? "topic" : "topics";
                  return (
                    <div key={category.name} className="pl-6">
                      <button
                        type="button"
                        aria-expanded={categoryExpanded}
                        onClick={() =>
                          onSetExpandedCategory(categoryExpanded ? null : category.name)
                        }
                        className="flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-surface-deep/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <ReaderIcon
                            name="chevron-right"
                            className={cx(
                              "h-3.5 w-3.5 shrink-0 text-muted transition-transform",
                              categoryExpanded && "rotate-90"
                            )}
                          />
                          <span className="truncate text-sm font-semibold text-foreground">
                            {cleanThematicTopicText(category.name)}
                          </span>
                        </span>
                        <span className="shrink-0 text-xs text-muted">
                          {category.topicCount} {categoryPlural}
                        </span>
                      </button>
                      {categoryExpanded ? (
                        <div className="pl-2">
                          {data.topics
                            .topicsForCategory(domain.name, category.name)
                            .map((topic) => (
                              <TopicRow
                                key={topic.id}
                                topic={topic}
                                active={activeTopicId === topic.id}
                                onActivate={() => onActivateTopic(topic.id)}
                                onInfo={() =>
                                  onOpenDetails({ kind: "topic", topicId: topic.id })
                                }
                              />
                            ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })
              : null}
          </div>
        );
      })}
    </div>
  );
}

// Purely informational 2-column grid of the 7 guide colors. The swatch is a
// freestanding bar inside the card, not an edge accent.
function ColorGuideGrid() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {THEME_COLOR_GUIDE.map((item) => (
        <div
          key={item.id}
          className="min-h-[5.5rem] rounded-xl p-3"
          style={{
            backgroundColor: `${item.color}14`,
          }}
        >
          <span
            aria-hidden
            className="block h-1 w-6 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <div className="mt-2 text-xs font-semibold text-foreground">
            {GUIDE_WEB_TITLES[item.id]}
          </div>
          <div className="mt-1 text-[11px] leading-4 text-muted line-clamp-3">
            {item.description}
          </div>
        </div>
      ))}
    </div>
  );
}

// SummaryCard-style disclosure with the context-bar chevron spring.
function ExpanderCard({
  title,
  subtitle,
  expanded,
  disabled = false,
  onToggle,
  children,
}: {
  title: string;
  subtitle: string;
  expanded: boolean;
  disabled?: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <div>
      <button
        type="button"
        aria-expanded={expanded}
        disabled={disabled}
        onClick={onToggle}
        className={cx(
          "flex w-full items-center justify-between gap-3 rounded-xl bg-surface p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
          disabled ? "cursor-default opacity-40" : "hover:bg-surface-deep/40"
        )}
      >
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-foreground">{title}</span>
          <span className="block truncate text-xs text-muted">{subtitle}</span>
        </span>
        <motion.span
          aria-hidden
          animate={reduce ? undefined : { rotate: expanded ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 430, damping: 30 }}
          className="shrink-0"
        >
          <ReaderIcon name="chevron-right" className="h-4 w-4 text-muted" />
        </motion.span>
      </button>
      {expanded ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}
