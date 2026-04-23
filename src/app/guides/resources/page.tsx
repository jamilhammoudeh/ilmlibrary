import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import {
  BookOpen,
  Globe,
  Smartphone,
  Languages,
  ArrowRight,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Info,
  GraduationCap,
  HandHeart,
  Mic,
} from "lucide-react";

const motivation = [
  {
    text: "Say: Are those who know equal to those who do not know? Only those with understanding take heed.",
    source: "Surah Az-Zumar 39:9",
  },
  {
    text: "My Lord, increase me in knowledge.",
    source: "Surah Ṭāhā 20:114",
  },
  {
    text: "Whoever travels a path seeking knowledge, Allah makes easy for him a path to Paradise.",
    source: "Sahih Muslim 2699",
  },
];

type Resource = {
  name: string;
  url?: string;
  internal?: string;
  description: string;
  tag?: string;
};

type Section = {
  title: string;
  subtitle: string;
  icon: typeof BookOpen;
  items: Resource[];
};

const onThisSite: Resource[] = [
  {
    name: "Read the Qur'an",
    internal: "/quran/read",
    description:
      "Read the full Qur'an with translation, tafseer, tajweed colors, word-by-word, and verse-by-verse recitation.",
  },
  {
    name: "Books Library",
    internal: "/books",
    description:
      "A full library of Islamic books across every topic: aqeedah, fiqh, hadith, tafseer, seerah, and more.",
  },
  {
    name: "Tafseer Resources",
    internal: "/quran/tafseer",
    description:
      "Side-by-side comparison of tafsir traditions, the classical mufassirun, and every tafseer volume in the library.",
  },
  {
    name: "Tajweed",
    internal: "/quran/tajweed",
    description:
      "The science of proper Qur'anic recitation: makhārij, rules, and deep dives into each topic.",
  },
  {
    name: "Duas & Supplications",
    internal: "/duas",
    description:
      "Morning, evening, and situational duas with Arabic, transliteration, and translation.",
  },
  {
    name: "Lectures & Khutbas",
    internal: "/lectures",
    description:
      "Curated video lectures and Friday khutbas organized by topic.",
  },
  {
    name: "Reciters",
    internal: "/quran/reciters",
    description:
      "Browse full Qur'an recitations from Husary, Sudais, Alafasy, Minshawi, and more.",
  },
  {
    name: "Islamic Guides",
    internal: "/guides",
    description:
      "Beginner's guides to aqeedah, fiqh, hadith, seerah, tafsir, and more.",
  },
];

const quranTools: Resource[] = [
  {
    name: "Quran.com",
    url: "https://quran.com",
    description:
      "The most widely used Qur'an reading tool online. Includes multiple translations, tafsir (Ibn Kathir, Ma'arif, and others), word-by-word, and dozens of reciters.",
    tag: "Primary",
  },
  {
    name: "Tanzil.net",
    url: "https://tanzil.net",
    description:
      "A careful reference text of the Qur'an with multiple scripts, translations, and search. Clean and scholarly.",
  },
  {
    name: "Quranic Audio",
    url: "https://quranicaudio.com",
    description:
      "Free downloadable full-surah recordings from nearly every well-known reciter.",
  },
  {
    name: "Every Ayah",
    url: "https://everyayah.com",
    description:
      "Verse-by-verse MP3s in multiple paces (Muallim for learning, Murattal for daily, Mujawwad for melodic). Excellent for memorization.",
  },
];

const hadithTools: Resource[] = [
  {
    name: "Sunnah.com",
    url: "https://sunnah.com",
    description:
      "The leading English hadith database. Includes the Kutub as-Sittah and more, with gradings from Shaykh al-Albānī and other scholars.",
    tag: "Primary",
  },
  {
    name: "Hadith.com",
    url: "https://hadith.com",
    description:
      "A clean interface for browsing hadith collections by book and chapter.",
  },
];

const learningPlatforms: Resource[] = [
  {
    name: "SeekersGuidance",
    url: "https://seekersguidance.org",
    description:
      "Traditional Sunni online institute with free courses on fiqh, aqeedah, seerah, and spirituality. Structured curriculum with qualified teachers.",
    tag: "Courses",
  },
  {
    name: "Yaqeen Institute",
    url: "https://yaqeeninstitute.org",
    description:
      "Research institute producing in-depth papers, videos, and podcasts on contemporary questions from a scholarly lens.",
    tag: "Research",
  },
  {
    name: "AlMaghrib Institute",
    url: "https://almaghrib.org",
    description:
      "Weekend-intensive seminar model, covering a wide range of Islamic sciences. Mostly English-speaking scholars.",
  },
  {
    name: "Al Madrasatu Al Umariyyah",
    url: "https://www.youtube.com/@AlMadrasatuAlUmariyyah",
    description:
      "Long-form YouTube teaching series on tajweed, tafseer, and classical texts with full commentary. Free and thorough.",
    tag: "Free",
  },
];

const fatwaSites: Resource[] = [
  {
    name: "IslamQA.info",
    url: "https://islamqa.info",
    description:
      "Saudi-based Q&A site answering thousands of questions with evidence from Qur'an and Sunnah. Widely used for religious rulings.",
  },
  {
    name: "SeekersGuidance Answers",
    url: "https://seekersguidance.org/answers",
    description:
      "Answers to thousands of questions from traditional Sunni teachers. Covers practical fiqh and spiritual questions.",
  },
  {
    name: "Dar al-Iftāʾ (Egypt)",
    url: "https://www.dar-alifta.org",
    description:
      "The official fatwa body of Egypt. Available in Arabic and English for serious fatwa research.",
  },
];

const audioVideoPlatforms: Resource[] = [
  {
    name: "Muslim Central",
    url: "https://muslimcentral.com",
    description:
      "A massive archive of podcasts and audio lectures from a wide range of scholars and speakers. Searchable by name and topic.",
    tag: "Podcasts",
  },
  {
    name: "Bayyinah TV",
    url: "https://bayyinahtv.com",
    description:
      "Video courses and Qur'an-focused teaching. Subscription-based with some free content.",
    tag: "Video",
  },
  {
    name: "Mufti Menk (YouTube)",
    url: "https://www.youtube.com/@muftimenkofficial",
    description:
      "Accessible daily reminders and lecture series. One of the most-watched Islamic channels globally.",
  },
];

const apps: Resource[] = [
  {
    name: "Muslim Pro",
    url: "https://www.muslimpro.com",
    description:
      "Prayer times, qibla, Qur'an, and reminders. One of the most used Islamic apps worldwide.",
  },
  {
    name: "Athan Pro",
    url: "https://www.islamicfinder.org/athan-pro/",
    description:
      "Prayer times and athan notifications with customizable reciter.",
  },
  {
    name: "Quran Companion",
    url: "https://quran-companion.com",
    description:
      "A hifdh tracking app with SRS-style review, streaks, and community features.",
    tag: "Memorization",
  },
  {
    name: "Tarteel AI",
    url: "https://tarteel.ai",
    description:
      "AI-powered Qur'an recitation assistant. Listens as you recite and flags mistakes in real time.",
    tag: "Recitation",
  },
];

const arabicTools: Resource[] = [
  {
    name: "Madinah Arabic",
    url: "https://www.madinaharabic.com",
    description:
      "The classic Madinah book series for learning classical Arabic, free online with accompanying resources.",
    tag: "Free",
  },
  {
    name: "Arabic Almanac (Lane's Lexicon)",
    url: "https://lisaan-al-arab.com",
    description:
      "A free online version of Edward Lane's famous Arabic-English lexicon. Great for looking up Qur'anic vocabulary.",
  },
  {
    name: "Learn Arabic with Arabic 101",
    url: "https://www.youtube.com/@Arabic101",
    description:
      "YouTube series covering Arabic grammar and pronunciation, including a well-regarded makhārij series used for tajweed students.",
  },
];

const sections: Section[] = [
  {
    title: "Essential Qur'an Tools",
    subtitle: "For reading, listening, and studying the Qur'an",
    icon: BookOpen,
    items: quranTools,
  },
  {
    title: "Hadith Databases",
    subtitle: "For checking authenticity and reading collections",
    icon: Globe,
    items: hadithTools,
  },
  {
    title: "Learning Platforms",
    subtitle: "Structured courses and Islamic education providers",
    icon: GraduationCap,
    items: learningPlatforms,
  },
  {
    title: "Fatwa & Q&A Sites",
    subtitle: "For specific religious questions answered by scholars",
    icon: HelpCircle,
    items: fatwaSites,
  },
  {
    title: "Podcasts & Video",
    subtitle: "Lecture archives and daily reminder content",
    icon: Mic,
    items: audioVideoPlatforms,
  },
  {
    title: "Mobile Apps",
    subtitle: "Daily companions for prayer, Qur'an, and memorization",
    icon: Smartphone,
    items: apps,
  },
  {
    title: "Arabic Learning",
    subtitle: "Tools to build your classical Arabic",
    icon: Languages,
    items: arabicTools,
  },
];

const howToUse = [
  {
    problem: "Picking a resource that matches a famous name, not its quality",
    solution:
      "Popularity is not the same as reliability. Before committing to a course or a channel, check whether it names its sources, cites classical scholars, and teaches with structure. A clear curriculum beats a viral video.",
  },
  {
    problem: "Collecting resources without actually using any",
    solution:
      "It is easy to bookmark 50 apps and 20 YouTube channels and never open them. Pick one or two from each category and stay with them for months. Depth matters more than breadth.",
  },
  {
    problem: "Taking a fatwa from a random search result",
    solution:
      "Different questions have different answers depending on context. Before acting on a fatwa, check the source and the date, and prefer sites that name the scholars behind the answer. For personal matters, ask a local scholar.",
  },
  {
    problem: "Consuming religion as entertainment",
    solution:
      "Short clips are useful, but they are not study. Pair every ten reminders you watch with one structured lesson, one chapter of a book, or one hadith you memorize. Passive listening is comfort; real learning takes effort.",
  },
];

const faq = [
  {
    q: "Which one resource should I start with?",
    a: "For the Qur'an: Quran.com. For hadith: Sunnah.com. For study: pick one course from SeekersGuidance or watch one full series from Al Madrasatu Al Umariyyah. Start with one and add others only once you have a routine.",
  },
  {
    q: "How do I know if an online scholar is trustworthy?",
    a: "Good signs: they cite the Qur'an, Sunnah, and classical scholars, they do not rush to give rulings on every question, and they refer people to qualified scholars for personal matters. Red flags: refusing to name sources, mocking other scholars, heavy personal branding without substance.",
  },
  {
    q: "Do I need paid subscriptions?",
    a: "Not to start. Quran.com, Sunnah.com, and a lot of YouTube content are free. Paid platforms like SeekersGuidance and Bayyinah TV offer structured courses that can be worth it once you know what you want to study. Free first, paid later.",
  },
  {
    q: "What about scholars I see on social media?",
    a: "Treat short-form content as reminders, not as your primary source of knowledge. For real learning, go to books and structured courses. Reminders keep the heart engaged; books build the understanding.",
  },
  {
    q: "Is English enough?",
    a: "For daily practice, yes. For deeper study of tafsir, hadith sciences, fiqh, or uṣūl, Arabic becomes essential because the primary texts are in Arabic and translations cannot fully carry the nuance. If you are serious about a specific science, start Arabic alongside.",
  },
  {
    q: "How do I balance resources with real-life learning?",
    a: "Online resources support learning; they do not replace it. Attend your local masjid, build relationships with local teachers and scholars, sit in circles when you can. A local teacher who knows your name matters more than a famous one who does not.",
  },
];

const related = [
  {
    href: "/guides",
    title: "All Islamic Guides",
    description: "Browse every guide on the site.",
  },
  {
    href: "/books",
    title: "Books Library",
    description: "Every book in the library, across every topic.",
  },
  {
    href: "/quran",
    title: "Qur'an Section",
    description: "Read, listen, memorize, and study.",
  },
  {
    href: "/lectures",
    title: "Lectures & Khutbas",
    description: "Curated video content by topic.",
  },
];

export const metadata = {
  title: "Islamic Resources",
  description:
    "A curated list of trustworthy Islamic resources: Qur'an and hadith tools, learning platforms, fatwa sites, apps, and Arabic learning.",
};

export default function ResourcesGuidePage() {
  return (
    <>
      <ContentHeader
        title="Islamic Resources"
        subtitle="A curated guide to the best Islamic tools online"
        breadcrumbs={[
          { label: "Islamic Guides", href: "/guides" },
          { label: "Resources" },
        ]}
      />

      <section className="max-w-6xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        {/* Intro */}
        <div className="bg-teal-100 rounded-2xl px-8 py-8 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-bold text-teal-900 mb-3 text-center font-[family-name:var(--font-playfair)]">
            A Curated Guide to Islamic Resources
          </h2>
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[19px] leading-[1.65] text-center">
            Islamic learning has never been more accessible. But accessibility
            can become overwhelm: too many apps, too many channels, too many
            fatwa sites. This page is a carefully chosen starting list across
            every category, with notes on what each one is good for and how to
            use them wisely.
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

        {/* On this site */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <HandHeart size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              On This Site
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Start here. The features and collections already built into Ilm
            Library.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {onThisSite.map((r) => (
              <Link
                key={r.name}
                href={r.internal!}
                className="group bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center justify-between gap-3 mb-1">
                  <h3 className="text-base font-bold text-teal-900 group-hover:text-teal-700 transition-colors">
                    {r.name}
                  </h3>
                  <ArrowRight
                    size={16}
                    className="text-teal-700 group-hover:translate-x-1 transition-transform shrink-0"
                  />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {r.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* External resource sections */}
        {sections.map((section) => (
          <div className="mb-12" key={section.title}>
            <div className="flex items-center gap-2 mb-2">
              <section.icon size={22} className="text-teal-700" />
              <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
                {section.title}
              </h2>
            </div>
            <p className="text-gray-500 mb-6">{section.subtitle}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map((r) => (
                <a
                  key={r.name}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200 flex flex-col"
                >
                  <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                    <h3 className="text-base font-bold text-teal-900 group-hover:text-teal-700 transition-colors">
                      {r.name}
                    </h3>
                    {r.tag && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 uppercase tracking-wider">
                        {r.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed flex-1">
                    {r.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        ))}

        {/* Verify reminder */}
        <div className="mb-12 bg-teal-50 border-l-4 border-teal-700 rounded-2xl p-5 flex items-start gap-3">
          <Info size={20} className="text-teal-700 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-bold text-teal-900 mb-1">
              A note on trusting resources
            </h3>
            <p className="text-sm text-teal-900 leading-relaxed">
              This list is a starting point, not a blanket endorsement of
              everything on every site. Even reliable platforms contain
              individual articles or speakers that may differ from each other.
              When you encounter an unfamiliar opinion, verify it against the
              Qur&apos;an, authentic Sunnah, and the understanding of the
              established scholars.
            </p>
          </div>
        </div>

        {/* Pitfalls */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              How to Use These Wisely
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            The pitfalls every digital student of knowledge runs into.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {howToUse.map((m) => (
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

        {/* Local scholar callout */}
        <div className="mb-12 bg-teal-900 text-white rounded-2xl px-8 py-8 shadow-[0_4px_12px_rgba(0,0,0,0.12)] text-center">
          <p className="text-xl md:text-2xl font-bold font-[family-name:var(--font-playfair)] leading-tight mb-3">
            Online resources <span className="text-teal-200">support</span>{" "}
            learning.
            <br />
            They do not <span className="text-teal-200">replace</span> it.
          </p>
          <p className="text-sm text-teal-100 max-w-2xl mx-auto leading-relaxed">
            Find a local masjid. Sit with a local teacher. Ask questions in
            person. A teacher who knows your name and situation matters far
            more than a famous one who does not. Use these tools to support
            that foundation, not instead of it.
          </p>
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
