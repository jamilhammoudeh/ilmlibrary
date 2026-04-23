"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

export function SearchBar({ basePath, placeholder }: { basePath: string; placeholder?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length >= 2) {
      router.push(`${basePath}?q=${encodeURIComponent(query.trim())}`);
    } else if (query.trim().length === 0) {
      router.push(basePath);
    }
  }

  const hasQuery = query.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto">
      <Search
        className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
          focused ? "text-teal-700" : "text-gray-400"
        }`}
        size={20}
      />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (e.target.value.trim().length === 0) {
            router.push(basePath);
          }
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder ?? "Search..."}
        className={`w-full pl-12 ${
          hasQuery ? "pr-11" : "pr-4"
        } py-3 rounded-full bg-white text-gray-900 border border-gray-200 outline-none transition-all duration-200 ${
          focused
            ? "shadow-[0_8px_24px_rgba(0,77,64,0.15)] border-teal-700/40 ring-2 ring-teal-700/15"
            : "shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
        }`}
      />
      {hasQuery && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            router.push(basePath);
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
}
