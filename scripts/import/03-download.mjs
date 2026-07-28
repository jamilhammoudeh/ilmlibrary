/**
 * Stage 03 â€” Download approved PDFs (and source covers) to the staging dir
 * OUTSIDE the repo: C:\Users\jhamm\ilm-import-staging\<source>\<slug>.pdf|.jpg
 *
 * - 1â€“2s between requests, 3 attempts per file
 * - resume-safe manifest: state/download-manifest-<source>.json (sha256 + bytes)
 * - validates %PDF magic bytes and min size 50KB
 * - covers validated as JPEG/PNG magic, saved as <slug>.jpg either way
 *
 * Usage: node scripts/import/03-download.mjs --source=X
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync, unlinkSync, createWriteStream, openSync, readSync, closeSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { homedir } from "os";
import { createHash } from "crypto";
import { pipeline } from "stream/promises";
import { Readable, Transform } from "stream";
import { sleep, USER_AGENT } from "./lib/http.mjs";

const IMPORT_DIR = dirname(fileURLToPath(import.meta.url));
const STATE = join(IMPORT_DIR, "state");
const MIN_PDF_BYTES = 50 * 1024;

const source = process.argv.find((a) => a.startsWith("--source="))?.split("=")[1];
if (!["islamhouse", "archive-org", "waqfeya"].includes(source)) {
  console.error("Usage: node scripts/import/03-download.mjs --source=islamhouse|archive-org");
  process.exit(1);
}

const approvedPath = join(STATE, `approved-${source}.json`);
if (!existsSync(approvedPath)) {
  console.error(`Missing ${approvedPath} â€” run 02-apply-approvals.mjs first.`);
  process.exit(1);
}
const { records } = JSON.parse(readFileSync(approvedPath, "utf8"));

const STAGING = join(homedir(), "ilm-import-staging", source);
mkdirSync(STAGING, { recursive: true });

const manifestPath = join(STATE, `download-manifest-${source}.json`);
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};
const saveManifest = () => writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

function readMagic(path, n = 8) {
  const fd = openSync(path, "r");
  try {
    const buf = Buffer.alloc(n);
    const read = readSync(fd, buf, 0, n, 0);
    return buf.subarray(0, read);
  } finally {
    closeSync(fd);
  }
}

const isPdf = (magic) => magic.subarray(0, 5).toString("latin1").startsWith("%PDF");
const isJpeg = (magic) => magic[0] === 0xff && magic[1] === 0xd8 && magic[2] === 0xff;
const isPng = (magic) =>
  magic[0] === 0x89 && magic[1] === 0x50 && magic[2] === 0x4e && magic[3] === 0x47;

/** Stream a URL to disk; returns { sha256, bytes }. 3 attempts with backoff. */
async function download(url, destPath) {
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    if (attempt > 1) await sleep(2000 * attempt);
    try {
      const res = await fetch(url, {
        headers: { "user-agent": USER_AGENT },
        redirect: "follow",
        signal: AbortSignal.timeout(15 * 60 * 1000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const hash = createHash("sha256");
      let bytes = 0;
      const tee = new Transform({
        transform(chunk, _enc, cb) {
          hash.update(chunk);
          bytes += chunk.length;
          cb(null, chunk);
        },
      });
      await pipeline(Readable.fromWeb(res.body), tee, createWriteStream(destPath));
      return { sha256: hash.digest("hex"), bytes };
    } catch (e) {
      lastErr = e;
      if (existsSync(destPath)) unlinkSync(destPath);
    }
  }
  throw lastErr;
}

let ok = 0;
let skipped = 0;
let failed = 0;
let coversOk = 0;
let coversFailed = 0;

for (const [i, rec] of records.entries()) {
  const entry = (manifest[rec.slug] ??= {});
  const pdfPath = join(STAGING, `${rec.slug}.pdf`);
  const coverPath = join(STAGING, `${rec.slug}.jpg`);
  const label = `[${i + 1}/${records.length}] ${rec.slug}`;

  // --- PDF ---
  const alreadyOk =
    entry.pdf?.ok && existsSync(pdfPath) && statSync(pdfPath).size === entry.pdf.bytes;
  if (alreadyOk) {
    skipped++;
  } else {
    try {
      await sleep(1000 + Math.floor(Math.random() * 1000));
      const { sha256, bytes } = await download(rec.pdf_url, pdfPath);
      const magic = readMagic(pdfPath);
      if (!isPdf(magic)) throw new Error("not a PDF (bad magic bytes)");
      if (bytes < MIN_PDF_BYTES) throw new Error(`too small (${bytes} bytes < 50KB)`);
      entry.pdf = { ok: true, path: pdfPath, sha256, bytes, url: rec.pdf_url };
      delete entry.pdf_error;
      ok++;
      console.log(`${label} pdf ok (${(bytes / 1048576).toFixed(1)} MB)`);
    } catch (e) {
      entry.pdf = { ok: false };
      entry.pdf_error = String(e.message ?? e).slice(0, 300);
      if (existsSync(pdfPath)) unlinkSync(pdfPath);
      failed++;
      console.warn(`${label} pdf FAILED: ${entry.pdf_error}`);
    }
    saveManifest();
  }

  // --- cover (best effort) ---
  if (rec.cover_url && entry.pdf?.ok) {
    const coverDone = entry.cover?.ok && existsSync(coverPath);
    if (!coverDone && !entry.cover_error) {
      try {
        await sleep(1000 + Math.floor(Math.random() * 1000));
        const { sha256, bytes } = await download(rec.cover_url, coverPath);
        const magic = readMagic(coverPath);
        if (!isJpeg(magic) && !isPng(magic)) throw new Error("not JPEG/PNG (bad magic bytes)");
        if (bytes < 500) throw new Error(`too small (${bytes} bytes)`);
        entry.cover = { ok: true, path: coverPath, sha256, bytes, url: rec.cover_url, format: isPng(magic) ? "png" : "jpeg" };
        coversOk++;
      } catch (e) {
        entry.cover = { ok: false };
        entry.cover_error = String(e.message ?? e).slice(0, 300);
        if (existsSync(coverPath)) unlinkSync(coverPath);
        coversFailed++;
        console.warn(`${label} cover failed: ${entry.cover_error}`);
      }
      saveManifest();
    }
  }
}

saveManifest();
console.log(`\nDone. PDFs: ${ok} downloaded, ${skipped} already present, ${failed} failed.`);
console.log(`Covers: ${coversOk} downloaded, ${coversFailed} failed.`);
console.log(`Staging dir: ${STAGING}`);
console.log(`Manifest: ${manifestPath}`);
console.log(`Next: node scripts/import/04-process.mjs --source=${source}`);
if (failed) process.exitCode = 1;
