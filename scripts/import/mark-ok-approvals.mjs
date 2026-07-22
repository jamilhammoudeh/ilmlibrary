/**
 * Bulk-approve every clean row: sets approve=x on all rows whose flag is "ok"
 * in REVIEW-<source>.csv (flagged/review/dupe rows are left untouched for a
 * human decision). Rewrites the CSV in place with the same columns.
 *
 * Usage: node scripts/import/mark-ok-approvals.mjs --source=islamhouse
 */
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { parseCsvFile, writeCsv } from "./lib/report.mjs";

const IMPORT_DIR = dirname(fileURLToPath(import.meta.url));
const source = process.argv.find((a) => a.startsWith("--source="))?.split("=")[1];
if (!source) {
  console.error("Usage: node scripts/import/mark-ok-approvals.mjs --source=X");
  process.exit(1);
}

const csvPath = join(IMPORT_DIR, `REVIEW-${source}.csv`);
const rows = parseCsvFile(csvPath);
if (rows.length === 0) {
  console.error("Empty CSV");
  process.exit(1);
}

let marked = 0;
for (const row of rows) {
  if ((row.flag ?? "").trim() === "ok" && !(row.approve ?? "").trim()) {
    row.approve = "x";
    marked++;
  }
}

const headers = Object.keys(rows[0]);
writeCsv(csvPath, headers, rows);
console.log(`Marked approve=x on ${marked} ok rows (of ${rows.length} total) in ${csvPath}`);
