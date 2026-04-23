import React from "react";

// Renders a string, wrapping each U+FDFA (ﷺ) glyph in an Amiri span so it
// picks up proper Arabic ligature rendering instead of Roboto's fallback.
export function GlyphText({ children }: { children: string }) {
  const parts = children.split("\uFDFA");
  if (parts.length === 1) return <>{children}</>;

  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <span className="font-[family-name:var(--font-amiri)] text-[1.1em] leading-none align-middle">
              &#xFDFA;
            </span>
          )}
        </React.Fragment>
      ))}
    </>
  );
}
