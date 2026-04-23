import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import {
  Activity,
  Info,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  XCircle,
} from "lucide-react";

export const metadata = {
  title: "Qalqalah (Echo)",
  description:
    "The five qalqalah letters, when the echo occurs, and how to release them cleanly without adding a vowel.",
};

const qalqalahExamples = [
  { arabic: "أَحَدْ", phonetic: "aḥa(d)", letter: "د" },
  { arabic: "يَجْعَل", phonetic: "yajʿa(l)", letter: "ج" },
  { arabic: "أَجْر", phonetic: "a(j)r", letter: "ج" },
  { arabic: "يَقْطَع", phonetic: "ya(q)ṭaʿ", letter: "ق" },
  { arabic: "يَبْتَغُون", phonetic: "ya(b)taghūn", letter: "ب" },
];

export default function QalqalahPage() {
  return (
    <>
      <ContentHeader
        title="Qalqalah (Echo)"
        breadcrumbs={[
          { label: "Quran", href: "/quran" },
          { label: "Tajweed", href: "/quran/tajweed" },
          { label: "Qalqalah" },
        ]}
        subtitle="The natural bounce that keeps five letters from dying silently"
      />

      <section className="max-w-6xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        <div className="bg-teal-100 rounded-2xl px-8 py-8 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[19px] leading-[1.65] text-center">
            Qalqalah (قلقلة) is a natural bouncing sound that occurs when certain
            letters are in a sukūn state. It is not a vowel and not silence. Its
            purpose is to prevent the sound from becoming cut off or broken.
          </p>
        </div>

        {/* The 5 letters */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              The Five Qalqalah Letters
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            A common mnemonic combines them: قطب جد
          </p>
          <div className="bg-white rounded-2xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
            <p
              className="font-[family-name:var(--font-amiri)] text-teal-900 text-5xl text-center leading-loose"
              dir="rtl"
            >
              ق ط ب ج د
            </p>
            <p className="text-center text-sm text-gray-500 mt-4">
              qāf · ṭāʾ · bāʾ · jīm · dāl
            </p>
          </div>
        </div>

        {/* What it is / isn't */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Info size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              What Qalqalah Is (and Is Not)
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Think of it as releasing the letter, not opening the mouth.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <h3 className="text-base font-bold text-emerald-900 uppercase tracking-wider">
                  What it is
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5 shrink-0">✓</span>
                  A slight echo
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5 shrink-0">✓</span>
                  Natural and effortless
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5 shrink-0">✓</span>
                  A release, not a vowel
                </li>
              </ul>
            </div>
            <div className="bg-rose-50 border-l-4 border-rose-400 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <XCircle size={18} className="text-rose-600" />
                <h3 className="text-base font-bold text-rose-900 uppercase tracking-wider">
                  What it is not
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5 shrink-0">✗</span>
                  Not a fatḥah
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5 shrink-0">✗</span>
                  Not an added vowel
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5 shrink-0">✗</span>
                  Not exaggerated
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* When it occurs */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              When Qalqalah Occurs
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Any of the five letters triggers qalqalah when it has a sukūn, or
            when you stop on it (waqf).
          </p>
          <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-teal-900 text-white">
                    <th className="text-right font-semibold px-4 py-3">
                      Arabic
                    </th>
                    <th className="text-left font-semibold px-4 py-3">
                      Pronunciation
                    </th>
                    <th className="text-left font-semibold px-4 py-3">
                      Letter
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {qalqalahExamples.map((e, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-white" : "bg-teal-50/40"}
                    >
                      <td
                        className="px-4 py-3 font-[family-name:var(--font-amiri)] text-teal-900 text-xl text-right"
                        dir="rtl"
                      >
                        {e.arabic}
                      </td>
                      <td className="px-4 py-3 text-gray-700 italic">
                        {e.phonetic}
                      </td>
                      <td
                        className="px-4 py-3 font-[family-name:var(--font-amiri)] text-teal-700 text-xl"
                        dir="rtl"
                      >
                        {e.letter}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 italic text-center">
            The parenthesized letter is where the echo lives. You hear the
            sound, but no vowel is added.
          </p>
        </div>

        {/* Why it exists */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Info size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Why Qalqalah Exists
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Without qalqalah
              </p>
              <ul className="space-y-1.5 text-sm text-gray-700">
                <li>The letter would sound cut off</li>
                <li>Words would sound unnatural or unclear</li>
                <li>Identity of the letter gets lost</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
                With qalqalah
              </p>
              <ul className="space-y-1.5 text-sm text-gray-700">
                <li>Preserves clarity</li>
                <li>Preserves letter identity</li>
                <li>Maintains the natural flow of speech</li>
              </ul>
            </div>
          </div>
          <div className="bg-teal-50 border-l-4 border-teal-700 rounded-2xl p-4 mt-4 flex items-start gap-3">
            <Info size={16} className="text-teal-700 shrink-0 mt-0.5" />
            <p className="text-sm text-teal-900">
              Qalqalah exists because Arabic does not allow these letters to
              &ldquo;die silently&rdquo;. The bounce is the way the sound is
              released cleanly when no vowel follows.
            </p>
          </div>
        </div>

        {/* Important reminder */}
        <div className="mb-12 bg-amber-50 border-l-4 border-amber-500 rounded-2xl p-5 flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-bold text-amber-900 mb-1">
              Important reminder
            </h3>
            <p className="text-sm text-amber-900 leading-relaxed">
              Qalqalah is a sound, not a vowel. If it sounds like an
              &ldquo;a&rdquo;, it&apos;s wrong. If it disappears, it&apos;s also
              wrong. The goal is a brief, natural bounce that keeps the letter
              identifiable without adding anything.
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
              href="/quran/tajweed/noon-tanween"
              className="group bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-bold text-teal-900 group-hover:text-teal-700 transition-colors">
                  Noon Sakinah &amp; Tanween
                </h3>
                <ArrowRight size={18} className="text-teal-700 group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Idhar, Idgham, Iqlab, Ikhfa in full depth.
              </p>
            </Link>
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
