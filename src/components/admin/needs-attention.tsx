"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/admin-api";
import {
  AlertCircle,
  FileX,
  ImageOff,
  Volume2,
  FileText,
  FolderOpen,
  CheckCircle2,
  ArrowRight,
  Link2Off,
} from "lucide-react";

type IssueType =
  | "book"
  | "lecture"
  | "khutba"
  | "dua"
  | "wisdom"
  | "page"
  | "category";

type Issue = {
  key: string;
  editHref: string;
  title: string;
  subtitle?: string;
  type: IssueType;
  missing: { label: string; Icon: React.ComponentType<{ size?: number }> }[];
};

const missingMeta = {
  pdf: { label: "PDF", Icon: FileX },
  cover: { label: "Cover", Icon: ImageOff },
  media: { label: "Media", Icon: Volume2 },
  description: { label: "Description", Icon: FileText },
  arabic: { label: "Arabic", Icon: FileText },
  translation: { label: "Translation", Icon: FileText },
  quote: { label: "Quote", Icon: FileText },
  body: { label: "Body", Icon: FileText },
  category: { label: "Category", Icon: FolderOpen },
  broken_pdf: { label: "Broken PDF", Icon: Link2Off },
  broken_cover: { label: "Broken Cover", Icon: Link2Off },
  broken_audio: { label: "Broken Audio", Icon: Link2Off },
  broken_video: { label: "Broken Video", Icon: Link2Off },
};

const typeLabel: Record<IssueType, string> = {
  book: "Book",
  lecture: "Lecture",
  khutba: "Khutba",
  dua: "Dua",
  wisdom: "Wisdom",
  page: "Page",
  category: "Category",
};

type Filter = "all" | IssueType;

export function NeedsAttention() {
  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    async function load() {
      setLoading(true);

      type BookRow = { id: string; title: string; author: string };
      type MediaRow = { id: string; title: string; speaker: string };
      type DuaRow = { id: string; title: string | null; translation?: string | null; arabic_text?: string | null };
      type WisdomRow = { id: string; attribution: string };
      type PageRow = { id: string; slug: string; title: string };
      type EmptyCategoryRow = {
        id: string;
        name: string;
        content_type: "book" | "lecture" | "khutba" | "dua" | "wisdom" | "guide";
      };
      type BrokenRow = {
        resource_type: "book" | "lecture" | "khutba";
        resource_id: string;
        field: "cover_url" | "pdf_url" | "audio_url" | "video_url";
        status: string;
        title: string;
        subtitle: string;
      };
      type Payload = {
        books_missing_pdf: BookRow[];
        books_missing_cover: BookRow[];
        books_missing_description: BookRow[];
        books_missing_category: BookRow[];
        lectures_missing_media: MediaRow[];
        khutbas_missing_media: MediaRow[];
        duas_missing_arabic: DuaRow[];
        duas_missing_translation: DuaRow[];
        wisdom_missing_quote: WisdomRow[];
        pages_missing_body: PageRow[];
        empty_categories: EmptyCategoryRow[];
        broken_links: BrokenRow[];
      };

      let data: Payload;
      try {
        // All lists (including broken links joined back to titles and
        // per-category emptiness) are computed server-side in one payload.
        data = await adminApi.get<Payload>("/api/admin/needs-attention");
      } catch {
        setLoading(false);
        return;
      }

      // Aggregate book issues per id
      const bookMap = new Map<string, { row: BookRow; missing: Set<string> }>();
      function addBook(
        row: BookRow,
        code:
          | "pdf"
          | "cover"
          | "description"
          | "category"
          | "broken_pdf"
          | "broken_cover"
      ) {
        if (!bookMap.has(row.id)) bookMap.set(row.id, { row, missing: new Set() });
        bookMap.get(row.id)!.missing.add(code);
      }
      data.books_missing_pdf.forEach((r) => addBook(r, "pdf"));
      data.books_missing_cover.forEach((r) => addBook(r, "cover"));
      data.books_missing_description.forEach((r) => addBook(r, "description"));
      data.books_missing_category.forEach((r) => addBook(r, "category"));

      // Broken links for books
      data.broken_links
        .filter((r) => r.resource_type === "book")
        .forEach((r) => {
          const row: BookRow = { id: r.resource_id, title: r.title, author: r.subtitle };
          if (r.field === "pdf_url") addBook(row, "broken_pdf");
          if (r.field === "cover_url") addBook(row, "broken_cover");
        });

      const bookIssues: Issue[] = Array.from(bookMap.values()).map(({ row, missing }) => ({
        key: `book-${row.id}`,
        type: "book",
        title: row.title,
        subtitle: row.author,
        editHref: `/admin/books?edit=${row.id}`,
        missing: Array.from(missing).map((m) => missingMeta[m as keyof typeof missingMeta]),
      }));

      // Aggregate lecture issues (missing media + broken links)
      const lectureMap = new Map<
        string,
        { row: MediaRow; missing: Set<string> }
      >();
      data.lectures_missing_media.forEach((r) => {
        lectureMap.set(r.id, { row: r, missing: new Set(["media"]) });
      });
      data.broken_links
        .filter((r) => r.resource_type === "lecture")
        .forEach((r) => {
          if (!lectureMap.has(r.resource_id)) {
            lectureMap.set(r.resource_id, {
              row: { id: r.resource_id, title: r.title, speaker: r.subtitle },
              missing: new Set(),
            });
          }
          if (r.field === "audio_url")
            lectureMap.get(r.resource_id)!.missing.add("broken_audio");
          if (r.field === "video_url")
            lectureMap.get(r.resource_id)!.missing.add("broken_video");
        });
      const lectureIssues: Issue[] = Array.from(lectureMap.values()).map(
        ({ row, missing }) => ({
          key: `lecture-${row.id}`,
          type: "lecture",
          title: row.title,
          subtitle: row.speaker,
          editHref: `/admin/lectures?edit=${row.id}`,
          missing: Array.from(missing).map(
            (m) => missingMeta[m as keyof typeof missingMeta]
          ),
        })
      );

      // Aggregate khutba issues (missing media + broken links)
      const khutbaMap = new Map<
        string,
        { row: MediaRow; missing: Set<string> }
      >();
      data.khutbas_missing_media.forEach((r) => {
        khutbaMap.set(r.id, { row: r, missing: new Set(["media"]) });
      });
      data.broken_links
        .filter((r) => r.resource_type === "khutba")
        .forEach((r) => {
          if (!khutbaMap.has(r.resource_id)) {
            khutbaMap.set(r.resource_id, {
              row: { id: r.resource_id, title: r.title, speaker: r.subtitle },
              missing: new Set(),
            });
          }
          if (r.field === "audio_url")
            khutbaMap.get(r.resource_id)!.missing.add("broken_audio");
          if (r.field === "video_url")
            khutbaMap.get(r.resource_id)!.missing.add("broken_video");
        });
      const khutbaIssues: Issue[] = Array.from(khutbaMap.values()).map(
        ({ row, missing }) => ({
          key: `khutba-${row.id}`,
          type: "khutba",
          title: row.title,
          subtitle: row.speaker,
          editHref: `/admin/khutbas?edit=${row.id}`,
          missing: Array.from(missing).map(
            (m) => missingMeta[m as keyof typeof missingMeta]
          ),
        })
      );

      // Aggregate dua issues
      const duaMap = new Map<string, { row: DuaRow; missing: Set<string> }>();
      function addDua(row: DuaRow, code: "arabic" | "translation") {
        if (!duaMap.has(row.id)) duaMap.set(row.id, { row, missing: new Set() });
        duaMap.get(row.id)!.missing.add(code);
      }
      data.duas_missing_arabic.forEach((r) => addDua(r, "arabic"));
      data.duas_missing_translation.forEach((r) => addDua(r, "translation"));
      const duaIssues: Issue[] = Array.from(duaMap.values()).map(({ row, missing }) => ({
        key: `dua-${row.id}`,
        type: "dua",
        title: row.title || "(Untitled dua)",
        editHref: `/admin/duas?edit=${row.id}`,
        missing: Array.from(missing).map(
          (m) => missingMeta[m as keyof typeof missingMeta]
        ),
      }));

      const wisdomIssues: Issue[] = data.wisdom_missing_quote.map((row) => ({
        key: `wisdom-${row.id}`,
        type: "wisdom",
        title: row.attribution || "(No attribution)",
        editHref: `/admin/wisdom?edit=${row.id}`,
        missing: [missingMeta.quote],
      }));

      const pageIssues: Issue[] = data.pages_missing_body.map((row) => ({
        key: `page-${row.id}`,
        type: "page",
        title: row.title,
        subtitle: `/${row.slug}`,
        editHref: `/admin/pages?edit=${row.id}`,
        missing: [missingMeta.body],
      }));

      // Empty categories — computed server-side per content type
      const categoryIssues: Issue[] = data.empty_categories.map((cat) => ({
        key: `category-${cat.id}`,
        type: "category",
        title: cat.name,
        subtitle: `No ${cat.content_type}s assigned`,
        editHref: "/admin/categories",
        missing: [{ label: "Empty", Icon: FolderOpen }],
      }));

      setIssues([
        ...bookIssues,
        ...lectureIssues,
        ...khutbaIssues,
        ...duaIssues,
        ...wisdomIssues,
        ...pageIssues,
        ...categoryIssues,
      ]);
      setLoading(false);
    }
    load();
  }, []);

  const counts = {
    all: issues.length,
    book: issues.filter((i) => i.type === "book").length,
    lecture: issues.filter((i) => i.type === "lecture").length,
    khutba: issues.filter((i) => i.type === "khutba").length,
    dua: issues.filter((i) => i.type === "dua").length,
    wisdom: issues.filter((i) => i.type === "wisdom").length,
    page: issues.filter((i) => i.type === "page").length,
    category: issues.filter((i) => i.type === "category").length,
  };

  const visible = filter === "all" ? issues : issues.filter((i) => i.type === filter);

  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "book", label: "Books", count: counts.book },
    { key: "lecture", label: "Lectures", count: counts.lecture },
    { key: "khutba", label: "Khutbas", count: counts.khutba },
    { key: "dua", label: "Duas", count: counts.dua },
    { key: "wisdom", label: "Wisdom", count: counts.wisdom },
    { key: "page", label: "Pages", count: counts.page },
    { key: "category", label: "Categories", count: counts.category },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded flex items-center justify-center ${
              issues.length > 0 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {issues.length > 0 ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Needs Attention</h2>
            <p className="text-xs text-gray-500">Items missing required fields or files</p>
          </div>
        </div>
        {!loading && (
          <span className="text-xs font-medium text-gray-500">
            {issues.length} {issues.length === 1 ? "item" : "items"}
          </span>
        )}
      </div>

      {loading ? (
        <div className="p-5 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : issues.length === 0 ? (
        <div className="py-14 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 mb-3">
            <CheckCircle2 size={20} />
          </div>
          <p className="text-sm font-medium text-gray-900">All content is complete</p>
          <p className="text-xs text-gray-500 mt-1">No missing fields or files detected.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-1 px-3 pt-3 border-b border-gray-200 -mb-px overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                disabled={t.count === 0 && t.key !== "all"}
                className={`px-3 py-2 text-xs font-medium rounded-t border-b-2 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${
                  filter === t.key
                    ? "border-teal-700 text-teal-900"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                {t.label}
                <span
                  className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded ${
                    filter === t.key ? "bg-teal-100 text-teal-800" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>
          <ul className="divide-y divide-gray-200 max-h-[420px] overflow-y-auto">
            {visible.map((issue) => (
              <li key={issue.key}>
                <Link
                  href={issue.editHref}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded shrink-0">
                    {typeLabel[issue.type]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">{issue.title}</p>
                    {issue.subtitle && (
                      <p className="text-xs text-gray-500 truncate">{issue.subtitle}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {issue.missing.map((m, i) => {
                      const Icon = m.Icon;
                      return (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-1 rounded"
                          title={`Missing ${m.label}`}
                        >
                          <Icon size={11} />
                          {m.label}
                        </span>
                      );
                    })}
                  </div>
                  <ArrowRight size={14} className="text-gray-300 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
