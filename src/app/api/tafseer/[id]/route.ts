import { NextResponse } from "next/server";
import {
  R2_TAFSEER_BASE_URL,
  TAFSEER_IDS,
} from "@/lib/quran-tafseer-data";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;

  if (!TAFSEER_IDS.has(id)) {
    return NextResponse.json({ error: "Unknown tafseer" }, { status: 404 });
  }

  if (id === "muyassar") {
    // muyassar.json is a bundled static asset under public/. We fetch it by
    // same-origin URL rather than reading from disk so this runs on edge
    // runtimes (Cloudflare Workers) that have no Node filesystem, while still
    // working on Node hosts where Next serves /public.
    // No `next: { revalidate }` here: the file is 2.6 MB and Next's data
    // cache refuses entries over 2 MB, so asking for it only logs a failure
    // every request. The cache-control header below is what actually keeps
    // this off the origin.
    const assetUrl = new URL("/quran/tafseers/muyassar.json", request.url);
    const file = await fetch(assetUrl, { cache: "no-store" });
    if (!file.ok) {
      return NextResponse.json(
        { error: "Bundled tafseer missing" },
        { status: 500 }
      );
    }
    return new NextResponse(await file.text(), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control":
          "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800",
      },
    });
  }

  const upstream = await fetch(`${R2_TAFSEER_BASE_URL}/${id}.json`, {
    next: { revalidate: 60 * 60 * 24 * 7 },
  });

  if (!upstream.ok) {
    return NextResponse.json(
      { error: "Could not load tafseer" },
      { status: upstream.status }
    );
  }

  return new NextResponse(await upstream.text(), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control":
        "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800",
    },
  });
}
