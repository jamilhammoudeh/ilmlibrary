// Mushaf-style ornamental surah banner, ported from the app's SurahBanner
// (src/components/ui/SurahBanner.tsx). The frame is the Madani plaque bitmap;
// the title is a per-surah calligraphic mask (KFGQPC SurahNames glyphs baked
// to PNG) tinted via CSS mask so the ink color matches the printed mushaf
// green. Geometry mirrors the app exactly: the 950x127 frame is drawn into a
// box compressed to 86% of its natural height (the app's HEIGHT_SCALE), the
// name mask spans 28% of the width at 102% height, nudged up ~1.5%.
//
// Assets: /quran/surah-banner-madani.png + /quran/surah-headers/surah-NNN.png
// (copied from the app bundle; masks fetch lazily per surah viewed).

const FRAME_SRC = "/quran/surah-banner-madani.png";
const FRAME_W = 950;
const FRAME_H = 127;
const HEIGHT_SCALE = 0.86;
// Box aspect after the app's vertical compression: 950 : (127 * 0.86).
const BOX_ASPECT = `${FRAME_W} / ${FRAME_H * HEIGHT_SCALE}`;
// Printed-mushaf title ink (app: nameInk light). The app also ships a dark
// frame (surah-banner-madani-dark.png, ink #1F3A2D) - port it if the web
// reader ever gains a dark scheme.
const NAME_INK = "#005E2A";

function headerMaskUrl(surahId: number): string {
  return `/quran/surah-headers/surah-${String(surahId).padStart(3, "0")}.png`;
}

export function SurahBanner({
  surahId,
  label,
  className,
  fill = false,
}: {
  surahId: number; // 1..114
  /** Screen-reader name, e.g. "Surah Al-Baqarah". Omit if a visible heading
   *  nearby already carries it. */
  label?: string;
  className?: string;
  /** When true, the caller owns BOTH dimensions (e.g. full content width
   *  inside the fixed mushaf line slot) and the ornament frame stretches to
   *  fit - the same liberty the app takes when it draws the banner at full
   *  contentWidth. The name mask keeps mask-size contain, so the calligraphy
   *  itself never distorts. Default keeps the natural (compressed) aspect. */
  fill?: boolean;
}) {
  if (surahId < 1 || surahId > 114) return null;
  const mask = `url(${headerMaskUrl(surahId)})`;
  return (
    <div
      className={`relative ${className ?? ""}`}
      style={fill ? undefined : { aspectRatio: BOX_ASPECT }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative
          frame stretched to a non-natural aspect; next/image would fight the
          object-fill geometry for zero optimization win on a 39KB asset. */}
      <img
        src={FRAME_SRC}
        alt=""
        aria-hidden="true"
        draggable={false}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full select-none object-fill"
      />
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 block"
        style={{
          width: "28%",
          height: "102%",
          transform: "translate(-50%, -51.5%)",
          backgroundColor: NAME_INK,
          // Forced-colors mode (Windows High Contrast) overrides author
          // background-color, which would blank the masked calligraphy while
          // the bitmap frame still paints. Opt this span out; the sr-only
          // text at the call sites carries the name for assistive tech.
          forcedColorAdjust: "none",
          maskImage: mask,
          maskRepeat: "no-repeat",
          maskPosition: "center",
          maskSize: "contain",
          WebkitMaskImage: mask,
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          WebkitMaskSize: "contain",
        }}
      />
    </div>
  );
}
