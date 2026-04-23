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
  Heart,
  Calendar,
  Users,
} from "lucide-react";

const motivation = [
  {
    text: "There has certainly been for you in the Messenger of Allah an excellent example for whoever hopes in Allah and the Last Day and remembers Allah often.",
    source: "Surah Al-Ahzab 33:21",
  },
  {
    text: "Say: If you love Allah, then follow me; Allah will love you and forgive you your sins.",
    source: "Surah Aal-Imran 3:31",
  },
  {
    text: "None of you truly believes until I am more beloved to him than his father, his child, and all of mankind.",
    source: "Sahih al-Bukhari 15, Sahih Muslim 44",
  },
];

const whyStudy = [
  {
    title: "To know him is to love him",
    description:
      "Loving the Prophet ﷺ is a condition of faith, and love grows with knowledge. Studying his life, his kindness, his patience, his worship, and his sacrifice builds a real connection, not just a name you hear in prayer.",
  },
  {
    title: "It is the Qur'an, lived",
    description:
      "When Aisha رضي الله عنها was asked about the character of the Prophet ﷺ, she said: 'His character was the Qur'an.' Studying his seerah is studying the Qur'an in action: how he prayed, forgave, led, and endured hardship.",
  },
  {
    title: "It explains the Qur'an itself",
    description:
      "Many verses were revealed about specific events: Badr, Uhud, Hudaybiyyah, the migration. Without the seerah, the context behind these verses is missing. Seerah and tafsir are closely connected.",
  },
];

const phases = [
  {
    year: "Before 610 CE",
    period: "Early Life",
    title: "Birth and youth in Makkah",
    description:
      "Born in the Year of the Elephant, orphaned young, raised by his grandfather ʿAbd al-Muṭṭalib and then his uncle Abu Ṭālib. Worked as a shepherd and a merchant. Known among his people as al-Ṣādiq al-Amīn (the truthful, the trustworthy) long before revelation came.",
  },
  {
    year: "610 to 622 CE",
    period: "Makkan Period (13 years)",
    title: "The call in Makkah",
    description:
      "Revelation began at age 40 in the cave of Ḥirāʾ. The early years were a quiet, private call; then a public one. This period is about patience under persecution, the foundations of tawḥīd, and the building of the first community of believers in the face of harsh opposition.",
  },
  {
    year: "622 CE / 1 AH",
    period: "The Hijrah",
    title: "Migration to Madinah",
    description:
      "The migration from Makkah to Madinah marks the beginning of the Islamic calendar. It was not just a geographic move but a transition from a persecuted community to an established one, with the Prophet ﷺ as its leader.",
  },
  {
    year: "1 to 11 AH",
    period: "Madinan Period (10 years)",
    title: "The community in Madinah",
    description:
      "Building the first mosque, the treaty with the Jewish tribes and the Constitution of Madinah, the major battles (Badr, Uḥud, the Trench), the treaty of Ḥudaybiyyah, and the opening of Makkah. Most Qur'anic rulings on worship, social life, and governance came down during this period.",
  },
  {
    year: "10 AH / 632 CE",
    period: "Farewell Pilgrimage",
    title: "The final Hajj and sermon",
    description:
      "The Prophet ﷺ performed his one and only Hajj, delivering the famous Farewell Sermon to over 100,000 Companions. Its themes, sanctity of life, rights of women, the end of tribal vendettas, and clinging to the Qur'an and Sunnah, are its own lasting guidance.",
  },
  {
    year: "11 AH / 632 CE",
    period: "The Passing",
    title: "The death of the Prophet ﷺ",
    description:
      "He passed away in Madinah, in the house of Aisha رضي الله عنها. His last instructions centered on prayer and the treatment of the weak. The grief of the Companions and the wisdom of Abu Bakr رضي الله عنه in that moment is a lesson of its own.",
  },
];

const methodPillars = [
  {
    step: "1",
    title: "Use authenticated sources",
    detail:
      "Classical seerah works (Ibn Isḥāq through Ibn Hishām, al-Wāqidī, Ibn Saʿd, al-Ṭabarī) combine authentic and weaker reports. Modern works like Ar-Raḥīq al-Makhtūm (The Sealed Nectar) filter the content. Start with a verified modern work before diving into classical ones.",
  },
  {
    step: "2",
    title: "Follow the timeline in order",
    detail:
      "The Makkan period teaches patience and foundations of belief. The Madīnan period teaches leadership, community, and law. Studying them out of order loses the lessons baked into the sequence.",
  },
  {
    step: "3",
    title: "Connect events to the Qur'an",
    detail:
      "Many sūrahs and verses were revealed about specific events. When you read about a battle or moment in the seerah, check which verses came down about it. This deepens both your seerah and your tafsir.",
  },
  {
    step: "4",
    title: "Draw lessons, not just facts",
    detail:
      "The goal is not to memorize dates. It is to extract how the Prophet ﷺ handled hardship, success, betrayal, victory, grief, and everyday life, and to bring those lessons into your own life.",
  },
  {
    step: "5",
    title: "Study with love and reverence",
    detail:
      "The seerah is not just history. It is the life of the beloved ﷺ. Send salawat upon him often while studying. Let the events move you. Let his patience correct your impatience and his mercy correct your harshness.",
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
  videos: { title: string; url: string }[];
  tip: string;
};

const levels: Level[] = [
  {
    level: "Beginner",
    levelColor: "bg-emerald-100 text-emerald-900",
    intro:
      "Start with a short, verified biography that covers the whole life from birth to passing. The goal is to get the complete arc in one reading, before going deeper into any one period.",
    duration: "2 to 4 months",
    before: "No prior knowledge needed. Just willingness to read consistently.",
    whatYoullLearn: [
      "The complete life of the Prophet ﷺ from birth to passing",
      "The major events of the Makkan and Madīnan periods",
      "The names of his family, closest Companions, and wives رضي الله عنهم",
      "How specific Qur'anic verses relate to events of his life",
    ],
    afterThis:
      "You will know the full story and be able to follow deeper discussions of specific events.",
    books: [
      {
        title: "Abridged Biography of Prophet Muhammad ﷺ",
        description:
          "A concise, reliable summary of the Prophet's life. The ideal starting point for readers new to seerah.",
        href: "/books/islamic-history/abridged-biography-of-prophet-muhammad-1776672919106-20j",
      },
      {
        title: "The Sealed Nectar (Ar-Raḥīq al-Makhtūm)",
        description:
          "The most widely read modern seerah in English, by Shaykh Ṣafī ar-Raḥmān al-Mubārakpūrī. Winner of the first-prize in a world seerah competition. Covers the full life with authentic sources.",
        href: "/books/islamic-history/the-sealed-nectar-1776672912165-2x4",
      },
    ],
    videos: [],
    tip: "Read one chapter per day. Pause to reflect on what the Prophet ﷺ did in each situation and what you would have done.",
  },
  {
    level: "Intermediate",
    levelColor: "bg-amber-100 text-amber-900",
    intro:
      "Once you know the full story, go deeper into specific events and people. This is where the lessons really start to land.",
    duration: "6 to 12 months",
    before:
      "Finish a complete seerah (like The Sealed Nectar) at least once. You should be able to name the major battles and periods without looking them up.",
    whatYoullLearn: [
      "Detailed study of key events like the Hijrah, Badr, Uḥud, and Ḥudaybiyyah",
      "The miracles and distinctions given to the Prophet ﷺ",
      "The Mothers of the Believers (his wives رضي الله عنهن)",
      "The Isrāʾ wal-Miʿrāj (Night Journey and Ascension)",
    ],
    afterThis:
      "You will have a three-dimensional picture of the Prophet's ﷺ life, his household, and his Companions.",
    books: [
      {
        title: "Explanation of Six Events from the Prophetic Seerah",
        description:
          "Careful, verse-by-hadith analysis of six major events. Excellent for deepening your understanding of specific turning points.",
        href: "/books/islamic-history/explanation-of-six-events-from-the-prophetic-seera-1776672912959-id9",
      },
      {
        title: "Al-Isrā' wal-Miʿrāj: The Night Journey and Ascension",
        description:
          "A focused study of one of the most miraculous events of the seerah, with its Qur'anic and prophetic evidences.",
        href: "/books/islamic-history/al-isra-wa-al-miraj-the-night-journey-ascension-of-1776672923754-d7w",
      },
      {
        title: "Miracles & Merits of Allah's Messenger ﷺ",
        description:
          "A collection of the authentic miracles and unique qualities given to the Prophet ﷺ by Allah.",
        href: "/books/islamic-history/miracles-merits-of-allah-s-messenger-1776672921538-yag",
      },
      {
        title: "Our Role Models: The Mothers of the Believers",
        description:
          "A study of the wives of the Prophet ﷺ, their status, their character, and what we learn from them.",
        href: "/books/islamic-history/our-role-models-the-mothers-of-the-believers-1776672920065-lgt",
      },
    ],
    videos: [],
    tip: "Pair each event with its related Qur'anic verses. This ties your seerah study directly to your Qur'an reading.",
  },
  {
    level: "Advanced",
    levelColor: "bg-rose-100 text-rose-900",
    intro:
      "Classical Arabic and English-translated sources. Ideally studied with a teacher so you can weigh reports correctly.",
    duration: "Years, often a lifetime",
    before:
      "Solid working knowledge of the seerah and comfort reading older English translations. Familiarity with basic ḥadīth sciences is very helpful.",
    whatYoullLearn: [
      "Classical historical methodology and how scholars weigh reports",
      "The broader context: pre-Islamic Arabia, neighboring empires, and early history",
      "How later scholars like al-Ṭabarī compiled and arranged seerah material",
      "The lives of the closest Companions in depth",
    ],
    afterThis:
      "You will be able to read and evaluate most seerah and early Islamic history works confidently.",
    books: [
      {
        title: "The History of al-Ṭabarī Vol. 1: General Introduction and From the Creation to the Flood",
        description:
          "The opening volume of Imam al-Ṭabarī's monumental history. Sets the framework for his classical approach.",
        href: "/books/islamic-history/the-history-of-al-tabari-vol-1-general-introductio-1776672925018-plk",
      },
      {
        title: "The History of al-Ṭabarī Vol. 2: Prophets and Patriarchs",
        description:
          "The stories of the earlier prophets from ʿĀdam to the era before Ibrāhīm. Sets the prophetic line the Prophet ﷺ was sent to complete.",
        href: "/books/islamic-history/the-history-of-al-tabari-vol-2-prophets-and-patria-1776672925189-0o9",
      },
      {
        title: "Biographies of the Four Rightly-Guided Caliphs",
        description:
          "Study the lives of Abu Bakr, ʿUmar, ʿUthmān, and ʿAlī رضي الله عنهم alongside the seerah for a complete picture of the Prophet's closest circle.",
        href: "/books/islamic-history",
      },
    ],
    videos: [],
    tip: "Advanced seerah is best paired with a teacher who can help you weigh classical reports. If working alone, stick to editions with modern editorial notes.",
  },
];

const keyPeople = [
  {
    group: "His family (parents and guardians)",
    members:
      "ʿAbdullāh (father, passed before his birth), Āminah (mother, passed when he was young), ʿAbd al-Muṭṭalib (grandfather), Abu Ṭālib (uncle), Ḥalīmah as-Saʿdiyyah (wet-nurse)",
  },
  {
    group: "His wives رضي الله عنهن",
    members:
      "Khadījah bint Khuwaylid (his first wife, mother of his children, the first believer), ʿĀʾishah bint Abī Bakr, Ḥafṣah, Umm Salamah, Zaynab bint Jaḥsh, and others. Known together as the Mothers of the Believers.",
  },
  {
    group: "His children",
    members:
      "Al-Qāsim, Zaynab, Ruqayyah, Umm Kulthūm, Fāṭimah, ʿAbdullāh, and Ibrāhīm رضي الله عنهم. Most passed during his lifetime.",
  },
  {
    group: "The earliest believers",
    members:
      "Khadījah (from among women), Abu Bakr (from among men), ʿAlī ibn Abī Ṭālib (from among youth), Zayd ibn Ḥārithah (his freed slave). Most of the early community faced severe persecution.",
  },
  {
    group: "Major Companions رضي الله عنهم",
    members:
      "The Four Rightly-Guided Caliphs: Abu Bakr, ʿUmar, ʿUthmān, and ʿAlī. Also Ḥamzah, Bilāl, Salmān al-Fārisī, Muʿādh ibn Jabal, Ibn Masʿūd, Ibn ʿAbbās, Abu Hurayrah, and many others whose narrations fill the books of Islam.",
  },
  {
    group: "The Anṣār of Madinah",
    members:
      "The believers of Madinah from the tribes of Aws and Khazraj who took the Prophet ﷺ in after the Hijrah. Known for their sacrifice and their love for their Muhājir brothers.",
  },
];

const commonMistakes = [
  {
    problem:
      "Using popular but unverified seerah stories",
    solution:
      "A lot of widely shared seerah anecdotes online are from weak or fabricated sources. Stick with verified works like The Sealed Nectar. If you read something striking, check the source before sharing.",
  },
  {
    problem: "Treating the Prophet ﷺ as only a historical figure",
    solution:
      "The seerah is history, but for a Muslim it is also a living example. Study with the intention of loving him more, not just knowing more about him. Send ṣalawāt upon him often while reading.",
  },
  {
    problem: "Skipping or rushing the Makkan period",
    solution:
      "The 13 years in Makkah were mostly about patience, tawḥīd, and character. These lessons are foundational. Many modern readers skip ahead to the battles; do not. Go chapter by chapter.",
  },
  {
    problem: "Reading seerah disconnected from the Qur'an",
    solution:
      "Many surahs were revealed about specific events of the seerah. Read them alongside each other. A good tafsir like As-Saʿdī or Ibn Kathīr will mention the relevant event at each verse.",
  },
  {
    problem: "Judging 7th-century events by 21st-century assumptions",
    solution:
      "Read the seerah within its own context: the pre-Islamic Arab world, the tribal structures, the political realities. Modern assumptions about geography, politics, and social life often do not apply. Let the seerah speak on its own terms.",
  },
  {
    problem: "Getting pulled into debates about the Companions",
    solution:
      "Classical Ahl as-Sunnah adab is to speak of the Companions رضي الله عنهم with respect and to leave what happened between some of them to Allah. Focus on the Prophet's ﷺ life with them, not on later controversies.",
  },
];

const faq = [
  {
    q: "Which seerah book should I start with?",
    a: "Start with The Sealed Nectar (Ar-Raḥīq al-Makhtūm) by Shaykh al-Mubārakpūrī. It is widely available in English, written in clear language, and sticks to verified sources. If you want something even shorter first, the Abridged Biography of Prophet Muhammad ﷺ is a solid option.",
  },
  {
    q: "How long does it take to finish a seerah book?",
    a: "The Sealed Nectar is about 500 pages. At a chapter a day, most readers finish it in 2 to 4 months. Do not rush. Reflect on each chapter before moving on. Going slowly with reflection beats rushing through.",
  },
  {
    q: "Do I need to know Arabic?",
    a: "No. There are excellent English seerah works. That said, knowing Arabic or even basic Qur'anic terms helps you understand references to Qur'anic verses, Arabic names, and Islamic concepts that come up throughout.",
  },
  {
    q: "Are all the popular seerah stories true?",
    a: "No. Many circulating stories, especially on social media, come from weak or fabricated reports. Classical and modern scholarly seerah works separate authentic from inauthentic material. When in doubt, check the source. If you cannot verify it, do not spread it.",
  },
  {
    q: "Why send ṣalawāt while studying?",
    a: "Allah has commanded the believers to send salutations upon the Prophet ﷺ (Al-Aḥzāb 33:56), and the more you learn about him, the more love you will have for him. Ṣalawāt is an act of worship with great reward and it keeps the heart connected while you study.",
  },
  {
    q: "What is the Hijrah and why is it so important?",
    a: "The Hijrah was the migration of the Prophet ﷺ and the Muslims from Makkah to Madinah in 622 CE. It marked the transition from a persecuted community to an established one, and from then on the Islamic calendar begins. It is celebrated not as a retreat, but as a strategic turning point that allowed Islam to flourish.",
  },
];

const related = [
  {
    href: "/guides",
    title: "All Islamic Guides",
    description: "Browse every guide on the site.",
  },
  {
    href: "/books/islamic-history",
    title: "Islamic History Library",
    description: "Every seerah and history book in our library.",
  },
  {
    href: "/guides/quran-tafsir",
    title: "Qur'an Tafsir Guide",
    description: "Study the Qur'an alongside the life of the Prophet ﷺ.",
  },
  {
    href: "/guides/aqeedah",
    title: "Aqeedah Guide",
    description: "The creed that the Prophet ﷺ lived and taught.",
  },
];

export const metadata = {
  title: "Beginner's Guide to Seerah",
  description:
    "A careful, step-by-step path to studying the life of the Prophet Muhammad ﷺ: why, how, and with which books.",
};

export default function SeerahGuidePage() {
  return (
    <>
      <ContentHeader
        title="Beginner's Guide to Seerah"
        subtitle="The life of the Prophet Muhammad ﷺ, studied carefully"
        breadcrumbs={[
          { label: "Islamic Guides", href: "/guides" },
          { label: "Seerah" },
        ]}
      />

      <section className="max-w-6xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        {/* Intro */}
        <div className="bg-teal-100 rounded-2xl px-8 py-8 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-bold text-teal-900 mb-3 text-center font-[family-name:var(--font-playfair)]">
            What is Seerah?
          </h2>
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[19px] leading-[1.65] text-center">
            Seerah (السيرة) is the life story of the Prophet Muhammad ﷺ: his
            birth, character, struggles in Makkah, migration to Madinah, battles,
            teachings, and passing. It is not just biography. It is the Qur'an
            in action, and the living model for how a Muslim should believe and
            behave. This guide shows you what to study, how to study it, and
            which books to start with.
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

        {/* Why study */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Heart size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Why Study the Seerah?
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Three clear reasons every Muslim, new or lifelong, benefits from
            seerah study.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {whyStudy.map((w) => (
              <div
                key={w.title}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <h3 className="text-base font-bold text-teal-900 mb-2">
                  {w.title}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {w.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Phases timeline */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              The Phases of His Life ﷺ
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            A high-level timeline to orient you before you open any book.
          </p>
          <div className="space-y-3">
            {phases.map((p, i) => (
              <div
                key={p.year}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex gap-4 items-start"
              >
                <div className="shrink-0 flex flex-col items-center w-24">
                  <span className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider mb-1">
                    Phase {i + 1}
                  </span>
                  <div className="bg-teal-900 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    {p.year}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider">
                    {p.period}
                  </p>
                  <h3 className="text-base font-bold text-teal-900 mb-1">
                    {p.title}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Method pillars */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Layers size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              How to Study Seerah Correctly
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Five principles that turn seerah reading from casual to
            transformative.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {methodPillars.map((p) => (
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

        {/* Respect callout */}
        <div className="mb-12 bg-teal-900 text-white rounded-2xl px-8 py-8 shadow-[0_4px_12px_rgba(0,0,0,0.12)] text-center">
          <p className="text-xl md:text-2xl font-bold font-[family-name:var(--font-playfair)] leading-tight mb-3">
            The seerah is history.
            <br />
            For a Muslim, it is also{" "}
            <span className="text-teal-200">a love story</span>.
          </p>
          <p className="text-sm text-teal-100 max-w-2xl mx-auto leading-relaxed">
            Study it with the intention of knowing him ﷺ more closely, not just
            collecting facts. Send ṣalawāt upon him often. Let the events move
            you. When his patience humbles your impatience, and his mercy
            softens your harshness, you are studying it correctly.
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
            A realistic progression from your first seerah to lifelong study,
            with time estimates, prerequisites, and the specific books at each
            step.
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

                {lvl.videos.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                      <Play size={14} className="text-teal-700" />
                      Lecture Series
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {lvl.videos.map((v) => (
                        <a
                          key={v.title}
                          href={v.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-full transition-colors duration-200"
                        >
                          <Play size={12} className="shrink-0" />
                          {v.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

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

        {/* Key people */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Users size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Key People to Know
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            A quick reference of the people whose names you will see throughout
            any seerah book.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {keyPeople.map((k) => (
              <div
                key={k.group}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <h3 className="text-sm font-bold text-teal-900 mb-2">
                  {k.group}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {k.members}
                </p>
              </div>
            ))}
          </div>
          <div className="bg-teal-50 border-l-4 border-teal-700 rounded-2xl p-4 mt-4 flex items-start gap-3">
            <Info size={16} className="text-teal-700 shrink-0 mt-0.5" />
            <p className="text-sm text-teal-900 leading-relaxed">
              Whenever the Companions رضي الله عنهم are mentioned, say{" "}
              <span className="font-semibold">
                &ldquo;raḍiyAllāhu ʿanhu&rdquo;
              </span>{" "}
              (may Allah be pleased with him) or its feminine form. For the
              Prophet ﷺ, always say ṣallallāhu ʿalayhi wa sallam (may Allah
              send blessings and peace upon him).
            </p>
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
            Every student of the seerah runs into these. Knowing them in advance
            protects your study and your adab.
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
