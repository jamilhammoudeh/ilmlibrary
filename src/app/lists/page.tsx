"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ContentHeader } from "@/components/content-header";
import {
  getReadingLists,
  createReadingList,
  deleteReadingList,
  type ReadingList,
} from "@/lib/reading-lists";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, BookOpen, Bookmark } from "lucide-react";

export default function ReadingListsPage() {
  const [lists, setLists] = useState<ReadingList[]>([]);
  const [bookCache, setBookCache] = useState<Record<string, { title: string; cover_url: string | null; slug: string; categorySlug: string }>>({});
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const l = getReadingLists();
    setLists(l);

    // Load book details for all book IDs
    const allIds = [...new Set(l.flatMap((list) => list.bookIds))];
    if (allIds.length > 0) {
      supabase
        .from("books")
        .select("id, title, cover_url, slug, category_id")
        .in("id", allIds)
        .then(async ({ data }) => {
          // Get category slugs
          const catIds = [...new Set((data ?? []).map((b) => b.category_id).filter((id): id is string => id !== null))];
          const { data: cats } = catIds.length > 0
            ? await supabase.from("categories").select("id, slug").in("id", catIds)
            : { data: [] };
          const catMap = new Map((cats ?? []).map((c: any) => [c.id, c.slug]));

          const cache: Record<string, any> = {};
          (data ?? []).forEach((b) => {
            cache[b.id] = { ...b, categorySlug: catMap.get(b.category_id) ?? "uncategorized" };
          });
          setBookCache(cache);
        });
    }

    function onChange() {
      setLists(getReadingLists());
    }
    window.addEventListener("reading-lists-changed", onChange);
    return () => window.removeEventListener("reading-lists-changed", onChange);
  }, []);

  function handleCreate() {
    if (!newName.trim()) return;
    createReadingList(newName.trim());
    setNewName("");
  }

  return (
    <>
      <ContentHeader title="Reading Lists" breadcrumbs={[{ label: "Reading Lists" }]} />

      {/* Tab navigation */}
      <div className="max-w-7xl mx-auto px-5 pt-6 flex gap-3">
        <Link
          href="/bookmarks"
          className="bg-white text-teal-900 text-sm font-medium px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
        >
          <Bookmark size={14} />
          Bookmarks
        </Link>
        <div className="bg-teal-900 text-white text-sm font-medium px-4 py-2 rounded-full">
          Reading Lists
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-5 py-10 pb-20 md:pb-24 fade-in-up">
        {/* Create new list */}
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="New list name..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-700"
          />
          <button
            onClick={handleCreate}
            className="bg-teal-900 hover:bg-teal-800 text-white px-5 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 shadow-[0_4px_12px_rgba(0,77,64,0.25)] flex items-center gap-1"
          >
            <Plus size={16} /> Create
          </button>
        </div>

        {lists.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen size={40} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No reading lists yet</p>
            <p className="text-gray-400 text-sm">
              Create a list to organize your favorite books.
            </p>
          </div>
        ) : (
          <div className="space-y-6 fade-in-up">
            {lists.map((list) => (
              <div
                key={list.id}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-teal-900 text-lg">
                    {list.name}
                  </h2>
                  <button
                    onClick={() => deleteReadingList(list.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {list.bookIds.length === 0 ? (
                  <p className="text-sm text-gray-400">
                    No books added yet. Add books from the book detail page.
                  </p>
                ) : (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {list.bookIds.map((bookId) => {
                      const book = bookCache[bookId];
                      if (!book) return null;
                      return (
                        <Link
                          key={bookId}
                          href={`/books/${book.categorySlug}/${book.slug}`}
                          className="shrink-0 w-20"
                        >
                          <div className="relative aspect-[2/3] bg-teal-50 rounded-lg overflow-hidden mb-1">
                            {book.cover_url && (
                              <Image
                                src={book.cover_url}
                                alt={book.title}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            )}
                          </div>
                          <p className="text-xs text-gray-700 line-clamp-2">
                            {book.title}
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
