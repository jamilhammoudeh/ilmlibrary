"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Search,
  LayoutDashboard,
  BookOpen,
  Mic,
  Speaker,
  HandHeart,
  Quote,
  FolderOpen,
  FileText,
  Plus,
  ExternalLink,
  Command as CommandIcon,
  CornerDownLeft,
} from "lucide-react";

type Command = {
  id: string;
  title: string;
  subtitle?: string;
  group: "Navigate" | "Create" | "Content";
  icon: React.ComponentType<{ size?: number }>;
  run: () => void;
  keywords?: string;
};

type ContentHit = {
  id: string;
  title: string;
  subtitle?: string;
  type: "book" | "lecture" | "khutba" | "dua" | "wisdom" | "page";
  editHref: string;
};

const typeIcon: Record<ContentHit["type"], React.ComponentType<{ size?: number }>> = {
  book: BookOpen,
  lecture: Mic,
  khutba: Speaker,
  dua: HandHeart,
  wisdom: Quote,
  page: FileText,
};

const typeLabel: Record<ContentHit["type"], string> = {
  book: "Book",
  lecture: "Lecture",
  khutba: "Khutba",
  dua: "Dua",
  wisdom: "Wisdom",
  page: "Page",
};

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<ContentHit[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setHits([]);
    setActiveIndex(0);
  }, []);

  // Global hotkey + external open trigger
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const modHeld = isMac ? e.metaKey : e.ctrlKey;
      if (modHeld && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        e.preventDefault();
        close();
      }
    }
    function onOpen() {
      setOpen(true);
    }
    document.addEventListener("keydown", onKey);
    window.addEventListener("admin:cmdk:open", onOpen);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("admin:cmdk:open", onOpen);
    };
  }, [open, close]);

  // Focus input on open + lock scroll
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 10);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Debounced content search
  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (q.length < 2) {
      setHits([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    let cancelled = false;
    const t = setTimeout(async () => {
      const like = `%${q}%`;
      const [booksR, lecturesR, khutbasR, duasR, wisdomR, pagesR] = await Promise.all([
        supabase.from("books").select("id,title,author").ilike("title", like).limit(5),
        supabase.from("lectures").select("id,title,speaker").ilike("title", like).limit(5),
        supabase.from("khutbas").select("id,title,speaker").ilike("title", like).limit(5),
        supabase.from("duas").select("id,title,translation").ilike("translation", like).limit(5),
        supabase.from("wisdom").select("id,quote_english,attribution").ilike("quote_english", like).limit(5),
        supabase.from("pages").select("id,title,slug,subtitle").ilike("title", like).limit(5),
      ]);
      if (cancelled) return;

      type BookRow = { id: string; title: string; author: string };
      type MediaRow = { id: string; title: string; speaker: string };
      type DuaRow = { id: string; title: string | null; translation: string };
      type WisdomRow = { id: string; quote_english: string; attribution: string };
      type PageRow = { id: string; title: string; slug: string; subtitle: string | null };

      const results: ContentHit[] = [
        ...((booksR.data as BookRow[]) ?? []).map((r) => ({
          id: r.id,
          title: r.title,
          subtitle: r.author,
          type: "book" as const,
          editHref: `/admin/books?edit=${r.id}`,
        })),
        ...((lecturesR.data as MediaRow[]) ?? []).map((r) => ({
          id: r.id,
          title: r.title,
          subtitle: r.speaker,
          type: "lecture" as const,
          editHref: `/admin/lectures?edit=${r.id}`,
        })),
        ...((khutbasR.data as MediaRow[]) ?? []).map((r) => ({
          id: r.id,
          title: r.title,
          subtitle: r.speaker,
          type: "khutba" as const,
          editHref: `/admin/khutbas?edit=${r.id}`,
        })),
        ...((duasR.data as DuaRow[]) ?? []).map((r) => ({
          id: r.id,
          title: r.title || r.translation.slice(0, 60),
          type: "dua" as const,
          editHref: `/admin/duas?edit=${r.id}`,
        })),
        ...((wisdomR.data as WisdomRow[]) ?? []).map((r) => ({
          id: r.id,
          title: r.quote_english.slice(0, 70) + (r.quote_english.length > 70 ? "…" : ""),
          subtitle: r.attribution,
          type: "wisdom" as const,
          editHref: `/admin/wisdom?edit=${r.id}`,
        })),
        ...((pagesR.data as PageRow[]) ?? []).map((r) => ({
          id: r.id,
          title: r.title,
          subtitle: r.subtitle ?? `/${r.slug}`,
          type: "page" as const,
          editHref: `/admin/pages?edit=${r.id}`,
        })),
      ];

      setHits(results);
      setSearching(false);
      setActiveIndex(0);
    }, 160);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query, open]);

  const go = useCallback(
    (href: string) => {
      router.push(href);
      close();
    },
    [router, close]
  );

  const staticCommands = useMemo<Command[]>(
    () => [
      { id: "nav-dash", group: "Navigate", title: "Dashboard", icon: LayoutDashboard, run: () => go("/admin"), keywords: "home overview" },
      { id: "nav-pages", group: "Navigate", title: "Pages", icon: FileText, run: () => go("/admin/pages"), keywords: "site pages landing" },
      { id: "nav-books", group: "Navigate", title: "Books", icon: BookOpen, run: () => go("/admin/books") },
      { id: "nav-lectures", group: "Navigate", title: "Lectures", icon: Mic, run: () => go("/admin/lectures") },
      { id: "nav-khutbas", group: "Navigate", title: "Khutbas", icon: Speaker, run: () => go("/admin/khutbas") },
      { id: "nav-duas", group: "Navigate", title: "Duas", icon: HandHeart, run: () => go("/admin/duas") },
      { id: "nav-wisdom", group: "Navigate", title: "Wisdom", icon: Quote, run: () => go("/admin/wisdom") },
      { id: "nav-categories", group: "Navigate", title: "Categories", icon: FolderOpen, run: () => go("/admin/categories") },
      { id: "new-page", group: "Create", title: "New Page", icon: Plus, run: () => go("/admin/pages?new=1") },
      { id: "new-book", group: "Create", title: "New Book", icon: Plus, run: () => go("/admin/books?new=1") },
      { id: "new-lecture", group: "Create", title: "New Lecture", icon: Plus, run: () => go("/admin/lectures?new=1") },
      { id: "new-khutba", group: "Create", title: "New Khutba", icon: Plus, run: () => go("/admin/khutbas?new=1") },
      { id: "new-dua", group: "Create", title: "New Dua", icon: Plus, run: () => go("/admin/duas?new=1") },
      { id: "new-wisdom", group: "Create", title: "New Quote", icon: Plus, run: () => go("/admin/wisdom?new=1") },
      { id: "new-category", group: "Create", title: "New Category", icon: Plus, run: () => go("/admin/categories?new=1") },
      { id: "external-site", group: "Navigate", title: "Open Public Site", icon: ExternalLink, run: () => { window.open("/", "_blank"); close(); } },
    ],
    [go, close]
  );

  const filteredStatic = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return staticCommands;
    return staticCommands.filter((c) =>
      `${c.title} ${c.group} ${c.keywords ?? ""}`.toLowerCase().includes(q)
    );
  }, [staticCommands, query]);

  const dynamicCommands = useMemo<Command[]>(() => {
    return hits.map((h) => {
      const Icon = typeIcon[h.type];
      return {
        id: `hit-${h.type}-${h.id}`,
        group: "Content" as const,
        title: h.title,
        subtitle: h.subtitle,
        icon: Icon,
        run: () => go(h.editHref),
      };
    });
  }, [hits, go]);

  const allCommands = useMemo(() => {
    const q = query.trim();
    if (q.length >= 2) {
      return [...filteredStatic, ...dynamicCommands];
    }
    return filteredStatic;
  }, [filteredStatic, dynamicCommands, query]);

  const groups = useMemo(() => {
    const g: Record<string, Command[]> = { Navigate: [], Create: [], Content: [] };
    allCommands.forEach((c) => {
      (g[c.group] ||= []).push(c);
    });
    return Object.entries(g).filter(([, items]) => items.length > 0);
  }, [allCommands]);

  const flatList = allCommands;

  // Arrow-key navigation
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(flatList.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = flatList[activeIndex];
      if (cmd) cmd.run();
    }
  };

  if (!open) return null;

  let flatIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/40 flex items-start justify-center pt-[15vh] px-4"
      onClick={close}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-xl overflow-hidden border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search pages, actions, or content..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-400"
          />
          <kbd className="text-[10px] text-gray-400 font-mono bg-gray-100 rounded px-1.5 py-0.5 shrink-0">
            ESC
          </kbd>
        </div>

        <div className="max-h-[55vh] overflow-y-auto py-1">
          {flatList.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-500">
              {searching ? "Searching..." : "No results"}
            </div>
          ) : (
            groups.map(([group, items]) => (
              <div key={group}>
                <p className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  {group}
                </p>
                <ul>
                  {items.map((cmd) => {
                    flatIndex++;
                    const isActive = flatIndex === activeIndex;
                    const Icon = cmd.icon;
                    const currentFlatIndex = flatIndex;
                    return (
                      <li key={cmd.id}>
                        <button
                          type="button"
                          onClick={cmd.run}
                          onMouseEnter={() => setActiveIndex(currentFlatIndex)}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm ${
                            isActive ? "bg-teal-50 text-teal-900" : "text-gray-700"
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${
                              isActive ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            <Icon size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-medium">{cmd.title}</p>
                            {cmd.subtitle && (
                              <p className="text-xs text-gray-500 truncate">{cmd.subtitle}</p>
                            )}
                          </div>
                          {isActive && <CornerDownLeft size={13} className="text-gray-400 shrink-0" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 text-[11px] text-gray-500 bg-gray-50">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <kbd className="bg-white border border-gray-200 rounded px-1">↑↓</kbd> navigate
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="bg-white border border-gray-200 rounded px-1">↵</kbd> select
            </span>
          </div>
          <span className="inline-flex items-center gap-1">
            <CommandIcon size={11} />K to toggle
          </span>
        </div>
      </div>
    </div>
  );
}

/** Trigger button — place in the sidebar. Opens the palette via window event. */
export function CommandPaletteTrigger() {
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().includes("MAC"));
  }, []);

  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent("admin:cmdk:open"))}
      className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-sm text-gray-500 transition-colors"
    >
      <Search size={14} />
      <span className="flex-1 text-left">Search...</span>
      <kbd className="text-[10px] font-mono bg-white border border-gray-200 rounded px-1.5 py-0.5 shrink-0">
        {isMac ? "⌘" : "Ctrl"}K
      </kbd>
    </button>
  );
}
