import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import {
  GitMerge,
  Info,
  ArrowRight,
  Scale,
} from "lucide-react";

export const metadata = {
  title: "Noon Sakinah & Tanween Rules",
  description:
    "The four rules (Idhar, Idgham, Iqlab, Ikhfa), plus the tanwīn reality and ghunnah strength levels.",
};

const tanweenReality = [
  { tanween: "بًا", sound: "بَنْ", phonetic: "ban" },
  { tanween: "بٌ", sound: "بُنْ", phonetic: "bun" },
  { tanween: "بٍ", sound: "بِنْ", phonetic: "bin" },
];

const rules = [
  {
    name: "Idhaar",
    subtitle: "Clear pronunciation",
    arabic: "الإظهار",
    letters: "ء ه ع ح غ خ",
    letterCount: "6 throat letters",
    description:
      "The noon is pronounced clearly and fully, with no ghunnah merge. The throat letters prevent merging, so the noon must remain clear.",
    example: "مِنْ هَادٍ",
    examplePhonetic: "min hādin",
    color: "bg-emerald-100 text-emerald-900",
  },
  {
    name: "Idghām",
    subtitle: "Merging",
    arabic: "الإدغام",
    letters: "ي ر م ل و ن",
    letterCount: "6 letters (yarmaloon)",
    description:
      "The noon merges into the following letter. With ي و م ن a ghunnah is held for 2 counts. With ل ر, there is no ghunnah — a clean merge.",
    example: "مَن يَقُول",
    examplePhonetic: "may-yaqūl (idghām with ghunnah)",
    color: "bg-sky-100 text-sky-900",
  },
  {
    name: "Iqlāb",
    subtitle: "Flipping",
    arabic: "الإقلاب",
    letters: "ب",
    letterCount: "Only 1 letter",
    description:
      "The noon sound changes into a hidden meem with ghunnah held for 2 counts. The noon is not pronounced; it becomes a meem.",
    example: "سَمِيعٌۢ بَصِير",
    examplePhonetic: "samīʿum-baṣīr",
    color: "bg-amber-100 text-amber-900",
  },
  {
    name: "Ikhfāʾ",
    subtitle: "Hiding",
    arabic: "الإخفاء",
    letters: "ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك",
    letterCount: "Remaining 15 letters",
    description:
      "The noon is hidden, pronounced with ghunnah but without full clarity or full merging. The tongue does not fully touch the articulation point.",
    example: "مِن شَرِّ",
    examplePhonetic: "min-sharri (nasal)",
    color: "bg-rose-100 text-rose-900",
  },
];

const ghunnahLevels = [
  {
    strength: "Strongest",
    where: "Ikhfāʾ · Idghām with ghunnah",
    width: "w-full",
    color: "bg-teal-700",
  },
  {
    strength: "Medium",
    where: "Noon or meem with shaddah",
    width: "w-2/3",
    color: "bg-teal-500",
  },
  {
    strength: "None",
    where: "Idghām without ghunnah (ل ر)",
    width: "w-1/6",
    color: "bg-gray-300",
  },
];

export default function NoonTanweenPage() {
  return (
    <>
      <ContentHeader
        title="Noon Sakinah & Tanween"
        breadcrumbs={[
          { label: "Quran", href: "/quran" },
          { label: "Tajweed", href: "/quran/tajweed" },
          { label: "Noon Sakinah & Tanween" },
        ]}
        subtitle="The four rules that govern what happens when noon sākinah or tanween meets another letter"
      />

      <section className="max-w-6xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        <div className="bg-teal-100 rounded-2xl px-8 py-8 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[19px] leading-[1.65] text-center">
            Tanween (التنوين) always ends in a hidden noon sākinah, which is why
            both topics are treated together. What happens to that hidden noon
            depends entirely on the letter that follows. There are four possible
            rules: Idhaar, Idghām, Iqlāb, and Ikhfāʾ.
          </p>
        </div>

        {/* Tanween reality */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Info size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Tanween Pronunciation Reality
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Although tanween appears as a vowel mark, it is pronounced as a noon
            sākinah (نْ) at the end of the word.
          </p>
          <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-teal-900 text-white">
                    <th className="text-right px-4 py-3 font-semibold">Tanween</th>
                    <th className="text-right px-4 py-3 font-semibold">
                      Actual sound
                    </th>
                    <th className="text-left px-4 py-3 font-semibold">
                      Phonetic
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tanweenReality.map((e, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-white" : "bg-teal-50/40"}
                    >
                      <td
                        className="px-4 py-3 font-[family-name:var(--font-amiri)] text-teal-900 text-2xl text-right"
                        dir="rtl"
                      >
                        {e.tanween}
                      </td>
                      <td
                        className="px-4 py-3 font-[family-name:var(--font-amiri)] text-teal-900 text-2xl text-right"
                        dir="rtl"
                      >
                        {e.sound}
                      </td>
                      <td className="px-4 py-3 text-gray-700 italic">
                        {e.phonetic}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Four rules */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <GitMerge size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              The Four Rules
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Each rule is triggered by a different group of letters following the
            noon sākinah or tanween.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rules.map((r) => (
              <div
                key={r.name}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex flex-col"
              >
                <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
                  <div>
                    <h3 className="text-lg font-bold text-teal-900">{r.name}</h3>
                    <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider">
                      {r.subtitle}
                    </p>
                  </div>
                  <span
                    className="font-[family-name:var(--font-amiri)] text-teal-700 text-2xl"
                    dir="rtl"
                  >
                    {r.arabic}
                  </span>
                </div>

                <div className="bg-teal-50/50 rounded-xl p-3 my-3">
                  <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider mb-1">
                    Triggering letters
                  </p>
                  <p
                    className="font-[family-name:var(--font-amiri)] text-teal-900 text-lg leading-relaxed"
                    dir="rtl"
                  >
                    {r.letters}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{r.letterCount}</p>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed mb-3 flex-1">
                  {r.description}
                </p>

                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Example
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className="font-[family-name:var(--font-amiri)] text-teal-900 text-xl"
                      dir="rtl"
                    >
                      {r.example}
                    </span>
                    <span className="text-xs text-gray-500 italic">
                      {r.examplePhonetic}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ghunnah strength */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Scale size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Ghunnah Strength Levels
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Not all ghunnah is the same strength. The ghunnah is held more
            prominently in some rules than others.
          </p>
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] space-y-4">
            {ghunnahLevels.map((g) => (
              <div key={g.strength}>
                <div className="flex items-center justify-between gap-3 mb-1">
                  <p className="text-sm font-semibold text-teal-900">
                    {g.strength}
                  </p>
                  <p className="text-xs text-gray-500">{g.where}</p>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${g.width} ${g.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key teaching line */}
        <div className="mb-12 bg-teal-900 text-white rounded-2xl px-8 py-8 shadow-[0_4px_12px_rgba(0,0,0,0.12)] text-center">
          <p className="text-xl md:text-2xl font-bold font-[family-name:var(--font-playfair)] leading-tight">
            Tanween is not a vowel.
            <br />
            It&apos;s a <span className="text-teal-200">noon sākinah</span> in
            disguise.
          </p>
          <p className="text-sm text-teal-100 mt-3 max-w-2xl mx-auto leading-relaxed">
            The rule is always determined by the next letter, not by the vowel
            mark. Train your eyes to look at what comes after.
          </p>
        </div>

        {/* Continue */}
        <div>
          <h2 className="text-2xl font-bold text-teal-900 mb-6 font-[family-name:var(--font-playfair)]">
            Continue Learning
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/quran/tajweed/waqf"
              className="group bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-bold text-teal-900 group-hover:text-teal-700 transition-colors">
                  Waqf (Stopping)
                </h3>
                <ArrowRight size={18} className="text-teal-700 group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                When to stop and what happens to the last letter.
              </p>
            </Link>
            <Link
              href="/quran/tajweed/madd"
              className="group bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-bold text-teal-900 group-hover:text-teal-700 transition-colors">
                  Madd (Elongation)
                </h3>
                <ArrowRight size={18} className="text-teal-700 group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                All four madd types with count tables.
              </p>
            </Link>
            <Link
              href="/quran/tajweed"
              className="group bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-bold text-teal-900 group-hover:text-teal-700 transition-colors">
                  Back to Tajweed
                </h3>
                <ArrowRight size={18} className="text-teal-700 group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                The main hub with all topics.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
