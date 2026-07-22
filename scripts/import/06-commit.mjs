/**
 * Stage 06 — Commit: upload PDFs/covers to R2, then INSERT rows into D1.
 *
 * Idempotent + resume-safe:
 *  - slugs already in the live DB are skipped
 *  - uploads/inserts are tracked in state/committed-<source>.json
 *
 * SQL goes through a generated file (state/commit-<source>.sql) executed with
 * `wrangler d1 execute --remote --file`, batched multi-row VALUES with each
 * INSERT statement kept under 90KB (D1 caps statements at 100KB).
 *
 * books.id is TEXT PRIMARY KEY (UUIDs from the Supabase migration) -> ids are
 * generated with crypto.randomUUID(). created_at uses the column default.
 * display_order appends per category (max per category queried first).
 *
 * R2 keys: books/arabic/<slug>.pdf and covers/arabic/<slug>.jpg
 * Public URL base: https://files.ilmlibrary.org/<key>
 *
 * Usage: node scripts/import/06-commit.mjs --source=X [--dry-run]
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import { d1Query, d1ExecuteFile, r2Put } from "./lib/wrangler.mjs";

const IMPORT_DIR = dirname(fileURLToPath(import.meta.url));
const STATE = join(IMPORT_DIR, "state");
const FILE_BASE = "https://files.ilmlibrary.org";
const MAX_STATEMENT_CHARS = 90_000; // D1 caps statements at 100KB
const INSERT_COLUMNS = [
  "id", "title", "slug", "author", "translator", "description", "cover_url",
  "pdf_url", "category_id", "display_order", "language", "source",
  "source_url", "title_alt", "pages", "published_year",
];

const source = process.argv.find((a) => a.startsWith("--source="))?.split("=")[1];
const dryRun = process.argv.includes("--dry-run");
if (!["islamhouse", "archive-org"].includes(source)) {
  console.error("Usage: node scripts/import/06-commit.mjs --source=islamhouse|archive-org [--dry-run]");
  process.exit(1);
}

const processedPath = join(STATE, `processed-${source}.json`);
if (!existsSync(processedPath)) {
  console.error(`Missing ${processedPath} — run 04-process.mjs first.`);
  process.exit(1);
}
const { records } = JSON.parse(readFileSync(processedPath, "utf8"));

const committedPath = join(STATE, `committed-${source}.json`);
const committed = existsSync(committedPath) ? JSON.parse(readFileSync(committedPath, "utf8")) : {};
const saveCommitted = () => writeFileSync(committedPath, JSON.stringify(committed, null, 2));

// --- live DB state ----------------------------------------------------------

console.log("Querying live D1 (existing slugs, categories, display_order)...");
const dbSlugs = new Set((await d1Query("SELECT slug FROM books")).map((r) => r.slug));

let catRows;
try {
  catRows = await d1Query("SELECT id, slug, content_type FROM categories");
} catch {
  catRows = await d1Query("SELECT id, slug FROM categories");
}
const categoryIdBySlug = new Map();
for (const r of catRows) {
  // prefer book categories when slugs collide across content types
  if (!categoryIdBySlug.has(r.slug) || r.content_type === "book") {
    categoryIdBySlug.set(r.slug, r.id);
  }
}

const orderRows = await d1Query(
  "SELECT category_id, MAX(display_order) AS max_order FROM books GROUP BY category_id"
);
const nextOrder = new Map(); // category_id -> next display_order
for (const r of orderRows) {
  if (r.category_id != null) nextOrder.set(r.category_id, (r.max_order ?? 0) + 1);
}
const takeOrder = (categoryId) => {
  const n = nextOrder.get(categoryId) ?? 1;
  nextOrder.set(categoryId, n + 1);
  return n;
};

// --- plan -------------------------------------------------------------------

const todo = [];
let skippedInDb = 0;
let skippedInserted = 0;
const missingCategories = new Set();

for (const rec of records) {
  if (rec.excluded) continue;
  const state = (committed[rec.slug] ??= {});
  if (state.inserted) {
    skippedInserted++;
    continue;
  }
  if (dbSlugs.has(rec.slug)) {
    state.inserted = true; // idempotent: already in DB
    skippedInDb++;
    continue;
  }
  if (!categoryIdBySlug.has(rec.category_slug)) {
    missingCategories.add(rec.category_slug);
    continue;
  }
  todo.push(rec);
}
saveCommitted();

if (missingCategories.size) {
  console.error(`ABORT: category slug(s) not found in the live categories table: ${[...missingCategories].join(", ")}`);
  console.error("Create them (or fix category_slug in the review CSV) and re-run.");
  process.exit(1);
}

console.log(`To commit: ${todo.length} (skipped: ${skippedInDb} already in DB, ${skippedInserted} previously inserted).`);
if (!todo.length) {
  console.log("Nothing to do.");
  process.exit(0);
}
if (dryRun) console.log("DRY RUN — no uploads, no inserts; SQL file will still be written.\n");

// --- upload + build SQL -----------------------------------------------------

const esc = (v) => {
  if (v == null) return "NULL";
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "NULL";
  // fold control chars/newlines to spaces, escape single quotes
  const clean = String(v)
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return `'${clean.replace(/'/g, "''")}'`;
};

const rowsForSql = [];
let uploadFailed = 0;

for (const [i, rec] of todo.entries()) {
  const state = committed[rec.slug];
  const pdfKey = `books/arabic/${rec.slug}.pdf`;
  const coverKey = `covers/arabic/${rec.slug}.jpg`;
  const hasCover = !!rec.local_cover && existsSync(rec.local_cover);
  const label = `[${i + 1}/${todo.length}] ${rec.slug}`;

  if (!dryRun) {
    try {
      if (!state.pdf_uploaded) {
        await r2Put(pdfKey, rec.local_pdf, "application/pdf");
        state.pdf_uploaded = true;
        saveCommitted();
      }
      if (hasCover && !state.cover_uploaded) {
        await r2Put(coverKey, rec.local_cover, rec.cover_format === "png" ? "image/png" : "image/jpeg");
        state.cover_uploaded = true;
        saveCommitted();
      }
      console.log(`${label} uploaded${hasCover ? " (+cover)" : ""}`);
    } catch (e) {
      uploadFailed++;
      console.warn(`${label} upload FAILED — row excluded from insert: ${String(e.message ?? e).slice(0, 200)}`);
      continue;
    }
  }

  const categoryId = categoryIdBySlug.get(rec.category_slug);
  rowsForSql.push({
    slug: rec.slug,
    values: `(${[
      esc(randomUUID()),
      esc(rec.title_ar),
      esc(rec.slug),
      esc(rec.author_en),
      esc(rec.translator),
      esc(rec.description),
      esc((hasCover || state.cover_uploaded) ? `${FILE_BASE}/${coverKey}` : null),
      esc(`${FILE_BASE}/${pdfKey}`),
      esc(categoryId),
      esc(takeOrder(categoryId)),
      esc("ar"),
      esc(source),
      esc(rec.source_url),
      esc(rec.title_translit),
      esc(rec.pages),
      esc(rec.year),
    ].join(", ")})`,
  });
}

// batch INSERTs, each statement under MAX_STATEMENT_CHARS
const head = `INSERT INTO books (${INSERT_COLUMNS.join(", ")}) VALUES\n`;
const statements = [];
let currentRows = [];
let currentLen = head.length;
for (const row of rowsForSql) {
  if (currentRows.length && currentLen + row.values.length + 2 > MAX_STATEMENT_CHARS) {
    statements.push(head + currentRows.join(",\n") + ";");
    currentRows = [];
    currentLen = head.length;
  }
  currentRows.push(row.values);
  currentLen += row.values.length + 2;
}
if (currentRows.length) statements.push(head + currentRows.join(",\n") + ";");

const sqlPath = join(STATE, `commit-${source}.sql`);
writeFileSync(sqlPath, statements.join("\n\n") + "\n", "utf8");
console.log(`\nWrote ${sqlPath} (${rowsForSql.length} rows, ${statements.length} statement(s)).`);

// --- execute ----------------------------------------------------------------

if (dryRun) {
  console.log("DRY RUN complete — nothing uploaded or inserted.");
  process.exit(0);
}

if (!rowsForSql.length) {
  console.error("No rows survived upload — nothing to insert.");
  process.exit(1);
}

console.log("Executing INSERTs against remote D1...");
try {
  await d1ExecuteFile(sqlPath);
  for (const row of rowsForSql) {
    committed[row.slug].inserted = true;
  }
  saveCommitted();
  console.log(`Inserted ${rowsForSql.length} rows.`);
} catch (e) {
  console.error(`INSERT failed — rows NOT marked committed (uploads are kept and will be skipped on re-run):`);
  console.error(String(e.message ?? e).slice(0, 800));
  process.exit(1);
}

console.log(`Done. Committed state: ${committedPath}`);
if (uploadFailed) console.warn(`${uploadFailed} upload failure(s) — re-run to retry those rows.`);
console.log(`Next: node scripts/import/07-verify.mjs --source=${source}`);
