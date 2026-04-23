import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import { FileText, BookMarked, Headphones } from "lucide-react";

const resources = [
  {
    href: "/quran/tajweed",
    title: "Tajweed Lessons",
    description: "Books and video courses to master proper Quran recitation rules",
    icon: FileText,
  },
  {
    href: "/quran/tafseer",
    title: "Tafseer",
    description: "In-depth commentary and explanation of the Quran",
    icon: BookMarked,
  },
  {
    href: "/quran/reciters",
    title: "Reciters",
    description: "Listen to 27 renowned Quran reciters on YouTube",
    icon: Headphones,
  },
];

export const metadata = {
  title: "Study the Quran",
  description: "Tajweed, Tafseer, and Reciter resources",
};

export default function StudyPage() {
  return (
    <>
      <ContentHeader
        title="Study"
        subtitle="Deepen your understanding of the Quran"
        breadcrumbs={[
          { label: "Quran", href: "/quran" },
          { label: "Study" },
        ]}
      />

      <section className="w-[92%] max-w-7xl mx-auto my-8 fade-in-up">
        <div className="bg-teal-100 rounded-2xl px-8 py-10 text-center shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[22px] leading-[1.6]">
            Learn the rules of recitation with Tajweed, understand the meanings through Tafseer,
            and listen to beautiful recitations from scholars around the world.
          </p>
        </div>
      </section>

      <section className="py-10 pb-32 md:pb-36 px-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-7xl mx-auto fade-in-up">
          {resources.map((r) => {
            const Icon = r.icon;
            return (
              <Link
                key={r.href}
                href={r.href}
                className="group bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200 text-center"
              >
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-100 transition-colors duration-200">
                  <Icon size={24} className="text-teal-700" />
                </div>
                <h3 className="text-lg font-bold text-teal-900 group-hover:text-teal-700 transition-colors duration-200 mb-1">
                  {r.title}
                </h3>
                <p className="text-sm text-gray-500">{r.description}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
