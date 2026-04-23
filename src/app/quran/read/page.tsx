import Link from "next/link";
import { ContentHeader } from "@/components/content-header";

type Chapter = {
  id: number;
  name_simple: string;
  name_arabic: string;
  verses_count: number;
  revelation_place: string;
};

async function getChapters(): Promise<Chapter[]> {
  const res = await fetch(
    "https://api.quran.com/api/v4/chapters?language=en",
    { next: { revalidate: 86400 } }
  );
  const data = await res.json();
  return data.chapters;
}

export const metadata = {
  title: "The Noble Quran",
  description: "Read the Quran with translation",
};

export default async function QuranReadPage() {
  const chapters = await getChapters();

  return (
    <>
      <ContentHeader
        title="The Noble Quran" breadcrumbs={[{ label: "Quran", href: "/quran" }, { label: "Read" }]}
        subtitle="Read the Quran with English Translation and Tafsir"
      />


      <section className="max-w-7xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {chapters.map((ch) => (
            <Link
              key={ch.id}
              href={`/quran/read/${ch.id}`}
              className="group bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200 flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center shrink-0 group-hover:bg-teal-100 transition-colors duration-200">
                <span className="text-sm font-bold text-teal-900">{ch.id}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm group-hover:text-teal-700 transition-colors duration-200">
                  {ch.name_simple}
                </h3>
                <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                  {ch.verses_count} verses
                  <span className={`w-1.5 h-1.5 rounded-full ${ch.revelation_place === "makkah" ? "bg-amber-400" : "bg-teal-400"}`} />
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="arabic-text text-lg text-teal-900 leading-tight">
                  {ch.name_arabic}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
