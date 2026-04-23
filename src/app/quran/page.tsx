import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import { BookOpen, Brain, GraduationCap, Search } from "lucide-react";
import { QuranVerseOfDay } from "@/components/quran-verse-of-day";

const sections = [
  {
    href: "/quran/read",
    title: "Read",
    description: "All 114 Surahs with translation, tafsir, audio from 7 reciters, and word-by-word",
    icon: BookOpen,
  },
  {
    href: "/quran/memorize",
    title: "Memorize",
    description: "Personalized plan, practice drills, progress tracking, and proven techniques",
    icon: Brain,
  },
  {
    href: "/quran/study",
    title: "Study",
    description: "Tajweed lessons, tafseer resources, and reciter playlists",
    icon: GraduationCap,
  },
  {
    href: "/quran/search",
    title: "Search",
    description: "Search across all 6,236 verses of the Quran",
    icon: Search,
  },
];

export const metadata = {
  title: "Quran",
  description: "Read, Memorize, Study, and Search the Quran",
};

export default function QuranPage() {
  return (
    <>
      <ContentHeader
        title="The Noble Quran"
        subtitle="Read, Memorize, Study, and Search"
        breadcrumbs={[{ label: "Quran" }]}
      />

      <QuranVerseOfDay />

      <section className="py-10 pb-32 md:pb-36 px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-7xl mx-auto fade-in-up">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className="group bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
              >
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-100 transition-colors duration-200">
                  <Icon size={24} className="text-teal-700" />
                </div>
                <h3 className="text-xl font-bold text-teal-900 group-hover:text-teal-700 transition-colors duration-200 mb-1">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-500">{section.description}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
