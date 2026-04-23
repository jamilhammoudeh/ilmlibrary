import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import { ClipboardList, Dumbbell, BarChart3, BookOpen } from "lucide-react";

const tabs = [
  {
    href: "/quran/memorize/plan",
    title: "My Plan",
    description: "Take a short quiz to get a personalized memorization schedule",
    icon: ClipboardList,
  },
  {
    href: "/quran/memorize/practice",
    title: "Practice",
    description: "Ayah-by-ayah drill with audio repeat to test your memory",
    icon: Dumbbell,
  },
  {
    href: "/quran/memorize/progress",
    title: "Progress",
    description: "Track which surahs you have memorized and what needs review",
    icon: BarChart3,
  },
  {
    href: "/quran/memorize/techniques",
    title: "Techniques",
    description: "A structured 4-phase guide to building strong memorization",
    icon: BookOpen,
  },
];

export const metadata = {
  title: "Memorize the Quran",
  description: "Tools and techniques for Quran memorization",
};

export default function MemorizePage() {
  return (
    <>
      <ContentHeader
        title="Memorize"
        subtitle="Tools and techniques to help you become a hafidh"
        breadcrumbs={[
          { label: "Quran", href: "/quran" },
          { label: "Memorize" },
        ]}
      />


      <section className="py-10 pb-32 md:pb-36 px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-7xl mx-auto fade-in-up">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="group bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
              >
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-100 transition-colors duration-200">
                  <Icon size={24} className="text-teal-700" />
                </div>
                <h3 className="text-lg font-bold text-teal-900 group-hover:text-teal-700 transition-colors duration-200 mb-1">
                  {tab.title}
                </h3>
                <p className="text-sm text-gray-500">{tab.description}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
