import Link from "next/link";
import Image from "next/image";
import { ContentHeader } from "@/components/content-header";
import {
  BookOpen,
  Play,
  ExternalLink,
  Search as SearchIcon,
  Layers,
  Mic,
  Users,
  Globe,
  HelpCircle,
  ArrowRight,
  Scale,
  GraduationCap,
  Info,
  Target,
  TrendingUp,
  Waves,
  Activity,
  GitMerge,
  Pause,
  Eye,
  Compass,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type TajweedBook = {
  title: string;
  slug: string;
  author: string;
  cover_url: string | null;
  category: { slug: string } | null;
};

async function getTajweedBooks(): Promise<TajweedBook[]> {
  const { data } = await supabase
    .from("books")
    .select("title, slug, author, cover_url, category:categories(slug)")
    .or(
      [
        "title.ilike.%tajweed%",
        "title.ilike.%tajwid%",
        "title.ilike.%qaidah%",
        "title.ilike.%qaaidah%",
        "title.ilike.%qa'idah%",
        "title.ilike.%noorani%",
        "title.ilike.%noraniah%",
      ].join(",")
    )
    .order("title");

  return ((data ?? []) as unknown as TajweedBook[]).filter((b) => b.category?.slug);
}

const motivation = [
  {
    text: "And recite the Quran with measured recitation (tarteel).",
    source: "Surah Al-Muzzammil 73:4",
  },
  {
    text: "The one who is proficient with the Quran will be with the honorable, obedient scribes (angels). And the one who reads the Quran and falters in it, finding it difficult, will have two rewards.",
    source: "Sahih al-Bukhari 4937, Sahih Muslim 798",
  },
  {
    text: "He is not one of us who does not recite the Quran beautifully.",
    source: "Sahih al-Bukhari 7527",
  },
];

const foundationTerms = [
  {
    name: "Tajwīd",
    arabic: "تجويد",
    rootMeaning: "From the root ج-و-د, meaning to improve, perfect, or make excellent.",
    definition:
      "The science and practice of reciting the Qur'an correctly and beautifully by giving each letter its proper articulation and characteristics. In the context of the Qur'an, it means reciting the words of Allah as they were revealed: precisely, clearly, and with care.",
  },
  {
    name: "Qirā'ah & Tilāwah",
    arabic: "قراءة · تلاوة",
    rootMeaning: "Qirā'ah means reading; tilāwah means attentive, reflective recitation.",
    definition:
      "Both terms describe the act of reading the Qur'an, but tilāwah carries the deeper meaning of reciting with attentiveness, reflection, and adherence to proper method. Qur'anic recitation is not just reading text; it is the transmission of a preserved oral tradition passed from the Prophet ﷺ through generations.",
  },
  {
    name: "Makhārij al-Ḥurūf",
    arabic: "مخارج الحروف",
    rootMeaning: "The points of articulation.",
    definition:
      "The precise places in the mouth, throat, or nasal cavity where each letter originates. Seventeen points in total, grouped into five regions: throat, tongue, lips, nose, and the mouth cavity itself.",
  },
  {
    name: "Ṣifāt al-Ḥurūf",
    arabic: "صفات الحروف",
    rootMeaning: "The characteristics of letters.",
    definition:
      "The qualities each letter carries, such as heaviness (tafkhīm), lightness (tarqīq), or echoing (qalqalah). Together with makhārij, they ensure every letter is pronounced distinctly and correctly, since even slight changes in pronunciation can alter meanings.",
  },
];

const levelsOfRecitation = [
  {
    name: "Tahqiq",
    arabic: "التحقيق",
    pace: "Slowest",
    description:
      "The most precise and deliberate pace. Every letter is given its full right, every rule observed openly. Used by beginners and teachers during instruction.",
    useCase: "Learning and teaching",
  },
  {
    name: "Tarteel",
    arabic: "الترتيل",
    pace: "Measured",
    description:
      "The pace commanded in the Quran itself. Clear, calm, and reflective, with every rule applied correctly. Considered the ideal pace for most recitation.",
    useCase: "Daily recitation and prayer",
  },
  {
    name: "Tadweer",
    arabic: "التدوير",
    pace: "Medium",
    description:
      "A pace between tarteel and hadr. Faster than tarteel but still fully observant of tajweed rules, including medium-length madd.",
    useCase: "Experienced reciters in prayer",
  },
  {
    name: "Hadr",
    arabic: "الحدر",
    pace: "Fast",
    description:
      "The fastest permissible pace. All rules are still correctly applied, just briefly. Used by huffadh during review or long night prayers.",
    useCase: "Review and Tarawih for huffadh",
  },
];

const coreSubjects = [
  {
    name: "Makharij al-Huruf",
    translit: "Articulation Points",
    detail:
      "The exact place in the mouth, throat, or nasal cavity where each letter originates. 17 points grouped into 5 regions: throat, tongue, lips, nose, and mouth cavity.",
  },
  {
    name: "Sifat al-Huruf",
    translit: "Characteristics of Letters",
    detail:
      "The qualities each letter carries: heaviness or lightness, softness or strength, whispering or voicing. Distinguishes letters that share the same articulation point.",
  },
  {
    name: "Ahkam an-Noon as-Sakinah",
    translit: "Rules of the Silent Noon",
    detail:
      "Four rules that govern what happens when a noon sakinah or tanween meets another letter: Idhar, Idgham, Iqlab, and Ikhfa.",
  },
  {
    name: "Ahkam al-Meem as-Sakinah",
    translit: "Rules of the Silent Meem",
    detail:
      "Three rules for the silent meem when followed by another letter: Idgham Shafawi, Ikhfa Shafawi, and Idhar Shafawi.",
  },
  {
    name: "Al-Madd",
    translit: "Elongation",
    detail:
      "Rules for lengthening vowels. Includes natural madd (2 counts) and several secondary types that extend to 4, 5, or 6 counts depending on context.",
  },
  {
    name: "Al-Qalqalah",
    translit: "Echoing",
    detail:
      "The slight bounce or echo applied to five specific letters (ق ط ب ج د) when they carry a sukoon. Essential for clear, well-pronounced recitation.",
  },
  {
    name: "Tafkheem wa Tarqeeq",
    translit: "Heavy & Light Pronunciation",
    detail:
      "Some letters are always pronounced heavy (the seven letters of isti'la), some always light, and some vary by context, most notably the letter Ra.",
  },
  {
    name: "Al-Waqf wal-Ibtida",
    translit: "Stopping & Starting",
    detail:
      "Where it is appropriate, necessary, forbidden, or preferred to stop, and how to resume correctly. Critical for preserving meaning.",
  },
  {
    name: "Al-Ghunnah",
    translit: "Nasalization",
    detail:
      "The nasal sound held for roughly two counts on the letters noon and meem when they are shaddah or involved in certain rules.",
  },
];

const noonSakinahRules = [
  {
    rule: "Idhar",
    arabic: "الإظهار",
    meaning: "Clear pronunciation",
    letters: "ء ه ع ح غ خ",
    trigger: "The 6 throat letters",
    example: "مَنْ ءَامَنَ",
    explanation: "The noon is pronounced clearly, with no merging or nasalization.",
  },
  {
    rule: "Idgham",
    arabic: "الإدغام",
    meaning: "Merging",
    letters: "ي ر م ل و ن",
    trigger: "The 6 letters of yarmaloon",
    example: "مَن يَّقُولُ",
    explanation: "The noon merges into the following letter. With ي و م ن a ghunnah is held; with ل ر there is no ghunnah.",
  },
  {
    rule: "Iqlab",
    arabic: "الإقلاب",
    meaning: "Flipping",
    letters: "ب",
    trigger: "Only the letter ba",
    example: "مِنۢ بَعْدِ",
    explanation: "The noon is flipped into a hidden meem with ghunnah held for two counts.",
  },
  {
    rule: "Ikhfa",
    arabic: "الإخفاء",
    meaning: "Hiding",
    letters: "ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك",
    trigger: "The remaining 15 letters",
    example: "مِن كُلِّ",
    explanation: "The noon is hidden between clear and merged, held with ghunnah for two counts.",
  },
];

const learningPaths = [
  {
    name: "Noorani Qaidah",
    level: "Absolute Beginner",
    levelColor: "bg-emerald-100 text-emerald-900",
    best: "Learning to read Arabic letters for the first time",
    description:
      "A short primer that teaches the Arabic alphabet, basic vowel marks, and introductory tajweed. The traditional starting point before opening the Mushaf.",
    strengths: [
      "Teaches the alphabet and sukoon, shaddah, madd basics",
      "Usually finished in 1 to 3 months",
      "A non-negotiable starting point for non-Arabic readers",
    ],
  },
  {
    name: "Structured Tajweed Course",
    level: "Intermediate",
    levelColor: "bg-amber-100 text-amber-900",
    best: "After Qaidah, once you can read Arabic slowly",
    description:
      "A step-by-step tajweed curriculum covering makharij, sifat, noon and meem rules, madd, qalqalah, and waqf. Usually 6 to 12 months.",
    strengths: [
      "Covers every rule systematically",
      "Builds the foundation to recite any Mushaf correctly",
      "Best done with a teacher for correction",
    ],
  },
  {
    name: "Ijazah & Mastery",
    level: "Advanced",
    levelColor: "bg-rose-100 text-rose-900",
    best: "Serious students who have completed a full tajweed course",
    description:
      "Reciting the entire Quran to a qualified teacher with a connected chain of transmission (ijazah), usually in the Hafs riwayah or another qira'ah.",
    strengths: [
      "Connects you to the unbroken chain back to the Prophet ﷺ",
      "Involves hundreds of hours of recitation under correction",
      "The traditional qualification to teach tajweed",
    ],
  },
];

const reciters = [
  {
    name: "Shaykh Mahmoud Khalil al-Husary",
    years: "1917 to 1980",
    known: "The teaching standard",
    note: "His Muallim (teacher) recording is the gold standard for students learning tajweed. Slow, precise, and used in classrooms worldwide.",
  },
  {
    name: "Shaykh Muhammad Siddiq al-Minshawi",
    years: "1920 to 1969",
    known: "Voice of reflection",
    note: "Famous for his moving Mujawwad (ornate) recitation. Loved for the depth of feeling in his voice.",
  },
  {
    name: "Shaykh Abdul Basit Abdus Samad",
    years: "1927 to 1988",
    known: "Master of breath control",
    note: "Legendary reciter known for incredibly long, fluid breaths. Three-time winner of the world's best reciter title.",
  },
  {
    name: "Shaykh Mishary Rashid al-Afasy",
    years: "b. 1976",
    known: "Modern household name",
    note: "Kuwaiti reciter and imam. One of the most widely heard voices on Quran apps today. Clear, gentle, and accessible.",
  },
  {
    name: "Shaykh Abdur Rahman as-Sudais",
    years: "b. 1960",
    known: "Imam of Masjid al-Haram",
    note: "Chief imam of the Grand Mosque in Makkah. His Taraweeh and Qiyam recordings are heard by millions in Ramadan.",
  },
  {
    name: "Shaykh Maher al-Mu'aiqly",
    years: "b. 1969",
    known: "Imam of Masjid al-Haram",
    note: "Beloved imam known for calm, reflective pace. A popular choice for daily listening and memorization.",
  },
];

const videos = [
  {
    title: "Noorani Qaida for learning the Quran",
    url: "https://youtube.com/playlist?list=PLXMHFOJ1g5pgv5XHayGVLblZ_qSzVPGNv",
    level: "Absolute Beginner",
  },
  {
    title: "Learn Tajweed Easily",
    url: "https://youtube.com/playlist?list=PL6TlMIZ5ylgqM4Uuu7iAhIeuSdF0v9yxo",
    level: "Beginner",
  },
  {
    title: "30-day Tajweed Program",
    url: "https://youtube.com/playlist?list=PL6TlMIZ5ylgoA27YCmZYMCQCX7EUkfyHp",
    level: "Intermediate",
  },
  {
    title: "Quranic Arabic (Taught in Arabic)",
    url: "https://youtube.com/playlist?list=PL-ur_Gc8pkJyFIQOs9KOv1gGJM9t7yI_C",
    level: "Advanced",
  },
];

const externalTools = [
  {
    name: "Quran.com",
    url: "https://quran.com",
    description:
      "Read with tajweed-colored Mushaf, word-by-word translation, and verse-by-verse audio from dozens of reciters.",
  },
  {
    name: "Tarteel AI",
    url: "https://www.tarteel.ai",
    description:
      "AI-powered recitation assistant. Listens as you recite and flags mistakes in real time. Great for solo practice.",
  },
  {
    name: "Quranic Audio",
    url: "https://quranicaudio.com",
    description:
      "Free downloadable recordings from nearly every well-known reciter, organized by surah.",
  },
  {
    name: "Every Ayah",
    url: "https://everyayah.com",
    description:
      "Verse-by-verse MP3s in multiple paces (Muallim, Mujawwad, Murattal). Excellent for listening while memorizing.",
  },
];

const faq = [
  {
    q: "Do I need tajweed to read the Quran?",
    a: "Yes, at least the basics. The obligation is to pronounce letters correctly so that meaning is not changed. Without basic tajweed, many letters sound similar in English-trained ears but are actually different letters in Arabic, which can change the meaning entirely.",
  },
  {
    q: "Is it sinful to read without perfect tajweed?",
    a: "No. The Prophet ﷺ said the one who struggles with the Quran receives two rewards. What is required is that you try to learn and that major errors (lahn jali) which change the meaning are avoided. Subtle errors (lahn khafi) are a matter of excellence, not sin.",
  },
  {
    q: "Do I need a teacher?",
    a: "Strongly recommended. Makharij and sifat cannot be learned from books or videos alone because you cannot hear yourself accurately. A teacher catches what you cannot. If a qualified shaykh is unavailable, at minimum have a partner or use an AI tool like Tarteel.",
  },
  {
    q: "Noorani Qaidah or jump straight into tajweed?",
    a: "If you can already read Arabic fluidly, start with tajweed. If you pause to decode letters, do Qaidah first. Skipping Qaidah when you still struggle to read is the most common reason tajweed students plateau.",
  },
  {
    q: "What is the difference between tarteel and tajweed?",
    a: "Tajweed is the set of rules. Tarteel is a pace of recitation that applies those rules in a calm, measured way. Tajweed is what you learn, tarteel is one way you apply it.",
  },
  {
    q: "Which qira'ah should I learn?",
    a: "In most of the world, Hafs 'an Asim is the standard and the one taught by default. Other qira'at like Warsh and Qalun are also authentic and widely recited in parts of Africa. Learn Hafs first unless your community uses another.",
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
    href: "/quran/tafseer",
    title: "Tafseer Resources",
    description: "Understand the meanings of what you recite.",
  },
  {
    href: "/quran/reciters",
    title: "Listen to Reciters",
    description: "Browse recordings from the great reciters.",
  },
];

export const metadata = {
  title: "Tajweed",
  description:
    "Master the rules of Quran recitation: makharij, sifat, noon and meem rules, madd, the levels of recitation, and the best learning path.",
};

export default async function TajweedPage() {
  const books = await getTajweedBooks();

  return (
    <>
      <ContentHeader
        title="Tajweed"
        breadcrumbs={[
          { label: "Quran", href: "/quran" },
          { label: "Study", href: "/quran/study" },
          { label: "Tajweed" },
        ]}
        subtitle="Recite the Quran the way it was revealed"
      />

      <section className="max-w-7xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        {/* What is Tajweed? intro block */}
        <div className="bg-teal-100 rounded-2xl px-8 py-8 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-bold text-teal-900 mb-3 text-center font-[family-name:var(--font-playfair)]">
            What is Tajweed?
          </h2>
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[19px] leading-[1.65] text-center">
            Tajweed (التجويد) is the science of reciting the Quran the way it was
            revealed to the Prophet ﷺ. It gives each letter its correct articulation
            point, its proper characteristics, and its full rights in every ruling. It
            is the way the Quran has been preserved, sound for sound, for fourteen
            centuries.
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

        {/* Foundations of Qur'anic Recitation */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Foundations of Qur&apos;anic Recitation
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            The core terms and concepts every student of tajweed needs to understand.
          </p>

          {/* Hafs 'an Asim callout */}
          <div className="bg-teal-50 border-l-4 border-teal-700 rounded-2xl p-5 mb-5 flex items-start gap-3">
            <Info size={18} className="text-teal-700 shrink-0 mt-0.5" />
            <p className="text-sm text-teal-900 leading-relaxed">
              <span className="font-semibold">Note:</span> This guide applies
              specifically to{" "}
              <span className="font-semibold">Riwāyat Ḥafṣ ʿan ʿĀṣim</span>, the most
              widely recited qirā&apos;ah in the world today and the standard used in
              the majority of printed muṣḥafs.
            </p>
          </div>

          {/* 4 definition cards side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            {foundationTerms.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-baseline justify-between gap-3 mb-1 flex-wrap">
                  <h3 className="text-base font-bold text-teal-900">{t.name}</h3>
                  <span
                    className="font-[family-name:var(--font-amiri)] text-teal-700 text-xl"
                    dir="rtl"
                  >
                    {t.arabic}
                  </span>
                </div>
                <p className="text-xs text-teal-700 font-medium italic mb-3">
                  {t.rootMeaning}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">{t.definition}</p>
              </div>
            ))}
          </div>

          {/* Purpose / summary */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
            <p className="text-sm text-gray-700 leading-relaxed">
              Tajwīd preserves not only the beauty of the Qur&apos;an, but also its
              accuracy and integrity. The Qur&apos;an was revealed to be recited, and
              Allah commands:{" "}
              <span className="font-[family-name:var(--font-amiri)] text-teal-900">
                &ldquo;And recite the Qur&apos;an with measured recitation
                (tartīl).&rdquo;
              </span>{" "}
              <span className="text-xs text-gray-400">(73:4)</span> For this reason,
              learning and applying tajwīd is a means of preserving the exact words
              of the Qur&apos;an as they were revealed and recited by the Prophet ﷺ,
              ensuring that its message remains unchanged across generations.
            </p>
          </div>
        </div>

        {/* Applicability to Qira'at */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Scale size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Applicability to Qirā&apos;āt
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            How this guide relates to the other authentic recitations of the Qur&apos;an.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <h3 className="text-base font-bold text-teal-900 mb-2">
                Other riwāyāt differ in specific rules
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Recitations such as Warsh, Qalun, and Khalaf may differ slightly in
                their application of tajweed rules, including elongations (madd), the
                treatment of hamzah, and certain pronunciation details. These
                differences stem from authentic variations rooted in classical Arabic
                dialects and were transmitted through reliable chains of recitation.
                As a result, some rules explained in this guide may not apply
                identically to other riwāyāt.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <h3 className="text-base font-bold text-teal-900 mb-2">
                All are authentic and preserved
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                These variations reflect the diversity of classical Arabic dialects
                that were all correctly recited and approved by the Prophet ﷺ, and
                have been preserved exactly through continuous transmission. They
                highlight the richness, flexibility, and authenticity of the
                Qur&apos;anic recitation tradition. If you would like to learn more
                about qirā&apos;āt, riwāyāt, and the seven aḥruf, check the resources
                and books listed below.
              </p>
            </div>
          </div>
        </div>

        {/* Levels of Recitation */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Mic size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              The Four Levels of Recitation
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Classical scholars defined four valid paces. All of them fully apply
            tajweed. They differ only in speed.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {levelsOfRecitation.map((l) => (
              <div
                key={l.name}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex flex-col"
              >
                <p
                  className="font-[family-name:var(--font-amiri)] text-teal-900 text-2xl mb-1 text-center"
                  dir="rtl"
                >
                  {l.arabic}
                </p>
                <h3 className="text-base font-bold text-teal-900 text-center">
                  {l.name}
                </h3>
                <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider mb-3 text-center">
                  {l.pace}
                </p>
                <p className="text-sm text-gray-700 mb-3 flex-1">{l.description}</p>
                <p className="text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span className="font-semibold text-gray-700">Use: </span>
                  {l.useCase}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Core Subjects */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Layers size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Core Subjects of Tajweed
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            The major topics every tajweed course covers, in the order they are
            usually taught.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coreSubjects.map((s) => (
              <div
                key={s.name}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <h3 className="text-base font-bold text-teal-900">{s.name}</h3>
                <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider mb-2">
                  {s.translit}
                </p>
                <p className="text-sm text-gray-700">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Side-by-Side: Noon Sakinah Rules */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Scale size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Side-by-Side: Rules of the Silent Noon
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            The four rules for noon sakinah and tanween, shown together with
            triggering letters and a real example from the Quran.
          </p>
          <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-teal-900 text-white">
                    <th className="text-left font-semibold px-4 py-3">Rule</th>
                    <th className="text-left font-semibold px-4 py-3">Meaning</th>
                    <th className="text-left font-semibold px-4 py-3">Triggering Letters</th>
                    <th className="text-left font-semibold px-4 py-3">Example</th>
                    <th className="text-left font-semibold px-4 py-3">What Happens</th>
                  </tr>
                </thead>
                <tbody>
                  {noonSakinahRules.map((r, i) => (
                    <tr
                      key={r.rule}
                      className={i % 2 === 0 ? "bg-white" : "bg-teal-50/40"}
                    >
                      <td className="px-4 py-3 align-top whitespace-nowrap">
                        <div className="font-bold text-teal-900">{r.rule}</div>
                        <div
                          className="font-[family-name:var(--font-amiri)] text-teal-700 text-lg"
                          dir="rtl"
                        >
                          {r.arabic}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top text-gray-700">
                        {r.meaning}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div
                          className="font-[family-name:var(--font-amiri)] text-teal-900 text-lg leading-relaxed"
                          dir="rtl"
                        >
                          {r.letters}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{r.trigger}</div>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <span
                          className="font-[family-name:var(--font-amiri)] text-teal-900 text-xl"
                          dir="rtl"
                        >
                          {r.example}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-top text-gray-700 text-xs leading-relaxed">
                        {r.explanation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Which path should I start with? */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Compass size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Which Path Should I Start With?
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Three stages every serious reciter moves through.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {learningPaths.map((p) => (
              <div
                key={p.name}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex flex-col"
              >
                <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                  <h3 className="text-base font-bold text-teal-900">{p.name}</h3>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${p.levelColor}`}
                  >
                    {p.level}
                  </span>
                </div>
                <p className="text-xs text-teal-700 font-semibold mb-3">
                  Best for: {p.best}
                </p>
                <p className="text-sm text-gray-700 mb-3">{p.description}</p>
                <ul className="space-y-1.5 flex-1">
                  {p.strengths.map((s, j) => (
                    <li
                      key={j}
                      className="text-xs text-gray-600 flex items-start gap-2"
                    >
                      <span className="text-teal-700 mt-0.5 shrink-0">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Deep Dives */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Compass size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Deep Dives
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Each topic has its own focused page with tables, worked examples, and
            practical notes.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                href: "/quran/tajweed/improving-recitation",
                title: "Improving Your Recitation",
                description: "Three consistent practices, plus natural mouth and lip usage.",
                Icon: TrendingUp,
              },
              {
                href: "/quran/tajweed/reading-mushaf",
                title: "Reading from the Mushaf",
                description: "Visual cues that tell you which rule applies.",
                Icon: Eye,
              },
              {
                href: "/quran/tajweed/makharij",
                title: "Makharij al-Huruf",
                description: "Articulation points by practical zone.",
                Icon: Target,
              },
              {
                href: "/quran/tajweed/letter-weights",
                title: "Heavy & Light Letters",
                description: "Tafkheem, tarqeeq, and conditional letters.",
                Icon: Scale,
              },
              {
                href: "/quran/tajweed/madd",
                title: "Madd (Elongation)",
                description: "All four madd types with count tables.",
                Icon: Waves,
              },
              {
                href: "/quran/tajweed/qalqalah",
                title: "Qalqalah (Echo)",
                description: "The five echo letters and how to release them.",
                Icon: Activity,
              },
              {
                href: "/quran/tajweed/noon-tanween",
                title: "Noon Sakinah & Tanween",
                description: "Idhar, Idgham, Iqlab, Ikhfa in full depth.",
                Icon: GitMerge,
              },
              {
                href: "/quran/tajweed/waqf",
                title: "Waqf (Stopping)",
                description: "When to stop and what happens to the last letter.",
                Icon: Pause,
              },
            ].map((d) => (
              <Link
                key={d.href}
                href={d.href}
                className="group bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <d.Icon size={18} className="text-teal-700 shrink-0" />
                  <h3 className="text-base font-bold text-teal-900 group-hover:text-teal-700 transition-colors duration-200">
                    {d.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{d.description}</p>
                <span className="inline-flex items-center gap-1 text-xs text-teal-700 font-semibold">
                  Open <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
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
            This is why a teacher matters so much in tajweed. Repeating a mistake a
            thousand times does not fix it, it locks it in. Every session you recite
            to a qualified ear, you correct the small errors you cannot hear in
            yourself, which is the difference between progress and plateau.
          </p>
        </div>

        {/* Tajweed Books in the Library */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <BookOpen size={22} className="text-teal-700" />
              <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
                Tajweed Books in the Library
              </h2>
            </div>
            <Link
              href="/search?q=tajweed"
              className="text-sm text-teal-700 hover:text-teal-900 transition-colors inline-flex items-center gap-1"
            >
              <SearchIcon size={14} /> Search all
            </Link>
          </div>
          <p className="text-gray-500 mb-6">
            Printable Qaidah primers and full tajweed textbooks available in our
            library.
          </p>

          {books.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-sm text-gray-500 text-center shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              No Tajweed books available yet.{" "}
              <Link
                href="/books"
                className="text-teal-700 hover:text-teal-900 underline"
              >
                Browse all books
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {books.map((book) => (
                <Link
                  key={book.slug}
                  href={`/books/${book.category!.slug}/${book.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="relative aspect-[2/3] bg-teal-50 overflow-hidden">
                    {book.cover_url ? (
                      <Image
                        src={book.cover_url}
                        alt={book.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 p-3 text-center text-xs">
                        <BookOpen size={28} />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-teal-900 line-clamp-2 group-hover:text-teal-700 transition-colors duration-200">
                      {book.title}
                    </h3>
                    {book.author && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {book.author}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Famous Reciters */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Users size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Famous Reciters
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            The voices most widely listened to for learning and daily recitation.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reciters.map((r) => (
              <div
                key={r.name}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <h3 className="text-base font-bold text-teal-900">{r.name}</h3>
                <p className="text-xs text-gray-400 mb-1">{r.years}</p>
                <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider mb-2">
                  {r.known}
                </p>
                <p className="text-sm text-gray-700">{r.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Further Resources: videos + external */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Further Resources
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Video courses and online tools for practice and correction.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((v) => (
              <a
                key={v.url}
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Play size={16} className="text-teal-700 shrink-0" />
                  <h3 className="text-base font-bold text-teal-900 group-hover:text-teal-700 transition-colors duration-200 flex-1">
                    {v.title}
                  </h3>
                  <ExternalLink size={12} className="text-gray-400 shrink-0" />
                </div>
                <p className="text-xs text-gray-500">
                  {v.level} · YouTube playlist
                </p>
              </a>
            ))}
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
