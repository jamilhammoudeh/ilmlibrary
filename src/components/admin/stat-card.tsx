"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: number | string | null;
  icon: LucideIcon;
  href?: string;
  hint?: string;
  // Kept for API compatibility with existing callers — ignored in rendering.
  tone?: "teal" | "amber" | "rose" | "sky" | "violet";
  trend?: { value: number; label?: string } | null;
};

export function StatCard({ label, value, icon: Icon, href, hint }: StatCardProps) {
  const display =
    value === null || value === undefined
      ? null
      : typeof value === "number"
      ? value.toLocaleString()
      : value;

  const content = (
    <>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
          <Icon size={18} />
        </div>
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      {display === null ? (
        <div className="h-8 w-24 bg-gray-100 rounded animate-pulse" />
      ) : (
        <p className="text-2xl font-bold text-teal-900">{display}</p>
      )}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </>
  );

  const base =
    "block bg-white rounded-xl p-5 border border-gray-200";
  const interactive = href ? " hover:border-teal-200 hover:bg-teal-50/20 transition-colors" : "";

  if (href) {
    return (
      <Link href={href} className={base + interactive}>
        {content}
      </Link>
    );
  }
  return <div className={base}>{content}</div>;
}
