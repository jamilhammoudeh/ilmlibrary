"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";

export function MemorizationCalculator() {
  const [versesPerDay, setVersesPerDay] = useState(5);

  // Quran has 6,236 verses
  const totalVerses = 6236;
  const totalDays = Math.ceil(totalVerses / versesPerDay);
  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days = totalDays % 30;

  const timeStr = [
    years > 0 ? `${years} year${years > 1 ? "s" : ""}` : "",
    months > 0 ? `${months} month${months > 1 ? "s" : ""}` : "",
    days > 0 ? `${days} day${days > 1 ? "s" : ""}` : "",
  ]
    .filter(Boolean)
    .join(", ");

  const pagesPerDay = (versesPerDay / 15).toFixed(1); // ~15 verses per page

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-2 mb-4">
        <Calculator size={20} className="text-teal-700" />
        <h3 className="text-lg font-bold text-teal-900">Memorization Calculator</h3>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        How many new verses will you memorize each day?
      </p>

      {/* Slider */}
      <div className="mb-4">
        <input
          type="range"
          min={1}
          max={30}
          value={versesPerDay}
          onChange={(e) => setVersesPerDay(Number(e.target.value))}
          className="w-full accent-teal-700"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>1 verse</span>
          <span>15 verses</span>
          <span>30 verses</span>
        </div>
      </div>

      {/* Result */}
      <div className="bg-teal-50 rounded-xl p-4 text-center">
        <p className="text-3xl font-bold text-teal-900 mb-1">
          {versesPerDay} verse{versesPerDay > 1 ? "s" : ""}/day
        </p>
        <p className="text-sm text-gray-600 mb-2">
          (~{pagesPerDay} page{Number(pagesPerDay) !== 1 ? "s" : ""} per day)
        </p>
        <p className="text-teal-700 font-medium">
          Complete the Quran in <span className="font-bold">{timeStr}</span>
        </p>
      </div>
    </div>
  );
}
