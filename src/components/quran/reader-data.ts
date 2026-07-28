import { getTafseer } from "@/lib/quran-tafseer-data";

export type Ayah = {
  id: string;
  surahId: number;
  ayahNumber: number;
  textUthmani: string;
  textSimple: string;
  juz: number;
  page: number;
  hizbQuarter: number; // 1-240, Madani hizb quarters
};

export type Surah = {
  id: number;
  nameArabic: string;
  nameEnglish: string;
  nameTranslation: string;
  revelationPlace: "meccan" | "medinan";
  ayahCount: number;
  ayahs: Ayah[];
};

export type Translation = {
  id: string;
  text: string;
  translatorId: string;
};

export type ReaderView = "mushaf" | "study";
export type GlyphType = "word" | "end" | "decor";
export type MushafLineType = "ayah" | "surah_name" | "basmallah" | "empty";

export type GlyphWord = {
  code: string;
  type: GlyphType;
  verseKey: string;
  position: number;
};

export type MushafLine = {
  lineNumber: number;
  lineType: MushafLineType;
  isCentered: boolean;
  surahNumber?: number;
  words: GlyphWord[];
};

export type MushafPageData = {
  pageNumber: number;
  lines: MushafLine[];
};

// A verse's glyph word with its mushaf placement: the page number tells the
// study view which QPC page font renders the code.
export type PlacedGlyphWord = {
  page: number;
  line: number;
  position: number;
  code: string;
  type: GlyphType;
};

export type RawMushafLayout = {
  source?: string;
  pages: Record<
    string,
    {
      lines: Record<string, GlyphWord[]>;
      lineMeta?: Record<
        string,
        {
          lineType?: MushafLineType;
          isCentered?: boolean;
          surahNumber?: number;
        }
      >;
    }
  >;
  wordsByVerse: Record<string, PlacedGlyphWord[]>;
};

export type BuiltMushafLayout = {
  pages: Record<number, MushafPageData>;
  ayahIdsByPage: Record<number, string[]>;
  totalPages: number;
  // Per-verse glyph words in mushaf position order; the study view renders
  // its Arabic from these so both views share one source of truth.
  wordsByVerse: Record<string, PlacedGlyphWord[]>;
};

export type MushafLayoutStatus = "idle" | "loading" | "ready" | "error";
export type AyahContextMenuState = {
  ayahId: string;
  x: number;
  y: number;
};

export const LAST_STATE_KEY = "ilm-quran:last-state";
export const BOOKMARKS_KEY = "ilm-quran:bookmarks";
// Page bookmarks are the "mushaf ribbons": whole-page markers, plural, kept
// separate from ayah bookmarks (numbers, not verse keys).
export const PAGE_BOOKMARKS_KEY = "ilm-quran:page-bookmarks";
// Thematic highlighting is content state, not a reader setting: it persists
// under its own key (like bookmarks), is invisible to the Resume card, and is
// intentionally NOT cleared by resetSettings().
export const THEMATIC_KEY = "ilm-quran:thematic";
export const TOTAL_MUSHAF_PAGES = 604;
export const TOTAL_HIZBS = 60;

export function hizbFromQuarter(hizbQuarter: number): number {
  return Math.floor((hizbQuarter - 1) / 4) + 1; // 1-60
}

export type HizbIndex = {
  // hizbStartPage[h - 1] = mushaf page on which hizb h begins
  hizbStartPage: number[];
  // hizbStartVerseKey[h - 1] = verse key of the first ayah of hizb h
  hizbStartVerseKey: string[];
  hizbForPage(page: number): number; // greatest h with start page <= page
  pageStartsHizb(page: number): number | null; // h when page is a hizb-start page, else null
};

// Verified fixture extracted 2026-06-11 from the shipped web JSON: hizb ->
// [startVerseKey, startPage]. buildHizbIndex must reproduce it exactly; the
// dev-mode assertion below guards against data regressions.
const HIZB_FIXTURE: Array<[string, number]> = [
  ["1:1", 1], ["2:75", 11], ["2:142", 22], ["2:203", 32], ["2:253", 42],
  ["3:15", 51], ["3:93", 62], ["3:171", 72], ["4:24", 82], ["4:88", 92],
  ["4:148", 102], ["5:27", 112], ["5:82", 121], ["6:36", 132], ["6:111", 142],
  ["7:1", 151], ["7:88", 162], ["7:171", 173], ["8:41", 182], ["9:34", 192],
  ["9:93", 201], ["10:26", 212], ["11:6", 222], ["11:84", 231], ["12:53", 242],
  ["13:19", 252], ["15:1", 262], ["16:51", 272], ["17:1", 282], ["17:99", 292],
  ["18:75", 302], ["20:1", 312], ["21:1", 322], ["22:1", 332], ["23:1", 342],
  ["24:21", 352], ["25:21", 362], ["26:111", 371], ["27:56", 382], ["28:51", 392],
  ["29:46", 402], ["31:22", 413], ["33:31", 422], ["34:24", 431], ["36:28", 442],
  ["37:145", 451], ["39:32", 462], ["40:41", 472], ["41:47", 482], ["43:24", 491],
  ["46:1", 502], ["48:18", 513], ["51:31", 522], ["55:1", 531], ["58:1", 542],
  ["62:1", 553], ["67:1", 562], ["72:1", 572], ["78:1", 582], ["87:1", 591],
];

// Derived from the data, never hand-typed: the first ayah whose hizbQuarter
// marks a not-yet-seen hizb is that hizb's start (single pass in canonical
// order). hizbForPage = binary search; pageStartsHizb = exact-match Map
// lookup (no two hizbs start on the same mushaf page).
export function buildHizbIndex(surahs: Surah[]): HizbIndex {
  const hizbStartPage: number[] = [];
  const hizbStartVerseKey: string[] = [];
  for (const surah of surahs) {
    for (const ayah of surah.ayahs) {
      const hizb = hizbFromQuarter(ayah.hizbQuarter);
      if (hizbStartPage.length < hizb) {
        hizbStartPage.push(ayah.page);
        hizbStartVerseKey.push(ayah.id);
      }
    }
  }

  const startsByPage = new Map<number, number>();
  hizbStartPage.forEach((page, index) => {
    if (!startsByPage.has(page)) startsByPage.set(page, index + 1);
  });

  if (process.env.NODE_ENV !== "production" && hizbStartPage.length > 0) {
    const matchesFixture =
      hizbStartPage.length === HIZB_FIXTURE.length &&
      HIZB_FIXTURE.every(
        ([verseKey, page], index) =>
          hizbStartVerseKey[index] === verseKey && hizbStartPage[index] === page
      );
    if (!matchesFixture) {
      console.error(
        "buildHizbIndex: derived hizb starts diverge from the verified fixture",
        { hizbStartPage, hizbStartVerseKey }
      );
    }
  }

  return {
    hizbStartPage,
    hizbStartVerseKey,
    hizbForPage(page: number): number {
      if (hizbStartPage.length === 0) return 1;
      let low = 0;
      let high = hizbStartPage.length - 1;
      let result = 0;
      while (low <= high) {
        const mid = (low + high) >> 1;
        if (hizbStartPage[mid] <= page) {
          result = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
      return result + 1;
    },
    pageStartsHizb(page: number): number | null {
      return startsByPage.get(page) ?? null;
    },
  };
}

export type SavedThematicState = {
  activeTopicId?: string | null;
  activeSectionIds?: string[];
  allSections?: boolean;
  updatedAt?: number;
};

// "{surahId}:{ayahStart}-{ayahEnd}:{order}", e.g. "2:1-39:1".
export const SECTION_ID_PATTERN = /^\d{1,3}:\d{1,3}-\d{1,3}:\d{1,3}$/;
// Topic ids are short ASCII slugs, e.g. "tawheed".
export const TOPIC_ID_PATTERN = /^[\w-]{1,80}$/;

// Curated "most-read" surahs shown when the Popular filter is on - the
// chapters people open most for daily recitation and memorization.
export const POPULAR_SURAH_IDS = [1, 2, 18, 36, 55, 56, 67, 78, 112, 113, 114];

// 14 steps of 2px for the Arabic size stepper (26-52). The stored value stays
// raw px so legacy saves restore unchanged; odd legacy values snap on display.
export const FONT_SIZE_STEPS = [
  26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52,
];

export function snapFontSize(px: number): number {
  let nearest = FONT_SIZE_STEPS[0];
  for (const step of FONT_SIZE_STEPS) {
    if (Math.abs(step - px) < Math.abs(nearest - px)) nearest = step;
  }
  return nearest;
}

// Context payload shared by the ayah menus, action sheet, and the selected
// ayah toolbar - everything those surfaces need to render without lookups.
export type AyahActionContext = {
  verseKey: string;
  surahName: string;
  ayahNumber: number;
  page: number;
  juz: number;
  isBookmarked: boolean;
  hasTranslation: boolean;
};

export type SmartQueryResult =
  | { kind: "verse"; surahId: number; ayahNumber: number }
  | { kind: "number"; value: number }
  | { kind: "none" };

// "2:255" -> verse jump; bare "42" -> surah/juz/page interpretations. Anything
// else falls through to the regular text search. Verse ayah validity against
// the actual surah length is checked by the consumer.
export function parseSmartQuery(raw: string): SmartQueryResult {
  const trimmed = raw.trim();
  const verseMatch = /^(\d{1,3}):(\d{1,3})$/.exec(trimmed);
  if (verseMatch) {
    const surahId = Number(verseMatch[1]);
    const ayahNumber = Number(verseMatch[2]);
    if (surahId >= 1 && surahId <= 114 && ayahNumber >= 1) {
      return { kind: "verse", surahId, ayahNumber };
    }
    return { kind: "none" };
  }
  if (/^\d{1,3}$/.test(trimmed)) {
    const value = Number(trimmed);
    if (value >= 1 && value <= TOTAL_MUSHAF_PAGES) return { kind: "number", value };
  }
  return { kind: "none" };
}

export type SavedReaderState = {
  surahId?: number;
  ayahId?: string;
  reciterId?: string;
  fontSize?: number;
  showTranslation?: boolean;
  showTajweed?: boolean;
  // Mushaf hover word translations (desktop only). Optional and additive:
  // old saves restore unchanged and keep the default (on).
  showWordTooltips?: boolean;
  tafseerId?: string;
  readerView?: ReaderView;
  page?: number;
};

export type SavedReaderStateSetters = {
  setSelectedSurahId: (value: number) => void;
  setActiveAyahId: (value: string) => void;
  setReciterId: (value: string) => void;
  setFontSize: (value: number) => void;
  setShowTranslation: (value: boolean) => void;
  setShowTajweed: (value: boolean) => void;
  setShowWordTooltips: (value: boolean) => void;
  setSelectedTafseerId: (value: string) => void;
  setReaderView: (value: ReaderView) => void;
  setCurrentPage: (value: number) => void;
  setBookmarks: (value: string[]) => void;
  setPageBookmarks: (value: number[]) => void;
  setQuery: (value: string) => void;
  onEnterReadMode: () => void;
  onRestored: () => void;
};

export function restoreSavedReaderState({
  setSelectedSurahId,
  setActiveAyahId,
  setReciterId,
  setFontSize,
  setShowTranslation,
  setShowTajweed,
  setShowWordTooltips,
  setSelectedTafseerId,
  setReaderView,
  setCurrentPage,
  setBookmarks,
  setPageBookmarks,
  setQuery,
  onEnterReadMode,
  onRestored,
}: SavedReaderStateSetters) {
  const timeout = window.setTimeout(() => {
    try {
      const saved = window.localStorage.getItem(LAST_STATE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SavedReaderState;
        if (parsed.surahId) setSelectedSurahId(parsed.surahId);
        if (parsed.ayahId) setActiveAyahId(parsed.ayahId);
        if (parsed.reciterId) setReciterId(parsed.reciterId);
        if (parsed.fontSize) setFontSize(parsed.fontSize);
        if (typeof parsed.showTranslation === "boolean") {
          setShowTranslation(parsed.showTranslation);
        }
        if (typeof parsed.showTajweed === "boolean") {
          setShowTajweed(parsed.showTajweed);
        }
        if (typeof parsed.showWordTooltips === "boolean") {
          setShowWordTooltips(parsed.showWordTooltips);
        }
        if (parsed.tafseerId && getTafseer(parsed.tafseerId)) {
          setSelectedTafseerId(parsed.tafseerId);
        }
        if (parsed.readerView === "mushaf" || parsed.readerView === "study") {
          setReaderView(parsed.readerView);
        }
        if (
          typeof parsed.page === "number" &&
          Number.isFinite(parsed.page) &&
          parsed.page >= 1 &&
          parsed.page <= TOTAL_MUSHAF_PAGES
        ) {
          setCurrentPage(parsed.page);
        }
      }
    } catch {
      // Local storage is a convenience only.
    }

    try {
      const savedBookmarks = window.localStorage.getItem(BOOKMARKS_KEY);
      if (savedBookmarks) {
        const parsedBookmarks = JSON.parse(savedBookmarks);
        if (Array.isArray(parsedBookmarks)) setBookmarks(parsedBookmarks);
      }
    } catch {
      // Local storage is a convenience only.
    }

    try {
      const savedPageBookmarks = window.localStorage.getItem(PAGE_BOOKMARKS_KEY);
      if (savedPageBookmarks) {
        const parsedPageBookmarks = JSON.parse(savedPageBookmarks);
        if (
          Array.isArray(parsedPageBookmarks) &&
          parsedPageBookmarks.every(
            (page) =>
              typeof page === "number" &&
              Number.isInteger(page) &&
              page >= 1 &&
              page <= TOTAL_MUSHAF_PAGES
          )
        ) {
          setPageBookmarks(parsedPageBookmarks);
        }
      }
    } catch {
      // Local storage is a convenience only.
    }

    try {
      const params = new URLSearchParams(window.location.search);
      // /quran/read/<n> is a first-class entry point on this site - the surah
      // links, the juz index, search results, and the sitemap all point at it
      // - so the path counts as a surah hint exactly like ?surah= does.
      const pathMatch = /\/quran\/read\/(\d{1,3})(?:\/|$)/.exec(
        window.location.pathname
      );
      const routeSurah = Number(params.get("surah") ?? pathMatch?.[1] ?? "");
      const routeAyah = params.get("ayah");
      const routeQuery = params.get("q") ?? params.get("search");

      if (Number.isFinite(routeSurah) && routeSurah >= 1 && routeSurah <= 114) {
        setSelectedSurahId(routeSurah);
        setActiveAyahId(routeAyah && routeAyah.includes(":") ? routeAyah : `${routeSurah}:1`);
        // An explicit surah/ayah deep link means "take me to the reading
        // view", so skip the browse directory in that case.
        onEnterReadMode();
      } else if (routeAyah && routeAyah.includes(":")) {
        const [surahPart] = routeAyah.split(":");
        const ayahSurah = Number(surahPart);
        if (Number.isFinite(ayahSurah) && ayahSurah >= 1 && ayahSurah <= 114) {
          setSelectedSurahId(ayahSurah);
          setActiveAyahId(routeAyah);
          onEnterReadMode();
        }
      }

      if (routeQuery) setQuery(routeQuery);
    } catch {
      // URL params are optional entry hints.
    } finally {
      onRestored();
    }
  }, 0);

  return () => window.clearTimeout(timeout);
}

export function buildMushafLayout(raw: RawMushafLayout): BuiltMushafLayout {
  const pages: Record<number, MushafPageData> = {};
  const ayahIdsByPage: Record<number, string[]> = {};

  for (const [pageStr, pageRaw] of Object.entries(raw.pages ?? {})) {
    const pageNumber = Number(pageStr);
    if (!Number.isFinite(pageNumber)) continue;

    const lines = Object.entries(pageRaw.lines ?? {})
      .map(([lineStr, words]) => {
        const meta = pageRaw.lineMeta?.[lineStr];
        return {
          lineNumber: Number(lineStr),
          lineType: meta?.lineType ?? "ayah",
          isCentered: meta?.isCentered ?? false,
          surahNumber: meta?.surahNumber,
          words: Array.isArray(words) ? [...words] : [],
        } satisfies MushafLine;
      })
      .filter((line) => Number.isFinite(line.lineNumber))
      .sort((a, b) => a.lineNumber - b.lineNumber);

    pages[pageNumber] = { pageNumber, lines };

    const seen = new Set<string>();
    const ayahIds: string[] = [];
    for (const line of lines) {
      for (const word of line.words) {
        if (seen.has(word.verseKey)) continue;
        seen.add(word.verseKey);
        ayahIds.push(word.verseKey);
      }
    }
    ayahIdsByPage[pageNumber] = ayahIds;
  }

  // The data is already position-sorted; the sort is cheap insurance so the
  // study view can never render a verse's glyphs out of order.
  const wordsByVerse: Record<string, PlacedGlyphWord[]> = {};
  for (const [verseKey, words] of Object.entries(raw.wordsByVerse ?? {})) {
    wordsByVerse[verseKey] = Array.isArray(words)
      ? [...words].sort((a, b) => a.position - b.position)
      : [];
  }

  return {
    pages,
    ayahIdsByPage,
    totalPages: Object.keys(pages).length,
    wordsByVerse,
  };
}

export function parseVerseKey(verseKey: string) {
  const [surahPart, ayahPart] = verseKey.split(":");
  const surahId = Number(surahPart);
  const ayahNumber = Number(ayahPart);
  if (!Number.isFinite(surahId) || !Number.isFinite(ayahNumber)) return null;
  return { surahId, ayahNumber };
}
