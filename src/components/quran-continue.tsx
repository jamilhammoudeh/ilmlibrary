"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { getQuranBookmark } from "@/lib/quran-bookmark";

export function QuranContinue() {
  const [bm, setBm] = useState<ReturnType<typeof getQuranBookmark>>(null);

  useEffect(() => {
    setBm(getQuranBookmark());
  }, []);

  if (!bm) return null;

  return (
    <div className="max-w-4xl mx-auto px-5 mb-6">
      <Link
        href={`/quran/read/${bm.surahId}`}
        className="block bg-teal-50 border border-teal-200 rounded-2xl px-5 py-4 hover:bg-teal-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <BookOpen size={20} className="text-teal-700 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-teal-900">
              Continue Reading
            </p>
            <p className="text-xs text-teal-700">
              {bm.surahName} — Ayah {bm.ayah}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
