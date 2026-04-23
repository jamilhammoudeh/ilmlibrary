"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { saveProgress } from "@/lib/reading-progress";

export default function ReadBookPage({
  params,
}: {
  params: Promise<{ bookSlug: string }>;
}) {
  const [book, setBook] = useState<{ title: string; pdf_url: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  const [slug, setSlug] = useState("");

  useEffect(() => {
    params.then(async ({ bookSlug }) => {
      setSlug(bookSlug);
      const { data } = await supabase
        .from("books")
        .select("title, pdf_url")
        .eq("slug", bookSlug)
        .single();
      setBook(data);
      setLoading(false);
      if (data?.title) {
        saveProgress(bookSlug, data.title, `/read/${bookSlug}`);
      }
    });
  }, [params]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#f0f0f0] flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!book || !book.pdf_url) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#f0f0f0] flex items-center justify-center">
        <p className="text-gray-500">Book not found.</p>
      </div>
    );
  }

  // Detect mobile
  const isMobile = typeof window !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // On mobile, redirect directly to the PDF so the native viewer handles it
  if (isMobile && book.pdf_url) {
    window.location.href = book.pdf_url;
    return (
      <div className="fixed inset-0 z-[9999] bg-[#f0f0f0] flex items-center justify-center">
        <p className="text-gray-500">Opening PDF...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-[#f0f0f0]">
      {/* Top bar */}
      <div className="bg-teal-900 text-white px-4 py-2.5 flex items-center justify-center shrink-0">
        <h1 className="text-sm font-semibold truncate max-w-full text-center">
          {book.title}
        </h1>
      </div>

      {/* PDF viewer */}
      <iframe
        src={book.pdf_url}
        className="flex-1 w-full border-0"
        title={book.title}
      />
    </div>
  );
}
