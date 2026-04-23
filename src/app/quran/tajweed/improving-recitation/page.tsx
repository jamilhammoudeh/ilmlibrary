import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import {
  TrendingUp,
  Users,
  BookOpen,
  Ear,
  ArrowRight,
  Info,
  Compass,
} from "lucide-react";

export const metadata = {
  title: "Improving Your Recitation",
  description:
    "Three consistent practices that maximize your tajweed, plus how to keep your mouth and lips natural in Qur'anic recitation.",
};

const practices = [
  {
    step: "1",
    title: "Practice Reciting on Your Own",
    icon: BookOpen,
    description:
      "Reading the Qur'an regularly on your own is essential. Solo practice builds fluency and familiarity and lets you apply corrections you have already learned.",
    helpsWith: [
      "Increasing reading fluency and speed",
      "Improving familiarity with words and verses",
      "Experimenting with voice control and tone",
      "Applying corrections you have learned",
    ],
    caveat:
      "Solo practice cannot replace proper guidance. If you practice incorrect pronunciation, you reinforce mistakes instead of correcting them. This is why solo practice should focus on reading consistently, reciting carefully with proper tajweed, and applying corrections from teachers or study.",
    analogy:
      "Similar to practicing a sport alone: individual practice builds skill and stamina, but without proper technique, it will only take you so far.",
  },
  {
    step: "2",
    title: "Listen to Skilled Reciters",
    icon: Ear,
    description:
      "Listening to skilled reciters is one of the most powerful ways to improve pronunciation and rhythm. Many students benefit from classical Egyptian reciters like Shaykh al-Minshawi and Shaykh al-Husary, known for their clarity, precision, and strong tajweed.",
    helpsWith: [
      "Follow along in the Mushaf while listening",
      "Read aloud with the reciter",
      "Attempt to mimic their tajweed and pronunciation",
      "Pay attention to letter articulation, elongation, and pauses",
    ],
    caveat:
      "Do not listen passively. Try to find a reciter whose voice you genuinely enjoy, since a personal connection deepens your love for the Qur'an. But to actually improve, you must actively engage: follow along, read aloud, mimic, and study the details.",
    analogy:
      "Similar to studying expert athletes. You learn by carefully observing how masters perform, then imitating.",
  },
  {
    step: "3",
    title: "Practice With a Teacher",
    icon: Users,
    description:
      "Practicing with someone knowledgeable in tajweed is one of the most effective ways to improve. A teacher hears mistakes you will never catch on your own, and small refinements significantly improve your recitation.",
    helpsWith: [
      "Incorrect makharij (points of articulation)",
      "Subtle pronunciation errors",
      "Improper elongation (madd)",
      "Weak ghunnah or nasalization",
      "Mistakes in stopping or continuation",
    ],
    caveat:
      "Corrections may sometimes feel repetitive or strict, but they are extremely valuable. If a formal teacher is not available, practice with someone knowledgeable who has strong tajweed and is willing to listen and offer corrections.",
    analogy:
      "Similar to training with a coach in sports. A coach observes your technique and gives personalized corrections that accelerate your improvement.",
  },
];

const recitationStyles = [
  {
    name: "Murattal",
    arabic: "مُرَتَّل",
    description:
      "A steady, clear recitation ideal for learning. Measured pace, full tajweed, no melodic emphasis. This is what most students study with.",
  },
  {
    name: "Mujawwad",
    arabic: "مُجَوَّد",
    description:
      "A slower, melodic recitation that emphasizes precision and beauty. Used in formal gatherings and recitation competitions. Harder to imitate but beautiful to study.",
  },
];

export default function ImprovingRecitationPage() {
  return (
    <>
      <ContentHeader
        title="Improving Your Recitation"
        breadcrumbs={[
          { label: "Quran", href: "/quran" },
          { label: "Tajweed", href: "/quran/tajweed" },
          { label: "Improving Your Recitation" },
        ]}
        subtitle="Three consistent practices that actually move the needle"
      />

      <section className="max-w-6xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        {/* Intro block */}
        <div className="bg-teal-100 rounded-2xl px-8 py-8 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[19px] leading-[1.65] text-center">
            A guide on its own is not enough to fully develop strong tajweed. It can
            introduce the rules and concepts, but real improvement requires consistent
            practice, active listening, and guidance from knowledgeable teachers.
            Approach the Qur&apos;an with sincerity, humility, and love, and be
            willing to learn. Even the greatest reciters spent years refining their
            recitation.
          </p>
        </div>

        {/* Perfect practice callout */}
        <div className="mb-12 bg-teal-900 text-white rounded-2xl px-8 py-8 shadow-[0_4px_12px_rgba(0,0,0,0.12)] text-center">
          <p className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-playfair)] leading-tight mb-3">
            It isn&apos;t practice that makes perfect.
            <br />
            It&apos;s <span className="text-teal-200">perfect practice</span> that
            makes perfect.
          </p>
          <p className="text-sm text-teal-100 max-w-2xl mx-auto leading-relaxed">
            Repeating a mistake a thousand times does not fix it, it locks it in.
            That is why the three practices below work best together: solo practice
            builds volume, listening builds your ear, and a teacher catches the
            mistakes you cannot hear in yourself.
          </p>
        </div>

        {/* Three practices */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Three Practices for Improving Tajweed
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            None of these replace the others. Use all three and your recitation will
            steadily improve.
          </p>
          <div className="space-y-5">
            {practices.map((p) => (
              <div
                key={p.step}
                className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-teal-900 text-white font-bold flex items-center justify-center text-sm">
                    {p.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p.icon size={18} className="text-teal-700" />
                      <h3 className="text-lg font-bold text-teal-900">{p.title}</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{p.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pl-0 md:pl-14">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      What to focus on
                    </p>
                    <ul className="space-y-1.5">
                      {p.helpsWith.map((item, i) => (
                        <li
                          key={i}
                          className="text-sm text-gray-600 flex items-start gap-2"
                        >
                          <span className="text-teal-700 mt-0.5 shrink-0">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-teal-50/60 rounded-xl p-4">
                    <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
                      Important
                    </p>
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {p.caveat}
                    </p>
                    <p className="text-xs text-gray-500 italic">{p.analogy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Murattal vs Mujawwad */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Ear size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Two Styles to Listen For
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Most reciters record in one or both of these styles.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recitationStyles.map((s) => (
              <div
                key={s.name}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <h3 className="text-lg font-bold text-teal-900">{s.name}</h3>
                  <span
                    className="font-[family-name:var(--font-amiri)] text-teal-700 text-2xl"
                    dir="rtl"
                  >
                    {s.arabic}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Foundations of Natural Recitation */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Compass size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Foundations of Natural Recitation
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Avoiding overemphasis and using your mouth and lips correctly.
          </p>

          <div className="bg-teal-50 border-l-4 border-teal-700 rounded-2xl p-5 mb-6 flex items-start gap-3">
            <Info size={18} className="text-teal-700 shrink-0 mt-0.5" />
            <p className="text-sm text-teal-900 leading-relaxed">
              One of the most common mistakes is overemphasis: exaggerating mouth
              movements, stretching the lips sideways, or forcing sounds in a way
              that is unnatural to Arabic speech. When recited correctly, Qur&apos;anic
              Arabic should sound smooth, balanced, and natural, similar to careful
              classical Arabic speech.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-5">
            <h3 className="text-lg font-bold text-teal-900 mb-3">
              General Mouth and Lip Rule
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-teal-700 mt-0.5 shrink-0">•</span>
                <span>
                  <span className="font-semibold">Lips move up and down only,</span>{" "}
                  never stretched sideways or shaped exaggeratedly.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-700 mt-0.5 shrink-0">•</span>
                <span>The tongue and throat do most of the work.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-700 mt-0.5 shrink-0">•</span>
                <span>
                  The mouth should look and feel natural, not contorted.
                </span>
              </li>
            </ul>
          </div>

          <h3 className="text-base font-semibold text-teal-900 mb-3">
            The Only Two Exceptions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <h4 className="font-bold text-teal-900 mb-1">
                1. Dammah-Related Sounds
              </h4>
              <p
                className="font-[family-name:var(--font-amiri)] text-teal-700 text-2xl mb-2"
                dir="rtl"
              >
                ُ ٌ و
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                For all sounds related to dammah, the lips must round and project
                slightly forward to produce a true &ldquo;u&rdquo; sound. This is the
                only time the lips clearly point outward.
              </p>
              <p className="text-xs text-gray-500 mt-3">
                <span className="font-semibold text-gray-700">Applies to:</span>{" "}
                Dammah (ـُ), Dammatayn (ـٌ), Waw sakinah preceded by dammah (ـُو)
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <h4 className="font-bold text-teal-900 mb-1">
                2. Meem (م) — Lip Closure
              </h4>
              <p
                className="font-[family-name:var(--font-amiri)] text-teal-700 text-2xl mb-2"
                dir="rtl"
              >
                م
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                The letter meem is a bilabial letter, meaning it is produced using
                both lips. Think of the lips as folding together, not squeezing.
              </p>
              <p className="text-xs text-gray-500 mt-3">
                A firm but relaxed closure. No pressure, no tension.
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
