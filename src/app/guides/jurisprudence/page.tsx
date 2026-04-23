import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import {
  BookOpen,
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
  Scale,
  Gavel,
  Users,
} from "lucide-react";

const motivation = [
  {
    text: "Then We put you on an ordained way (sharīʿah) concerning the matter of religion. So follow it, and do not follow the inclinations of those who do not know.",
    source: "Surah Al-Jāthiyah 45:18",
  },
  {
    text: "And this is a Book We have revealed, blessed, so follow it and fear Allah that you may receive mercy.",
    source: "Surah Al-Anʿām 6:155",
  },
  {
    text: "Whoever Allah wants good for, He gives him understanding of the religion (fiqh fī ad-dīn).",
    source: "Sahih al-Bukhari 71, Sahih Muslim 1037",
  },
];

const whatFiqhCovers = [
  {
    title: "ʿIbādāt",
    english: "Acts of Worship",
    description:
      "The rules of prayer, purification (wuḍū and ghusl), fasting, zakāh, hajj, and everything connected to worshipping Allah directly. This is usually where every student of fiqh starts.",
  },
  {
    title: "Muʿāmalāt",
    english: "Dealings & Transactions",
    description:
      "How Muslims interact with each other and the world: buying and selling, contracts, debts, employment, inheritance, food and clothing, and rules of daily life.",
  },
  {
    title: "Family & Social",
    english: "Marriage, Family, Society",
    description:
      "Marriage, divorce, rights of spouses, raising children, the rights of neighbors, parents, and wider community. The rules that shape home and public life.",
  },
];

const rulings = [
  {
    name: "Wājib",
    english: "Obligatory",
    also: "also called Farḍ",
    color: "bg-rose-100 text-rose-900",
    description:
      "Commanded clearly. You earn reward for doing it and sin for leaving it without a valid excuse. Example: the five daily prayers.",
  },
  {
    name: "Mustaḥabb",
    english: "Recommended",
    also: "also called Mandūb or Sunnah",
    color: "bg-emerald-100 text-emerald-900",
    description:
      "Encouraged. You earn reward for doing it, but it is not a sin to leave it. Example: Sunnah prayers around the obligatory ones.",
  },
  {
    name: "Mubāḥ",
    english: "Permissible",
    also: "also called Ḥalāl or Jāʾiz",
    color: "bg-gray-100 text-gray-800",
    description:
      "Neutral. Neither rewarded nor sinful. Most everyday choices fall here: what to eat (within halal limits), what to wear, where to sit.",
  },
  {
    name: "Makrūh",
    english: "Disliked",
    also: "",
    color: "bg-amber-100 text-amber-900",
    description:
      "Discouraged. You earn reward for leaving it, but it is not a sin to do it. Example: wasteful use of water in wuḍū.",
  },
  {
    name: "Ḥarām",
    english: "Forbidden",
    also: "also called Maḥẓūr",
    color: "bg-rose-900 text-white",
    description:
      "Clearly prohibited. You earn reward for leaving it and sin for doing it. Example: ribā (interest), zinā, consuming alcohol.",
  },
];

const sources = [
  {
    num: "1",
    title: "The Qur'an",
    detail:
      "The primary and highest source. Every ruling in Islam ultimately goes back to the Book of Allah.",
  },
  {
    num: "2",
    title: "The Sunnah",
    detail:
      "The statements, actions, and approvals of the Prophet ﷺ. The Sunnah explains, clarifies, and details what the Qur'an mentions briefly.",
  },
  {
    num: "3",
    title: "Ijmāʿ (Consensus)",
    detail:
      "When the qualified scholars of the Ummah agree on a ruling, that agreement is a source of law. True ijmāʿ is considered binding.",
  },
  {
    num: "4",
    title: "Qiyās (Analogy)",
    detail:
      "Applying a ruling from the Qur'an, Sunnah, or ijmāʿ to a new case that shares the same underlying reason (ʿillah). Used carefully by qualified scholars.",
  },
];

const madhabs = [
  {
    name: "Ḥanafī",
    arabic: "حنفي",
    founder: "Imam Abū Ḥanīfah",
    years: "80-150 AH",
    region:
      "Widely followed across Turkey, the Balkans, Central Asia, Pakistan, India, Bangladesh, and parts of Egypt",
    known: "Emphasis on reasoned analysis (raʾy) alongside the texts",
  },
  {
    name: "Mālikī",
    arabic: "مالكي",
    founder: "Imam Mālik ibn Anas",
    years: "93-179 AH",
    region:
      "Widely followed across North Africa, West Africa, and parts of the Gulf",
    known:
      "Heavy reliance on the practice of the people of Madīnah as a living source of Sunnah",
  },
  {
    name: "Shāfiʿī",
    arabic: "شافعي",
    founder: "Imam Muḥammad ibn Idrīs ash-Shāfiʿī",
    years: "150-204 AH",
    region:
      "Widely followed across Egypt, the Levant, Yemen, East Africa, and Southeast Asia (Indonesia, Malaysia)",
    known:
      "Systematized uṣūl al-fiqh; widely credited as the founder of the discipline",
  },
  {
    name: "Ḥanbalī",
    arabic: "حنبلي",
    founder: "Imam Aḥmad ibn Ḥanbal",
    years: "164-241 AH",
    region: "Widely followed across the Arabian Peninsula",
    known:
      "Strong preference for staying close to the explicit texts of the Qur'an and Sunnah",
  },
];

type Level = {
  level: string;
  levelColor: string;
  intro: string;
  duration: string;
  before: string;
  whatYoullLearn: string[];
  afterThis: string;
  books: { title: string; description: string; href: string }[];
  tip: string;
};

const levels: Level[] = [
  {
    level: "Beginner",
    levelColor: "bg-emerald-100 text-emerald-900",
    intro:
      "Start with a simple, practical fiqh primer that covers the rulings of daily worship. The goal is to pray, fast, purify, and give charity correctly, not to debate advanced cases.",
    duration: "3 to 6 months",
    before:
      "No prior fiqh knowledge needed. Basic understanding of the pillars of Islam is enough.",
    whatYoullLearn: [
      "How to perform wuḍū, ghusl, and tayammum correctly",
      "The rulings of the five daily prayers in detail",
      "The basics of fasting Ramadan, zakāh, and hajj",
      "The difference between wājib, mustaḥabb, mubāḥ, makrūh, and ḥarām",
    ],
    afterThis:
      "You will be able to fulfill your daily acts of worship with confidence and move to a more structured study.",
    books: [
      {
        title: "Fiqh Made Easy",
        description:
          "A clear, accessible introduction to Islamic rulings. Written for readers who want a straightforward handbook on daily worship.",
        href: "/books/islamic-jurisprudence/fiqh-made-easy-269",
      },
      {
        title: "A Summary of Islamic Jurisprudence Vol. 1",
        description:
          "By Shaykh Ṣāliḥ al-Fawzān. Covers purification, prayer, zakāh, fasting, and hajj with evidence from the Qur'an and Sunnah.",
        href: "/books/islamic-jurisprudence/a-summary-of-islamic-jurisprudence-vol-1-248",
      },
      {
        title: "A Summary of Islamic Jurisprudence Vol. 2",
        description:
          "Continues with muʿāmalāt, family law, and other everyday rulings. Use together with Vol. 1.",
        href: "/books/islamic-jurisprudence/a-summary-of-islamic-jurisprudence-vol-2-259",
      },
      {
        title: "Fiqhul Ibādāt (Fiqh of Worship)",
        description:
          "Focused guide on the rulings of worship. Excellent if you want to master ibādāt before moving on to other areas.",
        href: "/books/islamic-jurisprudence/fiqhul-ibaadat-fiqh-of-worship-272",
      },
    ],
    tip: "Focus on one topic at a time. Master wuḍū and prayer first before moving to fasting or zakāh. Correct practice beats broad but shallow reading.",
  },
  {
    level: "Intermediate",
    levelColor: "bg-amber-100 text-amber-900",
    intro:
      "Now you move from a primer to a structured fiqh text. These books cover daily worship and transactions with more detail, often tied to one of the four madhabs.",
    duration: "1 to 2 years",
    before:
      "Finish a beginner fiqh primer. You should be able to perform all acts of worship without looking them up each time.",
    whatYoullLearn: [
      "Detailed rulings on purification, prayer, and transactions",
      "How classical fiqh texts present a ruling with its evidence",
      "The rulings for common real-life situations (travel, sickness, business)",
      "An introduction to scholarly differences and how to handle them",
    ],
    afterThis:
      "You will be able to follow most fiqh lessons and know where to find answers to everyday questions.",
    books: [
      {
        title: "The Mainstay Concerning Jurisprudence (Al-ʿUmdat fī al-Fiqh)",
        description:
          "A classic entry-level Ḥanbalī text by Ibn Qudāmah. Short, clear, and widely taught.",
        href: "/books/islamic-jurisprudence/the-mainstay-concerning-jurisprudence-al-umdat-fi-al-fiqh-276",
      },
      {
        title: "The Path of the Wayfarer (Minhāj as-Sālikīn)",
        description:
          "By Shaykh as-Saʿdī. A concise and accessible fiqh manual covering worship and transactions.",
        href: "/books/islamic-jurisprudence/the-path-of-the-wayfarer-minhaj-al-salikin-277",
      },
      {
        title: "Comprehensive Islamic Jurisprudence",
        description:
          "A broader fiqh reference for readers who want systematic coverage of many topics in one place.",
        href: "/books/islamic-jurisprudence/comprehensive-islamic-jurisprudence-270",
      },
      {
        title: "Zad ul-Maʿād Vol. 1",
        description:
          "Ibn al-Qayyim's masterpiece on the guidance of the Prophet ﷺ in worship, transactions, and character. A fiqh and seerah crossover.",
        href: "/books/islamic-jurisprudence/zad-ul-maad-vol-1-250",
      },
    ],
    tip: "Pair your reading with a teacher or a recorded lecture series. A book alone will rarely answer all your questions; a teacher can fill the gaps.",
  },
  {
    level: "Advanced",
    levelColor: "bg-rose-100 text-rose-900",
    intro:
      "Classical fiqh from within a specific madhab, plus the principles (uṣūl al-fiqh) that tell scholars how to derive rulings in the first place. Best done with a teacher.",
    duration: "Years, typically a lifetime of study",
    before:
      "Comfortable with an intermediate text like Al-ʿUmdat or Minhāj as-Sālikīn. Familiar with Arabic fiqh terminology.",
    whatYoullLearn: [
      "A full classical madhab text in depth (Ḥanafī, Mālikī, Shāfiʿī, or Ḥanbalī)",
      "The principles of uṣūl al-fiqh: how rulings are derived",
      "How to compare positions across the four madhabs",
      "The major works of contrastive fiqh (like Bidāyat al-Mujtahid)",
    ],
    afterThis:
      "You will be equipped to read classical fiqh works on your own and engage with scholarly discussions on rulings.",
    books: [
      {
        title: "The Distinguished Jurist's Primer Vol. 1 (Bidāyat al-Mujtahid)",
        description:
          "Ibn Rushd's masterpiece that compares the positions of the four madhabs on every major topic, with their evidences. One of the finest fiqh works in the Islamic tradition.",
        href: "/books/islamic-jurisprudence/the-distinguished-jurist-s-primer-vol-1-254",
      },
      {
        title: "The Distinguished Jurist's Primer Vol. 2",
        description: "Continues the comparative analysis across more areas of fiqh.",
        href: "/books/islamic-jurisprudence/the-distinguished-jurist-s-primer-vol-2-255",
      },
      {
        title: "Zād al-Mustaqniʿ (Ḥanbalī)",
        description:
          "A classical Ḥanbalī handbook memorized by students of knowledge. Dense and precise.",
        href: "/books/islamic-jurisprudence/zad-al-mustaqni-classical-guide-to-the-hanbali-madhab-278",
      },
      {
        title: "The Foundation of the Knowledge of Uṣūl",
        description:
          "An introduction to uṣūl al-fiqh, the principles scholars use to derive rulings from the Qur'an and Sunnah.",
        href: "/books/islamic-jurisprudence/the-foundation-of-the-knowledge-of-usul-274",
      },
      {
        title: "Nūr al-Īḍāḥ (Ḥanafī)",
        description:
          "A standard Ḥanafī handbook on worship. Ideal for those studying within the Ḥanafī tradition.",
        href: "/books/islamic-jurisprudence/nur-al-idah-the-light-of-clarification-hanafi-fiqh-266",
      },
      {
        title: "Elements of Shāfiʿī Fiqh",
        description:
          "For those studying the Shāfiʿī school. A foundational text in that tradition.",
        href: "/books/islamic-jurisprudence/elements-of-shaafi-fiqh-267",
      },
    ],
    tip: "Advanced fiqh without a teacher easily turns into personal opinion. If a teacher is not available, at minimum study with a verified lecture series by a qualified scholar.",
  },
];

const commonMistakes = [
  {
    problem:
      "Treating one scholar's answer as the only valid position",
    solution:
      "On many issues, qualified scholars have differed for centuries. Before concluding that a view is the only correct one, check how the four madhabs and major contemporary scholars treated it. Scholarly difference (ikhtilāf) is often mercy, not contradiction.",
  },
  {
    problem: "Asking fiqh questions to unqualified people online",
    solution:
      "Social media personalities are not always scholars. Before acting on a ruling, check the source. Ask trusted local scholars or use established fatwa sites that name their scholars openly.",
  },
  {
    problem: "Treating fiqh as separate from worship of the heart",
    solution:
      "Fiqh without sincerity is hollow. The goal of the rulings is to make worship beloved to Allah, not to turn religion into a checklist. Study fiqh alongside aqeedah, tafsir, and the seerah.",
  },
  {
    problem: "Claiming 'Qur'an and Sunnah only' without tools",
    solution:
      "It sounds pious to say 'I only follow Qur'an and Sunnah', but without uṣūl al-fiqh and Arabic, a person is often just following their own understanding. The great scholars of the madhabs also only followed Qur'an and Sunnah; they had the tools to do so correctly.",
  },
  {
    problem:
      "Jumping between madhabs to find the easiest ruling",
    solution:
      "Cherry-picking the easiest opinion on every issue (talfīq) is discouraged by most scholars. Either follow one madhab carefully or ask a qualified scholar why a specific position is stronger on a specific case.",
  },
  {
    problem: "Extreme strictness or extreme laxity",
    solution:
      "Both are deviations from the Prophetic middle path. Islam does not ask for unnecessary hardship, and it does not permit ignoring clear rulings. When in doubt, return to qualified scholars rather than your own emotions.",
  },
];

const faq = [
  {
    q: "Do I have to follow a madhab?",
    a: "Scholars have differed on this for centuries. The majority historically have encouraged ordinary Muslims to follow a qualified scholar or madhab, because the average person does not have the tools to derive rulings directly. Others say you should follow the strongest evidence on each issue. Either way, the goal is not to isolate yourself from scholarly tradition. See the library book Legal Status of Following a Madhab for a detailed discussion.",
  },
  {
    q: "Which madhab is the best?",
    a: "All four Sunni madhabs (Ḥanafī, Mālikī, Shāfiʿī, Ḥanbalī) are valid and followed by millions. They differ in methodology and some details, not in creed. The best madhab for you is often the one taught by reliable scholars in your community. If none are prominent locally, start with whichever has the clearest accessible resources and a qualified teacher.",
  },
  {
    q: "Why do scholars disagree on rulings?",
    a: "Different scholars weigh evidences differently, interpret Arabic differently, or know different narrations. As long as the difference is within the bounds of what the texts allow, all valid positions are considered acceptable. The Prophet ﷺ accepted different correct approaches by his Companions on the same situation.",
  },
  {
    q: "Do I need to know Arabic for fiqh?",
    a: "For basic practice, no. English fiqh books cover daily worship well. For serious study of classical texts and uṣūl al-fiqh, Arabic becomes essential because the texts are precisely worded in Arabic and translations cannot fully carry the nuance.",
  },
  {
    q: "Who can issue a fatwa?",
    a: "A fatwa is a formal religious ruling and requires a qualified scholar. Ordinary Muslims can share what they know, but they should say 'I read' or 'Shaykh X said' rather than giving their own rulings. If you are asked something and you do not know, the correct answer is 'Allah knows best, ask a scholar'.",
  },
  {
    q: "How do I handle differences of opinion in my family or community?",
    a: "With adab. If your family follows a slightly different opinion on a minor issue, do not treat them as wrong. Show respect. Save disagreement for the few cases where there is clearly no valid basis. The Companions of the Prophet ﷺ differed on many issues and they did not split over them.",
  },
];

const related = [
  {
    href: "/guides",
    title: "All Islamic Guides",
    description: "Browse every guide on the site.",
  },
  {
    href: "/books/islamic-jurisprudence",
    title: "Jurisprudence Library",
    description: "Every fiqh book in our library.",
  },
  {
    href: "/guides/hadith",
    title: "Hadith Guide",
    description: "Fiqh is built on hadith. Study them alongside.",
  },
  {
    href: "/guides/aqeedah",
    title: "Aqeedah Guide",
    description: "Correct belief is the foundation for correct practice.",
  },
];

export const metadata = {
  title: "Beginner's Guide to Islamic Jurisprudence (Fiqh)",
  description:
    "A careful, step-by-step path to studying Islamic jurisprudence: what fiqh is, the four sources, the five rulings, the four madhabs, common mistakes, and reliable book recommendations.",
};

export default function JurisprudenceGuidePage() {
  return (
    <>
      <ContentHeader
        title="Beginner's Guide to Fiqh"
        subtitle="Understanding Islamic jurisprudence, step by step"
        breadcrumbs={[
          { label: "Islamic Guides", href: "/guides" },
          { label: "Jurisprudence" },
        ]}
      />

      <section className="max-w-6xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        {/* Intro */}
        <div className="bg-teal-100 rounded-2xl px-8 py-8 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-bold text-teal-900 mb-3 text-center font-[family-name:var(--font-playfair)]">
            What is Fiqh?
          </h2>
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[19px] leading-[1.65] text-center">
            Fiqh (الفقه) means &ldquo;deep understanding&rdquo;. In Islam, it
            refers to the practical rulings that shape how a Muslim prays,
            fasts, pays zakāh, gets married, does business, and lives daily
            life. Fiqh is how the Qur&apos;an and Sunnah become your actions. This
            guide walks you through what fiqh is, how scholars derive rulings,
            the four schools, and a realistic three-step path for studying it.
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

        {/* What Fiqh Covers */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              What Fiqh Covers
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Fiqh is traditionally divided into three broad areas.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {whatFiqhCovers.map((w) => (
              <div
                key={w.title}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <h3 className="text-base font-bold text-teal-900">{w.title}</h3>
                <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider mb-3">
                  {w.english}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {w.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Sources */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Layers size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              The Four Sources of Islamic Rulings
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Every ruling in fiqh is traced back to one of these four, in order
            of priority.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sources.map((s) => (
              <div
                key={s.num}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex gap-4"
              >
                <div className="shrink-0 w-9 h-9 rounded-full bg-teal-900 text-white font-bold flex items-center justify-center text-sm">
                  {s.num}
                </div>
                <div>
                  <h3 className="text-base font-bold text-teal-900 mb-1">
                    {s.title}
                  </h3>
                  <p className="text-gray-700 text-sm">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5 Rulings */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Gavel size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              The Five Categories of Rulings
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Every action in Islam falls into one of these five categories, from
            clearly required to clearly forbidden.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {rulings.map((r) => (
              <div
                key={r.name}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex flex-col"
              >
                <span
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${r.color} inline-block self-start mb-2`}
                >
                  {r.english}
                </span>
                <h3 className="text-base font-bold text-teal-900">{r.name}</h3>
                {r.also && (
                  <p className="text-[11px] text-gray-400 italic mb-2">
                    {r.also}
                  </p>
                )}
                <p className="text-sm text-gray-700 leading-relaxed mt-2 flex-1">
                  {r.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Four Madhabs */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Scale size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              The Four Sunni Madhabs
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            The four classical schools of Sunni jurisprudence. All four are
            valid and followed by millions of Muslims worldwide. They differ in
            methodology and some details, not in creed.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {madhabs.map((m) => (
              <div
                key={m.name}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-baseline justify-between gap-3 mb-1 flex-wrap">
                  <h3 className="text-lg font-bold text-teal-900">{m.name}</h3>
                  <span
                    className="font-[family-name:var(--font-amiri)] text-teal-700 text-xl"
                    dir="rtl"
                  >
                    {m.arabic}
                  </span>
                </div>
                <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider mb-3">
                  {m.founder} ({m.years})
                </p>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">
                  <span className="font-semibold text-gray-800">
                    Where followed:
                  </span>{" "}
                  {m.region}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-semibold text-gray-800">
                    Known for:
                  </span>{" "}
                  {m.known}
                </p>
              </div>
            ))}
          </div>
          <div className="bg-teal-50 border-l-4 border-teal-700 rounded-2xl p-4 mt-4 flex items-start gap-3">
            <Info size={16} className="text-teal-700 shrink-0 mt-0.5" />
            <p className="text-sm text-teal-900 leading-relaxed">
              <span className="font-semibold">Respect note:</span> all four
              madhabs are legitimate paths of Sunni fiqh. Differences between
              them are scholarly and methodological, not a matter of right
              belief versus wrong belief. The Companions of the Prophet ﷺ
              themselves differed on many fiqh questions and remained one
              community.
            </p>
          </div>
        </div>

        {/* Middle path callout */}
        <div className="mb-12 bg-teal-900 text-white rounded-2xl px-8 py-8 shadow-[0_4px_12px_rgba(0,0,0,0.12)] text-center">
          <p className="text-xl md:text-2xl font-bold font-[family-name:var(--font-playfair)] leading-tight mb-3">
            Fiqh is a <span className="text-teal-200">middle path</span>.
          </p>
          <p className="text-sm text-teal-100 max-w-2xl mx-auto leading-relaxed">
            Not extreme strictness that invents hardship, not laxity that
            abandons what Allah clearly ruled. The Prophet ﷺ said: &ldquo;Make
            things easy and do not make them difficult.&rdquo; Study fiqh to
            walk that middle path, grounded in the tools that scholars have
            always used.
          </p>
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
            A realistic progression from your first fiqh primer to lifelong
            study, with time estimates, prerequisites, and the specific books at
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
            The pitfalls every student of fiqh should know about in advance.
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

        {/* Asking scholars */}
        <div className="mb-12 bg-teal-50 border-l-4 border-teal-700 rounded-2xl p-5 flex items-start gap-3">
          <Users size={20} className="text-teal-700 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-bold text-teal-900 mb-1">
              A note on asking scholars
            </h3>
            <p className="text-sm text-teal-900 leading-relaxed">
              If you have a specific personal question, do not guess. Ask a
              qualified scholar who knows your situation. The Qur&apos;an says:
              &ldquo;Ask the people of knowledge if you do not know.&rdquo;
              (16:43). An honest &ldquo;Allah knows best, let me ask a
              scholar&rdquo; is always better than a confident wrong answer.
            </p>
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
