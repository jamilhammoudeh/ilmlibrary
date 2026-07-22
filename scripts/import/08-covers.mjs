/**
 * Stage 08 — Generate covers for imported books that have none.
 *
 * Renders page 1 of each book's PDF (the title page — effectively the cover
 * for these editions) with poppler's pdftoppm, uploads to R2 at
 * covers/arabic/<slug>.jpg, and updates books.cover_url in remote D1.
 *
 * Resume-safe via state/covers-<source>.json.
 *
 * Usage: node scripts/import/08-covers.mjs --source=islamhouse
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";
import { run, d1Query, r2Put } from "./lib/wrangler.mjs";

const IMPORT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(IMPORT_DIR, "..", "..");
const STATE = join(IMPORT_DIR, "state");

const source = process.argv.find((a) => a.startsWith("--source="))?.split("=")[1];
if (!source) {
  console.error("Usage: node scripts/import/08-covers.mjs --source=X");
  process.exit(1);
}

const PDFTOPPM = join(ROOT, "tools", "poppler", "poppler-26.02.0", "Library", "bin", "pdftoppm.exe");
if (!existsSync(PDFTOPPM)) {
  console.error(`pdftoppm not found at ${PDFTOPPM}`);
  process.exit(1);
}

const committedPath = join(STATE, `committed-${source}.json`);
if (!existsSync(committedPath)) {
  console.error(`Missing ${committedPath} — run 06-commit first.`);
  process.exit(1);
}
const committed = JSON.parse(readFileSync(committedPath, "utf8"));

const statePath = join(STATE, `covers-${source}.json`);
const done = existsSync(statePath) ? new Set(JSON.parse(readFileSync(statePath, "utf8"))) : new Set();
const saveState = () => writeFileSync(statePath, JSON.stringify([...done]));

// Which books still lack covers (per live DB)?
const rows = await d1Query(`SELECT slug FROM books WHERE source = '${source}' AND cover_url IS NULL`);
const needCovers = rows.map((r) => r.slug).filter((s) => !done.has(s));
console.log(`Books missing covers: ${rows.length} (of which ${needCovers.length} not yet processed)`);

const stagingDir = join("C:", "Users", "jhamm", "ilm-import-staging", source);
const outDir = join(STATE, "covers");
mkdirSync(outDir, { recursive: true });

const FILES_BASE = "https://files.ilmlibrary.org";
const updates = []; // {slug, url}
let rendered = 0;
let failed = 0;
const failures = [];

for (const slug of needCovers) {
  const pdf = join(stagingDir, `${slug}.pdf`);
  if (!existsSync(pdf)) {
    failed++;
    failures.push({ slug, error: "local pdf missing" });
    continue;
  }
  const outPrefix = join(outDir, slug);
  const jpg = `${outPrefix}.jpg`;
  try {
    if (!existsSync(jpg)) {
      const res = spawnSync(
        PDFTOPPM,
        ["-jpeg", "-f", "1", "-l", "1", "-scale-to", "900", "-singlefile", "-jpegopt", "quality=82", pdf, outPrefix],
        { timeout: 120_000 }
      );
      if (res.status !== 0 || !existsSync(jpg)) {
        throw new Error(`pdftoppm exit ${res.status}: ${String(res.stderr).slice(-200)}`);
      }
    }
    if (statSync(jpg).size < 2000) throw new Error("rendered cover suspiciously small");
    const key = `covers/arabic/${slug}.jpg`;
    await r2Put(key, jpg, "image/jpeg");
    updates.push({ slug, url: `${FILES_BASE}/${key}` });
    done.add(slug);
    rendered++;
    if (rendered % 20 === 0) {
      saveState();
      console.log(`  ${rendered}/${needCovers.length} covers uploaded...`);
    }
  } catch (e) {
    failed++;
    failures.push({ slug, error: String(e.message ?? e).slice(0, 200) });
  }
}
saveState();

// Batch the cover_url updates into a SQL file (bytes-capped statements).
if (updates.length) {
  const stmts = updates.map(
    (u) => `UPDATE books SET cover_url = '${u.url.replace(/'/g, "''")}' WHERE slug = '${u.slug.replace(/'/g, "''")}';`
  );
  const sqlPath = join(STATE, `covers-${source}.sql`);
  writeFileSync(sqlPath, stmts.join("\n") + "\n", "utf8");
  console.log(`Applying ${updates.length} cover_url updates...`);
  const r = await run(["d1", "execute", "ilmlibrary", "--remote", "--file", sqlPath]);
  if (r.code !== 0) {
    console.error("D1 update failed — covers are uploaded; re-run to retry DB updates.");
    console.error((r.stdout ?? "").slice(-300));
    process.exit(1);
  }
  // keep local dev in sync too (best-effort)
  await run(["d1", "execute", "ilmlibrary", "--local", "--file", sqlPath]).catch(() => {});
}

console.log(`\nDone. Covers: ${rendered} uploaded+linked, ${failed} failed.`);
if (failures.length) {
  writeFileSync(join(STATE, `covers-failures-${source}.json`), JSON.stringify(failures, null, 2));
  console.log(`Failures: state/covers-failures-${source}.json`);
}
console.log(`Note: committed.records=${committed.records?.length ?? "?"} for reference.`);
