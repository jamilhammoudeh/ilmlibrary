// Gold hairline-and-diamond divider used under page titles and between
// sections. tone="light" is for dark teal surfaces (footer, dua card).

export function Ornament({
  tone = "dark",
  className = "",
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const line =
    tone === "light"
      ? "from-transparent to-gold-400/70"
      : "from-transparent to-gold-500/80";
  const diamond =
    tone === "light" ? "border-gold-400/90" : "border-gold-500";
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center gap-2.5 ${className}`}
    >
      <span className={`h-px w-14 bg-gradient-to-r ${line}`} />
      <span className={`block w-1.5 h-1.5 rotate-45 border ${diamond}`} />
      <span className={`h-px w-14 bg-gradient-to-l ${line}`} />
    </div>
  );
}
