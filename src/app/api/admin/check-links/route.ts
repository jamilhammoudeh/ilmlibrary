import { requireAdmin } from "@/lib/access-auth";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/d1-helpers";

type ResourceType = "book" | "lecture" | "khutba";
type FieldName = "cover_url" | "pdf_url" | "audio_url" | "video_url";
type Status = "ok" | "broken" | "timeout" | "error";

type CheckTarget = {
  resource_type: ResourceType;
  resource_id: string;
  field: FieldName;
  url: string;
};

type CheckResult = CheckTarget & {
  status: Status;
  http_code: number | null;
  error_message: string | null;
};

const CONCURRENCY = 12;
const TIMEOUT_MS = 10_000;
// Workers cap subrequests per invocation (~1000). Each check costs 1-2 fetches,
// so the client loops with a cursor until cursor_next is null.
const DEFAULT_BATCH = 400;

async function checkOne(target: CheckTarget): Promise<CheckResult> {
  const base = {
    resource_type: target.resource_type,
    resource_id: target.resource_id,
    field: target.field,
    url: target.url,
  };

  // R2/most CDNs support HEAD; some external hosts (YouTube, Drive) reject it,
  // so fall back to GET with a tiny range.
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
      err instanceof Error && (err.name === "AbortError" || /abort/i.test(err.message));
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
  const admin = await requireAdmin(request);
  if (admin instanceof Response) return admin;

  const body = (await request.json().catch(() => ({}))) as {
    cursor?: number;
    batch_size?: number;
  };
  const cursor = Math.max(body.cursor ?? 0, 0);
  const batchSize = Math.min(Math.max(body.batch_size ?? DEFAULT_BATCH, 50), 450);

  const db = await getDb();
  const [booksR, lecturesR, khutbasR] = await db.batch<Record<string, string | null>>([
    db.prepare("SELECT id, cover_url, pdf_url FROM books ORDER BY id"),
    db.prepare("SELECT id, audio_url, video_url FROM lectures ORDER BY id"),
    db.prepare("SELECT id, audio_url, video_url FROM khutbas ORDER BY id"),
  ]);

  const targets: CheckTarget[] = [];
  for (const b of booksR.results ?? []) {
    if (b.cover_url) targets.push({ resource_type: "book", resource_id: b.id!, field: "cover_url", url: b.cover_url });
    if (b.pdf_url) targets.push({ resource_type: "book", resource_id: b.id!, field: "pdf_url", url: b.pdf_url });
  }
  for (const l of lecturesR.results ?? []) {
    if (l.audio_url) targets.push({ resource_type: "lecture", resource_id: l.id!, field: "audio_url", url: l.audio_url });
    if (l.video_url) targets.push({ resource_type: "lecture", resource_id: l.id!, field: "video_url", url: l.video_url });
  }
  for (const k of khutbasR.results ?? []) {
    if (k.audio_url) targets.push({ resource_type: "khutba", resource_id: k.id!, field: "audio_url", url: k.audio_url });
    if (k.video_url) targets.push({ resource_type: "khutba", resource_id: k.id!, field: "video_url", url: k.video_url });
  }

  const slice = targets.slice(cursor, cursor + batchSize);
  const results = await runLimitedConcurrency(slice, CONCURRENCY, checkOne);

  if (results.length > 0) {
    const now = new Date().toISOString();
    const stmt = db.prepare(
      `INSERT INTO link_check_results (id, resource_type, resource_id, field, url, status, http_code, error_message, checked_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(resource_type, resource_id, field) DO UPDATE SET
         url = excluded.url, status = excluded.status, http_code = excluded.http_code,
         error_message = excluded.error_message, checked_at = excluded.checked_at`
    );
    // D1 batches are capped; chunk the upserts.
    for (let i = 0; i < results.length; i += 50) {
      await db.batch(
        results.slice(i, i + 50).map((r) =>
          stmt.bind(newId(), r.resource_type, r.resource_id, r.field, r.url, r.status, r.http_code, r.error_message, now)
        )
      );
    }
  }

  const next = cursor + slice.length;
  return Response.json({
    total_targets: targets.length,
    checked: slice.length,
    cursor_next: next < targets.length ? next : null,
    ok: results.filter((r) => r.status === "ok").length,
    broken: results.filter((r) => r.status === "broken").length,
    timeout: results.filter((r) => r.status === "timeout").length,
    error: results.filter((r) => r.status === "error").length,
    checked_at: new Date().toISOString(),
  });
}
