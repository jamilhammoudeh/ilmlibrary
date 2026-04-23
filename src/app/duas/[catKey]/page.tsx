"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import { GlyphText } from "@/components/glyph-text";
import {
  Copy,
  Check,
  Volume2,
  Minus,
  Plus,
  Printer,
  Share2,
  Bookmark,
} from "lucide-react";
import duasJson from "@/data/duas-data.json";
import { isBookmarked, addBookmark, removeBookmark } from "@/lib/bookmarks";
import { canonicalUrl, SITE_URL } from "@/lib/site";

const { duasData } = duasJson as {
  categories: { en: string; ar: string }[];
  duasData: Record<
    string,
    {
      title: string;
      items: {
        arabic: string;
        transliteration: string;
        english: string;
        reference: string;
      }[];
    }
  >;
};

export default function DuaCategoryPage({
  params,
}: {
  params: Promise<{ catKey: string }>;
}) {
  const [catKey, setCatKey] = useState("");
  const [arabicSize, setArabicSize] = useState(22);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  useEffect(() => {
    params.then(({ catKey }) => setCatKey(catKey));
  }, [params]);

  useEffect(() => {
    if (!catKey) return;
    const catData = duasData[catKey];
    if (!catData) return;
    const saved = new Set<string>();
    catData.items.forEach((_, i) => {
      const id = `dua-${catKey}-${i}`;
      if (isBookmarked(id)) saved.add(id);
    });
    setBookmarked(saved);

    function onChange() {
      const s = new Set<string>();
      catData.items.forEach((_, i) => {
        const id = `dua-${catKey}-${i}`;
        if (isBookmarked(id)) s.add(id);
      });
      setBookmarked(s);
    }
    window.addEventListener("bookmarks-changed", onChange);
    return () => window.removeEventListener("bookmarks-changed", onChange);
  }, [catKey]);

  const catData = duasData[catKey];

  if (!catKey) return null;
  if (!catData) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-gray-500">Category not found.</p>
      </div>
    );
  }

  async function copyDua(
    dua: { arabic: string; transliteration: string; english: string; reference: string },
    index: number
  ) {
    const url = `${SITE_URL}/duas/${catKey}`;
    const text = `${dua.arabic}\n\n${dua.transliteration || ""}\n\n${dua.english}\n\n[${dua.reference}]\n\n${url}`;
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  function speakArabic(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  }

  function toggleBookmark(dua: { arabic: string; english: string; reference: string }, index: number) {
    const id = `dua-${catKey}-${index}`;
    if (bookmarked.has(id)) {
      removeBookmark(id);
    } else {
      addBookmark({
        id,
        type: "dua",
        title: dua.english.slice(0, 80) + (dua.english.length > 80 ? "..." : ""),
        href: `/duas/${catKey}`,
      });
    }
  }

  return (
    <>
      <ContentHeader
        title={catData.title.split(" / ")[0]}
        breadcrumbs={[
          { label: "Duas", href: "/duas" },
          { label: catData.title.split(" / ")[0] },
        ]}
      />

      {/* Toolbar */}
      <div className="max-w-7xl mx-auto px-5 pt-4 pb-2 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-gray-500">
          <span className="text-xs mr-1">Arabic size:</span>
          <button
            onClick={() => setArabicSize((s) => Math.max(14, s - 2))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Minus size={14} />
          </button>
          <span className="text-xs w-6 text-center">{arabicSize}</span>
          <button
            onClick={() => setArabicSize((s) => Math.min(40, s + 2))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Plus size={14} />
          </button>
        </div>
        <div className="w-px h-5 bg-gray-200" />
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-teal-700"
        >
          <Printer size={13} /> Print
        </button>
        <button
          onClick={async () => {
            const url = canonicalUrl();
            if (navigator.share) {
              try { await navigator.share({ title: catData.title, url }); } catch {}
            } else {
              await navigator.clipboard.writeText(url);
            }
          }}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-teal-700"
        >
          <Share2 size={13} /> Share
        </button>
      </div>

      {/* Duas */}
      <section className="max-w-7xl mx-auto px-5 py-10 pb-20 md:pb-24 space-y-4 fade-in-up">
        {catData.items.map((dua, i) => {
          const duaId = `dua-${catKey}-${i}`;
          const isSaved = bookmarked.has(duaId);

          return (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 md:p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
            >
              <div
                className="font-[family-name:var(--font-amiri)] text-teal-900 mb-3 leading-relaxed"
                style={{ fontSize: arabicSize, direction: "rtl" }}
              >
                {dua.arabic}
              </div>
              {dua.transliteration && (
                <p className="italic text-gray-500 mb-2 text-sm">
                  <GlyphText>{dua.transliteration}</GlyphText>
                </p>
              )}
              <p className="text-gray-700 mb-2">
                <GlyphText>{dua.english}</GlyphText>
              </p>
              {dua.reference && (
                <p className="text-xs text-gray-400 mb-3">
                  [ <GlyphText>{dua.reference}</GlyphText> ]
                </p>
              )}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <button
                  onClick={() => copyDua(dua, i)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-teal-700 transition-colors"
                >
                  {copiedIndex === i ? (
                    <><Check size={13} className="text-teal-700" /> Copied</>
                  ) : (
                    <><Copy size={13} /> Copy</>
                  )}
                </button>
                <button
                  onClick={() => speakArabic(dua.arabic)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-teal-700 transition-colors"
                >
                  <Volume2 size={13} /> Listen
                </button>
                <button
                  onClick={() => toggleBookmark(dua, i)}
                  className={`flex items-center gap-1 text-xs transition-colors ${
                    isSaved ? "text-teal-700 font-medium" : "text-gray-400 hover:text-teal-700"
                  }`}
                >
                  <Bookmark size={13} className={isSaved ? "fill-teal-700" : ""} />
                  {isSaved ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}
