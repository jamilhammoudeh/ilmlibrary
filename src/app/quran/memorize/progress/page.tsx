"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import { getReadingSurahs, markSurahRead } from "@/lib/quran";
import { Check } from "lucide-react";

type Chapter = {
  id: number;
  name_simple: string;
  name_arabic: string;
  verses_count: number;
};

export default function ProgressPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [readSurahs, setReadSurahs] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.quran.com/api/v4/chapters?language=en")
      .then((r) => r.json())
      .then((d) => {
        setChapters(d.chapters);
        setLoading(false);
      });
    setReadSurahs(getReadingSurahs());
  }, []);

  function toggleSurah(id: number) {
    const current = getReadingSurahs();
    if (current[id]) {
      delete current[id];
      localStorage.setItem("ilm-quran-progress", JSON.stringify(current));
    } else {
      markSurahRead(id);
    }
    setReadSurahs({ ...getReadingSurahs() });
  }

  const readCount = Object.keys(readSurahs).length;
  const percent = Math.round((readCount / 114) * 100);

  return (
    <>
      <ContentHeader
        title="My Progress"
        subtitle="Track your Quran memorization journey"
        breadcrumbs={[
          { label: "Quran", href: "/quran" },
          { label: "Memorize", href: "/quran/memorize" },
          { label: "Progress" },
        ]}
      />

      <section className="max-w-7xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        {/* Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-teal-900">Overall Progress</h3>
            <span className="text-sm text-gray-500">{readCount}/114 Surahs</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-teal-700 rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 text-center">{percent}% complete</p>
        </div>

        {/* Surah grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-3 border-teal-200 border-t-teal-700 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {chapters.map((ch) => {
              const isRead = readSurahs[ch.id];
              return (
                <button
                  key={ch.id}
                  onClick={() => toggleSurah(ch.id)}
                  className={`rounded-2xl p-3 text-left transition-all duration-200 ${
                    isRead
                      ? "bg-teal-700 text-white shadow-[0_4px_12px_rgba(0,77,64,0.2)]"
                      : "bg-white text-gray-900 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-0.5"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${isRead ? "text-teal-200" : "text-gray-400"}`}>
                      {ch.id}
                    </span>
                    {isRead && <Check size={14} />}
                  </div>
                  <p className={`text-sm font-semibold truncate ${isRead ? "text-white" : "text-teal-900"}`}>
                    {ch.name_simple}
                  </p>
                  <p className={`text-xs ${isRead ? "text-teal-200" : "text-gray-400"}`}>
                    {ch.verses_count} verses
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
