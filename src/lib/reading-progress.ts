"use client";

const STORAGE_KEY = "ilm-reading-progress";

export type ReadingEntry = {
  slug: string;
  title: string;
  lastRead: number;
  href: string;
};

function getAll(): Record<string, ReadingEntry> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveProgress(slug: string, title: string, href: string) {
  const all = getAll();
  all[slug] = { slug, title, lastRead: Date.now(), href };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getRecentlyRead(): ReadingEntry[] {
  return Object.values(getAll())
    .sort((a, b) => b.lastRead - a.lastRead)
    .slice(0, 10);
}

export function getProgress(slug: string): ReadingEntry | null {
  return getAll()[slug] ?? null;
}
