"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
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

      const [
        booksNoPdf,
        booksNoCover,
        booksNoDesc,
        booksNoCategory,
        lecturesNoMedia,
        khutbasNoMedia,
        duasNoArabic,
        duasNoTranslation,
        wisdomNoQuote,
        pagesNoBody,
        categoriesR,
        brokenLinksR,
      ] = await Promise.all([
        supabase.from("books").select("id,title,author").is("pdf_url", null).limit(50),
        supabase.from("books").select("id,title,author").is("cover_url", null).limit(50),
        supabase.from("books").select("id,title,author").is("description", null).limit(50),
        supabase.from("books").select("id,title,author").is("category_id", null).limit(50),
        supabase
          .from("lectures")
          .select("id,title,speaker")
          .is("audio_url", null)
          .is("video_url", null)
          .limit(30),
        supabase
          .from("khutbas")
          .select("id,title,speaker")
          .is("audio_url", null)
          .is("video_url", null)
          .limit(30),
        supabase.from("duas").select("id,title,translation").is("arabic_text", null).limit(30),
        supabase.from("duas").select("id,title,arabic_text").is("translation", null).limit(30),
        supabase.from("wisdom").select("id,attribution").is("quote_english", null).limit(30),
        supabase.from("pages").select("id,slug,title").is("body", null).limit(30),
        supabase.from("categories").select("id,name,content_type"),
        supabase
          .from("link_check_results")
          .select("resource_type,resource_id,field,status")
          .in("status", ["broken", "timeout", "error"])
          .limit(500),
      ]);

      type BrokenRow = {
        resource_type: "book" | "lecture" | "khutba";
        resource_id: string;
        field: "cover_url" | "pdf_url" | "audio_url" | "video_url";
        status: string;
      };
      const brokenByResource = new Map<
        string,
        { type: "book" | "lecture" | "khutba"; fields: Set<string> }
      >();
      ((brokenLinksR.data as BrokenRow[]) ?? []).forEach((r) => {
        const key = `${r.resource_type}-${r.resource_id}`;
        if (!brokenByResource.has(key)) {
          brokenByResource.set(key, {
            type: r.resource_type,
            fields: new Set(),
          });
        }
        brokenByResource.get(key)!.fields.add(r.field);
      });

      // Fetch titles for any broken resources not already loaded above
      const needBookIds: string[] = [];
      const needLectureIds: string[] = [];
      const needKhutbaIds: string[] = [];
      brokenByResource.forEach((v, key) => {
        const id = key.slice(v.type.length + 1);
        if (v.type === "book") needBookIds.push(id);
        else if (v.type === "lecture") needLectureIds.push(id);
        else if (v.type === "khutba") needKhutbaIds.push(id);
      });

      const [brokenBooksR, brokenLecturesR, brokenKhutbasR] = await Promise.all([
        needBookIds.length
          ? supabase
              .from("books")
              .select("id,title,author")
              .in("id", needBookIds)
          : Promise.resolve({ data: [] }),
        needLectureIds.length
          ? supabase
              .from("lectures")
              .select("id,title,speaker")
              .in("id", needLectureIds)
          : Promise.resolve({ data: [] }),
        needKhutbaIds.length
          ? supabase
              .from("khutbas")
              .select("id,title,speaker")
              .in("id", needKhutbaIds)
          : Promise.resolve({ data: [] }),
      ]);

      type BookRow = { id: string; title: string; author: string };
      type MediaRow = { id: string; title: string; speaker: string };
      type DuaRow = { id: string; title: string | null; translation?: string | null; arabic_text?: string | null };
      type WisdomRow = { id: string; attribution: string };
      type PageRow = { id: string; slug: string; title: string };
      type CategoryRow = {
        id: string;
        name: string;
        content_type: "book" | "lecture" | "khutba" | "dua" | "wisdom" | "guide";
      };

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
      ((booksNoPdf.data as BookRow[]) ?? []).forEach((r) => addBook(r, "pdf"));
      ((booksNoCover.data as BookRow[]) ?? []).forEach((r) => addBook(r, "cover"));
      ((booksNoDesc.data as BookRow[]) ?? []).forEach((r) => addBook(r, "description"));
      ((booksNoCategory.data as BookRow[]) ?? []).forEach((r) => addBook(r, "category"));

      // Broken links for books
      ((brokenBooksR.data as BookRow[]) ?? []).forEach((r) => {
        const entry = brokenByResource.get(`book-${r.id}`);
        if (!entry) return;
        if (entry.fields.has("pdf_url")) addBook(r, "broken_pdf");
        if (entry.fields.has("cover_url")) addBook(r, "broken_cover");
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
      ((lecturesNoMedia.data as MediaRow[]) ?? []).forEach((r) => {
        lectureMap.set(r.id, { row: r, missing: new Set(["media"]) });
      });
      ((brokenLecturesR.data as MediaRow[]) ?? []).forEach((r) => {
        const entry = brokenByResource.get(`lecture-${r.id}`);
        if (!entry) return;
        if (!lectureMap.has(r.id)) {
          lectureMap.set(r.id, { row: r, missing: new Set() });
        }
        if (entry.fields.has("audio_url"))
          lectureMap.get(r.id)!.missing.add("broken_audio");
        if (entry.fields.has("video_url"))
          lectureMap.get(r.id)!.missing.add("broken_video");
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
      ((khutbasNoMedia.data as MediaRow[]) ?? []).forEach((r) => {
        khutbaMap.set(r.id, { row: r, missing: new Set(["media"]) });
      });
      ((brokenKhutbasR.data as MediaRow[]) ?? []).forEach((r) => {
        const entry = brokenByResource.get(`khutba-${r.id}`);
        if (!entry) return;
        if (!khutbaMap.has(r.id)) {
          khutbaMap.set(r.id, { row: r, missing: new Set() });
        }
        if (entry.fields.has("audio_url"))
          khutbaMap.get(r.id)!.missing.add("broken_audio");
        if (entry.fields.has("video_url"))
          khutbaMap.get(r.id)!.missing.add("broken_video");
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
      ((duasNoArabic.data as DuaRow[]) ?? []).forEach((r) => addDua(r, "arabic"));
      ((duasNoTranslation.data as DuaRow[]) ?? []).forEach((r) => addDua(r, "translation"));
      const duaIssues: Issue[] = Array.from(duaMap.values()).map(({ row, missing }) => ({
        key: `dua-${row.id}`,
        type: "dua",
        title: row.title || "(Untitled dua)",
        editHref: `/admin/duas?edit=${row.id}`,
        missing: Array.from(missing).map(
          (m) => missingMeta[m as keyof typeof missingMeta]
        ),
      }));

      const wisdomIssues: Issue[] = ((wisdomNoQuote.data as WisdomRow[]) ?? []).map(
        (row) => ({
          key: `wisdom-${row.id}`,
          type: "wisdom",
          title: row.attribution || "(No attribution)",
          editHref: `/admin/wisdom?edit=${row.id}`,
          missing: [missingMeta.quote],
        })
      );

      const pageIssues: Issue[] = ((pagesNoBody.data as PageRow[]) ?? []).map((row) => ({
        key: `page-${row.id}`,
        type: "page",
        title: row.title,
        subtitle: `/${row.slug}`,
        editHref: `/admin/pages?edit=${row.id}`,
        missing: [missingMeta.body],
      }));

      // Empty categories — need counts per category
      const cats = (categoriesR.data as CategoryRow[]) ?? [];
      const usageByTable: Record<string, string> = {
        book: "books",
        lecture: "lectures",
        khutba: "khutbas",
        dua: "duas",
        wisdom: "wisdom",
        guide: "guides",
      };

      const catCounts = await Promise.all(
        cats.map(async (c) => {
          const table = usageByTable[c.content_type];
          if (!table) return { cat: c, count: 0 };
          const { count } = await supabase
            .from(table)
            .select("*", { count: "exact", head: true })
            .eq("category_id", c.id);
          return { cat: c, count: count ?? 0 };
        })
      );

      const categoryIssues: Issue[] = catCounts
        .filter((c) => c.count === 0)
        .map(({ cat }) => ({
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
