import { requireAdmin } from "@/lib/access-auth";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (admin instanceof Response) return admin;
  return Response.json({ email: admin.email });
}
