"use client";

import { useState, useEffect, useRef } from "react";
import { ListPlus, Plus, Check } from "lucide-react";
import {
  getReadingLists,
  createReadingList,
  addToReadingList,
  removeFromReadingList,
  getListsForBook,
} from "@/lib/reading-lists";

export function AddToListButton({ bookId }: { bookId: string }) {
  const [open, setOpen] = useState(false);
  const [lists, setLists] = useState(getReadingLists());
  const [inLists, setInLists] = useState<string[]>([]);
  const [newName, setNewName] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLists(getReadingLists());
    setInLists(getListsForBook(bookId));

    function onChange() {
      setLists(getReadingLists());
      setInLists(getListsForBook(bookId));
    }
    window.addEventListener("reading-lists-changed", onChange);
    return () => window.removeEventListener("reading-lists-changed", onChange);
  }, [bookId]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function toggle(listId: string) {
    if (inLists.includes(listId)) {
      removeFromReadingList(listId, bookId);
    } else {
      addToReadingList(listId, bookId);
    }
  }

  function handleCreate() {
    if (!newName.trim()) return;
    const list = createReadingList(newName.trim());
    addToReadingList(list.id, bookId);
    setNewName("");
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-teal-700 transition-colors"
      >
        <ListPlus size={15} />
        Add to List
      </button>

      {open && (
        <div className="absolute top-8 left-0 z-50 bg-white rounded-xl shadow-lg border border-gray-100 w-64 p-3 fade-in-up">
          {lists.length > 0 && (
            <div className="space-y-1 mb-3 max-h-48 overflow-y-auto">
              {lists.map((list) => {
                const isIn = inLists.includes(list.id);
                return (
                  <button
                    key={list.id}
                    onClick={() => toggle(list.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
                      isIn
                        ? "bg-teal-50 text-teal-900 font-medium"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {list.name}
                    {isIn && <Check size={14} className="text-teal-700" />}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="New list..."
              className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
            <button
              onClick={handleCreate}
              className="bg-teal-900 text-white p-1.5 rounded-full hover:bg-teal-800 transition-all duration-200"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
