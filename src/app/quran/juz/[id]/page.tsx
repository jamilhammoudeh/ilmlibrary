"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import { ChevronRight, Copy, Check } from "lucide-react";

type Verse = {
  id: number;
  verse_number: number;
  verse_key: string;
  text_uthmani: string;
  translations: { text: string }[];
};

export default function JuzDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [juzId, setJuzId] = useState("");
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedVerse, setCopiedVerse] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ id }) => setJuzId(id));
  }, [params]);

  useEffect(() => {
    if (!juzId) return;
    async function load() {
      const res = await fetch(
        `https://api.quran.com/api/v4/verses/by_juz/${juzId}?language=en&fields=text_uthmani&translations=22&per_page=400`
      );
      const data = await res.json();
      setVerses(data.verses ?? []);
      setLoading(false);
    }
    load();
  }, [juzId]);

  async function copyVerse(verse: Verse) {
    const translation = verse.translations?.[0]?.text?.replace(/<[^>]*>/g, "") ?? "";
    await navigator.clipboard.writeText(`${verse.text_uthmani}\n\n${translation}\n\n— Quran ${verse.verse_key}`);
    setCopiedVerse(verse.verse_key);
    setTimeout(() => setCopiedVerse(null), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-teal-200 border-t-teal-700 rounded-full animate-spin" />
      </div>
    );
  }

  // Group verses by surah
  const grouped: Record<string, Verse[]> = {};
  verses.forEach((v) => {
    const surah = v.verse_key.split(":")[0];
    if (!grouped[surah]) grouped[surah] = [];
    grouped[surah].push(v);
  });

  return (
    <>
      <section className="bg-[#f0f0f0] pt-8 md:pt-10 pb-3 px-5 text-center fade-in-up">
        <h1 className="text-[28px] sm:text-[38px] md:text-[48px] font-bold font-[family-name:var(--font-playfair)] text-teal-900 leading-[1.1] mb-2">
          Juz {juzId}
        </h1>
        <p className="text-sm text-gray-500">{verses.length} verses</p>
      </section>

      <nav className="max-w-7xl mx-auto px-5 pt-5 flex items-center gap-1 text-sm text-gray-500 flex-wrap">
        <Link href="/" className="hover:text-teal-700 transition-colors">Home</Link>
        <ChevronRight size={14} className="text-gray-300" />
        <Link href="/quran" className="hover:text-teal-700 transition-colors">Quran</Link>
        <ChevronRight size={14} className="text-gray-300" />
        <Link href="/quran/juz" className="hover:text-teal-700 transition-colors">Juz</Link>
        <ChevronRight size={14} className="text-gray-300" />
        <span className="text-gray-700 font-medium">Juz {juzId}</span>
      </nav>

      <section className="max-w-7xl mx-auto px-5 py-10 pb-32 md:pb-36 space-y-8 fade-in-up">
        {Object.entries(grouped).map(([surahNum, surahVerses]) => (
          <div key={surahNum}>
            <Link
              href={`/quran/read/${surahNum}`}
              className="text-lg font-bold text-teal-900 hover:text-teal-700 transition-colors mb-4 inline-block"
            >
              Surah {surahNum}
            </Link>
            <div className="space-y-4">
              {surahVerses.map((verse) => (
                <div key={verse.id} className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {verse.verse_key}
                    </span>
                    <button
                      onClick={() => copyVerse(verse)}
                      className="text-gray-400 hover:text-teal-700 transition-colors p-1"
                    >
                      {copiedVerse === verse.verse_key ? <Check size={14} className="text-teal-700" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <p className="arabic-text text-2xl text-gray-900 mb-3 leading-[2.2]">
                    {verse.text_uthmani}
                  </p>
                  {verse.translations?.[0] && (
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {verse.translations[0].text.replace(/<[^>]*>/g, "")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Prev/Next Juz */}
        <div className="flex items-center justify-between pt-6">
          {Number(juzId) > 1 ? (
            <Link href={`/quran/juz/${Number(juzId) - 1}`} className="px-4 py-2 text-sm font-medium text-teal-900 bg-white rounded-full shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
              ← Juz {Number(juzId) - 1}
            </Link>
          ) : <div />}
          {Number(juzId) < 30 ? (
            <Link href={`/quran/juz/${Number(juzId) + 1}`} className="px-4 py-2 text-sm font-medium text-teal-900 bg-white rounded-full shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
              Juz {Number(juzId) + 1} →
            </Link>
          ) : <div />}
        </div>
      </section>
    </>
  );
}
