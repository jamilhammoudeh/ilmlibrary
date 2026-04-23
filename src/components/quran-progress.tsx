"use client";

import { useState, useEffect } from "react";
import { getSurahsReadCount } from "@/lib/quran";
import { getQuranBookmark } from "@/lib/quran-bookmark";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export function QuranProgress() {
  const [readCount, setReadCount] = useState(0);
  const [bookmark, setBookmark] = useState<ReturnType<typeof getQuranBookmark>>(null);

  useEffect(() => {
    setReadCount(getSurahsReadCount());
    setBookmark(getQuranBookmark());
  }, []);

  if (readCount === 0 && !bookmark) return null;

  const percent = Math.round((readCount / 114) * 100);

  return (
    <section className="w-[92%] max-w-5xl mx-auto mb-4 fade-in-up">
      <div className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-teal-900">Your Progress</h3>
          <span className="text-xs text-gray-500">{readCount}/114 Surahs</span>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-teal-600 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Continue reading */}
        {bookmark && (
          <Link
            href={`/quran/read/${bookmark.surahId}`}
            className="flex items-center gap-2 text-sm text-teal-700 hover:text-teal-900 transition-colors"
          >
            <BookOpen size={14} />
            Continue: {bookmark.surahName} — Ayah {bookmark.ayah}
          </Link>
        )}
      </div>
    </section>
  );
}
