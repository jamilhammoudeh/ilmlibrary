import Link from "next/link";
import { ContentHeader } from "@/components/content-header";

// Juz information - which surahs each juz starts at
const JUZS = Array.from({ length: 30 }, (_, i) => ({
  number: i + 1,
  name: `Juz ${i + 1}`,
}));

export const metadata = {
  title: "Browse by Juz",
  description: "Read the Quran organized by the 30 Juz divisions",
};

export default function JuzPage() {
  return (
    <>
      <ContentHeader
        title="Browse by Juz"
        subtitle="Read the Quran organized by the 30 Juz divisions"
        breadcrumbs={[
          { label: "Quran", href: "/quran" },
          { label: "Juz" },
        ]}
      />

      <section className="w-[92%] max-w-7xl mx-auto my-8 fade-in-up">
        <div className="bg-teal-100 rounded-2xl px-8 py-10 text-center shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[22px] leading-[1.6]">
            The Quran is divided into 30 equal parts called Juz. Select a Juz
            below to read all the verses within that section.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3">
          {JUZS.map((juz) => (
            <Link
              key={juz.number}
              href={`/quran/juz/${juz.number}`}
              className="group bg-white rounded-2xl p-4 text-center shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
            >
              <span className="text-2xl font-bold text-teal-900 group-hover:text-teal-700 transition-colors duration-200">
                {juz.number}
              </span>
              <p className="text-xs text-gray-500 mt-1">Juz</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
