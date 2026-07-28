"use client";

import {
  getDisplayAyahText,
  tajweedColors,
  type TajweedSegment,
} from "@/lib/quran-tajweed";
import { QpcAyahGlyphText } from "./qpc-ayah-text";
import type { Ayah, PlacedGlyphWord } from "./reader-data";

// Render priority for study-view Arabic:
// 1. Tajweed colors: the TEXT path (tajweed spans are inherently text; the
//    QPC glyph codes cannot carry per-rule color).
// 2. QPC v4 page-font glyphs, the same rendering as the mushaf view.
// 3. Plain text fallback while the layout is loading or errored.
// Copy/share actions keep copying textUthmani, never glyph codes.
export function QuranArabicText({
  ayah,
  fontSize,
  showTajweed,
  tajweedSegments,
  glyphWords,
}: {
  ayah: Ayah;
  fontSize: number;
  showTajweed: boolean;
  tajweedSegments: TajweedSegment[] | null;
  glyphWords?: PlacedGlyphWord[] | null;
}) {
  if (showTajweed && tajweedSegments && tajweedSegments.length > 0) {
    return (
      <p
        dir="rtl"
        className="font-arabic leading-[2.2] text-foreground"
        style={{ fontSize }}
      >
        {tajweedSegments.map((segment, index) => (
          <span
            key={`${segment.text}-${index}`}
            style={segment.rule ? { color: tajweedColors[segment.rule] } : undefined}
          >
            {segment.text}
          </span>
        ))}
      </p>
    );
  }

  if (glyphWords && glyphWords.length > 0) {
    return <QpcAyahGlyphText ayah={ayah} words={glyphWords} fontSize={fontSize} />;
  }

  return (
    <p
      dir="rtl"
      className="font-arabic leading-[2.2] text-foreground"
      style={{ fontSize }}
    >
      {getDisplayAyahText(ayah)}
    </p>
  );
}
