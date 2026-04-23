"use client";

const STORAGE_KEY = "ilm-quran-bookmark";

export type QuranBookmark = {
  surahId: number;
  surahName: string;
  ayah: number;
  savedAt: number;
};

export function getQuranBookmark(): QuranBookmark | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveQuranBookmark(surahId: number, surahName: string, ayah: number) {
  const bm: QuranBookmark = { surahId, surahName, ayah, savedAt: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bm));
}

export function clearQuranBookmark() {
  localStorage.removeItem(STORAGE_KEY);
}
