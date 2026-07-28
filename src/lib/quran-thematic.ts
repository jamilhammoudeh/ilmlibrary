/**
 * Thematic highlighting data layer, ported from the Tilawa iOS app
 * (src/data/thematicTopics.ts, src/data/surahSections.ts,
 * src/data/themeColorGuide.ts).
 *
 * The dataset is NOT bundled: it is fetched lazily from the single merged
 * asset /quran/themes.json (built by web/scripts/build-theme-assets.mjs from
 * assets/quran/thematic-topics.json, QSAC CC BY 4.0: attribution required,
 * and assets/quran/surah-sections.json, Quranpedia: review source terms
 * before redistribution). The build step bakes per-section classifier colors
 * and runs the dash-to-comma cleaners over every displayed string, and the
 * merged file keeps both `source` attribution objects intact; surface them
 * in the UI.
 *
 * Everywhere in this module an ayah is keyed by the string
 * "{surahId}:{ayahNumber}" (unpadded decimal), e.g. "2:255".
 */

// ---------------------------------------------------------------------------
// Color guide (7 fixed categories)
// ---------------------------------------------------------------------------

export type ThemeColorGuideId =
  | "signs"
  | "prophets"
  | "law"
  | "stories"
  | "quran"
  | "afterlife"
  | "hell";

export interface ThemeColorGuideItem {
  id: ThemeColorGuideId;
  color: string;
  title: string;
  description: string;
  keywords: string[];
}

export const THEME_COLOR_GUIDE: ThemeColorGuideItem[] = [
  {
    id: "signs",
    color: "#3B5BFF",
    title: "Blue color and its themes",
    description:
      "The signs of Allah, evidence of His power and oneness, and the grace He gives to His creation.",
    keywords: [
      "allah",
      "god",
      "oneness",
      "monotheism",
      "tawhid",
      "evidence",
      "sign",
      "signs",
      "proof",
      "power",
      "majesty",
      "creation",
      "creator",
      "heavens",
      "earth",
      "mercy",
      "grace",
      "blessing",
      "divine",
      "lord",
      "رب",
      "الله",
      "قدرة",
      "وحدانية",
      "آيات",
      "دلائل",
      "خلق",
      "رحمة",
    ],
  },
  {
    id: "prophets",
    color: "#22C55E",
    title: "Green color and its themes",
    description:
      "The traits and honors of the Prophet, the attributes of believers, their rewards, and descriptions of Paradise.",
    keywords: [
      "prophet's",
      "prophet muhammad",
      "messenger's",
      "attributes",
      "character",
      "ethics",
      "akhlaq",
      "believer",
      "believers",
      "reward",
      "honor",
      "honors",
      "paradise",
      "garden",
      "jannah",
      "heaven",
      "righteous",
      "success",
      "salvation",
      "peace and blessings",
      "النبي",
      "صفات",
      "أخلاق",
      "مؤمن",
      "مؤمنين",
      "ثواب",
      "جنة",
      "الصالحين",
    ],
  },
  {
    id: "law",
    color: "#A67C52",
    title: "Brown color and its themes",
    description:
      "Verses about legal rulings, obligations, transactions, family matters, boundaries, and worship practice.",
    keywords: [
      "law",
      "legal",
      "ruling",
      "rulings",
      "ahkam",
      "obligatory",
      "halal",
      "haram",
      "prayer",
      "fasting",
      "zakat",
      "hajj",
      "marriage",
      "divorce",
      "inheritance",
      "contract",
      "transaction",
      "witness",
      "hudud",
      "criminal",
      "commands",
      "prohibitions",
      "أحكام",
      "حلال",
      "حرام",
      "صلاة",
      "زكاة",
      "صيام",
      "حج",
      "نكاح",
      "طلاق",
      "ميراث",
      "حدود",
      "معاملات",
    ],
  },
  {
    id: "stories",
    color: "#D6D84F",
    title: "Yellow color and its themes",
    description:
      "Stories of messengers and prophets, their biographies, miracles, and the histories of earlier nations.",
    keywords: [
      "story",
      "stories",
      "messenger",
      "messengers",
      "prophet",
      "prophets",
      "musa",
      "moses",
      "ibrahim",
      "abraham",
      "isa",
      "jesus",
      "nuh",
      "noah",
      "yusuf",
      "joseph",
      "lut",
      "hud",
      "salih",
      "shuayb",
      "dawud",
      "sulayman",
      "miracle",
      "miracles",
      "seerah",
      "previous nations",
      "former nations",
      "children of israel",
      "قصص",
      "رسل",
      "أنبياء",
      "موسى",
      "إبراهيم",
      "عيسى",
      "نوح",
      "يوسف",
      "معجزات",
      "أمم",
    ],
  },
  {
    id: "quran",
    color: "#A855F7",
    title: "Purple color and its themes",
    description:
      "The Qur'an and revelation, human character, denial and arrogance, false accusations, and Allah's way with creation.",
    keywords: [
      "quran",
      "qur'an",
      "book",
      "revelation",
      "scripture",
      "verses",
      "human",
      "mankind",
      "denial",
      "deny",
      "reject",
      "arrogance",
      "false accusations",
      "accusation",
      "polytheist",
      "polytheists",
      "disbeliever",
      "disbelievers",
      "hypocrite",
      "hypocrites",
      "sunnah of allah",
      "status",
      "guidance",
      "قرآن",
      "وحي",
      "كتاب",
      "إنسان",
      "كفر",
      "تكذيب",
      "استكبار",
      "مشركين",
      "منافقين",
      "هداية",
    ],
  },
  {
    id: "afterlife",
    color: "#FB923C",
    title: "Orange color and its themes",
    description:
      "The Day of Resurrection, its signs and warnings, death, the grave, the reckoning, and scenes of Judgment.",
    keywords: [
      "resurrection",
      "judgment",
      "judgement",
      "day of judgment",
      "day of resurrection",
      "hour",
      "last day",
      "hereafter",
      "akhirah",
      "reckoning",
      "account",
      "death",
      "grave",
      "warning",
      "warn",
      "punishment",
      "fate",
      "inevitable",
      "doom",
      "قيامة",
      "آخرة",
      "ساعة",
      "حساب",
      "موت",
      "قبر",
      "إنذار",
      "عقاب",
    ],
  },
  {
    id: "hell",
    color: "#EF4444",
    title: "Red color and its themes",
    description:
      "Hell, its descriptions, and the torment of the polytheists and disbelievers.",
    keywords: [
      "hell",
      "fire",
      "jahannam",
      "torment",
      "severe punishment",
      "wrath",
      "curse",
      "cursed",
      "blazing",
      "النار",
      "جهنم",
      "عذاب",
      "لعنة",
      "غضب",
    ],
  },
];

const DEFAULT_GUIDE_ITEM = THEME_COLOR_GUIDE[0];

/** Topic classification priority: first keyword hit in this order wins. */
const MATCH_PRIORITY: ThemeColorGuideId[] = [
  "hell",
  "law",
  "afterlife",
  "stories",
  "prophets",
  "quran",
  "signs",
];

function normalizeMatchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function getThemeColorGuideItemById(
  id: ThemeColorGuideId
): ThemeColorGuideItem {
  return THEME_COLOR_GUIDE.find((item) => item.id === id) ?? DEFAULT_GUIDE_ITEM;
}

/**
 * Topic -> color: first MATCH_PRIORITY item with ANY keyword substring match
 * in the concatenated haystack wins; default is "signs" (blue).
 */
export function getThemeColorGuideItem(
  texts: Array<string | null | undefined>
): ThemeColorGuideItem {
  const haystack = normalizeMatchText(texts.filter(Boolean).join(" "));

  for (const id of MATCH_PRIORITY) {
    const item = getThemeColorGuideItemById(id);
    if (
      item.keywords.some((keyword) =>
        haystack.includes(normalizeMatchText(keyword))
      )
    ) {
      return item;
    }
  }

  return DEFAULT_GUIDE_ITEM;
}

/**
 * Rest-state highlight tint: 6-digit hex + alpha suffix ("4A" dark / "33"
 * light), valid as a CSS #RRGGBBAA color. The web reader is currently
 * light-only, so isDark defaults to false; keep the knob for parity with iOS.
 */
export function getThemeHighlightTint(color: string, isDark = false): string {
  return `${color}${isDark ? "4A" : "33"}`;
}

// ---------------------------------------------------------------------------
// Shared text cleanup (house rule: no em dashes in UI copy)
// ---------------------------------------------------------------------------

/** True when a resolved title is Arabic script (render with font-arabic + dir="auto"). */
export function isArabicText(value: string): boolean {
  return /[\u0600-\u06FF]/.test(value);
}

export function cleanThematicTopicText(value: string): string {
  return value
    .replace(/[\u2013\u2014]/g, ",")
    .replace(/\s+,/g, ",")
    .replace(/,\s*,/g, ", ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export const cleanSurahSectionTitle = cleanThematicTopicText;

// ---------------------------------------------------------------------------
// Types: topics
// ---------------------------------------------------------------------------

export interface ThematicTopic {
  id: string;
  name: string;
  description: string;
  domain: string;
  category: string;
  keywords: {
    primary: string[];
    secondary: string[];
  };
  types: string[];
  ayahCount: number;
  ayahIds: string[];
}

export interface ThematicTopicSurahMatch {
  topic: ThematicTopic;
  ayahCountInSurah: number;
}

export interface ThematicTopicScopeMatch {
  topic: ThematicTopic;
  ayahCountInScope: number;
  ayahIdsInScope: string[];
}

export interface ThematicAssetSource {
  name: string;
  url: string;
  license: string;
}

export interface ThematicTopicsAsset {
  version: string;
  source: ThematicAssetSource;
  totalTopics: number;
  totalAyahAssignments: number;
  topics: ThematicTopic[];
}

// ---------------------------------------------------------------------------
// Types: surah sections
// ---------------------------------------------------------------------------

export type SurahSectionKind =
  | "story"
  | "theme"
  | "parable"
  | "scene"
  | "overview";

export interface SurahSection {
  id: string;
  surahId: number;
  order: number;
  title: string;
  titleEn?: string;
  kind: SurahSectionKind;
  ayahStart: number;
  ayahEnd: number;
  ayahCount: number;
  colorIndex: number;
  sourceUrl: string;
  /**
   * Classifier accent hex baked at build time by build-theme-assets.mjs so
   * iOS and web show identical colors. When absent (legacy asset), the
   * runtime classifier below produces the same result.
   */
  color?: string;
}

export interface SurahSectionScopeMatch {
  section: SurahSection;
  ayahCountInScope: number;
  ayahIdsInScope: string[];
}

export interface SurahSectionsAsset {
  version: string;
  source: ThematicAssetSource;
  generatedAt?: string;
  totalSurahs: number;
  totalSections: number;
  surahs: Record<string, SurahSection[]>;
}

// ---------------------------------------------------------------------------
// Topic helpers (pure, no dataset instance needed)
// ---------------------------------------------------------------------------

export function getThematicTopicColorGuideItem(
  topic: ThematicTopic
): ThemeColorGuideItem {
  return getThemeColorGuideItem([
    topic.name,
    topic.description,
    topic.domain,
    topic.category,
    ...topic.keywords.primary,
    ...topic.keywords.secondary,
    ...topic.types,
  ]);
}

export function getThematicHighlightTint(
  isDark: boolean,
  topic?: ThematicTopic | null
): string {
  const color = topic ? getThematicTopicColorGuideItem(topic).color : "#3B5BFF";
  return getThemeHighlightTint(color, isDark);
}

export function formatThematicTopicDetails(topic: ThematicTopic): string {
  const name = cleanThematicTopicText(topic.name);
  const description = cleanThematicTopicText(topic.description);
  const guideItem = getThematicTopicColorGuideItem(topic);
  return [
    `Full title: ${name}`,
    `What it is about: ${description}`,
    `${guideItem.title}: ${guideItem.description}`,
    `Verses in theme: ${topic.ayahCount}`,
    `Category: ${cleanThematicTopicText(topic.category)}`,
    `Domain: ${cleanThematicTopicText(topic.domain)}`,
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Section title helpers (pure)
// ---------------------------------------------------------------------------

export function formatSurahSectionRange(section: SurahSection): string {
  return `${section.surahId}:${section.ayahStart}-${section.ayahEnd}`;
}

function fallbackSectionTitle(section: SurahSection): string {
  if (section.kind === "overview") return "Surah Overview";
  if (section.kind === "story") return "Story Section";
  if (section.kind === "parable") return "Parable Section";
  if (section.kind === "scene") return "Scene Section";
  return "Theme Section";
}

const GENERIC_SECTION_TITLES = new Set([
  "Surah Overview",
  "Story Section",
  "Parable Section",
  "Scene Section",
  "Theme Section",
]);

/**
 * English title resolution: prefer titleEn when present and not a generic
 * placeholder; otherwise fall back to the (always present) Arabic title,
 * then to a kind-based generic title.
 */
export function getSurahSectionTitle(section: SurahSection): string {
  const titleEn = cleanSurahSectionTitle(section.titleEn ?? "");
  if (titleEn && !GENERIC_SECTION_TITLES.has(titleEn)) return titleEn;
  return cleanSurahSectionTitle(section.title) || fallbackSectionTitle(section);
}

/** Arabic title, when the UI is rendering Arabic copy. */
export function getSurahSectionTitleArabic(section: SurahSection): string {
  return cleanSurahSectionTitle(section.title);
}

// ---------------------------------------------------------------------------
// Section color classifier
//
// Each section is scored against every color category using tightened
// bilingual keyword patterns (en + ar). Highest score wins; the section's
// `kind` adds a weak prior so a story-kind section without a named prophet
// still leans yellow. Within a surah we then make one adjacency-aware pass:
// if a low-confidence section repeats its predecessor's color, we swap to its
// second-best candidate or fall back to the surah's baked-in `colorIndex`
// rotation. Strong semantic matches are preserved: consecutive Musa sections
// SHOULD both be yellow, that's not a bug.
//
// Ported verbatim from the iOS app so users see identical colors across
// platforms. Results are memoized per surah inside each dataset instance.
// ---------------------------------------------------------------------------

type SectionScores = Partial<Record<ThemeColorGuideId, number>>;

interface SectionClassification {
  id: ThemeColorGuideId;
  topScore: number;
  scores: SectionScores;
}

const STRONG_MATCH_THRESHOLD = 2;
const KIND_PRIOR_WEIGHT = 0.6;

const KIND_PRIOR: Record<SurahSectionKind, ThemeColorGuideId | null> = {
  story: "stories",
  parable: "stories",
  scene: "afterlife",
  theme: null,
  overview: null,
};

const SECTION_PATTERNS: Record<ThemeColorGuideId, RegExp[]> = {
  hell: [
    /\b(hell|hellfire|jahannam|torment|blazing|hellbound|damned|inferno)\b/i,
    /(جهنم|سعير|لظى|حطمة|عذاب\s*شديد|نار\s*جهنم|لعنة\s*الله)/u,
  ],
  afterlife: [
    /\b(resurrection|judgment|judgement|reckoning|hereafter|akhirah|grave|day of judg|last day|the hour|doomsday|day of resurrection|warning|warned|punishment|fate of|end times|final|day of reckoning)\b/i,
    /(قيامة|آخرة|الساعة|البعث|الحساب|محشر|قبر|عاقبة|إنذار|يوم\s*الدين|يوم\s*القيامة)/u,
  ],
  law: [
    /\b(law|laws|legal|ruling|rulings|ahkam|halal|haram|prayer|salah|fasting|sawm|zakat|hajj|marriage|divorce|inheritance|contract|covenant|witness|hudud|qiblah|jihad|prohibition|prohibitions|obligation|obligations|injunction|injunctions|command|commandments|practice|practices|duty|duties|matters of|rules of|regulations|detailed laws|detailed rulings|fiqh|sharia|shari'a|sharī'a|legislation)\b/i,
    /(أحكام|حلال|حرام|صلاة|زكاة|صيام|حج|نكاح|طلاق|ميراث|حدود|معاملات|قبلة|واجب|فريضة|تشريع|فقه|شريعة|أوامر)/u,
  ],
  stories: [
    /\b(musa|moses|ibrahim|abraham|isa|jesus|nuh|noah|yusuf|joseph|lut|lot|hud|salih|shu['']?ayb|dawud|david|sulayman|solomon|adam|harun|aaron|yunus|jonah|zakariyya|yahya|maryam|mary|dhul[- ]?qarnayn|khidr|bani[- ]israel|children of israel|pharaoh|fir['']?awn|the cave|companions of the|story of|stories of|tale of|prophets of|messengers of|miracle|miracles|seerah|of old|previous nations|former nations|earlier nations|the jews|the christians|polytheists of mecca|parable of|two gardens|two sons|the elephant|the people of)\b/i,
    /(موسى|إبراهيم|عيسى|نوح|يوسف|لوط|هود|صالح|شعيب|داود|سليمان|آدم|هارون|يونس|زكريا|يحيى|مريم|ذو\s*القرنين|بني\s*إسرائيل|فرعون|قصة|قصص|أهل\s*الكهف|أمم\s*سابقة|أصحاب\s*الفيل|أصحاب\s*السبت)/u,
  ],
  prophets: [
    /\b(the prophet|prophet muhammad|the messenger|messenger of allah|messenger of god|believers|the believers|the muslims|the muslim ummah|righteous|the righteous|piety|piousness|paradise|gardens of|gardens beneath|jannah|reward of|reward for|honor of|character of the|attributes of believers|ethics|akhlaq|taqwa|patience|charity|brotherhood|ummah|foundations of the muslim|leadership of the ummah|salvation|success of believers|saved|peace and blessings)\b/i,
    /(النبي|الرسول|محمد|المؤمنين|أهل\s*الإيمان|الصالحين|تقوى|الجنة|جنات|ثواب|أخلاق|صبر|إيمان|فلاح|أمة\s*الإسلام|أهل\s*التقوى)/u,
  ],
  quran: [
    /\b(qur['']?an|quran|revelation|the book|scripture|denial|deny|deniers|reject|rejecters|rejection|arrogance|arrogant|haughty|hypocrite|hypocrites|hypocrisy|polytheist|polytheists|polytheism|disbeliever|disbelievers|disbelief|opposition|opponents|enemies of|stubbornness|stubborn|mocking|disputing|dispute|debate|argument with|opposition to|rebellion against|response of|responses of|reproof|reminder and reproof)\b/i,
    /(قرآن|الكتاب|وحي|تكذيب|إنكار|استكبار|كبر|منافقين|نفاق|مشركين|شرك|كافرين|كفر|عناد|جدال|خصومة|تهكم|استهزاء|إعراض)/u,
  ],
  signs: [
    /\b(signs of|sign of|creation|creator|the heavens|the earth|sky|skies|stars|sun|moon|night and day|rain|wind|winds|mountains|seas|oceans|animals|birth|death and life|cosmos|universe|wonders|reflection|reflect on|consider|ponder|oneness|tawhid|monotheism|divine power|divine signs|mercy of allah|mercy of god|grace|blessing|blessings|favors of|bounties of|praise|praise and|glorify|glorification|tasbih|stewardship|guidance and stewardship|surah overview|overview)\b/i,
    /(آيات\s*الله|دلائل|خلق|السماء|الأرض|كواكب|الشمس|القمر|الليل|النهار|جبال|البحار|توحيد|وحدانية|رحمة|نعمة|نعم|فضل|حمد|تسبيح|استخلاف)/u,
  ],
};

function countMatches(haystack: string, patterns: RegExp[]): number {
  let total = 0;
  for (const pattern of patterns) {
    // Non-global regex per call: .match returns one result (plus capture
    // groups) whose length we sum, exactly as the iOS classifier does.
    const matches = haystack.match(pattern);
    if (matches) total += matches.length;
  }
  return total;
}

function classifySection(section: SurahSection): SectionClassification {
  const haystack = [section.titleEn ?? "", section.title]
    .filter(Boolean)
    .join(" ");

  const scores: SectionScores = {};
  for (const [id, patterns] of Object.entries(SECTION_PATTERNS) as Array<
    [ThemeColorGuideId, RegExp[]]
  >) {
    const score = countMatches(haystack, patterns);
    if (score > 0) scores[id] = score;
  }

  const prior = KIND_PRIOR[section.kind];
  if (prior) scores[prior] = (scores[prior] ?? 0) + KIND_PRIOR_WEIGHT;

  let bestId: ThemeColorGuideId | null = null;
  let bestScore = 0;
  for (const [id, score] of Object.entries(scores) as Array<
    [ThemeColorGuideId, number]
  >) {
    if (score > bestScore) {
      bestScore = score;
      bestId = id;
    }
  }

  if (bestId) return { id: bestId, topScore: bestScore, scores };

  // No semantic hit at all: rotate by colorIndex so this section still gets
  // a stable, deterministic color that's distinct from its neighbors.
  const palette = THEME_COLOR_GUIDE;
  const idx =
    ((section.colorIndex % palette.length) + palette.length) % palette.length;
  return { id: palette[idx].id, topScore: 0, scores };
}

function secondBestId(
  scores: SectionScores,
  excludeId: ThemeColorGuideId
): ThemeColorGuideId | null {
  let bestId: ThemeColorGuideId | null = null;
  let bestScore = 0;
  for (const [id, score] of Object.entries(scores) as Array<
    [ThemeColorGuideId, number]
  >) {
    if (id === excludeId) continue;
    if (score > bestScore) {
      bestScore = score;
      bestId = id;
    }
  }
  return bestId;
}

function rotationalFallback(
  excludeId: ThemeColorGuideId,
  section: SurahSection
): ThemeColorGuideId {
  const palette = THEME_COLOR_GUIDE;
  const seed =
    (((section.colorIndex + 1) % palette.length) + palette.length) %
    palette.length;
  for (let step = 0; step < palette.length; step++) {
    const candidate = palette[(seed + step) % palette.length];
    if (candidate.id !== excludeId) return candidate.id;
  }
  return excludeId;
}

// ---------------------------------------------------------------------------
// Query APIs (built once per loaded dataset)
// ---------------------------------------------------------------------------

export interface ThematicTopicsApi {
  source: ThematicAssetSource;
  totalTopics: number;
  totalAyahAssignments: number;
  topics: ThematicTopic[];
  topicsByPopularity: ThematicTopic[];
  domains: Array<{ name: string; topicCount: number }>;
  topic(id: string | null | undefined): ThematicTopic | null;
  topicsForAyah(ayahId: string): ThematicTopic[];
  topicIdsForAyah(ayahId: string): string[];
  isAyahInTopic(topicId: string, ayahId: string): boolean;
  categoriesForDomain(domain: string): Array<{ name: string; topicCount: number }>;
  topicsForCategory(domain: string, category: string): ThematicTopic[];
  topicsForAyahs(ayahIds: string[], limit?: number): ThematicTopicScopeMatch[];
  topicsForSurah(surahId: number, limit?: number): ThematicTopicSurahMatch[];
  search(query: string, limit?: number): ThematicTopic[];
}

export interface SurahSectionsApi {
  source: ThematicAssetSource;
  totalSections: number;
  section(id: string | null | undefined): SurahSection | null;
  sectionsForSurah(surahId: number): SurahSection[];
  sectionsForAyah(ayahId: string): SurahSection[];
  primarySectionForAyah(ayahId: string): SurahSection | null;
  matchingSectionForAyah(
    ayahId: string,
    sectionIds: readonly string[]
  ): SurahSection | null;
  isAyahInSection(sectionId: string, ayahId: string): boolean;
  sectionsForAyahs(ayahIds: string[], limit?: number): SurahSectionScopeMatch[];
  /** Classified color category for a section (memoized per surah). */
  sectionColorGuideItem(section: SurahSection): ThemeColorGuideItem;
  /** Classified accent hex for a section. */
  sectionAccent(section: SurahSection): string;
  /** Rest-state highlight tint (accent + alpha suffix) for a section. */
  sectionHighlightTint(section: SurahSection, isDark?: boolean): string;
  /** Plain-text details block for popovers/dialogs (English). */
  formatSectionDetails(section: SurahSection): string;
}

export interface ThematicData {
  topics: ThematicTopicsApi;
  sections: SurahSectionsApi;
}

function parseAyahId(
  ayahId: string
): { surahId: number; ayahNumber: number } | null {
  const [surahText, ayahText] = ayahId.split(":");
  const surahId = Number(surahText);
  const ayahNumber = Number(ayahText);
  if (!Number.isFinite(surahId) || !Number.isFinite(ayahNumber)) return null;
  return { surahId, ayahNumber };
}

function surahIdFromAyahId(ayahId: string): number {
  return Number(ayahId.split(":")[0]);
}

function searchScore(topic: ThematicTopic, query: string): number | null {
  const name = normalizeMatchText(topic.name);
  if (name === query) return 0;
  if (name.startsWith(query)) return 1;
  if (name.includes(query)) return 2;

  const category = normalizeMatchText(topic.category);
  const domain = normalizeMatchText(topic.domain);
  if (category.includes(query) || domain.includes(query)) return 3;

  for (const keyword of [
    ...topic.keywords.primary,
    ...topic.keywords.secondary,
  ]) {
    if (normalizeMatchText(keyword).includes(query)) return 4;
  }

  if (normalizeMatchText(topic.description).includes(query)) return 5;
  return null;
}

export function buildThematicTopicsApi(
  asset: ThematicTopicsAsset
): ThematicTopicsApi {
  const topics = asset.topics;

  const topicsById = new Map<string, ThematicTopic>();
  const ayahTopicIds = new Map<string, string[]>();
  const topicAyahSets = new Map<string, Set<string>>();

  for (const topic of topics) {
    topicsById.set(topic.id, topic);
    topicAyahSets.set(topic.id, new Set(topic.ayahIds));
    for (const ayahId of topic.ayahIds) {
      const list = ayahTopicIds.get(ayahId);
      if (list) list.push(topic.id);
      else ayahTopicIds.set(ayahId, [topic.id]);
    }
  }

  const topicsByPopularity = [...topics].sort((a, b) => {
    if (b.ayahCount !== a.ayahCount) return b.ayahCount - a.ayahCount;
    return a.name.localeCompare(b.name);
  });

  const topicsByDomain = new Map<string, ThematicTopic[]>();
  const topicsByDomainCategory = new Map<string, Map<string, ThematicTopic[]>>();

  for (const topic of topicsByPopularity) {
    const domainTopics = topicsByDomain.get(topic.domain);
    if (domainTopics) domainTopics.push(topic);
    else topicsByDomain.set(topic.domain, [topic]);

    const categoryMap =
      topicsByDomainCategory.get(topic.domain) ??
      new Map<string, ThematicTopic[]>();
    const categoryTopics = categoryMap.get(topic.category);
    if (categoryTopics) categoryTopics.push(topic);
    else categoryMap.set(topic.category, [topic]);
    topicsByDomainCategory.set(topic.domain, categoryMap);
  }

  const domains = [...topicsByDomain.entries()]
    .map(([name, domainTopics]) => ({
      name,
      topicCount: domainTopics.length,
    }))
    .sort((a, b) => b.topicCount - a.topicCount || a.name.localeCompare(b.name));

  return {
    source: asset.source,
    totalTopics: asset.totalTopics,
    totalAyahAssignments: asset.totalAyahAssignments,
    topics,
    topicsByPopularity,
    domains,

    topic(id) {
      if (!id) return null;
      return topicsById.get(id) ?? null;
    },

    topicsForAyah(ayahId) {
      const ids = ayahTopicIds.get(ayahId) ?? [];
      return ids
        .map((id) => topicsById.get(id))
        .filter((topic): topic is ThematicTopic => !!topic);
    },

    topicIdsForAyah(ayahId) {
      return ayahTopicIds.get(ayahId) ?? [];
    },

    isAyahInTopic(topicId, ayahId) {
      return topicAyahSets.get(topicId)?.has(ayahId) ?? false;
    },

    categoriesForDomain(domain) {
      const categoryMap = topicsByDomainCategory.get(domain);
      if (!categoryMap) return [];
      return [...categoryMap.entries()]
        .map(([name, categoryTopics]) => ({
          name,
          topicCount: categoryTopics.length,
        }))
        .sort(
          (a, b) => b.topicCount - a.topicCount || a.name.localeCompare(b.name)
        );
    },

    topicsForCategory(domain, category) {
      return topicsByDomainCategory.get(domain)?.get(category) ?? [];
    },

    topicsForAyahs(ayahIds, limit = 24) {
      const ayahIdSet = new Set(ayahIds);
      if (ayahIdSet.size === 0) return [];

      return topics
        .map((topic) => {
          const ayahIdsInScope = topic.ayahIds.filter((ayahId) =>
            ayahIdSet.has(ayahId)
          );
          return {
            topic,
            ayahIdsInScope,
            ayahCountInScope: ayahIdsInScope.length,
          };
        })
        .filter((item) => item.ayahCountInScope > 0)
        .sort((a, b) => {
          if (b.ayahCountInScope !== a.ayahCountInScope) {
            return b.ayahCountInScope - a.ayahCountInScope;
          }
          if (b.topic.ayahCount !== a.topic.ayahCount) {
            return b.topic.ayahCount - a.topic.ayahCount;
          }
          return a.topic.name.localeCompare(b.topic.name);
        })
        .slice(0, limit);
    },

    topicsForSurah(surahId, limit = 24) {
      if (!Number.isFinite(surahId)) return [];
      return topics
        .map((topic) => ({
          topic,
          ayahCountInSurah: topic.ayahIds.reduce(
            (count, ayahId) =>
              count + (surahIdFromAyahId(ayahId) === surahId ? 1 : 0),
            0
          ),
        }))
        .filter((item) => item.ayahCountInSurah > 0)
        .sort((a, b) => {
          if (b.ayahCountInSurah !== a.ayahCountInSurah) {
            return b.ayahCountInSurah - a.ayahCountInSurah;
          }
          if (b.topic.ayahCount !== a.topic.ayahCount) {
            return b.topic.ayahCount - a.topic.ayahCount;
          }
          return a.topic.name.localeCompare(b.topic.name);
        })
        .slice(0, limit);
    },

    search(query, limit = 120) {
      const q = normalizeMatchText(query);
      if (!q) return topicsByPopularity.slice(0, limit);

      return topics
        .map((topic) => ({ topic, score: searchScore(topic, q) }))
        .filter(
          (item): item is { topic: ThematicTopic; score: number } =>
            item.score !== null
        )
        .sort((a, b) => {
          if (a.score !== b.score) return a.score - b.score;
          if (b.topic.ayahCount !== a.topic.ayahCount) {
            return b.topic.ayahCount - a.topic.ayahCount;
          }
          return a.topic.name.localeCompare(b.topic.name);
        })
        .slice(0, limit)
        .map((item) => item.topic);
    },
  };
}

export function buildSurahSectionsApi(
  asset: SurahSectionsAsset
): SurahSectionsApi {
  const sectionsBySurahId = new Map<number, SurahSection[]>();
  const sectionsById = new Map<string, SurahSection>();
  const sectionIdsByAyahId = new Map<string, string[]>();

  for (const [surahIdText, sections] of Object.entries(asset.surahs)) {
    const surahId = Number(surahIdText);
    const sorted = [...sections].sort((a, b) => {
      if (a.ayahStart !== b.ayahStart) return a.ayahStart - b.ayahStart;
      if (a.ayahEnd !== b.ayahEnd) return a.ayahEnd - b.ayahEnd;
      return a.order - b.order;
    });
    sectionsBySurahId.set(surahId, sorted);
    for (const section of sorted) {
      sectionsById.set(section.id, section);
      for (
        let ayahNumber = section.ayahStart;
        ayahNumber <= section.ayahEnd;
        ayahNumber++
      ) {
        const ayahId = `${surahId}:${ayahNumber}`;
        const sectionIds = sectionIdsByAyahId.get(ayahId);
        if (sectionIds) sectionIds.push(section.id);
        else sectionIdsByAyahId.set(ayahId, [section.id]);
      }
    }
  }

  function nearestSectionForAyah(ayahId: string): SurahSection | null {
    const parsed = parseAyahId(ayahId);
    if (!parsed) return null;
    const sections = sectionsBySurahId.get(parsed.surahId) ?? [];
    let nearest: SurahSection | null = null;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const section of sections) {
      const distance =
        parsed.ayahNumber < section.ayahStart
          ? section.ayahStart - parsed.ayahNumber
          : parsed.ayahNumber > section.ayahEnd
            ? parsed.ayahNumber - section.ayahEnd
            : 0;
      if (distance < nearestDistance) {
        nearest = section;
        nearestDistance = distance;
      }
    }

    return nearest;
  }

  const surahColorCache = new Map<number, Map<string, ThemeColorGuideId>>();

  function computeSurahSectionColors(
    surahId: number
  ): Map<string, ThemeColorGuideId> {
    const sections = sectionsBySurahId.get(surahId) ?? [];
    const classifications = sections.map(classifySection);

    // Neighbor inheritance: a section with no semantic hits that sits between
    // two strong, agreeing neighbors almost always belongs to that same theme.
    // Surah 12's "His Brothers Plot Against Him" has no Yusuf-named keywords
    // but is unmistakably part of the Yusuf narrative: the neighbors prove it.
    for (let i = 0; i < classifications.length; i++) {
      if (classifications[i].topScore !== 0) continue;
      const left = classifications[i - 1];
      const right = classifications[i + 1];
      const leftStrong =
        left && left.topScore >= STRONG_MATCH_THRESHOLD ? left.id : null;
      const rightStrong =
        right && right.topScore >= STRONG_MATCH_THRESHOLD ? right.id : null;
      if (leftStrong && leftStrong === rightStrong) {
        classifications[i] = {
          id: leftStrong,
          topScore: STRONG_MATCH_THRESHOLD, // promote so adjacency dedup respects it
          scores: classifications[i].scores,
        };
      }
    }

    const result = new Map<string, ThemeColorGuideId>();
    let prevColor: ThemeColorGuideId | null = null;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const classification = classifications[i];
      let color = classification.id;

      // Adjacency dedup applies only to weak matches. Strong semantic matches
      // are preserved so a recurring theme stays consistent across sections.
      if (
        color === prevColor &&
        classification.topScore < STRONG_MATCH_THRESHOLD
      ) {
        const secondary = secondBestId(classification.scores, color);
        color = secondary ?? rotationalFallback(color, section);
      }

      result.set(section.id, color);
      prevColor = color;
    }

    return result;
  }

  function colorIdForSection(section: SurahSection): ThemeColorGuideId {
    let cache = surahColorCache.get(section.surahId);
    if (!cache) {
      cache = computeSurahSectionColors(section.surahId);
      surahColorCache.set(section.surahId, cache);
    }
    return cache.get(section.id) ?? THEME_COLOR_GUIDE[0].id;
  }

  const guideItemByColor = new Map(
    THEME_COLOR_GUIDE.map((item) => [item.color.toUpperCase(), item])
  );

  function sectionColorGuideItem(section: SurahSection): ThemeColorGuideItem {
    // Prefer the color baked at build time (same classifier, run once);
    // fall back to the runtime classifier for legacy/unbaked assets.
    if (section.color) {
      const baked = guideItemByColor.get(section.color.toUpperCase());
      if (baked) return baked;
    }
    return getThemeColorGuideItemById(colorIdForSection(section));
  }

  return {
    source: asset.source,
    totalSections: asset.totalSections,

    section(id) {
      if (!id) return null;
      return sectionsById.get(id) ?? null;
    },

    sectionsForSurah(surahId) {
      return sectionsBySurahId.get(surahId) ?? [];
    },

    sectionsForAyah(ayahId) {
      return (sectionIdsByAyahId.get(ayahId) ?? [])
        .map((sectionId) => sectionsById.get(sectionId))
        .filter((section): section is SurahSection => section != null);
    },

    primarySectionForAyah(ayahId) {
      const sectionId = sectionIdsByAyahId.get(ayahId)?.[0];
      return sectionId
        ? sectionsById.get(sectionId) ?? null
        : nearestSectionForAyah(ayahId);
    },

    matchingSectionForAyah(ayahId, sectionIds) {
      const ayahSectionIds = sectionIdsByAyahId.get(ayahId);
      if (!ayahSectionIds || ayahSectionIds.length === 0) return null;
      for (const sectionId of sectionIds) {
        if (!ayahSectionIds.includes(sectionId)) continue;
        return sectionsById.get(sectionId) ?? null;
      }
      return null;
    },

    isAyahInSection(sectionId, ayahId) {
      return sectionIdsByAyahId.get(ayahId)?.includes(sectionId) ?? false;
    },

    sectionsForAyahs(ayahIds, limit = 18) {
      if (ayahIds.length === 0) return [];

      const matchesBySectionId = new Map<string, string[]>();
      for (const ayahId of ayahIds) {
        for (const sectionId of sectionIdsByAyahId.get(ayahId) ?? []) {
          const ayahIdsInScope = matchesBySectionId.get(sectionId);
          if (ayahIdsInScope) ayahIdsInScope.push(ayahId);
          else matchesBySectionId.set(sectionId, [ayahId]);
        }
      }

      return [...matchesBySectionId.entries()]
        .map(([sectionId, ayahIdsInScope]) => {
          const section = sectionsById.get(sectionId);
          if (!section) return null;
          return {
            section,
            ayahIdsInScope,
            ayahCountInScope: ayahIdsInScope.length,
          };
        })
        .filter((match): match is SurahSectionScopeMatch => match != null)
        .sort((a, b) => {
          const aFirst = parseAyahId(a.ayahIdsInScope[0] ?? "")?.ayahNumber ?? 0;
          const bFirst = parseAyahId(b.ayahIdsInScope[0] ?? "")?.ayahNumber ?? 0;
          if (a.section.surahId !== b.section.surahId) {
            return a.section.surahId - b.section.surahId;
          }
          if (aFirst !== bFirst) return aFirst - bFirst;
          if (a.section.ayahStart !== b.section.ayahStart) {
            return a.section.ayahStart - b.section.ayahStart;
          }
          return a.section.order - b.section.order;
        })
        .slice(0, limit);
    },

    sectionColorGuideItem,

    sectionAccent(section) {
      return sectionColorGuideItem(section).color;
    },

    sectionHighlightTint(section, isDark = false) {
      return getThemeHighlightTint(sectionColorGuideItem(section).color, isDark);
    },

    formatSectionDetails(section) {
      const title = getSurahSectionTitle(section);
      const guideItem = sectionColorGuideItem(section);
      return [
        `Full title: ${title}`,
        `Ayahs: ${formatSurahSectionRange(section)}`,
        `${section.ayahCount} ayah${section.ayahCount === 1 ? "" : "s"} in this section.`,
        `${guideItem.title}: ${guideItem.description}`,
        `What it is about: this highlight groups the ayahs around this idea so you can read or memorize them as one connected section.`,
      ].join("\n");
    },
  };
}

// ---------------------------------------------------------------------------
// Async loader (module-level cache)
//
// Mirrors the site's static-asset convention (quran-uthmani.json,
// qpc-v4-layout.json): plain fetch from /public, so the ~600 KB of theme data
// stays out of the client bundle and is only downloaded when the feature is
// first used. One merged file = one request and one HTTP cache entry. The
// in-flight promise is cached so concurrent callers share one request; a
// failed load clears the cache so the next call can retry.
// ---------------------------------------------------------------------------

export const THEMES_ASSET_URL = "/quran/themes.json";

/** Merged asset emitted by web/scripts/build-theme-assets.mjs. */
export interface MergedThemesAsset {
  version: string;
  generatedAt?: string;
  topicsSource: ThematicAssetSource;
  sectionsSource: ThematicAssetSource;
  totalTopics: number;
  totalAyahAssignments: number;
  topics: ThematicTopic[];
  totalSurahs: number;
  totalSections: number;
  surahs: Record<string, SurahSection[]>;
}

let thematicDataPromise: Promise<ThematicData> | null = null;
let thematicDataCache: ThematicData | null = null;

async function fetchThematicData(): Promise<ThematicData> {
  const response = await fetch(THEMES_ASSET_URL);
  if (!response.ok) {
    throw new Error(`Themes asset request failed: ${response.status}`);
  }

  const asset = (await response.json()) as MergedThemesAsset;

  return {
    topics: buildThematicTopicsApi({
      version: asset.version,
      source: asset.topicsSource,
      totalTopics: asset.totalTopics,
      totalAyahAssignments: asset.totalAyahAssignments,
      topics: asset.topics,
    }),
    sections: buildSurahSectionsApi({
      version: asset.version,
      source: asset.sectionsSource,
      generatedAt: asset.generatedAt,
      totalSurahs: asset.totalSurahs,
      totalSections: asset.totalSections,
      surahs: asset.surahs,
    }),
  };
}

export function loadThematicData(): Promise<ThematicData> {
  if (!thematicDataPromise) {
    thematicDataPromise = fetchThematicData()
      .then((data) => {
        thematicDataCache = data;
        return data;
      })
      .catch((error) => {
        thematicDataPromise = null; // allow retry after a failed load
        throw error;
      });
  }
  return thematicDataPromise;
}

/**
 * Synchronous accessor for hot render paths (e.g. computing a per-page tint
 * map): returns null until loadThematicData() has resolved at least once.
 */
export function getThematicDataIfLoaded(): ThematicData | null {
  return thematicDataCache;
}
