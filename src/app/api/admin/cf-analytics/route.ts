import { requireAdmin } from "@/lib/access-auth";
import { getEnv } from "@/lib/db";

// Cloudflare edge analytics (GraphQL) — network-level truth to sit beside the
// first-party page_views data: every request, bots included, plus bandwidth,
// cache hit rate, and countries. Needs the CF_ANALYTICS_TOKEN secret
// (a read-only "Analytics:Read" zone token).

export const dynamic = "force-dynamic";

const ZONE_TAG = "9a5b0d4dd69d0f44cdf18cb92960b62e";

const QUERY = `
query Traffic($zoneTag: string, $since: string, $until: string, $sinceDt: Time) {
  viewer {
    zones(filter: { zoneTag: $zoneTag }) {
      daily: httpRequests1dGroups(
        limit: 30
        filter: { date_geq: $since, date_leq: $until }
        orderBy: [date_ASC]
      ) {
        dimensions { date }
        sum { requests pageViews cachedRequests bytes }
        uniq { uniques }
      }
      countries: httpRequestsAdaptiveGroups(
        limit: 10
        filter: { datetime_geq: $sinceDt }
        orderBy: [count_DESC]
      ) {
        count
        dimensions { clientCountryName }
      }
    }
  }
}`;

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (admin instanceof Response) return admin;

  const env = await getEnv();
  const token = (env as unknown as { CF_ANALYTICS_TOKEN?: string }).CF_ANALYTICS_TOKEN?.trim();
  if (!token) {
    return Response.json({ configured: false });
  }

  const now = new Date();
  const since = new Date(now.getTime() - 13 * 86400_000).toISOString().slice(0, 10);
  const until = now.toISOString().slice(0, 10);
  const sinceDt = new Date(now.getTime() - 7 * 86400_000).toISOString();

  const res = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      query: QUERY,
      variables: { zoneTag: ZONE_TAG, since, until, sinceDt },
    }),
  });
  const body = (await res.json()) as {
    data?: {
      viewer?: {
        zones?: {
          daily?: {
            dimensions: { date: string };
            sum: { requests: number; pageViews: number; cachedRequests: number; bytes: number };
            uniq: { uniques: number };
          }[];
          countries?: { count: number; dimensions: { clientCountryName: string } }[];
        }[];
      };
    };
    errors?: { message: string }[];
  };

  if (!res.ok || body.errors?.length) {
    return Response.json(
      { configured: true, error: body.errors?.[0]?.message ?? `HTTP ${res.status}` },
      { status: 502 }
    );
  }

  const zone = body.data?.viewer?.zones?.[0];
  return Response.json({
    configured: true,
    daily: (zone?.daily ?? []).map((d) => ({
      date: d.dimensions.date,
      requests: d.sum.requests,
      pageViews: d.sum.pageViews,
      cachedRequests: d.sum.cachedRequests,
      bytes: d.sum.bytes,
      uniques: d.uniq.uniques,
    })),
    countries: (zone?.countries ?? []).map((c) => ({
      country: c.dimensions.clientCountryName,
      requests: c.count,
    })),
  });
}
