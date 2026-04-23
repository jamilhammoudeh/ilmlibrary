import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import {
  Shield,
  FileSearch,
  FlaskConical,
  Scale,
  Swords,
  Globe,
  User,
  BookOpen,
  Scroll,
  HeartCrack,
  FileX,
  Users,
  Calendar,
  Unlock,
  Compass,
  Heart,
  DoorOpen,
  ShieldAlert,
  Coins,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

type Category = {
  name: string;
  href: string | null;
  description: string;
  icon: typeof Shield;
};

const categories: Category[] = [
  {
    name: "Clearing Doubts",
    href: null,
    description:
      "A general approach to addressing doubts about Islam. How to handle uncertainty, what scholars advise, and the principles the Salaf used when faced with challenges to their faith.",
    icon: HelpCircle,
  },
  {
    name: "Alleged Contradictions",
    href: null,
    description:
      "Responses to claims that the Qur'an or the Sunnah contain internal contradictions. Many alleged contradictions come from removing verses from context or misunderstanding classical Arabic.",
    icon: FileSearch,
  },
  {
    name: "Scientific Errors",
    href: null,
    description:
      "Responses to the claim that the Qur'an contradicts modern science. A careful look at what the text actually says, what science actually shows, and where popular claims overreach in either direction.",
    icon: FlaskConical,
  },
  {
    name: "Sharīʿah Misconceptions",
    href: null,
    description:
      "What Sharīʿah actually is: Islamic law rooted in the Qur'an and Sunnah, covering worship, family, ethics, and society. Addresses common myths and Hollywood caricatures of it.",
    icon: Scale,
  },
  {
    name: "Terrorism Clarified",
    href: null,
    description:
      "The Islamic stance on the killing of innocents: clearly prohibited in the Qur'an and Sunnah. Response to claims that Islam itself teaches terrorism or that violent extremists represent mainstream Islam.",
    icon: Shield,
  },
  {
    name: "Spread by the Sword?",
    href: null,
    description:
      "A historical look at how Islam actually spread. In many regions, Muslim political rule expanded through conquest, but the faith itself spread overwhelmingly through trade, scholarship, marriage, and personal conversion.",
    icon: Swords,
  },
  {
    name: "Modernity",
    href: null,
    description:
      "Whether Islam is compatible with contemporary life. Addresses the idea that Islam is a relic of the past or incompatible with progress, science, or development.",
    icon: Globe,
  },
  {
    name: "The Prophet's Character",
    href: null,
    description:
      "Response to polemical claims about the Prophet Muhammad ﷺ. His character, leadership, and treatment of opponents as documented by both supporters and enemies.",
    icon: User,
  },
  {
    name: "Borrowing from Earlier Scriptures",
    href: null,
    description:
      "Response to the claim that the Qur'an copied stories from the Bible or from Jewish texts. The Islamic position: previous scriptures came from the same Source, and the Qur'an confirms what was preserved and corrects what was altered.",
    icon: BookOpen,
  },
  {
    name: "Relations with the People of the Book",
    href: null,
    description:
      "Response to claims of anti-Semitism or anti-Christian bias in Islam. The Qur'anic commands to justice, the historical protection of Jewish and Christian communities under Muslim rule, and where critical verses actually apply.",
    icon: Scroll,
  },
  {
    name: "Suicide in Islam",
    href: null,
    description:
      "Suicide is explicitly forbidden in Islam, as is the killing of innocents, including in warfare. Response to claims that modern suicide attacks find justification in Islamic texts.",
    icon: HeartCrack,
  },
  {
    name: "Satanic Verses Refuted",
    href: null,
    description:
      "The Satanic Verses narrative, popularized in modern times, contradicts the Qur'an and the authenticated Sunnah. A careful examination of the weak and rejected reports that originated the story.",
    icon: FileX,
  },
  {
    name: "Racism in Islam",
    href: null,
    description:
      "The Prophet ﷺ said: 'An Arab has no superiority over a non-Arab except by piety.' Islam's founding egalitarianism, the status of Bilāl ibn Rabāḥ and others, and the distinction between Islamic teaching and cultural racism that existed among Muslims historically.",
    icon: Users,
  },
  {
    name: "Age of ʿĀʾishah",
    href: null,
    description:
      "A careful, respectful examination of the narrations, the 7th-century Arabian context, the broader historical norms of the time, and the scholarly discussion both classical and contemporary.",
    icon: Calendar,
  },
  {
    name: "Slavery in Islam",
    href: null,
    description:
      "The systematic reforms Islam introduced, the high status given to freeing slaves (highlighted throughout the Qur'an and Sunnah), and the historical trajectory toward abolition. Addresses the common conflation of Islamic law with the transatlantic slave trade.",
    icon: Unlock,
  },
  {
    name: "Free Will & Qadar",
    href: null,
    description:
      "The Islamic position on divine decree and human responsibility. How Allah's complete knowledge does not negate our real, accountable choices.",
    icon: Compass,
  },
  {
    name: "Ḥijāb & Modesty",
    href: null,
    description:
      "The Qur'anic commands on modesty for both men and women, the purpose of ḥijāb beyond the stereotypes, and the honest discussion of choice, coercion, and culture.",
    icon: Heart,
  },
  {
    name: "Apostasy (Riddah)",
    href: null,
    description:
      "The classical rulings on apostasy, their historical context, and the careful scholarly discussion on the difference between private unbelief and public rebellion against the community.",
    icon: DoorOpen,
  },
  {
    name: "The Problem of Evil",
    href: null,
    description:
      "The philosophical problem of how an all-powerful, all-good God permits evil and suffering, and the Islamic answers: the nature of testing, free will, eternal justice, and the limits of human understanding.",
    icon: ShieldAlert,
  },
  {
    name: "The Jizya",
    href: null,
    description:
      "The historical jizya (poll tax on non-Muslims under Muslim governance), what it actually was, how it compared to contemporary taxation, and response to modern claims that it was discriminatory.",
    icon: Coins,
  },
];

export const metadata = {
  title: "Defending Islam",
  description:
    "Addressing common misconceptions about Islam with clarity and evidence: from Sharīʿah and terrorism to historical claims and philosophical questions.",
};

export default function DefendingIslamPage() {
  return (
    <>
      <ContentHeader
        title="Defending Islam"
        subtitle="Thoughtful responses to the most common misconceptions"
        breadcrumbs={[
          { label: "Why Islam", href: "/why-islam" },
          { label: "Defending Islam" },
        ]}
      />

      <section className="max-w-6xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        {/* Intro */}
        <div className="bg-teal-100 rounded-2xl px-8 py-8 mb-10 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-bold text-teal-900 mb-3 text-center font-[family-name:var(--font-playfair)]">
            Addressing Misconceptions with Clarity
          </h2>
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[19px] leading-[1.65] text-center">
            Many questions about Islam come from honest confusion, not
            hostility. This section addresses the most common ones directly:
            with Qur&apos;anic evidence, authentic hadith, historical
            context, and the scholarly discussion that often gets left out of
            social media debates. Each topic below is a doorway into one
            question.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => {
            const hasPage = c.href !== null;
            const classes =
              "group bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200 flex flex-col " +
              (hasPage
                ? "hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1"
                : "opacity-70");

            const inner = (
              <>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <c.icon size={20} className="text-teal-700 shrink-0" />
                    <h3 className="text-base font-bold text-teal-900 group-hover:text-teal-700 transition-colors">
                      {c.name}
                    </h3>
                  </div>
                  {!hasPage && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 uppercase tracking-wider shrink-0">
                      Coming soon
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed flex-1">
                  {c.description}
                </p>
                {hasPage && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-teal-700 font-semibold mt-4">
                    Open{" "}
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                )}
              </>
            );

            return hasPage ? (
              <Link key={c.name} href={c.href!} className={classes}>
                {inner}
              </Link>
            ) : (
              <div key={c.name} className={classes}>
                {inner}
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          More topics are being prepared. Check back for updates.
        </p>
      </section>
    </>
  );
}
