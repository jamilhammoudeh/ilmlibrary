import Link from "next/link";
import Image from "next/image";
import { ContentHeader } from "@/components/content-header";
import {
  Target,
  Info,
  Play,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Layers,
} from "lucide-react";

export const metadata = {
  title: "Makharij al-Huruf",
  description:
    "The articulation points of every Arabic letter, grouped into practical zones (throat, tongue, lips), with examples and common mistakes.",
};

const majorAreas = [
  {
    name: "Al-Jawf",
    arabic: "الجوف",
    english: "Mouth & throat cavity",
    letters: "ا (alif) · و (waw) · ي (yaa)",
    note:
      "The oral and throat cavity. Produces the three madd (elongation) letters, which ride on the vowel before them.",
  },
  {
    name: "Al-Halq",
    arabic: "الحلق",
    english: "The throat",
    letters: "ء ه · ع ح · غ خ",
    note:
      "Three levels: deep throat (ء ه), middle throat (ع ح), upper throat (غ خ).",
  },
  {
    name: "Al-Lisaan",
    arabic: "اللسان",
    english: "The tongue",
    letters:
      "ق ك · ج ش ي · ض · ل ن ر · ط د ت · ص س ز · ظ ذ ث",
    note:
      "The largest group. Different parts of the tongue produce different letters.",
  },
  {
    name: "Ash-Shafatan",
    arabic: "الشفتان",
    english: "The two lips",
    letters: "ف · ب م و",
    note:
      "Lip letters. Faa uses upper teeth on lower lip; baa and meem use both lips; waw (non-madd) uses rounded lips.",
  },
  {
    name: "Al-Khayshoom",
    arabic: "الخيشوم",
    english: "The nasal cavity",
    letters: "Ghunnah sound",
    note:
      "Not a letter itself, but the resonant nasal sound held during rules like ghunnah, ikhfa, idgham with ghunnah, and iqlab.",
  },
];

const zones = [
  {
    name: "Throat Letters",
    arabic: "الحروف الحلقية",
    letters: "ء ه ع ح غ خ",
    subzones: [
      { name: "Deep throat", letters: "ء ه" },
      { name: "Middle throat", letters: "ع ح" },
      { name: "Upper throat", letters: "غ خ" },
    ],
    notes: [
      "These letters are clear and open",
      "No nasalization",
      "Do not squeeze the throat",
    ],
    examples: [
      { arabic: "أَحَد", translit: "aḥad" },
      { arabic: "نَعْبُدُ", translit: "na'budu" },
      { arabic: "غَفُور", translit: "ghafur" },
      { arabic: "خَالِد", translit: "khalid" },
    ],
    wrong: "Replacing ع with أ",
    right: "Clear throat engagement, distinct from hamzah",
  },
  {
    name: "Tongue Letters",
    arabic: "حروف اللسان",
    letters: "Most Arabic letters",
    subzones: [
      { name: "Back of tongue", letters: "ق ك" },
      { name: "Middle of tongue", letters: "ج ش ي" },
      { name: "Sides of tongue", letters: "ض" },
      { name: "Tip of tongue", letters: "ت د ط ن ل ر س ز ص ث ذ ظ" },
    ],
    notes: [
      "Small shifts in tongue position matter",
      "Do not force pressure — accuracy over strength",
      "Each letter has its own precise point",
    ],
    examples: [
      { arabic: "قُلْ", translit: "qul" },
      { arabic: "صِرَاط", translit: "ṣirāṭ" },
      { arabic: "نُور", translit: "nur" },
      { arabic: "رَبِّ", translit: "rabbi" },
    ],
    wrong: "Collapsing multiple letters into one sound",
    right: "Distinct articulation for each letter",
  },
  {
    name: "Lip Letters",
    arabic: "الحروف الشفوية",
    letters: "ب م ف",
    subzones: [
      { name: "ب", letters: "Full lip closure, released cleanly" },
      { name: "م", letters: "Lip closure with nasal sound" },
      { name: "ف", letters: "Upper teeth lightly touch lower lip" },
    ],
    notes: [
      "Gentle, controlled lip movement",
      "No squeezing or tension",
      "Meem engages the nasal cavity; baa does not",
    ],
    examples: [
      { arabic: "بَصِير", translit: "baṣir" },
      { arabic: "أَمْر", translit: "amr" },
      { arabic: "فِيهِ", translit: "fihi" },
    ],
    wrong: "Weak or lazy lip contact, stretched lips sideways",
    right: "Clean closure on baa and meem; light tooth-lip touch on faa",
  },
];

export default function MakharijPage() {
  return (
    <>
      <ContentHeader
        title="Makharij al-Huruf"
        breadcrumbs={[
          { label: "Quran", href: "/quran" },
          { label: "Tajweed", href: "/quran/tajweed" },
          { label: "Makharij" },
        ]}
        subtitle="The articulation points of every Arabic letter"
      />

      <section className="max-w-6xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        {/* Intro */}
        <div className="bg-teal-100 rounded-2xl px-8 py-8 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[19px] leading-[1.65] text-center">
            Makharij (مخارج) are the physical points of articulation from which
            Arabic letters are pronounced. They are the foundation of tajweed: if
            the letter does not come from its proper place, no amount of rules will
            fix the sound. This page focuses on awareness, not memorization. The
            goal is to know where each sound comes from and what moves to produce
            it.
          </p>
        </div>

        {/* Key teaching principle */}
        <div className="mb-12 bg-teal-900 text-white rounded-2xl px-8 py-8 shadow-[0_4px_12px_rgba(0,0,0,0.12)] text-center">
          <p className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-playfair)] leading-tight mb-3">
            Makharij are learned by <span className="text-teal-200">sound</span>,
            not sight.
          </p>
          <p className="text-sm text-teal-100 max-w-2xl mx-auto leading-relaxed">
            Diagrams help you understand what is happening in the mouth, but they
            cannot teach you the sound. Listen, imitate, repeat aloud. Silent
            learning does not work for makharij. Over time, correct makharij become
            muscle memory.
          </p>
        </div>

        {/* Five major areas */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Layers size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              The Five Major Areas
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Traditional scholars group the 17 articulation points into five
            regions of the mouth and throat.
          </p>

          {/* Classical diagram */}
          <div className="bg-[#fdfbf3] border border-[#e8dfc6] rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-6">
            <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-3 text-center">
              Classical diagram from Miftāh al-ʿUlūm by Imam al-Sakkākī
            </p>
            <div className="relative w-full max-w-2xl mx-auto aspect-[5/3] rounded-xl overflow-hidden bg-white">
              <Image
                src="/images/tajweed/makharij-five-areas.png"
                alt="Classical Arabic diagram of the articulation points of letters (makharij al-huruf) from Miftah al-Ulum by Imam al-Sakkaki"
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 700px"
              />
            </div>
            <p className="text-xs text-gray-500 text-center mt-3 italic">
              A classical schematic of the mouth and throat with Arabic letters
              placed at their points of articulation. Public domain, from a 1318 AH
              Cairo printing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {majorAreas.map((a) => (
              <div
                key={a.name}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-baseline justify-between gap-3 mb-1 flex-wrap">
                  <h3 className="text-base font-bold text-teal-900">{a.name}</h3>
                  <span
                    className="font-[family-name:var(--font-amiri)] text-teal-700 text-xl"
                    dir="rtl"
                  >
                    {a.arabic}
                  </span>
                </div>
                <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider mb-3">
                  {a.english}
                </p>
                <p
                  className="font-[family-name:var(--font-amiri)] text-gray-900 text-lg mb-3"
                  dir="rtl"
                >
                  {a.letters}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">{a.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Three primary zones (practical) */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Target size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Three Practical Zones
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            For day-to-day study, it helps to simplify into the three zones where
            most letters are produced: throat, tongue, and lips.
          </p>

          <div className="space-y-5">
            {zones.map((z) => (
              <div
                key={z.name}
                className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
                  <h3 className="text-xl font-bold text-teal-900">{z.name}</h3>
                  <span
                    className="font-[family-name:var(--font-amiri)] text-teal-700 text-2xl"
                    dir="rtl"
                  >
                    {z.arabic}
                  </span>
                </div>
                <p
                  className="font-[family-name:var(--font-amiri)] text-gray-900 text-lg mb-4"
                  dir="rtl"
                >
                  {z.letters}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Subzones */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Sub-zones
                    </p>
                    <ul className="space-y-2">
                      {z.subzones.map((sz, i) => (
                        <li
                          key={i}
                          className="flex items-start justify-between gap-3 text-sm text-gray-700 bg-teal-50/40 rounded-lg px-3 py-1.5"
                        >
                          <span className="font-semibold text-teal-900">
                            {sz.name}
                          </span>
                          <span
                            className="font-[family-name:var(--font-amiri)] text-gray-800 text-base"
                            dir="rtl"
                          >
                            {sz.letters}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Examples */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Examples
                    </p>
                    <ul className="space-y-1">
                      {z.examples.map((ex, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between gap-3 text-sm bg-gray-50 rounded-lg px-3 py-1.5"
                        >
                          <span
                            className="font-[family-name:var(--font-amiri)] text-gray-900 text-base"
                            dir="rtl"
                          >
                            {ex.arabic}
                          </span>
                          <span className="text-xs text-gray-500 italic">
                            {ex.translit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Key notes */}
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Key notes
                </p>
                <ul className="space-y-1 mb-4">
                  {z.notes.map((n, i) => (
                    <li
                      key={i}
                      className="text-sm text-gray-600 flex items-start gap-2"
                    >
                      <span className="text-teal-700 mt-0.5 shrink-0">•</span>
                      {n}
                    </li>
                  ))}
                </ul>

                {/* Common mistake vs correct */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-rose-50 border-l-4 border-rose-400 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <AlertCircle size={14} className="text-rose-600" />
                      <p className="text-xs font-semibold text-rose-800 uppercase tracking-wider">
                        Common mistake
                      </p>
                    </div>
                    <p className="text-sm text-gray-700">{z.wrong}</p>
                  </div>
                  <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                        Correct
                      </p>
                    </div>
                    <p className="text-sm text-gray-700">{z.right}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Practice advice */}
        <div className="mb-12 bg-teal-50 border-l-4 border-teal-700 rounded-2xl p-6 flex items-start gap-3">
          <Info size={20} className="text-teal-700 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-bold text-teal-900 mb-2">
              Practice advice
            </h3>
            <ul className="space-y-1.5 text-sm text-teal-900">
              <li className="flex items-start gap-2">
                <span className="text-teal-700 mt-0.5 shrink-0">•</span>
                If you cannot hear the difference between two letters, slow down
                and exaggerate slightly during practice, then return to natural
                recitation.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-700 mt-0.5 shrink-0">•</span>
                Focus on isolated letter sounds first, then move to words, then
                phrases. Silent learning does not work.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-700 mt-0.5 shrink-0">•</span>
                Correct makharij preserve the Qur&apos;an exactly as it was
                revealed. Tajweed rules refine the sound; makharij create it.
              </li>
            </ul>
          </div>
        </div>

        {/* Recommended playlist */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Play size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Recommended Practice Playlist
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            A clear, slow pronunciation series that focuses on isolated letter
            sounds and clear mouth positioning. Listen, imitate, then repeat
            aloud.
          </p>
          <a
            href="https://www.youtube.com/watch?v=-YrfRpwFMe8&list=PL6TlMIZ5ylgpmlnN3EpkOec0tJ8OJZ5re"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200 flex items-start gap-3 max-w-2xl"
          >
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-teal-100 transition-colors">
              <Play size={18} className="text-teal-700" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-teal-900 group-hover:text-teal-700 transition-colors">
                  Learn Arabic 101 — Makharij Series
                </h3>
                <ExternalLink size={12} className="text-gray-400 shrink-0" />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                YouTube playlist · Isolated letter practice
              </p>
            </div>
          </a>
        </div>

        {/* Continue */}
        <div>
          <h2 className="text-2xl font-bold text-teal-900 mb-6 font-[family-name:var(--font-playfair)]">
            Continue Learning
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/quran/tajweed/letter-weights"
              className="group bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-bold text-teal-900 group-hover:text-teal-700 transition-colors">
                  Heavy & Light Letters
                </h3>
                <ArrowRight size={18} className="text-teal-700 group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Tafkheem, tarqeeq, and conditional letters.
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
