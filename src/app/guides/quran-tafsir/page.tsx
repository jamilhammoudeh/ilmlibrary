import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import {
  BookOpen,
  Play,
  ChevronRight,
  ArrowRight,
  HelpCircle,
  Layers,
  AlertCircle,
  CheckCircle2,
  Info,
  Compass,
  ListChecks,
  GraduationCap,
} from "lucide-react";

const motivation = [
  {
    text: "A Book We have revealed to you, full of blessings, so that they may ponder over its verses, and that those of understanding may be reminded.",
    source: "Surah Sad 38:29",
  },
  {
    text: "Do they not reflect on the Qur'an? Or are there locks upon their hearts?",
    source: "Surah Muhammad 47:24",
  },
  {
    text: "The best of you are those who learn the Qur'an and teach it.",
    source: "Sahih al-Bukhari 5027",
  },
];

const whatIsTafsir = [
  {
    title: "Tafsir explains, it does not rewrite",
    description:
      "Tafsir (التفسير) means 'clarification' or 'explanation'. A mufassir is someone who carefully explains what the verses mean. They do not change the text or invent meanings. They look at what the words meant in the Arabic of the Prophet ﷺ and his Companions, and how the Qur'an itself and the Sunnah clarify them.",
  },
  {
    title: "Why we need tafsir",
    description:
      "The Qur'an was revealed in classical Arabic over 23 years in specific situations. Words have layers, verses were revealed for specific reasons, and some verses explain others. Tafsir connects all of this so a reader today can understand a verse the way it was understood by the people it was first revealed to.",
  },
  {
    title: "The difference between translation and tafsir",
    description:
      "A translation carries over the basic meaning of words into another language. A tafsir goes further: it explains context, reasons for revelation (asbab an-nuzul), grammar, how the Sunnah interprets the verse, and the lessons scholars have drawn. A good English tafsir is closer to a commentary than a translation.",
  },
];

const usoolPrinciples = [
  {
    step: "1",
    title: "The Qur'an explains the Qur'an",
    detail:
      "The clearest tafsir of a verse is often another verse. What is summarized in one place is often detailed elsewhere. Scholars look at the whole Qur'an when explaining a single verse.",
  },
  {
    step: "2",
    title: "The Sunnah explains the Qur'an",
    detail:
      "The Prophet ﷺ was sent to clarify the Book. His statements, actions, and approvals are the second source of tafsir. Many verses are only fully understood through authentic hadith.",
  },
  {
    step: "3",
    title: "The Companions' understanding",
    detail:
      "They witnessed the revelation, they knew the context, and they spoke classical Arabic natively. Scholars like Ibn Abbas, Ibn Mas'ud, and Ali رضي الله عنهم are especially important sources.",
  },
  {
    step: "4",
    title: "The Tabi'een's understanding",
    detail:
      "The generation after the Companions, taught by them directly. Mujahid, Qatadah, and Al-Hasan al-Basri are well-known examples. Their statements are accepted when they agree, and weighed carefully when they differ.",
  },
  {
    step: "5",
    title: "The Arabic language",
    detail:
      "The Qur'an was revealed in clear Arabic. Classical poetry, grammar, and rhetoric are used to understand word meanings, idioms, and style. No tafsir is complete without respect for the original language.",
  },
];

const levels = [
  {
    level: "Beginner",
    levelColor: "bg-emerald-100 text-emerald-900",
    intro:
      "If you have never studied tafsir before, start here. The goal is simply to start reading the Qur'an with a clear, concise explanation so the verses begin to make sense.",
    duration: "3 to 6 months of daily reading",
    before:
      "You should be able to read the Qur'an in Arabic or with a reliable English translation. No prior tafsir study needed.",
    whatYoullLearn: [
      "How to read the Qur'an with basic context for each passage",
      "The meaning of common Qur'anic words and phrases",
      "How to use a short tafsir alongside your daily recitation",
      "The idea of asbab an-nuzul (reasons for revelation) in simple terms",
    ],
    afterThis:
      "You will have read the Qur'an once with tafsir alongside it, and be ready for a deeper study.",
    books: [
      {
        title: "Tafseer As-Sa'di (Vol. 1)",
        description:
          "Clear, concise explanation of the Qur'an by Shaykh Abd al-Rahman as-Sa'di. Written in simple language, focused on lessons and guidance. The ideal first tafsir.",
        href: "/books/quran-studies/tafseer-as-sadi-vol-1-juz-1-3-577",
      },
      {
        title: "Tafseer As-Sa'di (Vol. 2)",
        description:
          "Continues through Juz 4-6. Use alongside your daily Qur'an reading.",
        href: "/books/quran-studies/tafseer-as-sadi-vol-2-juz-4-6-578",
      },
    ],
    videos: [
      {
        title: "Tafseer Playlist by Al Madrasatu Al Umariyyah",
        url: "https://youtube.com/playlist?list=PL2dRQaGGWZOBYkqSWcfhzetBvPKOUFkf4&si=MI14xUeNYNkQltez",
      },
    ],
    tip: "Read one page of Qur'an with its As-Sa'di commentary every day. Consistency matters more than speed.",
  },
  {
    level: "Intermediate",
    levelColor: "bg-amber-100 text-amber-900",
    intro:
      "Once As-Sa'di feels comfortable, move to a deeper, narration-based tafsir. This is where you start to see how verses explain each other and how the Sunnah clarifies the Qur'an.",
    duration: "1 to 2 years, done carefully",
    before:
      "Complete at least 5 juz with a short tafsir. Some Arabic vocabulary is helpful at this stage.",
    whatYoullLearn: [
      "How scholars explain a verse using other verses and authentic hadith",
      "The statements of the Companions on well-known verses",
      "How to identify weak narrations in tafsir books",
      "Deeper understanding of surahs you have already read",
    ],
    afterThis:
      "You will be able to read most classical tafsir works and follow scholarly discussions about specific verses.",
    books: [
      {
        title: "Tafsir Ibn Kathir Volume 1-10",
        description:
          "The most widely studied classical tafsir in Sunni tradition. Rich in authentic hadith and statements of the Salaf. The gold standard of tafsir bil-ma'thur.",
        href: "/books/quran-studies/tafsir-ibn-kathir-volume-1-10-571",
      },
      {
        title: "Tafseer As-Sa'di (full set)",
        description:
          "Continue reading As-Sa'di alongside Ibn Kathir. They complement each other: one concise and practical, the other deep and narration-based.",
        href: "/books/quran-studies",
      },
    ],
    videos: [],
    tip: "Read a page from Ibn Kathir, then re-read the same passage in As-Sa'di. Compare how each handles the verse.",
  },
  {
    level: "Advanced",
    levelColor: "bg-rose-100 text-rose-900",
    intro:
      "Study the longer classical works that go into detail on Arabic grammar, legal rulings, and scholarly differences. Ideally done under a qualified teacher.",
    duration: "Years, often a lifetime of study",
    before:
      "Working knowledge of classical Arabic grammar and a solid foundation in aqeedah and usool al-fiqh. Ibn Kathir should feel familiar.",
    whatYoullLearn: [
      "Legal rulings (ahkam) derived from Qur'anic verses",
      "Differences of opinion between schools of thought and why they differ",
      "The principles of tafsir (usool at-tafsir) in depth",
      "How to read multiple tafsir works in parallel on the same verse",
    ],
    afterThis:
      "You will be equipped to study any tafsir available and engage with scholarly debates on the meaning of specific verses.",
    books: [
      {
        title: "Tafsir al-Qurtubi Vol. 1",
        description:
          "Al-Jami' li-Ahkam al-Qur'an. The reference for the legal implications of Qur'anic verses. Dense and scholarly.",
        href: "/books/quran-studies/tafsir-al-qurtubi-vol-1-588",
      },
      {
        title: "Introduction to Principles of Tafsir (Ibn Taymiyyah)",
        description:
          "Shaykh al-Islam's classic primer on the rules and methodology of tafsir. Short but foundational.",
        href: "/books/quran-studies/introduction-to-principles-of-tafsir-ibn-taymiyyah-582",
      },
      {
        title: "Tafsir al-Qurtubi Vol. 2",
        description:
          "Continues through the longer surahs. For students who want to work carefully through verses with legal implications.",
        href: "/books/quran-studies/tafsir-al-qurtubi-vol-2-589",
      },
    ],
    videos: [],
    tip: "Advanced tafsir is best done with a teacher. If that is not possible, pair classical texts with reliable lecture series from qualified scholars.",
  },
];

const commonMistakes = [
  {
    problem:
      "Interpreting a verse based on personal opinion without knowledge",
    solution:
      "The Prophet ﷺ warned strongly against this. Before you form an opinion on what a verse means, check what the established tafsir works say. Reflection (tadabbur) is encouraged; issuing tafsir is the job of qualified scholars.",
  },
  {
    problem: "Taking a verse out of context",
    solution:
      "Some verses address specific situations, some are general, and some are qualified by other verses. Always read the whole passage, check the asbab an-nuzul, and see what other verses on the same topic say.",
  },
  {
    problem: "Using an unreliable or anonymous online tafsir",
    solution:
      "Stick with known, peer-reviewed works like As-Sa'di, Ibn Kathir, and al-Qurtubi in reliable editions. If a source is anonymous or you do not recognize the scholar, do not trust its tafsir.",
  },
  {
    problem: "Reading translations as if they were the Qur'an itself",
    solution:
      "A translation is an approximation of meaning, not a replacement for the Qur'an. Always remember the original Arabic is authoritative, and any translation is one scholar's best attempt at conveying the meaning.",
  },
  {
    problem:
      "Confusing reflection (tadabbur) with issuing tafsir",
    solution:
      "Every Muslim is encouraged to reflect on the Qur'an personally. This is tadabbur. But explaining a verse to others as a binding interpretation is tafsir and requires knowledge. Reflect freely in your own heart; teach only what is established.",
  },
  {
    problem: "Ignoring weak narrations in older tafsir works",
    solution:
      "Some classical tafsir books include weak narrations (israiliyyat, unreliable stories). Modern checked editions of Ibn Kathir and others flag these. Use verified editions and do not take every narration in an old tafsir at face value.",
  },
];

const faq = [
  {
    q: "Do I need to know Arabic to study tafsir?",
    a: "No, you can start without it. Solid English translations of Ibn Kathir and As-Sa'di cover the core meanings clearly. That said, even basic Qur'anic Arabic dramatically deepens your understanding, because many verses turn on a specific word, grammatical form, or rhetorical device that flattens in translation.",
  },
  {
    q: "Which tafsir should I start with?",
    a: "Start with Tafseer As-Sa'di. It is concise, clearly written, and focused on guidance rather than technical debates. Once you have finished it (or a substantial portion), move to Ibn Kathir for depth, and reference al-Qurtubi for verses with legal rulings.",
  },
  {
    q: "Is it wrong to interpret the Qur'an on my own?",
    a: "Reflecting on the Qur'an (tadabbur) is encouraged for every Muslim. What is prohibited is declaring a meaning of a verse without knowledge, especially to others. Reflect freely, but do not teach or assert interpretations that are not grounded in the established tafsir tradition.",
  },
  {
    q: "Can I trust tafsir videos on YouTube?",
    a: "Some are excellent, others are unreliable. Stick to teachers who cite classical sources, name the scholars they draw from, and do not push personal opinions as tafsir. When in doubt, cross-check what you hear against a classical written tafsir like Ibn Kathir or As-Sa'di.",
  },
  {
    q: "Why do different tafsir sometimes disagree?",
    a: "Most differences are complementary rather than contradictory. Scholars emphasize different valid meanings, contexts, or linguistic possibilities. Where real disagreement exists, the ones closer to the Qur'an, Sunnah, and the understanding of the Salaf are given precedence.",
  },
  {
    q: "How much time do I realistically need?",
    a: "Reading the Qur'an once with a short tafsir like As-Sa'di usually takes 3 to 6 months at a steady pace of one page a day. Reading Ibn Kathir cover to cover is closer to 1 to 2 years. Deeper study is a lifetime pursuit. Start small and be consistent.",
  },
];

const related = [
  {
    href: "/quran/tafseer",
    title: "Tafseer Resources",
    description: "Types of tafsir, mufassirun, and the library.",
  },
  {
    href: "/books/quran-studies",
    title: "Qur'an Studies Library",
    description: "Browse every tafsir book in our library.",
  },
  {
    href: "/guides/aqeedah",
    title: "Aqeedah Guide",
    description: "Correct belief is the foundation for correct tafsir.",
  },
  {
    href: "/quran/tajweed",
    title: "Tajweed",
    description: "Learn to recite the Qur'an correctly as you study it.",
  },
];

export const metadata = {
  title: "Beginner's Guide to Qur'an Tafsir",
  description:
    "A step-by-step guide to studying Qur'anic tafsir: what it is, how scholars do it, a three-step learning path, common mistakes, and reliable book recommendations.",
};

export default function QuranTafsirGuidePage() {
  return (
    <>
      <ContentHeader
        title="Beginner's Guide to Qur'an Tafsir"
        subtitle="A careful, step-by-step path to understanding the Qur'an"
        breadcrumbs={[
          { label: "Islamic Guides", href: "/guides" },
          { label: "Qur'an Tafsir" },
        ]}
      />

      <section className="max-w-6xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        {/* Intro */}
        <div className="bg-teal-100 rounded-2xl px-8 py-8 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-bold text-teal-900 mb-3 text-center font-[family-name:var(--font-playfair)]">
            What is Tafsir?
          </h2>
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[19px] leading-[1.65] text-center">
            Tafsir (التفسير) is the science of explaining the Qur&apos;an: its
            vocabulary, context, rulings, and lessons. It is how the Ummah has
            preserved the correct understanding of the Book across fourteen
            centuries. This guide walks you through what tafsir actually is, the
            tools scholars use to do it, and a realistic three-step path for
            studying it yourself.
          </p>
        </div>

        {/* Motivation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-12">
          {motivation.map((m, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] border-l-4 border-teal-700"
            >
              <p className="text-gray-700 italic text-sm leading-relaxed">
                &ldquo;{m.text}&rdquo;
              </p>
              <p className="text-xs text-gray-400 mt-2">{m.source}</p>
            </div>
          ))}
        </div>

        {/* What is Tafsir (three cards) */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              What Tafsir Actually Does
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Before starting, it helps to know what you are studying and what you
            are not.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {whatIsTafsir.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <h3 className="text-base font-bold text-teal-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Usool / tools */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Layers size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              The Five Tools Scholars Use
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Every reliable tafsir works through these five sources in order.
            Knowing them helps you tell good tafsir from opinion.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {usoolPrinciples.map((p) => (
              <div
                key={p.step}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex gap-4"
              >
                <div className="shrink-0 w-9 h-9 rounded-full bg-teal-900 text-white font-bold flex items-center justify-center text-sm">
                  {p.step}
                </div>
                <div>
                  <h3 className="text-base font-bold text-teal-900 mb-1">
                    {p.title}
                  </h3>
                  <p className="text-gray-700 text-sm">{p.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why method matters callout */}
        <div className="mb-12 bg-teal-50 border-l-4 border-teal-700 rounded-2xl p-5 flex items-start gap-3">
          <Info size={20} className="text-teal-700 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-bold text-teal-900 mb-1">
              Why method matters
            </h3>
            <p className="text-sm text-teal-900 leading-relaxed">
              The Prophet ﷺ warned strongly against speaking about the
              Qur&apos;an without knowledge. A reliable tafsir is not a clever
              reading; it is what the text actually says, as understood by the
              people closest to revelation. Study tafsir the way scholars study
              it, not the way influencers quote it.
            </p>
          </div>
        </div>

        {/* Three-step learning path */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Compass size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Three-Step Learning Path
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            A realistic progression from your first tafsir to lifelong study,
            with time estimates, prerequisites, and the specific books to use at
            each step.
          </p>

          <div className="space-y-6">
            {levels.map((lvl, idx) => (
              <article
                key={lvl.level}
                className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-6 md:p-8"
              >
                <header className="flex items-start justify-between gap-4 mb-5 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-900 text-white font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold text-teal-700">
                        Step {idx + 1} of 3
                      </p>
                      <h3 className="text-xl font-bold text-teal-900 font-[family-name:var(--font-playfair)] leading-tight">
                        {lvl.level}
                      </h3>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${lvl.levelColor}`}
                  >
                    {lvl.level}
                  </span>
                </header>

                <p className="text-sm text-gray-700 leading-relaxed mb-5">
                  {lvl.intro}
                </p>

                {/* Step meta grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                  <div className="bg-teal-50/60 rounded-xl p-3">
                    <p className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider mb-1">
                      Time needed
                    </p>
                    <p className="text-sm text-gray-800">{lvl.duration}</p>
                  </div>
                  <div className="bg-teal-50/60 rounded-xl p-3">
                    <p className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider mb-1">
                      Before starting
                    </p>
                    <p className="text-sm text-gray-800">{lvl.before}</p>
                  </div>
                  <div className="bg-teal-50/60 rounded-xl p-3">
                    <p className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider mb-1">
                      After this step
                    </p>
                    <p className="text-sm text-gray-800">{lvl.afterThis}</p>
                  </div>
                </div>

                {/* What you'll learn */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                    <ListChecks size={14} className="text-teal-700" />
                    What you&apos;ll learn
                  </h4>
                  <ul className="space-y-1.5 bg-white rounded-xl border border-gray-100 p-4">
                    {lvl.whatYoullLearn.map((item, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-700 flex items-start gap-2"
                      >
                        <span className="text-teal-700 mt-0.5 shrink-0">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Books */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                    <BookOpen size={14} className="text-teal-700" />
                    Recommended Books
                  </h4>
                  <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                    {lvl.books.map((book) => (
                      <Link
                        key={book.title}
                        href={book.href}
                        className="group flex items-start gap-3 px-4 py-3 hover:bg-teal-50/50 transition-colors duration-200"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-teal-900 group-hover:text-teal-700 transition-colors duration-200">
                            {book.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">
                            {book.description}
                          </p>
                        </div>
                        <ChevronRight
                          size={18}
                          className="text-gray-300 group-hover:text-teal-700 group-hover:translate-x-0.5 transition-all duration-200 mt-0.5 shrink-0"
                        />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Lecture series */}
                {lvl.videos.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                      <Play size={14} className="text-teal-700" />
                      Lecture Series
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {lvl.videos.map((video) => (
                        <a
                          key={video.title}
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-full transition-colors duration-200"
                        >
                          <Play size={12} className="shrink-0" />
                          {video.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tip */}
                <div className="bg-teal-50/60 border border-teal-100 rounded-xl p-4 flex items-start gap-2">
                  <GraduationCap
                    size={16}
                    className="text-teal-700 shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider mb-1">
                      Practical tip
                    </p>
                    <p className="text-sm text-gray-700">{lvl.tip}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Common mistakes */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Common Mistakes to Avoid
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Every student of tafsir hits these. Knowing them in advance protects
            you from repeating them.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commonMistakes.map((m) => (
              <div
                key={m.problem}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={16} className="text-rose-500" />
                  <h3 className="text-sm font-bold text-teal-900">
                    {m.problem}
                  </h3>
                </div>
                <div className="flex items-start gap-2 mt-3 bg-emerald-50/60 rounded-xl p-3">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-600 shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {m.solution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Common Questions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6 items-start">
            {faq.map((f, i) => (
              <details
                key={i}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] group"
              >
                <summary className="font-semibold text-teal-900 cursor-pointer list-none flex items-start justify-between gap-3">
                  <span>{f.q}</span>
                  <span className="text-teal-700 group-open:rotate-45 transition-transform duration-200 text-xl leading-none shrink-0">
                    +
                  </span>
                </summary>
                <p className="text-gray-700 text-sm mt-3 leading-relaxed">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Related */}
        <div>
          <h2 className="text-2xl font-bold text-teal-900 mb-6 font-[family-name:var(--font-playfair)]">
            Continue Learning
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-bold text-teal-900 group-hover:text-teal-700 transition-colors">
                    {r.title}
                  </h3>
                  <ArrowRight
                    size={18}
                    className="text-teal-700 group-hover:translate-x-1 transition-transform shrink-0"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">{r.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
