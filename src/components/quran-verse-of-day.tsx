"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Copy, Check } from "lucide-react";
import { getVerseOfTheDay } from "@/lib/quran";

export function QuranVerseOfDay() {
  const verse = useMemo(() => getVerseOfTheDay(), []);
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(
      `${verse.arabic}\n\n${verse.english}\n\n— ${verse.reference}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="w-[92%] max-w-5xl mx-auto mt-8 mb-4 fade-in-up">
      <div className="bg-teal-600 text-white rounded-2xl p-6 md:p-8 shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs uppercase tracking-wider text-teal-200 font-semibold">
            Verse of the Day
          </p>
          <button
            onClick={copy}
            className="text-teal-200 hover:text-white transition-colors"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
        <p className="arabic-text text-2xl sm:text-3xl md:text-4xl leading-relaxed mb-4">
          {verse.arabic}
        </p>
        <p className="text-teal-50 leading-relaxed text-base md:text-lg mb-3">
          {verse.english}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-teal-200 text-sm">{verse.reference}</p>
          <Link
            href={`/quran/read/${verse.surah}`}
            className="text-xs text-teal-200 hover:text-white transition-colors underline"
          >
            Read full Surah
          </Link>
        </div>
      </div>
    </section>
  );
}
