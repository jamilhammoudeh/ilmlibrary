import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuranWebApp } from "@/components/quran-web-app";
import { getSurahIndexEntry, SURAH_INDEX } from "@/lib/quran-surah-index";

// Per-surah entry into the same reader the index route renders. The reader is
// a client app that reads the surah off the pathname (see
// restoreSavedReaderState), so this route exists to give each surah its own
// indexable, titled URL - the shape the site's surah links, the juz index,
// search results, and the sitemap have always used.

type PageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return SURAH_INDEX.map((surah) => ({ id: String(surah.id) }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const surah = getSurahIndexEntry(Number(id));
  if (!surah) return { title: "Surah not found" };

  const title = `Surah ${surah.nameEnglish} (${surah.nameTranslation})`;
  const description = `Read Surah ${surah.nameEnglish}, the ${surah.revelationPlace === "meccan" ? "Meccan" : "Medinan"} chapter of ${surah.ayahCount} verses, in the Madinah mushaf with English translation, tafseer, word-by-word meanings, and ayah audio.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Ilm Library`,
      description,
      url: `/quran/read/${surah.id}`,
    },
  };
}

export default async function SurahPage({ params }: PageProps) {
  const { id } = await params;
  if (!getSurahIndexEntry(Number(id))) notFound();
  return <QuranWebApp />;
}
