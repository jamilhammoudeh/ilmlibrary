import { newId } from "@/lib/d1-helpers";

// Audit logging is server-side only: the /api/admin routes write entries with
// the Access-verified email. (It used to be a client-side supabase insert.)

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "reorder"
  | "bulk_delete"
  | "bulk_update";

export type AuditResourceType =
  | "book"
  | "lecture"
  | "khutba"
  | "dua"
  | "wisdom"
  | "page"
  | "category";

export type LogAuditInput = {
  action: AuditAction;
  resourceType: AuditResourceType | string;
  resourceId?: string | null;
  resourceTitle?: string | null;
  details?: Record<string, unknown> | null;
};

// Fire-and-forget. Never throws: audit failures must not break admin actions.
export async function logAudit(
  db: D1Database,
  actorEmail: string | null,
  input: LogAuditInput
): Promise<void> {
  try {
    await db
      .prepare(
        `INSERT INTO audit_log (id, actor_email, action, resource_type, resource_id, resource_title, details)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        newId(),
        actorEmail,
        input.action,
        input.resourceType,
        input.resourceId ?? null,
        input.resourceTitle ?? null,
        input.details ? JSON.stringify(input.details) : null
      )
      .run();
  } catch {
    // Silent — audit is non-critical.
  }
}
