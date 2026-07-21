import { getCloudflareContext } from "@opennextjs/cloudflare";

// The only place that touches Cloudflare bindings. Server-side only —
// never import from client components.

export async function getDb(): Promise<D1Database> {
  const { env } = await getCloudflareContext({ async: true });
  return env.DB;
}

export async function getBucket(): Promise<R2Bucket> {
  const { env } = await getCloudflareContext({ async: true });
  return env.FILES;
}

export async function getEnv(): Promise<CloudflareEnv> {
  const { env } = await getCloudflareContext({ async: true });
  return env;
}
