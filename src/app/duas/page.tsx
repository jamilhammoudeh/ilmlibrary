"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import { GlyphText } from "@/components/glyph-text";
import {
  Search,
  X,
  Copy,
  Check,
  Volume2,
  Bookmark,
  BookOpen,
  Sun,
} from "lucide-react";
import duasJson from "@/data/duas-data.json";
import quranicDuasData from "@/data/quranic-duas.json";
import { isBookmarked, addBookmark, removeBookmark } from "@/lib/bookmarks";

const { categories, duasData } = duasJson as {
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

// Curated list of well-known, authentic duas for Dua of the Day
const CURATED_DUAS = [
  { arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", english: "Our Lord, give us in this world that which is good and in the Hereafter that which is good, and protect us from the punishment of the Fire.", reference: "Quran 2:201" },
  { arabic: "رَبِّ زِدْنِي عِلْمًا", english: "My Lord, increase me in knowledge.", reference: "Quran 20:114" },
  { arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي", english: "My Lord, expand for me my breast and ease for me my task.", reference: "Quran 20:25-26" },
  { arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً إِنَّكَ أَنتَ الْوَهَّابُ", english: "Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy. Indeed, You are the Bestower.", reference: "Quran 3:8" },
  { arabic: "رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ", english: "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.", reference: "Quran 7:23" },
  { arabic: "حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ", english: "Sufficient for me is Allah; there is no deity except Him. On Him I have relied, and He is the Lord of the Great Throne.", reference: "Quran 9:129" },
  { arabic: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ", english: "My Lord, enable me to be grateful for Your favor which You have bestowed upon me and upon my parents.", reference: "Quran 27:19" },
  { arabic: "رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ", english: "Our Lord, forgive us our sins and the excess in our affairs and plant firmly our feet and give us victory over the disbelieving people.", reference: "Quran 3:147" },
  { arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ", english: "O Allah, I ask You for forgiveness and well-being in this life and the Hereafter.", reference: "Sunan Ibn Majah 3871" },
  { arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ", english: "O Allah, I seek refuge in You from worry, grief, weakness, laziness, miserliness, cowardice, the burden of debt, and being overpowered by men.", reference: "Sahih al-Bukhari 6369" },
  { arabic: "رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ", english: "My Lord, indeed I am, for whatever good You would send down to me, in need.", reference: "Quran 28:24" },
  { arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا", english: "Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous.", reference: "Quran 25:74" },
  { arabic: "اللَّهُمَّ اهْدِنِي وَسَدِّدْنِي", english: "O Allah, guide me and keep me on the right path.", reference: "Sahih Muslim 2725" },
  { arabic: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ", english: "O Turner of hearts, keep my heart firm upon Your religion.", reference: "Jami at-Tirmidhi 2140" },
];

function getDuaOfTheDay() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return CURATED_DUAS[dayOfYear % CURATED_DUAS.length];
}

// Verified Quranic duas from JSON
const quranicDuas = quranicDuasData as Array<{
  arabic: string;
  english: string;
  transliteration: string;
  reference: string;
  category: string;
}>;

// Get unique Quranic dua categories
const quranicCategories = [...new Set(quranicDuas.map((d) => d.category))];

const morningEveningKeys = ["cat1", "cat131", "cat132"];

const DUA_SECTIONS = [
  { id: "hisnul-muslim", title: "Hisnul Muslim" },
  { id: "quranic", title: "Quranic Duas" },
  { id: "morning-evening", title: "Morning & Evening" },
  { id: "forgiveness", title: "Forgiveness" },
  { id: "protection", title: "Protection" },
  { id: "parents", title: "Parents" },
  { id: "guidance", title: "Guidance" },
];

export default function DuasPage() {
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeSection, setActiveSection] = useState("hisnul-muslim");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const duaOfTheDay = useMemo(() => getDuaOfTheDay(), []);

  const filtered = useMemo(() => {
    if (!search.trim())
      return categories.map((c, i) => ({ ...c, key: `cat${i + 1}` }));

    const q = search.toLowerCase();
    return categories
      .map((c, i) => ({ ...c, key: `cat${i + 1}` }))
      .filter((c) => {
        if (c.en.toLowerCase().includes(q) || c.ar.includes(search)) return true;
        const catData = duasData[c.key];
        if (!catData) return false;
        return catData.items.some(
          (d) =>
            d.arabic.includes(search) ||
            d.english.toLowerCase().includes(q) ||
            d.transliteration?.toLowerCase().includes(q) ||
            d.reference?.toLowerCase().includes(q)
        );
      });
  }, [search]);

  // Filter Quranic duas by search
  const filteredQuranic = useMemo(() => {
    if (!search.trim()) return quranicDuas;
    const q = search.toLowerCase();
    return quranicDuas.filter(
      (d) =>
        d.arabic.includes(search) ||
        d.english.toLowerCase().includes(q) ||
        d.transliteration?.toLowerCase().includes(q) ||
        d.reference?.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
    );
  }, [search]);

  async function copyDua(dua: { arabic: string; english: string; reference: string }, index: number) {
    const text = `${dua.arabic}\n\n${dua.english}\n\n[${dua.reference}]`;
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

  const hasQuery = search.length > 0;

  return (
    <>
      <ContentHeader
        title="Duas & Supplications"
        subtitle="Authentic supplications from the Quran and Sunnah"
        breadcrumbs={[{ label: "Duas" }]}
      />

      {/* Dua of the Day */}
      <section className="px-5 mt-6 mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 sm:gap-5 w-[92%] mx-auto">
          <div className="col-span-full bg-teal-600 text-white rounded-2xl p-6 md:p-8 shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-wider text-teal-200 font-semibold">
                Dua of the Day
              </p>
              <button
                onClick={() => copyDua(duaOfTheDay, -1)}
                aria-label="Copy dua of the day"
                className="text-teal-200 hover:text-white transition-colors"
              >
                {copiedIndex === -1 ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <p className="font-[family-name:var(--font-amiri)] text-2xl sm:text-3xl md:text-4xl leading-relaxed mb-4" dir="rtl">
              {duaOfTheDay.arabic}
            </p>
            <p className="text-teal-50 leading-relaxed text-base md:text-lg mb-2">
              {duaOfTheDay.english}
            </p>
            <p className="text-teal-200 text-sm">{duaOfTheDay.reference}</p>
          </div>
        </div>
      </section>

      {/* Search - always visible */}
      <section className="px-5 mt-4 mb-4">
        <div className="w-[92%] max-w-xl mx-auto relative">
          <Search
            className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
              searchFocused ? "text-teal-700" : "text-gray-400"
            }`}
            size={20}
          />
          <input
            type="text"
            placeholder="Search any Dua or Category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={`w-full pl-12 ${hasQuery ? "pr-11" : "pr-4"} py-3 rounded-full bg-white text-gray-900 border border-gray-200 outline-none transition-all duration-200 ${
              searchFocused
                ? "shadow-[0_8px_24px_rgba(0,77,64,0.15)] border-teal-700/40 ring-2 ring-teal-700/15"
                : "shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
            }`}
          />
          {hasQuery && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </section>

      {/* Section tabs */}
      <section className="px-5 mb-2">
        <div className="flex flex-wrap justify-center gap-3 max-w-7xl mx-auto">
          {DUA_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeSection === section.id
                  ? "bg-teal-900 text-white shadow-[0_4px_12px_rgba(0,77,64,0.3)]"
                  : "bg-white text-teal-900 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>
      </section>

      {/* Hisnul Muslim */}
      {activeSection === "hisnul-muslim" && (
        <>
          {/* Category grid - each links to /duas/catN */}
          <section className="px-5 py-10 pb-20 md:pb-24">
            <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 sm:gap-5 w-[92%] mx-auto fade-in-up">
              {filtered.map((cat) => (
                <Link
                  key={cat.key}
                  href={`/duas/${cat.key}`}
                  className="group bg-white rounded-2xl px-4 py-5 min-h-[100px] flex flex-col items-center justify-center gap-1 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
                >
                  <span className="text-[18px] font-bold text-teal-900 group-hover:text-teal-700 transition-colors duration-200 text-center">
                    <GlyphText>{cat.en}</GlyphText>
                  </span>
                  <span className="font-[family-name:var(--font-amiri)] text-[20px] text-teal-900 text-center" dir="rtl">
                    {cat.ar}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Quranic Duas - grouped by category */}
      {activeSection === "quranic" && (
        <section className="w-[92%] max-w-7xl mx-auto py-6 pb-20 md:pb-24 fade-in-up">
          {quranicCategories.map((cat) => {
            const catDuas = filteredQuranic.filter((d) => d.category === cat);
            return (
              <div key={cat} className="mb-8">
                <h2 className="text-xl font-bold text-teal-900 mb-4 font-[family-name:var(--font-amiri)]">
                  {cat}
                </h2>
                <div className="space-y-4">
                  {catDuas.map((dua, i) => (
                    <DuaCard key={`q-${cat}-${i}`} dua={dua} index={2000 + i} copiedIndex={copiedIndex} onCopy={() => copyDua(dua, 2000 + i)} onSpeak={() => speakArabic(dua.arabic)} />
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Morning & Evening */}
      {activeSection === "morning-evening" && (
        <section className="w-[92%] max-w-7xl mx-auto py-6 pb-20 md:pb-24 fade-in-up">
          {morningEveningKeys.map((key) => {
            const catData = duasData[key];
            if (!catData) return null;
            return (
              <div key={key} className="mb-8">
                <h2 className="text-xl font-bold text-teal-900 mb-4 font-[family-name:var(--font-amiri)]">
                  {catData.title}
                </h2>
                <div className="space-y-4">
                  {catData.items.map((dua, i) => (
                    <DuaCard key={`me-${key}-${i}`} dua={dua} index={3000 + i} copiedIndex={copiedIndex} onCopy={() => copyDua(dua, 3000 + i)} onSpeak={() => speakArabic(dua.arabic)} />
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Filtered Quranic Duas by topic */}
      {["forgiveness", "protection", "parents", "guidance"].includes(activeSection) && (
        <section className="w-[92%] max-w-7xl mx-auto py-6 pb-20 md:pb-24 fade-in-up">
          <div className="space-y-4">
            {filteredQuranic
              .filter((d) => d.category.toLowerCase() === activeSection)
              .map((dua, i) => (
                <DuaCard key={`t-${i}`} dua={dua} index={4000 + i} copiedIndex={copiedIndex} onCopy={() => copyDua(dua, 4000 + i)} onSpeak={() => speakArabic(dua.arabic)} />
              ))}
          </div>
        </section>
      )}
    </>
  );
}

function DuaCard({
  dua,
  index,
  copiedIndex,
  onCopy,
  onSpeak,
}: {
  dua: { arabic: string; transliteration?: string; english: string; reference: string };
  index: number;
  copiedIndex: number | null;
  onCopy: () => void;
  onSpeak: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <div className="font-[family-name:var(--font-amiri)] text-teal-900 text-[22px] mb-3 leading-relaxed" dir="rtl">
        {dua.arabic}
      </div>
      {dua.transliteration && (
        <p className="italic text-gray-500 mb-2 text-sm">{dua.transliteration}</p>
      )}
      <p className="text-gray-700 mb-2">{dua.english}</p>
      {dua.reference && (
        <p className="text-xs text-gray-400 mb-3">[ {dua.reference} ]</p>
      )}
      <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
        <button onClick={onCopy} className="flex items-center gap-1 text-xs text-gray-400 hover:text-teal-700 transition-colors">
          {copiedIndex === index ? <><Check size={13} className="text-teal-700" /> Copied</> : <><Copy size={13} /> Copy</>}
        </button>
        <button onClick={onSpeak} className="flex items-center gap-1 text-xs text-gray-400 hover:text-teal-700 transition-colors" title="Text-to-speech (not a Quran recitation)">
          <Volume2 size={13} /> Listen
        </button>
      </div>
    </div>
  );
}
