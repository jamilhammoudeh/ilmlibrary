"use client";

import { useState } from "react";
import { BookOpen, Calendar, Moon, CheckCircle2, Info } from "lucide-react";

export type QuranicProphecy = {
  title: string;
  verse: string;
  arabic: string;
  translation: string;
  context: string;
  fulfillment: string;
  scholarlyNotes: string;
  evidence: string[];
};

export type HadithProphecy = {
  title: string;
  statement: string;
  arabic?: string;
  source: string;
  grading: string;
  fulfillment: string;
  evidence: string[];
};

type Tab = "quranic" | "prophetic" | "signs";

export function PropheciesTabs({
  quranic,
  prophetic,
  signs,
}: {
  quranic: QuranicProphecy[];
  prophetic: HadithProphecy[];
  signs: HadithProphecy[];
}) {
  const [active, setActive] = useState<Tab>("quranic");

  const tabs: { id: Tab; label: string; count: number; icon: typeof BookOpen }[] = [
    {
      id: "quranic",
      label: "Qur'anic Prophecies",
      count: quranic.length,
      icon: BookOpen,
    },
    {
      id: "prophetic",
      label: "Prophetic Prophecies",
      count: prophetic.length,
      icon: Calendar,
    },
    {
      id: "signs",
      label: "Signs of the Hour",
      count: signs.length,
      icon: Moon,
    },
  ];

  return (
    <div className="mb-12">
      {/* Tab bar */}
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

      {/* Content panels */}
      {active === "quranic" && <QuranicPanel items={quranic} />}
      {active === "prophetic" && <HadithPanel items={prophetic} />}
      {active === "signs" && <HadithPanel items={signs} />}
    </div>
  );
}

function QuranicPanel({ items }: { items: QuranicProphecy[] }) {
  return (
    <div className="space-y-6 fade-in">
      {items.map((p, i) => (
        <article
          key={p.title}
          className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-6 md:p-8"
        >
          <header className="flex items-start gap-4 mb-5 flex-wrap">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-900 text-white font-bold shrink-0">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wider font-semibold text-teal-700">
                {p.verse}
              </p>
              <h3 className="text-lg md:text-xl font-bold text-teal-900 font-[family-name:var(--font-playfair)] leading-tight">
                {p.title}
              </h3>
            </div>
          </header>

          {/* Arabic + translation */}
          <div className="bg-[#fdfbf3] border border-[#e8dfc6] rounded-2xl px-6 py-6 mb-5">
            <p
              className="font-[family-name:var(--font-amiri)] text-teal-900 text-[26px] md:text-[28px] leading-[2.2] text-right mb-4"
              dir="rtl"
            >
              {p.arabic}
            </p>
            <p className="text-sm text-gray-700 italic leading-relaxed border-t border-[#e8dfc6] pt-3">
              &ldquo;{p.translation}&rdquo;
            </p>
          </div>

          {/* Context + Fulfillment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider mb-2">
                Context at revelation
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {p.context}
              </p>
            </div>
            <div className="bg-emerald-50/60 rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <p className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                  Historical fulfillment
                </p>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {p.fulfillment}
              </p>
            </div>
          </div>

          {/* Scholarly notes */}
          <div className="bg-teal-50/50 border-l-4 border-teal-700 rounded-xl p-4 mb-5">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-teal-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider mb-1">
                  Scholarly commentary
                </p>
                <p className="text-sm text-teal-900 leading-relaxed">
                  {p.scholarlyNotes}
                </p>
              </div>
            </div>
          </div>

          {/* Evidence */}
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Supporting sources
            </p>
            <ul className="space-y-1">
              {p.evidence.map((e, ei) => (
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

function HadithPanel({ items }: { items: HadithProphecy[] }) {
  return (
    <div className="space-y-5 fade-in">
      {items.map((h, i) => (
        <article
          key={h.title}
          className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-6 md:p-8"
        >
          <header className="flex items-start gap-4 mb-5 flex-wrap">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-900 text-white font-bold shrink-0">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg md:text-xl font-bold text-teal-900 font-[family-name:var(--font-playfair)] leading-tight">
                {h.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs text-gray-500">{h.source}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 uppercase tracking-wider">
                  {h.grading}
                </span>
              </div>
            </div>
          </header>

          {/* Arabic if available */}
          {h.arabic && (
            <div className="bg-[#fdfbf3] border border-[#e8dfc6] rounded-2xl px-6 py-5 mb-4">
              <p
                className="font-[family-name:var(--font-amiri)] text-teal-900 text-[22px] leading-[2] text-right"
                dir="rtl"
              >
                {h.arabic}
              </p>
            </div>
          )}

          {/* Statement */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider mb-2">
              Prophetic statement
            </p>
            <p className="text-sm text-gray-700 leading-relaxed italic">
              {h.statement}
            </p>
          </div>

          {/* Fulfillment */}
          <div className="bg-emerald-50/60 rounded-xl p-4 mb-4 flex items-start gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider mb-1">
                Historical fulfillment
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {h.fulfillment}
              </p>
            </div>
          </div>

          {/* Evidence */}
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Supporting sources
            </p>
            <ul className="space-y-1">
              {h.evidence.map((e, ei) => (
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
