// Shared helpers for talking to D1: value coercion between SQLite storage
// types and app types, LIKE escaping, and id generation. Server-side only.

/** Columns stored as INTEGER 0/1 in D1 but exposed as boolean in app types. */
export const BOOL_COLUMNS: Record<string, string[]> = {
  categories: ["hidden"],
  pages: ["hidden"],
  sponsors: ["active"],
  contact_messages: ["read"],
};

/** Columns stored as JSON text in D1 but exposed as objects in app types. */
export const JSON_COLUMNS: Record<string, string[]> = {
  audit_log: ["details"],
};

/** Convert an app-level value to a D1-bindable value. */
export function toDbValue(v: unknown): string | number | null {
  if (v === undefined || v === null) return null;
  if (typeof v === "boolean") return v ? 1 : 0;
  if (typeof v === "number") return v;
  if (typeof v === "string") return v;
  return JSON.stringify(v);
}

/** Coerce a raw D1 row to app types for the given table (bools, JSON). */
export function fromDbRow<T>(table: string, row: Record<string, unknown>): T {
  const out: Record<string, unknown> = { ...row };
  for (const col of BOOL_COLUMNS[table] ?? []) {
    if (col in out) out[col] = out[col] === 1 || out[col] === true;
  }
  for (const col of JSON_COLUMNS[table] ?? []) {
    if (typeof out[col] === "string") {
      try {
        out[col] = JSON.parse(out[col] as string);
      } catch {
        // leave as string if unparseable
      }
    }
  }
  return out as T;
}

export function fromDbRows<T>(table: string, rows: Record<string, unknown>[]): T[] {
  return rows.map((r) => fromDbRow<T>(table, r));
}

/** Escape %, _ and \ for use inside a LIKE pattern (with ESCAPE '\'). */
export function escapeLike(input: string): string {
  return input.replace(/[\\%_]/g, (c) => `\\${c}`);
}

/** Build a `%term%` LIKE pattern from raw user input. */
export function likePattern(input: string): string {
  return `%${escapeLike(input.trim())}%`;
}

export function newId(): string {
  return crypto.randomUUID();
}

export function nowIso(): string {
  return new Date().toISOString();
}

/** Placeholders string "(?,?,?)" for IN clauses. */
export function placeholders(n: number): string {
  return Array.from({ length: n }, () => "?").join(",");
}
