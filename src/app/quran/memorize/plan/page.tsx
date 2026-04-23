"use client";

import { useState } from "react";
import Link from "next/link";
import { ContentHeader } from "@/components/content-header";

type Plan = {
  versesPerDay: number;
  totalDays: number;
  bestTime: string;
  method: string;
  startSurah: string;
  reviewSchedule: string;
  tips: string[];
};

const questions = [
  {
    id: "experience",
    question: "How much Quran have you memorized so far?",
    options: [
      { label: "None or just a few short surahs", value: "beginner" },
      { label: "Juz Amma (30th Juz) or a few Juz", value: "intermediate" },
      { label: "More than 5 Juz", value: "advanced" },
    ],
  },
  {
    id: "tajweed",
    question: "Can you read Arabic with proper Tajweed?",
    options: [
      { label: "Still learning to read Arabic", value: "learning" },
      { label: "I can read but my Tajweed needs work", value: "basic" },
      { label: "My Tajweed is solid", value: "solid" },
    ],
  },
  {
    id: "time",
    question: "How much time can you dedicate daily?",
    options: [
      { label: "15 to 30 minutes", value: "short" },
      { label: "30 minutes to 1 hour", value: "medium" },
      { label: "More than 1 hour", value: "long" },
    ],
  },
  {
    id: "schedule",
    question: "When do you prefer to memorize?",
    options: [
      { label: "After Fajr (early morning)", value: "fajr" },
      { label: "During the day", value: "day" },
      { label: "After Isha (night)", value: "night" },
    ],
  },
  {
    id: "goal",
    question: "What is your goal?",
    options: [
      { label: "Memorize key surahs for daily use", value: "surahs" },
      { label: "Memorize the entire Quran over time", value: "full" },
      { label: "Strengthen and review what I already know", value: "review" },
    ],
  },
];

function generatePlan(answers: Record<string, string>): Plan {
  const experience = answers.experience;
  const time = answers.time;
  const goal = answers.goal;
  const schedule = answers.schedule;
  const tajweed = answers.tajweed;

  let versesPerDay = 3;
  let method = "The 3x10 Method: Read 10 times looking, then 10 times from memory";
  let startSurah = "Surah Al-Fatiha, then Juz Amma (Surah An-Nas backwards)";
  let tips: string[] = [];

  // Adjust verses per day based on experience and time
  if (experience === "beginner") {
    if (time === "short") versesPerDay = 2;
    else if (time === "medium") versesPerDay = 3;
    else versesPerDay = 5;
  } else if (experience === "intermediate") {
    if (time === "short") versesPerDay = 3;
    else if (time === "medium") versesPerDay = 5;
    else versesPerDay = 8;
  } else {
    if (time === "short") versesPerDay = 5;
    else if (time === "medium") versesPerDay = 8;
    else versesPerDay = 15;
  }

  // Starting point
  if (goal === "surahs") {
    startSurah = "Start with: Al-Mulk, Ya-Sin, Al-Kahf, Ar-Rahman, Al-Waqi'ah";
    tips.push("Focus on surahs with special virtues mentioned in hadith");
  } else if (goal === "review") {
    startSurah = "Start from the beginning of what you have already memorized";
    versesPerDay = 0; // Review focused
    method = "Review 1 to 2 Juz daily, reciting to a partner or recording yourself";
    tips.push("Recite your memorized portions in every salah");
    tips.push("Focus on the sections where you hesitate the most");
  } else {
    if (experience === "beginner") {
      startSurah = "Start with Juz Amma (30th Juz), from Surah An-Nas backwards";
    } else {
      startSurah = "Continue from where you left off, or start Surah Al-Baqarah";
    }
  }

  // Tajweed advice
  if (tajweed === "learning") {
    tips.unshift("Priority: Complete a Tajweed course before heavy memorization");
    tips.push("Use the Noorani Qaida to build your reading foundation");
  } else if (tajweed === "basic") {
    tips.push("Record yourself weekly and compare with a teacher or Shaykh Husary");
  }

  // Schedule advice
  const bestTime = schedule === "fajr"
    ? "After Fajr prayer (best time according to scholars)"
    : schedule === "night"
    ? "After Isha prayer (the brain consolidates during sleep)"
    : "Find a consistent daily slot and protect it";

  // Review schedule
  let reviewSchedule = "New memorization in the morning, review in the evening";
  if (goal === "review") {
    reviewSchedule = "Review 1 to 2 Juz daily, cycling through your full memorization weekly";
  } else if (experience === "advanced") {
    reviewSchedule = "20% new memorization, 80% review. Review your current Juz after every salah";
  }

  // General tips
  tips.push("Never skip a day. Even 5 minutes of review is better than nothing");
  tips.push("Recite your new memorization in the Sunnah prayers");
  if (goal === "full") {
    tips.push("Find a memorization partner or join a halaqah for accountability");
  }

  const totalVerses = 6236;
  const totalDays = versesPerDay > 0 ? Math.ceil(totalVerses / versesPerDay) : 0;

  return { versesPerDay, totalDays, bestTime, method, startSurah, reviewSchedule, tips };
}

export default function PlanPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [plan, setPlan] = useState<Plan | null>(null);

  function selectAnswer(questionId: string, value: string) {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 200);
    } else {
      setTimeout(() => setPlan(generatePlan(newAnswers)), 200);
    }
  }

  function reset() {
    setStep(0);
    setAnswers({});
    setPlan(null);
  }

  return (
    <>
      <ContentHeader
        title="My Memorization Plan"
        breadcrumbs={[
          { label: "Quran", href: "/quran" },
          { label: "Memorize", href: "/quran/memorize" },
          { label: "Plan" },
        ]}
      />

      <section className="max-w-4xl mx-auto px-5 py-10 pb-32 md:pb-36">
        {!plan ? (
          // Quiz
          <div className="fade-in-up">
            {/* Progress */}
            <div className="flex gap-1 mb-8">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                    i <= step ? "bg-teal-700" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>

            <p className="text-sm text-gray-500 mb-2">
              Question {step + 1} of {questions.length}
            </p>
            <h2 className="text-xl font-bold text-teal-900 mb-6">
              {questions[step].question}
            </h2>

            <div className="space-y-3">
              {questions[step].options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => selectAnswer(questions[step].id, opt.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                    answers[questions[step].id] === opt.value
                      ? "border-teal-700 bg-teal-50"
                      : "border-gray-200 bg-white hover:border-teal-300"
                  }`}
                >
                  <span className="text-sm font-medium text-gray-900">{opt.label}</span>
                </button>
              ))}
            </div>

            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="text-sm text-gray-500 hover:text-teal-700 mt-4 transition-colors"
              >
                Back
              </button>
            )}
          </div>
        ) : (
          // Plan result
          <div className="fade-in-up space-y-6">
            <div className="bg-teal-100 rounded-2xl px-6 py-8 text-center shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <p className="text-sm text-teal-700 font-semibold uppercase tracking-wider mb-2">Your Plan</p>
              {plan.versesPerDay > 0 ? (
                <>
                  <p className="text-4xl font-bold text-teal-900 mb-1">{plan.versesPerDay} verses/day</p>
                  <p className="text-sm text-teal-700">
                    Complete the Quran in about{" "}
                    {Math.floor(plan.totalDays / 365) > 0
                      ? `${Math.floor(plan.totalDays / 365)} years, `
                      : ""}
                    {Math.floor((plan.totalDays % 365) / 30)} months
                  </p>
                </>
              ) : (
                <p className="text-2xl font-bold text-teal-900">Review focused plan</p>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <h3 className="font-bold text-teal-900 mb-4">Your Schedule</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-gray-700">Where to start</p>
                  <p className="text-gray-600">{plan.startSurah}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Method</p>
                  <p className="text-gray-600">{plan.method}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Best time</p>
                  <p className="text-gray-600">{plan.bestTime}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Review schedule</p>
                  <p className="text-gray-600">{plan.reviewSchedule}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <h3 className="font-bold text-teal-900 mb-3">Tips for you</h3>
              <ul className="space-y-2">
                {plan.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-teal-700 mt-0.5 shrink-0">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={reset}
                className="px-5 py-2.5 text-sm font-medium text-teal-900 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
              >
                Retake Quiz
              </button>
              <Link
                href="/quran/memorize/practice"
                className="px-5 py-2.5 text-sm font-medium text-white bg-teal-900 hover:bg-teal-800 rounded-full transition-all duration-200 hover:-translate-y-0.5 shadow-[0_4px_12px_rgba(0,77,64,0.25)]"
              >
                Start Practicing
              </Link>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
