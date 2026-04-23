"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Bookmark,
  Copy,
  Check,
  Minus,
  Plus,
  Eye,
  EyeOff,
  BookOpen,
  Play,
  Pause,
  SkipForward,
  Sliders,
} from "lucide-react";
import { getQuranBookmark, saveQuranBookmark } from "@/lib/quran-bookmark";
import { RECITERS, getVerseAudioUrl, markSurahRead } from "@/lib/quran";

type Verse = {
  id: number;
  verse_number: number;
  verse_key: string;
  text_uthmani: string;
  text_uthmani_tajweed?: string;
  page_number?: number;
  juz_number?: number;
  translations: { text: string }[];
  words?: { text_uthmani: string; translation: { text: string } }[];
};

function toArabicDigits(n: number): string {
  return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
}

type Chapter = {
  id: number;
  name_simple: string;
  name_arabic: string;
  verses_count: number;
  revelation_place: string;
  translated_name: { name: string };
};

export default function SurahPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [surahId, setSurahId] = useState<string | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [allChapters, setAllChapters] = useState<
    { id: number; name_simple: string; name_arabic: string }[]
  >([]);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [tafsirs, setTafsirs] = useState<Record<number, string>>({});
  const [openTafsir, setOpenTafsir] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [arabicSize, setArabicSize] = useState(28);
  const [reciterId, setReciterId] = useState(7);
  const [copiedVerse, setCopiedVerse] = useState<number | null>(null);
  const [showWords, setShowWords] = useState(false);
  const [hideArabic, setHideArabic] = useState(false);
  const [mushafMode, setMushafMode] = useState(false);
  const [mushafPageIdx, setMushafPageIdx] = useState(0);
  const [showTajweed, setShowTajweed] = useState(false);
  const [toolbarExpanded, setToolbarExpanded] = useState(false);

  // Recitation tracking
  const [isRecitationPlaying, setIsRecitationPlaying] = useState(false);
  const [activeVerseIdx, setActiveVerseIdx] = useState<number | null>(null);
  const recitationAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    fetch("https://api.quran.com/api/v4/chapters")
      .then((r) => r.json())
      .then((d) =>
        setAllChapters(
          (d.chapters ?? []).map(
            (c: { id: number; name_simple: string; name_arabic: string }) => ({
              id: c.id,
              name_simple: c.name_simple,
              name_arabic: c.name_arabic,
            })
          )
        )
      )
      .catch(() => setAllChapters([]));
  }, []);

  useEffect(() => {
    params.then((p) => setSurahId(p.id));
  }, [params]);

  useEffect(() => {
    if (!surahId) return;
    async function load() {
      const [chRes, vRes] = await Promise.all([
        fetch(`https://api.quran.com/api/v4/chapters/${surahId}`),
        fetch(
          `https://api.quran.com/api/v4/verses/by_chapter/${surahId}?language=en&fields=text_uthmani,text_uthmani_tajweed,page_number,juz_number&translations=22&word_fields=text_uthmani,translation&words=true&per_page=300`
        ),
      ]);
      const chData = await chRes.json();
      const vData = await vRes.json();
      setChapter(chData.chapter);
      setVerses(vData.verses);
      setLoading(false);
      if (chData.chapter) markSurahRead(chData.chapter.id);
    }
    load();
  }, [surahId]);

  // Stop recitation if reciter or surah changes
  useEffect(() => {
    recitationAudioRef.current?.pause();
    setIsRecitationPlaying(false);
    setActiveVerseIdx(null);
  }, [reciterId, surahId]);

  const playFromVerse = useCallback(
    (idx: number) => {
      if (!verses[idx]) return;
      setActiveVerseIdx(idx);
      setIsRecitationPlaying(true);
      const url = getVerseAudioUrl(reciterId, verses[idx].verse_key);
      if (recitationAudioRef.current) {
        recitationAudioRef.current.src = url;
        recitationAudioRef.current.play().catch(() => {});
      }
    },
    [verses, reciterId]
  );

  const toggleRecitation = useCallback(() => {
    const audio = recitationAudioRef.current;
    if (!audio) return;
    if (isRecitationPlaying) {
      audio.pause();
      setIsRecitationPlaying(false);
    } else {
      if (activeVerseIdx === null) {
        playFromVerse(0);
      } else {
        audio.play().catch(() => {});
        setIsRecitationPlaying(true);
      }
    }
  }, [isRecitationPlaying, activeVerseIdx, playFromVerse]);

  const skipVerse = useCallback(() => {
    const idx = activeVerseIdx === null ? 0 : activeVerseIdx + 1;
    if (idx < verses.length) playFromVerse(idx);
  }, [activeVerseIdx, verses.length, playFromVerse]);

  function onRecitationEnded() {
    if (activeVerseIdx === null) return;
    const nextIdx = activeVerseIdx + 1;
    if (nextIdx >= verses.length) {
      setIsRecitationPlaying(false);
      return;
    }
    playFromVerse(nextIdx);
  }

  // Group verses into Madinah Mushaf pages
  const mushafPages = useMemo(() => {
    if (!verses.length) return [] as { page: number; verses: Verse[] }[];
    const grouped = new Map<number, Verse[]>();
    for (const v of verses) {
      const p = v.page_number ?? 0;
      if (!grouped.has(p)) grouped.set(p, []);
      grouped.get(p)!.push(v);
    }
    return Array.from(grouped.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([page, vs]) => ({ page, verses: vs }));
  }, [verses]);

  useEffect(() => {
    if (!surahId) return;
    try {
      const saved = localStorage.getItem(`ilm-mushaf-page-${surahId}`);
      setMushafPageIdx(saved ? Number(saved) : 0);
    } catch {
      setMushafPageIdx(0);
    }
  }, [surahId]);

  // Auto-flip Mushaf page when the active recitation verse moves to a new page
  useEffect(() => {
    if (activeVerseIdx === null || !mushafMode || mushafPages.length === 0) return;
    const activeVerse = verses[activeVerseIdx];
    if (!activeVerse) return;
    const pageIdx = mushafPages.findIndex((p) =>
      p.verses.some((v) => v.id === activeVerse.id)
    );
    if (pageIdx !== -1 && pageIdx !== mushafPageIdx) {
      setMushafPageIdx(pageIdx);
    }
  }, [activeVerseIdx, mushafMode, verses, mushafPages, mushafPageIdx]);

  // Auto-scroll to the active verse in card view or Mushaf view
  useEffect(() => {
    if (activeVerseIdx === null) return;
    const activeVerse = verses[activeVerseIdx];
    if (!activeVerse) return;
    const el = document.querySelector<HTMLElement>(
      `[data-verse-key="${activeVerse.verse_key}"]`
    );
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeVerseIdx, mushafMode, mushafPageIdx, verses]);

  useEffect(() => {
    if (!surahId || mushafPages.length === 0) return;
    try {
      localStorage.setItem(`ilm-mushaf-page-${surahId}`, String(mushafPageIdx));
    } catch {}
  }, [surahId, mushafPageIdx, mushafPages.length]);

  const prevMushafPage = useCallback(() => {
    setMushafPageIdx((i) => Math.max(0, i - 1));
  }, []);
  const nextMushafPage = useCallback(() => {
    setMushafPageIdx((i) => Math.min(mushafPages.length - 1, i + 1));
  }, [mushafPages.length]);

  useEffect(() => {
    if (!mushafMode) return;
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextMushafPage();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevMushafPage();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mushafMode, nextMushafPage, prevMushafPage]);

  async function loadTafsir(verseNumber: number) {
    if (tafsirs[verseNumber]) {
      setOpenTafsir(openTafsir === verseNumber ? null : verseNumber);
      return;
    }
    try {
      const res = await fetch(
        `https://api.qurancdn.com/api/v4/tafsirs/en-tafisr-ibn-kathir/by_ayah/${surahId}:${verseNumber}`
      );
      const data = await res.json();
      const text = data.tafsir?.text?.replace(/<[^>]*>/g, "") || "Tafsir not available.";
      setTafsirs((prev) => ({ ...prev, [verseNumber]: text }));
      setOpenTafsir(verseNumber);
    } catch {
      setTafsirs((prev) => ({ ...prev, [verseNumber]: "Failed to load." }));
      setOpenTafsir(verseNumber);
    }
  }

  async function copyVerse(verse: Verse) {
    const translation = verse.translations?.[0]?.text?.replace(/<[^>]*>/g, "") ?? "";
    const text = `${verse.text_uthmani}\n\n${translation}\n\n— Quran ${verse.verse_key}`;
    await navigator.clipboard.writeText(text);
    setCopiedVerse(verse.verse_number);
    setTimeout(() => setCopiedVerse(null), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-teal-200 border-t-teal-700 rounded-full animate-spin" />
      </div>
    );
  }

  if (!chapter) return null;

  return (
    <>
      {/* Header */}
      <section className="bg-[#f0f0f0] pt-8 md:pt-10 pb-3 px-5 text-center fade-in-up">
        <p className="arabic-text text-3xl sm:text-4xl text-teal-900 mb-2">{chapter.name_arabic}</p>
        <h1 className="text-[28px] sm:text-[38px] md:text-[48px] font-bold font-[family-name:var(--font-playfair)] text-teal-900 leading-[1.1] mb-1">
          {chapter.name_simple}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {chapter.revelation_place === "makkah" ? "Meccan" : "Medinan"} · {chapter.verses_count} verses
          {chapter.translated_name ? ` · ${chapter.translated_name.name}` : ""}
        </p>
      </section>

      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-5 pt-5 flex items-center gap-1 text-sm text-gray-500 flex-wrap">
        <Link href="/" className="hover:text-teal-700 transition-colors">Home</Link>
        <ChevronRight size={14} className="text-gray-300" />
        <Link href="/quran" className="hover:text-teal-700 transition-colors">Quran</Link>
        <ChevronRight size={14} className="text-gray-300" />
        <Link href="/quran/read" className="hover:text-teal-700 transition-colors">Read</Link>
        <ChevronRight size={14} className="text-gray-300" />
        <span className="text-gray-700 font-medium">{chapter.name_simple}</span>
      </nav>

      {/* Sticky toolbar */}
      <div className="sticky top-14 z-30 bg-[#f0f0f0]/90 backdrop-blur-md border-b border-gray-200/60 pt-2 pb-2 sm:pt-3 sm:pb-3">
        <div className="max-w-7xl mx-auto px-3 sm:px-5">
          <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-gray-500">
            {/* Row 1: always visible essentials */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              {/* Surah switcher */}
              <select
                value={chapter?.id ?? surahId ?? ""}
                onChange={(e) => router.push(`/quran/read/${e.target.value}`)}
                className="text-sm font-semibold text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-700 flex-1 sm:flex-initial min-w-0 max-w-[200px]"
                aria-label="Switch surah"
              >
                {allChapters.length === 0 && chapter && (
                  <option value={chapter.id}>
                    {chapter.id}. {chapter.name_simple}
                  </option>
                )}
                {allChapters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id}. {c.name_simple}
                  </option>
                ))}
              </select>

              {/* Recitation play/pause */}
              <button
                onClick={toggleRecitation}
                className="inline-flex items-center gap-1.5 bg-teal-900 hover:bg-teal-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors shadow-[0_2px_6px_rgba(0,77,64,0.25)] shrink-0"
                aria-label={isRecitationPlaying ? "Pause recitation" : "Play recitation"}
              >
                {isRecitationPlaying ? <Pause size={12} /> : <Play size={12} />}
                <span className="hidden xs:inline sm:inline">
                  {isRecitationPlaying ? "Pause" : "Listen"}
                </span>
              </button>

              {isRecitationPlaying && activeVerseIdx !== null && (
                <button
                  onClick={skipVerse}
                  className="inline-flex items-center text-xs text-gray-500 hover:text-teal-700 p-1.5 rounded-full hover:bg-gray-50 transition-colors shrink-0"
                  aria-label="Next ayah"
                  title="Next ayah"
                >
                  <SkipForward size={12} />
                </button>
              )}

              {activeVerseIdx !== null && verses[activeVerseIdx] && (
                <span className="text-[11px] sm:text-xs text-gray-500 inline-flex items-center gap-1 shrink-0">
                  <span className="h-1.5 w-1.5 bg-teal-600 rounded-full animate-pulse" />
                  Ayah {verses[activeVerseIdx].verse_number}
                </span>
              )}

              {/* Reciter */}
              <select
                value={reciterId}
                onChange={(e) => setReciterId(Number(e.target.value))}
                className="text-xs bg-gray-50 hover:bg-gray-100 border-none rounded-full px-2.5 py-1.5 focus:outline-none cursor-pointer text-gray-700 shrink-0 hidden sm:block"
                aria-label="Choose reciter"
              >
                {RECITERS.map((r) => (
                  <option key={r.id} value={r.id}>{r.short}</option>
                ))}
              </select>

              {/* Spacer pushes expand button to the right on mobile */}
              <div className="flex-1 sm:hidden" />

              {/* Expand toggle (mobile only) */}
              <button
                onClick={() => setToolbarExpanded((v) => !v)}
                className={`sm:hidden inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full transition-colors shrink-0 ${
                  toolbarExpanded
                    ? "bg-teal-50 text-teal-700 font-semibold"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
                aria-label="Toggle more options"
                aria-expanded={toolbarExpanded}
              >
                <Sliders size={12} />
              </button>

              {/* Desktop-only inline extras */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-px h-5 bg-gray-200" />
                <div className="flex items-center gap-0.5 bg-gray-50 rounded-full px-1.5 py-0.5">
                  <span className="text-[10px] text-gray-500">Aa</span>
                  <button onClick={() => setArabicSize((s) => Math.max(18, s - 2))} className="p-0.5 hover:bg-gray-200 rounded" aria-label="Smaller"><Minus size={12} /></button>
                  <span className="text-xs w-5 text-center font-medium text-gray-700">{arabicSize}</span>
                  <button onClick={() => setArabicSize((s) => Math.min(48, s + 2))} className="p-0.5 hover:bg-gray-200 rounded" aria-label="Larger"><Plus size={12} /></button>
                </div>
                <div className="w-px h-5 bg-gray-200" />
                <button
                  onClick={() => setMushafMode(!mushafMode)}
                  className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full transition-colors ${mushafMode ? "bg-teal-50 text-teal-700 font-semibold" : "hover:bg-gray-100"}`}
                  title="Read as a continuous page, like a printed Mushaf"
                >
                  <BookOpen size={11} /> Mushaf
                </button>
                <button
                  onClick={() => setShowTajweed(!showTajweed)}
                  className={`text-xs px-2.5 py-1.5 rounded-full transition-colors ${showTajweed ? "bg-teal-50 text-teal-700 font-semibold" : "hover:bg-gray-100"}`}
                  title="Color-code tajweed rules"
                >
                  Tajweed
                </button>
                <button
                  onClick={() => setShowWords(!showWords)}
                  disabled={mushafMode}
                  className={`text-xs px-2.5 py-1.5 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${showWords ? "bg-teal-50 text-teal-700 font-semibold" : "hover:bg-gray-100"}`}
                >
                  Word by Word
                </button>
                <button
                  onClick={() => setHideArabic(!hideArabic)}
                  disabled={mushafMode}
                  className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${hideArabic ? "bg-amber-50 text-amber-700 font-semibold" : "hover:bg-gray-100"}`}
                >
                  {hideArabic ? <EyeOff size={11} /> : <Eye size={11} />} Memorize
                </button>
              </div>
            </div>

            {/* Row 2: mobile-only expanded extras */}
            {toolbarExpanded && (
              <div className="sm:hidden mt-2 pt-2 border-t border-gray-100 flex items-center gap-1.5 flex-wrap">
                <select
                  value={reciterId}
                  onChange={(e) => setReciterId(Number(e.target.value))}
                  className="text-xs bg-gray-50 hover:bg-gray-100 border-none rounded-full px-2.5 py-1.5 focus:outline-none cursor-pointer text-gray-700"
                  aria-label="Choose reciter"
                >
                  {RECITERS.map((r) => (
                    <option key={r.id} value={r.id}>{r.short}</option>
                  ))}
                </select>
                <div className="flex items-center gap-0.5 bg-gray-50 rounded-full px-1.5 py-0.5">
                  <span className="text-[10px] text-gray-500">Aa</span>
                  <button onClick={() => setArabicSize((s) => Math.max(18, s - 2))} className="p-0.5 hover:bg-gray-200 rounded"><Minus size={12} /></button>
                  <span className="text-xs w-5 text-center font-medium text-gray-700">{arabicSize}</span>
                  <button onClick={() => setArabicSize((s) => Math.min(48, s + 2))} className="p-0.5 hover:bg-gray-200 rounded"><Plus size={12} /></button>
                </div>
                <button
                  onClick={() => setMushafMode(!mushafMode)}
                  className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full transition-colors ${mushafMode ? "bg-teal-50 text-teal-700 font-semibold" : "bg-gray-50 text-gray-600"}`}
                >
                  <BookOpen size={11} /> Mushaf
                </button>
                <button
                  onClick={() => setShowTajweed(!showTajweed)}
                  className={`text-xs px-2.5 py-1.5 rounded-full transition-colors ${showTajweed ? "bg-teal-50 text-teal-700 font-semibold" : "bg-gray-50 text-gray-600"}`}
                >
                  Tajweed
                </button>
                <button
                  onClick={() => setShowWords(!showWords)}
                  disabled={mushafMode}
                  className={`text-xs px-2.5 py-1.5 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${showWords ? "bg-teal-50 text-teal-700 font-semibold" : "bg-gray-50 text-gray-600"}`}
                >
                  Word by Word
                </button>
                <button
                  onClick={() => setHideArabic(!hideArabic)}
                  disabled={mushafMode}
                  className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${hideArabic ? "bg-amber-50 text-amber-700 font-semibold" : "bg-gray-50 text-gray-600"}`}
                >
                  {hideArabic ? <EyeOff size={11} /> : <Eye size={11} />} Memorize
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden audio element for recitation tracking */}
      <audio
        ref={recitationAudioRef}
        onEnded={onRecitationEnded}
        onPause={() => setIsRecitationPlaying(false)}
        onPlay={() => setIsRecitationPlaying(true)}
        className="hidden"
      />

      {/* Mushaf (paginated-page) view */}
      {mushafMode ? (() => {
        const currentPage = mushafPages[mushafPageIdx];
        const atFirst = mushafPageIdx === 0;
        const atLast = mushafPageIdx === mushafPages.length - 1;
        if (!currentPage) return null;

        const prevHref = chapter.id > 1 ? `/quran/read/${chapter.id - 1}` : null;
        const nextHref = chapter.id < 114 ? `/quran/read/${chapter.id + 1}` : null;

        function handleTouchStart(e: React.TouchEvent) {
          (e.currentTarget as HTMLElement).dataset.touchX = String(
            e.touches[0].clientX
          );
        }
        function handleTouchEnd(e: React.TouchEvent) {
          const startStr = (e.currentTarget as HTMLElement).dataset.touchX;
          if (!startStr) return;
          const start = Number(startStr);
          const dx = e.changedTouches[0].clientX - start;
          if (Math.abs(dx) > 60) {
            if (dx < 0) nextMushafPage();
            else prevMushafPage();
          }
        }

        return (
          <section className="max-w-4xl mx-auto px-5 py-6 pb-32 md:pb-36 fade-in-up">
            {/* Compact status bar: context + jump-to */}
            <div className="flex items-center justify-center gap-3 mb-4 flex-wrap text-xs">
              <span className="font-semibold text-teal-900">
                {chapter.name_simple}
              </span>
              <span className="text-gray-300">·</span>
              <span className="text-gray-500 inline-flex items-center gap-1.5">
                Mushaf page
                <select
                  value={mushafPageIdx}
                  onChange={(e) => setMushafPageIdx(Number(e.target.value))}
                  className="bg-white border border-gray-200 rounded-lg px-2 py-0.5 font-semibold text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-700"
                  aria-label="Jump to Mushaf page"
                >
                  {mushafPages.map((p, i) => (
                    <option key={p.page} value={i}>
                      {p.page}
                    </option>
                  ))}
                </select>
              </span>
              {currentPage.verses[0]?.juz_number && (
                <>
                  <span className="text-gray-300">·</span>
                  <span className="text-gray-500">
                    Juz {currentPage.verses[0].juz_number}
                  </span>
                </>
              )}
            </div>

            {/* The page (with swipe support) */}
            <article
              className="relative bg-[#fdfbf3] border border-[#e8dfc6] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] px-6 py-12 md:px-14 md:py-16 touch-pan-y select-none"
              dir="rtl"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="absolute top-3 left-3 arabic-text text-teal-700"
                style={{ fontSize: "14px" }}
                aria-hidden
              >
                {toArabicDigits(currentPage.page)}
              </div>

              {atFirst && (
                <div className="text-center border-b border-[#e8dfc6] pb-6 mb-6">
                  <p className="arabic-text text-2xl text-teal-900 mb-1">
                    سُورَةُ {chapter.name_arabic}
                  </p>
                  <p className="text-xs text-gray-500" dir="ltr">
                    Surah {chapter.name_simple} ·{" "}
                    {chapter.revelation_place === "makkah" ? "Meccan" : "Medinan"}{" "}
                    · {chapter.verses_count} verses
                  </p>
                </div>
              )}

              {atFirst && chapter.id !== 9 && chapter.id !== 1 && (
                <p
                  className="arabic-text text-center text-teal-900 mb-8"
                  style={{ fontSize: Math.max(arabicSize, 30) }}
                >
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              )}

              <p
                className="arabic-text text-gray-900 text-justify"
                style={{ fontSize: arabicSize, lineHeight: 2.4 }}
              >
                {currentPage.verses.map((verse, i) => {
                  const markerStyle = {
                    width: `${arabicSize * 1.1}px`,
                    height: `${arabicSize * 1.1}px`,
                    fontSize: `${arabicSize * 0.5}px`,
                    lineHeight: 1,
                  };
                  const globalIdx = verses.findIndex((v) => v.id === verse.id);
                  const isActive =
                    activeVerseIdx !== null &&
                    verses[activeVerseIdx]?.verse_key === verse.verse_key;
                  return (
                    <span
                      key={verse.id}
                      data-verse-key={verse.verse_key}
                      onDoubleClick={() => playFromVerse(globalIdx)}
                      title="Double-click to play this ayah"
                      className={`cursor-pointer transition-colors rounded-md ${
                        isActive
                          ? "bg-teal-100/70 px-1"
                          : "hover:bg-teal-50/60"
                      }`}
                    >
                      {showTajweed && verse.text_uthmani_tajweed ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: verse.text_uthmani_tajweed,
                          }}
                        />
                      ) : (
                        verse.text_uthmani
                      )}
                      <span
                        className={`inline-flex items-center justify-center align-middle mx-1.5 border-2 rounded-full arabic-text transition-colors ${
                          isActive
                            ? "bg-teal-700 text-white border-teal-700"
                            : "border-teal-700 text-teal-800"
                        }`}
                        style={markerStyle}
                        aria-label={`Ayah ${verse.verse_number}`}
                      >
                        {toArabicDigits(verse.verse_number)}
                      </span>
                      {i < currentPage.verses.length - 1 && " "}
                    </span>
                  );
                })}
              </p>

              {/* Tajweed legend (inside the page) */}
              {showTajweed && (
                <div
                  className="mt-8 pt-4 border-t border-[#e8dfc6]"
                  dir="ltr"
                >
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Tajweed legend
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-600">
                    <span><span className="inline-block w-2.5 h-2.5 rounded-full align-middle mr-1" style={{ background: "#dc2626" }} />Madd</span>
                    <span><span className="inline-block w-2.5 h-2.5 rounded-full align-middle mr-1" style={{ background: "#15803d" }} />Ghunnah / Idgham</span>
                    <span><span className="inline-block w-2.5 h-2.5 rounded-full align-middle mr-1" style={{ background: "#7e22ce" }} />Ikhfa</span>
                    <span><span className="inline-block w-2.5 h-2.5 rounded-full align-middle mr-1" style={{ background: "#b45309" }} />Iqlab</span>
                    <span><span className="inline-block w-2.5 h-2.5 rounded-full align-middle mr-1" style={{ background: "#d97706" }} />Qalqalah</span>
                    <span><span className="inline-block w-2.5 h-2.5 rounded-full align-middle mr-1" style={{ background: "#4b5563" }} />Idgham no ghunnah</span>
                    <span><span className="inline-block w-2.5 h-2.5 rounded-full align-middle mr-1" style={{ background: "#9ca3af" }} />Hamzat wasl / silent</span>
                  </div>
                </div>
              )}

              {/* Footer strip inside the page */}
              <div
                className="mt-8 pt-4 border-t border-[#e8dfc6] text-[11px] text-gray-400 flex items-center justify-between"
                dir="ltr"
              >
                <span>
                  Ayahs {currentPage.verses[0]?.verse_number}
                  {currentPage.verses.length > 1 &&
                    ` - ${currentPage.verses[currentPage.verses.length - 1].verse_number}`}
                </span>
                <span>
                  Page {mushafPageIdx + 1} of {mushafPages.length} in this surah
                </span>
              </div>
            </article>

            {/* Primary Prev/Next nav. Morphs into surah-jump at boundaries */}
            <div className="flex items-center justify-between mt-5 flex-wrap gap-2">
              {atFirst ? (
                prevHref ? (
                  <Link
                    href={prevHref}
                    className="px-4 py-2 text-sm font-semibold text-teal-900 bg-white rounded-full shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 inline-flex items-center gap-1"
                  >
                    <ChevronRight size={16} className="rotate-180" /> Previous Surah
                  </Link>
                ) : (
                  <div />
                )
              ) : (
                <button
                  onClick={prevMushafPage}
                  className="px-4 py-2 text-sm font-semibold text-teal-900 bg-white rounded-full shadow-sm hover:shadow-md transition-all inline-flex items-center gap-1"
                >
                  <ChevronRight size={16} className="rotate-180" /> Previous page
                </button>
              )}
              <p className="text-xs text-gray-400 hidden sm:block">
                Use ← / → or swipe to flip pages
              </p>
              {atLast ? (
                nextHref ? (
                  <Link
                    href={nextHref}
                    className="px-4 py-2 text-sm font-semibold text-white bg-teal-900 hover:bg-teal-800 rounded-full shadow-[0_4px_12px_rgba(0,77,64,0.25)] transition-all hover:-translate-y-0.5 inline-flex items-center gap-1"
                  >
                    Next Surah <ChevronRight size={16} />
                  </Link>
                ) : (
                  <div />
                )
              ) : (
                <button
                  onClick={nextMushafPage}
                  className="px-4 py-2 text-sm font-semibold text-white bg-teal-900 hover:bg-teal-800 rounded-full shadow-[0_4px_12px_rgba(0,77,64,0.25)] transition-all inline-flex items-center gap-1"
                >
                  Next page <ChevronRight size={16} />
                </button>
              )}
            </div>

            {/* Page dots */}
            {mushafPages.length > 1 && mushafPages.length <= 30 && (
              <div className="flex items-center justify-center gap-1.5 mt-4 flex-wrap">
                {mushafPages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setMushafPageIdx(i)}
                    aria-label={`Go to surah page ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      i === mushafPageIdx
                        ? "w-6 bg-teal-700"
                        : "w-2 bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })() : (
      <section className="max-w-7xl mx-auto px-5 py-10 pb-32 md:pb-36 space-y-5 fade-in-up">
        {/* Bismillah - shown for all surahs except At-Tawbah (9) and Al-Fatiha (1, since it's part of the surah) */}
        {chapter.id !== 9 && chapter.id !== 1 && (
          <div className="text-center py-6">
            <p className="arabic-text text-3xl text-teal-900">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            <p className="text-xs text-gray-500 mt-2">In the name of Allah, the Most Gracious, the Most Merciful</p>
          </div>
        )}

        {verses.map((verse, vIdx) => {
          const isTafsirOpen = openTafsir === verse.verse_number;
          const isActive = activeVerseIdx === vIdx;

          return (
            <div
              key={verse.id}
              data-verse-key={verse.verse_key}
              className={`bg-white rounded-2xl p-5 md:p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all ${
                isActive ? "ring-2 ring-teal-600 shadow-[0_8px_24px_rgba(0,121,107,0.18)]" : ""
              }`}
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${isActive ? "bg-teal-700 text-white" : "bg-teal-50 text-teal-900"}`}>
                    {verse.verse_number}
                  </span>
                  <button
                    onClick={() =>
                      isActive && isRecitationPlaying
                        ? toggleRecitation()
                        : playFromVerse(vIdx)
                    }
                    className="p-1.5 rounded-full bg-gray-50 hover:bg-teal-50 text-teal-700 transition-colors"
                    title={
                      isActive && isRecitationPlaying
                        ? "Pause"
                        : "Play from this ayah"
                    }
                  >
                    {isActive && isRecitationPlaying ? (
                      <Pause size={13} />
                    ) : (
                      <Play size={13} />
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => copyVerse(verse)} className="text-gray-400 hover:text-teal-700 transition-colors p-1" title="Copy">
                    {copiedVerse === verse.verse_number ? <Check size={15} className="text-teal-700" /> : <Copy size={15} />}
                  </button>
                  <button
                    onClick={() => saveQuranBookmark(chapter.id, chapter.name_simple, verse.verse_number)}
                    className="text-gray-400 hover:text-teal-700 transition-colors p-1"
                    title="Bookmark"
                  >
                    <Bookmark size={15} />
                  </button>
                </div>
              </div>

              {/* Arabic */}
              {!hideArabic ? (
                showTajweed && verse.text_uthmani_tajweed ? (
                  <p
                    className="arabic-text text-gray-900 mb-4 leading-[2.2] cursor-pointer rounded-md hover:bg-teal-50/40 transition-colors"
                    style={{ fontSize: arabicSize }}
                    onDoubleClick={() => playFromVerse(vIdx)}
                    title="Double-click to play this ayah"
                    dangerouslySetInnerHTML={{ __html: verse.text_uthmani_tajweed }}
                  />
                ) : (
                  <p
                    className="arabic-text text-gray-900 mb-4 leading-[2.2] cursor-pointer rounded-md hover:bg-teal-50/40 transition-colors"
                    style={{ fontSize: arabicSize }}
                    onDoubleClick={() => playFromVerse(vIdx)}
                    title="Double-click to play this ayah"
                  >
                    {verse.text_uthmani}
                  </p>
                )
              ) : (
                <button
                  onClick={() => setHideArabic(false)}
                  className="w-full py-6 mb-4 bg-amber-50 rounded-xl text-amber-600 text-sm font-medium hover:bg-amber-100 transition-colors"
                >
                  Tap to reveal
                </button>
              )}

              {/* Word-by-word */}
              {showWords && verse.words && (
                <div className="flex flex-wrap gap-3 mb-4 p-3 bg-teal-50 rounded-xl" dir="rtl">
                  {verse.words.map((word, wi) => (
                    <div key={wi} className="text-center">
                      <p className="arabic-text text-lg text-teal-900">{word.text_uthmani}</p>
                      {word.translation && (
                        <p className="text-[10px] text-gray-500 mt-0.5" dir="ltr">{word.translation.text}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Translation */}
              {verse.translations?.[0] && (
                <p className="text-gray-700 leading-relaxed mb-3">
                  {verse.translations[0].text.replace(/<[^>]*>/g, "")}
                </p>
              )}

              {/* Tafsir */}
              <button
                onClick={() => loadTafsir(verse.verse_number)}
                className="inline-flex items-center gap-1 text-xs text-teal-700 hover:text-teal-900 font-medium"
              >
                {isTafsirOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {isTafsirOpen ? "Hide Tafsir" : "Tafsir Ibn Kathir"}
              </button>

              {isTafsirOpen && tafsirs[verse.verse_number] && (
                <div className="mt-3 p-4 bg-teal-50 rounded-xl text-sm text-gray-700 leading-relaxed max-h-64 overflow-y-auto">
                  {tafsirs[verse.verse_number]}
                </div>
              )}
            </div>
          );
        })}

        {/* Prev/Next */}
        <div className="flex items-center justify-between pt-6">
          {chapter.id > 1 ? (
            <Link href={`/quran/read/${chapter.id - 1}`} className="px-4 py-2 text-sm font-medium text-teal-900 bg-white rounded-full shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
              ← Previous Surah
            </Link>
          ) : <div />}
          {chapter.id < 114 ? (
            <Link href={`/quran/read/${chapter.id + 1}`} className="px-4 py-2 text-sm font-medium text-teal-900 bg-white rounded-full shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
              Next Surah →
            </Link>
          ) : <div />}
        </div>
      </section>
      )}
    </>
  );
}
