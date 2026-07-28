export type TajweedRule =
  | "ham_wasl"
  | "madda_normal"
  | "madda_obligatory"
  | "madda_permissible"
  | "madda_necessary"
  | "qalaqah"
  | "ikhafa"
  | "idgham_with_ghunnah"
  | "idgham_without_ghunnah"
  | "idgham_mutajanisayn"
  | "idgham_mutaqaribayn"
  | "iqlab"
  | "ghunnah"
  | "laam_shamsiyah"
  | "silent"
  | "slnt"
  | "ikhfa_shafawi"
  | "idgham_shafawi";

export type TajweedSegment = {
  text: string;
  rule: TajweedRule | null;
};

export const tajweedColors: Record<TajweedRule, string> = {
  ham_wasl: "#A5A5A5",
  madda_normal: "#CE9E00",
  madda_obligatory: "#F40000",
  madda_permissible: "#FF7B00",
  madda_necessary: "#B50000",
  qalaqah: "#2FADFF",
  ikhafa: "#09B000",
  idgham_with_ghunnah: "#09B000",
  idgham_without_ghunnah: "#A5A5A5",
  idgham_mutajanisayn: "#A5A5A5",
  idgham_mutaqaribayn: "#A5A5A5",
  iqlab: "#09B000",
  ghunnah: "#09B000",
  laam_shamsiyah: "#A5A5A5",
  silent: "#A5A5A5",
  slnt: "#A5A5A5",
  ikhfa_shafawi: "#09B000",
  idgham_shafawi: "#09B000",
};

export const TAJWEED_LEGEND = [
  { id: "madd-necessary", label: "Madd: 6", color: "#B50000" },
  { id: "madd-obligatory", label: "Madd: 4 or 5", color: "#F40000" },
  { id: "madd-permissible", label: "Madd: 2, 4, or 6", color: "#FF7B00" },
  { id: "madd-normal", label: "Madd: 2", color: "#CE9E00" },
  { id: "ghunnah", label: "Ghunnah", color: "#09B000" },
  { id: "qalqalah", label: "Qalqalah", color: "#2FADFF" },
  { id: "silent", label: "Silent", color: "#A5A5A5" },
];

const RULE_RE =
  /<(tajweed|rule)\s+class=(?:"([^"]+)"|'([^']+)'|([^\s>]+))\s*>([\s\S]*?)<\/\1>/g;
const STRAY_TAG_RE = /<\/?\w+(?:\s+[^>]*)?\/?>/g;
const UNRENDERABLE_PUNCT_RE = /[\u060c\u061b\u061f]/g;
const DIACRITIC_RE = /[\u064b-\u0670\u06d6-\u06ed]/;
export const BISMILLAH =
  "\u0628\u0650\u0633\u0652\u0645\u0650 \u0671\u0644\u0644\u0651\u064e\u0647\u0650 \u0671\u0644\u0631\u0651\u064e\u062d\u0652\u0645\u064e\u0670\u0646\u0650 \u0671\u0644\u0631\u0651\u064e\u062d\u0650\u064a\u0645\u0650";

const RULE_ALIASES: Record<string, TajweedRule> = {
  "ham-wasl": "ham_wasl",
  "hamzat-wasl": "ham_wasl",
  hamzat_wasl: "ham_wasl",
  "madda-normal": "madda_normal",
  "madda-obligatory": "madda_obligatory",
  "madda-permissible": "madda_permissible",
  "madda-necessary": "madda_necessary",
  qalqalah: "qalaqah",
  ikhfa: "ikhafa",
  ikhafaa: "ikhafa",
  ikhfaa: "ikhafa",
  "idgham-with-ghunnah": "idgham_with_ghunnah",
  idgham_ghunnah: "idgham_with_ghunnah",
  "idgham-without-ghunnah": "idgham_without_ghunnah",
  idgham_wo_ghunnah: "idgham_without_ghunnah",
  "idgham-mutajanisayn": "idgham_mutajanisayn",
  "idgham-mutaqaribayn": "idgham_mutaqaribayn",
  "ikhafa-shafawi": "ikhfa_shafawi",
  ikhafa_shafawi: "ikhfa_shafawi",
  "idgham-shafawi": "idgham_shafawi",
  "lam-shamsiyyah": "laam_shamsiyah",
  lam_shamsiyyah: "laam_shamsiyah",
  "laam-shamsiyah": "laam_shamsiyah",
};

const KNOWN_RULES: ReadonlySet<string> = new Set([
  "ham_wasl",
  "madda_normal",
  "madda_obligatory",
  "madda_permissible",
  "madda_necessary",
  "qalaqah",
  "ikhafa",
  "idgham_with_ghunnah",
  "idgham_without_ghunnah",
  "idgham_mutajanisayn",
  "idgham_mutaqaribayn",
  "iqlab",
  "ghunnah",
  "laam_shamsiyah",
  "silent",
  "slnt",
  "ikhfa_shafawi",
  "idgham_shafawi",
]);

function stripStrayTags(text: string): string {
  return text.replace(STRAY_TAG_RE, "");
}

export function stripUnrenderableMarks(text: string): string {
  return text.replace(UNRENDERABLE_PUNCT_RE, " ").replace(/  +/g, " ");
}

// The tajweed API returns qurancdn-convention text; the site's canonical
// text and font are KFGQPC. Mirror of the app's normalizeToKfgqpcConvention
// in src/data/tajweed.ts: U+06DF has no usable glyph in KFGQPC Hafs fonts
// (hafsData spells those spots with a plain sukun), and V22 dropped
// precomposed alef-madda.
function normalizeToKfgqpcConvention(text: string): string {
  return text
    .replace(/۟/g, "ْ")
    .replace(/آ/g, "آ")
    // qurancdn wedges a ZWNJ between the base letter and small waqf marks
    // (100% of ZWNJ occurrences precede U+06D6-U+06DB). The orphaned mark
    // falls out of the KFGQPC font run on iOS and a system fallback draws
    // it BOXED. Dropping the ZWNJ re-attaches the mark - the KFGQPC
    // convention (hafsData attaches waqf marks directly) - and the font's
    // own clean small glyphs render.
    .replace(/‌(?=[ۖ-ۭ])/g, "")
    .replace(/﻿/g, "");
}

function stripTashkeel(text: string): string {
  return text.replace(/[\u064b-\u0670\u06d6-\u06ed]/g, "");
}

function normalizeRule(raw: string): TajweedRule | null {
  if (!raw) return null;
  if (KNOWN_RULES.has(raw)) return raw as TajweedRule;
  return RULE_ALIASES[raw] ?? null;
}

export function parseTajweedHtml(input: string): TajweedSegment[] {
  const segments: TajweedSegment[] = [];
  let lastIndex = 0;
  RULE_RE.lastIndex = 0;
  let match: RegExpExecArray | null;

  const pushPlain = (raw: string) => {
    const cleaned = normalizeToKfgqpcConvention(
      stripUnrenderableMarks(stripStrayTags(raw))
    );
    if (cleaned.trim()) segments.push({ text: cleaned, rule: null });
  };

  while ((match = RULE_RE.exec(input)) !== null) {
    if (match.index > lastIndex) pushPlain(input.slice(lastIndex, match.index));
    const className = (match[2] || match[3] || match[4] || "")
      .trim()
      .toLowerCase();
    const inner = normalizeToKfgqpcConvention(
      stripUnrenderableMarks(stripStrayTags(match[5] || ""))
    );
    if (inner) segments.push({ text: inner, rule: normalizeRule(className) });
    lastIndex = RULE_RE.lastIndex;
  }

  if (lastIndex < input.length) pushPlain(input.slice(lastIndex));
  return reattachLeadingMarks(segments);
}

// Quran.com's markup often OPENS a rule span on a combining mark (e.g.
// heh + <tajweed class=ikhafa> fathatan alef </tajweed>). Each rendered
// <span> is shaped as its own run, so a segment-leading mark has no base
// letter and WebKit props it up on a visible dotted circle - "circles
// around harakat". Move leading dependent marks onto the tail of the
// previous segment (they inherit its color; same tradeoff as the app's
// renderTajweed). Mirrors LEADING_DEPENDENT_ARABIC_MARKS_RE in
// src/features/reader/renderTajweed.tsx.
const LEADING_DEPENDENT_MARKS_RE =
  /^(?:‌?[ً-ٰٟۖ-ۜ۟-ۭ࣓-ࣿ])+/;

function reattachLeadingMarks(segments: TajweedSegment[]): TajweedSegment[] {
  const merged: TajweedSegment[] = [];
  for (const segment of segments) {
    const previous = merged[merged.length - 1];
    const lead = segment.text.match(LEADING_DEPENDENT_MARKS_RE)?.[0];
    if (lead && previous && !/\s$/.test(previous.text)) {
      previous.text += lead;
      const rest = segment.text.slice(lead.length);
      if (rest) merged.push({ text: rest, rule: segment.rule });
    } else {
      merged.push({ ...segment });
    }
  }
  return merged;
}

export function getDisplayAyahText(ayah: {
  surahId: number;
  ayahNumber: number;
  textUthmani: string;
}): string {
  const cleaned = stripUnrenderableMarks(ayah.textUthmani).replace(/^\ufeff/, "");
  if (ayah.surahId === 1 || ayah.surahId === 9 || ayah.ayahNumber !== 1) {
    return cleaned;
  }

  const target = stripTashkeel(BISMILLAH).replace(/\s+/g, "");
  let i = 0;
  let j = 0;
  while (i < cleaned.length && j < target.length) {
    const ch = cleaned[i];
    if (DIACRITIC_RE.test(ch) || ch === " ") {
      i++;
      continue;
    }
    if (ch === target[j]) {
      i++;
      j++;
      continue;
    }
    return cleaned;
  }

  if (j < target.length) return cleaned;
  return cleaned.slice(i).replace(/^\s+/, "");
}

export function getDisplayTajweedSegments(
  ayah: { id: string; surahId: number; ayahNumber: number },
  byAyah: Record<string, TajweedSegment[]>
): TajweedSegment[] | null {
  const segments = byAyah[ayah.id];
  if (!segments) return null;
  if (ayah.surahId === 1 || ayah.surahId === 9 || ayah.ayahNumber !== 1) {
    return segments;
  }

  const target = stripTashkeel(BISMILLAH).replace(/\s+/g, "");
  const out: TajweedSegment[] = [];
  let consumed = 0;
  let stripping = true;

  for (const segment of segments) {
    if (!stripping) {
      out.push(segment);
      continue;
    }

    let i = 0;
    while (i < segment.text.length && consumed < target.length) {
      const ch = segment.text[i];
      if (DIACRITIC_RE.test(ch) || ch === " ") {
        i++;
        continue;
      }
      if (ch === target[consumed]) {
        i++;
        consumed++;
        continue;
      }
      return consumed === 0 ? segments : null;
    }

    if (consumed >= target.length) {
      const rest = segment.text.slice(i).replace(/^\s+/, "");
      if (rest) out.push({ text: rest, rule: segment.rule });
      stripping = false;
    }
  }

  if (stripping) return consumed === 0 ? segments : null;
  return out;
}

export async function fetchSurahTajweed(
  surahId: number
): Promise<Record<string, TajweedSegment[]>> {
  const response = await fetch(`/api/tajweed/${surahId}`);
  if (!response.ok) throw new Error(`Tajweed request failed: ${response.status}`);
  return (await response.json()) as Record<string, TajweedSegment[]>;
}
