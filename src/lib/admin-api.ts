// Client-side fetch wrapper for the Access-protected /api/admin routes.
// Admin pages stay client components; all D1/R2 access happens server-side.

export type Primitive = string | number | boolean | null;

export type ListOptions = {
  /** Equality filters: { category_id: "..." } */
  eq?: Record<string, Primitive>;
  /** Not-equal filters */
  neq?: Record<string, Primitive>;
  /** Columns that must be NULL */
  isNull?: string[];
  /** Columns that must be NOT NULL */
  notNull?: string[];
  /** IN filters: { id: [a, b, c] } */
  in?: Record<string, Primitive[]>;
  /** >= filters */
  gte?: Record<string, Primitive>;
  /** < filters */
  lt?: Record<string, Primitive>;
  /** OR LIKE search across columns */
  search?: { cols: string[]; q: string };
  orderBy?: { col: string; dir?: "asc" | "desc" }[];
  limit?: number;
  offset?: number;
  /** Include total row count (respecting filters) in the response */
  count?: boolean;
  /** Only return the count, no rows */
  countOnly?: boolean;
};

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

async function get<T>(path: string): Promise<T> {
  return handle<T>(await fetch(path));
}

async function post<T>(path: string, body?: unknown): Promise<T> {
  return handle<T>(
    await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  );
}

export const adminApi = {
  get,
  post,

  async list<T>(table: string, opts: ListOptions = {}): Promise<{ rows: T[]; count: number | null }> {
    const qs = new URLSearchParams({ opts: JSON.stringify(opts) });
    return handle(await fetch(`/api/admin/${table}?${qs}`));
  },

  async insert(table: string, data: Record<string, unknown>): Promise<{ id: string }> {
    return post(`/api/admin/${table}`, { data });
  },

  async update(table: string, id: string, data: Record<string, unknown>): Promise<void> {
    await handle(
      await fetch(`/api/admin/${table}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, data }),
      })
    );
  },

  async updateMany(table: string, ids: string[], data: Record<string, unknown>): Promise<void> {
    await handle(
      await fetch(`/api/admin/${table}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, data }),
      })
    );
  },

  async remove(table: string, id: string): Promise<void> {
    await handle(
      await fetch(`/api/admin/${table}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
    );
  },

  async removeMany(table: string, ids: string[]): Promise<void> {
    await handle(
      await fetch(`/api/admin/${table}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      })
    );
  },

  /**
   * Upload a file to R2. bucket is "covers" or "books" (key prefix), folder is
   * the category-style subfolder. Returns the final public URL to store in the DB.
   */
  async upload(bucket: "covers" | "books", folder: string, file: File): Promise<{ url: string }> {
    const form = new FormData();
    form.set("bucket", bucket);
    form.set("folder", folder);
    form.set("file", file);
    return handle(await fetch("/api/admin/upload", { method: "POST", body: form }));
  },

  async me(): Promise<{ email: string }> {
    return get("/api/admin/me");
  },
};
