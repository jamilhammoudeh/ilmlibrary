import { getBucket, getEnv } from "@/lib/db";

// Multipart ingest for files above wrangler's 300MiB direct-upload cap.
// Server-to-server only: requires the INGEST_KEY secret; keys are restricted
// to the import prefixes. Used by scripts/import/09-multipart-upload.mjs.

export const dynamic = "force-dynamic";

const KEY_RE = /^(books|covers)\/arabic\/[\w.\-]{1,200}$/;

export async function POST(request: Request) {
  const env = await getEnv();
  // trim: piping the secret into `wrangler secret put` can append a newline
  const secret = (env as unknown as { INGEST_KEY?: string }).INGEST_KEY?.trim();
  if (!secret || request.headers.get("x-ingest-key") !== secret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sp = new URL(request.url).searchParams;
  const action = sp.get("action");
  const key = sp.get("key") ?? "";
  if (!KEY_RE.test(key)) return Response.json({ error: "Bad key" }, { status: 400 });

  const bucket = await getBucket();

  if (action === "create") {
    const upload = await bucket.createMultipartUpload(key, {
      httpMetadata: { contentType: sp.get("contentType") ?? "application/pdf" },
    });
    return Response.json({ uploadId: upload.uploadId });
  }

  const uploadId = sp.get("uploadId");
  if (!uploadId) return Response.json({ error: "Missing uploadId" }, { status: 400 });
  const upload = bucket.resumeMultipartUpload(key, uploadId);

  if (action === "part") {
    const partNumber = Number(sp.get("partNumber"));
    if (!partNumber || !request.body) {
      return Response.json({ error: "Missing partNumber/body" }, { status: 400 });
    }
    const length = Number(request.headers.get("content-length"));
    if (!length) return Response.json({ error: "Missing content-length" }, { status: 400 });
    // R2 needs a known-length stream for parts.
    const { readable, writable } = new FixedLengthStream(length);
    const piping = request.body.pipeTo(writable);
    const part = await upload.uploadPart(partNumber, readable);
    await piping;
    return Response.json({ partNumber: part.partNumber, etag: part.etag });
  }

  if (action === "complete") {
    const body = (await request.json()) as { parts: { partNumber: number; etag: string }[] };
    await upload.complete(body.parts);
    return Response.json({ ok: true });
  }

  if (action === "abort") {
    await upload.abort();
    return Response.json({ ok: true });
  }

  return Response.json({ error: "Bad action" }, { status: 400 });
}
