"use client";

export type Bookmark = {
  id: string;
  type: "book" | "dua";
  title: string;
  href: string;
  coverUrl?: string;
  addedAt: number;
};

const STORAGE_KEY = "ilm-bookmarks";

export function getBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addBookmark(bookmark: Omit<Bookmark, "addedAt">) {
  const bookmarks = getBookmarks();
  if (bookmarks.some((b) => b.id === bookmark.id)) return;
  bookmarks.push({ ...bookmark, addedAt: Date.now() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  window.dispatchEvent(new Event("bookmarks-changed"));
}

export function removeBookmark(id: string) {
  const bookmarks = getBookmarks().filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  window.dispatchEvent(new Event("bookmarks-changed"));
}

export function isBookmarked(id: string): boolean {
  return getBookmarks().some((b) => b.id === id);
}
