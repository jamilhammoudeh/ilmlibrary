"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ContentHeader } from "@/components/content-header";
import { getBookmarks, removeBookmark, type Bookmark } from "@/lib/bookmarks";
import { Trash2, BookOpen, List } from "lucide-react";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    setBookmarks(getBookmarks().sort((a, b) => b.addedAt - a.addedAt));
    function onChange() {
      setBookmarks(getBookmarks().sort((a, b) => b.addedAt - a.addedAt));
    }
    window.addEventListener("bookmarks-changed", onChange);
    return () => window.removeEventListener("bookmarks-changed", onChange);
  }, []);

  return (
    <>
      <ContentHeader title="My Bookmarks" breadcrumbs={[{ label: "Bookmarks" }]} />

      {/* Tab navigation */}
      <div className="max-w-7xl mx-auto px-5 pt-6 flex gap-3">
        <div className="bg-teal-900 text-white text-sm font-medium px-4 py-2 rounded-full">
          Bookmarks
        </div>
        <Link
          href="/lists"
          className="bg-white text-teal-900 text-sm font-medium px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
        >
          <List size={14} />
          Reading Lists
        </Link>
      </div>

      <section className="max-w-7xl mx-auto px-5 py-10 pb-20 md:pb-24 min-h-[60vh] fade-in-up">
        {bookmarks.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen size={40} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No bookmarks yet</p>
            <p className="text-gray-400 text-sm">
              Bookmark books and duas to find them quickly later.
            </p>
          </div>
        ) : (
          <div className="space-y-3 fade-in-up">
            {bookmarks.map((bm) => (
              <div
                key={bm.id}
                className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center gap-4"
              >
                {bm.coverUrl && (
                  <div className="relative w-12 h-16 shrink-0 rounded-lg overflow-hidden bg-teal-50">
                    <Image
                      src={bm.coverUrl}
                      alt={bm.title}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <Link
                    href={bm.href}
                    className="font-semibold text-teal-900 hover:text-teal-700 transition-colors text-sm line-clamp-1"
                  >
                    {bm.title}
                  </Link>
                  <p className="text-xs text-gray-400 capitalize">{bm.type}</p>
                </div>
                <button
                  onClick={() => removeBookmark(bm.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-2"
                  title="Remove bookmark"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
