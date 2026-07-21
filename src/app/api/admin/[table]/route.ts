import { requireAdmin } from "@/lib/access-auth";
import { logAudit, type AuditAction } from "@/lib/audit";
import { getDb } from "@/lib/db";
import { fromDbRows, toDbValue, newId, likePattern, placeholders, nowIso } from "@/lib/d1-helpers";
import type { ListOptions, Primitive } from "@/lib/admin-api";

// Generic CRUD over a hard whitelist of tables/columns. Identifiers can never
// be parameter-bound, so every table and column name is validated against
// these maps before being interpolated into SQL.

const TABLE_COLUMNS: Record<string, string[]> = {
  books: [
    "id", "title", "slug", "author", "translator", "description", "cover_url", "pdf_url",
    "category_id", "display_order", "language", "source", "source_url", "title_alt",
    "pages", "published_year", "created_at",
  ],
  lectures: ["id", "title", "slug", "speaker", "description", "audio_url", "video_url", "category_id", "created_at"],
  khutbas: ["id", "title", "slug", "speaker", "description", "audio_url", "video_url", "category_id", "created_at"],
  duas: ["id", "title", "arabic_text", "translation", "transliteration", "source", "category_id", "created_at"],
  wisdom: ["id", "quote_arabic", "quote_english", "attribution", "source", "category_id", "created_at"],
  guides: ["id", "title", "slug", "content", "category_id", "order", "created_at"],
  categories: [
    "id", "name", "slug", "description", "content_type", "image_url", "hidden",
    "parent_id", "sort_order", "name_ar", "created_at",
  ],
  pages: [
    "id", "slug", "parent_id", "title", "subtitle", "hero_image_url", "body",
    "meta_description", "sort_order", "hidden", "created_at", "updated_at",
  ],
  link_check_results: [
    "id", "resource_type", "resource_id", "field", "url", "status", "http_code",
    "error_message", "checked_at",
  ],
  audit_log: ["id", "actor_email", "action", "resource_type", "resource_id", "resource_title", "details", "created_at"],
  page_views: ["id", "path", "visited_at", "referrer", "visitor_id", "user_agent"],
};

const READ_ONLY_TABLES = new Set(["audit_log", "page_views"]);

const RESOURCE_TYPE: Record<string, string> = {
  books: "book",
  lectures: "lecture",
  khutbas: "khutba",
  duas: "dua",
  wisdom: "wisdom",
  guides: "guide",
  categories: "category",
  pages: "page",
};

function bad(message: string, status = 400): Response {
  return Response.json({ error: message }, { status });
}

function quoteCol(col: string): string {
  return `"${col}"`; // cols are whitelist-validated; quoting handles "order"
}

function validCols(table: string, cols: string[]): boolean {
  const allowed = TABLE_COLUMNS[table];
  return cols.every((c) => allowed.includes(c));
}

function titleOf(table: string, data: Record<string, unknown>): string | null {
  const v = data.title ?? data.name ?? data.attribution ?? data.slug;
  return typeof v === "string" ? v : null;
}

type Ctx = { params: Promise<{ table: string }> };

async function resolveTable(ctx: Ctx): Promise<string | Response> {
  const { table } = await ctx.params;
  if (!TABLE_COLUMNS[table]) return bad(`Unknown table: ${table}`, 404);
  return table;
}

// ---------------------------------------------------------------------------
// GET — list with ListOptions (JSON in ?opts=)
// ---------------------------------------------------------------------------

export async function GET(request: Request, ctx: Ctx) {
  const admin = await requireAdmin(request);
  if (admin instanceof Response) return admin;
  const table = await resolveTable(ctx);
  if (table instanceof Response) return table;

  let opts: ListOptions = {};
  const raw = new URL(request.url).searchParams.get("opts");
  if (raw) {
    try {
      opts = JSON.parse(raw) as ListOptions;
    } catch {
      return bad("Invalid opts JSON");
    }
  }

  const where: string[] = [];
  const binds: unknown[] = [];

  for (const [col, val] of Object.entries(opts.eq ?? {})) {
    if (!validCols(table, [col])) return bad(`Bad column: ${col}`);
    where.push(`${quoteCol(col)} = ?`);
    binds.push(toDbValue(val));
  }
  for (const [col, val] of Object.entries(opts.neq ?? {})) {
    if (!validCols(table, [col])) return bad(`Bad column: ${col}`);
    where.push(`${quoteCol(col)} != ?`);
    binds.push(toDbValue(val));
  }
  for (const col of opts.isNull ?? []) {
    if (!validCols(table, [col])) return bad(`Bad column: ${col}`);
    where.push(`${quoteCol(col)} IS NULL`);
  }
  for (const col of opts.notNull ?? []) {
    if (!validCols(table, [col])) return bad(`Bad column: ${col}`);
    where.push(`${quoteCol(col)} IS NOT NULL`);
  }
  for (const [col, vals] of Object.entries(opts.in ?? {})) {
    if (!validCols(table, [col])) return bad(`Bad column: ${col}`);
    if (!Array.isArray(vals) || vals.length === 0) return bad(`Empty IN list for ${col}`);
    if (vals.length > 500) return bad(`IN list too long for ${col}`);
    where.push(`${quoteCol(col)} IN (${placeholders(vals.length)})`);
    binds.push(...vals.map(toDbValue));
  }
  for (const [col, val] of Object.entries(opts.gte ?? {})) {
    if (!validCols(table, [col])) return bad(`Bad column: ${col}`);
    where.push(`${quoteCol(col)} >= ?`);
    binds.push(toDbValue(val));
  }
  for (const [col, val] of Object.entries(opts.lt ?? {})) {
    if (!validCols(table, [col])) return bad(`Bad column: ${col}`);
    where.push(`${quoteCol(col)} < ?`);
    binds.push(toDbValue(val));
  }
  if (opts.search && opts.search.q.trim()) {
    if (!validCols(table, opts.search.cols) || opts.search.cols.length === 0) {
      return bad("Bad search columns");
    }
    const p = likePattern(opts.search.q);
    where.push(`(${opts.search.cols.map((c) => `${quoteCol(c)} LIKE ? ESCAPE '\\'`).join(" OR ")})`);
    binds.push(...opts.search.cols.map(() => p));
  }

  const whereSql = where.length ? ` WHERE ${where.join(" AND ")}` : "";
  const db = await getDb();

  let count: number | null = null;
  if (opts.count || opts.countOnly) {
    const row = await db
      .prepare(`SELECT COUNT(*) AS n FROM ${table}${whereSql}`)
      .bind(...binds)
      .first<{ n: number }>();
    count = row?.n ?? 0;
  }
  if (opts.countOnly) {
    return Response.json({ rows: [], count });
  }

  const orderParts: string[] = [];
  for (const o of opts.orderBy ?? []) {
    if (!validCols(table, [o.col])) return bad(`Bad order column: ${o.col}`);
    orderParts.push(`${quoteCol(o.col)}${o.dir === "desc" ? " DESC" : ""}`);
  }
  const orderSql = orderParts.length ? ` ORDER BY ${orderParts.join(", ")}` : "";
  const limit = Math.min(Math.max(opts.limit ?? 1000, 1), 5000);
  const offset = Math.max(opts.offset ?? 0, 0);

  const { results } = await db
    .prepare(`SELECT * FROM ${table}${whereSql}${orderSql} LIMIT ? OFFSET ?`)
    .bind(...binds, limit, offset)
    .all<Record<string, unknown>>();

  return Response.json({ rows: fromDbRows(table, results), count });
}

// ---------------------------------------------------------------------------
// POST — insert { data }
// ---------------------------------------------------------------------------

export async function POST(request: Request, ctx: Ctx) {
  const admin = await requireAdmin(request);
  if (admin instanceof Response) return admin;
  const table = await resolveTable(ctx);
  if (table instanceof Response) return table;
  if (READ_ONLY_TABLES.has(table)) return bad(`${table} is read-only`, 403);

  const body = (await request.json().catch(() => null)) as { data?: Record<string, unknown> } | null;
  if (!body?.data || typeof body.data !== "object") return bad("Missing data");

  const data = { ...body.data };
  delete data.id;
  delete data.created_at;
  const cols = Object.keys(data);
  if (cols.length === 0) return bad("Empty insert");
  if (!validCols(table, cols)) return bad("Unknown column in data");

  const id = newId();
  const db = await getDb();
  await db
    .prepare(
      `INSERT INTO ${table} (id, ${cols.map(quoteCol).join(", ")})
       VALUES (?, ${placeholders(cols.length)})`
    )
    .bind(id, ...cols.map((c) => toDbValue(data[c])))
    .run();

  const rt = RESOURCE_TYPE[table];
  if (rt) {
    await logAudit(db, admin.email, {
      action: "create",
      resourceType: rt,
      resourceId: id,
      resourceTitle: titleOf(table, data),
    });
  }
  return Response.json({ id });
}

// ---------------------------------------------------------------------------
// PATCH — update { id, data } or { ids, data }
// ---------------------------------------------------------------------------

export async function PATCH(request: Request, ctx: Ctx) {
  const admin = await requireAdmin(request);
  if (admin instanceof Response) return admin;
  const table = await resolveTable(ctx);
  if (table instanceof Response) return table;
  if (READ_ONLY_TABLES.has(table)) return bad(`${table} is read-only`, 403);

  const body = (await request.json().catch(() => null)) as {
    id?: string;
    ids?: string[];
    data?: Record<string, unknown>;
  } | null;
  if (!body?.data || typeof body.data !== "object") return bad("Missing data");
  const ids = body.ids ?? (body.id ? [body.id] : []);
  if (ids.length === 0) return bad("Missing id(s)");
  if (ids.length > 500) return bad("Too many ids");

  const data = { ...body.data };
  delete data.id;
  delete data.created_at;
  if (table === "pages") data.updated_at = nowIso();
  const cols = Object.keys(data);
  if (cols.length === 0) return bad("Empty update");
  if (!validCols(table, cols)) return bad("Unknown column in data");

  const db = await getDb();
  const setSql = cols.map((c) => `${quoteCol(c)} = ?`).join(", ");
  await db
    .prepare(`UPDATE ${table} SET ${setSql} WHERE id IN (${placeholders(ids.length)})`)
    .bind(...cols.map((c) => toDbValue(data[c])), ...ids)
    .run();

  const rt = RESOURCE_TYPE[table];
  if (rt) {
    const action: AuditAction = ids.length > 1 ? "bulk_update" : "update";
    await logAudit(db, admin.email, {
      action,
      resourceType: rt,
      resourceId: ids.length === 1 ? ids[0] : null,
      resourceTitle: titleOf(table, data),
      details: ids.length > 1 ? { count: ids.length, fields: cols } : { fields: cols },
    });
  }
  return Response.json({ ok: true });
}

// ---------------------------------------------------------------------------
// DELETE — { id } or { ids }
// ---------------------------------------------------------------------------

export async function DELETE(request: Request, ctx: Ctx) {
  const admin = await requireAdmin(request);
  if (admin instanceof Response) return admin;
  const table = await resolveTable(ctx);
  if (table instanceof Response) return table;
  if (READ_ONLY_TABLES.has(table)) return bad(`${table} is read-only`, 403);

  const body = (await request.json().catch(() => null)) as { id?: string; ids?: string[] } | null;
  const ids = body?.ids ?? (body?.id ? [body.id] : []);
  if (ids.length === 0) return bad("Missing id(s)");
  if (ids.length > 500) return bad("Too many ids");

  const db = await getDb();

  // Best-effort title capture for the audit trail before rows disappear.
  let firstTitle: string | null = null;
  const titleCol = TABLE_COLUMNS[table].includes("title")
    ? "title"
    : TABLE_COLUMNS[table].includes("name")
      ? "name"
      : TABLE_COLUMNS[table].includes("attribution")
        ? "attribution"
        : null;
  if (titleCol) {
    const row = await db
      .prepare(`SELECT ${quoteCol(titleCol)} AS t FROM ${table} WHERE id = ? LIMIT 1`)
      .bind(ids[0])
      .first<{ t: string }>();
    firstTitle = row?.t ?? null;
  }

  await db
    .prepare(`DELETE FROM ${table} WHERE id IN (${placeholders(ids.length)})`)
    .bind(...ids)
    .run();

  const rt = RESOURCE_TYPE[table];
  if (rt) {
    await logAudit(db, admin.email, {
      action: ids.length > 1 ? "bulk_delete" : "delete",
      resourceType: rt,
      resourceId: ids.length === 1 ? ids[0] : null,
      resourceTitle: firstTitle,
      details: ids.length > 1 ? { count: ids.length } : null,
    });
  }
  return Response.json({ ok: true });
}
