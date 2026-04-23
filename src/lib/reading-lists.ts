"use client";

const STORAGE_KEY = "ilm-reading-lists";

export type ReadingList = {
  id: string;
  name: string;
  bookIds: string[];
  createdAt: number;
};

function getAll(): ReadingList[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAll(lists: ReadingList[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  window.dispatchEvent(new Event("reading-lists-changed"));
}

export function getReadingLists(): ReadingList[] {
  return getAll();
}

export function createReadingList(name: string): ReadingList {
  const lists = getAll();
  const newList: ReadingList = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    name,
    bookIds: [],
    createdAt: Date.now(),
  };
  lists.push(newList);
  saveAll(lists);
  return newList;
}

export function deleteReadingList(id: string) {
  saveAll(getAll().filter((l) => l.id !== id));
}

export function addToReadingList(listId: string, bookId: string) {
  const lists = getAll();
  const list = lists.find((l) => l.id === listId);
  if (list && !list.bookIds.includes(bookId)) {
    list.bookIds.push(bookId);
    saveAll(lists);
  }
}

export function removeFromReadingList(listId: string, bookId: string) {
  const lists = getAll();
  const list = lists.find((l) => l.id === listId);
  if (list) {
    list.bookIds = list.bookIds.filter((id) => id !== bookId);
    saveAll(lists);
  }
}

export function getListsForBook(bookId: string): string[] {
  return getAll()
    .filter((l) => l.bookIds.includes(bookId))
    .map((l) => l.id);
}
