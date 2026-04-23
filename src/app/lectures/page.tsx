import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import { supabase } from "@/lib/supabase";
import {
  Mic,
  Users,
  Globe,
  ArrowRight,
  Info,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Layers,
  Compass,
  ExternalLink,
} from "lucide-react";

async function getCategories() {
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("content_type", "lecture")
    .order("name");
  return data ?? [];
}

type CategoryInfo = {
  description: string;
  externalUrl?: string;
  externalLabel?: string;
};

// Enriches the Supabase categories with descriptions and source links.
// Keyed by normalized category name (lowercased).
const categoryInfo: Record<string, CategoryInfo> = {
  "al madrasatu al umariyyah": {
    description:
      "Long-form teaching series on aqeedah, tajweed, tafsīr, and classical texts. Free, thorough, and used by students of knowledge worldwide.",
    externalUrl: "https://www.youtube.com/@AlMadrasatuAlUmariyyah",
    externalLabel: "YouTube channel",
  },
  "germantown masjid": {
    description:
      "Masjid as-Ṣaḥābah in Philadelphia, home of Hasan as-Somālī and a leading Salafī community in North America. Known for its publishing arm and conference archive.",
    externalUrl: "https://www.authenticstatements.com",
    externalLabel: "Authentic Statements",
  },
  "keys to knowledge": {
    description:
      "Dawah project supporting students of Islamic knowledge in Makkah, Madīnah, and Riyadh. Produces educational content alongside its support programs.",
    externalUrl: "https://keystoknowledge.org",
    externalLabel: "keystoknowledge.org",
  },
  "shaykh al albani": {
    description:
      "Shaykh Muḥammad Nāṣir ad-Dīn al-Albānī (d. 1420 AH), one of the greatest hadith scholars of the modern era. Recordings of his lessons and fatāwā.",
    externalUrl: "https://al-albany.com",
    externalLabel: "al-albany.com",
  },
  "shaykh ibn baz": {
    description:
      "Shaykh ʿAbd al-ʿAzīz Ibn Bāz (d. 1420 AH), former Grand Muftī of Saudi Arabia. Recordings, fatāwā, and written explanations.",
    externalUrl: "https://binbaz.org.sa",
    externalLabel: "binbaz.org.sa",
  },
  "shaykh ibn uthaymeen": {
    description:
      "Shaykh Muḥammad ibn Ṣāliḥ al-ʿUthaymīn (d. 1421 AH), one of the most beloved teachers of the modern era. Thousands of hours of recorded lessons.",
    externalUrl: "https://binothaimeen.net",
    externalLabel: "binothaimeen.net",
  },
  "sheikh othman al-khamees": {
    description:
      "Shaykh ʿUthmān al-Khamīs, Kuwaiti scholar well-known for refuting innovations and teaching comparative religion.",
  },
  "various salafi scholars": {
    description:
      "Selected lectures from additional contemporary Salafī scholars beyond those listed in their own categories.",
  },
};

function getInfoFor(name: string): CategoryInfo | undefined {
  return categoryInfo[name.toLowerCase()];
}

const motivation = [
  {
    text: "My Lord, increase me in knowledge.",
    source: "Surah Ṭāhā 20:114",
  },
  {
    text: "Whoever travels a path seeking knowledge, Allah makes easy for him a path to Paradise.",
    source: "Sahih Muslim 2699",
  },
  {
    text: "Seeking knowledge is an obligation upon every Muslim.",
    source: "Sunan Ibn Mājah 224, graded Ṣaḥīḥ",
  },
];

type Scholar = {
  name: string;
  role: string;
  url: string;
};

const classicalScholars: Scholar[] = [
  {
    name: "Shaykh Ibn Bāz",
    role: "Former Grand Muftī of Saudi Arabia (d. 1420 AH)",
    url: "https://binbaz.org.sa",
  },
  {
    name: "Shaykh Ibn ʿUthaymīn",
    role: "Senior scholar of the Salaf (d. 1421 AH)",
    url: "https://binothaimeen.net",
  },
  {
    name: "Shaykh al-Albānī",
    role: "Hadith master of his era (d. 1420 AH)",
    url: "https://al-albany.com",
  },
  {
    name: "Shaykh Muqbil al-Wādiʿī",
    role: "Yemeni hadith scholar (d. 1422 AH)",
    url: "https://muqbel.net",
  },
];

const contemporaryArabScholars: Scholar[] = [
  {
    name: "Shaykh Ṣāliḥ al-Fawzān",
    role: "Permanent Committee of Senior Scholars, Saudi Arabia",
    url: "https://alfawzan.af.org.sa",
  },
  {
    name: "Shaykh ʿAbd al-Muḥsin al-ʿAbbād",
    role: "Senior hadith scholar, Madīnah",
    url: "https://al-abbaad.com",
  },
  {
    name: "Shaykh ʿAbd ar-Razzāq al-Badr",
    role: "Professor in Madīnah, son of Shaykh al-Badr",
    url: "https://al-badr.net",
  },
  {
    name: "Shaykh Sulaymān ar-Ruḥaylī",
    role: "Professor at the Islamic University of Madīnah",
    url: "https://alruhayli.net",
  },
  {
    name: "Shaykh ʿUbayd al-Jābirī",
    role: "Senior Salafī scholar of Madīnah (d. 1442 AH)",
    url: "https://ar.miraath.net/author/187",
  },
];

const englishSpeakers: Scholar[] = [
  {
    name: "Abū Khadījah ʿAbd al-Wāḥid",
    role: "UK-based Salafī speaker and author",
    url: "https://www.abukhadeejah.com",
  },
  {
    name: "Moosaa Richardson",
    role: "US instructor, translator of classical texts",
    url: "https://bakkah.net",
  },
  {
    name: "Abū Iyād (Amjad Rafīq)",
    role: "Researcher and author at SalafiPublications",
    url: "https://abuiyaad.com",
  },
  {
    name: "Hasan as-Somālī",
    role: "Philadelphia-based Salafī teacher",
    url: "https://www.authenticstatements.com",
  },
  {
    name: "Abū Ḥakīm Bilāl Davis",
    role: "UK-based Salafī teacher",
    url: "https://www.salafisounds.com",
  },
  {
    name: "Abdulilāh Lahmāmī",
    role: "Translator and teacher, UK",
    url: "https://www.salafisounds.com",
  },
];

type Platform = {
  name: string;
  url: string;
  description: string;
};

const platforms: Platform[] = [
  {
    name: "SalafiPublications",
    url: "https://www.salafipublications.com",
    description:
      "The largest English Salafī dawah archive. Articles, audio, books, and translations from the major scholars.",
  },
  {
    name: "Troid",
    url: "https://www.troid.org",
    description:
      "Toronto-based Salafī dawah. Articles, lectures, and publications.",
  },
  {
    name: "Authentic Statements",
    url: "https://www.authenticstatements.com",
    description:
      "Philadelphia-based publisher and lecture archive from the Masjid as-Ṣaḥābah community.",
  },
  {
    name: "Salafi Sounds",
    url: "https://www.salafisounds.com",
    description:
      "Audio archive of English Salafī lectures and live classes from the UK.",
  },
  {
    name: "Bakkah Publications",
    url: "https://bakkah.net",
    description:
      "Moosaa Richardson's archive of lectures, translations, and classes on classical Salafī texts.",
  },
  {
    name: "Miraath al-Anbiyāʾ",
    url: "https://en.miraath.net",
    description:
      "Translation of Arabic Salafī lectures and lessons from major Madīnah scholars.",
  },
  {
    name: "Learn About Islam",
    url: "https://www.learnaboutislam.co.uk",
    description:
      "UK-based teaching platform with structured Salafī courses and lessons.",
  },
  {
    name: "Sunnah Publishing",
    url: "https://www.sunnahpublishing.net",
    description:
      "UK publishing house. Audio lectures and translated classical Salafī works.",
  },
];

type SeriesLink = { label: string; url: string };

type FeaturedSeries = {
  title: string;
  author: string;
  note: string;
  links: SeriesLink[];
};

const featuredSeries: FeaturedSeries[] = [
  {
    title: "Kitāb at-Tawḥīd",
    author: "Imām Muḥammad ibn ʿAbd al-Wahhāb",
    note: "The foundational text on tawḥīd. Core Salafī aqeedah starting point.",
    links: [
      {
        label: "Abū Ṭalḥah Dāwūd Burbank (full lecture series)",
        url: "https://www.salafisounds.com/an-explanation-of-kitab-at-tawhid-playlist-lecture-series-1997-by-abu-talhah-dawood-burbank-rahimahullah/",
      },
      {
        label: "Abū Khadījah with Shaykh An-Najmī's commentary",
        url: "https://www.salafisounds.com/category/books-taught/kitabut-tawhid/",
      },
    ],
  },
  {
    title: "Thalāthat al-Uṣūl",
    author: "Imām Muḥammad ibn ʿAbd al-Wahhāb",
    note: "The Three Fundamental Principles. Traditional entry text into Islamic creed.",
    links: [
      {
        label: "Abū Ṭalḥah Dāwūd Burbank (full playlist)",
        url: "https://www.salafisounds.com/playlist-the-explanation-of-the-three-fundamental-principles-sharh-usool-al-thalathah-by-abu-talhah-dawood-burbank-rahimahullah/",
      },
      {
        label: "Study PDF (Abū Khadījah)",
        url: "https://abukhadeejah.com/the-three-fundamental-principles-of-islam-and-their-proofs-ebook-pdf/",
      },
    ],
  },
  {
    title: "al-ʿAqīdah al-Wāsiṭiyyah",
    author: "Shaykh al-Islām Ibn Taymiyyah",
    note: "Ibn Taymiyyah's classic statement of the creed of Ahl as-Sunnah.",
    links: [
      {
        label: "Shaykh Ṣāliḥ al-Fawzān (audio, Internet Archive)",
        url: "https://archive.org/details/AlAqidahAlWaasitiyyahExplanationByShaykhSalehAlFawzan",
      },
      {
        label: "Shaykh Ibn Bāz explanation (PDF)",
        url: "https://www.emaanlibrary.com/wp-content/uploads/2022/01/The-Explanation-of-al-Aqidah-al-Wasi%E1%B9%ADiyyah-Sh.-Ibn-Baaz.pdf",
      },
    ],
  },
  {
    title: "Seerah of the Prophet ﷺ",
    author: "Based on The Sealed Nectar (Ar-Raḥīq al-Makhtūm)",
    note: "The life of the Prophet ﷺ, lectured from the most widely-used modern seerah source.",
    links: [
      {
        label: "Seerah playlist based on The Sealed Nectar (YouTube)",
        url: "https://www.youtube.com/playlist?list=PLIBMga6MApfI0et3M3mmkkOQd8QlcW-cX",
      },
      {
        label: "Abū Khadījah's Seerah archive",
        url: "https://abukhadeejah.com/tag/seerah/",
      },
    ],
  },
  {
    title: "Tafsīr As-Saʿdī",
    author: "Shaykh ʿAbd ar-Raḥmān as-Saʿdī",
    note: "The most recommended first tafsīr. Clear, concise, and focused on guidance.",
    links: [
      {
        label: "Full 10-volume English translation (Internet Archive)",
        url: "https://archive.org/details/tafseer-as-sadi-by-shaykh-abdur-rahman-al-sadi-10-volume-set-english",
      },
      {
        label: "Text and downloads (Kalamullah)",
        url: "https://www.kalamullah.com/tafseer-as-sadi.html",
      },
    ],
  },
  {
    title: "Riyāḍ aṣ-Ṣāliḥīn",
    author: "Imām an-Nawawī, explained by Shaykh Ibn ʿUthaymīn",
    note: "A classical hadith collection with Ibn ʿUthaymīn's beloved line-by-line explanation.",
    links: [
      {
        label: "Ibn ʿUthaymīn's explanation (6 volumes, Internet Archive)",
        url: "https://archive.org/details/explanationofriyadussaliheen.sh.aluthaymeenhighqualitysunniconnect.com",
      },
      {
        label: "Dr. Ṣāliḥ as-Ṣāliḥ audio series",
        url: "https://abdurrahman.org/2014/11/10/hadeeth-an-nawawis-riyadus-us-saliheen-dr-saleh-as-saleh/",
      },
    ],
  },
];

const mistakes = [
  {
    problem: "Celebrity speakers over scholars",
    solution:
      "Social media popularity is not a sign of scholarly weight. Stick with speakers who cite their sources, refer people to senior scholars, and teach from established texts.",
  },
  {
    problem: "Sharing quotes without verifying",
    solution:
      "If a speaker attributes something to the Prophet ﷺ, verify it on sunnah.com before repeating it. 'I heard it in a lecture' is not a source.",
  },
  {
    problem: "Lectures as a replacement for study",
    solution:
      "Listening alone does not build depth. Pair lectures with reading, with a local teacher, and with your own practice.",
  },
  {
    problem: "Jumping between speakers",
    solution:
      "Pick one trusted series or scholar and finish it before moving on. Depth beats breadth.",
  },
];

const faq = [
  {
    q: "How do I know a speaker is trustworthy?",
    a: "They cite the Qur'an, authentic hadith, and named scholars. They defer to senior scholars on matters above their level. They do not teach from their own opinion. Red flags: no sourcing, heavy personal branding, mocking or attacking other scholars without evidence.",
  },
  {
    q: "Do I need Arabic to benefit from lectures?",
    a: "No. Most major Salafī content has been translated into English by the platforms listed above. Arabic deepens your study, but English lectures alone are enough to build a solid foundation.",
  },
  {
    q: "Where should I start?",
    a: "Pick one of the featured series and commit to finishing it. Explanation of Thalāthat al-Uṣūl is the traditional starting point for creed. Pair it with reading the written text.",
  },
  {
    q: "What about scholars I do not see here?",
    a: "This is a starting list, not an exhaustive one. When in doubt about a speaker, ask your local imam or check if the speaker is referenced by the senior scholars listed here.",
  },
];

const related = [
  {
    href: "/khutbas",
    title: "Khutbas",
    description: "Friday sermons organized by topic.",
  },
  {
    href: "/guides",
    title: "Islamic Guides",
    description: "Structured study guides on every major topic.",
  },
  {
    href: "/books",
    title: "Books Library",
    description: "The written companion to your listening.",
  },
  {
    href: "/quran/tafseer",
    title: "Tafseer Resources",
    description: "Understand the Qur'an verse by verse.",
  },
];

export const metadata = {
  title: "Lectures",
  description:
    "Trusted Salafī lectures and platforms: scholars from Madīnah and beyond, classical and contemporary, organized so you can start listening today.",
};

function ScholarList({ items }: { items: Scholar[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((s) => (
        <a
          key={s.name}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200 flex items-start justify-between gap-3"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-teal-900 group-hover:text-teal-700 transition-colors">
                {s.name}
              </h4>
              <ExternalLink size={11} className="text-gray-400 shrink-0" />
            </div>
            <p className="text-xs text-gray-600 mt-0.5">{s.role}</p>
          </div>
          <ArrowRight
            size={16}
            className="text-teal-700 group-hover:translate-x-1 transition-transform shrink-0 mt-1"
          />
        </a>
      ))}
    </div>
  );
}

export default async function LecturesPage() {
  const categories = await getCategories();

  return (
    <>
      <ContentHeader
        title="Islamic Lectures"
        subtitle="Trusted Salafī scholars, platforms, and classical lecture series"
        breadcrumbs={[{ label: "Lectures" }]}
      />

      <section className="max-w-6xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        {/* Intro */}
        <div className="bg-teal-100 rounded-2xl px-8 py-8 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-bold text-teal-900 mb-3 text-center font-[family-name:var(--font-playfair)]">
            Listen From the People of Knowledge
          </h2>
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[19px] leading-[1.65] text-center">
            A curated starting list of trusted Salafī scholars and platforms.
            Every link below takes you directly to the scholar&apos;s site or
            the platform hosting their lectures.
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

        {/* Classical Scholars */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Users size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Classical Scholars (Audio Archives)
            </h2>
          </div>
          <p className="text-gray-500 mb-4 text-sm">
            Recorded lessons, khuṭbahs, and Q&amp;A of the senior scholars of
            recent centuries.
          </p>
          <ScholarList items={classicalScholars} />
        </div>

        {/* Contemporary Arab Scholars */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Users size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Contemporary Scholars (Arabic, Often Translated)
            </h2>
          </div>
          <p className="text-gray-500 mb-4 text-sm">
            Living senior scholars whose lectures are widely translated on the
            platforms below.
          </p>
          <ScholarList items={contemporaryArabScholars} />
        </div>

        {/* English Speakers */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Mic size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              English Salafī Teachers
            </h2>
          </div>
          <p className="text-gray-500 mb-4 text-sm">
            English-speaking teachers who transmit from the senior scholars.
          </p>
          <ScholarList items={englishSpeakers} />
        </div>

        {/* Platforms */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Platforms &amp; Archives
            </h2>
          </div>
          <p className="text-gray-500 mb-4 text-sm">
            Where to find lectures, translations, and full courses.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="text-base font-bold text-teal-900 group-hover:text-teal-700 transition-colors">
                    {p.name}
                  </h3>
                  <ExternalLink size={12} className="text-gray-400 shrink-0" />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {p.description}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Featured Series */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Compass size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Classical Lecture Series to Start With
            </h2>
          </div>
          <p className="text-gray-500 mb-4 text-sm">
            Direct links to the full lecture series and study materials.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredSeries.map((s) => (
              <div
                key={s.title}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex flex-col"
              >
                <h3 className="text-base font-bold text-teal-900">{s.title}</h3>
                <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider mt-0.5">
                  {s.author}
                </p>
                <p className="text-sm text-gray-600 mt-2 mb-3 flex-1">
                  {s.note}
                </p>
                <div className="space-y-1.5">
                  {s.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-2 text-sm bg-teal-50 hover:bg-teal-100 text-teal-900 font-semibold px-3 py-2 rounded-xl transition-colors"
                    >
                      <span className="inline-flex items-center gap-1.5 min-w-0">
                        <ExternalLink size={12} className="text-teal-700 shrink-0" />
                        <span className="truncate">{link.label}</span>
                      </span>
                      <ArrowRight
                        size={14}
                        className="text-teal-700 shrink-0 group-hover:translate-x-1 transition-transform"
                      />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Library by topic */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Layers size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Browse the Library by Topic
            </h2>
          </div>
          <p className="text-gray-500 mb-4 text-sm">
            Our curated on-site collection of lectures, organized into
            categories.
          </p>
          {categories.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-sm text-gray-500 text-center shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              No categories available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const info = getInfoFor(cat.name);
                return (
                  <div
                    key={cat.id}
                    className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex flex-col"
                  >
                    <Link
                      href={`/lectures/${cat.slug}`}
                      className="group flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Mic size={18} className="text-teal-700 shrink-0" />
                        <h3 className="text-base font-bold text-teal-900 group-hover:text-teal-700 transition-colors truncate">
                          {cat.name}
                        </h3>
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-teal-700 group-hover:translate-x-1 transition-transform shrink-0"
                      />
                    </Link>
                    {info?.description && (
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed flex-1">
                        {info.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <Link
                        href={`/lectures/${cat.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-full transition-colors"
                      >
                        On-site lectures
                      </Link>
                      {info?.externalUrl && (
                        <a
                          href={info.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-teal-700 bg-gray-50 hover:bg-gray-100 px-2.5 py-1 rounded-full transition-colors"
                        >
                          <ExternalLink size={10} />
                          {info.externalLabel ?? "Official site"}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mb-12 bg-teal-50 border-l-4 border-teal-700 rounded-2xl p-5 flex items-start gap-3">
          <Info size={20} className="text-teal-700 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-bold text-teal-900 mb-1">
              A note on this list
            </h3>
            <p className="text-sm text-teal-900 leading-relaxed">
              Inclusion on this list is a starting recommendation, not an
              unconditional endorsement of every opinion a speaker has
              expressed. For personal matters, refer to qualified local
              scholars.
            </p>
          </div>
        </div>

        {/* Mistakes */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Listening Mistakes
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mistakes.map((m) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 items-start">
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
            Continue
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
