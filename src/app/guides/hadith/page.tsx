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
  Users,
  Link2,
} from "lucide-react";

const motivation = [
  {
    text: "And whatever the Messenger has given you, take it; and whatever he has forbidden you, refrain from it.",
    source: "Surah Al-Ḥashr 59:7",
  },
  {
    text: "Say: If you love Allah, then follow me; Allah will love you and forgive you your sins.",
    source: "Surah Āl ʿImrān 3:31",
  },
  {
    text: "I have left among you two things. If you hold fast to them, you will never go astray: the Book of Allah and my Sunnah.",
    source: "Al-Muwaṭṭaʾ 1594",
  },
];

const partsOfHadith = [
  {
    title: "Isnād",
    arabic: "الإسناد",
    english: "The chain of narrators",
    description:
      "The list of people who passed the narration down, one to the next, all the way back to the Prophet ﷺ. The isnād is the backbone that lets scholars check whether a report is reliable.",
  },
  {
    title: "Matn",
    arabic: "المتن",
    english: "The text of the narration",
    description:
      "The actual statement, action, or approval of the Prophet ﷺ being reported. This is what you usually see translated into English.",
  },
  {
    title: "Takhrīj",
    arabic: "التخريج",
    english: "Sourcing & grading",
    description:
      "Tracing a hadith back to the books it appears in, and noting its grade (saḥīḥ, ḥasan, ḍaʿīf, and so on). Every reliable hadith collection lists its sources so you can verify.",
  },
];

const authenticityGrades = [
  {
    name: "Ṣaḥīḥ",
    english: "Authentic",
    color: "bg-emerald-100 text-emerald-900",
    description:
      "The highest grade. The chain is connected, the narrators are all upright and precise, and there is no hidden defect. These are the strongest narrations and are acted upon in all areas of the religion.",
  },
  {
    name: "Ḥasan",
    english: "Good",
    color: "bg-sky-100 text-sky-900",
    description:
      "Similar to ṣaḥīḥ but one of the narrators is slightly less precise. Acted upon like ṣaḥīḥ in most cases, especially when supported by other reports.",
  },
  {
    name: "Ḍaʿīf",
    english: "Weak",
    color: "bg-amber-100 text-amber-900",
    description:
      "A defect in the chain or text: a missing narrator, an unreliable narrator, or a problem with the wording. Scholars do not use weak hadith for creed or rulings. Some scholars permit it for encouraging virtuous acts with conditions; others avoid it entirely.",
  },
  {
    name: "Mawḍūʿ",
    english: "Fabricated",
    color: "bg-rose-100 text-rose-900",
    description:
      "A forged narration, never said by the Prophet ﷺ. These are not hadith at all. Scholars wrote whole books exposing them. You must never attribute a fabricated report to the Prophet ﷺ.",
  },
];

const sixBooks = [
  {
    name: "Ṣaḥīḥ al-Bukhārī",
    author: "Imam al-Bukhārī (194-256 AH)",
    detail:
      "The most authentic book after the Qur'an. Every hadith in it is ṣaḥīḥ by the strictest standards. About 7,000 narrations arranged by topic.",
  },
  {
    name: "Ṣaḥīḥ Muslim",
    author: "Imam Muslim ibn al-Ḥajjāj (204-261 AH)",
    detail:
      "Second only to al-Bukhārī in authority. Organized by topic with unmatched narrative clarity. Many hadith in Muslim are also in Bukhārī (called muttafaq ʿalayh, agreed upon).",
  },
  {
    name: "Sunan Abī Dāwūd",
    author: "Imam Abū Dāwūd as-Sijistānī (202-275 AH)",
    detail:
      "Focused primarily on the legal narrations (aḥkām hadith) that underpin fiqh rulings. Abū Dāwūd often notes the grade himself.",
  },
  {
    name: "Jāmiʿ at-Tirmidhī",
    author: "Imam at-Tirmidhī (209-279 AH)",
    detail:
      "Unique in that Tirmidhī discusses the grade, the scholarly positions, and the fiqh relevance of each hadith. Excellent for students.",
  },
  {
    name: "Sunan an-Nasāʾī",
    author: "Imam an-Nasāʾī (215-303 AH)",
    detail:
      "Famous for strictness in narrator criticism. After Bukhārī and Muslim, many scholars consider Nasāʾī the next most authentic.",
  },
  {
    name: "Sunan Ibn Mājah",
    author: "Imam Ibn Mājah (209-273 AH)",
    detail:
      "The sixth of the Kutub as-Sittah by most counts. Contains unique narrations not found in the others, though it also contains a number of weak reports.",
  },
];

const muhaddithun = [
  {
    name: "Imam al-Bukhārī",
    years: "194-256 AH",
    known: "Author of the most authentic book",
    note: "Traveled for decades collecting narrations, would refuse to write a hadith until he had performed wuḍū and prayed two rakʿahs asking for Allah's guidance on it.",
  },
  {
    name: "Imam Muslim",
    years: "204-261 AH",
    known: "Student of al-Bukhārī",
    note: "His Ṣaḥīḥ is celebrated for arranging hadith by narration clarity and gathering variant wordings of the same hadith together.",
  },
  {
    name: "Imam Aḥmad ibn Ḥanbal",
    years: "164-241 AH",
    known: "Author of al-Musnad",
    note: "Preserved over 25,000 narrations arranged by Companion. A hadith master and jurist whose resistance during the miḥnah is a legendary story in itself.",
  },
  {
    name: "Imam an-Nawawī",
    years: "631-676 AH",
    known: "Author of Forty Hadith and Riyāḍ aṣ-Ṣāliḥīn",
    note: "Not from the earliest era but one of the most widely-read hadith compilers in history. His 40 Hadith is memorized by students worldwide.",
  },
  {
    name: "Ḥāfiẓ Ibn Ḥajar",
    years: "773-852 AH",
    known: "Author of Fatḥ al-Bārī",
    note: "His commentary on Ṣaḥīḥ al-Bukhārī is considered the greatest work of its kind. Also wrote Bulūgh al-Marām, widely used for fiqh hadith.",
  },
  {
    name: "Shaykh al-Albānī",
    years: "1332-1420 AH",
    known: "Modern hadith master",
    note: "Revived the science of hadith grading in the modern era. His checks of the Sunan collections are standard references today.",
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
      "Start with short, curated hadith collections that every Muslim should know. The goal is to learn foundational narrations with their explanations before opening larger collections.",
    duration: "3 to 6 months",
    before:
      "No prior knowledge needed. Basic understanding of Islamic terms is helpful.",
    whatYoullLearn: [
      "Forty of the most important hadith in Islam (An-Nawawī's 40)",
      "Short explanations of common hadith in everyday language",
      "The difference between a hadith, a Qur'anic verse, and a ḥadīth qudsī",
      "How to quickly tell a famous hadith from a shared quote that may be fabricated",
    ],
    afterThis:
      "You will have a solid foundation of well-known, authentic hadith and be ready for topical collections.",
    books: [
      {
        title: "Explanation of Imam an-Nawawī's 40 Hadith",
        description:
          "The single best starting point in hadith. Forty carefully chosen narrations that cover the foundations of Islam, each with a short explanation.",
        href: "/books/hadith-studies/explanation-of-imam-an-nawawi-40-hadith-335",
      },
      {
        title: "Forty Hadith: Text and Explanation",
        description:
          "Another excellent edition of an-Nawawī's 40 Hadith with clear English commentary.",
        href: "/books/hadith-studies/forty-hadith-text-and-explanation-282",
      },
      {
        title: "200 Golden Hadiths",
        description:
          "A broader curated collection beyond the 40. A natural next step once you are comfortable with the core narrations.",
        href: "/books/hadith-studies/200-golden-hadiths-283",
      },
      {
        title: "110 Hadith Qudsī",
        description:
          "A special category: statements of Allah reported through the Prophet ﷺ (not part of the Qur'an). Short, powerful, and deeply spiritual.",
        href: "/books/hadith-studies/110-hadith-qudsi-290",
      },
    ],
    tip: "Memorize one hadith from an-Nawawī's 40 per week, along with its meaning. In one year you will have memorized the whole collection.",
  },
  {
    level: "Intermediate",
    levelColor: "bg-amber-100 text-amber-900",
    intro:
      "Now move to larger topical collections and start the basic sciences of hadith: how chains are checked and how narrations are graded.",
    duration: "1 to 2 years",
    before:
      "Finish An-Nawawī's 40 and be comfortable with common Islamic terminology.",
    whatYoullLearn: [
      "Comprehensive topical hadith collections for daily practice",
      "The classical Prophetic etiquette found in al-Adab al-Mufrad",
      "The basics of the science of hadith (muṣṭalaḥ al-ḥadīth)",
      "How to identify ṣaḥīḥ, ḥasan, ḍaʿīf, and fabricated reports",
    ],
    afterThis:
      "You will be able to read most hadith books confidently and recognize authentic from unreliable narrations.",
    books: [
      {
        title: "Explanation of Riyāḍ aṣ-Ṣāliḥīn Vol. 1",
        description:
          "Imam an-Nawawī's classic topical collection of authentic hadith for daily practice. With Shaykh Ibn ʿUthaymīn's commentary.",
        href: "/books/hadith-studies/explanation-of-riyad-us-saliheen-vol-1-344",
      },
      {
        title: "Al-Adab al-Mufrad (Prophetic Morals & Etiquettes)",
        description:
          "Imam al-Bukhārī's famous collection focused on character and daily conduct. A beautiful companion to the major collections.",
        href: "/books/hadith-studies/al-adab-al-mufrad-prophetic-morals-and-etiquettes-313",
      },
      {
        title: "Al-Luʾluʾ wal-Marjān Vol. 1",
        description:
          "Only the hadith agreed upon (muttafaq ʿalayh) between al-Bukhārī and Muslim. The strongest of the strong.",
        href: "/books/hadith-studies/al-lulu-wal-marjan-vol-1-297",
      },
      {
        title: "Bulūgh al-Marām",
        description:
          "Ibn Ḥajar's curated hadith collection organized by fiqh topic. Essential for tying hadith to practical rulings.",
        href: "/books/hadith-studies/bulugh-al-maram-324",
      },
      {
        title: "An Introduction to the Science of Hadith",
        description:
          "A plain-language primer on muṣṭalaḥ al-ḥadīth: chains, grades, types of narrations, and the methodology of hadith scholars.",
        href: "/books/hadith-studies/an-introduction-to-the-science-of-hadith-291",
      },
      {
        title: "A Textbook of Hadith Studies",
        description:
          "A structured, academic introduction to the history and principles of hadith literature.",
        href: "/books/hadith-studies/a-textbook-of-hadith-studies-284",
      },
    ],
    tip: "Read one page of Riyāḍ aṣ-Ṣāliḥīn daily. It is arranged by topic (sincerity, patience, gratitude) and is the perfect companion for daily reflection.",
  },
  {
    level: "Advanced",
    levelColor: "bg-rose-100 text-rose-900",
    intro:
      "The major hadith books in full, plus the specialist sciences of hadith criticism. Best done with a teacher who can help you weigh narrators and chains.",
    duration: "Years, often a lifetime",
    before:
      "Solid intermediate foundation. Arabic helps significantly at this level.",
    whatYoullLearn: [
      "The Ṣaḥīḥayn (Bukhārī and Muslim) and the four Sunan in full",
      "Musnad structure (organized by Companion) from Imam Aḥmad",
      "The technical sciences of narrator criticism (ʿilm ar-rijāl)",
      "How to read ḥāshiyah notes and critical commentary on hadith",
    ],
    afterThis:
      "You will be equipped to engage with scholarly discussions on hadith and to teach others.",
    books: [
      {
        title: "Ṣaḥīḥ al-Bukhārī (Vol. 1)",
        description:
          "The first volume of the most authentic book after the Qur'an. The full set is 9 volumes.",
        href: "/books/hadith-studies/sahih-al-bukhari-vol-1-299",
      },
      {
        title: "Ṣaḥīḥ Muslim (Vol. 1)",
        description:
          "Second only to al-Bukhārī. The full set is 7 volumes.",
        href: "/books/hadith-studies/sahih-muslim-vol-1-309",
      },
      {
        title: "Sunan Abī Dāwūd (Vol. 1)",
        description:
          "Known for its focus on legal narrations. The full set is 5 volumes.",
        href: "/books/hadith-studies/sunan-abu-dawud-vol-1-323",
      },
      {
        title: "Jāmiʿ at-Tirmidhī (Vol. 1)",
        description:
          "Unique for its explanations of the grade and fiqh relevance of each hadith. Full set is 6 volumes.",
        href: "/books/hadith-studies/jami-at-tirmidhi-vol-1-317",
      },
      {
        title: "Sunan an-Nasāʾī (Vol. 1)",
        description:
          "Strict narrator criticism. Widely ranked third in authenticity after Bukhārī and Muslim.",
        href: "/books/hadith-studies/sunan-an-nasa-i-vol-1-329",
      },
      {
        title: "Musnad Imam Aḥmad ibn Ḥanbal (Vol. 1)",
        description:
          "Massive collection arranged by Companion. Preserves many narrations not found elsewhere.",
        href: "/books/hadith-studies/musnad-imam-ahmad-bin-hanbal-vol-1-341",
      },
      {
        title: "Nukhbat al-Fikr",
        description:
          "Ibn Ḥajar's classical primer on the science of hadith. Short but technical; foundational for serious students.",
        href: "/books/hadith-studies/nukhbat-al-fikr-288",
      },
      {
        title: "A Commentary on the Poem al-Bayqūniyyah",
        description:
          "A classic didactic poem on the grades of hadith, with its explanation. A standard text in hadith sciences.",
        href: "/books/hadith-studies/a-commentary-on-the-poem-al-bayquniyyah-302",
      },
      {
        title: "Rules Governing the Criticism of Hadith",
        description:
          "Explores how hadith scholars evaluate narrators and chains. Essential reference at this level.",
        href: "/books/hadith-studies/rules-governing-the-criticism-of-hadith-294",
      },
    ],
    tip: "Do not try to read all nine volumes of Bukhārī cover to cover in one sitting. Pick a topic (book of faith, book of knowledge, book of prayer) and work through that chapter with a commentary like Fatḥ al-Bārī.",
  },
];

const commonMistakes = [
  {
    problem: "Sharing a hadith before checking its authenticity",
    solution:
      "Before forwarding a striking hadith, search for it in verified collections. If you cannot find it or cannot find a grading from a respected scholar, do not share it. The Prophet ﷺ warned that whoever narrates a lie against him will take his seat in the Fire.",
  },
  {
    problem: "Confusing a ḥadīth qudsī with a verse of the Qur'an",
    solution:
      "A ḥadīth qudsī is a statement of Allah reported through the Prophet ﷺ, but its wording came through the Prophet ﷺ, not direct revelation like the Qur'an. Never recite it in ṣalāh or treat it as Qur'an.",
  },
  {
    problem: "Rejecting the Sunnah in favor of Qur'an alone",
    solution:
      "The Qur'an itself commands obedience to the Prophet ﷺ (59:7). Many commands like how to pray, how to pay zakāh, and how to perform hajj are not detailed in the Qur'an; they come only through the Sunnah. Rejecting hadith means rejecting half of the religion.",
  },
  {
    problem: "Acting on weak or fabricated hadith as if they were strong",
    solution:
      "Check the grading before you act. For creed (ʿaqīdah) and rulings (aḥkām), use only authentic hadith. Some scholars allow weak hadith in topics of virtue with strict conditions; fabricated ones must never be used.",
  },
  {
    problem: "Dismissing hadith because it is hard to accept",
    solution:
      "If a hadith is authentic and clearly stated, the correct response is submission, not rejection. If something seems to contradict your understanding, look at scholarly explanations before concluding the hadith is wrong. The problem is usually our understanding, not the hadith.",
  },
  {
    problem: "Using translations of hadith without their context",
    solution:
      "A hadith often has a specific context (asbāb al-wurūd) that changes how it is applied. Before taking a one-line quote as a general ruling, check the full context in a verified commentary like the explanation of Riyāḍ aṣ-Ṣāliḥīn or Fatḥ al-Bārī.",
  },
];

const faq = [
  {
    q: "What is the difference between a hadith and the Qur'an?",
    a: "The Qur'an is the direct word of Allah revealed to the Prophet ﷺ in Arabic, preserved exactly. A hadith is a report of what the Prophet ﷺ said, did, or approved, in his own words. Both are revelation (waḥy) in one sense, but only the Qur'an is recited in prayer, preserved in its exact wording, and considered the miracle of the Prophet ﷺ.",
  },
  {
    q: "What is a ḥadīth qudsī?",
    a: "A narration where the Prophet ﷺ reports a statement from Allah, but in the Prophet's ﷺ own words. It is neither Qur'an nor a regular hadith, sitting between them. Famous example: 'My mercy has outstripped My anger' (Bukhārī and Muslim).",
  },
  {
    q: "Where do I check if a hadith is authentic?",
    a: "Good starting points in English are sunnah.com (which includes grades from Shaykh al-Albānī) and the verified editions of Riyāḍ aṣ-Ṣāliḥīn, the 40 Hadith, Bulūgh al-Marām, and similar collections. If you cannot find a hadith on any reliable site, it is very possibly weak or fabricated.",
  },
  {
    q: "Do I need Arabic to study hadith?",
    a: "For daily practice, no. There are excellent English translations of all the major collections. For serious study of muṣṭalaḥ al-ḥadīth, narrator criticism, or to read original commentaries like Fatḥ al-Bārī, Arabic becomes essential.",
  },
  {
    q: "Why are there different grades of hadith?",
    a: "Humans passed these narrations down, and not all narrators were equally reliable. Hadith scholars developed detailed criteria to check the chain and the text for strength, weakness, or defect. Grading protects the religion from false narrations being attributed to the Prophet ﷺ.",
  },
  {
    q: "What about weak or fabricated hadith circulating online?",
    a: "Many famous quotes online are not authentic, some are not hadith at all. If a quote moves you, verify it before sharing. It is better to stay silent than to attribute something to the Prophet ﷺ that he did not say.",
  },
];

const related = [
  {
    href: "/guides",
    title: "All Islamic Guides",
    description: "Browse every guide on the site.",
  },
  {
    href: "/books/hadith-studies",
    title: "Hadith Studies Library",
    description: "Every hadith book in our library.",
  },
  {
    href: "/guides/jurisprudence",
    title: "Jurisprudence Guide",
    description: "Fiqh is built on hadith. Study them alongside.",
  },
  {
    href: "/guides/aqeedah",
    title: "Aqeedah Guide",
    description: "Creed rests on authentic revelation from both sources.",
  },
];

export const metadata = {
  title: "Beginner's Guide to Hadith",
  description:
    "A careful, step-by-step path to studying the hadith of the Prophet Muhammad ﷺ: what hadith is, how scholars grade it, the six major books, common mistakes, and reliable book recommendations.",
};

export default function HadithGuidePage() {
  return (
    <>
      <ContentHeader
        title="Beginner's Guide to Hadith"
        subtitle="Learning the Sunnah of the Prophet ﷺ, carefully and correctly"
        breadcrumbs={[
          { label: "Islamic Guides", href: "/guides" },
          { label: "Hadith" },
        ]}
      />

      <section className="max-w-6xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        {/* Intro */}
        <div className="bg-teal-100 rounded-2xl px-8 py-8 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-bold text-teal-900 mb-3 text-center font-[family-name:var(--font-playfair)]">
            What is Hadith?
          </h2>
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[19px] leading-[1.65] text-center">
            Hadith (الحديث) is a report of what the Prophet Muhammad ﷺ said,
            did, or silently approved. Together, the authentic hadith make up
            the Sunnah: the living example the Qur&apos;an itself commands us
            to follow. This guide walks you through what hadith is, how scholars
            check it, the great collections, and a realistic three-step path
            for studying it.
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

        {/* Parts of a hadith */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Link2 size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              The Parts of a Hadith
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Knowing these three parts lets you read any hadith book with
            understanding.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {partsOfHadith.map((p) => (
              <div
                key={p.title}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-baseline justify-between gap-3 mb-1 flex-wrap">
                  <h3 className="text-base font-bold text-teal-900">
                    {p.title}
                  </h3>
                  <span
                    className="font-[family-name:var(--font-amiri)] text-teal-700 text-xl"
                    dir="rtl"
                  >
                    {p.arabic}
                  </span>
                </div>
                <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider mb-3">
                  {p.english}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Grades of authenticity */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Scale size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Grades of Authenticity
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Hadith scholars developed precise categories to tell strong
            narrations from weak. Knowing them protects you from acting on
            something the Prophet ﷺ never said.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {authenticityGrades.map((g) => (
              <div
                key={g.name}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex flex-col"
              >
                <span
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${g.color} inline-block self-start mb-2`}
                >
                  {g.english}
                </span>
                <h3 className="text-base font-bold text-teal-900 mb-2">
                  {g.name}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed flex-1">
                  {g.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Six major books */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Layers size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              The Six Major Books (Kutub as-Sittah)
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Six foundational hadith collections compiled within 200 years of the
            Prophet&apos;s ﷺ passing. Together they form the core of the Sunni
            hadith tradition.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sixBooks.map((b, i) => (
              <div
                key={b.name}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex gap-4"
              >
                <div className="shrink-0 w-9 h-9 rounded-full bg-teal-900 text-white font-bold flex items-center justify-center text-sm">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-teal-900">
                    {b.name}
                  </h3>
                  <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider mb-2">
                    {b.author}
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {b.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Great scholars */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Users size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Great Muḥaddithūn
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            The scholars whose work preserved the Sunnah for us. Learning their
            names helps you trust the chain you are reading.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {muhaddithun.map((s) => (
              <div
                key={s.name}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <h3 className="text-base font-bold text-teal-900">{s.name}</h3>
                <p className="text-xs text-gray-400 mb-1">{s.years}</p>
                <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider mb-2">
                  {s.known}
                </p>
                <p className="text-sm text-gray-700">{s.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hadith is revelation callout */}
        <div className="mb-12 bg-teal-900 text-white rounded-2xl px-8 py-8 shadow-[0_4px_12px_rgba(0,0,0,0.12)] text-center">
          <p className="text-xl md:text-2xl font-bold font-[family-name:var(--font-playfair)] leading-tight mb-3">
            The Sunnah is not optional.
            <br />
            It is the <span className="text-teal-200">explanation</span> of the
            Qur&apos;an itself.
          </p>
          <p className="text-sm text-teal-100 max-w-2xl mx-auto leading-relaxed">
            The Qur&apos;an tells us to pray, but the Prophet ﷺ showed us how.
            The Qur&apos;an commands zakāh, but the Sunnah gives us the
            amounts. Rejecting the Sunnah is rejecting the very tool the
            Qur&apos;an uses to reach us.
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
            A realistic progression from your first 40 hadith to the full major
            collections, with time estimates, prerequisites, and specific books
            at each step.
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
            The pitfalls to know about in advance.
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

        {/* Verify before sharing callout */}
        <div className="mb-12 bg-teal-50 border-l-4 border-teal-700 rounded-2xl p-5 flex items-start gap-3">
          <Info size={20} className="text-teal-700 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-bold text-teal-900 mb-1">
              Verify before you share
            </h3>
            <p className="text-sm text-teal-900 leading-relaxed">
              The Prophet ﷺ said: &ldquo;Whoever narrates a lie against me, let
              him take his seat in the Fire.&rdquo; (Ṣaḥīḥ al-Bukhārī 110). If
              you are not sure a hadith is authentic, check it first. If you
              cannot verify it, stay silent. Attributing something false to the
              Prophet ﷺ is one of the gravest of sins.
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
