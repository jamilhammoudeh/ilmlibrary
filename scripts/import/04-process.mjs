/**
 * Stage 04 — Process downloaded books:
 *  - page count via pdf-parse v2 (devDependency; v2 API is
 *    `import { PDFParse } from "pdf-parse"` -> new PDFParse({data}).getInfo()
 *    -> InfoResult.total; verified in node_modules/pdf-parse/dist)
 *  - final sha256 dedupe (identical files -> keep first, mark the rest)
 *
 * Writes state/processed-<source>.json.
 *
 * Usage: node scripts/import/04-process.mjs --source=X
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { PDFParse } from "pdf-parse";

const IMPORT_DIR = dirname(fileURLToPath(import.meta.url));
const STATE = join(IMPORT_DIR, "state");

const source = process.argv.find((a) => a.startsWith("--source="))?.split("=")[1];
if (!["islamhouse", "archive-org"].includes(source)) {
  console.error("Usage: node scripts/import/04-process.mjs --source=islamhouse|archive-org");
  process.exit(1);
}

const approvedPath = join(STATE, `approved-${source}.json`);
const manifestPath = join(STATE, `download-manifest-${source}.json`);
for (const p of [approvedPath, manifestPath]) {
  if (!existsSync(p)) {
    console.error(`Missing ${p} — run the previous stages first.`);
    process.exit(1);
  }
}
const { records } = JSON.parse(readFileSync(approvedPath, "utf8"));
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

const processed = [];
const seenSha = new Map(); // sha256 -> slug
let pagesOk = 0;
let pagesFailed = 0;
let shaDupes = 0;
let notDownloaded = 0;

for (const [i, rec] of records.entries()) {
  const entry = manifest[rec.slug];
  if (!entry?.pdf?.ok || !existsSync(entry.pdf.path)) {
    notDownloaded++;
    console.warn(`[${i + 1}/${records.length}] ${rec.slug}: no valid download — excluded`);
    continue;
  }

  // page count (best effort; pages=null on any parser failure)
  let pages = null;
  try {
    const buf = readFileSync(entry.pdf.path);
    const parser = new PDFParse({ data: new Uint8Array(buf) });
    try {
      const info = await parser.getInfo();
      pages = Number.isFinite(info?.total) ? info.total : null;
    } finally {
      await parser.destroy();
    }
    if (pages != null) pagesOk++;
    else pagesFailed++;
  } catch (e) {
    pagesFailed++;
    console.warn(`[${i + 1}/${records.length}] ${rec.slug}: pdf-parse failed (${String(e.message ?? e).slice(0, 120)}) — pages=null`);
  }

  // final sha256 dedupe
  const dupOf = seenSha.get(entry.pdf.sha256);
  const out = {
    ...rec,
    pages,
    sha256: entry.pdf.sha256,
    pdf_bytes: entry.pdf.bytes,
    local_pdf: entry.pdf.path,
    local_cover: entry.cover?.ok ? entry.cover.path : null,
    cover_format: entry.cover?.ok ? entry.cover.format : null,
    excluded: false,
  };
  if (dupOf) {
    out.excluded = true;
    out.duplicate_of = dupOf;
    shaDupes++;
    console.warn(`[${i + 1}/${records.length}] ${rec.slug}: identical sha256 to ${dupOf} — excluded`);
  } else {
    seenSha.set(entry.pdf.sha256, rec.slug);
  }
  processed.push(out);
  if ((i + 1) % 25 === 0) console.log(`  ${i + 1}/${records.length} processed...`);
}

const outPath = join(STATE, `processed-${source}.json`);
writeFileSync(
  outPath,
  JSON.stringify({ source, processed_at: new Date().toISOString(), records: processed }, null, 2)
);

const importable = processed.filter((r) => !r.excluded);
console.log(`\nDone. ${importable.length} importable records (${processed.length} processed).`);
console.log(`Pages: ${pagesOk} counted, ${pagesFailed} failed (pages=null).`);
console.log(`Excluded: ${shaDupes} sha256 duplicates, ${notDownloaded} missing downloads.`);
console.log(`Wrote ${outPath}`);
console.log(`Next: node scripts/import/05-plan.mjs --source=${source}`);
