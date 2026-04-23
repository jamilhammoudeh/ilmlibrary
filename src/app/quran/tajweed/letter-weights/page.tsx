import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import {
  Scale,
  Info,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ArrowDown,
  ArrowUp,
} from "lucide-react";

export const metadata = {
  title: "Heavy & Light Letters (Tafkheem / Tarqeeq)",
  description:
    "Letters are heavy, light, or conditional. Learn which is which, plus the rules for Ra, Lam, and Alif.",
};

const heavyExamples = [
  { arabic: "قَالَ", phonetic: "qāla" },
  { arabic: "صِرَاط", phonetic: "ṣirāṭ" },
  { arabic: "طَبَعَ", phonetic: "ṭabaʿa" },
  { arabic: "غَفُور", phonetic: "ghafūr" },
  { arabic: "خَالِد", phonetic: "khālid" },
];

const lightExamples = [
  { arabic: "بِسْم", phonetic: "bism" },
  { arabic: "نَعِيم", phonetic: "naʿīm" },
  { arabic: "سَبِيل", phonetic: "sabīl" },
  { arabic: "يَوْم", phonetic: "yawm" },
  { arabic: "فِيهِ", phonetic: "fīhi" },
];

const raHeavy = [
  { arabic: "رَبِّ", phonetic: "rabbi" },
  { arabic: "رُزِقُوا", phonetic: "ruziqū" },
  { arabic: "قَرَأَ", phonetic: "qaraʾa" },
];
const raLight = [
  { arabic: "فِرْعَوْن", phonetic: "firʿawn" },
  { arabic: "رِجَال", phonetic: "rijāl" },
  { arabic: "شِرْعَة", phonetic: "shirʿah" },
];

const lamHeavy = [
  { arabic: "ٱللَّهُ", phonetic: "Allāhu" },
  { arabic: "قَالَ ٱللَّهُ", phonetic: "qāla Allāhu" },
  { arabic: "نَصْرُ ٱللَّهِ", phonetic: "naṣru Allāhi" },
];
const lamLight = [
  { arabic: "بِٱللَّهِ", phonetic: "billāhi" },
  { arabic: "لِلَّهِ", phonetic: "lillāhi" },
];

const alifExamples = [
  { arabic: "قَالَ", phonetic: "qāla", reason: "Heavy letter (ق)", heavy: true },
  { arabic: "صَادِق", phonetic: "ṣādiq", reason: "Heavy letter (ص)", heavy: true },
  { arabic: "كَانَ", phonetic: "kāna", reason: "Light letter (ك)", heavy: false },
  { arabic: "نَاس", phonetic: "nās", reason: "Light letter (ن)", heavy: false },
];

export default function LetterWeightsPage() {
  return (
    <>
      <ContentHeader
        title="Heavy & Light Letters"
        breadcrumbs={[
          { label: "Quran", href: "/quran" },
          { label: "Tajweed", href: "/quran/tajweed" },
          { label: "Heavy & Light Letters" },
        ]}
        subtitle="Tafkheem, tarqeeq, and the conditional letters"
      />

      <section className="max-w-6xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        <div className="bg-teal-100 rounded-2xl px-8 py-8 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[19px] leading-[1.65] text-center">
            Arabic letters differ in weight. Some letters are always heavy
            (tafkheem), some always light (tarqeeq), and some are conditional,
            meaning their weight changes based on context. Correct letter weight
            is essential for accurate pronunciation and natural recitation.
          </p>
        </div>

        {/* Heavy */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUp size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Heavy Letters (Tafkheem)
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Always heavy, regardless of the vowel. Pronounced with the back of
            the tongue raised and a full, deep sound. Never thinned, even with
            kasrah.
          </p>

          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-4">
            <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
              The 7 always-heavy letters
            </p>
            <p
              className="font-[family-name:var(--font-amiri)] text-teal-900 text-3xl text-center leading-loose"
              dir="rtl"
            >
              خ ص ض غ ط ق ظ
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {heavyExamples.map((e, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-center"
              >
                <p
                  className="font-[family-name:var(--font-amiri)] text-teal-900 text-xl mb-1"
                  dir="rtl"
                >
                  {e.arabic}
                </p>
                <p className="text-xs text-gray-500 italic">{e.phonetic}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Light */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDown size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Light Letters (Tarqeeq)
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Always light, never pronounced heavy. Relaxed tongue, no back-tongue
            elevation, clear and sharp articulation.
          </p>

          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-4">
            <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
              Always-light letters
            </p>
            <p
              className="font-[family-name:var(--font-amiri)] text-teal-900 text-3xl text-center leading-loose"
              dir="rtl"
            >
              ب ت ث ج ح د ذ ز س ش ف ك ل م ن هـ و ي
            </p>
            <p className="text-xs text-gray-500 mt-3 text-center italic">
              Lām (ل) and waw (و) are light by default, but lām becomes
              conditional in one specific case: the word &ldquo;Allah&rdquo;.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {lightExamples.map((e, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-center"
              >
                <p
                  className="font-[family-name:var(--font-amiri)] text-teal-900 text-xl mb-1"
                  dir="rtl"
                >
                  {e.arabic}
                </p>
                <p className="text-xs text-gray-500 italic">{e.phonetic}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Conditional */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Scale size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Conditional Letters
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            These letters change weight depending on vowels or surrounding
            letters.
          </p>

          {/* Ra */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-4">
            <div className="flex items-baseline justify-between gap-3 mb-1 flex-wrap">
              <h3 className="text-lg font-bold text-teal-900">A. Rāʾ (ر)</h3>
              <p
                className="font-[family-name:var(--font-amiri)] text-teal-700 text-3xl"
                dir="rtl"
              >
                ر
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Weight depends on the vowel on the rāʾ itself (not the surrounding
              letters).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-rose-50/60 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUp size={14} className="text-rose-700" />
                  <p className="text-xs font-semibold text-rose-800 uppercase tracking-wider">
                    Heavy rāʾ: fatḥah or ḍammah
                  </p>
                </div>
                <ul className="space-y-1">
                  {raHeavy.map((e, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-3 text-sm bg-white rounded-lg px-3 py-1.5"
                    >
                      <span
                        className="font-[family-name:var(--font-amiri)] text-teal-900 text-lg"
                        dir="rtl"
                      >
                        {e.arabic}
                      </span>
                      <span className="text-xs text-gray-500 italic">
                        {e.phonetic}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-sky-50/60 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowDown size={14} className="text-sky-700" />
                  <p className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
                    Light rāʾ: kasrah
                  </p>
                </div>
                <ul className="space-y-1">
                  {raLight.map((e, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-3 text-sm bg-white rounded-lg px-3 py-1.5"
                    >
                      <span
                        className="font-[family-name:var(--font-amiri)] text-teal-900 text-lg"
                        dir="rtl"
                      >
                        {e.arabic}
                      </span>
                      <span className="text-xs text-gray-500 italic">
                        {e.phonetic}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Lam */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-4">
            <div className="flex items-baseline justify-between gap-3 mb-1 flex-wrap">
              <h3 className="text-lg font-bold text-teal-900">B. Lām (ل)</h3>
              <p
                className="font-[family-name:var(--font-amiri)] text-teal-700 text-3xl"
                dir="rtl"
              >
                ل
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Always light, except in the word{" "}
              <span className="font-semibold">Allah (ٱللَّه)</span>.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-rose-50/60 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUp size={14} className="text-rose-700" />
                  <p className="text-xs font-semibold text-rose-800 uppercase tracking-wider">
                    Heavy lām: after fatḥah/ḍammah
                  </p>
                </div>
                <ul className="space-y-1">
                  {lamHeavy.map((e, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-3 text-sm bg-white rounded-lg px-3 py-1.5"
                    >
                      <span
                        className="font-[family-name:var(--font-amiri)] text-teal-900 text-lg"
                        dir="rtl"
                      >
                        {e.arabic}
                      </span>
                      <span className="text-xs text-gray-500 italic">
                        {e.phonetic}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-sky-50/60 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowDown size={14} className="text-sky-700" />
                  <p className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
                    Light lām: after kasrah
                  </p>
                </div>
                <ul className="space-y-1">
                  {lamLight.map((e, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-3 text-sm bg-white rounded-lg px-3 py-1.5"
                    >
                      <span
                        className="font-[family-name:var(--font-amiri)] text-teal-900 text-lg"
                        dir="rtl"
                      >
                        {e.arabic}
                      </span>
                      <span className="text-xs text-gray-500 italic">
                        {e.phonetic}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Alif */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
            <div className="flex items-baseline justify-between gap-3 mb-1 flex-wrap">
              <h3 className="text-lg font-bold text-teal-900">C. Alif (ا)</h3>
              <p
                className="font-[family-name:var(--font-amiri)] text-teal-700 text-3xl"
                dir="rtl"
              >
                ا
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Alif itself has no sound. It inherits the weight of the letter
              before it. After a heavy letter, the alif sounds heavy. After a
              light letter, it sounds light.
            </p>
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-right px-4 py-2 font-semibold text-gray-700">
                      Arabic
                    </th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-700">
                      Phonetic
                    </th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-700">
                      Why
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {alifExamples.map((e, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}
                    >
                      <td
                        className="px-4 py-2 font-[family-name:var(--font-amiri)] text-teal-900 text-lg text-right"
                        dir="rtl"
                      >
                        {e.arabic}
                      </td>
                      <td className="px-4 py-2 text-gray-700 italic">
                        {e.phonetic}
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-500">
                        {e.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Common mistake */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-12">
          <div className="bg-rose-50 border-l-4 border-rose-400 rounded-2xl p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertCircle size={14} className="text-rose-600" />
              <p className="text-xs font-semibold text-rose-800 uppercase tracking-wider">
                Common mistake
              </p>
            </div>
            <p className="text-sm text-gray-700">
              Making alif heavy on its own, or thinning a heavy letter just
              because it carries kasrah.
            </p>
          </div>
          <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-2xl p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Correct
              </p>
            </div>
            <p className="text-sm text-gray-700">
              The 7 heavy letters are always heavy. Alif follows, never leads.
              For rāʾ, follow its own vowel.
            </p>
          </div>
        </div>

        {/* Continue */}
        <div>
          <h2 className="text-2xl font-bold text-teal-900 mb-6 font-[family-name:var(--font-playfair)]">
            Continue Learning
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              href="/quran/tajweed/makharij"
              className="group bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-bold text-teal-900 group-hover:text-teal-700 transition-colors">
                  Makharij al-Huruf
                </h3>
                <ArrowRight size={18} className="text-teal-700 group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Articulation points by practical zone.
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
