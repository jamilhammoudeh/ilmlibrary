import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import {
  HandHeart,
  Droplets,
  Home,
  BookOpen,
  Users,
  Globe,
  Heart,
  Shield,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Info,
  Flame,
} from "lucide-react";

const motivation = [
  {
    text: "The example of those who spend their wealth in the way of Allah is like a seed which grows seven spikes, in each spike a hundred grains. Allah multiplies His reward for whom He wills.",
    source: "Surah Al-Baqarah 2:261",
  },
  {
    text: "Charity does not decrease wealth.",
    source: "Sahih Muslim 2588",
  },
  {
    text: "When a person dies, their deeds end except for three: an ongoing charity, beneficial knowledge, or a righteous child who prays for them.",
    source: "Sahih Muslim 1631",
  },
];

const givingTypes = [
  {
    name: "Zakāh",
    arabic: "الزكاة",
    badge: "Obligatory",
    badgeColor: "bg-rose-100 text-rose-900",
    description:
      "The third pillar of Islam. 2.5% of your wealth given each year if it reaches the niṣāb (minimum threshold) and has been held for a lunar year. Zakāh has specific recipients named in the Qur'an (9:60). It is not optional.",
    when: "Once per lunar year on qualifying wealth",
  },
  {
    name: "Ṣadaqah",
    arabic: "الصدقة",
    badge: "Recommended",
    badgeColor: "bg-emerald-100 text-emerald-900",
    description:
      "Voluntary charity, given any time, in any amount, to anyone in need. A smile, a kind word, and removing harm from the road are also considered ṣadaqah. Small consistent giving is beloved to Allah.",
    when: "Any time, in any amount",
  },
  {
    name: "Ṣadaqah Jāriyah",
    arabic: "الصدقة الجارية",
    badge: "Ongoing reward",
    badgeColor: "bg-sky-100 text-sky-900",
    description:
      "Continuing charity whose reward reaches you after death: digging a well, planting a tree, building a masjid, sponsoring a student of knowledge, or printing a Qur'an. One of only three deeds that keep earning reward after you pass.",
    when: "Once, with rewards that continue",
  },
];

const zakatRecipients = [
  "The poor (fuqarāʾ)",
  "The needy (masākīn)",
  "Those who collect and distribute zakāh",
  "Those whose hearts are being reconciled",
  "Freeing captives or slaves",
  "Those in debt",
  "In the cause of Allah",
  "The traveler in need",
];

type Organization = {
  name: string;
  url: string;
  description: string;
  tags: string[];
  region: string;
};

type Category = {
  title: string;
  subtitle: string;
  icon: typeof HandHeart;
  orgs: Organization[];
};

const categories: Category[] = [
  {
    title: "Emergency & Humanitarian Relief",
    subtitle:
      "For crises, disasters, and the Muslims most in need globally",
    icon: Globe,
    orgs: [
      {
        name: "Islamic Relief USA",
        url: "https://irusa.org",
        description:
          "One of the largest US-based Islamic humanitarian organizations. Emergency relief, food aid, healthcare, and zakat programs in over 40 countries.",
        tags: ["Zakat-eligible", "Global", "Emergency"],
        region: "US-based · Global reach",
      },
      {
        name: "Islamic Relief Worldwide",
        url: "https://islamic-relief.org",
        description:
          "Faith-based humanitarian organization founded in 1984, working in over 45 countries. Provides aid to more than 10 million people annually.",
        tags: ["Zakat-eligible", "Global"],
        region: "UK-based · Global reach",
      },
      {
        name: "Muslim Aid",
        url: "https://muslimaid.org",
        description:
          "A UK-based humanitarian charity operating for 35+ years. Emergency response, livelihoods, water, and orphan support across dozens of countries.",
        tags: ["Zakat-eligible", "Global"],
        region: "UK-based · Global reach",
      },
      {
        name: "Human Appeal",
        url: "https://humanappeal.org",
        description:
          "A faith-based charity focused on emergency aid and long-term development. Known for rapid response during crises and transparent reporting.",
        tags: ["Zakat-eligible", "Global"],
        region: "UK-based · Global reach",
      },
      {
        name: "Helping Hand for Relief and Development",
        url: "https://hhrd.org",
        description:
          "US-based Muslim relief and development organization. Emergency relief, orphan sponsorship, education, and health programs worldwide.",
        tags: ["Zakat-eligible", "Global"],
        region: "US-based · Global reach",
      },
    ],
  },
  {
    title: "Clean Water Projects",
    subtitle:
      "Building wells and water systems. Among the best examples of ṣadaqah jāriyah.",
    icon: Droplets,
    orgs: [
      {
        name: "Paani Project",
        url: "https://paaniproject.org",
        description:
          "Volunteer-run nonprofit building wells in Pakistan and Jordan. Funds tube wells, deep water wells, and solar-powered water centers benefiting thousands.",
        tags: ["Sadaqah Jariyah", "Water"],
        region: "US-based · Pakistan & Jordan",
      },
      {
        name: "Islamic Relief WASH",
        url: "https://irusa.org/middle-east/water/",
        description:
          "Islamic Relief's dedicated water, sanitation, and hygiene (WASH) programs. Builds wells and improves water access across Africa and the Middle East.",
        tags: ["Sadaqah Jariyah", "Water", "Zakat-eligible"],
        region: "Global",
      },
      {
        name: "Hidaya Foundation Water Wells",
        url: "https://www.hidaya.org/project/water/",
        description:
          "Hand pumps, deep water wells, and large community wells. Detailed reporting on where each well is built and who benefits.",
        tags: ["Sadaqah Jariyah", "Water"],
        region: "US-based · South Asia & Africa",
      },
    ],
  },
  {
    title: "Orphan Sponsorship",
    subtitle:
      "The Prophet ﷺ said he and the caretaker of an orphan will be in Paradise like this (joining two fingers).",
    icon: Heart,
    orgs: [
      {
        name: "Penny Appeal USA - Orphan Kind",
        url: "https://pennyappealusa.org/orphan-kind",
        description:
          "Monthly orphan sponsorship program. Covers food, shelter, healthcare, and education for an orphan child.",
        tags: ["Zakat-eligible", "Monthly"],
        region: "US-based · Global reach",
      },
      {
        name: "RAHMA Worldwide Orphans",
        url: "https://rahma.org",
        description:
          "Sponsored 5,000+ orphans in 2023 alone. Provides comprehensive care including education, medical support, and stable environments.",
        tags: ["Zakat-eligible", "Monthly"],
        region: "US-based · Global",
      },
      {
        name: "Islamic Relief Orphan Sponsorship",
        url: "https://irusa.org/orphans/",
        description:
          "Monthly sponsorship covering essentials for an orphaned child through Islamic Relief's established global network.",
        tags: ["Zakat-eligible", "Monthly"],
        region: "Global",
      },
    ],
  },
  {
    title: "Palestine & Gaza",
    subtitle: "Relief for ongoing crises in Palestine.",
    icon: Shield,
    orgs: [
      {
        name: "Islamic Relief Gaza Appeal",
        url: "https://irusa.org/emergencies/gaza/",
        description:
          "Emergency food, medical supplies, and shelter for families affected by the ongoing crisis in Gaza.",
        tags: ["Zakat-eligible", "Emergency"],
        region: "Global",
      },
      {
        name: "HHRD Palestine",
        url: "https://hhrd.org/palestine",
        description:
          "Helping Hand's Palestine programs. Emergency relief, orphan care, and medical aid.",
        tags: ["Zakat-eligible", "Emergency"],
        region: "US-based · Palestine",
      },
      {
        name: "LaunchGood Gaza Campaigns",
        url: "https://www.launchgood.com/v4/discover/palestine",
        description:
          "Crowdfunding platform with hundreds of verified Palestine relief campaigns. Pick specific causes and watch updates directly from organizers.",
        tags: ["Specific causes", "Verified"],
        region: "Global · US-based platform",
      },
    ],
  },
  {
    title: "Islamic Education & Dawah",
    subtitle: "Funding students of knowledge and spreading the deen.",
    icon: BookOpen,
    orgs: [
      {
        name: "Al Madrasatu Al Umariyyah (AMAU)",
        url: "https://amauacademy.com",
        description:
          "Free online Islamic academy offering courses in Arabic, Qur'an, and the Islamic sciences. Student sponsorship supports those unable to pay.",
        tags: ["Sadaqah Jariyah", "Education"],
        region: "Global · Online",
      },
      {
        name: "Keys to Knowledge",
        url: "https://keystoknowledge.org",
        description:
          "Support students of Islamic knowledge studying in Makkah, Madinah, and Riyadh. Covers expenses, learning materials, and scholarships.",
        tags: ["Sadaqah Jariyah", "Students"],
        region: "Global",
      },
      {
        name: "LaunchGood Masjid Projects",
        url: "https://www.launchgood.com/v4/discover/category/mosque",
        description:
          "Crowdfunding campaigns for building and maintaining masājid around the world. Build a masjid, continuous reward.",
        tags: ["Sadaqah Jariyah", "Masjid"],
        region: "Global · US-based platform",
      },
    ],
  },
  {
    title: "Domestic (United States)",
    subtitle:
      "Supporting Muslims and neighbors here at home. Also donate to your local masjid.",
    icon: Home,
    orgs: [
      {
        name: "ICNA Relief USA",
        url: "https://icnarelief.org",
        description:
          "Domestic US Muslim relief. Food pantries, women's shelters, refugee services, and disaster relief across the United States.",
        tags: ["Zakat-eligible", "US-based"],
        region: "United States",
      },
      {
        name: "Zakat Foundation of America",
        url: "https://www.zakat.org",
        description:
          "One of the earliest zakat-dedicated Muslim charities in the US. Programs for food, orphans, refugees, and education domestically and abroad.",
        tags: ["Zakat-eligible", "US-based"],
        region: "United States · Global",
      },
    ],
  },
  {
    title: "Crowdfunding & Specific Causes",
    subtitle:
      "Platforms that let you pick the exact cause, project, or family to support.",
    icon: Users,
    orgs: [
      {
        name: "LaunchGood",
        url: "https://launchgood.com",
        description:
          "The largest Muslim crowdfunding platform. Thousands of verified campaigns: emergency relief, masjid builds, students of knowledge, medical causes, and more.",
        tags: ["Specific causes", "Verified"],
        region: "Global · US-based platform",
      },
    ],
  },
  {
    title: "Civil Rights & Advocacy",
    subtitle:
      "Not charity in the classical sense, but a form of supporting the community.",
    icon: Shield,
    orgs: [
      {
        name: "Council on American-Islamic Relations (CAIR)",
        url: "https://www.cair.com",
        description:
          "The largest US Muslim civil liberties organization. Advocates for civil rights, religious freedom, and just treatment of Muslims in America.",
        tags: ["Advocacy", "US-based"],
        region: "United States",
      },
    ],
  },
];

const evaluateTips = [
  {
    title: "Check financial transparency",
    detail:
      "Look at their annual reports and the percentage that actually reaches the cause (not overhead). Charity Navigator, GuideStar, and the organization's own audits help.",
  },
  {
    title: "Confirm zakāh policies",
    detail:
      "Not every organization handles zakāh correctly. Well-established Muslim charities have explicit zakāh policies and trust arrangements that ensure your zakāh goes only to eligible recipients.",
  },
  {
    title: "Prefer established over viral",
    detail:
      "Organizations operating for 10+ years with consistent reporting are generally safer than trending crowdfunding campaigns. Both have a place, but start with the established.",
  },
  {
    title: "Give to what you understand",
    detail:
      "If you care deeply about orphans, water, or Qur'an education, give there. Intentional, focused giving builds a stronger spiritual connection than scattered donations.",
  },
  {
    title: "Donate locally too",
    detail:
      "Your local masjid, food pantry, and students of knowledge in your community have real, immediate needs. They are often overlooked for flashier international causes.",
  },
  {
    title: "Keep a record",
    detail:
      "Track your giving for both tax purposes and spiritual reflection. Islam encourages us to account for our wealth. A simple log per year is enough.",
  },
];

const faq = [
  {
    q: "What is the niṣāb for zakāh?",
    a: "The niṣāb is the minimum amount of wealth a Muslim must own before zakāh becomes obligatory. It is equivalent to 87.48 grams of gold or 612.36 grams of silver (scholars differ on which to use; the silver standard is lower, so more people owe zakāh by that measure). Most modern calculators use current gold/silver prices. If your qualifying wealth has stayed above niṣāb for one lunar year, 2.5% is owed.",
  },
  {
    q: "Who can receive zakāh?",
    a: "The Qur'an (9:60) names eight categories: the poor, the needy, zakāh collectors, those whose hearts are being reconciled, freeing captives, those in debt, in the cause of Allah, and the traveler in need. Zakāh cannot be given to one's own parents, spouse, or children, or to non-Muslims in most cases (some exceptions apply).",
  },
  {
    q: "Is sadaqah better than zakāh?",
    a: "Zakāh is obligatory; sadaqah is voluntary. You must pay zakāh if you owe it. Sadaqah on top of zakāh is encouraged, but it does not replace it. Think of zakāh as a duty and sadaqah as a gift.",
  },
  {
    q: "Is it better to give a lot once or a little regularly?",
    a: "The Prophet ﷺ said: 'The most beloved deeds to Allah are the most consistent of them, even if they are small.' (Bukhārī 6464). A small monthly donation that you maintain is often better than a large one-time gift followed by silence.",
  },
  {
    q: "Can I donate to non-Muslims?",
    a: "Yes for voluntary ṣadaqah. Helping non-Muslim neighbors in need is a prophetic practice and a way to show the beauty of Islam. For zakāh specifically, scholars have detailed discussions; most hold that zakāh goes primarily to Muslims but some exceptions exist.",
  },
  {
    q: "When is the best time to give?",
    a: "Right now. Beyond that, Ramadan multiplies rewards (the Prophet ﷺ was most generous in Ramadan), and the last ten nights especially. Friday is also a blessed day. But the best giving is consistent, all year long, not just in special seasons.",
  },
];

const related = [
  {
    href: "/",
    title: "Home",
    description: "Return to the main page.",
  },
  {
    href: "/duas",
    title: "Duas",
    description: "Duas for wealth, provision, and gratitude.",
  },
  {
    href: "/quran/tafseer",
    title: "Tafseer Resources",
    description:
      "Understand the verses on charity and spending in the cause of Allah.",
  },
  {
    href: "/guides",
    title: "Islamic Guides",
    description: "Guides to aqeedah, fiqh, and the sciences of the deen.",
  },
];

export const metadata = {
  title: "Donate",
  description:
    "Give with purpose. Trusted Islamic charities for zakāh, sadaqah, and sadaqah jāriyah, organized by cause.",
};

export default function DonatePage() {
  return (
    <>
      <ContentHeader
        title="Give With Purpose"
        subtitle="Trusted charities for zakāh, ṣadaqah, and ongoing reward"
        breadcrumbs={[{ label: "Donate" }]}
      />

      <section className="max-w-6xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        {/* Intro */}
        <div className="bg-teal-100 rounded-2xl px-8 py-8 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-bold text-teal-900 mb-3 text-center font-[family-name:var(--font-playfair)]">
            Wealth That Multiplies
          </h2>
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[19px] leading-[1.65] text-center">
            Charity in Islam is not a transaction. It is an act of worship.
            Every dollar given for Allah&apos;s sake is multiplied, protected,
            and counted for the Day of Judgement. This page is a curated list
            of trusted organizations, organized by cause, so you can give
            confidently and with intention.
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

        {/* Three Types of Giving */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <HandHeart size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Three Types of Giving in Islam
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Understanding the difference helps you give with clarity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {givingTypes.map((g) => (
              <div
                key={g.name}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex flex-col"
              >
                <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                  <div>
                    <h3 className="text-lg font-bold text-teal-900">
                      {g.name}
                    </h3>
                    <p
                      className="font-[family-name:var(--font-amiri)] text-teal-700 text-xl"
                      dir="rtl"
                    >
                      {g.arabic}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${g.badgeColor}`}
                  >
                    {g.badge}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-3 flex-1">
                  {g.description}
                </p>
                <div className="bg-teal-50/60 rounded-xl p-3 border border-teal-100">
                  <p className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider mb-0.5">
                    When
                  </p>
                  <p className="text-sm text-gray-800">{g.when}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zakat recipients callout */}
        <div className="mb-12 bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-2 mb-3">
            <Info size={18} className="text-teal-700" />
            <h3 className="text-base font-bold text-teal-900">
              The Eight Recipients of Zakāh
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Named directly in the Qur&apos;an (Sūrah At-Tawbah 9:60). Only these
            eight groups are eligible to receive your zakāh.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {zakatRecipients.map((r, i) => (
              <div
                key={r}
                className="bg-teal-50/50 rounded-lg px-3 py-2 flex items-center gap-2"
              >
                <span className="text-xs font-bold text-teal-700 w-5 shrink-0">
                  {i + 1}.
                </span>
                <span className="text-sm text-gray-700">{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Multiplying reward callout */}
        <div className="mb-12 bg-teal-900 text-white rounded-2xl px-8 py-8 shadow-[0_4px_12px_rgba(0,0,0,0.12)] text-center">
          <Flame size={36} className="text-teal-200 mx-auto mb-3" />
          <p className="text-xl md:text-2xl font-bold font-[family-name:var(--font-playfair)] leading-tight mb-3">
            One seed. Seven spikes.
            <br />
            <span className="text-teal-200">A hundred grains each.</span>
          </p>
          <p className="text-sm text-teal-100 max-w-2xl mx-auto leading-relaxed">
            Allah described your giving in the Qur&apos;an as a seed that grows
            into 700 grains, and beyond that to whatever He wills. No
            investment on earth matches this rate of return. Give boldly.
          </p>
        </div>

        {/* Categories with organizations */}
        {categories.map((cat) => (
          <div className="mb-12" key={cat.title}>
            <div className="flex items-center gap-2 mb-2">
              <cat.icon size={22} className="text-teal-700" />
              <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
                {cat.title}
              </h2>
            </div>
            <p className="text-gray-500 mb-6">{cat.subtitle}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.orgs.map((org) => (
                <div
                  key={org.name}
                  className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex flex-col hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
                >
                  <h3 className="text-base font-bold text-teal-900 mb-1">
                    {org.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 mb-3">
                    {org.region}
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4 flex-1">
                    {org.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {org.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={org.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full bg-teal-900 hover:bg-teal-800 text-white font-bold text-sm px-4 py-2.5 rounded-full transition-colors shadow-[0_4px_12px_rgba(0,77,64,0.25)]"
                  >
                    Donate <ArrowRight size={14} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* How to evaluate */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              How to Choose a Charity Wisely
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            A quick checklist before you give.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evaluateTips.map((t) => (
              <div
                key={t.title}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="text-emerald-600 shrink-0 mt-0.5"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-teal-900 mb-1">
                      {t.title}
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {t.detail}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Local masjid reminder */}
        <div className="mb-12 bg-teal-50 border-l-4 border-teal-700 rounded-2xl p-5 flex items-start gap-3">
          <Home size={20} className="text-teal-700 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-bold text-teal-900 mb-1">
              Do not forget your local masjid
            </h3>
            <p className="text-sm text-teal-900 leading-relaxed">
              International causes are important, but your local masjid, the
              place where you pray, where your children learn Qur&apos;an, and
              where your community gathers, depends on ongoing support. The
              Prophet ﷺ said that whoever builds a masjid for Allah, Allah
              will build for him a house in Paradise. Your monthly contribution
              to your own masjid is one of the most rewarding forms of
              ṣadaqah jāriyah.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mb-12 bg-amber-50 border-l-4 border-amber-500 rounded-2xl p-5 flex items-start gap-3">
          <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-bold text-amber-900 mb-1">
              A note on this list
            </h3>
            <p className="text-sm text-amber-900 leading-relaxed">
              These organizations were selected based on their long-standing
              reputation, financial transparency, and Islamic credentials. We
              encourage you to do your own research before donating. We are not
              responsible for how funds are used once donated, and inclusion
              here is not a guarantee or endorsement of every project each
              organization runs.
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
