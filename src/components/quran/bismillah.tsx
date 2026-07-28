"use client";

import { BISMILLAH } from "@/lib/quran-tajweed";
import { cx } from "./ui";

// U+FDFD, the full calligraphic bismillah ligature, rendered by the bundled
// QuranBismillah subset font (see globals.css). The aria-label keeps screen
// readers on the spelled-out text instead of the single ligature codepoint.
const BISMILLAH_LIGATURE = "\uFDFD";

export function BismillahGlyph({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label={BISMILLAH}
      className={cx("bismillah-glyph", className)}
    >
      {BISMILLAH_LIGATURE}
    </span>
  );
}
