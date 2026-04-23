import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type ResourceType = "book" | "lecture" | "khutba";
type FieldName = "cover_url" | "pdf_url" | "audio_url" | "video_url";
type Status = "ok" | "broken" | "timeout" | "error";

type CheckTarget = {
  resource_type: ResourceType;
  resource_id: string;
  field: FieldName;
  url: string;
};

type CheckResult = {
  resource_type: ResourceType;
  resource_id: string;
  field: FieldName;
  url: string;
  status: Status;
  http_code: number | null;
  error_message: string | null;
};

const CONCURRENCY = 12;
const TIMEOUT_MS = 10_000;

function supabaseFromRequest() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient<Database>(url, anon);
}

async function checkOne(target: CheckTarget): Promise<CheckResult> {
  const base = {
    resource_type: target.resource_type,
    resource_id: target.resource_id,
    field: target.field,
    url: target.url,
  };

  // Supabase Storage URLs nearly always support HEAD.
  // Some external hosts (YouTube, Drive) reject HEAD, so fall back to GET with a tiny range.
  async function attempt(method: "HEAD" | "GET"): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      return await fetch(target.url, {
        method,
        redirect: "follow",
        signal: controller.signal,
        headers:
          method === "GET"
            ? { Range: "bytes=0-0", "User-Agent": "IlmLibraryLinkCheck/1.0" }
            : { "User-Agent": "IlmLibraryLinkCheck/1.0" },
      });
    } finally {
      clearTimeout(timer);
    }
  }

  try {
    let res: Response;
    try {
      res = await attempt("HEAD");
      if (res.status === 405 || res.status === 403 || res.status === 501) {
        res = await attempt("GET");
      }
    } catch {
      res = await attempt("GET");
    }

    const ok = res.status >= 200 && res.status < 400;
    return {
      ...base,
      status: ok ? "ok" : "broken",
      http_code: res.status,
      error_message: ok ? null : res.statusText || null,
    };
  } catch (err) {
    const isAbort =
      err instanceof Error &&
      (err.name === "AbortError" || /abort/i.test(err.message));
    return {
      ...base,
      status: isAbort ? "timeout" : "error",
      http_code: null,
      error_message: err instanceof Error ? err.message : "unknown error",
    };
  }
}

async function runLimitedConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= items.length) break;
      results[i] = await worker(items[i]);
    }
  });

  await Promise.all(workers);
  return results;
}

export async function POST(request: Request) {
  const supabase = supabaseFromRequest();

  // Verify caller is authenticated
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = auth.slice("Bearer ".length);
  const { data: userData, error: userErr } = await supabase.auth.getUser(token);
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Collect every URL we need to check
  const targets: CheckTarget[] = [];

  const [booksR, lecturesR, khutbasR] = await Promise.all([
    supabase.from("books").select("id,cover_url,pdf_url"),
    supabase.from("lectures").select("id,audio_url,video_url"),
    supabase.from("khutbas").select("id,audio_url,video_url"),
  ]);

  (booksR.data ?? []).forEach((b) => {
    if (b.cover_url) {
      targets.push({
        resource_type: "book",
        resource_id: b.id,
        field: "cover_url",
        url: b.cover_url,
      });
    }
    if (b.pdf_url) {
      targets.push({
        resource_type: "book",
        resource_id: b.id,
        field: "pdf_url",
        url: b.pdf_url,
      });
    }
  });

  (lecturesR.data ?? []).forEach((l) => {
    if (l.audio_url) {
      targets.push({
        resource_type: "lecture",
        resource_id: l.id,
        field: "audio_url",
        url: l.audio_url,
      });
    }
    if (l.video_url) {
      targets.push({
        resource_type: "lecture",
        resource_id: l.id,
        field: "video_url",
        url: l.video_url,
      });
    }
  });

  (khutbasR.data ?? []).forEach((k) => {
    if (k.audio_url) {
      targets.push({
        resource_type: "khutba",
        resource_id: k.id,
        field: "audio_url",
        url: k.audio_url,
      });
    }
    if (k.video_url) {
      targets.push({
        resource_type: "khutba",
        resource_id: k.id,
        field: "video_url",
        url: k.video_url,
      });
    }
  });

  const results = await runLimitedConcurrency(targets, CONCURRENCY, checkOne);

  // Upsert all rows (one per resource+field, replacing prior check)
  // Clear prior results for any targets we just rechecked, then insert fresh.
  // The unique constraint (resource_type, resource_id, field) makes upsert clean.
  if (results.length > 0) {
    const rows = results.map((r) => ({
      resource_type: r.resource_type,
      resource_id: r.resource_id,
      field: r.field,
      url: r.url,
      status: r.status,
      http_code: r.http_code,
      error_message: r.error_message,
      checked_at: new Date().toISOString(),
    }));
    const { error } = await supabase
      .from("link_check_results")
      .upsert(rows, { onConflict: "resource_type,resource_id,field" });
    if (error) {
      return NextResponse.json(
        { error: `DB upsert failed: ${error.message}` },
        { status: 500 }
      );
    }
  }

  const summary = {
    total: results.length,
    ok: results.filter((r) => r.status === "ok").length,
    broken: results.filter((r) => r.status === "broken").length,
    timeout: results.filter((r) => r.status === "timeout").length,
    error: results.filter((r) => r.status === "error").length,
    checked_at: new Date().toISOString(),
  };

  return NextResponse.json(summary);
}
