import { requireAdmin } from "@/lib/access-auth";
import { getBucket, getEnv } from "@/lib/db";

// Multipart upload → R2. Keys follow the legacy convention:
//   <bucket>/<folder>/<timestamp>_<sanitized-filename>
// where <bucket> is the old Supabase bucket name ("covers" | "books"),
// now a key prefix inside the single ilmlibrary-files R2 bucket.

const MAX_SIZE = 200 * 1024 * 1024; // 200 MB

function sanitizeFilename(name: string): string {
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot + 1) : "";
  const clean = (s: string) =>
    s
      .normalize("NFKD")
      .replace(/[^\w.\- ]+/g, "")
      .trim()
      .replace(/\s+/g, "_");
  const cleanBase = clean(base) || "file";
  const cleanExt = clean(ext).toLowerCase();
  return cleanExt ? `${cleanBase}.${cleanExt}` : cleanBase;
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (admin instanceof Response) return admin;

  const form = await request.formData().catch(() => null);
  if (!form) return Response.json({ error: "Expected multipart form data" }, { status: 400 });

  const bucket = form.get("bucket");
  const folder = form.get("folder");
  const file = form.get("file");

  if (bucket !== "covers" && bucket !== "books") {
    return Response.json({ error: "bucket must be 'covers' or 'books'" }, { status: 400 });
  }
  if (typeof folder !== "string" || !/^[\w\- ]{1,64}$/.test(folder)) {
    return Response.json({ error: "Invalid folder" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return Response.json({ error: "Missing file" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return Response.json({ error: `File too large (max ${MAX_SIZE / 1024 / 1024} MB)` }, { status: 413 });
  }

  const key = `${bucket}/${folder}/${Date.now()}_${sanitizeFilename(file.name)}`;
  const r2 = await getBucket();
  await r2.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || "application/octet-stream" },
  });

  const env = await getEnv();
  const base = env.FILES_PUBLIC_URL || "https://files.ilmlibrary.org";
  return Response.json({ url: `${base}/${key}`, key });
}
