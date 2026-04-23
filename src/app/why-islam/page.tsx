import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import {
  BookOpen,
  HandHeart,
  Compass,
  Shield,
  HelpCircle,
  ArrowRight,
  Info,
  Users,
  Star,
  Feather,
  Globe,
  MessageCircle,
  CheckCircle2,
  Flame,
} from "lucide-react";

const motivation = [
  {
    text: "Indeed, the religion in the sight of Allah is Islam.",
    source: "Surah Āl ʿImrān 3:19",
  },
  {
    text: "There is no compulsion in religion. The right way has become clearly distinct from error.",
    source: "Surah Al-Baqarah 2:256",
  },
  {
    text: "I have only created jinn and mankind so they may worship Me.",
    source: "Surah Adh-Dhāriyāt 51:56",
  },
];

const whatIsIslam = [
  {
    title: "The meaning of the word",
    description:
      "Islam (إسلام) comes from the Arabic root s-l-m, meaning peace and surrender. A Muslim (مسلم) is someone who has surrendered willingly to the one true God, Allah. The same root gives the word salām, meaning peace. Islam, at its heart, is peace through surrender to the Creator.",
  },
  {
    title: "The message",
    description:
      "Islam teaches that there is one God, Allah, who created everything, sustains everything, and alone deserves to be worshipped. He sent prophets throughout history (Adam, Noah, Abraham, Moses, Jesus, and others, peace be upon them all) with the same core message. The final of these prophets was Muhammad ﷺ, whose message is preserved in the Qur'an.",
  },
  {
    title: "The invitation",
    description:
      "Islam is an invitation, not a pressure. The Qur'an says clearly there is no compulsion in religion. What Islam offers is clarity about who God is, purpose for why we are here, and a path for how to live in a way that pleases Him and benefits others.",
  },
];

const fivePillars = [
  {
    num: "1",
    name: "Shahādah",
    arabic: "الشهادة",
    english: "Declaration of faith",
    detail:
      "Bearing witness that there is no deity worthy of worship except Allah, and that Muhammad ﷺ is His Messenger. A single sincere declaration of this is what enters someone into Islam.",
  },
  {
    num: "2",
    name: "Ṣalāh",
    arabic: "الصلاة",
    english: "Prayer five times daily",
    detail:
      "Five daily prayers at set times: Fajr (pre-dawn), Ẓuhr (midday), ʿAṣr (afternoon), Maghrib (sunset), and ʿIshāʾ (night). A direct connection between the servant and Allah, multiple times a day.",
  },
  {
    num: "3",
    name: "Zakāh",
    arabic: "الزكاة",
    english: "Obligatory charity",
    detail:
      "Giving 2.5% of qualifying wealth each lunar year to the poor and other eligible recipients. A purification of wealth and a pillar of economic justice in Islam.",
  },
  {
    num: "4",
    name: "Ṣawm",
    arabic: "الصوم",
    english: "Fasting in Ramadan",
    detail:
      "Fasting from dawn to sunset throughout the month of Ramadan: no food, drink, or intimate relations during daylight hours. A month of spiritual reset, gratitude, and closeness to Allah.",
  },
  {
    num: "5",
    name: "Ḥajj",
    arabic: "الحج",
    english: "Pilgrimage to Makkah",
    detail:
      "A pilgrimage to Makkah, performed once in a lifetime for those who are physically and financially able. It gathers millions of Muslims from every nation in one place, dressed the same, doing the same rites, reminding humanity that all are equal before Allah.",
  },
];

const sixArticles = [
  {
    name: "Belief in Allah",
    detail:
      "That He exists, is one without partner, is the Creator and Sustainer of everything, and has the names and attributes He described for Himself in the Qur'an.",
  },
  {
    name: "Belief in the Angels",
    detail:
      "Creatures of light who do not disobey Allah. Examples: Jibrīl, who brought revelation; Mīkāʾīl, appointed over rain; Isrāfīl, who will blow the horn.",
  },
  {
    name: "Belief in the Books",
    detail:
      "Including the Scrolls of Ibrāhīm, the Tawrāh (to Mūsā), the Zabūr (to Dāwūd), the Injīl (to ʿĪsā), and the Qur'ān (to Muḥammad ﷺ). The Qur'ān is the final, preserved revelation.",
  },
  {
    name: "Belief in the Messengers",
    detail:
      "Every prophet Allah sent, from Adam to Muhammad ﷺ, peace be upon them all. Muslims honour Moses, Jesus, and all the prophets as true messengers of the same God.",
  },
  {
    name: "Belief in the Last Day",
    detail:
      "Death, the grave, resurrection, the judgement, Paradise, and Hell. Every soul will be accountable for what it did.",
  },
  {
    name: "Belief in Qadar",
    detail:
      "Allah's divine decree. He has knowledge of everything, has written everything, and nothing happens outside His will, yet humans still have real choice and real responsibility.",
  },
];

const whyThisHub = [
  {
    href: "/why-islam/proving-islam",
    title: "Proving Islam",
    subtitle: "The evidences",
    description:
      "Arguments and evidences that Islam is true: the miraculous nature of the Qur'an, the fulfilled prophecies, the preserved Sunnah, and the rational case for the existence of one Creator.",
    icon: Star,
  },
  {
    href: "/why-islam/defending-islam",
    title: "Defending Islam",
    subtitle: "Addressing misconceptions",
    description:
      "Clear, respectful answers to the most common questions and misconceptions about Islam, from issues of women's rights to jihad to prayer to other faiths.",
    icon: Shield,
  },
  {
    href: "/why-islam/refutations",
    title: "Refutations",
    subtitle: "Responding to specific claims",
    description:
      "Focused responses to specific attacks and claims made against Islam. Scholarly, sourced, and calm.",
    icon: MessageCircle,
  },
];

const signsOfTruth = [
  {
    title: "The Qur'an itself",
    detail:
      "Revealed to an unlettered man in 7th century Arabia, in a linguistic form that the Arabs, the world's masters of Arabic, could not match. The Qur'an itself challenges anyone to produce even one chapter like it (Al-Baqarah 2:23). 1,400 years later, the challenge stands unanswered.",
  },
  {
    title: "Preserved without change",
    detail:
      "Allah promised to preserve the Qur'an (Al-Ḥijr 15:9), and He did. The text is identical from Morocco to Indonesia, memorized cover to cover by millions in every generation. Compare a modern muṣḥaf with the earliest known copies and you will find the same letters, the same words, the same order.",
  },
  {
    title: "The character of Muhammad ﷺ",
    detail:
      "Before prophethood he was known as al-Ṣādiq al-Amīn (the truthful, the trustworthy) among people who later opposed him. He did not seek wealth, power, or status. His life is the best-documented in history of any religious founder, with tens of thousands of reports preserved with chains of transmission.",
  },
  {
    title: "Pure, rational monotheism",
    detail:
      "Islam's concept of God (tawḥīd) is coherent, simple, and undiluted. One God, eternal, all-powerful, merciful, just, with no partner, no offspring, no equal. This is what prophets from Adam to Jesus taught, restored by Muhammad ﷺ in its pure form.",
  },
  {
    title: "A message for all people",
    detail:
      "Islam does not belong to one race, tribe, or nation. It was delivered in Arabic, but its message is for all humanity. Today its followers speak every language, live on every continent, and come from every background.",
  },
  {
    title: "An authentic chain to the Prophet ﷺ",
    detail:
      "The Sunnah (teachings and practice of the Prophet ﷺ) was preserved through a meticulous science of chain authentication (isnād) that no other religion or tradition developed at the same level. Every hadith is traced through named narrators whose lives and reliability were carefully examined.",
  },
];

const beautyOfIslam = [
  {
    title: "A direct line to God",
    detail:
      "No priests, no saints, no hierarchy between you and Allah. Any Muslim, anywhere, any time, can raise their hands and speak directly to their Creator in their own language. The relationship is yours alone.",
  },
  {
    title: "Mercy at the heart",
    detail:
      "113 of the 114 chapters of the Qur'an open with 'In the name of Allah, the Most Gracious, the Most Merciful'. The Prophet ﷺ said Allah's mercy overtakes His anger. Mercy is not a footnote in Islam; it is the frame.",
  },
  {
    title: "Justice as a duty",
    detail:
      "The Qur'an commands believers to stand firmly for justice, even if it is against themselves, their parents, or their relatives (An-Nisāʾ 4:135). Justice is not merely an ideal, it is an obligation on every Muslim in every interaction.",
  },
  {
    title: "Meaning and purpose",
    detail:
      "Why are we here? Islam answers clearly: to know Allah, worship Him, and live in the way He has guided. Every moment of life, from work to family to worship, can be an act of devotion when the intention is right.",
  },
  {
    title: "Comprehensive guidance",
    detail:
      "Islam gives direction on prayer, business, family, food, speech, hygiene, rest, and grief. Nothing in life is too small for guidance. This is not a burden, it is a gift: you never have to guess what is pleasing to your Creator.",
  },
  {
    title: "Universal brotherhood",
    detail:
      "Stand in prayer behind an imam and you will find bankers next to mechanics, kings next to the poor, all facing the same direction, saying the same words. At Hajj, millions dress identically, reminding the world that no race, wealth, or status matters before Allah.",
  },
  {
    title: "Structure and freedom together",
    detail:
      "Five daily prayers structure your day. Zakāh structures your wealth. Ramadan structures your year. Within that structure, Islam gives you vast freedom: where to live, what profession to pursue, what to wear, whom to marry, within a few clear limits.",
  },
  {
    title: "The heart and the limbs together",
    detail:
      "Islam does not separate ritual from ethics. Prayer matters and so does how you treat your neighbour. Fasting matters and so does your honesty in business. The outer actions and the inner state of the heart are both worship.",
  },
];

const quranHighlights = [
  {
    title: "Preserved word for word",
    detail:
      "The Qur'an has been memorized cover to cover by millions of Muslims in every generation since its revelation, and has been preserved in Arabic without a single letter changed. You can still find Qur'ans from the earliest centuries matching what is recited today.",
  },
  {
    title: "Revealed over 23 years",
    detail:
      "Not all at once, but gradually, responding to events as they unfolded. Yet the whole of it holds together as a single, consistent message with no contradictions.",
  },
  {
    title: "Not poetry, not prose, not any known form",
    detail:
      "Arabs at the time of revelation were masters of Arabic poetry, yet even the most eloquent among them could not produce a single chapter like it. The Qur'an itself challenges anyone to try (Al-Baqarah 2:23).",
  },
  {
    title: "Recited in the same Arabic everywhere",
    detail:
      "From Morocco to Indonesia, in every mosque, the Qur'an is recited in the exact same classical Arabic it was revealed in. No translation is considered the Qur'an itself, only an approximation of its meaning.",
  },
];

const newMuslimStart = [
  {
    step: "1",
    title: "Read the Shahādah with understanding",
    detail:
      "The declaration: 'Ash-hadu an lā ilāha illā Allāh, wa ash-hadu anna Muḥammadan rasūlullāh.' (I bear witness that there is no deity worthy of worship except Allah, and I bear witness that Muḥammad is the Messenger of Allah.) Saying this sincerely, with conviction, makes you a Muslim.",
  },
  {
    step: "2",
    title: "Connect with a local Muslim community",
    detail:
      "Visit your local masjid. Most masājid will warmly welcome new Muslims and often have dedicated resources, classes, and mentors. You do not have to navigate this alone.",
  },
  {
    step: "3",
    title: "Learn how to pray",
    detail:
      "The five daily prayers are the next foundational step. Start with the short surahs and the physical movements. A local imam or new-Muslim class will teach you this in days.",
  },
  {
    step: "4",
    title: "Start reading and reflecting on the Qur'an",
    detail:
      "Begin with a reliable English translation like Saheeh International or the Clear Quran. Read slowly, reflect, and let the words speak. Pair it with a short tafsir like Tafsir as-Saʿdī for context.",
  },
];

const faq = [
  {
    q: "Do Muslims worship the same God as Christians and Jews?",
    a: "Muslims believe in the one Creator: the same God worshipped by Abraham, Moses, Jesus, and all the prophets. The Arabic word for God is 'Allah', used by Arabic-speaking Christians and Jews as well. Where Islam differs is in believing that God is absolutely one, with no son, no partner, and no equal.",
  },
  {
    q: "Do Muslims believe in Jesus?",
    a: "Yes, and a Muslim cannot be a Muslim without believing in Jesus (ʿĪsā عليه السلام). Muslims believe he was a great prophet, born of the Virgin Mary by a miracle, that he performed miracles by Allah's permission, and that he will return before the Day of Judgement. Muslims honour him deeply. The difference from Christianity is that Muslims believe he was a prophet sent by God, not God incarnate or the son of God.",
  },
  {
    q: "Is Islam a religion of peace?",
    a: "The word Islam itself comes from peace (salām). Muslims greet each other with 'as-salāmu ʿalaykum' (peace be upon you). Islam teaches justice, mercy, and dignity. Like any religion with 1.8 billion followers, there are people who act badly in its name. The Qur'an and the teachings of the Prophet ﷺ should be judged by their own words, not by the worst actions of some who claim them.",
  },
  {
    q: "Do I have to become Muslim to learn about Islam?",
    a: "Absolutely not. The Qur'an itself says there is no compulsion in religion (2:256). Explore, ask questions, read, attend a lecture at a local masjid. Most Muslims are happy to answer honest questions. Understanding a faith is a good thing in itself.",
  },
  {
    q: "What are the biggest misunderstandings about Islam?",
    a: "That Islam oppresses women, that it is spread by the sword, that it is anti-science, and that it is a foreign or Arab religion. None of these are accurate to the faith's teachings or its actual history. The 'Defending Islam' sub-section on this site addresses these in detail.",
  },
  {
    q: "How do I become Muslim?",
    a: "With a single sincere declaration: that there is no deity worthy of worship except Allah, and that Muhammad ﷺ is His Messenger. That is all. You do not need a ceremony, a class, or permission from anyone. Once sincere, you are a Muslim and can begin learning how to pray, fast, and live the faith.",
  },
  {
    q: "I am exploring but not ready yet. What should I do?",
    a: "Take your time. Read the Qur'an with an open heart. Visit a masjid and ask questions. Talk to thoughtful Muslims. Allah does not rush anyone, and sincere seeking is itself honourable. The door is always open whenever you are ready.",
  },
];

const related = [
  {
    href: "/quran",
    title: "The Qur'an",
    description: "Read the primary source of Islam for yourself.",
  },
  {
    href: "/guides/aqeedah",
    title: "Aqeedah Guide",
    description: "A structured path into Islamic belief.",
  },
  {
    href: "/guides/seerah",
    title: "Seerah of the Prophet ﷺ",
    description: "Learn who Muhammad ﷺ was and what he taught.",
  },
  {
    href: "/guides",
    title: "All Islamic Guides",
    description: "Browse beginner-friendly guides on every topic.",
  },
];

export const metadata = {
  title: "Why Islam",
  description:
    "An introduction to Islam: what it teaches, why Muslims believe, and resources for those seeking to learn, those returning, and those embracing the faith.",
};

export default function WhyIslamPage() {
  return (
    <>
      <ContentHeader
        title="Why Islam"
        subtitle="Understanding the faith, addressing questions, and sharing the truth"
        breadcrumbs={[{ label: "Why Islam" }]}
      />

      <section className="max-w-6xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        {/* Intro */}
        <div className="bg-teal-100 rounded-2xl px-8 py-8 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-bold text-teal-900 mb-3 text-center font-[family-name:var(--font-playfair)]">
            Surrender, in peace
          </h2>
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[19px] leading-[1.65] text-center">
            Islam is the willing surrender to the one true God, Allah, for
            peace in this life and the next. It is the message brought by every
            prophet from Adam to Muhammad ﷺ: that there is one Creator, that
            He alone deserves worship, and that our purpose is to know Him,
            love Him, and live accordingly. This page is an open invitation,
            not a pressure, for anyone seeking to understand.
          </p>
        </div>

        {/* The Case for Islam (moved to top for quick navigation) */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Compass size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              The Case for Islam
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Three focused paths, one for proving Islam is true, one for
            addressing common questions, and one for responding to specific
            claims.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {whyThisHub.map((w) => (
              <Link
                key={w.href}
                href={w.href}
                className="group bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-3">
                  <w.icon size={22} className="text-teal-700" />
                  <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
                    {w.subtitle}
                  </p>
                </div>
                <h3 className="text-lg font-bold text-teal-900 group-hover:text-teal-700 transition-colors mb-2">
                  {w.title}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed flex-1">
                  {w.description}
                </p>
                <div className="inline-flex items-center gap-1.5 text-sm text-teal-700 font-semibold mt-4">
                  Open{" "}
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </Link>
            ))}
          </div>
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

        {/* What is Islam */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Feather size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              What is Islam?
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Three angles on the same answer.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {whatIsIslam.map((w) => (
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

        {/* Signs That Point to Islam */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Star size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Signs That Point to Islam
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            For those asking why Islam is true, these are some of the clearest
            signs. Each is enough on its own; together, they are overwhelming.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {signsOfTruth.map((s) => (
              <div
                key={s.title}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-start gap-2 mb-2">
                  <CheckCircle2
                    size={18}
                    className="text-teal-700 shrink-0 mt-0.5"
                  />
                  <h3 className="text-base font-bold text-teal-900">
                    {s.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {s.detail}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link
              href="/why-islam/proving-islam"
              className="inline-flex items-center gap-2 text-sm text-teal-700 hover:text-teal-900 font-semibold"
            >
              Read the full case in Proving Islam{" "}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* The Beauty of Islam */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              The Beauty of Islam
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Beyond the case for truth, these are the qualities that draw people
            in, new Muslims, lifelong Muslims, and seekers alike.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {beautyOfIslam.map((b) => (
              <div
                key={b.title}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <h3 className="text-base font-bold text-teal-900 mb-2">
                  {b.title}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {b.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Five Pillars */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Compass size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              The Five Pillars of Islam
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            The actions that structure a Muslim&apos;s life. These are the
            foundation Islam is built upon.
          </p>
          <div className="space-y-3">
            {fivePillars.map((p) => (
              <div
                key={p.num}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex gap-4 items-start"
              >
                <div className="shrink-0 w-10 h-10 rounded-full bg-teal-900 text-white font-bold flex items-center justify-center">
                  {p.num}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3 mb-1 flex-wrap">
                    <h3 className="text-lg font-bold text-teal-900">
                      {p.name}
                    </h3>
                    <span
                      className="font-[family-name:var(--font-amiri)] text-teal-700 text-xl"
                      dir="rtl"
                    >
                      {p.arabic}
                    </span>
                    <span className="text-xs text-teal-700 font-semibold uppercase tracking-wider">
                      {p.english}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {p.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Six Articles of Faith */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <HandHeart size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              The Six Articles of Faith (Īmān)
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            The beliefs that shape a Muslim&apos;s worldview. Based on the
            famous hadith of Jibrīl.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sixArticles.map((a, i) => (
              <div
                key={a.name}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex gap-4"
              >
                <div className="shrink-0 w-9 h-9 rounded-full bg-teal-900 text-white font-bold flex items-center justify-center text-sm">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-base font-bold text-teal-900 mb-1">
                    {a.name}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {a.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What is the Quran */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              What is the Qur&apos;an?
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            The primary source of Islam, believed by Muslims to be the direct,
            literal word of Allah revealed to the Prophet Muhammad ﷺ through
            the angel Jibrīl.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quranHighlights.map((q) => (
              <div
                key={q.title}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <h3 className="text-base font-bold text-teal-900 mb-2">
                  {q.title}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {q.detail}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/quran/read"
              className="inline-flex items-center gap-2 bg-teal-900 hover:bg-teal-800 text-white font-bold text-sm px-5 py-2.5 rounded-full transition-colors shadow-[0_4px_12px_rgba(0,77,64,0.25)]"
            >
              Read the Qur&apos;an for yourself <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Who is the Prophet */}
        <div className="mb-12 bg-white rounded-2xl p-6 md:p-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-2 mb-3">
            <Users size={20} className="text-teal-700" />
            <h2 className="text-xl md:text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Who is the Prophet Muhammad ﷺ?
            </h2>
          </div>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-3">
            Born in Makkah in the 6th century, orphaned young, he grew up known
            among his people as al-Ṣādiq al-Amīn, the truthful and trustworthy.
            At the age of 40, revelation began. For 23 years he taught a single
            message: there is one God, worship Him alone, and treat others with
            justice and mercy.
          </p>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
            His character is preserved in thousands of authenticated reports.
            He forgave his worst enemies when he entered Makkah victoriously.
            He mended his own clothes. He was gentle with children, just with
            his companions, and honest with his opponents. Muslims believe he
            is the final prophet in the line of Adam, Noah, Abraham, Moses, and
            Jesus, peace be upon them all.
          </p>
          <Link
            href="/guides/seerah"
            className="inline-flex items-center gap-1.5 text-sm text-teal-700 hover:text-teal-900 font-semibold"
          >
            Read the full seerah guide <ArrowRight size={14} />
          </Link>
        </div>

        {/* For the seeker callout */}
        <div className="mb-12 bg-teal-900 text-white rounded-2xl px-8 py-8 shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
          <h2 className="text-xl md:text-2xl font-bold font-[family-name:var(--font-playfair)] mb-3 text-center">
            For the Seeker
          </h2>
          <p className="text-sm md:text-base text-teal-100 leading-relaxed max-w-3xl mx-auto text-center">
            If you are exploring Islam, know this: we believe every sincere
            seeker is honoured by Allah, whether or not they become Muslim. Ask
            your questions. Read the Qur&apos;an. Visit a masjid. Meet
            Muslims. Take the time you need. The Qur&apos;an itself says:{" "}
            <span className="italic">&ldquo;There is no compulsion in religion.&rdquo;</span>{" "}
            (2:256). No one will push you. The door is open whenever you are
            ready.
          </p>
        </div>

        {/* For the new Muslim */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              For the New Muslim
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            If you have just accepted Islam, or are about to, here is a simple
            first path.
          </p>
          <div className="space-y-3">
            {newMuslimStart.map((s) => (
              <div
                key={s.step}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex gap-4 items-start"
              >
                <div className="shrink-0 w-9 h-9 rounded-full bg-teal-900 text-white font-bold flex items-center justify-center text-sm">
                  {s.step}
                </div>
                <div>
                  <h3 className="text-base font-bold text-teal-900 mb-1">
                    {s.title}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {s.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gentle note */}
        <div className="mb-12 bg-teal-50 border-l-4 border-teal-700 rounded-2xl p-5 flex items-start gap-3">
          <Info size={20} className="text-teal-700 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-bold text-teal-900 mb-1">
              If you have questions
            </h3>
            <p className="text-sm text-teal-900 leading-relaxed">
              This page is an overview. Every question worth asking deserves a
              real answer, from a real person who knows you. Visit a masjid,
              speak with an imam, or attend a new-Muslim or seeker&apos;s class
              in your area. A real conversation is always worth more than a
              page of text.
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
