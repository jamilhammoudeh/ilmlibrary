import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import {
  Calendar,
  HelpCircle,
  Layers,
  Scale,
  Users,
  Globe,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const hadithMotivation = [
  {
    text: "The best among you are those who learn the Quran and teach it.",
    source: "Sahih al-Bukhari 5027",
  },
  {
    text: "It will be said to the companion of the Quran: 'Read and ascend, and recite as you used to recite in the world, for your rank will be at the last verse you recite.'",
    source: "Sunan Abu Dawud 1464",
  },
  {
    text: "The one who recites the Quran and finds it difficult will have two rewards.",
    source: "Sahih al-Bukhari 4937, Sahih Muslim 798",
  },
];

const phases = [
  {
    name: "Phase 1: Preparation",
    description: "Build a strong foundation before you start memorizing",
    techniques: [
      {
        title: "Learn Tajweed First",
        description:
          "Memorizing incorrectly is much harder to fix later. Learn proper pronunciation rules before starting.",
        tips: [
          "Complete at least a basic Tajweed course (Noorani Qaida or equivalent)",
          "Focus on heavy letters (ص ض ط ظ), elongation rules (madd), and stopping rules",
          "Record yourself and compare with a teacher or a known reciter",
        ],
        link: { href: "/quran/tajweed", label: "Tajweed Resources" },
      },
      {
        title: "Find a Teacher or Partner",
        description:
          "Having someone to recite to is essential for catching mistakes you cannot hear in yourself.",
        tips: [
          "A qualified shaykh is ideal: they catch subtle errors in makharij (articulation points)",
          "If unavailable, find an online teacher or a memorization partner",
          "At minimum, record yourself and compare with Shaykh Husary's Muallim recitation",
        ],
      },
      {
        title: "Choose Your Mushaf",
        description:
          "Always use the same physical or digital Mushaf. Your brain memorizes the position of words on the page.",
        tips: [
          "The Madinah Mushaf is most common (15 lines per page, each page starts and ends with a verse)",
          "Stick with ONE Mushaf. Do not switch between different prints",
          "Keep it in a dedicated place to build a habitual connection",
        ],
      },
      {
        title: "Set Realistic Goals",
        description:
          "Consistency beats intensity. A small daily amount is better than occasional large sessions.",
        tips: [
          "Beginners: start with 3 to 5 verses per day",
          "Intermediate: half a page to 1 page per day",
          "Advanced: 1 to 2 pages per day",
          "Use the calculator on the Memorization hub to estimate your timeline",
        ],
        link: { href: "/quran/memorization", label: "Memorization Calculator" },
      },
    ],
  },
  {
    name: "Phase 2: Active Memorization",
    description: "The daily process of committing new verses to memory",
    techniques: [
      {
        title: "The 3x10 Method",
        description:
          "The most proven method used in traditional Quran schools worldwide.",
        tips: [
          "Step 1: Read the verse 10 times looking at the Mushaf",
          "Step 2: Read it 10 times from memory (close the Mushaf)",
          "Step 3: If you make a mistake, go back to Step 1",
          "Step 4: Connect it with the previous verse and repeat both together 10 times",
          "Step 5: Continue adding verses, always connecting back to the beginning of the section",
        ],
      },
      {
        title: "Listen Before You Memorize",
        description:
          "Hearing the verses repeatedly before memorizing them makes the process significantly easier.",
        tips: [
          "Listen to the same section 10 to 20 times before you start memorizing",
          "Use a slow, clear reciter like Shaykh Al-Husary (Muallim style)",
          "Listen during commute, exercise, or before sleep. Passive listening helps",
          "Follow along in the Mushaf while listening to connect visual and auditory memory",
        ],
        link: { href: "/quran/reciters", label: "Listen to Reciters" },
      },
      {
        title: "Read the Tafsir First",
        description:
          "Understanding what you are memorizing makes it 3 to 5 times easier to retain.",
        tips: [
          "Read a brief tafsir of the passage before memorizing (even just the translation)",
          "Know the context. Why was it revealed? What is the message?",
          "Understanding creates mental hooks that make verses stick",
          "Use Tafsir As-Sa'di for concise explanations or Ibn Kathir for depth",
        ],
        link: { href: "/quran/tafseer", label: "Tafseer Resources" },
      },
      {
        title: "Break Pages into Sections",
        description:
          "Do not try to memorize a whole page at once. Break it into 3 or 4 manageable chunks.",
        tips: [
          "Divide the page by topic or natural verse breaks",
          "Memorize each section separately, then connect them",
          "Once all sections are connected, repeat the full page 5 to 10 times",
          "Move on only when you can recite the page fluently without hesitation",
        ],
      },
      {
        title: "Use Multiple Senses",
        description: "The more senses you engage, the stronger the memory.",
        tips: [
          "See: Read from the Mushaf (visual memory of word positions)",
          "Hear: Listen to a reciter (auditory memory)",
          "Speak: Recite out loud, not silently (muscle memory of tongue movements)",
          "Write: Write out verses from memory to test yourself (kinesthetic memory)",
        ],
      },
    ],
  },
  {
    name: "Phase 3: Retention & Review",
    description:
      "Memorizing is easy compared to keeping it. Review is everything.",
    techniques: [
      {
        title: "The Golden Rule: New + Review",
        description:
          "Never memorize new material without reviewing old material. The ratio should be 20% new, 80% review.",
        tips: [
          "Daily: review yesterday's new portion plus recite your current Juz",
          "Weekly: review all Juz you have memorized at least once",
          "Monthly: do a full khatmah (complete recitation) of everything memorized",
          "A common schedule: new memorization after Fajr, review after Dhuhr, full Juz after Isha",
        ],
      },
      {
        title: "Spaced Repetition",
        description:
          "Review at increasing intervals: 1 day, 3 days, 1 week, 2 weeks, 1 month.",
        tips: [
          "Day 1: memorize new portion",
          "Day 2: review yesterday's plus memorize new",
          "Day 4: review Day 1's portion again",
          "Day 8: review again. If solid, move to monthly review",
          "If you stumble at any point, reset the interval back to daily",
        ],
      },
      {
        title: "Recite in Your Salah",
        description:
          "The best way to solidify memorization is to use it in prayer.",
        tips: [
          "Recite your newest memorization in the Sunnah prayers (less pressure)",
          "Gradually move it to Fardh prayers as it becomes solid",
          "Night prayer (Tahajjud or Qiyam) is the best time: quiet, focused, spiritually rewarding",
          "The Prophet ﷺ said the companion of the Quran will be crowned on the Day of Judgment",
        ],
      },
      {
        title: "Test Yourself",
        description:
          "If you cannot recite it without looking, you have not memorized it.",
        tips: [
          "Close the Mushaf and recite. Check for mistakes after",
          "Have someone test you by reading the first word and you complete the verse",
          "Try writing verses from memory. This exposes weak spots",
          "Recite to a partner and have them follow along in the Mushaf",
        ],
      },
      {
        title: "Connect Verses by Theme",
        description:
          "Understanding how verses connect prevents the 'I know the verse but not what comes next' problem.",
        tips: [
          "Note the first word of each verse. These are your hooks",
          "Understand the flow of the passage. What topic leads into the next?",
          "Group similar surahs together (the Qul surahs, the Musabbihat, etc.)",
          "Memorize transitions between pages. These are the most common weak spots",
        ],
      },
    ],
  },
  {
    name: "Phase 4: Lifestyle & Mindset",
    description:
      "Your habits outside of memorization directly affect your ability to retain",
    techniques: [
      {
        title: "Best Times to Memorize",
        description: "Your brain has peak performance windows. Use them.",
        tips: [
          "After Fajr is the #1 recommended time. The mind is fresh and the barakah is greatest",
          "Before sleep is #2. The brain consolidates memory during sleep",
          "Avoid memorizing when tired, hungry, or distracted",
          "Consistency matters more than duration. 20 focused minutes beats 2 distracted hours",
        ],
      },
      {
        title: "Protect Your Memory",
        description:
          "Sins, distractions, and poor habits directly weaken memorization ability.",
        tips: [
          "Imam ash-Shafi'i said: 'I complained to Wakī' about my poor memory, and he advised me to abandon sins'",
          "Reduce screen time and social media. These fragment your attention",
          "Eat healthy, sleep well, exercise. Your body affects your mind",
          "Make dua constantly: 'Rabbi zidni ilma' (My Lord, increase me in knowledge)",
        ],
      },
      {
        title: "Don't Compare Yourself",
        description:
          "Everyone's pace is different. The one who struggles gets double the reward.",
        tips: [
          "The Prophet ﷺ said the one who recites the Quran and finds it difficult will have two rewards",
          "Some people memorize a page in 30 minutes, others need 3 hours. Both are valid",
          "Focus on consistency, not speed",
          "A person who memorizes 3 verses a day will finish the Quran in about 5.5 years, and that is perfectly fine",
        ],
      },
      {
        title: "Make It a Lifestyle",
        description:
          "The Quran should be part of your daily routine, not an extra task.",
        tips: [
          "Set a fixed time and place. Make it non-negotiable like eating or sleeping",
          "Join a memorization circle (halaqah). Community accountability is powerful",
          "Teach others what you have memorized. Teaching is the deepest form of learning",
          "Set milestone celebrations: completing a Juz, a Surah, or reaching a personal goal",
        ],
      },
    ],
  },
];

const methods = [
  {
    name: "The 3x10 Method",
    level: "Beginner",
    levelColor: "bg-emerald-100 text-emerald-900",
    daily: "3 to 5 verses",
    timeline: "5 to 7 years",
    best: "First-time memorizers with a flexible schedule",
    description:
      "Read 10 times looking, 10 times from memory, connect with the previous verse 10 times. Classic, proven, forgiving. Easy to pick up and drop back into.",
    strengths: [
      "Extremely forgiving for beginners",
      "Builds confidence through small wins",
      "Works without a teacher (though a teacher helps)",
    ],
  },
  {
    name: "Traditional Madrasah",
    level: "Intermediate",
    levelColor: "bg-amber-100 text-amber-900",
    daily: "Set by teacher, usually a page or more",
    timeline: "2 to 4 years",
    best: "Students enrolled in a hifdh program or with a regular teacher",
    description:
      "Daily sabaq (new portion), sabaqi (recent review), and manzil (long-term review) under a teacher. The system used in hifdh schools worldwide.",
    strengths: [
      "Fastest reliable pace",
      "Built-in accountability and correction",
      "Produces strong, lasting memorization",
    ],
  },
  {
    name: "Juz-at-a-Time",
    level: "Intermediate",
    levelColor: "bg-sky-100 text-sky-900",
    daily: "Whatever amount fits one juz per month",
    timeline: "2 to 3 years",
    best: "Motivated adults with regular schedules",
    description:
      "Commit to finishing one juz per month. Break the juz into pages, then into thirds. Review past juz constantly while adding.",
    strengths: [
      "Clear, motivating milestones",
      "Good pace for working professionals",
      "Easy to measure progress",
    ],
  },
  {
    name: "Page-a-Day",
    level: "Advanced",
    levelColor: "bg-rose-100 text-rose-900",
    daily: "One full page",
    timeline: "About 2 years",
    best: "Experienced memorizers or people in a dedicated program",
    description:
      "Ambitious but possible. Requires 2 to 4 hours of focused work daily between new memorization and review.",
    strengths: [
      "Fast completion",
      "Forces high quality review habits",
      "Best-suited for gap years or concentrated study periods",
    ],
  },
];

const sampleSchedule = [
  {
    time: "After Fajr",
    block: "New Memorization",
    focus: "Today's new verses (sabaq)",
    duration: "30 to 60 min",
  },
  {
    time: "Mid-Morning",
    block: "Listen",
    focus: "Listen to tomorrow's portion while doing chores",
    duration: "20 min",
  },
  {
    time: "After Dhuhr",
    block: "Recent Review",
    focus: "Past 7 days (sabaqi)",
    duration: "20 to 30 min",
  },
  {
    time: "After Asr",
    block: "Salah Application",
    focus: "Recite newest portion in Sunnah prayers",
    duration: "in salah",
  },
  {
    time: "After Maghrib",
    block: "Long-term Review",
    focus: "Current juz (manzil)",
    duration: "30 min",
  },
  {
    time: "Before Sleep",
    block: "Light Review",
    focus: "Tomorrow's portion once, then sleep on it",
    duration: "10 min",
  },
];

const obstacles = [
  {
    problem: "I keep forgetting what I memorized",
    solution:
      "Your review ratio is too low. Flip it to 20% new / 80% review. If you memorized 5 pages and are adding a 6th, review all 5 pages every day before starting new memorization.",
  },
  {
    problem: "I lost motivation and stopped",
    solution:
      "Motivation is unreliable. Build a routine instead. Start again with a very small daily amount (3 verses) at a fixed time. Join a halaqah so other people expect your progress.",
  },
  {
    problem: "I keep mixing up similar-sounding verses",
    solution:
      "These are called mutashābihāt. Study them together and note the specific word that differs. This is a normal stage that every hafidh goes through.",
  },
  {
    problem: "I recite fast and make mistakes",
    solution:
      "Slow down deliberately. Speed is the enemy of tajweed and of new memorization. Use hadr pace only for reviewing what is already strong, never for learning.",
  },
  {
    problem: "I cannot find time in my day",
    solution:
      "Anchor sessions to existing habits: right after wudu, right after salah, on your commute. 20 minutes a day consistently beats 2 hours once a week.",
  },
  {
    problem: "I feel too old to start",
    solution:
      "Many adults have completed hifdh in their 40s, 50s, and beyond. Your pace will be slower than a 10-year-old, but the reward is not slower. Start with the last juz (juz 30) since you likely already know most of it.",
  },
];

const famousMemorizers = [
  {
    name: "Imam ash-Shafi'i",
    years: "150-204 AH",
    known: "Memorized the Quran at 7",
    note: "Memorized the Qur'an by age 7, the Muwatta of Imam Malik by age 10. Famous for his advice on abandoning sins to strengthen memory.",
  },
  {
    name: "Imam al-Bukhari",
    years: "194-256 AH",
    known: "Memorized 100,000+ hadith",
    note: "Known for his extraordinary memory. Could recall every isnad (chain of narrators) by heart. His memory was built on a lifetime of daily discipline.",
  },
  {
    name: "Imam an-Nawawi",
    years: "631-676 AH",
    known: "Scholar and prolific memorizer",
    note: "Memorized the Qur'an young, then dozens of major texts in fiqh, hadith, and Arabic. Died at 44 having authored some of the most read Islamic books in history.",
  },
  {
    name: "Shaykh Mahmoud al-Husary",
    years: "1917-1980 CE",
    known: "Hafidh and teaching reciter",
    note: "A modern master whose Muallim-style recording is used by students worldwide to memorize. His recitation is deliberately slow and clear for learners.",
  },
  {
    name: "Shaykh Abdul Basit Abdus Samad",
    years: "1927-1988 CE",
    known: "Three-time world champion reciter",
    note: "Beyond his legendary voice, his deep memorization and ability to hold long breaths while reciting from memory is legendary.",
  },
  {
    name: "Shaykh Abdur Rahman as-Sudais",
    years: "b. 1960 CE",
    known: "Imam of Masjid al-Haram",
    note: "Memorized the Quran at age 12. Leads Taraweeh every Ramadan for millions, reciting the entire Qur'an from memory over the month.",
  },
];

const resources = [
  {
    name: "Tarteel AI",
    url: "https://www.tarteel.ai",
    description:
      "Listens as you recite and flags mistakes in real time. Great for solo memorization practice and review.",
  },
  {
    name: "Quran Companion",
    url: "https://www.quran-companion.com",
    description:
      "Hifdh tracking app with SRS-style review scheduling, streaks, and community features.",
  },
  {
    name: "Every Ayah",
    url: "https://everyayah.com",
    description:
      "Free verse-by-verse MP3s in multiple paces (Muallim, Murattal, Mujawwad). Excellent for slow listen-before-memorize sessions.",
  },
  {
    name: "Quran.com",
    url: "https://quran.com",
    description:
      "Read, listen, and study side-by-side with tafseer, translation, and word-by-word for every verse.",
  },
];

const faq = [
  {
    q: "How long will hifdh take me?",
    a: "Depending on your pace, anywhere from 2 to 10 years. Most adults with consistent daily practice finish in 4 to 6 years. There is no shame in taking 10 years. The one who struggles with the Qur'an has two rewards.",
  },
  {
    q: "Is it too late to start as an adult?",
    a: "No. Many adults have finished hifdh in their 40s, 50s, and 60s. Adults have advantages children don't: understanding meaning, discipline, and life experience that connects with the Qur'an's lessons. The pace is slower but the reward is not.",
  },
  {
    q: "Do I need to know Arabic?",
    a: "No, but understanding the meaning dramatically speeds up memorization. Even reading the translation alongside your memorization gives your brain context to anchor to. Start with tafsir at the same time if you don't know Arabic.",
  },
  {
    q: "Should I memorize in order or out of order?",
    a: "Start from juz 30 (back of the Mushaf) since the short surahs are already familiar from salah. Then jump to juz 1 and move forward normally. Some teachers prefer strict order from juz 1; both work.",
  },
  {
    q: "What if I forget a whole juz?",
    a: "This happens. Re-memorize it, but much faster than the first time (roughly 3 to 5 times faster). Your brain retains underlying patterns even when surface recall fades. Don't panic, just rebuild it with daily review.",
  },
  {
    q: "How do I stay consistent?",
    a: "Three things: a fixed time (non-negotiable, like Fajr), a small daily amount (tiny enough that you can't justify skipping), and accountability (a teacher, a partner, or a halaqah). Motivation is optional; the routine is not.",
  },
];

const related = [
  {
    href: "/quran/memorization",
    title: "Memorization Hub",
    description: "The full overview with calculator and quick references.",
  },
  {
    href: "/quran/memorize/practice",
    title: "Practice Page",
    description: "Hide the Arabic and test your memorization verse by verse.",
  },
  {
    href: "/quran/tajweed",
    title: "Tajweed",
    description: "Master pronunciation before you memorize.",
  },
  {
    href: "/quran/tafseer",
    title: "Tafseer",
    description: "Understand what you memorize for stronger retention.",
  },
];

export const metadata = {
  title: "Quran Memorization Techniques",
  description:
    "A structured guide to memorizing the Qur'an: four phases, methods comparison, daily schedule, common obstacles, and famous memorizers.",
};

export default function MemorizationTechniquesPage() {
  return (
    <>
      <ContentHeader
        title="Memorization Techniques"
        subtitle="A structured path from beginner to hafidh"
        breadcrumbs={[
          { label: "Quran", href: "/quran" },
          { label: "Memorize", href: "/quran/memorize" },
          { label: "Techniques" },
        ]}
      />

      <section className="max-w-6xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        {/* Intro */}
        <div className="bg-teal-100 rounded-2xl px-8 py-8 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-bold text-teal-900 mb-3 text-center font-[family-name:var(--font-playfair)]">
            Hifdh al-Qur&apos;an
          </h2>
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[19px] leading-[1.65] text-center">
            Memorizing the Qur&apos;an (hifdh) is one of the greatest acts of
            worship in Islam. This guide brings together the methods used by
            scholars and memorization teachers across the world: four phases,
            several working methods, a realistic schedule template, and the
            obstacles you will face with specific solutions for each.
          </p>
        </div>

        {/* Motivation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-12">
          {hadithMotivation.map((h, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] border-l-4 border-teal-700"
            >
              <p className="text-gray-700 italic text-sm leading-relaxed">
                &ldquo;{h.text}&rdquo;
              </p>
              <p className="text-xs text-gray-400 mt-2">{h.source}</p>
            </div>
          ))}
        </div>

        {/* Perfect practice callout */}
        <div className="mb-12 bg-teal-900 text-white rounded-2xl px-8 py-8 shadow-[0_4px_12px_rgba(0,0,0,0.12)] text-center">
          <p className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-playfair)] leading-tight mb-3">
            Memorization is not practice that makes perfect.
            <br />
            It&apos;s <span className="text-teal-200">perfect practice</span>{" "}
            that makes perfect.
          </p>
          <p className="text-sm text-teal-100 max-w-2xl mx-auto leading-relaxed">
            Memorizing a verse with wrong tajweed or a missed word locks that
            mistake in for years. Slow down, get it right the first time, and
            review relentlessly. Every one of the techniques below assumes you
            are memorizing carefully, not quickly.
          </p>
        </div>

        {/* 4 Phases */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Layers size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              The Four Phases
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            A complete hifdh plan covers preparation, active memorization,
            retention, and lifestyle. Shortcutting any one of these will cost
            you later.
          </p>

          <div className="space-y-10">
            {phases.map((phase, pi) => (
              <div key={pi}>
                <div className="mb-4 flex items-baseline gap-3 flex-wrap">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-900 text-white">
                    {pi + 1} / 4
                  </span>
                  <h3 className="text-xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
                    {phase.name.replace(/Phase \d+:\s*/, "")}
                  </h3>
                  <p className="text-sm text-gray-500">{phase.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {phase.techniques.map((tech, ti) => (
                    <div
                      key={ti}
                      className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex flex-col"
                    >
                      <h4 className="text-base font-bold text-teal-900 mb-2">
                        {tech.title}
                      </h4>
                      <p className="text-sm text-gray-700 mb-3">
                        {tech.description}
                      </p>
                      <ul className="space-y-1.5 mb-3 flex-1">
                        {tech.tips.map((tip, j) => (
                          <li
                            key={j}
                            className="text-sm text-gray-600 flex items-start gap-2"
                          >
                            <span className="text-teal-700 mt-0.5 shrink-0">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                      {tech.link &&
                        (tech.link.href.startsWith("http") ? (
                          <a
                            href={tech.link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-teal-700 hover:text-teal-900 font-semibold inline-flex items-center gap-1 mt-auto"
                          >
                            {tech.link.label} <ArrowRight size={14} />
                          </a>
                        ) : (
                          <Link
                            href={tech.link.href}
                            className="text-sm text-teal-700 hover:text-teal-900 font-semibold inline-flex items-center gap-1 mt-auto"
                          >
                            {tech.link.label} <ArrowRight size={14} />
                          </Link>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Methods side-by-side */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Scale size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Side-by-Side: Which Method Fits You?
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Four realistic approaches. None is objectively best. Pick the one
            that matches your time, teacher access, and life stage.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {methods.map((m) => (
              <div
                key={m.name}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex flex-col"
              >
                <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                  <h3 className="text-base font-bold text-teal-900">
                    {m.name}
                  </h3>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${m.levelColor}`}
                  >
                    {m.level}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-gray-500 uppercase tracking-wider text-[10px] font-semibold mb-0.5">
                      Daily amount
                    </p>
                    <p className="text-gray-800 font-semibold">{m.daily}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-gray-500 uppercase tracking-wider text-[10px] font-semibold mb-0.5">
                      Timeline
                    </p>
                    <p className="text-gray-800 font-semibold">{m.timeline}</p>
                  </div>
                </div>
                <p className="text-xs text-teal-700 font-semibold mb-3">
                  Best for: {m.best}
                </p>
                <p className="text-sm text-gray-700 mb-3">{m.description}</p>
                <ul className="space-y-1.5 flex-1">
                  {m.strengths.map((s, i) => (
                    <li
                      key={i}
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

        {/* Sample daily schedule */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Sample Daily Schedule
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            A realistic hifdh day, anchored to salah times. Adjust the durations
            to your pace; keep the structure.
          </p>
          <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-teal-900 text-white">
                    <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">
                      Time
                    </th>
                    <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">
                      Block
                    </th>
                    <th className="text-left font-semibold px-4 py-3">
                      Focus
                    </th>
                    <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sampleSchedule.map((row, i) => (
                    <tr
                      key={row.time}
                      className={i % 2 === 0 ? "bg-white" : "bg-teal-50/40"}
                    >
                      <td className="px-4 py-3 font-semibold text-teal-900 whitespace-nowrap">
                        {row.time}
                      </td>
                      <td className="px-4 py-3 text-teal-700 font-medium">
                        {row.block}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{row.focus}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {row.duration}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Common obstacles */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Common Obstacles &amp; Solutions
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Every hafidh hits these walls. The fix is rarely effort. It is a
            change in approach.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {obstacles.map((o) => (
              <div
                key={o.problem}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={16} className="text-rose-500" />
                  <h3 className="text-sm font-bold text-teal-900">
                    {o.problem}
                  </h3>
                </div>
                <div className="flex items-start gap-2 mt-3 bg-emerald-50/60 rounded-xl p-3">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {o.solution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Famous memorizers */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Users size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Famous Huffadh
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            The scholars and reciters whose memorization shaped how we study
            today.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {famousMemorizers.map((m) => (
              <div
                key={m.name}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <h3 className="text-base font-bold text-teal-900">{m.name}</h3>
                <p className="text-xs text-gray-400 mb-1">{m.years}</p>
                <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider mb-2">
                  {m.known}
                </p>
                <p className="text-sm text-gray-700">{m.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Further resources */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Further Resources
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Apps and websites that support hifdh. Pick one or two and stick with
            them.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {resources.map((r) => (
              <a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Globe size={14} className="text-teal-700 shrink-0" />
                  <h3 className="text-base font-bold text-teal-900 group-hover:text-teal-700 transition-colors">
                    {r.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">{r.description}</p>
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
