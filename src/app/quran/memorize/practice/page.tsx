"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ContentHeader } from "@/components/content-header";
import {
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Repeat,
  Lightbulb,
  RotateCcw,
  BookOpen,
  Keyboard,
} from "lucide-react";
import { RECITERS, getVerseAudioUrl } from "@/lib/quran";

type Verse = {
  id: number;
  verse_number: number;
  verse_key: string;
  text_uthmani: string;
  translations: { text: string }[];
};

type Chapter = {
  id: number;
  name_simple: string;
  name_arabic: string;
  verses_count: number;
};

const SPEEDS = [0.75, 1, 1.25, 1.5];

function formatTime(seconds: number) {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function firstWords(text: string, count: number): string {
  const words = text.split(/\s+/).filter(Boolean);
  return words.slice(0, count).join(" ");
}

export default function PracticePage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [surahId, setSurahId] = useState(114);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [reciterId, setReciterId] = useState(7);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [loopMode, setLoopMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeatCount, setRepeatCount] = useState(0);

  const [showPrevious, setShowPrevious] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);
  const [hintLevel, setHintLevel] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    fetch("https://api.quran.com/api/v4/chapters")
      .then((r) => r.json())
      .then((d) => setChapters(d.chapters ?? []))
      .catch(() => setChapters([]));
  }, []);

  useEffect(() => {
    async function loadSurah(id: number) {
      setLoading(true);
      setCurrentIndex(0);
      setRevealed(false);
      setRepeatCount(0);
      setHintLevel(0);

      const vRes = await fetch(
        `https://api.quran.com/api/v4/verses/by_chapter/${id}?language=en&fields=text_uthmani&translations=22&per_page=300`
      );
      const vData = await vRes.json();
      setVerses(vData.verses ?? []);
      setLoading(false);
    }
    loadSurah(surahId);
  }, [surahId]);

  const currentChapter = chapters.find((c) => c.id === surahId);
  const verse = verses[currentIndex];
  const previousVerse = currentIndex > 0 ? verses[currentIndex - 1] : null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !verse) return;
    audio.src = getVerseAudioUrl(reciterId, verse.verse_key);
    audio.load();
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [verse?.verse_key, reciterId]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.loop = loopMode;
  }, [loopMode]);

  const next = useCallback(() => {
    setCurrentIndex((i) => {
      if (i < verses.length - 1) {
        audioRef.current?.pause();
        setRevealed(false);
        setRepeatCount(0);
        setHintLevel(0);
        return i + 1;
      }
      return i;
    });
  }, [verses.length]);

  const prev = useCallback(() => {
    setCurrentIndex((i) => {
      if (i > 0) {
        audioRef.current?.pause();
        setRevealed(false);
        setRepeatCount(0);
        setHintLevel(0);
        return i - 1;
      }
      return i;
    });
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }, []);

  const restart = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName)
      ) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "ArrowRight") {
        next();
      } else if (e.key === "ArrowLeft") {
        prev();
      } else if (e.key.toLowerCase() === "r") {
        setRevealed((v) => !v);
      } else if (e.key.toLowerCase() === "l") {
        setLoopMode((v) => !v);
      } else if (e.key.toLowerCase() === "h") {
        setHintLevel((v) => (v + 1) % 3);
      } else if (e.key.toLowerCase() === "p") {
        setShowPrevious((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePlay, next, prev]);

  function onPlay() {
    setIsPlaying(true);
    setRepeatCount((c) => c + 1);
  }
  function onPause() {
    setIsPlaying(false);
  }
  function onTimeUpdate() {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  }
  function onLoadedMetadata() {
    if (audioRef.current) setDuration(audioRef.current.duration);
  }
  function onEnded() {
    if (!loopMode) setIsPlaying(false);
  }
  function onSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const t = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = t;
    setCurrentTime(t);
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const ayahProgress =
    verses.length > 0 ? ((currentIndex + 1) / verses.length) * 100 : 0;

  return (
    <>
      <ContentHeader
        title="Practice"
        subtitle="Test your memorization verse by verse"
        breadcrumbs={[
          { label: "Quran", href: "/quran" },
          { label: "Memorize", href: "/quran/memorize" },
          { label: "Practice" },
        ]}
      />

      <section className="max-w-4xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        {/* Top controls */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                Surah
              </label>
              <select
                value={surahId}
                onChange={(e) => setSurahId(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
              >
                {chapters.length === 0
                  ? Array.from({ length: 114 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}. Surah
                      </option>
                    ))
                  : chapters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.id}. {c.name_simple} ({c.verses_count})
                      </option>
                    ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                Reciter
              </label>
              <select
                value={reciterId}
                onChange={(e) => setReciterId(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
              >
                {RECITERS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Toggle chips */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowTranslation((v) => !v)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                showTranslation
                  ? "bg-teal-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Translation: {showTranslation ? "On" : "Off"}
            </button>
            <button
              onClick={() => setShowPrevious((v) => !v)}
              disabled={currentIndex === 0}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                showPrevious
                  ? "bg-teal-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Previous ayah: {showPrevious ? "Shown" : "Hidden"}
            </button>
            <button
              onClick={() => setLoopMode((v) => !v)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors inline-flex items-center gap-1.5 ${
                loopMode
                  ? "bg-teal-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Repeat size={12} /> Loop {loopMode ? "On" : "Off"}
            </button>

            <div className="inline-flex items-center gap-0.5 bg-gray-100 rounded-full p-0.5">
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  onClick={() => setPlaybackRate(s)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                    playbackRate === s
                      ? "bg-teal-900 text-white"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-teal-200 border-t-teal-700 rounded-full animate-spin" />
          </div>
        ) : verse ? (
          <>
            {/* Ayah progress */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-teal-900">
                  {currentChapter?.name_simple ?? "Surah"}
                </span>{" "}
                · Ayah {verse.verse_number} of {verses.length}
              </p>
              <p className="text-xs text-gray-400">
                Listened {repeatCount}x
              </p>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-5">
              <div
                className="h-full bg-teal-700 rounded-full transition-all duration-300"
                style={{ width: `${ayahProgress}%` }}
              />
            </div>

            {/* Previous ayah preview */}
            {showPrevious && previousVerse && (
              <div className="bg-white border-l-4 border-teal-700 rounded-2xl p-5 mb-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={14} className="text-teal-700" />
                  <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
                    Previous ayah ({previousVerse.verse_number})
                  </p>
                </div>
                <p
                  className="arabic-text text-xl text-gray-800 text-right leading-[2] mb-2"
                  dir="rtl"
                >
                  {previousVerse.text_uthmani}
                </p>
                <p className="text-xs text-gray-500 italic leading-relaxed">
                  {previousVerse.translations?.[0]?.text?.replace(/<[^>]*>/g, "") ?? ""}
                </p>
              </div>
            )}

            {/* Verse card */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-5">
              {/* Translation */}
              {showTranslation && (
                <p className="text-gray-500 text-sm leading-relaxed mb-6 text-center italic">
                  {verse.translations?.[0]?.text?.replace(/<[^>]*>/g, "") ?? ""}
                </p>
              )}

              {/* Hint (first words) */}
              {!revealed && hintLevel > 0 && (
                <p
                  className="arabic-text text-2xl text-teal-800 text-center leading-[2] mb-4"
                  dir="rtl"
                >
                  {firstWords(verse.text_uthmani, hintLevel === 1 ? 1 : 3)}{" "}
                  <span className="text-gray-300">...</span>
                </p>
              )}

              {/* Arabic */}
              {revealed ? (
                <p className="arabic-text text-3xl text-gray-900 text-center leading-[2.2] mb-4">
                  {verse.text_uthmani}
                </p>
              ) : (
                <button
                  onClick={() => setRevealed(true)}
                  className="w-full py-10 bg-teal-50 rounded-xl text-teal-700 font-medium hover:bg-teal-100 transition-colors flex flex-col items-center gap-2 mb-4"
                >
                  <Eye size={24} />
                  <span>Tap to reveal the Arabic</span>
                  <span className="text-xs text-teal-600">
                    Try to recite from memory first
                  </span>
                </button>
              )}

              {/* Reveal/hint controls */}
              <div className="flex items-center justify-center gap-2 flex-wrap mb-5">
                {!revealed && (
                  <button
                    onClick={() =>
                      setHintLevel((v) => (v + 1) % 3)
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-semibold transition-colors"
                  >
                    <Lightbulb size={14} className="text-teal-700" />
                    {hintLevel === 0
                      ? "Show hint"
                      : hintLevel === 1
                      ? "More hint"
                      : "Clear hint"}
                  </button>
                )}
                {revealed && (
                  <button
                    onClick={() => {
                      setRevealed(false);
                      setHintLevel(0);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full text-xs font-semibold transition-colors"
                  >
                    <EyeOff size={14} />
                    Hide again
                  </button>
                )}
              </div>

              {/* Audio player */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <button
                    onClick={togglePlay}
                    className="w-12 h-12 shrink-0 rounded-full bg-teal-900 hover:bg-teal-800 text-white flex items-center justify-center shadow-[0_4px_12px_rgba(0,77,64,0.25)] transition-colors"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause size={20} />
                    ) : (
                      <Play size={20} className="ml-0.5" />
                    )}
                  </button>
                  <button
                    onClick={restart}
                    className="w-9 h-9 shrink-0 rounded-full bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 flex items-center justify-center transition-colors"
                    aria-label="Restart"
                  >
                    <RotateCcw size={14} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <input
                      type="range"
                      min={0}
                      max={duration || 0}
                      step={0.1}
                      value={currentTime}
                      onChange={onSeek}
                      className="w-full accent-teal-700 cursor-pointer"
                      aria-label="Seek"
                    />
                    <div className="flex justify-between text-[11px] text-gray-500 mt-0.5 font-mono">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500">
                  <span>{RECITERS.find((r) => r.id === reciterId)?.short}</span>
                  <span>·</span>
                  <span>{playbackRate}x speed</span>
                  {loopMode && (
                    <>
                      <span>·</span>
                      <span className="text-teal-700 font-semibold inline-flex items-center gap-1">
                        <Repeat size={10} /> Looping
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={prev}
                disabled={currentIndex === 0}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-teal-900 bg-white rounded-full shadow-sm hover:shadow-md transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <p className="text-xs text-gray-400">
                {currentIndex + 1} / {verses.length}
              </p>
              <button
                onClick={next}
                disabled={currentIndex === verses.length - 1}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-teal-900 hover:bg-teal-800 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(0,77,64,0.25)]"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>

            {/* Keyboard shortcuts */}
            <div className="mt-8">
              <button
                onClick={() => setShowShortcuts((v) => !v)}
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-teal-700 transition-colors"
              >
                <Keyboard size={14} />
                {showShortcuts ? "Hide" : "Show"} keyboard shortcuts
              </button>
              {showShortcuts && (
                <div className="mt-3 bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Play / pause</span>
                    <kbd className="bg-gray-100 text-gray-700 px-1.5 rounded">Space</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next ayah</span>
                    <kbd className="bg-gray-100 text-gray-700 px-1.5 rounded">→</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Previous ayah</span>
                    <kbd className="bg-gray-100 text-gray-700 px-1.5 rounded">←</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reveal / hide</span>
                    <kbd className="bg-gray-100 text-gray-700 px-1.5 rounded">R</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cycle hint</span>
                    <kbd className="bg-gray-100 text-gray-700 px-1.5 rounded">H</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Toggle loop</span>
                    <kbd className="bg-gray-100 text-gray-700 px-1.5 rounded">L</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Show previous</span>
                    <kbd className="bg-gray-100 text-gray-700 px-1.5 rounded">P</kbd>
                  </div>
                </div>
              )}
            </div>

            <audio
              ref={audioRef}
              className="hidden"
              onPlay={onPlay}
              onPause={onPause}
              onTimeUpdate={onTimeUpdate}
              onLoadedMetadata={onLoadedMetadata}
              onEnded={onEnded}
            />
          </>
        ) : null}
      </section>
    </>
  );
}
