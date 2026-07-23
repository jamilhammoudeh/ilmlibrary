"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { Globe, Zap } from "lucide-react";

// Network-level analytics from Cloudflare's edge, shown beside the
// first-party page_views data. Edge numbers include bots and every request;
// the first-party numbers are real readers on real pages.

type CfDaily = {
  date: string;
  requests: number;
  pageViews: number;
  cachedRequests: number;
  bytes: number;
  uniques: number;
};

type CfData = {
  configured: boolean;
  error?: string;
  daily?: CfDaily[];
  countries?: { country: string; requests: number }[];
};

function fmtBytes(n: number) {
  if (n >= 1073741824) return `${(n / 1073741824).toFixed(1)} GB`;
  if (n >= 1048576) return `${(n / 1048576).toFixed(1)} MB`;
  return `${Math.round(n / 1024)} KB`;
}

export function CfAnalyticsPanel() {
  const [data, setData] = useState<CfData | null>(null);

  useEffect(() => {
    adminApi
      .get<CfData>("/api/admin/cf-analytics")
      .then(setData)
      .catch((e) => setData({ configured: true, error: e instanceof Error ? e.message : "failed" }));
  }, []);

  if (!data) return null;

  if (!data.configured) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Globe size={15} className="text-teal-700" /> Network analytics (Cloudflare)
        </h2>
        <p className="text-sm text-gray-500">
          Not connected yet. Create a read-only <em>Analytics</em> API token for the
          ilmlibrary.org zone and it will appear here automatically.
        </p>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-2">Network analytics (Cloudflare)</h2>
        <p className="text-sm text-rose-600">Couldn&apos;t load: {data.error}</p>
      </div>
    );
  }

  const daily = data.daily ?? [];
  const last7 = daily.slice(-7);
  const sum = (f: (d: CfDaily) => number) => last7.reduce((a, d) => a + f(d), 0);
  const requests7 = sum((d) => d.requests);
  const uniques7 = sum((d) => d.uniques);
  const bytes7 = sum((d) => d.bytes);
  const cached7 = sum((d) => d.cachedRequests);
  const cacheRate = requests7 > 0 ? Math.round((cached7 / requests7) * 100) : 0;
  const maxReq = Math.max(...daily.map((d) => d.requests), 1);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h2 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
        <Globe size={15} className="text-teal-700" /> Network analytics (Cloudflare edge)
      </h2>
      <p className="text-xs text-gray-500 mb-4">
        Every request that hits the domain — bots and crawlers included. The page-view
        numbers above are real readers; this is total network truth.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="rounded-md bg-gray-50 p-3">
          <p className="text-[11px] uppercase tracking-wide text-gray-500">Requests (7d)</p>
          <p className="text-xl font-bold text-gray-900">{requests7.toLocaleString()}</p>
        </div>
        <div className="rounded-md bg-gray-50 p-3">
          <p className="text-[11px] uppercase tracking-wide text-gray-500">Unique IPs (7d)</p>
          <p className="text-xl font-bold text-gray-900">{uniques7.toLocaleString()}</p>
        </div>
        <div className="rounded-md bg-gray-50 p-3">
          <p className="text-[11px] uppercase tracking-wide text-gray-500">Bandwidth (7d)</p>
          <p className="text-xl font-bold text-gray-900">{fmtBytes(bytes7)}</p>
        </div>
        <div className="rounded-md bg-gray-50 p-3">
          <p className="text-[11px] uppercase tracking-wide text-gray-500 flex items-center gap-1">
            <Zap size={11} /> Cache hit
          </p>
          <p className="text-xl font-bold text-gray-900">{cacheRate}%</p>
        </div>
      </div>

      <div className="mb-5">
        <p className="text-xs font-medium text-gray-600 mb-2">Requests per day (14d)</p>
        <div className="flex items-end gap-1 h-20">
          {daily.map((d) => (
            <div
              key={d.date}
              title={`${d.date}: ${d.requests.toLocaleString()} requests, ${d.uniques.toLocaleString()} unique IPs`}
              className="flex-1 bg-teal-200 hover:bg-teal-400 transition-colors rounded-t"
              style={{ height: `${Math.max(4, (d.requests / maxReq) * 100)}%` }}
            />
          ))}
        </div>
      </div>

      {(data.countries?.length ?? 0) > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-600 mb-2">Top countries (7d)</p>
          <div className="flex flex-wrap gap-2">
            {data.countries!.map((c) => (
              <span
                key={c.country}
                className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 border border-gray-200 px-3 py-1 text-xs text-gray-700"
              >
                <span className="font-semibold">{c.country}</span>
                {c.requests.toLocaleString()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
