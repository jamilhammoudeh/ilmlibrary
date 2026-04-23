import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import {
  Eye,
  Info,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sun,
  Moon,
} from "lucide-react";

export const metadata = {
  title: "Reading Tajweed from the Mushaf",
  description:
    "Visual tajweed cues in the Mushaf itself: what sukūn, tanwīn shapes, and the laam of 'al-' tell you about pronunciation.",
};

const noSukoonCases = [
  {
    arabic: "مِنْ",
    notice: "Noon has sukūn",
    action: "Pronounce clearly (Idhaar)",
  },
  {
    arabic: "مَن يَقُول",
    notice: "No sukūn on ن",
    action: "Merge (Idghām)",
  },
  {
    arabic: "عَلِيمٌۢ",
    notice: "Tanwīn with a raised mīm above the ن",
    action: "Apply Iqlāb",
  },
];

const parallelTanween = [
  { arabic: "بًا", phonetic: "ban" },
  { arabic: "بٌ", phonetic: "bun" },
  { arabic: "بٍ", phonetic: "bin" },
  {
    arabic: "كِتَابًا عَرَبِيًّا",
    phonetic: "kitāban 'arabiyyan (clear n sounds)",
  },
];

const staggeredTanween = [
  {
    arabic: "غِشَاوَةٌ وَلَهُمْ",
    phonetic: "ghishāwat-wa lahum",
    rule: "Idghām with ghunnah",
  },
  {
    arabic: "مَرَضٌ وَلَهُمْ",
    phonetic: "marad-wa lahum",
    rule: "Idghām with ghunnah",
  },
  {
    arabic: "كَصَيِّبٍ مِنَ",
    phonetic: "ka-ṣayyib-min",
    rule: "Idghām with ghunnah",
  },
];

const qamariyyah = [
  { arabic: "ٱلْقَمَر", phonetic: "al-qamar" },
  { arabic: "ٱلْكِتَاب", phonetic: "al-kitāb" },
  { arabic: "ٱلْهُدَى", phonetic: "al-hudā" },
  { arabic: "ٱلْيَوْم", phonetic: "al-yawm" },
  { arabic: "ٱلْغَفُور", phonetic: "al-ghafūr" },
];

const shamsiyyah = [
  { arabic: "ٱلشَّمْس", phonetic: "ash-shams" },
  { arabic: "ٱلنَّاس", phonetic: "an-nās" },
  { arabic: "ٱلرَّحْمَٰن", phonetic: "ar-raḥmān" },
  { arabic: "ٱلصِّرَاط", phonetic: "aṣ-ṣirāṭ" },
  { arabic: "ٱلتَّوْبَة", phonetic: "at-tawbah" },
];

export default function ReadingMushafPage() {
  return (
    <>
      <ContentHeader
        title="Reading Tajweed from the Mushaf"
        breadcrumbs={[
          { label: "Quran", href: "/quran" },
          { label: "Tajweed", href: "/quran/tajweed" },
          { label: "Reading from the Mushaf" },
        ]}
        subtitle="Visual cues that tell you which rule applies"
      />

      <section className="max-w-6xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        {/* Intro */}
        <div className="bg-teal-100 rounded-2xl px-8 py-8 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[19px] leading-[1.65] text-center">
            Even without a color-coded muṣḥaf, tajweed rules are visible directly
            in the text. The Qur&apos;an is written in a way that signals when a
            sound should be held, merged, hidden, or pronounced clearly, if you
            know what to look for. This page teaches you how to recognize tajweed
            visually, before memorizing specific rules.
          </p>
        </div>

        {/* 1. Letters without sukūn */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Eye size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              1. Letters Without Sukūn
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Excluding madd letters (ا و ي). If a letter has no sukūn and is not a
            madd letter, it must be held, and some tajweed rule applies (ghunnah,
            ikhfa, idghām, iqlāb, etc.).
          </p>

          <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-teal-900 text-white">
                    <th className="text-right font-semibold px-4 py-3">Arabic</th>
                    <th className="text-left font-semibold px-4 py-3">
                      What you notice
                    </th>
                    <th className="text-left font-semibold px-4 py-3">
                      What you do
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {noSukoonCases.map((c, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-white" : "bg-teal-50/40"}
                    >
                      <td
                        className="px-4 py-3 font-[family-name:var(--font-amiri)] text-teal-900 text-xl text-right"
                        dir="rtl"
                      >
                        {c.arabic}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{c.notice}</td>
                      <td className="px-4 py-3 text-gray-700 font-medium">
                        {c.action}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-teal-50 border-l-4 border-teal-700 rounded-2xl p-4 mt-4 flex items-start gap-3">
            <Info size={16} className="text-teal-700 shrink-0 mt-0.5" />
            <p className="text-sm text-teal-900">
              <span className="font-semibold">Rule of thumb:</span> if there is
              no sukūn, the sound does not pass quickly. Hold it and apply the
              relevant rule.
            </p>
          </div>
        </div>

        {/* 2. Tanwīn shape */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Eye size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              2. Tanwīn Shape = Rule Indicator
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Tanwīn always ends in a hidden noon sākinah, which is why its shape
            matters. Look at how the two strokes are drawn.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Parallel */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <h3 className="text-base font-bold text-teal-900">
                  Parallel tanwīn → Idhaar
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                When the two tanwīn strokes are parallel, the noon is pronounced
                clearly. You hear a full, clean &ldquo;n&rdquo; sound.
              </p>
              <ul className="space-y-1.5">
                {parallelTanween.map((e, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-3 text-sm bg-gray-50 rounded-lg px-3 py-1.5"
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

            {/* Staggered */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={16} className="text-amber-600" />
                <h3 className="text-base font-bold text-teal-900">
                  Staggered / connected tanwīn → Apply a rule
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                When the marks appear staggered, connected, or visually altered,
                this usually signals Idghām, Ikhfāʾ, or Iqlāb. The muṣḥaf is
                telling you: don&apos;t pronounce the noon normally.
              </p>
              <ul className="space-y-1.5">
                {staggeredTanween.map((e, i) => (
                  <li key={i} className="bg-gray-50 rounded-lg px-3 py-2">
                    <div className="flex items-center justify-between gap-3 mb-0.5">
                      <span
                        className="font-[family-name:var(--font-amiri)] text-teal-900 text-lg"
                        dir="rtl"
                      >
                        {e.arabic}
                      </span>
                      <span className="text-xs text-gray-500 italic">
                        {e.phonetic}
                      </span>
                    </div>
                    <p className="text-[11px] text-teal-700 font-semibold uppercase tracking-wider">
                      {e.rule}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-2xl p-4 mt-4 flex items-start gap-3">
            <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-900">
              <span className="font-semibold">Note:</span> not every muṣḥaf shows
              tanwīn shapes identically, but the principle is the same. If the
              tanwīn does not look standard, slow down and apply a rule.
            </p>
          </div>
        </div>

        {/* 3. Laam of Al- */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Eye size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              3. The Laam of &ldquo;Al-&rdquo; (ٱلـ)
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            The definite article signals pronunciation through markings. Look at
            the laam itself: does it have a sukūn?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <div className="flex items-center gap-2 mb-2">
                <Moon size={16} className="text-teal-700" />
                <h3 className="text-base font-bold text-teal-900">
                  Sukūn on lām → Pronounce (Qamariyyah)
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Moon letters. The laam is pronounced clearly.
              </p>
              <ul className="space-y-1.5">
                {qamariyyah.map((e, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-3 text-sm bg-teal-50/40 rounded-lg px-3 py-1.5"
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
              <p className="text-xs text-teal-700 font-semibold mt-3">
                Qamariyyah letters: ا ب ج ح خ ع غ ف ق ك م هـ و ي
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <div className="flex items-center gap-2 mb-2">
                <Sun size={16} className="text-amber-600" />
                <h3 className="text-base font-bold text-teal-900">
                  No sukūn on lām → Don&apos;t pronounce (Shamsiyyah)
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Sun letters. The laam merges into the next letter, which carries
                a shaddah.
              </p>
              <ul className="space-y-1.5">
                {shamsiyyah.map((e, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-3 text-sm bg-amber-50/40 rounded-lg px-3 py-1.5"
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
              <p className="text-xs text-amber-700 font-semibold mt-3">
                Shamsiyyah letters: ت ث د ذ ر ز س ش ص ض ط ظ ل ن
              </p>
            </div>
          </div>

          <div className="bg-teal-50 border-l-4 border-teal-700 rounded-2xl p-4 mt-4 flex items-start gap-3">
            <Info size={16} className="text-teal-700 shrink-0 mt-0.5" />
            <div className="text-sm text-teal-900 space-y-1">
              <p>
                <span className="font-semibold">If you see a shaddah,</span> the
                laam is gone.
              </p>
              <p>
                <span className="font-semibold">If you see a sukūn,</span> the
                laam is read.
              </p>
              <p className="text-xs text-teal-800 mt-2">
                This is idghām of the laam, not deletion. It applies only to the
                definite article ٱلـ, not to every laam.
              </p>
            </div>
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
