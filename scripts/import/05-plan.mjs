/**
 * Stage 05 â€” Dry-run import plan. NO side effects (only writes the report).
 *
 * Reads state/processed-<source>.json and writes
 * scripts/import/IMPORT-REPORT-<source>.md with: counts per category, total
 * upload GB, missing covers, missing transliterations, and a sample of 10
 * records with all fields.
 *
 * Usage: node scripts/import/05-plan.mjs --source=X
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { writeMarkdown } from "./lib/report.mjs";

const IMPORT_DIR = dirname(fileURLToPath(import.meta.url));
const STATE = join(IMPORT_DIR, "state");

const source = process.argv.find((a) => a.startsWith("--source="))?.split("=")[1];
if (!["islamhouse", "archive-org", "waqfeya"].includes(source)) {
  console.error("Usage: node scripts/import/05-plan.mjs --source=islamhouse|archive-org");
  process.exit(1);
}

const processedPath = join(STATE, `processed-${source}.json`);
if (!existsSync(processedPath)) {
  console.error(`Missing ${processedPath} â€” run 04-process.mjs first.`);
  process.exit(1);
}
const { records } = JSON.parse(readFileSync(processedPath, "utf8"));
const importable = records.filter((r) => !r.excluded);

const byCategory = new Map();
let totalBytes = 0;
for (const r of importable) {
  byCategory.set(r.category_slug, (byCategory.get(r.category_slug) ?? 0) + 1);
  totalBytes += r.pdf_bytes ?? 0;
}
const missingCovers = importable.filter((r) => !r.local_cover);
const missingTranslit = importable.filter((r) => !r.title_translit || !r.title_translit.trim());
const missingPages = importable.filter((r) => r.pages == null);

const lines = [];
lines.push(`# Import plan â€” ${source}`);
lines.push("");
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push("");
lines.push(`- Importable records: **${importable.length}** (${records.length} processed, ${records.length - importable.length} excluded as duplicates)`);
lines.push(`- Total upload size: **${(totalBytes / 1073741824).toFixed(2)} GB**`);
lines.push(`- Missing covers: ${missingCovers.length}`);
lines.push(`- Missing transliteration: ${missingTranslit.length}`);
lines.push(`- Missing page counts: ${missingPages.length}`);
lines.push("");
lines.push(`## Counts per category`);
lines.push("");
lines.push(`| category_slug | books |`);
lines.push(`|---|---|`);
for (const [slug, n] of [...byCategory.entries()].sort((a, b) => b[1] - a[1])) {
  lines.push(`| ${slug} | ${n} |`);
}
lines.push("");
if (missingCovers.length) {
  lines.push(`## Missing covers`);
  lines.push("");
  for (const r of missingCovers) lines.push(`- ${r.slug} â€” ${r.title_ar}`);
  lines.push("");
}
if (missingTranslit.length) {
  lines.push(`## Missing transliteration`);
  lines.push("");
  for (const r of missingTranslit) lines.push(`- ${r.slug} â€” ${r.title_ar}`);
  lines.push("");
}
lines.push(`## Sample records (${Math.min(10, importable.length)})`);
lines.push("");
for (const r of importable.slice(0, 10)) {
  lines.push("```json");
  lines.push(JSON.stringify(r, null, 2));
  lines.push("```");
  lines.push("");
}

const outPath = join(IMPORT_DIR, `IMPORT-REPORT-${source}.md`);
writeMarkdown(outPath, lines.join("\n"));

console.log(`Importable: ${importable.length} records, ${(totalBytes / 1073741824).toFixed(2)} GB.`);
console.log(`Missing covers: ${missingCovers.length}; missing translit: ${missingTranslit.length}; missing pages: ${missingPages.length}.`);
console.log(`Wrote ${outPath}`);
console.log(`Next: node scripts/import/06-commit.mjs --source=${source} --dry-run   (then without --dry-run)`);
