/**
 * Stage 07 — Verify committed files and DB rows.
 *
 * HEADs https://files.ilmlibrary.org/<key> for every committed PDF/cover and
 * counts D1 rows for the source. NOTE: the public URLs will 404 until the R2
 * custom domain is attached at cutover — when ALL checks fail, a warning
 * header calls that out as the likely cause.
 *
 * Writes scripts/import/VERIFY-<source>.md.
 *
 * Usage: node scripts/import/07-verify.mjs --source=X
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { d1Query } from "./lib/wrangler.mjs";
import { writeMarkdown } from "./lib/report.mjs";
import { sleep, USER_AGENT } from "./lib/http.mjs";

const IMPORT_DIR = dirname(fileURLToPath(import.meta.url));
const STATE = join(IMPORT_DIR, "state");
const FILE_BASE = "https://files.ilmlibrary.org";

const source = process.argv.find((a) => a.startsWith("--source="))?.split("=")[1];
if (!["islamhouse", "archive-org"].includes(source)) {
  console.error("Usage: node scripts/import/07-verify.mjs --source=islamhouse|archive-org");
  process.exit(1);
}

const committedPath = join(STATE, `committed-${source}.json`);
if (!existsSync(committedPath)) {
  console.error(`Missing ${committedPath} — run 06-commit.mjs first.`);
  process.exit(1);
}
const committed = JSON.parse(readFileSync(committedPath, "utf8"));

const checks = [];
for (const [slug, state] of Object.entries(committed)) {
  if (state.pdf_uploaded || state.inserted) {
    checks.push({ slug, kind: "pdf", url: `${FILE_BASE}/books/arabic/${slug}.pdf` });
  }
  if (state.cover_uploaded) {
    checks.push({ slug, kind: "cover", url: `${FILE_BASE}/covers/arabic/${slug}.jpg` });
  }
}

console.log(`HEAD-checking ${checks.length} public file URLs...`);
let okCount = 0;
const failures = [];
for (const [i, c] of checks.entries()) {
  try {
    const res = await fetch(c.url, {
      method: "HEAD",
      headers: { "user-agent": USER_AGENT },
      redirect: "follow",
      signal: AbortSignal.timeout(30000),
    });
    if (res.ok) {
      okCount++;
      c.status = res.status;
    } else {
      c.status = res.status;
      failures.push(c);
    }
  } catch (e) {
    c.status = `error: ${String(e.message ?? e).slice(0, 80)}`;
    failures.push(c);
  }
  if ((i + 1) % 50 === 0) console.log(`  ${i + 1}/${checks.length} checked...`);
  await sleep(200);
}

const allFailed = checks.length > 0 && okCount === 0;

// DB count check
let dbCount = null;
let insertedCount = Object.values(committed).filter((s) => s.inserted).length;
let dbError = null;
try {
  const rows = await d1Query(`SELECT COUNT(*) AS n FROM books WHERE source='${source}'`);
  dbCount = rows[0]?.n ?? null;
} catch (e) {
  dbError = String(e.message ?? e).slice(0, 300);
}

// report
const lines = [];
lines.push(`# Verify report — ${source}`);
lines.push("");
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push("");
if (allFailed) {
  lines.push(`> **WARNING: ALL ${checks.length} public file checks failed.**`);
  lines.push(`> Likely cause: the R2 custom domain (files.ilmlibrary.org) is not`);
  lines.push(`> attached yet — it is only wired up at cutover. The objects are`);
  lines.push(`> probably fine in the bucket; re-run this script after cutover.`);
  lines.push("");
}
lines.push(`## Public files (HEAD ${FILE_BASE}/...)`);
lines.push("");
lines.push(`- Checked: ${checks.length}`);
lines.push(`- OK: ${okCount}`);
lines.push(`- Failed: ${failures.length}`);
lines.push("");
if (failures.length && !allFailed) {
  lines.push(`### Failures`);
  lines.push("");
  for (const f of failures) lines.push(`- [${f.status}] ${f.url}`);
  lines.push("");
}
lines.push(`## Database`);
lines.push("");
if (dbError) {
  lines.push(`- D1 count query FAILED: ${dbError}`);
} else {
  lines.push(`- books rows with source='${source}': **${dbCount}**`);
  lines.push(`- committed-state inserted count: **${insertedCount}**`);
  lines.push(dbCount === insertedCount
    ? `- MATCH`
    : `- MISMATCH — investigate (state file vs live DB)`);
}

const outPath = join(IMPORT_DIR, `VERIFY-${source}.md`);
writeMarkdown(outPath, lines.join("\n"));

if (allFailed) {
  console.warn(`\nWARNING: ALL ${checks.length} public file checks failed.`);
  console.warn("Likely cause: the R2 custom domain files.ilmlibrary.org is not attached yet (cutover pending).");
}
console.log(`\nFiles: ${okCount}/${checks.length} OK.`);
console.log(dbError
  ? `DB check failed: ${dbError}`
  : `DB rows for source='${source}': ${dbCount} (state says ${insertedCount}).`);
console.log(`Wrote ${outPath}`);
