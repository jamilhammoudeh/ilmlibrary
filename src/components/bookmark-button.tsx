"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import {
  isBookmarked,
  addBookmark,
  removeBookmark,
  type Bookmark as BookmarkType,
} from "@/lib/bookmarks";

type Props = Omit<BookmarkType, "addedAt">;

export function BookmarkButton(props: Props) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isBookmarked(props.id));
    function onChange() {
      setSaved(isBookmarked(props.id));
    }
    window.addEventListener("bookmarks-changed", onChange);
    return () => window.removeEventListener("bookmarks-changed", onChange);
  }, [props.id]);

  function toggle() {
    if (saved) {
      removeBookmark(props.id);
    } else {
      addBookmark(props);
    }
    setSaved(!saved);
  }

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 text-sm transition-colors ${
        saved
          ? "text-teal-700 font-medium"
          : "text-gray-500 hover:text-teal-700"
      }`}
      title={saved ? "Remove bookmark" : "Bookmark this"}
    >
      <Bookmark
        size={15}
        className={saved ? "fill-teal-700" : ""}
      />
      {saved ? "Saved" : "Bookmark"}
    </button>
  );
}
