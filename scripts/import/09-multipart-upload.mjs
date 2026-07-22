/**
 * Stage 09 — Multipart-upload PDFs that exceed wrangler's 300MiB single-put
 * cap, streamed through the site's own /api/ingest endpoint (the Worker's R2
 * binding supports multipart; the REST API does not).
 *
 * Usage: node scripts/import/09-multipart-upload.mjs --source=archive-org
 * (then re-run 06-commit — it HEAD-checks and skips upload for these files)
 */

import { readFileSync, openSync, readSync, closeSync, statSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const IMPORT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(IMPORT_DIR, "..", "..");
const STATE = join(IMPORT_DIR, "state");
const INGEST = "https://www.ilmlibrary.org/api/ingest";
const PART_SIZE = 90 * 1024 * 1024; // stay under the 100MB request-body cap
const LIMIT = 300 * 1024 * 1024;

const source = process.argv.find((a) => a.startsWith("--source="))?.split("=")[1];
if (!source) {
  console.error("Usage: node scripts/import/09-multipart-upload.mjs --source=X");
  process.exit(1);
}

const ingestKey = readFileSync(join(ROOT, "migration-data", "ingest-key.txt"), "utf8").trim();
const HEADERS = { "x-ingest-key": ingestKey };

async function api(qs, init = {}) {
  const res = await fetch(`${INGEST}?${qs}`, { method: "POST", ...init, headers: { ...HEADERS, ...(init.headers ?? {}) } });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${res.status}: ${JSON.stringify(body).slice(0, 200)}`);
  return body;
}

async function multipartUpload(key, filePath) {
  const size = statSync(filePath).size;
  const encKey = encodeURIComponent(key);
  const { uploadId } = await api(`action=create&key=${encKey}&contentType=application/pdf`);
  if (!uploadId) throw new Error("no uploadId");

  const fd = openSync(filePath, "r");
  const parts = [];
  try {
    let offset = 0;
    let partNumber = 1;
    const totalParts = Math.ceil(size / PART_SIZE);
    while (offset < size) {
      const len = Math.min(PART_SIZE, size - offset);
      const buf = Buffer.alloc(len);
      readSync(fd, buf, 0, len, offset);
      let lastErr;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const part = await api(
            `action=part&key=${encKey}&uploadId=${encodeURIComponent(uploadId)}&partNumber=${partNumber}`,
            { body: buf, headers: { "Content-Type": "application/octet-stream" } }
          );
          parts.push({ partNumber: part.partNumber, etag: part.etag });
          lastErr = null;
          break;
        } catch (e) {
          lastErr = e;
          await new Promise((r) => setTimeout(r, 4000 * attempt));
        }
      }
      if (lastErr) {
        await api(`action=abort&key=${encKey}&uploadId=${encodeURIComponent(uploadId)}`).catch(() => {});
        throw lastErr;
      }
      console.log(`  part ${partNumber}/${totalParts} ok`);
      offset += len;
      partNumber++;
    }
  } finally {
    closeSync(fd);
  }

  await api(`action=complete&key=${encKey}&uploadId=${encodeURIComponent(uploadId)}`, {
    body: JSON.stringify({ parts }),
    headers: { "Content-Type": "application/json" },
  });
}

const processed = JSON.parse(readFileSync(join(STATE, `processed-${source}.json`), "utf8"));
const records = (processed.records ?? processed).filter(
  (r) => !r.excluded && r.local_pdf && existsSync(r.local_pdf) && statSync(r.local_pdf).size > LIMIT
);
console.log(`Oversized PDFs (> 300MiB): ${records.length}`);

let ok = 0;
let failed = 0;
for (const rec of records) {
  const key = `books/arabic/${rec.slug}.pdf`;
  const already = await fetch(`https://files.ilmlibrary.org/${key}`, { method: "HEAD" }).catch(() => null);
  if (already?.ok) {
    console.log(`(skip, exists) ${rec.slug}`);
    ok++;
    continue;
  }
  const mb = Math.round(statSync(rec.local_pdf).size / 1048576);
  console.log(`Uploading ${rec.slug} (${mb} MB)...`);
  try {
    await multipartUpload(key, rec.local_pdf);
    ok++;
    console.log(`  done`);
  } catch (e) {
    failed++;
    console.error(`  FAILED: ${String(e.message ?? e).slice(0, 300)}`);
  }
}
console.log(`\nDone. ${ok} uploaded/present, ${failed} failed.`);
if (ok > 0) console.log(`Next: node scripts/import/06-commit.mjs --source=${source}`);
