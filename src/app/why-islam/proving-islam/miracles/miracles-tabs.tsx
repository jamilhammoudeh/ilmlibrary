"use client";

import { useState } from "react";
import { BookOpen, Sun, CheckCircle2, Info } from "lucide-react";

export type QuranicMiracle = {
  title: string;
  verse: string;
  arabic: string;
  translation: string;
  story: string;
  companionTestimony: string;
  scholarlyNotes: string;
  evidence: string[];
};

export type PhysicalMiracle = {
  title: string;
  arabic?: string;
  story: string;
  source: string;
  grading: string;
  historicalNotes: string;
  evidence: string[];
};

type Tab = "quranic" | "physical";

export function MiraclesTabs({
  quranic,
  physical,
}: {
  quranic: QuranicMiracle[];
  physical: PhysicalMiracle[];
}) {
  const [active, setActive] = useState<Tab>("quranic");

  const tabs: { id: Tab; label: string; count: number; icon: typeof BookOpen }[] = [
    {
      id: "quranic",
      label: "Miracles in the Qur'an",
      count: quranic.length,
      icon: BookOpen,
    },
    {
      id: "physical",
      label: "Miracles Witnessed by the Companions",
      count: physical.length,
      icon: Sun,
    },
  ];

  return (
    <div className="mb-12">
      <div className="bg-white rounded-2xl p-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-6 flex flex-wrap gap-1.5">
        {tabs.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex-1 min-w-0 justify-center ${
                isActive
                  ? "bg-teal-900 text-white shadow-[0_2px_8px_rgba(0,77,64,0.25)]"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <t.icon size={16} className="shrink-0" />
              <span className="truncate">{t.label}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-teal-50 text-teal-700"
                }`}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {active === "quranic" && <QuranicPanel items={quranic} />}
      {active === "physical" && <PhysicalPanel items={physical} />}
    </div>
  );
}

function QuranicPanel({ items }: { items: QuranicMiracle[] }) {
  return (
    <div className="space-y-6 fade-in">
      {items.map((m, i) => (
        <article
          key={m.title}
          className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-6 md:p-8"
        >
          <header className="flex items-start gap-4 mb-5 flex-wrap">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-900 text-white font-bold shrink-0">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wider font-semibold text-teal-700">
                {m.verse}
              </p>
              <h3 className="text-lg md:text-xl font-bold text-teal-900 font-[family-name:var(--font-playfair)] leading-tight">
                {m.title}
              </h3>
            </div>
          </header>

          <div className="bg-[#fdfbf3] border border-[#e8dfc6] rounded-2xl px-6 py-6 mb-5">
            <p
              className="font-[family-name:var(--font-amiri)] text-teal-900 text-[26px] md:text-[28px] leading-[2.2] text-right mb-4"
              dir="rtl"
            >
              {m.arabic}
            </p>
            <p className="text-sm text-gray-700 italic leading-relaxed border-t border-[#e8dfc6] pt-3">
              &ldquo;{m.translation}&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider mb-2">
                What happened
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{m.story}</p>
            </div>
            <div className="bg-emerald-50/60 rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <p className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                  Companion testimony
                </p>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {m.companionTestimony}
              </p>
            </div>
          </div>

          <div className="bg-teal-50/50 border-l-4 border-teal-700 rounded-xl p-4 mb-5">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-teal-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider mb-1">
                  Scholarly commentary
                </p>
                <p className="text-sm text-teal-900 leading-relaxed">
                  {m.scholarlyNotes}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Supporting sources
            </p>
            <ul className="space-y-1">
              {m.evidence.map((e, ei) => (
                <li
                  key={ei}
                  className="text-xs text-gray-600 flex items-start gap-2"
                >
                  <span className="text-teal-700 mt-0.5 shrink-0">•</span>
                  {e}
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  );
}

function PhysicalPanel({ items }: { items: PhysicalMiracle[] }) {
  return (
    <div className="space-y-5 fade-in">
      {items.map((m, i) => (
        <article
          key={m.title}
          className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-6 md:p-8"
        >
          <header className="flex items-start gap-4 mb-5 flex-wrap">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-900 text-white font-bold shrink-0">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg md:text-xl font-bold text-teal-900 font-[family-name:var(--font-playfair)] leading-tight">
                {m.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs text-gray-500">{m.source}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 uppercase tracking-wider">
                  {m.grading}
                </span>
              </div>
            </div>
          </header>

          {m.arabic && (
            <div className="bg-[#fdfbf3] border border-[#e8dfc6] rounded-2xl px-6 py-5 mb-4">
              <p
                className="font-[family-name:var(--font-amiri)] text-teal-900 text-[22px] leading-[2] text-right"
                dir="rtl"
              >
                {m.arabic}
              </p>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider mb-2">
              The narration
            </p>
            <p className="text-sm text-gray-700 leading-relaxed italic">
              {m.story}
            </p>
          </div>

          <div className="bg-teal-50/50 border-l-4 border-teal-700 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-teal-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider mb-1">
                  Historical context
                </p>
                <p className="text-sm text-teal-900 leading-relaxed">
                  {m.historicalNotes}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Supporting sources
            </p>
            <ul className="space-y-1">
              {m.evidence.map((e, ei) => (
                <li
                  key={ei}
                  className="text-xs text-gray-600 flex items-start gap-2"
                >
                  <span className="text-teal-700 mt-0.5 shrink-0">•</span>
                  {e}
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  );
}
