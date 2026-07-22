/**
 * Stage 01 — Build candidate lists for the Arabic-book import. METADATA ONLY,
 * no PDF downloads.
 *
 * Sources (verified by live probe, 2026-07-21):
 *
 *  archive-org:
 *    - search: https://archive.org/advancedsearch.php?q=creator:("<name_ar>")
 *        AND mediatype:texts AND format:("Text PDF")&fl[]=...&rows=200&output=json
 *      (one query per whitelisted author name + each Arabic alias)
 *    - per identifier: https://archive.org/metadata/<identifier>
 *      -> pick the main PDF (largest .pdf, skip *_text.pdf derivatives, prefer
 *         source:"original" — note derivatives can be LARGER than originals)
 *    - cover: https://archive.org/services/img/<identifier>
 *
 *  islamhouse (official JSON API, public v3 key path):
 *    - category items: https://api.islamhouse.com/v3/paV29H2gm56kvLPy/main/
 *        get-category-items/{catId}/{type|showall}/{uiLang}/{dataLang}/{page}/{perPage}/json
 *      -> paged {links:{pages_number,total_items}, data:[{id,title,type,prepared_by,...}]}
 *    - author items: .../main/get-author-items/{authorId}/{type}/{ui}/{data}/{page}/{per}/json
 *    - item detail:  .../main/get-item/{id}/{lang}/json
 *      -> {title, description, prepared_by:[{id,title,kind}], attachments:[{url,size,extension_type}], image}
 *    - the category tree (ids+names) is scraped once from
 *      https://islamhouse.com/ar/category/397053/showall/showall/1 ("التصانيف العلمية")
 *      because no category-listing API endpoint could be found.
 *    Enumeration: walk tree categories (type=books, data lang ar), match
 *    prepared_by authors against the whitelist; every whitelisted IslamHouse
 *    author id discovered is then swept via get-author-items for full coverage.
 *
 * Rate limit: 1 req/sec. Retry 3x with backoff. Raw responses cached under
 * scripts/import/state/cache/<source>/ (resume-safe: re-runs are cheap).
 *
 * Output:
 *   scripts/import/state/candidates-<source>.json
 *   scripts/import/REVIEW-<source>.csv
 *
 * Usage: node scripts/import/01-build-candidates.mjs --source=islamhouse|archive-org
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import {
  normalizeArabic, dedupeKey, titleDedupeKey, containsToken,
  translit, slugify, ensureUniqueSlug,
} from "./lib/normalize.mjs";
import { d1Query } from "./lib/wrangler.mjs";
import { writeCsv } from "./lib/report.mjs";
import { makeFetcher } from "./lib/http.mjs";

const IMPORT_DIR = dirname(fileURLToPath(import.meta.url));
const SEEDS = join(IMPORT_DIR, "seeds");
const STATE = join(IMPORT_DIR, "state");
const CAP = 400; // pilot-round cap per source

const source = process.argv.find((a) => a.startsWith("--source="))?.split("=")[1];
if (!["islamhouse", "archive-org"].includes(source)) {
  console.error("Usage: node scripts/import/01-build-candidates.mjs --source=islamhouse|archive-org");
  process.exit(1);
}

mkdirSync(join(STATE, "cache", source), { recursive: true });
const fetcher = makeFetcher({ cacheDir: join(STATE, "cache", source), minIntervalMs: 1000 });

// --- seeds ------------------------------------------------------------------

const whitelist = JSON.parse(readFileSync(join(SEEDS, "authors-whitelist.json"), "utf8"));
const blocklist = JSON.parse(readFileSync(join(SEEDS, "blocklist.json"), "utf8"));
const catmap = JSON.parse(readFileSync(join(SEEDS, "category-map.json"), "utf8"));

// (author, normalized-name) entries sorted longest-first so the most specific
// name wins (e.g. "عبد الله بن أحمد بن حنبل" beats "أحمد بن حنبل").
const authorEntries = [];
for (const a of whitelist.authors) {
  for (const n of [a.name_ar, ...(a.aliases_ar || [])]) {
    const key = normalizeArabic(n);
    if (key) authorEntries.push({ author: a, key });
  }
}
authorEntries.sort((x, y) => y.key.length - x.key.length);

function matchAuthor(nameStrings) {
  const norm = nameStrings.filter(Boolean).map((s) => normalizeArabic(s));
  for (const e of authorEntries) {
    if (norm.some((n) => containsToken(n, e.key))) return e.author;
  }
  return null;
}

const blockedNorm = blocklist.blocked_authors.map(normalizeArabic).filter(Boolean);
function blockedAuthorHit(nameStrings) {
  const norm = nameStrings.filter(Boolean).map((s) => normalizeArabic(s));
  return blockedNorm.find((b) => norm.some((n) => containsToken(n, b))) ?? null;
}

const flagKeywordsNorm = blocklist.flag_title_keywords.map(normalizeArabic).filter(Boolean);
function titleKeywordHits(title) {
  const norm = normalizeArabic(title);
  return flagKeywordsNorm.filter((k) => norm.includes(k));
}

// Category keywords, longest first so specific keywords ("أصول الفقه") win
// over short substrings ("حج" inside "الحجاب" etc.).
const catEntries = Object.entries(catmap.keyword_to_slug)
  .map(([k, v]) => [normalizeArabic(k.toLowerCase()), v])
  .sort((a, b) => b[0].length - a[0].length);

function mapCategory(sourceStrings, fallbackSlug) {
  for (const s of sourceStrings) {
    if (!s) continue;
    const norm = normalizeArabic(String(s).toLowerCase());
    for (const [kw, slug] of catEntries) {
      if (norm.includes(kw)) return { slug, matched_keyword: kw, matched_in: String(s).slice(0, 120) };
    }
  }
  return { slug: fallbackSlug, matched_keyword: null, matched_in: null };
}

// --- live-DB dedupe pre-check ----------------------------------------------

const dbKeys = new Set(); // dedupeKey(title|title_alt, author)
const dbTitleKeys = new Set(); // title-only keys
const existingSlugs = new Set();
let dbDedupeOk = false;
let dbDedupeError = null;

console.log("Querying live D1 for existing books (dedupe pre-check)...");
try {
  let rows;
  try {
    rows = await d1Query("SELECT title, title_alt, author, slug FROM books");
  } catch {
    rows = await d1Query("SELECT title, author, slug FROM books"); // pre-title_alt fallback
  }
  for (const r of rows) {
    if (r.slug) existingSlugs.add(r.slug);
    for (const t of [r.title, r.title_alt]) {
      if (!t) continue;
      dbKeys.add(dedupeKey(t, r.author));
      const tk = titleDedupeKey(t);
      if (tk.length >= 12) dbTitleKeys.add(tk);
    }
  }
  dbDedupeOk = true;
  console.log(`  ${rows.length} existing books loaded (${existingSlugs.size} slugs).`);
} catch (e) {
  dbDedupeError = String(e.message ?? e).slice(0, 300);
  console.warn(`  WARNING: live-DB dedupe skipped — ${dbDedupeError}`);
  console.warn("  Candidates will NOT be marked possible-dupe against the live site.");
}

// --- shared candidate assembly ---------------------------------------------

const stats = {
  itemsSeen: 0, noWhitelistAuthor: 0, noPdf: 0, detailFailed: 0, searchFailed: 0,
  capped: false,
};
const candidates = [];

function cleanText(s, max = 1500) {
  if (!s) return null;
  const out = String(s).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return out ? out.slice(0, max) : null;
}

function addCandidate(c) {
  // c: { source_id, source_url, title_ar, author (whitelist entry), author_source,
  //      translator, description, category_strings, pdf_url, cover_url,
  //      size_bytes, year, extra_reasons }
  const reasons = [...(c.extra_reasons || [])];
  const blocked = blockedAuthorHit(c.author_source);
  if (blocked) reasons.push(`blocklist author match: ${blocked}`);
  for (const kw of titleKeywordHits(c.title_ar)) reasons.push(`title keyword: ${kw}`);
  if (c.author.status === "review") {
    reasons.push(`author status=review${c.author.review_note ? `: ${c.author.review_note}` : ""}`);
  }
  const cat = mapCategory(c.category_strings || [], c.author.default_category);
  candidates.push({
    source,
    source_id: String(c.source_id),
    source_url: c.source_url,
    title_ar: c.title_ar,
    title_translit: null, // filled in finalize()
    slug: null, // filled in finalize()
    author_id: c.author.id,
    author_en: c.author.name_en,
    author_ar: c.author.name_ar,
    author_source: c.author_source.filter(Boolean).join(" | ").slice(0, 300),
    translator: c.translator ?? null,
    description: cleanText(c.description),
    category_slug: cat.slug,
    category_matched_keyword: cat.matched_keyword,
    category_matched_in: cat.matched_in,
    pdf_url: c.pdf_url,
    cover_url: c.cover_url ?? null,
    size_bytes: c.size_bytes ?? null,
    size_mb: c.size_bytes != null ? Math.round((c.size_bytes / 1048576) * 10) / 10 : null,
    year: c.year ?? null,
    language: "ar",
    dedupe_key: dedupeKey(c.title_ar, c.author.name_ar),
    blocked_hit: blocked,
    flag: null, // filled in finalize()
    flag_reasons: reasons,
  });
}

function finalize() {
  // dedupe WITHIN candidates: same normalized title+author — keep the largest PDF
  const keeper = new Map(); // dedupe_key -> candidate
  for (const c of candidates) {
    const prev = keeper.get(c.dedupe_key);
    if (!prev) {
      keeper.set(c.dedupe_key, c);
      continue;
    }
    if ((c.size_bytes ?? 0) > (prev.size_bytes ?? 0)) {
      prev.internal_dupe = true;
      prev.flag_reasons.push(`dupe-internal: superseded by larger PDF at ${c.source_url}`);
      keeper.set(c.dedupe_key, c);
    } else {
      c.internal_dupe = true;
      c.flag_reasons.push(`dupe-internal: smaller/equal PDF than ${prev.source_url}`);
    }
  }

  const slugSet = new Set(existingSlugs);
  for (const c of candidates) {
    // possible-dupe vs live DB
    if (!c.internal_dupe && dbDedupeOk) {
      const keys = [dedupeKey(c.title_ar, c.author_ar), dedupeKey(c.title_ar, c.author_en)];
      const tk = titleDedupeKey(c.title_ar);
      if (keys.some((k) => dbKeys.has(k))) {
        c.possible_dupe = true;
        c.flag_reasons.push("possible-dupe: title+author already in live DB");
      } else if (tk.length >= 12 && dbTitleKeys.has(tk)) {
        c.possible_dupe = true;
        c.flag_reasons.push("possible-dupe: normalized title already in live DB");
      }
    }
    // translit + unique slug
    c.title_translit = translit(c.title_ar);
    c.slug = ensureUniqueSlug(slugify(c.title_translit) || `book-${c.source_id}`, slugSet);
    // flag precedence — blocklist NEVER auto-excludes, it only flags for review
    c.flag = c.blocked_hit ? "blocklist"
      : c.internal_dupe ? "dupe-internal"
      : c.possible_dupe ? "possible-dupe"
      : c.flag_reasons.length ? "review"
      : "ok";
    delete c.blocked_hit;
  }
}

// --- source: archive-org ----------------------------------------------------

async function buildArchiveOrg() {
  const docs = new Map(); // identifier -> search doc
  const queries = [];
  for (const a of whitelist.authors) {
    [a.name_ar, ...(a.aliases_ar || [])].forEach((name, i) => {
      queries.push({ author: a, name, cacheName: `search-${a.id}-${i}.json` });
    });
  }
  console.log(`archive.org: running ${queries.length} creator searches...`);
  let done = 0;
  for (const q of queries) {
    const query = `creator:("${q.name}") AND mediatype:texts AND format:("Text PDF")`;
    const url =
      "https://archive.org/advancedsearch.php?q=" + encodeURIComponent(query) +
      "&fl[]=identifier&fl[]=title&fl[]=creator&fl[]=year&fl[]=language&fl[]=subject" +
      "&rows=200&output=json";
    try {
      const data = await fetcher.json(url, q.cacheName);
      for (const d of data.response?.docs ?? []) {
        if (d.identifier && !docs.has(d.identifier)) docs.set(d.identifier, d);
      }
    } catch (e) {
      stats.searchFailed++;
      console.warn(`  search failed for "${q.name}": ${String(e.message ?? e).slice(0, 120)}`);
    }
    if (++done % 25 === 0) console.log(`  ${done}/${queries.length} searches, ${docs.size} identifiers so far`);
  }
  console.log(`archive.org: ${docs.size} distinct identifiers found; fetching metadata...`);

  let processed = 0;
  for (const [identifier, doc] of docs) {
    if (candidates.length >= CAP) {
      stats.capped = true;
      break;
    }
    stats.itemsSeen++;
    const creators = [].concat(doc.creator ?? []);
    const author = matchAuthor(creators);
    if (!author) {
      stats.noWhitelistAuthor++;
      continue;
    }
    let meta;
    try {
      meta = await fetcher.json(`https://archive.org/metadata/${identifier}`, `meta-${identifier}.json`);
    } catch (e) {
      stats.detailFailed++;
      console.warn(`  metadata failed for ${identifier}: ${String(e.message ?? e).slice(0, 120)}`);
      continue;
    }
    const pdf = pickMainPdf(meta.files ?? []);
    if (!pdf) {
      stats.noPdf++;
      continue;
    }
    const title = cleanText([].concat(doc.title ?? meta.metadata?.title ?? [])[0], 300);
    if (!title) continue;
    const subjects = [].concat(doc.subject ?? []).concat([].concat(meta.metadata?.subject ?? []))
      .flatMap((s) => String(s).split(/[;,]/)).map((s) => s.trim()).filter(Boolean);
    addCandidate({
      source_id: identifier,
      source_url: `https://archive.org/details/${identifier}`,
      title_ar: title,
      author,
      author_source: creators,
      translator: null,
      description: meta.metadata?.description
        ? [].concat(meta.metadata.description).join(" ")
        : null,
      category_strings: subjects,
      pdf_url: `https://archive.org/download/${identifier}/` +
        encodeURIComponent(pdf.name).replace(/%2F/gi, "/"),
      cover_url: `https://archive.org/services/img/${identifier}`,
      size_bytes: pdf.size != null ? Number(pdf.size) : null,
      year: extractYear(doc.year ?? meta.metadata?.year ?? meta.metadata?.date),
    });
    if (++processed % 25 === 0) console.log(`  ${processed} candidates built...`);
  }
}

function pickMainPdf(files) {
  const pdfs = files.filter(
    (f) => f.name && /\.pdf$/i.test(f.name) && !/_text\.pdf$/i.test(f.name)
  );
  if (!pdfs.length) return null;
  const originals = pdfs.filter((f) => f.source === "original");
  const pool = originals.length ? originals : pdfs;
  return pool.sort((a, b) => Number(b.size ?? 0) - Number(a.size ?? 0))[0];
}

function extractYear(v) {
  const m = String(v ?? "").match(/\b(1[0-9]{3}|20[0-9]{2})\b/);
  return m ? Number(m[1]) : null;
}

// --- source: islamhouse -----------------------------------------------------

const IH_API = "https://api.islamhouse.com/v3/paV29H2gm56kvLPy/main";

async function* ihPagedItems(urlForPage, cachePrefix) {
  for (let page = 1; ; page++) {
    let data;
    try {
      data = await fetcher.json(urlForPage(page), `${cachePrefix}-p${page}.json`);
    } catch (e) {
      console.warn(`  page fetch failed (${cachePrefix} p${page}): ${String(e.message ?? e).slice(0, 120)}`);
      return;
    }
    if (!data || data.error || !Array.isArray(data.data)) return; // {error} or {data:{error}} shapes
    yield* data.data;
    const pages = data.links?.pages_number ?? 1;
    if (page >= Math.min(pages, 50)) return; // hard page ceiling per category
  }
}

async function buildIslamhouse() {
  // 1. category tree (scraped once — no category-listing API endpoint found)
  const treeHtml = await fetcher.text(
    "https://islamhouse.com/ar/category/397053/showall/showall/1",
    "tree.html"
  );
  const cats = [];
  const seenCat = new Set();
  const linkRe = /href=['"](?:https?:\/\/islamhouse\.com)?\/ar\/category\/(\d+)\/showall\/showall\/1\/?['"][^>]*>\s*(?:<i[^>]*>\s*<\/i>\s*)?([^<]{2,120}?)\s*</g;
  for (const m of treeHtml.matchAll(linkRe)) {
    if (!seenCat.has(m[1])) {
      seenCat.add(m[1]);
      cats.push({ id: m[1], name: m[2].trim() });
    }
  }
  if (!cats.length) throw new Error("islamhouse category tree scrape found no categories — page layout changed?");
  console.log(`islamhouse: ${cats.length} categories in the scholarly tree; walking (type=books, ar)...`);

  const matched = new Map(); // itemId -> { item, author, categoryName }
  const ihAuthors = new Map(); // islamhouse author id -> whitelist author

  // 2. walk categories
  let walked = 0;
  outer: for (const cat of cats) {
    if (matched.size >= CAP) {
      stats.capped = true;
      break;
    }
    for await (const item of ihPagedItems(
      (p) => `${IH_API}/get-category-items/${cat.id}/books/ar/ar/${p}/100/json`,
      `cat-${cat.id}`
    )) {
      if (item.type !== "books" || !item.id) continue;
      stats.itemsSeen++;
      const prepared = item.prepared_by ?? [];
      for (const p of prepared) {
        if ((p.kind ?? p.type) === "author" && p.title && p.id != null) {
          const a = matchAuthor([p.title]);
          if (a && !ihAuthors.has(String(p.id))) ihAuthors.set(String(p.id), a);
        }
      }
      const author = matchAuthor(
        prepared.filter((p) => (p.kind ?? p.type) === "author").map((p) => p.title)
      );
      if (!author) {
        stats.noWhitelistAuthor++;
        continue;
      }
      if (!matched.has(item.id)) matched.set(item.id, { item, author, categoryName: cat.name });
      if (matched.size >= CAP) {
        stats.capped = true;
        break outer;
      }
    }
    if (++walked % 25 === 0) {
      console.log(`  ${walked}/${cats.length} categories walked, ${matched.size} matched, ${ihAuthors.size} whitelist author ids found`);
    }
  }

  // 3. sweep discovered whitelist author ids for full per-author coverage
  console.log(`islamhouse: sweeping ${ihAuthors.size} discovered whitelist author ids...`);
  for (const [ihId, author] of ihAuthors) {
    if (matched.size >= CAP) {
      stats.capped = true;
      break;
    }
    for await (const item of ihPagedItems(
      (p) => `${IH_API}/get-author-items/${ihId}/books/ar/ar/${p}/100/json`,
      `author-${ihId}`
    )) {
      if (item.type !== "books" || !item.id || matched.has(item.id)) continue;
      stats.itemsSeen++;
      // verify when prepared_by is present (author pages can include reviewed works)
      const prepared = (item.prepared_by ?? []).filter((p) => (p.kind ?? p.type) === "author");
      if (prepared.length && !matchAuthor(prepared.map((p) => p.title))) continue;
      matched.set(item.id, { item, author, categoryName: null });
      if (matched.size >= CAP) {
        stats.capped = true;
        break;
      }
    }
  }

  // 4. item details -> PDF attachment, cover, description
  console.log(`islamhouse: fetching ${matched.size} item details...`);
  let processed = 0;
  for (const [id, m] of matched) {
    if (candidates.length >= CAP) {
      stats.capped = true;
      break;
    }
    let detail;
    try {
      detail = await fetcher.json(`${IH_API}/get-item/${id}/ar/json`, `item-${id}.json`);
    } catch (e) {
      stats.detailFailed++;
      console.warn(`  get-item failed for ${id}: ${String(e.message ?? e).slice(0, 120)}`);
      continue;
    }
    const atts = (detail.attachments ?? []).filter(
      (a) => a.url && ((a.extension_type ?? "").toUpperCase() === "PDF" || /\.pdf(\?|$)/i.test(a.url))
    );
    if (!atts.length) {
      stats.noPdf++;
      continue;
    }
    const sized = atts.map((a) => ({ ...a, bytes: parseSizeBytes(a.size) }));
    sized.sort((a, b) => (b.bytes ?? 0) - (a.bytes ?? 0));
    const best = sized[0];

    const preparedAll = detail.prepared_by ?? m.item.prepared_by ?? [];
    const translators = preparedAll
      .filter((p) => (p.kind ?? "") === "translator")
      .map((p) => p.title).filter(Boolean);
    const extra = [];
    if (atts.length > 1) extra.push(`multiple PDF attachments (${atts.length}), picked largest`);

    const title = cleanText(detail.title ?? m.item.title, 300);
    if (!title) continue;
    addCandidate({
      source_id: id,
      source_url: `https://islamhouse.com/ar/books/${id}/`,
      title_ar: title,
      author: m.author,
      author_source: preparedAll.map((p) => p.title),
      translator: translators.length ? translators.join(", ") : null,
      description: detail.description ?? m.item.description ?? null,
      category_strings: [m.categoryName, title],
      pdf_url: best.url,
      cover_url: detail.image ?? m.item.image ?? null,
      size_bytes: best.bytes,
      year: null, // not provided by the API
      extra_reasons: extra,
    });
    if (++processed % 25 === 0) console.log(`  ${processed} candidates built...`);
  }
}

function parseSizeBytes(s) {
  const m = String(s ?? "").trim().match(/^([\d.]+)\s*(B|KB|MB|GB)$/i);
  if (!m) return null;
  const mult = { B: 1, KB: 1024, MB: 1048576, GB: 1073741824 }[m[2].toUpperCase()];
  return Math.round(Number(m[1]) * mult);
}

// --- run --------------------------------------------------------------------

if (source === "archive-org") await buildArchiveOrg();
else await buildIslamhouse();

finalize();

// outputs
const candidatesPath = join(STATE, `candidates-${source}.json`);
writeFileSync(
  candidatesPath,
  JSON.stringify(
    {
      source,
      generated_at: new Date().toISOString(),
      cap: CAP,
      capped: stats.capped,
      db_dedupe_ok: dbDedupeOk,
      db_dedupe_error: dbDedupeError,
      existing_slugs: [...existingSlugs],
      stats,
      candidates,
    },
    null,
    2
  )
);

const csvPath = join(IMPORT_DIR, `REVIEW-${source}.csv`);
writeCsv(
  csvPath,
  ["approve", "flag", "title_ar", "title_translit", "author_en", "author_ar", "category_slug", "size_mb", "year", "source_url"],
  candidates.map((c) => ({
    approve: "",
    flag: c.flag,
    title_ar: c.title_ar,
    title_translit: c.title_translit,
    author_en: c.author_en,
    author_ar: c.author_ar,
    category_slug: c.category_slug,
    size_mb: c.size_mb ?? "",
    year: c.year ?? "",
    source_url: c.source_url,
  }))
);

// summary
const byAuthor = new Map();
const byFlag = new Map();
let totalBytes = 0;
for (const c of candidates) {
  byAuthor.set(c.author_en, (byAuthor.get(c.author_en) ?? 0) + 1);
  byFlag.set(c.flag, (byFlag.get(c.flag) ?? 0) + 1);
  totalBytes += c.size_bytes ?? 0;
}

console.log(`\n=== ${source} candidate summary ===`);
console.log(`Candidates: ${candidates.length}${stats.capped ? ` (CAPPED at ${CAP} for this pilot round — more available at the source)` : ""}`);
console.log(`Total size: ${(totalBytes / 1073741824).toFixed(2)} GB (known sizes only)`);
console.log(`Flags:`);
for (const f of ["ok", "review", "blocklist", "possible-dupe", "dupe-internal"]) {
  console.log(`  ${f.padEnd(14)} ${byFlag.get(f) ?? 0}`);
}
console.log(`By author:`);
for (const [name, n] of [...byAuthor.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}  ${name}`);
}
console.log(`Skips: itemsSeen=${stats.itemsSeen} noWhitelistAuthor=${stats.noWhitelistAuthor} noPdf=${stats.noPdf} detailFailed=${stats.detailFailed} searchFailed=${stats.searchFailed}`);
if (!dbDedupeOk) console.log(`WARNING: live-DB dedupe was skipped (${dbDedupeError})`);
console.log(`\nWrote ${candidatesPath}`);
console.log(`Wrote ${csvPath}`);
console.log(`Next: review the CSV (mark approve=x), then run 02-apply-approvals.mjs --source=${source}`);
