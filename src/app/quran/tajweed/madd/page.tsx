import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import {
  Waves,
  Info,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export const metadata = {
  title: "Madd (Elongation)",
  description:
    "The four types of madd with count tables, worked examples, and key teaching rules.",
};

const maddTypes = [
  {
    name: "Madd Ṭabīʿī",
    subtitle: "Natural Madd",
    arabic: "المد الطبيعي",
    count: "2 counts",
    badgeColor: "bg-emerald-100 text-emerald-900",
    description:
      "The default madd. If no special condition follows, this is what you apply. Triggered when a madd letter (ا، و، ي) appears with its matching vowel (fatḥah, ḍammah, kasrah) and no hamzah or sukūn after.",
    examples: [
      { arabic: "قَالَ", phonetic: "qā-la" },
      { arabic: "يَقُولُ", phonetic: "ya-qū-lu" },
      { arabic: "فِيهِ", phonetic: "fī-hi" },
      { arabic: "نُور", phonetic: "nūr" },
    ],
    rule: "2 counts. No more, no less.",
  },
  {
    name: "Madd Wājib Muttaṣil",
    subtitle: "Connected Madd (Obligatory)",
    arabic: "المد الواجب المتصل",
    count: "4–5 counts",
    badgeColor: "bg-amber-100 text-amber-900",
    description:
      "A madd letter followed by a hamzah in the same word. It is called wājib because the lengthening is mandatory. Pick 4 or 5 counts and stay consistent throughout your recitation.",
    examples: [
      { arabic: "جَاءَ", phonetic: "jāāʾa" },
      { arabic: "السَّمَاءِ", phonetic: "as-samāāʾ" },
      { arabic: "سُوءَ", phonetic: "sūūʾa" },
      { arabic: "شَيْءٌ", phonetic: "shayʾ" },
    ],
    rule: "Always lengthen. Pick 4 or 5 counts and be consistent.",
  },
  {
    name: "Madd Jāʾiz Munfaṣil",
    subtitle: "Separated Madd (Permissible)",
    arabic: "المد الجائز المنفصل",
    count: "2 or 4–5 counts",
    badgeColor: "bg-sky-100 text-sky-900",
    description:
      "A madd letter at the end of a word, followed by a hamzah at the start of the next word. Permissible to lengthen or keep natural. Whatever you choose, keep it consistent throughout your recitation.",
    examples: [
      { arabic: "فِي أَنفُسِكُمْ", phonetic: "fī ān-fu-si-kum" },
      { arabic: "قَالُوا إِنَّا", phonetic: "qālū īn-nā" },
      { arabic: "إِنَّا أَعْطَيْنَاكَ", phonetic: "innā āʿ-ṭay-nā-ka" },
    ],
    rule: "If you lengthen it, always lengthen it. If not, always keep it short.",
  },
  {
    name: "Madd Lāzim",
    subtitle: "Necessary Madd",
    arabic: "المد اللازم",
    count: "6 counts (always)",
    badgeColor: "bg-rose-100 text-rose-900",
    description:
      "The strongest and longest madd. Occurs when a madd letter is followed by a permanent sukūn, either in a word or in a disconnected letter at the start of a sūrah. Always 6 counts.",
    examples: [
      { arabic: "الم", phonetic: "Alif Lāāām Mīīīm" },
      { arabic: "الضَّالِّينَ", phonetic: "aḍ-ḍāāāllīn" },
      { arabic: "الطَّامَّة", phonetic: "aṭ-ṭāāāmmah" },
    ],
    rule: "Always 6 counts. No shorter, no longer.",
  },
];

export default function MaddPage() {
  return (
    <>
      <ContentHeader
        title="Madd (Elongation)"
        breadcrumbs={[
          { label: "Quran", href: "/quran" },
          { label: "Tajweed", href: "/quran/tajweed" },
          { label: "Madd" },
        ]}
        subtitle="The four types of Qur'anic elongation"
      />

      <section className="max-w-6xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        <div className="bg-teal-100 rounded-2xl px-8 py-8 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[19px] leading-[1.65] text-center">
            Madd (المد) means to lengthen a sound. In Qur&apos;anic recitation,
            this lengthening is measured, consistent, and rule-based, not
            stylistic. Length is counted in ḥarakāt (counts), where one count is
            roughly the time it takes to say a short vowel.
          </p>
        </div>

        {/* The four types */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Waves size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              The Four Types of Madd
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Each type is triggered by a specific pattern and has its own count.
          </p>

          <div className="space-y-5">
            {maddTypes.map((m) => (
              <div
                key={m.name}
                className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                  <div>
                    <h3 className="text-lg font-bold text-teal-900">{m.name}</h3>
                    <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider">
                      {m.subtitle}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="font-[family-name:var(--font-amiri)] text-teal-700 text-xl"
                      dir="rtl"
                    >
                      {m.arabic}
                    </span>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${m.badgeColor}`}
                    >
                      {m.count}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed mb-4">
                  {m.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Examples
                    </p>
                    <ul className="space-y-1.5">
                      {m.examples.map((e, i) => (
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
                  <div className="bg-teal-50/60 rounded-xl p-4 flex flex-col justify-center">
                    <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
                      The rule
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {m.rule}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Madd Lāzim sub-types */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Waves size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Madd Lāzim Variations
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Two forms of the 6-count necessary madd.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <h3 className="text-base font-bold text-teal-900 mb-1">
                Ḥarfī — Beginning Letters
              </h3>
              <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider mb-3">
                In disconnected letters at the start of a sūrah
              </p>
              <p className="text-sm text-gray-700 mb-3">
                When a disconnected letter name contains a madd followed by a
                sukūn, lengthen to 6 counts.
              </p>
              <ul className="space-y-1.5">
                <li className="flex items-center justify-between gap-3 text-sm bg-gray-50 rounded-lg px-3 py-1.5">
                  <span
                    className="font-[family-name:var(--font-amiri)] text-teal-900 text-lg"
                    dir="rtl"
                  >
                    الم
                  </span>
                  <span className="text-xs text-gray-500 italic">
                    Alif Lāāām Mīīīm
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3 text-sm bg-gray-50 rounded-lg px-3 py-1.5">
                  <span
                    className="font-[family-name:var(--font-amiri)] text-teal-900 text-lg"
                    dir="rtl"
                  >
                    كهيعص
                  </span>
                  <span className="text-xs text-gray-500 italic">
                    Kāāf Hāā Yāā ʿAyyyn Ṣāāād
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3 text-sm bg-gray-50 rounded-lg px-3 py-1.5">
                  <span
                    className="font-[family-name:var(--font-amiri)] text-teal-900 text-lg"
                    dir="rtl"
                  >
                    حم
                  </span>
                  <span className="text-xs text-gray-500 italic">
                    Ḥāā Mīīm
                  </span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <h3 className="text-base font-bold text-teal-900 mb-1">
                Kalimī — Within a Word
              </h3>
              <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider mb-3">
                Less common, but very important
              </p>
              <p className="text-sm text-gray-700 mb-3">
                A madd letter inside a word followed by a permanent sukūn or a
                shaddah that carries the sukūn.
              </p>
              <ul className="space-y-1.5">
                <li className="flex items-center justify-between gap-3 text-sm bg-gray-50 rounded-lg px-3 py-1.5">
                  <span
                    className="font-[family-name:var(--font-amiri)] text-teal-900 text-lg"
                    dir="rtl"
                  >
                    الضَّالِّينَ
                  </span>
                  <span className="text-xs text-gray-500 italic">
                    aḍ-ḍāāāllīn
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3 text-sm bg-gray-50 rounded-lg px-3 py-1.5">
                  <span
                    className="font-[family-name:var(--font-amiri)] text-teal-900 text-lg"
                    dir="rtl"
                  >
                    الطَّامَّة
                  </span>
                  <span className="text-xs text-gray-500 italic">
                    aṭ-ṭāāāmmah
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Opening letters note */}
        <div className="mb-12 bg-amber-50 border-l-4 border-amber-500 rounded-2xl p-5 flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-bold text-amber-900 mb-1">
              Opening Letters: Not all are lengthened
            </h3>
            <p className="text-sm text-amber-900 leading-relaxed mb-3">
              Some disconnected opening letters do not contain madd. Read the
              letter name and decide based on whether madd is present.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-white rounded-xl p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Read normally (no madd)
                </p>
                <p
                  className="font-[family-name:var(--font-amiri)] text-teal-900 text-lg"
                  dir="rtl"
                >
                  ألف · لام
                </p>
                <p className="text-xs text-gray-500 italic mt-1">
                  Alif alone, and lām when not followed by an internal sukūn.
                </p>
              </div>
              <div className="bg-white rounded-xl p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Have madd
                </p>
                <p
                  className="font-[family-name:var(--font-amiri)] text-teal-900 text-lg"
                  dir="rtl"
                >
                  م س ص ن ق ك ي ع ط ه ر
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key teaching rules */}
        <div className="mb-12 bg-teal-50 border-l-4 border-teal-700 rounded-2xl p-6 flex items-start gap-3">
          <Info size={20} className="text-teal-700 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-bold text-teal-900 mb-2">
              Key teaching rules
            </h3>
            <ul className="space-y-1.5 text-sm text-teal-900">
              <li className="flex items-start gap-2">
                <span className="text-teal-700 mt-0.5 shrink-0">•</span>
                Madd is measured, not emotional. Do not stretch because it
                &ldquo;sounds nice&rdquo;.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-700 mt-0.5 shrink-0">•</span>
                Consistency matters more than length. Picking 4 counts everywhere
                is better than random 2 to 6.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-700 mt-0.5 shrink-0">•</span>
                Never add a jump or break mid-madd. One smooth airflow from start
                to finish.
              </li>
            </ul>
          </div>
        </div>

        {/* Continue */}
        <div>
          <h2 className="text-2xl font-bold text-teal-900 mb-6 font-[family-name:var(--font-playfair)]">
            Continue Learning
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/quran/tajweed/qalqalah"
              className="group bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-bold text-teal-900 group-hover:text-teal-700 transition-colors">
                  Qalqalah (Echo)
                </h3>
                <ArrowRight size={18} className="text-teal-700 group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                The five echo letters and how to release them.
              </p>
            </Link>
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
