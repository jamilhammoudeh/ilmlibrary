// KFGQPC "Hafs Smart" - guaranteed-correct Uthmani rendering with NO text
// shaping engine. The font (public/fonts/HafsSmart.woff2, family
// "KFGQPCHafsSmart") contains 2,737 pre-shaped letter-cluster glyphs at PUA
// U+E000-U+EAB4 and zero GSUB/GPOS; the per-surah data files
// (public/quran/hafs-smart/s###.json, keyed "surah:ayah") are streams of
// those PUA codes, RLM-interleaved, space-separated per word, ending with
// the ayah-number medallion.
//
// Use this wherever a real shaping engine is unavailable or unreliable:
// satori/@vercel/og share images (satori cannot shape Arabic), canvas
// renderers, emails. It renders pixel-identically everywhere BY DESIGN.
// KFGQPC scopes it to ayah-level display (search results, cards) - not
// full mushaf pages.
//
// The PUA text is meaningless without this exact font and unsearchable;
// pair with the canonical text from quran-uthmani.json for semantics.
// Splitting on U+0020 yields word-level runs (last token = ayah medallion)
// for per-word styling without shaping.
//
// Register the face where needed (not in globals.css - no always-on
// consumer should pay the 88KB):
//   @font-face { font-family: "KFGQPCHafsSmart";
//                src: url("/fonts/HafsSmart.woff2") format("woff2"); }
// For satori, load the woff2 buffer into the `fonts` option instead.

export interface HafsSmartSurah {
  [ayahId: string]: string;
}

const cache = new Map<number, Promise<HafsSmartSurah>>();

export function fetchHafsSmartSurah(surahId: number): Promise<HafsSmartSurah> {
  let p = cache.get(surahId);
  if (!p) {
    p = fetch(`/quran/hafs-smart/s${String(surahId).padStart(3, "0")}.json`).then(
      (r) => {
        if (!r.ok) throw new Error(`hafs-smart s${surahId}: HTTP ${r.status}`);
        return r.json() as Promise<HafsSmartSurah>;
      }
    );
    cache.set(surahId, p);
  }
  return p;
}

// Word-level runs of an ayah's PUA stream. The final token is the ayah
// medallion; pass includeMedallion=false to drop it.
export function hafsSmartWords(
  puaText: string,
  includeMedallion = true
): string[] {
  const words = puaText.split(" ").filter(Boolean);
  return includeMedallion ? words : words.slice(0, -1);
}
