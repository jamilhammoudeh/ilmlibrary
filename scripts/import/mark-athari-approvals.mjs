/**
 * Approve review-flagged rows by famous Athari authors (user rule 2026-07-22:
 * "if it's by famous scholars known to be Athari then the books are fine").
 * Ash'ari-influenced authors stay excluded.
 * Usage: node scripts/import/mark-athari-approvals.mjs --source=X
 */
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { parseCsvFile, writeCsv } from "./lib/report.mjs";

const IMPORT_DIR = dirname(fileURLToPath(import.meta.url));
const source = process.argv.find((a) => a.startsWith("--source="))?.split("=")[1];
if (!source) process.exit(1);

const NOT_ATHARI = new Set([
  "al-Nawawi",
  "Ibn Hajar al-Asqalani",
  "al-Suyuti",
  "al-Qurtubi",
  "Ibn al-Jawzi",
]);

const csvPath = join(IMPORT_DIR, `REVIEW-${source}.csv`);
const rows = parseCsvFile(csvPath);
let marked = 0;
for (const row of rows) {
  if (
    (row.flag ?? "").trim() === "review" &&
    !(row.approve ?? "").trim() &&
    !NOT_ATHARI.has((row.author_en ?? "").trim())
  ) {
    row.approve = "x";
    marked++;
  }
}
writeCsv(csvPath, Object.keys(rows[0]), rows);
console.log(`Approved ${marked} review-flagged Athari-author rows in ${csvPath}`);
