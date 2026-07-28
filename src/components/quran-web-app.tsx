"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { useReducedMotion } from "motion/react";
import {
  fetchSurahTajweed,
  getDisplayAyahText,
  getDisplayTajweedSegments,
  type TajweedSegment,
} from "@/lib/quran-tajweed";
import { ayahAudioUrl, RECITERS } from "@/lib/quran-reciter-data";
import { markSurahRead } from "@/lib/quran";
import { saveQuranBookmark } from "@/lib/quran-bookmark";
import { fetchSurahWbw, wbwStorageKey, type WbwWord } from "@/lib/quran-wbw";
import {
  DEFAULT_TAFSEER_ID,
  getTafseer,
  type TafseerMap,
} from "@/lib/quran-tafseer-data";
import {
  cleanThematicTopicText,
  getSurahSectionTitle,
  getThematicTopicColorGuideItem,
  getThemeHighlightTint,
  loadThematicData,
  type ThematicData,
} from "@/lib/quran-thematic";
import {
  BOOKMARKS_KEY,
  buildHizbIndex,
  buildMushafLayout,
  LAST_STATE_KEY,
  PAGE_BOOKMARKS_KEY,
  parseSmartQuery,
  parseVerseKey,
  restoreSavedReaderState,
  SECTION_ID_PATTERN,
  THEMATIC_KEY,
  TOPIC_ID_PATTERN,
  TOTAL_MUSHAF_PAGES,
  type Ayah,
  type AyahActionContext,
  type AyahContextMenuState,
  type BuiltMushafLayout,
  type MushafLayoutStatus,
  type RawMushafLayout,
  type ReaderView,
  type SavedReaderState,
  type SavedThematicState,
  type Surah,
  type Translation,
} from "@/components/quran/reader-data";
import { MushafLayoutNotice, QPC_SOURCE_FONT_SIZE } from "@/components/quran/qpc-page";
import {
  AUDIO_FOLLOW_RECENCY_MS,
  fullTierPages,
  type PendingScrollTarget,
} from "@/components/quran/river-geometry";
import { MushafRiver, type MushafRiverHandle } from "@/components/quran/mushaf-river";
import { MushafWordTooltip } from "@/components/quran/word-tooltip";
import { ProgressRail } from "@/components/quran/progress-rail";
import { useHeaderAutoHide } from "@/components/quran/hooks";
import { cx } from "@/components/quran/ui";
import { ReaderSiteNav } from "@/components/quran/reader-site-nav";
import {
  MobileViewTabs,
  ReaderChromeBar,
} from "@/components/quran/reader-context-bar";
import { JumpPanel, type JumpTab, type JuzStart } from "@/components/quran/jump-panel";
import {
  SettingsDrawer,
  type SettingsSection,
} from "@/components/quran/settings-drawer";
import { SearchDrawer, type SearchResultItem } from "@/components/quran/search-drawer";
import { AudioBar } from "@/components/quran/audio-bar";
import { EndOfSurahControls, SurahHeader } from "@/components/quran/surah-header";
import { TranslationCell } from "@/components/quran/translation-cell";
import {
  AyahActionSheet,
  AyahContextMenu,
  SelectedAyahToolbar,
} from "@/components/quran/ayah-menu";
import { BrowseLanding } from "@/components/quran/browse-landing";
import { ReaderToast } from "@/components/quran/reader-toast";
import { ThemesPanel, type ThemeScope } from "@/components/quran/themes-panel";
import {
  ThemeDetails,
  type ThemeDataStatus,
  type ThemeDetailsTarget,
} from "@/components/quran/theme-details";
import {
  ActiveThemePill,
  type ActiveThemePillModel,
} from "@/components/quran/theme-pill";

// Optional desktop A/B: wrap the mushaf page in a paper leaf. Default ships
// the bare full-bleed surface.
const MUSHAF_PAPER_LEAF = true;

// Module scope keeps the impure clock read out of component-body functions.
function withinAudioFollowRecency(lastUserScrollAt: number): boolean {
  return Date.now() - lastUserScrollAt < AUDIO_FOLLOW_RECENCY_MS;
}

export function QuranWebApp() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const notifyTimerRef = useRef<number | null>(null);
  const reduce = useReducedMotion();

  // Continuous-scroll river plumbing.
  const riverRef = useRef<MushafRiverHandle | null>(null);
  const railThumbRef = useRef<HTMLElement | null>(null);
  // Lookahead direction of the latest committed anchor change.
  const anchorDirectionRef = useRef<1 | -1>(1);
  // Audio-follow guards (iOS interruptibility model): a recency window after
  // any genuine user scroll, and a suppression latch set by scrolling while
  // audio is playing or loading.
  const lastUserScrollAtRef = useRef(0);
  const audioFollowSuppressedRef = useRef(false);
  const audioPlayingRef = useRef(false);
  const audioLoadingRef = useRef(false);
  // The ayah actually playing: auto-advance walks ITS surah, never the
  // selection, so playback survives selection jumps mid-listen.
  const playingAyahIdRef = useRef<string | null>(null);

  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [translationById, setTranslationById] = useState<Record<string, string>>({});
  const [selectedSurahId, setSelectedSurahId] = useState(1);
  const [activeAyahId, setActiveAyahId] = useState("1:1");
  const [reciterId, setReciterId] = useState("mishary");
  const [query, setQuery] = useState("");
  // Browse directory filter: "all" backs the landing's Surah tab; "juz"
  // renders the 30 juz rows; "popular" narrows to the curated set.
  const [surahFilter, setSurahFilter] = useState<"all" | "juz" | "popular">("all");
  // "browse" = the surah directory landing; "read" = the actual reading view.
  // Restore alone never leaves browse; only deep links and user actions do.
  const [mode, setMode] = useState<"browse" | "read">("browse");
  const [readerView, setReaderView] = useState<ReaderView>("mushaf");
  // THE single page-position source of truth: the river page under the
  // reading-anchor band, committed post-hysteresis. Selection (activeAyahId)
  // is an independent axis joined only by explicit commands.
  const [anchorPage, setAnchorPage] = useState(1);
  // True during a progress-rail drag: the river renders its skeleton tier
  // only and the font preload effect pauses.
  const [scrubbing, setScrubbing] = useState(false);
  // Deferred navigation (saved-position restore, deep links, browse-mode
  // jumps): executed instantly by the river once measured; gates persistence
  // so the scrollY=0 first frame can never persist page 1.
  const [pendingScrollTarget, setPendingScrollTarget] =
    useState<PendingScrollTarget | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  // Page bookmarks: the "mushaf ribbons" (whole pages, plural), independent
  // of the per-ayah bookmarks above.
  const [pageBookmarks, setPageBookmarks] = useState<number[]>([]);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showTajweed, setShowTajweed] = useState(true);
  const [selectedTafseerId, setSelectedTafseerId] = useState(DEFAULT_TAFSEER_ID);
  const [fontSize, setFontSize] = useState(QPC_SOURCE_FONT_SIZE);
  const [autoAdvanceArmed, setAutoAdvanceArmed] = useState(false);
  const [playerLabel, setPlayerLabel] = useState("Choose an ayah to listen");
  const [loading, setLoading] = useState(true);
  const [hasRestoredState, setHasRestoredState] = useState(false);
  const [mushafLayout, setMushafLayout] = useState<BuiltMushafLayout | null>(null);
  const [mushafLayoutStatus, setMushafLayoutStatus] =
    useState<MushafLayoutStatus>("idle");
  const [ayahContextMenu, setAyahContextMenu] = useState<AyahContextMenuState | null>(
    null
  );
  const [expandedTafseerIds, setExpandedTafseerIds] = useState<string[]>([]);
  const [tafseerById, setTafseerById] = useState<Record<string, TafseerMap>>({});
  const [tafseerStatus, setTafseerStatus] = useState<
    Record<string, "idle" | "loading" | "ready" | "error">
  >({});
  const [tajweedByAyah, setTajweedByAyah] = useState<Record<string, TajweedSegment[]>>({});
  const [tajweedStatus, setTajweedStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle"
  );
  // Word-by-word hover translations (mushaf, desktop only). Per-surah maps
  // merge into one verseKey-keyed record, mirroring the tajweed pattern; the
  // status ref dedupes in-flight fetches without re-render churn ("error"
  // entries retry on the next ensure call, so a cold hover self-heals).
  const [wbwByAyah, setWbwByAyah] = useState<Record<string, WbwWord[]>>({});
  const wbwSurahStatus = useRef(new Map<number, "loading" | "ready" | "error">());
  const [showWordTooltips, setShowWordTooltips] = useState(true);

  // Chrome state for the v2 reader shell.
  const [jumpOpen, setJumpOpen] = useState(false);
  const [jumpTab, setJumpTab] = useState<JumpTab>("surah");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsSection, setSettingsSection] = useState<SettingsSection | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [actionSheetVerseKey, setActionSheetVerseKey] = useState<string | null>(null);
  const [audioBarMounted, setAudioBarMounted] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [transientLabel, setTransientLabel] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [mobileChromeHidden, setMobileChromeHidden] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [resumeRaw, setResumeRaw] = useState<{
    surahId: number;
    ayahId: string;
    page: number;
  } | null>(null);

  // Thematic highlighting (modes are mutually exclusive; setters clear the
  // other two, porting src/store/thematicHighlights.ts semantics).
  const [themeData, setThemeData] = useState<ThematicData | null>(null);
  const [themeStatus, setThemeStatus] = useState<ThemeDataStatus>("idle");
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [activeSectionIds, setActiveSectionIds] = useState<string[]>([]);
  const [allSections, setAllSections] = useState(false);
  const [themesOpen, setThemesOpen] = useState(false);
  const [themeDetails, setThemeDetails] = useState<ThemeDetailsTarget | null>(null);
  // Gates the persist effect on ITS OWN restore (not hasRestoredState, which
  // flips earlier and would overwrite the stored payload with defaults).
  const [themeRestored, setThemeRestored] = useState(false);

  const { hidden: headerHidden, lockVisible } = useHeaderAutoHide();

  useEffect(() => {
    let active = true;

    async function loadData() {
      const [quranResponse, translationResponse] = await Promise.all([
        fetch("/quran/quran-uthmani.json"),
        fetch("/quran/translation-sahih-international.json"),
      ]);
      const [quran, translations] = await Promise.all([
        quranResponse.json() as Promise<Surah[]>,
        translationResponse.json() as Promise<Translation[]>,
      ]);

      if (!active) return;

      setSurahs(quran);
      setTranslationById(Object.fromEntries(translations.map((item) => [item.id, item.text])));
      setLoading(false);
    }

    loadData().catch(() => setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadMushafLayout() {
      setMushafLayoutStatus("loading");
      const response = await fetch("/quran/qpc-v4-layout.json");
      if (!response.ok) {
        throw new Error(`Mushaf layout request failed: ${response.status}`);
      }
      const raw = (await response.json()) as RawMushafLayout;
      if (!active) return;
      setMushafLayout(buildMushafLayout(raw));
      setMushafLayoutStatus("ready");
    }

    loadMushafLayout().catch(() => {
      if (active) setMushafLayoutStatus("error");
    });

    return () => {
      active = false;
    };
  }, []);

  // Warm the woff2 for the pages just outside the river's full tier, biased
  // toward the scroll direction, so settling on a new anchor never hits the
  // font-display:block blank period. Paused while scrubbing so a rail drag
  // across the whole mushaf cannot accumulate font fetches.
  useEffect(() => {
    if (mode !== "read" || readerView !== "mushaf" || scrubbing) {
      // The river is gone (browse / study) or a scrub is racing: drop the
      // stale preload links instead of leaving them parked in <head>.
      document.head
        .querySelectorAll<HTMLLinkElement>("link[data-qpc-preload]")
        .forEach((node) => node.remove());
      return;
    }
    const direction = anchorDirectionRef.current;
    const targets = [
      ...new Set([
        anchorPage - 1,
        anchorPage + 1,
        anchorPage + 2 * direction,
        anchorPage + 3 * direction,
      ]),
    ].filter((page) => page >= 1 && page <= TOTAL_MUSHAF_PAGES);
    const keep = new Set(targets.map((page) => String(page).padStart(3, "0")));
    for (const id of keep) {
      if (document.head.querySelector(`link[data-qpc-preload="${id}"]`)) continue;
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "font";
      link.type = "font/woff2";
      // Required for font preloads to match the CSS-initiated fetch, even
      // same-origin.
      link.crossOrigin = "anonymous";
      link.href = `/fonts/qpc-v4/p${id}.woff2`;
      link.dataset.qpcPreload = id;
      document.head.appendChild(link);
    }
    document.head
      .querySelectorAll<HTMLLinkElement>("link[data-qpc-preload]")
      .forEach((node) => {
        if (!keep.has(node.dataset.qpcPreload ?? "")) node.remove();
      });
  }, [mode, readerView, anchorPage, scrubbing]);

  // Unmount-only sweep so reader teardown never strands preload links in
  // <head>. Separate from the effect above on purpose: a per-run cleanup
  // would remove and re-append the kept links on every anchor change.
  useEffect(
    () => () => {
      document.head
        .querySelectorAll<HTMLLinkElement>("link[data-qpc-preload]")
        .forEach((node) => node.remove());
    },
    []
  );

  useEffect(
    () =>
      restoreSavedReaderState({
        setSelectedSurahId,
        setActiveAyahId,
        setReciterId,
        setFontSize,
        setShowTranslation,
        setShowTajweed,
        setShowWordTooltips,
        setSelectedTafseerId,
        setReaderView,
        // The saved page becomes the optimistic anchor (mount window + font
        // preload re-point immediately) plus a deferred scroll target that
        // fires only once read mode is entered and the river is measured.
        setCurrentPage: (page) => {
          setAnchorPage(page);
          setPendingScrollTarget({ kind: "page", page });
        },
        setBookmarks,
        setPageBookmarks,
        setQuery,
        // Deep links (?surah= / ?ayah=s:n) enter read mode directly; the
        // ayah target overrides the saved-page target.
        onEnterReadMode: () => {
          setMode("read");
          try {
            const params = new URLSearchParams(window.location.search);
            const routeAyah = params.get("ayah");
            const routeSurah = Number(params.get("surah"));
            if (routeAyah && routeAyah.includes(":")) {
              setPendingScrollTarget({ kind: "ayah", verseKey: routeAyah });
            } else if (
              Number.isFinite(routeSurah) &&
              routeSurah >= 1 &&
              routeSurah <= 114
            ) {
              setPendingScrollTarget({
                kind: "ayah",
                verseKey: `${routeSurah}:1`,
              });
            }
          } catch {
            // URL params are optional entry hints.
          }
        },
        onRestored: () => {
          setHasRestoredState(true);
          // /mushaf#bookmarks: stay in browse and reveal the bookmarks strip
          // when the landing renders one (Implementer B provides the target).
          window.setTimeout(() => {
            if (window.location.hash !== "#bookmarks") return;
            document
              .getElementById("bookmarks")
              ?.scrollIntoView({ behavior: "instant", block: "start" });
          }, 0);
        },
      }),
    []
  );

  // Snapshot the saved position for the browse Resume card, and open the
  // search drawer for ?q=/?search= deep links. The localStorage read happens
  // synchronously at mount, before this session's persist effect can write a
  // fresh-profile default; only the setState is deferred.
  useEffect(() => {
    let snapshot: { surahId: number; ayahId: string; page: number } | null = null;
    let openSearchFromRoute = false;
    try {
      const saved = window.localStorage.getItem(LAST_STATE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SavedReaderState;
        if (
          typeof parsed.surahId === "number" &&
          typeof parsed.ayahId === "string" &&
          parsed.ayahId.includes(":") &&
          typeof parsed.page === "number"
        ) {
          snapshot = {
            surahId: parsed.surahId,
            ayahId: parsed.ayahId,
            page: parsed.page,
          };
        }
      }
    } catch {
      // Local storage is a convenience only.
    }
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("q") ?? params.get("search")) openSearchFromRoute = true;
    } catch {
      // URL params are optional entry hints.
    }
    const timeout = window.setTimeout(() => {
      if (snapshot) setResumeRaw(snapshot);
      if (openSearchFromRoute) setSearchOpen(true);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  // The saved-state persist effect lives below the derived state (it reads
  // activeAyah and the page maps to compute the anchor-following resume
  // point).

  useEffect(() => {
    if (!hasRestoredState) return;
    try {
      window.localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch {
      // Ignore private browsing storage failures.
    }
  }, [bookmarks, hasRestoredState]);

  useEffect(() => {
    if (!hasRestoredState) return;
    try {
      window.localStorage.setItem(PAGE_BOOKMARKS_KEY, JSON.stringify(pageBookmarks));
    } catch {
      // Ignore private browsing storage failures.
    }
  }, [pageBookmarks, hasRestoredState]);

  // Restore thematic highlighting (ilm-quran:thematic), then layer the
  // ?theme= / ?sections= deep-link params over it. Per-field validation +
  // mutual exclusion on read: topic beats sections beats all-sections.
  useEffect(() => {
    let topicId: string | null = null;
    let sectionIds: string[] = [];
    let all = false;
    try {
      const raw = window.localStorage.getItem(THEMATIC_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SavedThematicState;
        if (
          typeof parsed.activeTopicId === "string" &&
          TOPIC_ID_PATTERN.test(parsed.activeTopicId)
        ) {
          topicId = parsed.activeTopicId;
        }
        if (Array.isArray(parsed.activeSectionIds)) {
          sectionIds = [
            ...new Set(
              parsed.activeSectionIds.filter(
                (id): id is string =>
                  typeof id === "string" && SECTION_ID_PATTERN.test(id)
              )
            ),
          ];
        }
        all = parsed.allSections === true;
      }
    } catch {
      // Local storage is a convenience only.
    }
    try {
      const params = new URLSearchParams(window.location.search);
      const themeParam = params.get("theme");
      const sectionsParam = params.get("sections");
      if (themeParam === "all") {
        topicId = null;
        sectionIds = [];
        all = true;
      } else if (themeParam && TOPIC_ID_PATTERN.test(themeParam)) {
        topicId = themeParam;
        sectionIds = [];
        all = false;
      } else if (sectionsParam) {
        const ids = [
          ...new Set(
            sectionsParam
              .split(",")
              .map((id) => id.trim())
              .filter((id) => SECTION_ID_PATTERN.test(id))
          ),
        ];
        if (ids.length > 0) {
          topicId = null;
          sectionIds = ids;
          all = false;
        }
      }
    } catch {
      // URL params are optional entry hints.
    }
    if (topicId) {
      sectionIds = [];
      all = false;
    } else if (sectionIds.length > 0) {
      all = false;
    }
    const timeout = window.setTimeout(() => {
      if (topicId) setActiveTopicId(topicId);
      if (sectionIds.length > 0) setActiveSectionIds(sectionIds);
      if (all) setAllSections(true);
      setThemeRestored(true);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!themeRestored) return;
    try {
      window.localStorage.setItem(
        THEMATIC_KEY,
        JSON.stringify({
          activeTopicId,
          activeSectionIds,
          allSections,
          updatedAt: Date.now(),
        } satisfies SavedThematicState)
      );
    } catch {
      // Ignore private browsing storage failures.
    }
  }, [activeTopicId, activeSectionIds, allSections, themeRestored]);

  useEffect(() => {
    if (!ayahContextMenu) return;

    function close() {
      setAyahContextMenu(null);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    window.addEventListener("click", close);
    window.addEventListener("scroll", close, true);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [ayahContextMenu]);

  const selectedSurah = useMemo(
    () => surahs.find((surah) => surah.id === selectedSurahId) ?? surahs[0],
    [selectedSurahId, surahs]
  );

  const reciter = useMemo(
    () => RECITERS.find((item) => item.id === reciterId) ?? RECITERS[0],
    [reciterId]
  );

  const selectedTafseer = useMemo(
    () => getTafseer(selectedTafseerId) ?? getTafseer(DEFAULT_TAFSEER_ID),
    [selectedTafseerId]
  );

  const surahById = useMemo(
    () => new Map(surahs.map((surah) => [surah.id, surah])),
    [surahs]
  );

  // Hizb starts derived from per-ayah hizbQuarter data (never hand-typed):
  // feeds the context bar, page footers, and the progress rail ticks.
  const hizbIndex = useMemo(() => buildHizbIndex(surahs), [surahs]);

  const allAyahs = useMemo(() => surahs.flatMap((surah) => surah.ayahs), [surahs]);
  const ayahById = useMemo(() => new Map(allAyahs.map((ayah) => [ayah.id, ayah])), [allAyahs]);
  const pagesByNumber = useMemo(() => {
    const pages = new Map<number, Ayah[]>();
    for (const ayah of allAyahs) {
      const group = pages.get(ayah.page) ?? [];
      group.push(ayah);
      pages.set(ayah.page, group);
    }
    return pages;
  }, [allAyahs]);
  const normalizedQuery = query.trim().toLowerCase();

  useEffect(() => {
    if (!showTajweed || !selectedSurahId) {
      const timeout = window.setTimeout(() => setTajweedStatus("idle"), 0);
      return () => window.clearTimeout(timeout);
    }

    let active = true;
    const timeout = window.setTimeout(() => {
      async function loadTajweed() {
        // Version the cache with the parser convention: stale PARSED
        // segments in localStorage outlive deploys (a cached surah
        // short-circuits fetch+parse, so normalization fixes never run).
        // v2 = KFGQPC convention (U+06DF -> sukun, ZWNJ-before-waqf-mark
        // stripped). v3 = segment-leading marks reattached to the previous
        // segment (WebKit drew orphaned marks on dotted circles).
        const storageKey = `ilm-quran:tajweed:v3:${selectedSurahId}`;
        try {
          // Sweep older-versioned keys.
          for (let i = window.localStorage.length - 1; i >= 0; i--) {
            const key = window.localStorage.key(i);
            if (key?.startsWith("ilm-quran:tajweed:") && !key.includes(":v3:")) {
              window.localStorage.removeItem(key);
            }
          }
          const cached = window.localStorage.getItem(storageKey);
          if (cached) {
            const parsed = JSON.parse(cached) as Record<string, TajweedSegment[]>;
            if (!active) return;
            setTajweedByAyah((current) => ({ ...current, ...parsed }));
            setTajweedStatus("ready");
            return;
          }
        } catch {
          // Cache is only a speed-up.
        }

        setTajweedStatus("loading");
        try {
          const map = await fetchSurahTajweed(selectedSurahId);
          if (!active) return;
          setTajweedByAyah((current) => ({ ...current, ...map }));
          setTajweedStatus("ready");
          try {
            window.localStorage.setItem(storageKey, JSON.stringify(map));
          } catch {
            // Tajweed can be fetched again if browser storage is full.
          }
        } catch {
          if (active) setTajweedStatus("error");
        }
      }

      void loadTajweed();
    }, 0);

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [selectedSurahId, showTajweed]);

  const ensureTafseerLoaded = useCallback(
    (tafseerId: string) => {
      if (tafseerById[tafseerId] || tafseerStatus[tafseerId] === "loading") return;

      setTafseerStatus((current) => ({ ...current, [tafseerId]: "loading" }));
      void fetch(`/api/tafseer/${tafseerId}`)
        .then((response) => {
          if (!response.ok) throw new Error(`Tafseer request failed: ${response.status}`);
          return response.json() as Promise<TafseerMap>;
        })
        .then((map) => {
          setTafseerById((current) => ({ ...current, [tafseerId]: map }));
          setTafseerStatus((current) => ({ ...current, [tafseerId]: "ready" }));
        })
        .catch(() => {
          setTafseerStatus((current) => ({ ...current, [tafseerId]: "error" }));
        });
    },
    [tafseerById, tafseerStatus]
  );

  useEffect(() => {
    if (expandedTafseerIds.length === 0) return;
    const timeout = window.setTimeout(
      () => ensureTafseerLoaded(selectedTafseerId),
      0
    );
    return () => window.clearTimeout(timeout);
  }, [ensureTafseerLoaded, expandedTafseerIds.length, selectedTafseerId]);

  // The existing 80-cap ayah search engine, now feeding the search drawer.
  const searchResults = useMemo(() => {
    if (normalizedQuery.length < 2) return [];

    return allAyahs
      .filter((ayah) => {
        const surah = surahById.get(ayah.surahId);
        const translation = translationById[ayah.id] ?? "";
        return (
          ayah.textSimple.includes(normalizedQuery) ||
          ayah.textUthmani.includes(normalizedQuery) ||
          translation.toLowerCase().includes(normalizedQuery) ||
          surah?.nameEnglish.toLowerCase().includes(normalizedQuery) ||
          surah?.nameTranslation.toLowerCase().includes(normalizedQuery)
        );
      })
      .slice(0, 80);
  }, [allAyahs, normalizedQuery, surahById, translationById]);

  const searchResultItems = useMemo<SearchResultItem[]>(
    () =>
      searchResults.map((ayah) => ({
        ayah,
        surahName: surahById.get(ayah.surahId)?.nameEnglish ?? `Surah ${ayah.surahId}`,
        translationText: translationById[ayah.id] ?? null,
      })),
    [searchResults, surahById, translationById]
  );

  const visibleAyahs = selectedSurah?.ayahs ?? [];
  const activeAyah = allAyahs.find((ayah) => ayah.id === activeAyahId);
  const anchorPageAyahs = useMemo(
    () => pagesByNumber.get(anchorPage) ?? [],
    [anchorPage, pagesByNumber]
  );
  const anchorPageSurahs = useMemo(() => {
    const ids = new Set(anchorPageAyahs.map((ayah) => ayah.surahId));
    return [...ids]
      .map((id) => surahById.get(id))
      .filter((surah): surah is Surah => Boolean(surah));
  }, [anchorPageAyahs, surahById]);
  const anchorPageTitle =
    anchorPageSurahs.map((surah) => surah.nameEnglish).join(" / ") ||
    selectedSurah?.nameEnglish ||
    "Quran";

  // --- Word-by-word hover translations: load + prefetch ---------------------
  // Idempotent per-surah ensure: localStorage first (cache is only a
  // speed-up; the ~4 MB all-Quran worst case shares the origin budget with
  // tajweed and eviction is tolerated), then the static /quran asset.
  const ensureWbwSurah = useCallback((surahId: number) => {
    if (!Number.isInteger(surahId) || surahId < 1 || surahId > 114) return;
    const status = wbwSurahStatus.current.get(surahId);
    if (status === "loading" || status === "ready") return;
    try {
      const cached = window.localStorage.getItem(wbwStorageKey(surahId));
      if (cached) {
        const parsed = JSON.parse(cached) as Record<string, WbwWord[]>;
        wbwSurahStatus.current.set(surahId, "ready");
        setWbwByAyah((current) => ({ ...current, ...parsed }));
        return;
      }
    } catch {
      // Cache is only a speed-up.
    }
    wbwSurahStatus.current.set(surahId, "loading");
    void fetchSurahWbw(surahId)
      .then((map) => {
        wbwSurahStatus.current.set(surahId, "ready");
        setWbwByAyah((current) => ({ ...current, ...map }));
        try {
          window.localStorage.setItem(wbwStorageKey(surahId), JSON.stringify(map));
        } catch {
          // Cache is only a speed-up; eviction is tolerated.
        }
      })
      .catch(() => {
        wbwSurahStatus.current.set(surahId, "error");
      });
  }, []);

  // Prefetch the anchor page's surahs so the first hover already has data.
  // Hover-capable desktops only: touch devices never show the tooltip, so
  // they never pay for the data either. A cold hover elsewhere self-heals
  // through the tooltip's onNeedSurah call.
  useEffect(() => {
    if (mode !== "read" || readerView !== "mushaf" || !showWordTooltips) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let active = true;
    const timeout = window.setTimeout(() => {
      if (!active) return;
      for (const surah of anchorPageSurahs) ensureWbwSurah(surah.id);
    }, 0);
    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [mode, readerView, anchorPageSurahs, showWordTooltips, ensureWbwSurah]);
  const anchorPageJuzRange = useMemo(() => {
    const juz = [...new Set(anchorPageAyahs.map((ayah) => ayah.juz))];
    if (juz.length === 0) return "";
    return juz.length === 1 ? `Juz ${juz[0]}` : `Juz ${juz[0]}-${juz[juz.length - 1]}`;
  }, [anchorPageAyahs]);
  // Real cards in the river right now: theme tints are computed for these
  // pages only (O(visible), ~750 glyphs max).
  const fullPageNumbers = useMemo(
    () => fullTierPages(anchorPage, scrubbing),
    [anchorPage, scrubbing]
  );
  const readerSurah = activeAyah ? surahById.get(activeAyah.surahId) : selectedSurah;
  const readerJuz = activeAyah?.juz ?? anchorPageAyahs[0]?.juz ?? 1;
  const readerHizb = hizbIndex.hizbForPage(anchorPage);
  const contextMenuAyah = ayahContextMenu ? ayahById.get(ayahContextMenu.ayahId) : null;
  const actionSheetAyah = actionSheetVerseKey ? ayahById.get(actionSheetVerseKey) : null;

  // First ayah of each juz, for the jump panel's Juz tab.
  const juzStarts = useMemo<JuzStart[]>(() => {
    const starts: JuzStart[] = [];
    const seen = new Set<number>();
    for (const ayah of allAyahs) {
      if (seen.has(ayah.juz)) continue;
      seen.add(ayah.juz);
      starts.push({
        juz: ayah.juz,
        surahId: ayah.surahId,
        ayahNumber: ayah.ayahNumber,
        surahName: surahById.get(ayah.surahId)?.nameEnglish ?? `Surah ${ayah.surahId}`,
      });
    }
    return starts.sort((a, b) => a.juz - b.juz);
  }, [allAyahs, surahById]);

  // (The old selection -> page inverse effect is intentionally gone: in the
  // river, scrolling and selection are independent axes joined only by
  // explicit commands.)

  // Persist the reading state, debounced 400ms after the anchor settles.
  // Gated on pendingScrollTarget so the pre-restore scrollY=0 frame can never
  // overwrite the resume point with page 1. The key NAME and 10-field SHAPE
  // are load-bearing (Resume reads the identical shape); only the semantics
  // of `page` changed: it now tracks the settled anchorPage.
  useEffect(() => {
    if (!hasRestoredState || pendingScrollTarget !== null) return;
    const timeout = window.setTimeout(() => {
      // Ayah-granular resume that follows READING, not stale selection: keep
      // the selected ayah while it rides near the anchor, otherwise fall
      // back to the first ayah of the anchor page.
      const mushafReading = mode === "read" && readerView === "mushaf";
      const anchorAyah =
        mushafReading &&
        (!activeAyah || Math.abs(activeAyah.page - anchorPage) > 1)
          ? pagesByNumber.get(anchorPage)?.[0]
          : activeAyah;
      const page =
        mode === "read" && readerView === "study" && activeAyah
          ? activeAyah.page
          : anchorPage;
      try {
        window.localStorage.setItem(
          LAST_STATE_KEY,
          JSON.stringify({
            surahId: anchorAyah?.surahId ?? selectedSurahId,
            ayahId: anchorAyah?.id ?? activeAyahId,
            reciterId,
            fontSize,
            showTranslation,
            showTajweed,
            showWordTooltips,
            tafseerId: selectedTafseerId,
            readerView,
            page,
            updatedAt: Date.now(),
          })
        );
      } catch {
        // Ignore private browsing storage failures.
      }

      // Feed the site's own reading signals. The Continue Reading card, the
      // /quran progress widget, and the memorization progress grid all read
      // these two keys, and the reader this one replaced was what wrote them.
      try {
        const resumeSurahId = anchorAyah?.surahId ?? selectedSurahId;
        const resumeSurah = surahById.get(resumeSurahId);
        if (mode === "read" && resumeSurah) {
          saveQuranBookmark(
            resumeSurahId,
            resumeSurah.nameEnglish,
            anchorAyah?.ayahNumber ?? 1
          );
          markSurahRead(resumeSurahId);
        }
      } catch {
        // Ignore private browsing storage failures.
      }
    }, 400);
    return () => window.clearTimeout(timeout);
  }, [
    activeAyah,
    activeAyahId,
    anchorPage,
    fontSize,
    hasRestoredState,
    mode,
    pagesByNumber,
    pendingScrollTarget,
    readerView,
    reciterId,
    selectedSurahId,
    selectedTafseerId,
    showTajweed,
    showTranslation,
    showWordTooltips,
    surahById,
  ]);

  // A pending target parked while the river is unmounted (restored
  // readerView = study) resolves through the study view's per-ayah DOM ids
  // instead, so it can never wedge the persistence gate.
  useEffect(() => {
    if (!pendingScrollTarget || mode !== "read" || readerView !== "study" || loading) {
      return;
    }
    const target = pendingScrollTarget;
    const timeout = window.setTimeout(() => {
      if (target.kind === "ayah") {
        document
          .getElementById(`ayah-${target.verseKey.replace(":", "-")}`)
          ?.scrollIntoView({ behavior: "instant", block: "center" });
      }
      setPendingScrollTarget(null);
    }, 50);
    return () => window.clearTimeout(timeout);
  }, [pendingScrollTarget, mode, readerView, loading]);

  // (Directory filtering lives inside BrowseLanding now: it owns the
  // Surah / Juz / Popular tabs and the query-over-filter behavior.)

  function buildAyahCtx(ayah: Ayah): AyahActionContext {
    return {
      verseKey: ayah.id,
      surahName: surahById.get(ayah.surahId)?.nameEnglish ?? `Surah ${ayah.surahId}`,
      ayahNumber: ayah.ayahNumber,
      page: ayah.page,
      juz: ayah.juz,
      isBookmarked: bookmarks.includes(ayah.id),
      hasTranslation: Boolean(translationById[ayah.id]),
    };
  }

  const activeAyahCtx = activeAyah ? buildAyahCtx(activeAyah) : null;

  // Resume model for the browse hero, enriched with the surah's Arabic name
  // and the saved ayah's juz (falls back to the saved page's first ayah).
  const resumeState = useMemo(() => {
    if (!resumeRaw) return null;
    const surah = surahById.get(resumeRaw.surahId);
    if (!surah) return null;
    const ayah = ayahById.get(resumeRaw.ayahId);
    const parsedAyahNumber = Number(resumeRaw.ayahId.split(":")[1]);
    return {
      surahId: resumeRaw.surahId,
      surahName: surah.nameEnglish,
      arabicName: surah.nameArabic,
      ayahNumber:
        ayah?.ayahNumber ?? (Number.isFinite(parsedAyahNumber) ? parsedAyahNumber : 1),
      page: resumeRaw.page,
      juz: ayah?.juz ?? pagesByNumber.get(resumeRaw.page)?.[0]?.juz ?? 1,
    };
  }, [resumeRaw, surahById, ayahById, pagesByNumber]);

  // Progress v1: ayah index within the surah in Translation view; anchor
  // page over 604 in Reading view.
  const readingProgress =
    readerView === "study"
      ? selectedSurah && activeAyah && activeAyah.surahId === selectedSurah.id
        ? activeAyah.ayahNumber / Math.max(1, selectedSurah.ayahs.length)
        : 0
      : anchorPage / TOTAL_MUSHAF_PAGES;

  const surahChipLabel =
    readerView === "mushaf" && anchorPageSurahs.length > 0
      ? anchorPageTitle
      : readerSurah
        ? `${readerSurah.id}. ${readerSurah.nameEnglish}`
        : "Quran";

  const activeIndexInSurah =
    selectedSurah && activeAyah && activeAyah.surahId === selectedSurah.id
      ? selectedSurah.ayahs.findIndex((ayah) => ayah.id === activeAyah.id)
      : -1;
  const canPrevAyah = activeIndexInSurah > 0;
  const canNextAyah =
    activeIndexInSurah >= 0 &&
    activeIndexInSurah < (selectedSurah?.ayahs.length ?? 0) - 1;

  // --- Thematic highlighting: derived state --------------------------------
  const themeHighlightOn =
    allSections || activeTopicId !== null || activeSectionIds.length > 0;

  // Lazy fetch on first feature use (panel/details opened) or when restored
  // persistence says highlighting is active, so a returning user's tints
  // appear without opening the panel. Retry = back to "idle".
  const themeFeatureWanted =
    themesOpen || themeDetails !== null || themeHighlightOn;
  useEffect(() => {
    if (!themeFeatureWanted || themeStatus !== "idle") return;
    let active = true;

    async function loadThemes() {
      setThemeStatus("loading");
      try {
        const data = await loadThematicData();
        if (!active) return;
        setThemeData(data);
        setThemeStatus("ready");
      } catch {
        if (active) setThemeStatus("error");
      }
    }

    void loadThemes();
    return () => {
      active = false;
    };
  }, [themeFeatureWanted, themeStatus]);

  // Shared rest-tint model: topic tint, else section tint (all-sections uses
  // the primary section, section mode uses first-selected-wins order).
  const restTintForAyah = useCallback(
    (ayahId: string): string | null => {
      if (!themeData) return null;
      if (activeTopicId) {
        if (!themeData.topics.isAyahInTopic(activeTopicId, ayahId)) return null;
        const topic = themeData.topics.topic(activeTopicId);
        return topic
          ? getThemeHighlightTint(getThematicTopicColorGuideItem(topic).color)
          : null;
      }
      if (allSections) {
        const section = themeData.sections.primarySectionForAyah(ayahId);
        return section ? themeData.sections.sectionHighlightTint(section) : null;
      }
      if (activeSectionIds.length > 0) {
        const section = themeData.sections.matchingSectionForAyah(
          ayahId,
          activeSectionIds
        );
        return section ? themeData.sections.sectionHighlightTint(section) : null;
      }
      return null;
    },
    [themeData, activeTopicId, allSections, activeSectionIds]
  );

  // Mushaf tint map for the river's FULL-tier pages only: ~150 glyphs/page,
  // O(visible) work, zero churn for skeleton shells.
  const mushafThemeTints = useMemo<Record<string, string>>(() => {
    if (!themeData || !themeHighlightOn) return {};
    const map: Record<string, string> = {};
    for (const pageNumber of fullPageNumbers) {
      const ids =
        mushafLayout?.ayahIdsByPage[pageNumber] ??
        (pagesByNumber.get(pageNumber) ?? []).map((ayah) => ayah.id);
      for (const id of ids) {
        const tint = restTintForAyah(id);
        if (tint) map[id] = tint;
      }
    }
    return map;
  }, [
    themeData,
    themeHighlightOn,
    fullPageNumbers,
    mushafLayout,
    pagesByNumber,
    restTintForAyah,
  ]);

  // Study view: per-ayah tint plus a theme chip on the FIRST ayah of each
  // contiguous same-theme run (section boundaries become visible labels:
  // the "thematic map" reading).
  const studyThemeByAyahId = useMemo(() => {
    const map = new Map<
      string,
      { tint: string; chip: { name: string; color: string } | null }
    >();
    if (!themeData || !themeHighlightOn || readerView !== "study") return map;
    let prevIdentity: string | null = null;
    for (const ayah of selectedSurah?.ayahs ?? []) {
      let identity: string | null = null;
      let name = "";
      let color = "";
      if (activeTopicId) {
        if (themeData.topics.isAyahInTopic(activeTopicId, ayah.id)) {
          const topic = themeData.topics.topic(activeTopicId);
          if (topic) {
            identity = `topic:${topic.id}`;
            name = cleanThematicTopicText(topic.name);
            color = getThematicTopicColorGuideItem(topic).color;
          }
        }
      } else {
        const section = allSections
          ? themeData.sections.primarySectionForAyah(ayah.id)
          : activeSectionIds.length > 0
            ? themeData.sections.matchingSectionForAyah(ayah.id, activeSectionIds)
            : null;
        if (section) {
          identity = `section:${section.id}`;
          name = getSurahSectionTitle(section);
          color = themeData.sections.sectionAccent(section);
        }
      }
      if (identity && color) {
        map.set(ayah.id, {
          tint: getThemeHighlightTint(color),
          chip: identity !== prevIdentity ? { name, color } : null,
        });
      }
      prevIdentity = identity;
    }
    return map;
  }, [
    themeData,
    themeHighlightOn,
    readerView,
    selectedSurah,
    activeTopicId,
    allSections,
    activeSectionIds,
  ]);

  const themePillModel = useMemo<ActiveThemePillModel | null>(() => {
    if (!themeHighlightOn) return null;
    if (allSections) return { kind: "all" };
    if (activeTopicId) {
      const topic = themeData?.topics.topic(activeTopicId) ?? null;
      return {
        kind: "topic",
        label: topic ? cleanThematicTopicText(topic.name) : "Theme",
        color: topic ? getThematicTopicColorGuideItem(topic).color : null,
      };
    }
    const sectionsApi = themeData?.sections;
    return {
      kind: "sections",
      chips: activeSectionIds.map((id) => {
        const section = sectionsApi?.section(id) ?? null;
        return {
          id,
          // Fallbacks keep the pill meaningful while the dataset downloads:
          // the id embeds the range ("2:1-39:1" -> "2:1-39").
          label: section ? getSurahSectionTitle(section) : id.replace(/:\d+$/, ""),
          color:
            section && sectionsApi ? sectionsApi.sectionAccent(section) : null,
        };
      }),
    };
  }, [themeHighlightOn, allSections, activeTopicId, activeSectionIds, themeData]);

  const themesSummary = themePillModel
    ? themePillModel.kind === "all"
      ? "All Quran themes"
      : themePillModel.kind === "topic"
        ? themePillModel.label
        : themePillModel.chips.length === 1
          ? themePillModel.chips[0].label
          : `${themePillModel.chips.length} themes`
    : null;

  // Panel scope: the anchor page in Reading view, current surah in
  // Translation view; recomputes live while the user scrolls.
  const themeScope = useMemo<ThemeScope>(() => {
    if (readerView === "mushaf") {
      const ayahIds: string[] = [];
      const surahIds = new Set<number>();
      const ids =
        mushafLayout?.ayahIdsByPage[anchorPage] ??
        (pagesByNumber.get(anchorPage) ?? []).map((ayah) => ayah.id);
      for (const id of ids) {
        ayahIds.push(id);
        const parsed = parseVerseKey(id);
        if (parsed) surahIds.add(parsed.surahId);
      }
      const scopeName = [...surahIds]
        .map((id) => surahById.get(id)?.nameEnglish ?? `Surah ${id}`)
        .join(", ");
      return {
        kind: "page",
        pageLabel: String(anchorPage),
        scopeName: scopeName || `Page ${anchorPage}`,
        ayahIds,
      };
    }
    return {
      kind: "surah",
      surahId: selectedSurahId,
      surahName: selectedSurah?.nameEnglish ?? `Surah ${selectedSurahId}`,
    };
  }, [
    readerView,
    mushafLayout,
    pagesByNumber,
    surahById,
    anchorPage,
    selectedSurahId,
    selectedSurah,
  ]);

  const anyOverlayOpen = Boolean(
    ayahContextMenu ||
      actionSheetVerseKey ||
      themeDetails ||
      searchOpen ||
      settingsOpen ||
      themesOpen ||
      jumpOpen
  );

  // Routes transient feedback to the audio bar's label line when mounted,
  // otherwise to the floating toast.
  function notify(message: string) {
    if (notifyTimerRef.current !== null) window.clearTimeout(notifyTimerRef.current);
    if (audioBarMounted) {
      setTransientLabel(message);
      notifyTimerRef.current = window.setTimeout(() => setTransientLabel(null), 2500);
    } else {
      setToast(message);
      notifyTimerRef.current = window.setTimeout(() => setToast(null), 2500);
    }
  }

  // --- Thematic highlighting: actions (setters clear the other modes) ------

  // Topic activation: whole-Quran tint; the panel closes immediately and the
  // toast names the theme.
  function activateTopic(topicId: string) {
    setActiveTopicId(topicId);
    setActiveSectionIds([]);
    setAllSections(false);
    setThemesOpen(false);
    setThemeDetails(null);
    const name = themeData?.topics.topic(topicId)?.name;
    notify(name ? `Theme: ${cleanThematicTopicText(name)}` : "Thematic highlighting on");
  }

  // Ordered multi-select; exits topic + all-sections modes first. The panel
  // stays open (no per-toggle toast: the row's color flip is the feedback);
  // removing the last selection turns highlighting off, with the iOS toast.
  function toggleThemeSection(sectionId: string) {
    const wasOn = themeHighlightOn;
    const next = activeSectionIds.includes(sectionId)
      ? activeSectionIds.filter((id) => id !== sectionId)
      : [...activeSectionIds, sectionId];
    setActiveTopicId(null);
    setAllSections(false);
    setActiveSectionIds(next);
    if (next.length === 0 && wasOn) notify("Highlights off");
  }

  function clearThemeHighlights() {
    setActiveTopicId(null);
    setActiveSectionIds([]);
    setAllSections(false);
    notify("Highlights off");
  }

  function setAllSectionsMode(on: boolean) {
    if (!on) {
      clearThemeHighlights();
      return;
    }
    if (!themeData) {
      // Activation attempted while the dataset failed to load.
      notify("Could not load themes");
      return;
    }
    setActiveTopicId(null);
    setActiveSectionIds([]);
    setAllSections(true);
    notify("Thematic highlighting on");
  }

  // Per-section dismissal from the active-theme pill chips.
  function removeThemeSection(sectionId: string) {
    const next = activeSectionIds.filter((id) => id !== sectionId);
    setActiveSectionIds(next);
    if (next.length === 0) notify("Highlights off");
  }

  // Per-ayah "Themes in this ayah": always available; the details surface
  // resolves the winning topic/section (nearest-section fallback, so it is
  // never empty) and handles its own loading/error states.
  function openThemeDetailsForAyah(ayahId: string) {
    setAyahContextMenu(null);
    setActionSheetVerseKey(null);
    setThemeDetails({ kind: "ayah", ayahId });
  }

  // --- River navigation commands -------------------------------------------
  // Selection and position are independent axes; these commands are the only
  // joins. Every programmatic scroll passes an explicit behavior because
  // globals.css sets html { scroll-behavior: smooth } ("auto" still animates).

  function jumpBehavior(): "smooth" | "instant" {
    return reduce ? "instant" : "smooth";
  }

  // Explicit jumps during playback scroll regardless (user intent) but latch
  // audio-follow off, like iOS picker jumps: auto-advance keeps playing while
  // the river stays where the reader put it.
  function latchAudioFollowIfActive() {
    if (audioPlayingRef.current || audioLoadingRef.current) {
      audioFollowSuppressedRef.current = true;
    }
  }

  // Optimistic window pre-positioning: commit the anchor BEFORE issuing the
  // scroll so the mount window and font preload re-point in the same render
  // pass and the target page's font fetch starts before the landing frame.
  // When the river is not mounted or measured yet (browse mode, study view,
  // layout loading) the command parks as a pending target executed instantly
  // once ready.
  function navigateToPage(page: number, behavior?: "smooth" | "instant") {
    const clamped = Math.max(1, Math.min(TOTAL_MUSHAF_PAGES, Math.round(page)));
    setAnchorPage(clamped);
    const handle = riverRef.current;
    if (handle?.ready()) {
      setPendingScrollTarget(null);
      handle.scrollToPage(clamped, behavior ?? jumpBehavior());
    } else {
      setPendingScrollTarget({ kind: "page", page: clamped });
    }
  }

  function navigateToAyah(verseKey: string, behavior?: "smooth" | "instant") {
    const ayah = ayahById.get(verseKey);
    if (!ayah) return;
    setAnchorPage(ayah.page);
    const handle = riverRef.current;
    if (handle?.ready()) {
      setPendingScrollTarget(null);
      handle.scrollToAyah(verseKey, behavior ?? jumpBehavior());
    } else {
      setPendingScrollTarget({ kind: "ayah", verseKey });
    }
  }

  // Selection + position in one command, used by every jump source. In study
  // view the per-ayah DOM ids carry the scroll; in mushaf view the river does.
  function goToAyah(ayah: Ayah) {
    latchAudioFollowIfActive();
    focusAyah(ayah);
    if (readerView === "mushaf") {
      navigateToAyah(ayah.id);
    } else {
      window.setTimeout(() => {
        document
          .getElementById(`ayah-${ayah.id.replace(":", "-")}`)
          ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      }, 50);
    }
  }

  function selectSurah(id: number) {
    setQuery("");
    setMobileChromeHidden(false);
    const first = ayahById.get(`${id}:1`);
    if (first) {
      goToAyah(first);
      return;
    }
    // Data still loading: set the selection; restore/pending paths take over.
    setSelectedSurahId(id);
    setActiveAyahId(`${id}:1`);
    setMode("read");
  }

  function selectPage(page: number) {
    const clamped = Math.max(1, Math.min(TOTAL_MUSHAF_PAGES, Math.round(page)));
    const firstAyah = pagesByNumber.get(clamped)?.[0];
    setQuery("");
    if (readerView === "mushaf") {
      latchAudioFollowIfActive();
      // Intentional continuity: selection follows the jump to the page's
      // first ayah.
      if (firstAyah) {
        setSelectedSurahId(firstAyah.surahId);
        setActiveAyahId(firstAyah.id);
      }
      setMode("read");
      navigateToPage(clamped);
    } else if (firstAyah) {
      goToAyah(firstAyah);
    }
  }

  function toggleBookmark(id: string) {
    setBookmarks((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [id, ...current]
    );
  }

  function togglePageBookmark(page: number) {
    setPageBookmarks((current) =>
      current.includes(page) ? current.filter((item) => item !== page) : [page, ...current]
    );
  }

  function toggleTafseer(id: string) {
    setExpandedTafseerIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      ensureTafseerLoaded(selectedTafseerId);
      return [id, ...current];
    });
  }

  // Selection only: NEVER scrolls by itself (clicking what you can see must
  // never move the page).
  function focusAyah(ayah: Ayah) {
    setSelectedSurahId(ayah.surahId);
    setActiveAyahId(ayah.id);
    setMode("read");
  }

  function openAyahContextMenu(ayah: Ayah, event: ReactMouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    focusAyah(ayah);

    // Touch right-click (long-press emulation) routes to the action sheet.
    if (window.matchMedia("(pointer: coarse)").matches) {
      setActionSheetVerseKey(ayah.id);
      return;
    }

    const menuWidth = 260;
    const menuHeight = 340;
    const padding = 8;
    setAyahContextMenu({
      ayahId: ayah.id,
      x: Math.max(
        padding,
        Math.min(event.clientX, window.innerWidth - menuWidth - padding)
      ),
      y: Math.max(
        padding,
        Math.min(event.clientY, window.innerHeight - menuHeight - padding)
      ),
    });
  }

  function openActionSheetForVerse(verseKey: string) {
    const ayah = ayahById.get(verseKey);
    if (!ayah) return;
    focusAyah(ayah);
    setActionSheetVerseKey(verseKey);
  }

  function openTafseerForAyah(ayah: Ayah) {
    focusAyah(ayah);
    setReaderView("study");
    lockVisible(600);
    setQuery("");
    ensureTafseerLoaded(selectedTafseerId);
    setExpandedTafseerIds((current) =>
      current.includes(ayah.id) ? current : [ayah.id, ...current]
    );
    setAyahContextMenu(null);
    window.setTimeout(() => {
      document
        .getElementById(`ayah-${ayah.id.replace(":", "-")}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  }

  async function writeClipboardText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      let copied = false;
      try {
        copied = document.execCommand("copy");
      } catch {
        copied = false;
      }
      document.body.removeChild(textarea);
      return copied;
    }
  }

  function ayahReference(ayah: Ayah) {
    return `${surahById.get(ayah.surahId)?.nameEnglish ?? `Surah ${ayah.surahId}`} ${
      ayah.ayahNumber
    }`;
  }

  function ayahCopyText(ayah: Ayah, includeTranslation: boolean) {
    const arabic = getDisplayAyahText(ayah);
    const translation = translationById[ayah.id];
    const reference = ayahReference(ayah);
    if (includeTranslation && translation) {
      return `${arabic}\n\n${translation}\n\n${reference}`;
    }
    return `${arabic}\n\n${reference}`;
  }

  function copyAyah(ayah: Ayah, includeTranslation = false) {
    setAyahContextMenu(null);
    void writeClipboardText(ayahCopyText(ayah, includeTranslation)).then((copied) => {
      notify(copied ? `Copied ${ayahReference(ayah)}` : "Could not copy this ayah");
    });
  }

  function copyAyahLink(ayah: Ayah) {
    setAyahContextMenu(null);
    const url = `${window.location.origin}/mushaf?surah=${ayah.surahId}&ayah=${encodeURIComponent(
      ayah.id
    )}`;
    void writeClipboardText(url).then((copied) => {
      notify(copied ? `Copied link to ${ayahReference(ayah)}` : "Could not copy this link");
    });
  }

  // Audio-follow (iOS interruptibility model): the river follows the
  // recitation only when the target line is offscreen AND the reader's hands
  // have not been on the river recently AND follow is not latched off.
  function followAudioToAyah(ayah: Ayah) {
    if (mode !== "read" || readerView !== "mushaf") return;
    const handle = riverRef.current;
    if (!handle?.ready()) return;
    const withinWindow = Math.abs(ayah.page - anchorPage) <= 1;
    if (withinWindow && handle.isAyahVisible(ayah.id)) return;
    if (withinAudioFollowRecency(lastUserScrollAtRef.current)) return;
    if (audioFollowSuppressedRef.current) return;
    navigateToAyah(ayah.id);
  }

  function playAyah(
    ayah: Ayah,
    shouldContinue = false,
    options: { fromAutoAdvance?: boolean } = {}
  ) {
    focusAyah(ayah);
    playingAyahIdRef.current = ayah.id;
    // An explicit play is fresh intent: clear the follow latch. Auto-advance
    // is not (a finger on the river keeps winning).
    if (!options.fromAutoAdvance) audioFollowSuppressedRef.current = false;
    setAutoAdvanceArmed(shouldContinue);
    setAudioBarMounted(true);

    const surah = surahById.get(ayah.surahId);
    setPlayerLabel(
      `${surah?.nameEnglish ?? "Surah"} ${ayah.ayahNumber} / ${reciter.nameEnglish}`
    );

    const audio = audioRef.current;
    if (audio) {
      const url = ayahAudioUrl(reciter.id, ayah.surahId, ayah.ayahNumber);
      if (url) {
        audioLoadingRef.current = true;
        audio.src = url;
        audio.load();
        audio.playbackRate = playbackRate;
        void audio
          .play()
          .then(() => setAutoplayBlocked(false))
          .catch(() => {
            audioLoadingRef.current = false;
            setAutoplayBlocked(true);
            setPlayerLabel("Tap play in the audio bar to start listening");
          });
      }
    }

    followAudioToAyah(ayah);
  }

  function playSelectedSurah() {
    const firstAyah = selectedSurah?.ayahs[0];
    if (firstAyah) playAyah(firstAyah, true);
  }

  function stopAudio() {
    setAutoAdvanceArmed(false);
    audioRef.current?.pause();
  }

  function handleAudioEnded() {
    if (!autoAdvanceArmed) return;
    // Auto-advance walks the PLAYING surah, never the selection: playback
    // survives the user jumping selection to another surah mid-listen.
    const playing = playingAyahIdRef.current
      ? ayahById.get(playingAyahIdRef.current)
      : null;
    if (!playing) return;
    const surah = surahById.get(playing.surahId);
    if (!surah) return;
    const index = surah.ayahs.findIndex((ayah) => ayah.id === playing.id);
    const next = index >= 0 ? surah.ayahs[index + 1] : undefined;
    if (next) {
      playAyah(next, true, { fromAutoAdvance: true });
    } else {
      setAutoAdvanceArmed(false);
      notify(`Finished ${surah.nameEnglish}`);
    }
  }

  function handlePlayPause() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      // Resuming from pause re-arms audio-follow.
      audioFollowSuppressedRef.current = false;
      if (!audio.currentSrc && !audio.src) {
        if (activeAyah) playAyah(activeAyah);
        return;
      }
      void audio
        .play()
        .then(() => setAutoplayBlocked(false))
        .catch(() => {
          setPlayerLabel("Tap play in the audio bar to start listening");
        });
    } else {
      audio.pause();
    }
  }

  function playAdjacentAyah(offset: -1 | 1) {
    if (!selectedSurah || activeIndexInSurah < 0) return;
    const next = selectedSurah.ayahs[activeIndexInSurah + offset];
    if (next) playAyah(next, autoAdvanceArmed);
  }

  function handleSetReaderView(view: ReaderView) {
    setReaderView(view);
    lockVisible(600);
  }

  function handleSetPlaybackRate(rate: number) {
    setPlaybackRate(rate);
    const audio = audioRef.current;
    if (audio) audio.playbackRate = rate;
  }

  function resetSettings() {
    setFontSize(QPC_SOURCE_FONT_SIZE);
    setShowTranslation(true);
    setShowTajweed(false);
    setShowWordTooltips(true);
    setSelectedTafseerId(DEFAULT_TAFSEER_ID);
    setReciterId("mishary");
    setReaderView("mushaf");
    // Thematic highlighting is content state, not a setting: intentionally
    // NOT cleared here (clear it from the pill or the Themes panel).
  }

  function backToBrowse() {
    stopAudio();
    setAudioBarMounted(false);
    setMode("browse");
    setQuery("");
    setMobileChromeHidden(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function jumpToVerse(surahId: number, ayahNumber: number) {
    const ayah = ayahById.get(`${surahId}:${ayahNumber}`);
    if (!ayah) return;
    goToAyah(ayah);
  }

  function jumpToJuz(juz: number) {
    const start = juzStarts.find((item) => item.juz === juz);
    if (!start) return;
    const ayah = ayahById.get(`${start.surahId}:${start.ayahNumber}`);
    if (!ayah) return;
    goToAyah(ayah);
  }

  function jumpToBookmark(verseKey: string) {
    const ayah = ayahById.get(verseKey);
    if (!ayah) return;
    setQuery("");
    goToAyah(ayah);
  }

  function bookmarkMeta(verseKey: string) {
    const ayah = ayahById.get(verseKey);
    if (!ayah) return null;
    return {
      surahName: surahById.get(ayah.surahId)?.nameEnglish ?? `Surah ${ayah.surahId}`,
      ayahNumber: ayah.ayahNumber,
      page: ayah.page,
    };
  }

  // Central keyboard model: Escape closes only the topmost open layer;
  // Ctrl/Cmd+K toggles search; arrows page the river; space toggles play.
  // PageUp/PageDown/Home/End fall through to native document scrolling.
  // Registered ONCE: the handler reads hot values through a ref so the
  // river's scroll-driven renders never multiply the listener.
  const keyHot = {
    ayahContextMenu,
    actionSheetVerseKey,
    themeDetails,
    searchOpen,
    settingsOpen,
    themesOpen,
    jumpOpen,
    mode,
    readerView,
    hasActiveAyah: Boolean(activeAyah),
    anyOverlayOpen,
    audioBarMounted,
    anchorPage,
    navigateToPage,
    handlePlayPause,
  };
  const keyHotRef = useRef(keyHot);
  useEffect(() => {
    keyHotRef.current = keyHot;
  });
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.isComposing) return;
      const hot = keyHotRef.current;
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      const inField =
        tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || Boolean(target?.isContentEditable);

      if ((event.key === "k" || event.key === "K") && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        setSearchOpen((current) => !current);
        return;
      }

      if (event.key === "Escape") {
        if (hot.ayahContextMenu) {
          setAyahContextMenu(null);
        } else if (hot.actionSheetVerseKey) {
          setActionSheetVerseKey(null);
        } else if (hot.themeDetails) {
          setThemeDetails(null);
        } else if (hot.searchOpen) {
          setSearchOpen(false);
        } else if (hot.settingsOpen) {
          setSettingsOpen(false);
        } else if (hot.themesOpen) {
          setThemesOpen(false);
        } else if (hot.jumpOpen) {
          setJumpOpen(false);
        } else if (hot.mode === "read" && hot.readerView === "mushaf" && hot.hasActiveAyah) {
          setActiveAyahId("");
        }
        return;
      }

      if (inField) return;

      if (
        hot.mode === "read" &&
        hot.readerView === "mushaf" &&
        !hot.anyOverlayOpen &&
        (event.key === "ArrowLeft" || event.key === "ArrowRight")
      ) {
        event.preventDefault();
        // Mushaf RTL convention: left arrow advances, right goes back.
        hot.navigateToPage(
          event.key === "ArrowLeft" ? hot.anchorPage + 1 : hot.anchorPage - 1
        );
        return;
      }

      if (event.key === " " && hot.audioBarMounted && !hot.anyOverlayOpen) {
        event.preventDefault();
        hot.handlePlayPause();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // (Horizontal swipe paging is intentionally gone: vertical flicks are the
  // river's primary navigation.) A tap on empty page background still
  // toggles the chrome below 1024px (Apple Books style).
  function onMushafTap(event: ReactMouseEvent) {
    if (anyOverlayOpen) return;
    if (window.innerWidth >= 1024) return;
    const target = event.target as Element | null;
    if (target?.closest("button, a, input, [role='dialog']")) return;
    setMobileChromeHidden((current) => !current);
  }

  const previousSurahId = selectedSurahId === 1 ? 114 : selectedSurahId - 1;
  const nextSurahId = selectedSurahId === 114 ? 1 : selectedSurahId + 1;
  const shouldShowBismillah =
    selectedSurah !== undefined && selectedSurah.id !== 1 && selectedSurah.id !== 9;
  const currentAudioSrc = activeAyah
    ? ayahAudioUrl(reciter.id, activeAyah.surahId, activeAyah.ayahNumber)
    : null;
  const previewAyah = ayahById.get("1:1") ?? null;
  const smart = parseSmartQuery(query);
  const smartSurahName =
    smart.kind === "verse"
      ? surahById.get(smart.surahId)?.nameEnglish ?? null
      : smart.kind === "number" && smart.value <= 114
        ? surahById.get(smart.value)?.nameEnglish ?? null
        : null;
  const smartForDrawer =
    smart.kind === "verse"
      ? (() => {
          const surah = surahById.get(smart.surahId);
          return surah && smart.ayahNumber <= surah.ayahs.length ? smart : { kind: "none" as const };
        })()
      : smart;

  const sheetCtx = actionSheetAyah ? buildAyahCtx(actionSheetAyah) : null;
  const menuCtx =
    ayahContextMenu && contextMenuAyah
      ? { x: ayahContextMenu.x, y: ayahContextMenu.y, ctx: buildAyahCtx(contextMenuAyah) }
      : null;

  // --- River callbacks (stable: the river holds them in a props ref) -------

  const handleAnchorChange = useCallback(
    (anchor: { page: number; direction: 1 | -1 }) => {
      anchorDirectionRef.current = anchor.direction;
      setAnchorPage(anchor.page);
    },
    []
  );

  // Every rAF frame while scrolling: drive the rail thumb imperatively (CSS
  // var transform), never React state.
  const handleScrollFraction = useCallback((fraction: number) => {
    railThumbRef.current?.style.setProperty("--rail-f", String(fraction));
  }, []);

  const handleUserScroll = useCallback(() => {
    lastUserScrollAtRef.current = Date.now();
    // A finger on the river while audio is playing or loading latches
    // auto-follow off until the user explicitly resumes or plays.
    if (audioPlayingRef.current || audioLoadingRef.current) {
      audioFollowSuppressedRef.current = true;
    }
  }, []);

  const registerRailThumb = useCallback((el: HTMLElement | null) => {
    railThumbRef.current = el;
  }, []);

  const handlePendingHandled = useCallback(() => {
    setPendingScrollTarget(null);
  }, []);

  const juzForPage = useCallback(
    (page: number) => pagesByNumber.get(page)?.[0]?.juz ?? 1,
    [pagesByNumber]
  );

  const surahNameForPage = useCallback(
    (page: number) => {
      const first = pagesByNumber.get(page)?.[0];
      if (!first) return "Quran";
      return surahById.get(first.surahId)?.nameEnglish ?? `Surah ${first.surahId}`;
    },
    [pagesByNumber, surahById]
  );

  return (
    // overflow-x-CLIP (not hidden): hidden would make this section a scroll
    // container and silently kill the browse toolbar's position: sticky.
    <section id="reader" className="min-h-svh overflow-x-clip bg-background text-foreground">
      {/* Header stack */}
      <div
        className={cx(
          "fixed inset-x-0 top-0 z-50",
          !reduce && "transition-transform duration-300",
          // Browse: the nav is a floating pill narrower than this strip, so
          // the strip itself must not eat clicks beside it (the pill
          // re-enables its own pointer events). It also never auto-hides.
          mode === "browse" && "pointer-events-none",
          // Read: scroll down -> the chrome slides away (all breakpoints);
          // scroll up or near-top -> it slides back. Never while the jump
          // panel is open (it anchors to the bar). mobileChromeHidden is the
          // separate tap-to-hide immersive path, mobile only.
          mode === "read" && headerHidden && !jumpOpen
            ? "-translate-y-full"
            : mode === "read" && mobileChromeHidden && "-translate-y-full lg:translate-y-0"
        )}
        style={!reduce ? { transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" } : undefined}
      >
        {mode === "browse" ? (
          /* BEGIN B-REGION: reader-site-nav mount (Implementer B only) */
          <ReaderSiteNav
            query={query}
            onQueryChange={setQuery}
            filter={surahFilter === "all" ? "surah" : surahFilter}
            onFilterChange={(filter) =>
              setSurahFilter(filter === "surah" ? "all" : filter)
            }
            onOpenSettings={() => {
              setSettingsSection(null);
              setSettingsOpen(true);
            }}
          />
          /* END B-REGION: reader-site-nav mount */
        ) : (
          <>
            {/* ONE merged bar: site chrome + reading context (replaces the
                old ReaderSiteNav row + ReaderContextBar row). */}
            <ReaderChromeBar
              onBack={backToBrowse}
              onOpenSearch={() => setSearchOpen(true)}
              surahChipLabel={surahChipLabel}
              jumpOpen={jumpOpen}
              onToggleJump={() => {
                setJumpTab("surah");
                setJumpOpen((current) => !current);
              }}
              readerView={readerView}
              onSetReaderView={handleSetReaderView}
              pageNumber={anchorPage}
              juzLabel={anchorPageJuzRange || `Juz ${readerJuz}`}
              hizbNumber={readerHizb}
              onOpenJumpAtPage={() => {
                setJumpTab("page");
                setJumpOpen(true);
              }}
              themesActive={themeHighlightOn}
              themesLabel={themesSummary ? `Themes: ${themesSummary}` : "Themes"}
              onOpenThemes={() => setThemesOpen(true)}
              activeAyahBookmarked={Boolean(activeAyah && bookmarks.includes(activeAyah.id))}
              hasActiveAyah={Boolean(activeAyah)}
              onToggleActiveBookmark={() => {
                if (activeAyah) toggleBookmark(activeAyah.id);
              }}
              onOpenSettings={() => {
                setSettingsSection(null);
                setSettingsOpen(true);
              }}
              progress={readingProgress}
            >
              <JumpPanel
                open={jumpOpen}
                initialTab={jumpTab}
                onClose={() => setJumpOpen(false)}
                surahs={surahs}
                surahById={surahById}
                activeSurahId={selectedSurahId}
                activeAyahNumber={activeAyah?.ayahNumber ?? 1}
                currentPage={anchorPage}
                juzStarts={juzStarts}
                bookmarks={bookmarks}
                bookmarkMeta={bookmarkMeta}
                pageBookmarks={pageBookmarks}
                onSelectSurah={selectSurah}
                onSelectVerse={jumpToVerse}
                onSelectJuz={jumpToJuz}
                onSelectPage={selectPage}
                onSelectBookmark={jumpToBookmark}
                onSelectPageBookmark={selectPage}
              />
            </ReaderChromeBar>
            {/* Always mounted: the whole stack slides away on scroll-down
                now, so unmounting the tabs would only cause pop-in on the
                way back. */}
            <MobileViewTabs readerView={readerView} onSetReaderView={handleSetReaderView} />
            {/* Active-theme status pill: hangs below whatever header rows are
                visible and rides the mobileChromeHidden translate. */}
            <ActiveThemePill
              model={themePillModel}
              onOpenPanel={() => setThemesOpen(true)}
              onClearAll={clearThemeHighlights}
              onRemoveSection={removeThemeSection}
            />
          </>
        )}
      </div>

      {/* Scroll content */}
      <div
        className={cx(
          // Read chrome: 56px bar + the 40px mobile view tabs below lg.
          // Browse chrome: the floating pill (8-12px inset + 56px bar + 48px
          // mobile filter row below lg) plus breathing room.
          mode === "read" ? "pt-24 lg:pt-14" : "pt-[8rem] lg:pt-20",
          audioBarMounted ? "pb-36" : "pb-12"
        )}
      >
        {mode === "browse" ? (
          <>
            {/* BEGIN B-REGION: browse-landing call site (Implementer B only) */}
            <BrowseLanding
              surahs={surahs}
              loading={loading}
              query={query}
              onQueryChange={setQuery}
              filter={surahFilter === "all" ? "surah" : surahFilter}
              onFilterChange={(filter) =>
                setSurahFilter(filter === "surah" ? "all" : filter)
              }
              resume={resumeState}
              onResume={() => {
                if (!resumeRaw) return;
                setSelectedSurahId(resumeRaw.surahId);
                setActiveAyahId(resumeRaw.ayahId);
                setAnchorPage(resumeRaw.page);
                setPendingScrollTarget({ kind: "ayah", verseKey: resumeRaw.ayahId });
                setMode("read");
              }}
              onSelectSurah={selectSurah}
              onJumpToVerse={jumpToVerse}
              onJumpToJuz={jumpToJuz}
              onSelectPage={selectPage}
              juzStarts={juzStarts.map((start) => ({
                ...start,
                page: ayahById.get(`${start.surahId}:${start.ayahNumber}`)?.page ?? 1,
              }))}
              bookmarks={bookmarks.flatMap((verseKey) => {
                const meta = bookmarkMeta(verseKey);
                return meta ? [{ verseKey, ...meta }] : [];
              })}
              onJumpToBookmark={jumpToBookmark}
            />
            {/* END B-REGION: browse-landing call site */}
          </>
        ) : loading || !selectedSurah ? (
          <div className="mx-auto w-full max-w-[50rem] px-4 pt-8">
            <div className="rounded-2xl bg-surface p-8 text-center text-sm text-muted">
              Loading the Quran...
            </div>
          </div>
        ) : (
          <>
            {readerView === "mushaf" ? (
              <>
                {/* The river scrolls the DOCUMENT window (header auto-hide,
                    context-menu dismissal, and the site nav all depend on
                    window scroll). SurahHeader intentionally absent: the
                    glyph layout carries surah_name/basmallah lines. */}
                <div onClick={onMushafTap} className="mx-auto w-full px-4">
                  {mushafLayoutStatus === "error" ? (
                    <MushafLayoutNotice message="Could not load the mushaf layout. Refresh to try again." />
                  ) : !mushafLayout ? (
                    <MushafLayoutNotice message="Preparing the mushaf layout..." />
                  ) : (
                    <MushafRiver
                      ref={riverRef}
                      layout={mushafLayout}
                      pagesByNumber={pagesByNumber}
                      surahById={surahById}
                      ayahById={ayahById}
                      hizbIndex={hizbIndex}
                      fontSize={fontSize}
                      paperLeaf={MUSHAF_PAPER_LEAF}
                      activeAyahId={activeAyahId}
                      bookmarkedIds={bookmarks}
                      bookmarkedPages={pageBookmarks}
                      onTogglePageBookmark={togglePageBookmark}
                      themeTintByVerseKey={mushafThemeTints}
                      anchorPage={anchorPage}
                      scrubbing={scrubbing}
                      reducedMotion={Boolean(reduce)}
                      pendingTarget={pendingScrollTarget}
                      onPendingHandled={handlePendingHandled}
                      onAnchorChange={handleAnchorChange}
                      onScrollFraction={handleScrollFraction}
                      onUserScroll={handleUserScroll}
                      onPagePillClick={() => {
                        setJumpTab("page");
                        setJumpOpen(true);
                      }}
                      onEndCapBeginning={() => navigateToPage(1, "instant")}
                      onEndCapAllSurahs={backToBrowse}
                      onSelect={focusAyah}
                      onPlay={(ayah) => playAyah(ayah)}
                      onContextMenu={openAyahContextMenu}
                      onGlyphLongPress={openActionSheetForVerse}
                    />
                  )}
                </div>

                {/* The floating page-position capsule used to mount here; it
                    duplicated the printed folio footer each page already
                    carries (two page readouts stacked while scrolling), so
                    it was removed - the folio, context bar, and progress
                    rail carry position now. */}

                {/* Desktop hover word translations: pure event delegation off
                    the glyph buttons' data-* attributes; mounted once, never
                    re-renders the river's cards. */}
                <MushafWordTooltip
                  enabled={showWordTooltips}
                  wbwByAyah={wbwByAyah}
                  onNeedSurah={ensureWbwSurah}
                />

                {mushafLayout ? (
                  <ProgressRail
                    anchorPage={anchorPage}
                    hizbIndex={hizbIndex}
                    juzForPage={juzForPage}
                    surahNameForPage={surahNameForPage}
                    onJump={(page) => {
                      latchAudioFollowIfActive();
                      navigateToPage(page);
                    }}
                    onScrubStart={() => {
                      latchAudioFollowIfActive();
                      setScrubbing(true);
                    }}
                    onScrub={(page) => {
                      setAnchorPage(page);
                      riverRef.current?.scrollToPage(page, "instant");
                    }}
                    onScrubEnd={() => setScrubbing(false)}
                    registerThumb={registerRailThumb}
                    reducedMotion={Boolean(reduce)}
                  />
                ) : null}

                <SelectedAyahToolbar
                  ctx={activeAyahCtx}
                  audioBarMounted={audioBarMounted}
                  onPlay={() => {
                    if (activeAyah) playAyah(activeAyah);
                  }}
                  onToggleBookmark={() => {
                    if (activeAyah) toggleBookmark(activeAyah.id);
                  }}
                  onOpenTafsir={() => {
                    if (activeAyah) openTafseerForAyah(activeAyah);
                  }}
                  onThemeDetails={() => {
                    if (activeAyah) openThemeDetailsForAyah(activeAyah.id);
                  }}
                  onCopyArabic={() => {
                    if (activeAyah) copyAyah(activeAyah);
                  }}
                  onContinue={() => {
                    if (activeAyah) playAyah(activeAyah, true);
                  }}
                  onCopyWithMeaning={() => {
                    if (activeAyah) copyAyah(activeAyah, true);
                  }}
                  onCopyLink={() => {
                    if (activeAyah) copyAyahLink(activeAyah);
                  }}
                  onClear={() => setActiveAyahId("")}
                />
              </>
            ) : (
              <>
                {/* SurahHeader renders ONLY in study view: the mushaf river
                    carries its own printed-page chrome. */}
                <SurahHeader
                  surah={selectedSurah}
                  onListen={playSelectedSurah}
                  onOpenTranslationSettings={() => {
                    setSettingsSection("translation");
                    setSettingsOpen(true);
                  }}
                  showBismillah={shouldShowBismillah}
                />
                <div className="mx-auto w-full max-w-[50rem] px-4">
                {visibleAyahs.length === 0 ? (
                  <div className="rounded-2xl bg-surface p-8 text-center text-sm text-muted">
                    No ayahs found.
                  </div>
                ) : (
                  <>
                    {visibleAyahs.map((ayah) => (
                      <TranslationCell
                        key={ayah.id}
                        ayah={ayah}
                        fontSize={fontSize}
                        showTranslation={showTranslation}
                        translationText={translationById[ayah.id] ?? null}
                        showTajweed={showTajweed}
                        tajweedSegments={getDisplayTajweedSegments(ayah, tajweedByAyah)}
                        glyphWords={mushafLayout?.wordsByVerse[ayah.id] ?? null}
                        isActive={ayah.id === activeAyahId}
                        isBookmarked={bookmarks.includes(ayah.id)}
                        themeTint={studyThemeByAyahId.get(ayah.id)?.tint ?? null}
                        themeChip={studyThemeByAyahId.get(ayah.id)?.chip ?? null}
                        tafseerOpen={expandedTafseerIds.includes(ayah.id)}
                        tafseer={selectedTafseer}
                        tafseerStatus={tafseerStatus[selectedTafseerId] ?? "idle"}
                        tafseerText={tafseerById[selectedTafseerId]?.[ayah.id] ?? null}
                        onPlay={() => playAyah(ayah)}
                        onContinueFrom={() => playAyah(ayah, true)}
                        onToggleBookmark={() => toggleBookmark(ayah.id)}
                        onToggleTafseer={() => toggleTafseer(ayah.id)}
                        onCopyArabic={() => copyAyah(ayah)}
                        onCopyWithMeaning={() => copyAyah(ayah, true)}
                        onCopyLink={() => copyAyahLink(ayah)}
                        onOpenSettingsTafsir={() => {
                          setSettingsSection("tafsir");
                          setSettingsOpen(true);
                        }}
                        onOpenThemeDetails={() => openThemeDetailsForAyah(ayah.id)}
                        onContextMenu={(event) => openAyahContextMenu(ayah, event)}
                        onLongPress={() => openActionSheetForVerse(ayah.id)}
                      />
                    ))}
                    <EndOfSurahControls
                      previousName={
                        surahById.get(previousSurahId)?.nameEnglish ?? `Surah ${previousSurahId}`
                      }
                      nextName={surahById.get(nextSurahId)?.nameEnglish ?? `Surah ${nextSurahId}`}
                      onPreviousSurah={() => selectSurah(previousSurahId)}
                      onBeginningOfSurah={() => {
                        window.scrollTo({
                          top: 0,
                          behavior: reduce ? "instant" : "smooth",
                        });
                      }}
                      onNextSurah={() => selectSurah(nextSurahId)}
                    />
                  </>
                )}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <SettingsDrawer
        open={settingsOpen}
        initialSection={settingsSection}
        onClose={() => setSettingsOpen(false)}
        fontSize={fontSize}
        onSetFontSize={setFontSize}
        showTajweed={showTajweed}
        onSetShowTajweed={setShowTajweed}
        tajweedStatus={tajweedStatus}
        showTranslation={showTranslation}
        onSetShowTranslation={setShowTranslation}
        showWordTooltips={showWordTooltips}
        onSetShowWordTooltips={setShowWordTooltips}
        tafseerId={selectedTafseerId}
        onSetTafseerId={(id) => {
          setSelectedTafseerId(id);
          if (expandedTafseerIds.length > 0) ensureTafseerLoaded(id);
        }}
        reciterId={reciterId}
        onSetReciterId={setReciterId}
        previewAyah={previewAyah}
        previewSegments={
          previewAyah ? getDisplayTajweedSegments(previewAyah, tajweedByAyah) : null
        }
        previewGlyphWords={mushafLayout?.wordsByVerse["1:1"] ?? null}
        previewTranslation={previewAyah ? translationById[previewAyah.id] ?? null : null}
        onReset={resetSettings}
      />

      <ThemesPanel
        open={themesOpen}
        onClose={() => setThemesOpen(false)}
        data={themeData}
        status={themeStatus}
        onRetry={() => setThemeStatus("idle")}
        scope={themeScope}
        activeTopicId={activeTopicId}
        activeSectionIds={activeSectionIds}
        allSections={allSections}
        onSetAllSections={setAllSectionsMode}
        onToggleSection={toggleThemeSection}
        onActivateTopic={activateTopic}
        onOpenDetails={setThemeDetails}
      />

      <ThemeDetails
        target={themeDetails}
        onClose={() => setThemeDetails(null)}
        data={themeData}
        status={themeStatus}
        onRetry={() => setThemeStatus("idle")}
        activeTopicId={activeTopicId}
        activeSectionIds={activeSectionIds}
        allSections={allSections}
        onActivateTopic={activateTopic}
        onToggleSection={(sectionId) => {
          toggleThemeSection(sectionId);
          setThemeDetails(null);
        }}
      />

      <SearchDrawer
        open={searchOpen}
        query={query}
        onSetQuery={setQuery}
        onClose={() => setSearchOpen(false)}
        results={searchResultItems}
        smart={smartForDrawer}
        smartSurahName={smartSurahName}
        onGoToVerse={jumpToVerse}
        onGoToSurah={selectSurah}
        onGoToJuz={jumpToJuz}
        onGoToPage={selectPage}
        onSelectResult={(ayah) => jumpToVerse(ayah.surahId, ayah.ayahNumber)}
      />

      <AyahContextMenu
        state={menuCtx}
        onPlay={() => {
          setAyahContextMenu(null);
          if (contextMenuAyah) playAyah(contextMenuAyah);
        }}
        onContinue={() => {
          setAyahContextMenu(null);
          if (contextMenuAyah) playAyah(contextMenuAyah, true);
        }}
        onToggleBookmark={() => {
          setAyahContextMenu(null);
          if (contextMenuAyah) toggleBookmark(contextMenuAyah.id);
        }}
        onOpenTafsir={() => {
          if (contextMenuAyah) openTafseerForAyah(contextMenuAyah);
        }}
        onThemeDetails={() => {
          if (contextMenuAyah) openThemeDetailsForAyah(contextMenuAyah.id);
        }}
        onCopyArabic={() => {
          if (contextMenuAyah) copyAyah(contextMenuAyah);
        }}
        onCopyWithMeaning={() => {
          if (contextMenuAyah) copyAyah(contextMenuAyah, true);
        }}
        onCopyLink={() => {
          if (contextMenuAyah) copyAyahLink(contextMenuAyah);
        }}
        onClose={() => setAyahContextMenu(null)}
      />

      <AyahActionSheet
        ctx={sheetCtx}
        onPlay={() => {
          setActionSheetVerseKey(null);
          if (actionSheetAyah) playAyah(actionSheetAyah);
        }}
        onContinue={() => {
          setActionSheetVerseKey(null);
          if (actionSheetAyah) playAyah(actionSheetAyah, true);
        }}
        onToggleBookmark={() => {
          setActionSheetVerseKey(null);
          if (actionSheetAyah) toggleBookmark(actionSheetAyah.id);
        }}
        onOpenTafsir={() => {
          setActionSheetVerseKey(null);
          if (actionSheetAyah) openTafseerForAyah(actionSheetAyah);
        }}
        onThemeDetails={() => {
          if (actionSheetAyah) openThemeDetailsForAyah(actionSheetAyah.id);
        }}
        onCopyArabic={() => {
          setActionSheetVerseKey(null);
          if (actionSheetAyah) copyAyah(actionSheetAyah);
        }}
        onCopyWithMeaning={() => {
          setActionSheetVerseKey(null);
          if (actionSheetAyah) copyAyah(actionSheetAyah, true);
        }}
        onCopyLink={() => {
          setActionSheetVerseKey(null);
          if (actionSheetAyah) copyAyahLink(actionSheetAyah);
        }}
        onClose={() => setActionSheetVerseKey(null)}
      />

      {mode === "read" ? (
        <AudioBar
          mounted={audioBarMounted}
          audioRef={audioRef}
          playing={audioPlaying}
          playerLabel={playerLabel}
          transientLabel={transientLabel}
          reciterName={reciter.nameEnglish}
          autoAdvanceArmed={autoAdvanceArmed}
          onDisarmAutoAdvance={() => setAutoAdvanceArmed(false)}
          onPlayPause={handlePlayPause}
          onPrevAyah={() => playAdjacentAyah(-1)}
          onNextAyah={() => playAdjacentAyah(1)}
          canPrev={canPrevAyah}
          canNext={canNextAyah}
          onClose={() => {
            stopAudio();
            setAudioBarMounted(false);
          }}
          onOpenReciter={() => {
            setSettingsSection("audio");
            setSettingsOpen(true);
          }}
          currentSrc={currentAudioSrc}
          playbackRate={playbackRate}
          onSetPlaybackRate={handleSetPlaybackRate}
          autoplayBlocked={autoplayBlocked}
        />
      ) : null}

      <ReaderToast message={toast} />

      <audio
        ref={audioRef}
        preload="none"
        hidden
        onPlay={() => {
          audioPlayingRef.current = true;
          audioLoadingRef.current = false;
          setAudioPlaying(true);
        }}
        onPause={() => {
          audioPlayingRef.current = false;
          setAudioPlaying(false);
        }}
        onEnded={handleAudioEnded}
      />
    </section>
  );
}
