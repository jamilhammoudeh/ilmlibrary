import Link from "next/link";
import { ContentHeader } from "@/components/content-header";

const guides = [
  { slug: "aqeedah", title: "Aqeedah", description: "Learn the foundations of Islamic creed and belief" },
  { slug: "quran-tafsir", title: "Quran Tafsir", description: "Understand the meanings and interpretations of the Quran" },
  { slug: "seerah", title: "Seerah", description: "Study the life and biography of the Prophet Muhammad \uFDFA" },
  { slug: "jurisprudence", title: "Jurisprudence", description: "Learn Islamic law (Fiqh) and rulings" },
  { slug: "hadith", title: "Hadith", description: "Study the sayings and traditions of the Prophet \uFDFA" },
  { slug: "resources", title: "Resources", description: "Additional Islamic materials, podcasts, and tools" },
];

export const metadata = {
  title: "Islamic Guides",
  description: "Step-by-step guides for learning key Islamic topics",
};

export default function GuidesPage() {
  return (
    <>
      <ContentHeader
        title="Beginner's Guides to Islamic Knowledge"
        subtitle="Step-by-Step Guides for New Muslims to Learn Key Islamic Topics"
        breadcrumbs={[{ label: "Islamic Guides" }]}
      />

      <section className="w-[92%] max-w-7xl mx-auto my-8 fade-in-up">
        <div className="bg-teal-100 rounded-2xl px-8 py-10 text-center shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[22px] leading-[1.6]">
            These guides are designed to help new Muslims understand the basics
            of various Islamic topics. Follow the steps below to build a strong
            foundation in your faith.
          </p>
        </div>
      </section>

      <section className="py-10 pb-32 md:pb-36 px-5">
        <div className="flex flex-wrap justify-center gap-5 max-w-7xl mx-auto fade-in-up">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group w-[calc(50%-0.625rem)] sm:w-[280px] bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
            >
              <h3 className="text-lg font-bold text-teal-900 group-hover:text-teal-700 transition-colors duration-200 mb-1">
                {guide.title}
              </h3>
              <p className="text-sm text-gray-500">{guide.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
