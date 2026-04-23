import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import {
  Pause,
  Info,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  BookOpen,
} from "lucide-react";

export const metadata = {
  title: "Waqf (Stopping in the Qur'an)",
  description:
    "When to stop, the types of waqf, the mushaf symbols, and what happens to the last letter when you stop.",
};

const endingTypes = [
  {
    title: "Words ending with ḍammah, fatḥah, or kasrah",
    note: "The vowel is dropped, the letter becomes sākin. The sound is cut cleanly without adding extra vowels.",
    rows: [
      { connected: "الْعَالَمِينَ", stopped: "الْعَالَمِينْ" },
      { connected: "نَسْتَعِينُ", stopped: "نَسْتَعِينْ" },
      { connected: "الْكِتَابِ", stopped: "الْكِتَابْ" },
    ],
  },
  {
    title: "Words ending with tanween",
    note: "Tanween is never pronounced when stopping. Special case: fatḥatayn followed by alif keeps the alif as a long ā sound.",
    rows: [
      { connected: "بَصِيرٌ", stopped: "بَصِيرْ" },
      { connected: "عَلِيمٍ", stopped: "عَلِيمْ" },
      { connected: "رَحْمَةً", stopped: "رَحْمَةْ" },
      { connected: "كِتَابًا", stopped: "كِتَابَا (alif remains)" },
    ],
  },
  {
    title: "Tāʾ marbūṭah (ة)",
    note: "When stopping, tāʾ marbūṭah is pronounced as hāʾ sākinah (ـهْ). Consistent throughout the Qur'an.",
    rows: [
      { connected: "رَحْمَةٌ", stopped: "رَحْمَهْ" },
      { connected: "جَنَّةٍ", stopped: "جَنَّهْ" },
    ],
  },
  {
    title: "Words ending with long vowels (ا و ي)",
    note: "Long vowels remain unchanged when stopping. No shortening occurs.",
    rows: [
      { connected: "هُدَى", stopped: "هُدَى" },
      { connected: "يَقُولُ", stopped: "يَقُولْ" },
      { connected: "فِي", stopped: "فِي" },
    ],
  },
];

const waqfTypes = [
  {
    name: "Waqf Tām",
    english: "Complete stop",
    arabic: "الوقف التام",
    badge: "Best",
    color: "bg-emerald-100 text-emerald-900",
    icon: CheckCircle2,
    iconColor: "text-emerald-600",
    description:
      "The meaning is complete and independent. The best place to stop — usually at the end of an ayah with a fully self-contained meaning.",
  },
  {
    name: "Waqf Kāfī",
    english: "Sufficient stop",
    arabic: "الوقف الكافي",
    badge: "Permissible",
    color: "bg-teal-100 text-teal-900",
    icon: CheckCircle2,
    iconColor: "text-teal-600",
    description:
      "The meaning is complete, but connected to what follows. Permissible to stop here.",
  },
  {
    name: "Waqf Ḥasan",
    english: "Good stop",
    arabic: "الوقف الحسن",
    badge: "Breath only",
    color: "bg-amber-100 text-amber-900",
    icon: AlertCircle,
    iconColor: "text-amber-600",
    description:
      "The wording makes sense, but the meaning is incomplete. Allowed only for breath, not preferred as a deliberate stop.",
  },
  {
    name: "Waqf Qabīḥ",
    english: "Bad stop",
    arabic: "الوقف القبيح",
    badge: "Not allowed",
    color: "bg-rose-100 text-rose-900",
    icon: XCircle,
    iconColor: "text-rose-600",
    description:
      "Stopping breaks the meaning or creates error. For example, stopping at 'Do not approach prayer' before continuing with 'while you are intoxicated' creates a dangerous misunderstanding.",
  },
];

const waqfSymbols = [
  { symbol: "مـ", meaning: "Mandatory stop", color: "bg-rose-50 text-rose-800" },
  { symbol: "لا", meaning: "Do not stop", color: "bg-gray-100 text-gray-800" },
  { symbol: "ج", meaning: "Permissible to stop or continue", color: "bg-amber-50 text-amber-800" },
  { symbol: "قلى", meaning: "Stop is better", color: "bg-teal-50 text-teal-800" },
  { symbol: "صلى", meaning: "Continue is better", color: "bg-sky-50 text-sky-800" },
  { symbol: "∴ ∴", meaning: "Choose one stop, not both (mu'ānaqah)", color: "bg-purple-50 text-purple-800" },
];

export default function WaqfPage() {
  return (
    <>
      <ContentHeader
        title="Waqf (Stopping)"
        breadcrumbs={[
          { label: "Quran", href: "/quran" },
          { label: "Tajweed", href: "/quran/tajweed" },
          { label: "Waqf" },
        ]}
        subtitle="When to stop, where the meaning stops, and what happens to the last letter"
      />

      <section className="max-w-6xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        <div className="bg-teal-100 rounded-2xl px-8 py-8 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[19px] leading-[1.65] text-center">
            Waqf (وَقْف) means to stop or pause while reciting the Qur&apos;an
            with the intention of resuming correctly afterward. From the root و
            ق ف, meaning to stop or halt. In tajweed, it refers specifically to
            stopping at the end of a word while preserving the meaning,
            pronunciation, and beauty of the Qur&apos;an. Waqf is not random
            breathing — it is a deliberate, rule-based pause.
          </p>
        </div>

        {/* Why waqf matters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="bg-rose-50 border-l-4 border-rose-400 rounded-2xl p-5">
            <p className="text-xs font-semibold text-rose-800 uppercase tracking-wider mb-2">
              Stopping incorrectly can
            </p>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>Change the meaning of an ayah</li>
              <li>Create theological errors</li>
              <li>Break the grammatical structure</li>
              <li>Distort the listener&apos;s understanding</li>
            </ul>
          </div>
          <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-2xl p-5">
            <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2">
              Correct waqf
            </p>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>Preserves meaning</li>
              <li>Maintains clarity</li>
              <li>Reflects proper understanding</li>
              <li>Shows respect for the words of Allah</li>
            </ul>
          </div>
        </div>

        {/* Big callout */}
        <div className="mb-12 bg-teal-900 text-white rounded-2xl px-8 py-8 shadow-[0_4px_12px_rgba(0,0,0,0.12)] text-center">
          <p className="text-xl md:text-2xl font-bold font-[family-name:var(--font-playfair)] leading-tight mb-2">
            Waqf is not about <span className="text-teal-200">breath</span>.
            <br />
            It is about <span className="text-teal-200">meaning</span>.
          </p>
          <p className="text-sm text-teal-100 max-w-xl mx-auto">
            You stop where the meaning stops, not where the lungs give up. Some
            scholars said: &ldquo;Knowing where to stop is half of
            recitation.&rdquo;
          </p>
        </div>

        {/* Golden rule of ending letter */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              What Happens to the Last Letter
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            The golden rule: every vowel at the end of a word becomes a sukūn
            when stopping, except a few special cases.
          </p>
          <div className="space-y-5">
            {endingTypes.map((t) => (
              <div
                key={t.title}
                className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <h3 className="text-base font-bold text-teal-900 mb-1">
                  {t.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {t.note}
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-right px-4 py-2 font-semibold text-gray-700">
                          Connected reading
                        </th>
                        <th className="text-right px-4 py-2 font-semibold text-gray-700">
                          When stopping
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {t.rows.map((r, i) => (
                        <tr
                          key={i}
                          className={i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}
                        >
                          <td
                            className="px-4 py-2 font-[family-name:var(--font-amiri)] text-teal-900 text-lg text-right"
                            dir="rtl"
                          >
                            {r.connected}
                          </td>
                          <td
                            className="px-4 py-2 font-[family-name:var(--font-amiri)] text-teal-900 text-lg text-right"
                            dir="rtl"
                          >
                            {r.stopped}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Types of waqf */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Pause size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Types of Waqf (by Meaning)
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Scholars classify every possible stopping point by how it affects
            the meaning.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {waqfTypes.map((w) => (
              <div
                key={w.name}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <w.icon size={18} className={w.iconColor} />
                    <h3 className="text-base font-bold text-teal-900">
                      {w.name}
                    </h3>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${w.color}`}
                  >
                    {w.badge}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                  <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider">
                    {w.english}
                  </p>
                  <span
                    className="font-[family-name:var(--font-amiri)] text-teal-700 text-base"
                    dir="rtl"
                  >
                    {w.arabic}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {w.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Waqf symbols */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Info size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Waqf Symbols in the Mushaf
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            These small symbols appear above words to guide the reader. They
            indicate meaning, not breathing convenience.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {waqfSymbols.map((s) => (
              <div
                key={s.symbol}
                className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}
                >
                  <span
                    className="font-[family-name:var(--font-amiri)] text-xl"
                    dir="rtl"
                  >
                    {s.symbol}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{s.meaning}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Continue */}
        <div>
          <h2 className="text-2xl font-bold text-teal-900 mb-6 font-[family-name:var(--font-playfair)]">
            Continue Learning
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/quran/tajweed/reading-mushaf"
              className="group bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-bold text-teal-900 group-hover:text-teal-700 transition-colors">
                  Reading from the Mushaf
                </h3>
                <ArrowRight size={18} className="text-teal-700 group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Visual cues that tell you which rule applies.
              </p>
            </Link>
            <Link
              href="/quran/tajweed/improving-recitation"
              className="group bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-bold text-teal-900 group-hover:text-teal-700 transition-colors">
                  Improving Recitation
                </h3>
                <ArrowRight size={18} className="text-teal-700 group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Three practices that strengthen your tajweed.
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
