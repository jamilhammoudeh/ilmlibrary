import { supabase } from "@/lib/supabase";

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
  resourceType: AuditResourceType;
  resourceId?: string | null;
  resourceTitle?: string | null;
  details?: Record<string, unknown> | null;
};

// Fire-and-forget. Never throws: audit failures must not break admin actions.
export async function logAudit(input: LogAuditInput): Promise<void> {
  try {
    const { data } = await supabase.auth.getUser();
    const actorEmail = data.user?.email ?? null;

    await supabase.from("audit_log").insert({
      actor_email: actorEmail,
      action: input.action,
      resource_type: input.resourceType,
      resource_id: input.resourceId ?? null,
      resource_title: input.resourceTitle ?? null,
      details: input.details ?? null,
    });
  } catch {
    // Silent — audit is non-critical.
  }
}
