import Link from "next/link";

// Link-based language filter tabs (All / English / العربية). Server-friendly:
// each tab is a link that sets ?lang= on the given base path, preserving any
// extra params passed in.

// English is the default view on category pages; Arabic books live behind the
// العربية tab so they never flood the English sections. The homepage's "New in
// the Library" passes includeAll so the truly newest books show regardless of
// language.
const TABS = [
  { value: "en", label: "English" },
  { value: "ar", label: "العربية", arabic: true },
] as const;

const ALL_TAB = { value: "", label: "All" } as const;

export function LanguageToggle({
  current,
  basePath,
  extraParams = {},
  includeAll = false,
}: {
  current: string;
  basePath: string;
  extraParams?: Record<string, string>;
  includeAll?: boolean;
}) {
  const tabs = includeAll ? [ALL_TAB, ...TABS] : [...TABS];
  return (
    <div className="inline-flex rounded-full bg-white border border-gray-200 p-1 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      {tabs.map((tab) => {
        const params = new URLSearchParams(extraParams);
        if (tab.value) params.set("lang", tab.value);
        const qs = params.toString();
        const active = current === tab.value;
        return (
          <Link
            key={tab.value || "all"}
            href={qs ? `${basePath}?${qs}` : basePath}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              "arabic" in tab && tab.arabic ? "font-[family-name:var(--font-amiri)] text-base leading-none" : ""
            } ${
              active
                ? "bg-teal-700 text-white"
                : "text-teal-900 hover:bg-teal-50"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
