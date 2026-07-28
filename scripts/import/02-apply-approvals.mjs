/**
 * Stage 02 — Apply human approvals from the REVIEW CSV.
 *
 * Reads scripts/import/REVIEW-<source>.csv back (the reviewer marks the
 * `approve` column with x/yes/1 and may edit `title_translit` and
 * `category_slug`), joins rows to state/candidates-<source>.json by
 * source_url, and writes state/approved-<source>.json.
 *
 * Rows flagged `blocklist` are refused unless BOTH approve is set AND
 * --allow-flagged is passed (the whole run aborts so nothing partial is written).
 *
 * Usage: node scripts/import/02-apply-approvals.mjs --source=X [--allow-flagged]
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { slugify, ensureUniqueSlug } from "./lib/normalize.mjs";
import { parseCsvFile } from "./lib/report.mjs";

const IMPORT_DIR = dirname(fileURLToPath(import.meta.url));
const STATE = join(IMPORT_DIR, "state");

const source = process.argv.find((a) => a.startsWith("--source="))?.split("=")[1];
const allowFlagged = process.argv.includes("--allow-flagged");
if (!["islamhouse", "archive-org", "waqfeya"].includes(source)) {
  console.error("Usage: node scripts/import/02-apply-approvals.mjs --source=islamhouse|archive-org [--allow-flagged]");
  process.exit(1);
}

const candidatesPath = join(STATE, `candidates-${source}.json`);
const csvPath = join(IMPORT_DIR, `REVIEW-${source}.csv`);
for (const p of [candidatesPath, csvPath]) {
  if (!existsSync(p)) {
    console.error(`Missing ${p} — run 01-build-candidates.mjs first.`);
    process.exit(1);
  }
}

const candidatesFile = JSON.parse(readFileSync(candidatesPath, "utf8"));
const bySourceUrl = new Map(candidatesFile.candidates.map((c) => [c.source_url, c]));
const validCategories = new Set(
  JSON.parse(readFileSync(join(IMPORT_DIR, "seeds", "category-map.json"), "utf8")).site_categories
);

const rows = parseCsvFile(csvPath);
const APPROVE = new Set(["x", "yes", "y", "1", "true"]);

const approved = [];
const errors = [];
const refusedBlocklist = [];

// slug uniqueness: existing DB slugs + every candidate slug (rows whose
// translit was edited get a freshly-derived slug checked against all of them)
const usedSlugs = new Set([
  ...(candidatesFile.existing_slugs ?? []),
  ...candidatesFile.candidates.map((c) => c.slug),
]);

for (const [i, row] of rows.entries()) {
  const line = i + 2; // header is line 1
  if (!APPROVE.has((row.approve ?? "").trim().toLowerCase())) continue;

  const cand = bySourceUrl.get((row.source_url ?? "").trim());
  if (!cand) {
    errors.push(`line ${line}: no candidate found for source_url "${row.source_url}"`);
    continue;
  }
  if (cand.flag === "blocklist" && !allowFlagged) {
    refusedBlocklist.push(`line ${line}: "${cand.title_ar}" (${cand.flag_reasons.join("; ")})`);
    continue;
  }

  const rec = { ...cand };

  // honor edited transliteration -> re-derive slug
  const editedTranslit = (row.title_translit ?? "").trim();
  if (editedTranslit && editedTranslit !== cand.title_translit) {
    rec.title_translit = editedTranslit;
    rec.slug = ensureUniqueSlug(slugify(editedTranslit) || rec.slug, usedSlugs);
  }

  // honor edited category
  const editedCat = (row.category_slug ?? "").trim();
  if (editedCat && editedCat !== cand.category_slug) {
    if (!validCategories.has(editedCat)) {
      errors.push(`line ${line}: invalid category_slug "${editedCat}" — valid: ${[...validCategories].join(", ")}`);
      continue;
    }
    rec.category_slug = editedCat;
  }

  rec.approved_at = new Date().toISOString();
  approved.push(rec);
}

if (refusedBlocklist.length) {
  console.error(`REFUSED: ${refusedBlocklist.length} approved row(s) are flagged "blocklist".`);
  console.error("Re-run with --allow-flagged if these approvals are deliberate:\n");
  for (const r of refusedBlocklist) console.error("  " + r);
  process.exit(1);
}
if (errors.length) {
  console.error(`ERRORS (nothing written):`);
  for (const e of errors) console.error("  " + e);
  process.exit(1);
}
if (!approved.length) {
  console.error("No rows approved — mark the approve column with x/yes/1 in " + csvPath);
  process.exit(1);
}

const outPath = join(STATE, `approved-${source}.json`);
writeFileSync(
  outPath,
  JSON.stringify(
    { source, approved_at: new Date().toISOString(), allow_flagged: allowFlagged, records: approved },
    null,
    2
  )
);

const totalBytes = approved.reduce((s, r) => s + (r.size_bytes ?? 0), 0);
console.log(`Approved ${approved.length}/${rows.length} rows (${(totalBytes / 1073741824).toFixed(2)} GB).`);
console.log(`Wrote ${outPath}`);
console.log(`Next: node scripts/import/03-download.mjs --source=${source}`);
