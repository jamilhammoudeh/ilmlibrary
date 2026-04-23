import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import {
  GitBranch,
  Users,
  Scroll,
  Feather,
  Brain,
  Flame,
  Circle,
  Leaf,
  Star,
  BookOpen,
  Landmark,
  Scale,
  Globe,
  FlaskConical,
  Home,
  MessageCircle,
  ArrowRight,
  Info,
} from "lucide-react";

type Category = {
  name: string;
  href: string | null;
  description: string;
  icon: typeof Users;
};

const categories: Category[] = [
  {
    name: "Deviated Sects",
    href: null,
    description:
      "Historical sects that departed from the creed of Ahl as-Sunnah wal-Jamāʿah: the Khawārij, Muʿtazilah, Jahmiyyah, and others. How they formed, what they taught, and how the scholars responded.",
    icon: GitBranch,
  },
  {
    name: "Shīʿism",
    href: null,
    description:
      "The creedal differences between Ahl as-Sunnah and Shīʿī theology, particularly concerning the Companions رضي الله عنهم and the caliphate. Framed educationally, not polemically.",
    icon: Users,
  },
  {
    name: "Christianity",
    href: null,
    description:
      "The Islamic understanding of ʿĪsā (Jesus ﷺ) as a great prophet, and where it differs from Trinitarian theology. The Qur'anic position on the nature of God, the crucifixion, and the original message.",
    icon: MessageCircle,
  },
  {
    name: "Judaism",
    href: null,
    description:
      "The shared Abrahamic heritage, the Islamic recognition of Mūsā (Moses ﷺ) and the Torah as originally revealed, and the theological points where Islam and Judaism differ.",
    icon: Scroll,
  },
  {
    name: "Atheism",
    href: null,
    description:
      "The philosophical case for a Creator that Islam presents: the Kalām argument, the argument from design, and the fiṭrah. Engaging respectfully with the classical and modern arguments against God's existence.",
    icon: Brain,
  },
  {
    name: "Zoroastrianism",
    href: null,
    description:
      "The historical Persian religion encountered at the rise of Islam, its dualistic theology, and where it differs from Islamic tawḥīd.",
    icon: Flame,
  },
  {
    name: "Sikhism",
    href: null,
    description:
      "A comparison of Sikh theology, its view of God and prophethood, and the Islamic understanding of the same questions.",
    icon: Circle,
  },
  {
    name: "Buddhism",
    href: null,
    description:
      "The Buddhist framework of nontheism, suffering, and liberation, and how it contrasts with the Islamic view of a personal Creator, purpose, and accountability.",
    icon: Leaf,
  },
  {
    name: "Hinduism",
    href: null,
    description:
      "The Islamic position on the plurality of deities in Hindu traditions, and the tawḥīd-based answer to the question of one ultimate reality.",
    icon: Star,
  },
  {
    name: "Naturalism",
    href: null,
    description:
      "The philosophical view that only nature exists and everything can be explained by natural causes. Engagement with the underlying assumptions and the Islamic case for a reality beyond the material.",
    icon: Globe,
  },
  {
    name: "The Bahai Faith",
    href: null,
    description:
      "The 19th century Bahai movement, its claim of a new prophet after Muḥammad ﷺ, and the Islamic position that he ﷺ was the seal of the prophets.",
    icon: Feather,
  },
  {
    name: "The Qur'anists",
    href: null,
    description:
      "A contemporary movement that rejects the authority of hadith and claims to follow the Qur'an alone. The Islamic response rooted in the Qur'an itself, which commands obedience to the Prophet ﷺ.",
    icon: BookOpen,
  },
  {
    name: "Philosophy",
    href: null,
    description:
      "Classical Islamic engagement with Greek philosophy (falsafah) and the ongoing question of how reason and revelation relate. The positions of al-Ghazālī, Ibn Rushd, Ibn Taymiyyah, and others.",
    icon: Brain,
  },
  {
    name: "Secularism",
    href: null,
    description:
      "The worldview that separates religion from public life. The Islamic position that faith and society are not two separate spheres, and what this means practically.",
    icon: Landmark,
  },
  {
    name: "Liberalism",
    href: null,
    description:
      "Political liberalism's foundational assumptions about individual autonomy and the self-defining self, compared with the Islamic framework of purpose, accountability, and community.",
    icon: Scale,
  },
  {
    name: "Feminism",
    href: null,
    description:
      "A respectful look at the Islamic view of gender, dignity, and rights, and where the framing of modern feminism aligns with, differs from, or is reinterpreted by Islamic scholars.",
    icon: Scale,
  },
  {
    name: "Modernism",
    href: null,
    description:
      "The philosophical movement that treats tradition as subject to reinterpretation by modern assumptions. The Islamic scholarly response rooted in preserving the meaning the Salaf understood.",
    icon: Globe,
  },
  {
    name: "Humanism",
    href: null,
    description:
      "Secular humanism's placement of humanity as the source of meaning and value. The Islamic response: meaning comes from Allah, and human dignity is rooted in being His servants.",
    icon: Users,
  },
  {
    name: "Scientism",
    href: null,
    description:
      "The position that science is the only valid source of knowledge. The Islamic case that revelation, reason, and observation all yield real knowledge, each in their domain.",
    icon: FlaskConical,
  },
  {
    name: "Cultural Islam",
    href: null,
    description:
      "Practices passed down as 'Islamic' that have no basis in the Qur'an or Sunnah. How to distinguish authentic Islam from cultural traditions that were attached to it over time.",
    icon: Home,
  },
];

export const metadata = {
  title: "Refutations",
  description:
    "Respectful, evidence-based examinations of how Islam differs from other belief systems and ideologies, from internal Islamic sects to world religions to modern philosophical movements.",
};

export default function RefutationsPage() {
  return (
    <>
      <ContentHeader
        title="Refutations"
        subtitle="How Islam engages with other belief systems and ideas"
        breadcrumbs={[
          { label: "Why Islam", href: "/why-islam" },
          { label: "Refutations" },
        ]}
      />

      <section className="max-w-6xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        {/* Intro */}
        <div className="bg-teal-100 rounded-2xl px-8 py-8 mb-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-bold text-teal-900 mb-3 text-center font-[family-name:var(--font-playfair)]">
            Comparing Ideas, Respecting People
          </h2>
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[19px] leading-[1.65] text-center">
            Islam teaches that people of other faiths and views should be
            engaged with justice, kindness, and honest discussion. The
            Qur&apos;an invites: &ldquo;Argue with them in the best of
            ways&rdquo; (An-Naḥl 16:125). This section examines how Islam
            differs from other belief systems as systems of thought, not as a
            verdict on the people who hold them.
          </p>
        </div>

        {/* Tone note */}
        <div className="mb-10 bg-teal-50 border-l-4 border-teal-700 rounded-2xl p-5 flex items-start gap-3">
          <Info size={20} className="text-teal-700 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-bold text-teal-900 mb-1">
              A note on tone
            </h3>
            <p className="text-sm text-teal-900 leading-relaxed">
              These pages are meant as scholarly comparisons, not attacks.
              Muslims are commanded to be just and kind even toward those we
              disagree with (Al-Māʾidah 5:8). If any reader of another faith
              or worldview finds their beliefs described inaccurately, that
              is a failure of our presentation, not a reflection of Islamic
              values.
            </p>
          </div>
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
