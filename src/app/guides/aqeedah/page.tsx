import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import {
  BookOpen,
  Play,
  ChevronRight,
  ArrowRight,
  Users,
  HelpCircle,
  Layers,
  Shield,
  AlertCircle,
  Info,
  Compass,
  ListChecks,
} from "lucide-react";

const motivation = [
  {
    text: "And your God is one God. There is no deity worthy of worship except Him, the Most Gracious, the Most Merciful.",
    source: "Surah Al-Baqarah 2:163",
  },
  {
    text: "Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent.",
    source: "Surah Al-Ikhlaas 112:1-4",
  },
  {
    text: "Whoever dies knowing that there is no true deity worthy of worship except Allah will enter Paradise.",
    source: "Sahih Muslim 26",
  },
];

const tawheedCategories = [
  {
    name: "Ar-Rubūbiyyah",
    arabic: "الربوبية",
    english: "Oneness of Lordship",
    plain: "Allah alone creates, provides, and controls everything.",
    description:
      "Believing that only Allah made everything, gives life, takes life away, provides for all creatures, and runs the whole universe. Nothing happens without His will. Even the idol-worshippers of Makkah agreed with this much, but agreeing to it alone was not enough to make them Muslims.",
    evidence:
      "Indeed, your Lord is Allah, who created the heavens and the earth in six days. (7:54)",
  },
  {
    name: "Al-Ulūhiyyah",
    arabic: "الألوهية",
    english: "Oneness of Worship",
    plain: "Worship goes to Allah alone, not to anyone or anything else.",
    description:
      "Every kind of worship, prayer, duʿāʾ (asking), fasting, sacrifice, love, fear, hope, reliance, goes only to Allah. Not to prophets, not to saints, not to graves, not to angels. This is the main message every prophet came with, and this is where most conflict between prophets and their people happened.",
    evidence:
      "We sent to every nation a messenger saying: Worship Allah and avoid false gods. (16:36)",
  },
  {
    name: "Al-Asmāʾ wa aṣ-Ṣifāt",
    arabic: "الأسماء والصفات",
    english: "Oneness of Names and Attributes",
    plain: "Believe in Allah's names and attributes the way He described Himself.",
    description:
      "Allah has names (like The Most Merciful, The All-Hearing, The All-Seeing) and attributes He described for Himself in the Qur'an and through His Prophet ﷺ. We believe in all of them exactly as they were revealed, without changing their meaning, denying them, asking 'how', or comparing Him to His creation.",
    evidence:
      "There is nothing like unto Him, and He is the All-Hearing, the All-Seeing. (42:11)",
  },
];

const shirkTypes = [
  {
    name: "Shirk Akbar",
    english: "Major Shirk",
    badge: "Takes a person out of Islam",
    badgeColor: "bg-rose-100 text-rose-900",
    description:
      "Directing any act of worship to someone other than Allah. Examples: praying to a grave or a saint, sacrificing an animal to other than Allah, or believing anyone shares His lordship. If someone dies on this without repenting, Allah has said in the Qur'an that He will not forgive it.",
  },
  {
    name: "Shirk Asghar",
    english: "Minor Shirk",
    badge: "Does not take out of Islam, but serious",
    badgeColor: "bg-amber-100 text-amber-900",
    description:
      "Smaller forms that are still very dangerous. Examples: riyāʾ (showing off in worship so people praise you), swearing by other than Allah, or saying 'what Allah willed and what you willed' instead of 'what Allah willed, then what you willed'. Does not remove someone from Islam, but must be avoided.",
  },
  {
    name: "Shirk Khafī",
    english: "Hidden Shirk",
    badge: "Often grouped under minor",
    badgeColor: "bg-purple-100 text-purple-900",
    description:
      "The inner, hidden forms of minor shirk, like secretly doing a deed to impress people or seeking anyone's pleasure before Allah's. The Prophet ﷺ warned it is hidden like a black ant on a black stone in the dark. Many scholars classify this as a type of Shirk Asghar.",
  },
];

const pillarsOfIman = [
  {
    num: "1",
    name: "Belief in Allah",
    detail:
      "That He exists, He alone is the Lord, He alone deserves worship, and He has the names and attributes He told us about in the Qur'an and through His Prophet ﷺ.",
  },
  {
    num: "2",
    name: "Belief in the Angels",
    detail:
      "Allah created angels from light. They never disobey Him and they carry out His commands. Examples: Jibreel, who brought revelation; Mikaeel, over rain; Israfeel, who will blow the horn.",
  },
  {
    num: "3",
    name: "Belief in the Books",
    detail:
      "Allah sent books to His messengers: the Scrolls of Ibrahim, the Tawrah (to Musa), the Zabūr (to Dawud), the Injeel (to Isa), and the Qur'an (to Muhammad ﷺ). The Qur'an is the final, unchanged revelation.",
  },
  {
    num: "4",
    name: "Belief in the Messengers",
    detail:
      "Every prophet Allah sent was a true messenger, starting with Adam and ending with Muhammad ﷺ, who is the seal of the prophets. No new prophet will come after him.",
  },
  {
    num: "5",
    name: "Belief in the Last Day",
    detail:
      "Death, the questioning in the grave, resurrection, the gathering, the judgement, Paradise, and Hell. Everything about what happens after this life.",
  },
  {
    num: "6",
    name: "Belief in Qadar (Divine Decree)",
    detail:
      "Everything that happens, the things we enjoy and the things we dislike, happens by Allah's knowledge and will. He wrote it, He willed it, He created it, and nothing is outside His knowledge.",
  },
];

const levels = [
  {
    level: "Beginner",
    levelColor: "bg-emerald-100 text-emerald-900",
    intro:
      "If you are just starting out, begin here. These short texts give you the essential beliefs every Muslim needs to know, in plain language.",
    duration: "2 to 4 months at a steady pace",
    before: "No prior knowledge needed. Arabic is helpful but not required.",
    whatYoullLearn: [
      "Who you are, what your religion is, and who your Prophet is (the three fundamental principles)",
      "What tawheed really means and the three categories",
      "What invalidates a person's Islam (the ten nullifiers)",
      "Four basic principles that help you spot shirk in its modern forms",
    ],
    afterThis:
      "You will have a solid base and be ready to study longer classics like Kitab at-Tawheed.",
    books: [
      {
        title: "Tawheed: Its Meaning & Categories",
        description:
          "An introduction to Tawheed and Aqeedah by Shaykh Al-'Uthaymeen.",
        href: "/books/aqeedah/tawheed-its-meaning-categories-ibn-uthaymeen-71",
      },
      {
        title: "Usool Al Thalatha",
        description:
          "An essential text outlining the three fundamental principles every Muslim should know.",
        href: "/books/aqeedah/usool-thalatha-three-fundamental-principles-105",
      },
      {
        title: "Qawaid Al Arba'a",
        description:
          "A concise work discussing four important principles concerning the understanding of monotheism.",
        href: "/books/aqeedah/qawaid-al-arba-the-four-fundamental-principles-107",
      },
      {
        title: "Nawaqid Al Islam",
        description:
          "A book addressing the nullifiers of Islam and clarifying what can invalidate one's faith.",
        href: "/books/aqeedah/nawaqid-al-islam-things-that-nullify-one-s-islam-80",
      },
    ],
    videos: [
      {
        title: "Introduction Series to Aqeedah",
        url: "https://youtube.com/playlist?list=PLVgajDTQTjHYEGF2IRJ14QSJ6gMGlplbA&si=nSxlaV6-PNVBgFqa",
      },
      {
        title: "Explanation of Thalaathatul Al-Usool",
        url: "https://youtube.com/playlist?list=PL2dRQaGGWZOAW9VrMN7HpHSYykChUZRsy&si=iCLAmSLtdC49ilRe",
      },
      {
        title: "Explanation of Al-Qawa'aid al-Arba'ah",
        url: "https://youtu.be/sZTdp9AkBSQ?si=PaNcdTdcuPsN2mCw",
      },
      {
        title: "Explanation of Ten Nullifiers of Islam",
        url: "https://youtube.com/playlist?list=PL2dRQaGGWZOBckt6JI7Vb2UesHtpAlOqQ&si=rc6A5SqPr5gwkOWR",
      },
    ],
  },
  {
    level: "Intermediate",
    levelColor: "bg-amber-100 text-amber-900",
    intro:
      "Once the basics feel comfortable, these books go deeper into tawheed and the doubts people raise against it. This is the stage where things really click.",
    duration: "6 to 12 months",
    before:
      "Finish the beginner step first. You should be comfortable with the three categories of tawheed and the nullifiers of Islam.",
    whatYoullLearn: [
      "Deep study of tawheed and every act of worship that belongs only to Allah",
      "How to answer common doubts raised against tawheed",
      "The six foundational principles that the Prophet ﷺ built the community on",
      "The difference between clear and hidden forms of shirk",
    ],
    afterThis:
      "You will be able to defend tawheed and spot creedal mistakes, ready to study the classical texts of Ahlus-Sunnah.",
    books: [
      {
        title: "Kitab at-Tauhid",
        description:
          "The Book of Monotheism by Shaykh Muhammad ibn Abdul-Wahhab, a classic study of Tawheed.",
        href: "/books/aqeedah/kitab-at-tauhid-the-book-of-monotheism-82",
      },
      {
        title: "Sharh Kashf al Shubahat",
        description:
          "A clarification and removal of doubts surrounding Tawheed and its opposites.",
        href: "/books/aqeedah/sharh-kashf-ash-shubuhaat-explonation-of-removal-of-doubts-77",
      },
      {
        title: "Usool As Sittah",
        description:
          "The six fundamental principles that every believer should understand.",
        href: "/books/aqeedah/usool-as-sittah-six-fundamental-principles-106",
      },
    ],
    videos: [
      {
        title: "Explanation of Kitab at-Tauhid",
        url: "https://youtube.com/playlist?list=PLcNmEBnwyvx5jnlep1DOG3bKHaw5fxR-7&si=vxU52Dzn3wFmj13T",
      },
      {
        title: "Explanation of Kashf al Shubahat",
        url: "https://youtube.com/playlist?list=PLCxZUKhToxr8d6RgbHNaTunFM5fAyJD9s&si=17nYvtAAl8PY-xFo",
      },
      {
        title: "Explanation of Usool As Sittah",
        url: "https://youtube.com/playlist?list=PL2dRQaGGWZOBQtm-k0Xf8US_kZzflroA3&si=6KqpCPgT2udFUSvi",
      },
    ],
  },
  {
    level: "Advanced",
    levelColor: "bg-rose-100 text-rose-900",
    intro:
      "These are the classical creedal works studied by students of knowledge. They reward careful reading and ideally study with a teacher.",
    duration: "1 to 2 years, done slowly with reflection",
    before:
      "Complete the intermediate step. You should recognize different kinds of shirk and have a working knowledge of tawheed terminology.",
    whatYoullLearn: [
      "Ibn Taymiyyah's full creed of Ahlus-Sunnah and Ibn Uthaymeen's line-by-line explanation",
      "Imam al-Barbahari's statement of Sunni creed and his warnings against innovation",
      "The pre-Islamic practices the Qur'an came to correct",
      "How to engage with creedal debates historically and today",
    ],
    afterThis:
      "You will have studied the core texts of the Salafī tradition and be equipped to teach others and answer tough questions.",
    books: [
      {
        title: "Sharh Al-Aqidah Al-Wasitiyyah Vol. 1",
        description:
          "Ibn Uthaymeen's explanation of Ibn Taymiyyah's classic creed, part one.",
        href: "/books/aqeedah/sharh-al-aqidah-al-wasitiyyah-vol-1-75",
      },
      {
        title: "Sharh Al-Aqidah Al-Wasitiyyah Vol. 2",
        description:
          "Ibn Uthaymeen's explanation of Ibn Taymiyyah's classic creed, part two.",
        href: "/books/aqeedah/sharh-al-aqidah-al-wasitiyyah-vol-2-76",
      },
      {
        title: "Aspects of the Days of Ignorance (Masa'il al-Jahiliyyah)",
        description: "A study of pre-Islamic practices that Islam came to correct.",
        href: "/books/aqeedah/aspects-of-the-days-of-ignorance-95",
      },
      {
        title: "Sharh As-Sunnah Vol. 1",
        description:
          "Imam al-Barbahari's creed of Ahlus-Sunnah, explained in depth, part one.",
        href: "/books/aqeedah/sharh-as-sunnah-the-explanation-of-the-sunnah-vol-1-78",
      },
      {
        title: "Sharh As-Sunnah Vol. 2",
        description:
          "Imam al-Barbahari's creed of Ahlus-Sunnah, explained in depth, part two.",
        href: "/books/aqeedah/sharh-as-sunnah-the-explanation-of-the-sunnah-vol-2-79",
      },
    ],
    videos: [
      {
        title: "Explanation of al-Aqidah al-Waasitiyyah",
        url: "https://youtube.com/playlist?list=PLxQ71pF_GAtHJYlz6c2VsmbKdDiBVuEVQ&si=-AyN1QYMDJDmaDOV",
      },
      {
        title: "Explanation of Sharh as Sunnah",
        url: "https://youtube.com/playlist?list=PLuihjkTS1XqjkOO2LZ282h3r9YgUabB-U&si=FSVtG_rhjcoGF2my",
      },
    ],
  },
];

const scholars = [
  {
    name: "Shaykh al-Islam Ibn Taymiyyah",
    years: "661-728 AH",
    known: "Shaykh al-Islam",
    note: "Among the most influential scholars in Islamic history. His aqeedah works, including Al-Aqidah Al-Wasitiyyah, defended the creed of the Salaf against innovations.",
  },
  {
    name: "Ibn al-Qayyim al-Jawziyyah",
    years: "691-751 AH",
    known: "Senior student of Ibn Taymiyyah",
    note: "Author of Madarij as-Salikin and many works that clarified tawheed, the soul, and the reality of worship. His writing is celebrated for clarity and spiritual depth.",
  },
  {
    name: "Muhammad ibn Abdul-Wahhab",
    years: "1115-1206 AH",
    known: "Reviver of tawheed",
    note: "Author of Kitab at-Tawheed. Led a movement in the Arabian Peninsula to return to the pure creed of the Salaf after centuries of creedal confusion.",
  },
  {
    name: "Shaykh Ibn Baz",
    years: "1330-1420 AH",
    known: "Modern Grand Mufti",
    note: "Grand Mufti of Saudi Arabia. Known for his humility, vast knowledge, and gentle manner. Taught and authored extensively on aqeedah.",
  },
  {
    name: "Shaykh Ibn Uthaymeen",
    years: "1347-1421 AH",
    known: "Prolific teacher",
    note: "One of the most beloved modern scholars. His explanations of Al-Wasitiyyah, Thalaathat al-Usool, and Kitab at-Tawheed are classics in English translation.",
  },
  {
    name: "Shaykh al-Albani",
    years: "1332-1420 AH",
    known: "Hadith master",
    note: "Revived the science of hadith authentication in the modern era. His aqeedah positions are rooted firmly in authentic narrations.",
  },
];

const faq = [
  {
    q: "Why start with aqeedah before other sciences?",
    a: "Aqeedah is what you believe about Allah, His prophets, and the unseen. Fiqh tells you how to worship; aqeedah tells you whom you are worshipping and why. A shaky foundation makes every other act of worship unstable, so the Salaf always taught aqeedah first.",
  },
  {
    q: "What's the difference between aqeedah and fiqh?",
    a: "Aqeedah is creed: what you believe. Fiqh is jurisprudence: how you act. Both are essential, but they answer different questions. Aqeedah is about the unseen and the heart; fiqh is about the seen and the limbs.",
  },
  {
    q: "Do I need Arabic to study aqeedah?",
    a: "No. Many foundational texts (Thalaathat al-Usool, Kitab at-Tawheed, Al-Wasitiyyah) are well-translated into English with scholarly commentary. Arabic deepens your study but is not a barrier to getting started.",
  },
  {
    q: "What if I encounter doubts about my faith?",
    a: "Doubts are normal and even the Companions experienced them. Study Kashf ash-Shubuhaat (Removal of Doubts), talk to a qualified scholar, make dua, and do not let doubts sit unaddressed. Most are resolved by clear knowledge from reliable sources.",
  },
  {
    q: "Who are Ahlus-Sunnah wal-Jamaa'ah?",
    a: "The people who follow the Sunnah of the Prophet ﷺ and stay united on the creed of the Companions. It is distinguished from sects that deviated in creed or methodology. This is the path of the Salaf: the first three generations praised by the Prophet ﷺ.",
  },
  {
    q: "Why are there different schools of aqeedah?",
    a: "Over the centuries, different methods of studying creed developed. Groups like the Mu'tazilah used philosophical reasoning that contradicted revealed texts. Later schools like the Ash'ariyyah and Maturidiyyah developed their own theological methods. The books in this guide follow the Atharī or Salafī path: taking the Qur'an and Sunnah as the companions and the first three generations understood them, without re-interpreting them through outside philosophy.",
  },
];

const related = [
  {
    href: "/guides",
    title: "All Islamic Guides",
    description: "Browse guides on fiqh, hadith, Quran, and more.",
  },
  {
    href: "/books/aqeedah",
    title: "Aqeedah Books Library",
    description: "Every aqeedah book in our library.",
  },
  {
    href: "/why-islam",
    title: "Why Islam?",
    description: "Proofs and answers to the biggest questions.",
  },
  {
    href: "/guides/hadith",
    title: "Hadith Guide",
    description: "Start studying the Sunnah alongside your aqeedah.",
  },
];

export const metadata = {
  title: "Beginner's Guide to Aqeedah",
  description:
    "A structured learning path through Aqeedah: the categories of tawheed, pillars of iman, opposites of tawheed, recommended books, and lecture series.",
};

export default function AqeedahGuidePage() {
  return (
    <>
      <ContentHeader
        title="Beginner's Guide to Aqeedah"
        subtitle="The creed of Ahlus-Sunnah, step by step"
        breadcrumbs={[
          { label: "Islamic Guides", href: "/guides" },
          { label: "Aqeedah" },
        ]}
      />

      <section className="max-w-6xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        {/* Intro */}
        <div className="bg-teal-100 rounded-2xl px-8 py-8 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-bold text-teal-900 mb-3 text-center font-[family-name:var(--font-playfair)]">
            What is Aqeedah?
          </h2>
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[19px] leading-[1.65] text-center">
            Aqeedah (العقيدة) is what a Muslim firmly believes about Allah, His
            angels, books, messengers, the Last Day, and divine decree. It is
            the foundation every other science of Islam rests on. Get the
            foundation right and everything else becomes easier. This guide
            walks you through the core concepts and then a three-step learning
            path with the best books and lectures at each level.
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

        {/* Three Categories of Tawheed */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Layers size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              The Three Categories of Tawheed
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Tawheed is the oneness of Allah. The scholars of Ahlus-Sunnah
            classify it into three categories, each with its own evidence and
            implications.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tawheedCategories.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex flex-col"
              >
                <div className="flex items-baseline justify-between gap-3 mb-1 flex-wrap">
                  <h3 className="text-base font-bold text-teal-900">
                    {t.name}
                  </h3>
                  <span
                    className="font-[family-name:var(--font-amiri)] text-teal-700 text-xl"
                    dir="rtl"
                  >
                    {t.arabic}
                  </span>
                </div>
                <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider mb-3">
                  {t.english}
                </p>
                <p className="text-sm text-teal-900 font-semibold mb-3">
                  {t.plain}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed mb-3 flex-1">
                  {t.description}
                </p>
                <div className="bg-teal-50/60 rounded-xl p-3">
                  <p className="text-xs text-gray-500 italic">
                    &ldquo;{t.evidence}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shirk types */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              The Opposites of Tawheed: Types of Shirk
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Shirk (associating partners with Allah) is the only sin Allah has
            said He will not forgive if died upon. Scholars classify it into
            three levels by severity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shirkTypes.map((s) => (
              <div
                key={s.name}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                  <h3 className="text-base font-bold text-teal-900">
                    {s.name}
                  </h3>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.badgeColor}`}
                  >
                    {s.badge}
                  </span>
                </div>
                <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider mb-3">
                  {s.english}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Six Pillars of Iman */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              The Six Pillars of Iman
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            From the Hadith of Jibreel, when the angel Jibreel asked the Prophet
            ﷺ what iman is.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pillarsOfIman.map((p) => (
              <div
                key={p.num}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex gap-4"
              >
                <div className="shrink-0 w-9 h-9 rounded-full bg-teal-900 text-white font-bold flex items-center justify-center text-sm">
                  {p.num}
                </div>
                <div>
                  <h3 className="text-base font-bold text-teal-900 mb-1">
                    {p.name}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {p.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Perfect foundation callout */}
        <div className="mb-12 bg-teal-50 border-l-4 border-teal-700 rounded-2xl p-5 flex items-start gap-3">
          <Info size={20} className="text-teal-700 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-bold text-teal-900 mb-1">
              Why the Salaf taught creed first
            </h3>
            <p className="text-sm text-teal-900 leading-relaxed">
              Every prophet began with tawheed before law. Every act of worship
              is only accepted when it rests on correct aqeedah. Learning fiqh
              without aqeedah is like building a house without a foundation:
              impressive for a moment, but it will not stand.
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
            A curated progression of books and lecture series, used by students
            of knowledge worldwide.
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

                <div>
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
              </article>
            ))}
          </div>
        </div>

        {/* Famous scholars */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Users size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Famous Scholars of Aqeedah
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            The scholars whose works still define the study of creed in Ahlus-Sunnah.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {scholars.map((s) => (
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
