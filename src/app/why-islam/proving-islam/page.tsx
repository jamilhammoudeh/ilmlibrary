import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import {
  Star,
  Zap,
  User,
  BookOpen,
  Brain,
  Compass,
  Heart,
  ShieldCheck,
  FileSearch,
  FileX,
  PenTool,
  Lock,
  Telescope,
  ArrowRight,
} from "lucide-react";

type Category = {
  name: string;
  href: string | null;
  description: string;
  icon: typeof Star;
};

const categories: Category[] = [
  {
    name: "Prophecies",
    href: "/why-islam/proving-islam/prophecies",
    description:
      "Predictions in the Qur'an and authentic hadith that came true centuries after they were made. The Byzantine victory, the conquest of Makkah, Abū Lahab's fate, Constantinople, and more.",
    icon: Star,
  },
  {
    name: "Miracles",
    href: "/why-islam/proving-islam/miracles",
    description:
      "The physical miracles given to the Prophet ﷺ by Allah: splitting the moon, food multiplying, water flowing from his fingers, and others preserved in authentic hadith.",
    icon: Zap,
  },
  {
    name: "The Prophet's Character",
    href: null,
    description:
      "Known before prophethood as al-Ṣādiq al-Amīn (the truthful, the trustworthy). His character, even by the testimony of his enemies, is one of the strongest arguments for the truth of his message.",
    icon: User,
  },
  {
    name: "Prophetic Teachings",
    href: null,
    description:
      "The depth, balance, and practical wisdom of what the Prophet ﷺ taught, on worship, ethics, family, and society, across thousands of preserved statements.",
    icon: BookOpen,
  },
  {
    name: "Kalam Argument",
    href: null,
    description:
      "The classical argument that the universe began to exist, therefore has a cause, and that cause must be eternal, uncaused, and intentional. A rational case for a Creator.",
    icon: Brain,
  },
  {
    name: "The Design Argument",
    href: null,
    description:
      "The universe's fine-tuning, the precise order of natural laws, and the complexity of life all point to an intentional Designer. The case from design.",
    icon: Compass,
  },
  {
    name: "Argument from Fiṭrah",
    href: null,
    description:
      "The innate human recognition of a Creator. Every child is born with a natural inclination toward God, before culture shapes them. The case from inner conviction.",
    icon: Heart,
  },
  {
    name: "Challenge the Qur'an",
    href: null,
    description:
      "The Qur'an itself challenges anyone to produce even a single sūrah like it (Al-Baqarah 2:23). The masters of Arabic in the 7th century could not, and no one has since.",
    icon: ShieldCheck,
  },
  {
    name: "Find Contradictions",
    href: null,
    description:
      "The Qur'an invites readers to search for any contradiction in its pages (An-Nisāʾ 4:82). Despite 23 years of revelation across changing circumstances, none have been found.",
    icon: FileSearch,
  },
  {
    name: "Scripture Corrections",
    href: null,
    description:
      "The Qur'an corrects and clarifies stories found in earlier scriptures, restoring the original message without the human alterations accumulated over centuries.",
    icon: FileX,
  },
  {
    name: "Illiterate Authorship",
    href: null,
    description:
      "The Prophet ﷺ could not read or write. Yet the Qur'an speaks with encyclopedic knowledge of history, cosmology, and law. The case from the unlettered messenger.",
    icon: PenTool,
  },
  {
    name: "Preservation",
    href: null,
    description:
      "The Qur'an has been memorized and preserved word for word for 14 centuries, across every generation, in every Muslim land, without a single letter changed.",
    icon: Lock,
  },
  {
    name: "Qur'anic Miracles",
    href: null,
    description:
      "The linguistic inimitability of the Qur'an, its rhetorical structure, and its internal consistency across 23 years of revelation. Signs within the text itself.",
    icon: Telescope,
  },
];

export const metadata = {
  title: "Proving Islam",
  description:
    "Evidence and reasoning that affirm Islam's truth: prophecies, miracles, the Prophet's character, the Qur'an's linguistic challenge, and rational arguments for God.",
};

export default function ProvingIslamPage() {
  return (
    <>
      <ContentHeader
        title="Proving Islam"
        subtitle="The case for Islam's truth, built from many angles"
        breadcrumbs={[
          { label: "Why Islam", href: "/why-islam" },
          { label: "Proving Islam" },
        ]}
      />

      <section className="max-w-6xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        {/* Intro */}
        <div className="bg-teal-100 rounded-2xl px-8 py-8 mb-10 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-bold text-teal-900 mb-3 text-center font-[family-name:var(--font-playfair)]">
            The Case from Many Angles
          </h2>
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[19px] leading-[1.65] text-center">
            The truth of Islam does not rest on a single argument. It rests on
            many: fulfilled prophecies, miracles, the character of the Prophet
            ﷺ, the Qur&apos;an&apos;s linguistic challenge, rational proofs
            for a Creator, and the innate recognition of God in every human
            heart. Each topic below is a doorway into one angle of the full
            case.
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

        {/* Note */}
        <p className="text-center text-xs text-gray-400 mt-8">
          More topics are being prepared. Check back for updates.
        </p>
      </section>
    </>
  );
}
