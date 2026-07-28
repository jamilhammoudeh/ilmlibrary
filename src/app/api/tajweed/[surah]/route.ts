import { NextResponse } from "next/server";
import { parseTajweedHtml, type TajweedSegment } from "@/lib/quran-tajweed";

const API_URL = "https://api.quran.com/api/v4/quran/verses/uthmani_tajweed";
const PER_PAGE = 50;
const PAGE_SAFETY_CAP = 20;

type RouteContext = {
  params: Promise<{ surah: string }>;
};

type TajweedApiVerse = {
  verse_key?: unknown;
  text_uthmani_tajweed?: unknown;
};

type TajweedApiResponse = {
  verses?: TajweedApiVerse[];
  pagination?: { total_pages?: unknown };
  meta?: { total_pages?: unknown };
};

export async function GET(_request: Request, context: RouteContext) {
  const { surah } = await context.params;
  const surahId = Number(surah);

  if (!Number.isFinite(surahId) || surahId < 1 || surahId > 114) {
    return NextResponse.json({ error: "Invalid surah" }, { status: 400 });
  }

  const out: Record<string, TajweedSegment[]> = {};
  let page = 1;

  for (let i = 0; i < PAGE_SAFETY_CAP; i++) {
    const url = `${API_URL}?chapter_number=${surahId}&per_page=${PER_PAGE}&page=${page}`;
    const response = await fetch(url, {
      next: { revalidate: 60 * 60 * 24 * 14 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Could not load tajweed" },
        { status: response.status }
      );
    }

    const json = (await response.json()) as TajweedApiResponse;
    const verses = Array.isArray(json.verses) ? json.verses : [];

    for (const verse of verses) {
      const key = typeof verse.verse_key === "string" ? verse.verse_key : null;
      const text =
        typeof verse.text_uthmani_tajweed === "string"
          ? verse.text_uthmani_tajweed
          : null;
      if (!key || !text) continue;
      out[key] = parseTajweedHtml(text);
    }

    const totalPages = Number(
      json.pagination?.total_pages ?? json.meta?.total_pages ?? 1
    );
    if (page >= totalPages) break;
    page++;
  }

  return NextResponse.json(out, {
    headers: {
      "cache-control":
        "public, max-age=86400, s-maxage=1209600, stale-while-revalidate=1209600",
    },
  });
}
