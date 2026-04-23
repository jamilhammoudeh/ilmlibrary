import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import {
  BookOpen,
  Play,
  Globe,
  ArrowRight,
  GraduationCap,
  Layers,
  Users,
  HelpCircle,
  Compass,
  Columns,
  Scale,
} from "lucide-react";

const tafsirBooks = [
  { title: "Tafsir Ibn Kathir Volume 1-10", slug: "tafsir-ibn-kathir-volume-1-10-571" },
  { title: "Tafseer As Sadi Vol. 1 Juz 1-3", slug: "tafseer-as-sadi-vol-1-juz-1-3-577" },
  { title: "Tafseer As Sadi Vol. 2 Juz 4-6", slug: "tafseer-as-sadi-vol-2-juz-4-6-578" },
  { title: "Tafseer As Sadi Vol. 3 Juz 7-9", slug: "tafseer-as-sadi-vol-3-juz-7-9-579" },
  { title: "Tafseer As Sadi Vol. 4 Juz 10-12", slug: "tafseer-as-sadi-vol-4-juz-10-12-580" },
  { title: "Tafseer As Sadi Vol. 5 Juz 13-15", slug: "tafseer-as-sadi-vol-5-juz-13-15-581" },
  { title: "Tafseer As Sadi Vol. 6 Juz 16-18", slug: "tafseer-as-sadi-vol-6-juz-16-18-583" },
  { title: "Tafseer As Sadi Vol. 7 Juz 19-21", slug: "tafseer-as-sadi-vol-7-juz-19-21-584" },
  { title: "Tafseer As Sadi Vol. 8 Juz 22-24", slug: "tafseer-as-sadi-vol-8-juz-22-24-585" },
  { title: "Tafseer As Sadi Vol. 9 Juz 25-27", slug: "tafseer-as-sadi-vol-9-juz-25-27-586" },
  { title: "Tafseer As Sadi Vol. 10 Juz 28-30", slug: "tafseer-as-sadi-vol-10-juz-28-30-587" },
  { title: "Tafsir al-Qurtubi Vol. 1", slug: "tafsir-al-qurtubi-vol-1-588" },
  { title: "Tafsir al-Qurtubi Vol. 2", slug: "tafsir-al-qurtubi-vol-2-589" },
  { title: "Tafsir al-Qurtubi Vol. 3", slug: "tafsir-al-qurtubi-vol-3-590" },
  { title: "Tafsir al-Qurtubi Vol. 4", slug: "tafsir-al-qurtubi-vol-4-591" },
];

const motivation = [
  {
    text: "A Book which We have revealed to you, full of blessings, so that they may ponder over its verses, and that those of understanding may be reminded.",
    source: "Surah Sad 38:29",
  },
  {
    text: "Do they not reflect on the Quran? Or are there locks upon their hearts?",
    source: "Surah Muhammad 47:24",
  },
  {
    text: "The best among you are those who learn the Quran and teach it.",
    source: "Sahih al-Bukhari 5027",
  },
];

const typesOfTafseer = [
  {
    name: "Tafseer bil-Ma'thur",
    subtitle: "Tafseer by transmitted narration",
    description:
      "Explaining the Quran through the Quran itself, the Sunnah of the Prophet ﷺ, and the statements of the Companions and Tabi'in. This is the most authoritative method.",
    examples: ["Tafsir at-Tabari", "Tafsir Ibn Kathir", "Tafsir al-Baghawi"],
  },
  {
    name: "Tafseer bil-Ra'y",
    subtitle: "Tafseer by reasoned opinion",
    description:
      "Explaining the Quran using ijtihad grounded in authentic knowledge: Arabic language, context of revelation, usool al-fiqh, and established principles. Acceptable when rooted in tradition, rejected when speculative.",
    examples: ["Tafsir al-Qurtubi (blended)", "Tafsir ar-Razi", "Tafsir al-Baydawi"],
  },
  {
    name: "Tafseer bil-Ishari",
    subtitle: "Indicative or spiritual tafseer",
    description:
      "Drawing out subtle spiritual meanings beyond the apparent text. Accepted by scholars only when it does not contradict the clear meaning and is treated as a reflection rather than a definitive explanation.",
    examples: ["Used cautiously by scholars, not a primary source"],
  },
];

const usoolPrinciples = [
  {
    step: "1",
    title: "The Quran explains the Quran",
    detail:
      "The clearest tafseer of a verse is found in another verse. What is summarized in one place is often detailed elsewhere.",
  },
  {
    step: "2",
    title: "The Sunnah explains the Quran",
    detail:
      "The Prophet ﷺ was sent to clarify the Book. His statements, actions, and approvals are the second source of tafseer.",
  },
  {
    step: "3",
    title: "The Companions' understanding",
    detail:
      "They witnessed the revelation, knew the context, and spoke classical Arabic natively. Ibn Abbas, Ibn Mas'ud, and Ali رضي الله عنهم are the foremost.",
  },
  {
    step: "4",
    title: "The Tabi'in's understanding",
    detail:
      "Students of the Companions like Mujahid, Qatadah, and al-Hasan al-Basri. Their tafseer is accepted when they agree, and weighed carefully when they differ.",
  },
  {
    step: "5",
    title: "The Arabic language",
    detail:
      "The Quran was revealed in clear Arabic. Classical poetry, grammar, and rhetoric are used to understand word meanings, idioms, and style.",
  },
];

const bookGuidance = [
  {
    name: "Tafseer As-Sa'di",
    level: "Beginner",
    levelColor: "bg-emerald-100 text-emerald-900",
    author: "Shaykh Abd al-Rahman as-Sa'di (d. 1376 AH)",
    best: "First-time readers and daily study",
    description:
      "Concise, clear, and focused on the lessons and guidance of each passage. Written in an easy style without heavy technical discussion. Perfect for someone who wants to understand the Quran page by page.",
    strengths: [
      "Easy to read, no Arabic grammar background needed",
      "Focuses on practical lessons and guidance",
      "Organized verse by verse, cover to cover",
    ],
    slug: "tafseer-as-sadi-vol-1-juz-1-3-577",
  },
  {
    name: "Tafsir Ibn Kathir",
    level: "Intermediate",
    levelColor: "bg-amber-100 text-amber-900",
    author: "Imam Ibn Kathir (d. 774 AH)",
    best: "Students wanting the classical narration-based method",
    description:
      "The gold standard of Tafseer bil-Ma'thur. Explains each verse using other verses, hadith, and statements of the Companions. Longer and more detailed than As-Sa'di.",
    strengths: [
      "Rich in authentic hadith and narrations",
      "Shows how verses explain each other",
      "The most widely taught classical tafseer in Sunni tradition",
    ],
    slug: "tafsir-ibn-kathir-volume-1-10-571",
  },
  {
    name: "Tafsir al-Qurtubi",
    level: "Advanced",
    levelColor: "bg-rose-100 text-rose-900",
    author: "Imam al-Qurtubi (d. 671 AH)",
    best: "Readers interested in rulings (ahkam) and fiqh",
    description:
      "A massive, jurisprudence-focused tafseer titled Al-Jami' li-Ahkam al-Quran. Every verse with legal implications is explored in depth, with scholarly opinions from all four madhahib and beyond.",
    strengths: [
      "Exhaustive treatment of verses on ahkam (rulings)",
      "Surveys differences of opinion across madhahib",
      "Strong in Arabic grammar and qira'at (variant readings)",
    ],
    slug: "tafsir-al-qurtubi-vol-1-588",
  },
];

const comparisonRows = [
  {
    label: "Level",
    sadi: "Beginner",
    kathir: "Intermediate",
    qurtubi: "Advanced",
  },
  {
    label: "Length",
    sadi: "~1 volume (concise)",
    kathir: "10 volumes",
    qurtubi: "20+ volumes (abridged to 4 in English)",
  },
  {
    label: "Primary focus",
    sadi: "Guidance & benefits",
    kathir: "Narration-based (hadith, Salaf)",
    qurtubi: "Rulings (ahkam) & fiqh",
  },
  {
    label: "Language difficulty",
    sadi: "Simple & direct",
    kathir: "Moderate",
    qurtubi: "Dense & technical",
  },
  {
    label: "Arabic needed?",
    sadi: "Not required",
    kathir: "Helpful",
    qurtubi: "Strongly recommended",
  },
  {
    label: "Use it for",
    sadi: "Daily reading",
    kathir: "Deep study",
    qurtubi: "Research & legal questions",
  },
  {
    label: "Typical reader",
    sadi: "Layperson or new student",
    kathir: "Serious student of knowledge",
    qurtubi: "Scholar or jurisprudence student",
  },
];

const sampleVerse = {
  reference: "Surah Al-Fatihah 1:6",
  arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
  translation: "Guide us to the straight path.",
  tafaseer: [
    {
      name: "As-Sa'di",
      slug: "tafseer-as-sadi-vol-1-juz-1-3-577",
      angle: "Practical & concise",
      excerpt:
        "The 'straight path' is the clear road that leads to Allah and to His Paradise: knowledge of the truth and acting upon it. We ask Allah for guidance to it and firmness on it until we meet Him, since our hearts turn and no one can hold them firm except Him.",
    },
    {
      name: "Ibn Kathir",
      slug: "tafsir-ibn-kathir-volume-1-10-571",
      angle: "Narration-based",
      excerpt:
        "The mufassirun from the Companions and Tabi'in explained the 'straight path' as the Book of Allah, Islam, the path of the Prophet ﷺ and those with him, and the path of Abu Bakr and Umar. All of these are correct; they describe the same reality from different angles, as narrated by Ibn Abbas, Ibn Mas'ud, and others.",
    },
    {
      name: "Al-Qurtubi",
      slug: "tafsir-al-qurtubi-vol-1-588",
      angle: "Linguistic & juristic",
      excerpt:
        "Linguistically, 'siraat' means a wide, clear road, derived from the root meaning 'to swallow,' because it takes in travelers. The scholars discuss the variant readings of the word and its grammatical form, and conclude that the 'straight path' is Islam in its entirety: the beliefs, the acts, and the path of the Salaf.",
    },
  ],
};

const famousMufassirun = [
  {
    name: "Imam at-Tabari",
    years: "224–310 AH",
    known: "The father of tafseer",
    note: "Author of Jami' al-Bayan, the earliest comprehensive tafseer that preserved the statements of the Salaf. Nearly every later mufassir draws from him.",
  },
  {
    name: "Imam Ibn Kathir",
    years: "701–774 AH",
    known: "Student of Ibn Taymiyyah",
    note: "A hadith master and historian. His tafseer is famous for carefully selecting authentic narrations and interpreting the Quran by the Quran and Sunnah.",
  },
  {
    name: "Imam al-Qurtubi",
    years: "c. 600–671 AH",
    known: "Master of ahkam al-Quran",
    note: "Andalusian Maliki scholar. His tafseer is the reference for legal implications of verses, quoting extensively across all schools of thought.",
  },
  {
    name: "Shaykh As-Sa'di",
    years: "1307–1376 AH",
    known: "The teacher of clear tafseer",
    note: "Najdi scholar from the modern era. His Taysir al-Karim al-Rahman is celebrated for simple language and drawing out practical benefits from each verse.",
  },
  {
    name: "Shaykh Ash-Shinqiti",
    years: "1325–1393 AH",
    known: "Master of 'Quran by Quran'",
    note: "Author of Adwa' al-Bayan, a monumental tafseer dedicated to explaining each verse using other verses. The purest expression of the first principle of usool at-tafseer.",
  },
];

const externalTools = [
  {
    name: "Quran.com",
    url: "https://quran.com",
    description:
      "Read the Quran online with multiple English translations and tafseer (Ibn Kathir, Ma'arif ul-Qur'an, and more) displayed beneath each verse.",
  },
  {
    name: "Tafsirq.com",
    url: "https://www.tafsirq.com",
    description:
      "Browse the Quran alongside Ibn Kathir, As-Sa'di, Tanwir al-Miqbas, and Muyassar, side by side.",
  },
  {
    name: "Altafsir.com",
    url: "https://www.altafsir.com",
    description:
      "One of the largest online tafseer collections, including classical and modern works across multiple languages.",
  },
  {
    name: "Bayyinah TV",
    url: "https://bayyinah.tv",
    description:
      "Video tafseer and Arabic language courses by Shaykh Nouman Ali Khan. Subscription-based with some free content.",
  },
];

const faq = [
  {
    q: "Do I need to know Arabic to benefit from tafseer?",
    a: "No. Solid English translations of classical tafaseer (like As-Sa'di and Ibn Kathir) make the core meanings accessible. That said, even basic Arabic dramatically deepens your understanding. Many verses turn on a word, a grammatical form, or a rhetorical device that translation flattens.",
  },
  {
    q: "Which tafseer should I read first?",
    a: "Start with Tafseer As-Sa'di. It is concise, clearly written, and focused on guidance rather than technical debates. Once you've worked through it, move to Ibn Kathir for depth, and reference al-Qurtubi for verses with legal rulings.",
  },
  {
    q: "Can I trust tafseer videos on YouTube?",
    a: "Some are excellent, others are unreliable. Stick to teachers who cite classical sources, name the scholars they draw from, and do not push personal opinions as tafseer. When in doubt, cross-check what you hear against a classical written tafseer.",
  },
  {
    q: "Is it wrong to interpret the Quran on my own?",
    a: "Reflecting on the Quran (tadabbur) is encouraged for every Muslim. What is prohibited is declaring a meaning of a verse without knowledge. Reflect freely, but do not teach or assert interpretations that aren't grounded in the established tafseer tradition.",
  },
  {
    q: "Why do different tafaseer sometimes disagree?",
    a: "Most differences are complementary rather than contradictory; scholars emphasize different valid meanings, contexts, or linguistic possibilities. Where real disagreement exists, the ones closer to the Quran, Sunnah, and the Salaf are given precedence.",
  },
];

const relatedPages = [
  {
    href: "/quran/read",
    title: "Read the Quran",
    description: "Read the full Quran online alongside translation.",
  },
  {
    href: "/quran/memorization",
    title: "Memorization Guide",
    description: "A structured path from beginner to hafidh.",
  },
  {
    href: "/books/quran-studies",
    title: "Quran Studies Library",
    description: "Browse every Quran-related book in the library.",
  },
  {
    href: "/guides/quran-tafsir",
    title: "Tafsir Study Guide",
    description: "Step-by-step guide to studying tafseer seriously.",
  },
];

export const metadata = {
  title: "Tafseer",
  description:
    "Understand the Quran: a guide to tafseer, its methodology, the major scholars, and the best books to start with.",
};

export default function TafseerPage() {
  return (
    <>
      <ContentHeader
        title="Tafseer"
        breadcrumbs={[{ label: "Quran", href: "/quran" }, { label: "Study", href: "/quran/study" }, { label: "Tafseer" }]}
        subtitle="Understand the Quran: its meanings, methodology, and masters"
      />

      <section className="max-w-7xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        {/* What is Tafseer? intro block */}
        <div className="bg-teal-100 rounded-2xl px-8 py-8 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-bold text-teal-900 mb-3 text-center font-[family-name:var(--font-playfair)]">
            What is Tafseer?
          </h2>
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[19px] leading-[1.65] text-center">
            Tafseer (التفسير) is the science of explaining the meanings of the Quran: its
            vocabulary, context of revelation, rulings, and lessons. It is how the Ummah has
            preserved the understanding of the Book across fourteen centuries, rooted in the
            Prophet ﷺ, his Companions, and the scholars who followed them.
          </p>
        </div>

        {/* Motivation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-12">
          {motivation.map((m, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] border-l-4 border-teal-700"
            >
              <p className="text-gray-700 italic text-sm leading-relaxed">&ldquo;{m.text}&rdquo;</p>
              <p className="text-xs text-gray-400 mt-2">{m.source}</p>
            </div>
          ))}
        </div>

        {/* Types of Tafseer */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Layers size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Types of Tafseer
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Scholars classify tafseer into three broad approaches based on the source of
            explanation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {typesOfTafseer.map((type) => (
              <div
                key={type.name}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex flex-col"
              >
                <h3 className="text-base font-bold text-teal-900">{type.name}</h3>
                <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider mb-3">
                  {type.subtitle}
                </p>
                <p className="text-sm text-gray-700 mb-3 flex-1">{type.description}</p>
                <p className="text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">Examples: </span>
                  {type.examples.join(" • ")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Usool at-Tafseer */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Usool at-Tafseer
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            The classical method every reliable mufassir follows, in order of priority.
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
                  <h3 className="text-base font-bold text-teal-900 mb-1">{p.title}</h3>
                  <p className="text-gray-700 text-sm">{p.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Which book should I start with? */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Compass size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Which Book Should I Start With?
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            A comparison of the three tafaseer featured in our library.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bookGuidance.map((b) => (
              <div
                key={b.name}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex flex-col"
              >
                <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                  <h3 className="text-base font-bold text-teal-900">{b.name}</h3>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${b.levelColor}`}
                  >
                    {b.level}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-1">{b.author}</p>
                <p className="text-xs text-teal-700 font-semibold mb-3">
                  Best for: {b.best}
                </p>
                <p className="text-sm text-gray-700 mb-3">{b.description}</p>
                <ul className="space-y-1.5 mb-4 flex-1">
                  {b.strengths.map((s, j) => (
                    <li key={j} className="text-xs text-gray-600 flex items-start gap-2">
                      <span className="text-teal-700 mt-0.5 shrink-0">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/books/quran-studies/${b.slug}`}
                  className="inline-flex items-center gap-1 text-sm text-teal-700 hover:text-teal-900 font-semibold"
                >
                  Start reading <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Side-by-side comparison */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Scale size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Side-by-Side Comparison
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            The three featured tafaseer at a glance.
          </p>
          <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-teal-900 text-white">
                    <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">
                      &nbsp;
                    </th>
                    <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">
                      As-Sa&apos;di
                    </th>
                    <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">
                      Ibn Kathir
                    </th>
                    <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">
                      Al-Qurtubi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr
                      key={row.label}
                      className={i % 2 === 0 ? "bg-white" : "bg-teal-50/40"}
                    >
                      <td className="font-semibold text-teal-900 px-4 py-3 align-top whitespace-nowrap">
                        {row.label}
                      </td>
                      <td className="text-gray-700 px-4 py-3 align-top">
                        {row.sadi}
                      </td>
                      <td className="text-gray-700 px-4 py-3 align-top">
                        {row.kathir}
                      </td>
                      <td className="text-gray-700 px-4 py-3 align-top">
                        {row.qurtubi}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* See them in action, side-by-side on one verse */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Columns size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              See Them in Action
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            How each mufassir approaches the same verse.
          </p>

          <div className="bg-teal-100 rounded-2xl px-6 py-6 mb-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-center">
            <p className="text-xs uppercase tracking-wider text-teal-700 font-semibold mb-2">
              {sampleVerse.reference}
            </p>
            <p
              className="font-[family-name:var(--font-amiri)] text-teal-900 text-[28px] leading-[1.7] mb-3"
              dir="rtl"
            >
              {sampleVerse.arabic}
            </p>
            <p className="text-teal-900 italic text-sm">
              &ldquo;{sampleVerse.translation}&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sampleVerse.tafaseer.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex flex-col"
              >
                <h3 className="text-lg font-bold text-teal-900">{t.name}</h3>
                <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider mb-3">
                  {t.angle}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed flex-1">
                  {t.excerpt}
                </p>
                <Link
                  href={`/books/quran-studies/${t.slug}`}
                  className="inline-flex items-center gap-1 text-sm text-teal-700 hover:text-teal-900 font-semibold mt-4"
                >
                  Read more <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-4 text-center italic">
            Summaries paraphrased from the respective tafaseer. Consult the full text for
            complete discussion.
          </p>
        </div>

        {/* Tafseer Books library */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Tafseer Books in the Library
            </h2>
          </div>
          <p className="text-gray-500 mb-4">
            All volumes are available in the{" "}
            <Link
              href="/books/quran-studies"
              className="text-teal-700 hover:text-teal-900 font-semibold"
            >
              Quran Studies
            </Link>{" "}
            section.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tafsirBooks.map((book) => (
              <Link
                key={book.slug}
                href={`/books/quran-studies/${book.slug}`}
                className="group bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200 flex items-start gap-3"
              >
                <BookOpen size={18} className="text-teal-700 mt-0.5 shrink-0" />
                <span className="text-sm font-medium text-gray-900 group-hover:text-teal-700 transition-colors duration-200">
                  {book.title}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Famous Mufassirun */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Users size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Famous Mufassirun
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            The scholars whose works shaped the tafseer tradition.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {famousMufassirun.map((s) => (
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

        {/* Further Resources: video + websites side by side */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Further Resources
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Video playlists and online tools for reading tafseer alongside the Arabic text.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="https://youtube.com/playlist?list=PL2dRQaGGWZOBYkqSWcfhzetBvPKOUFkf4&si=MI14xUeNYNkQltez"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-1">
                <Play size={16} className="text-teal-700 shrink-0" />
                <h3 className="text-base font-bold text-teal-900 group-hover:text-teal-700 transition-colors duration-200">
                  Al Madrasatu Al Umariyyah
                </h3>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Long-form video tafseer playlist on YouTube.
              </p>
            </a>
            {externalTools.map((t) => (
              <a
                key={t.name}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Globe size={16} className="text-teal-700 shrink-0" />
                  <h3 className="text-base font-bold text-teal-900 group-hover:text-teal-700 transition-colors duration-200">
                    {t.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">{t.description}</p>
              </a>
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
                <p className="text-gray-700 text-sm mt-3 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Related pages */}
        <div>
          <h2 className="text-2xl font-bold text-teal-900 mb-6 font-[family-name:var(--font-playfair)]">
            Continue Learning
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedPages.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-bold text-teal-900 group-hover:text-teal-700 transition-colors duration-200">
                    {r.title}
                  </h3>
                  <ArrowRight
                    size={18}
                    className="text-teal-700 group-hover:translate-x-1 transition-transform duration-200 shrink-0"
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
