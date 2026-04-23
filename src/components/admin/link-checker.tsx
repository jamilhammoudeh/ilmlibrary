"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link2, Link2Off, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";

type Summary = {
  total: number;
  ok: number;
  broken: number;
  timeout: number;
  error: number;
  checked_at: string;
};

type LatestState = {
  lastCheckedAt: string | null;
  brokenCount: number;
  totalCount: number;
};

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function LinkChecker({ onComplete }: { onComplete?: () => void }) {
  const [running, setRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Summary | null>(null);
  const [latest, setLatest] = useState<LatestState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLatest() {
      const [totalR, brokenR, mostRecentR] = await Promise.all([
        supabase
          .from("link_check_results")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("link_check_results")
          .select("*", { count: "exact", head: true })
          .in("status", ["broken", "timeout", "error"]),
        supabase
          .from("link_check_results")
          .select("checked_at")
          .order("checked_at", { ascending: false })
          .limit(1),
      ]);
      setLatest({
        lastCheckedAt:
          ((mostRecentR.data as { checked_at: string }[]) ?? [])[0]
            ?.checked_at ?? null,
        brokenCount: brokenR.count ?? 0,
        totalCount: totalR.count ?? 0,
      });
    }
    loadLatest();
  }, []);

  async function handleScan() {
    setRunning(true);
    setError(null);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) {
        setError("Not authenticated");
        return;
      }
      const res = await fetch("/api/admin/check-links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? `Check failed (${res.status})`);
        return;
      }
      const summary = (await res.json()) as Summary;
      setLastRun(summary);
      setLatest({
        lastCheckedAt: summary.checked_at,
        brokenCount: summary.broken + summary.timeout + summary.error,
        totalCount: summary.total,
      });
      onComplete?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setRunning(false);
    }
  }

  const brokenNow = lastRun
    ? lastRun.broken + lastRun.timeout + lastRun.error
    : latest?.brokenCount ?? 0;
  const totalNow = lastRun?.total ?? latest?.totalCount ?? 0;
  const lastAt = lastRun?.checked_at ?? latest?.lastCheckedAt ?? null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={`shrink-0 w-9 h-9 rounded-md flex items-center justify-center ${
              brokenNow > 0
                ? "bg-rose-50 text-rose-700"
                : totalNow > 0
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-100 text-gray-500"
            }`}
          >
            {brokenNow > 0 ? <Link2Off size={16} /> : <Link2 size={16} />}
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-gray-900">Link Checker</h2>
            <p className="text-xs text-gray-500">
              {lastAt ? (
                <>
                  Last scanned{" "}
                  <span className="font-medium">{relativeTime(lastAt)}</span> •{" "}
                  {totalNow} link{totalNow === 1 ? "" : "s"} checked
                </>
              ) : (
                "Scan all book covers, PDFs, and media URLs to find broken links."
              )}
            </p>
            {lastRun && (
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                <StatBadge label="OK" count={lastRun.ok} tone="ok" />
                <StatBadge label="Broken" count={lastRun.broken} tone="bad" />
                <StatBadge label="Timeout" count={lastRun.timeout} tone="bad" />
                <StatBadge label="Error" count={lastRun.error} tone="bad" />
              </div>
            )}
            {!lastRun && latest && latest.brokenCount > 0 && (
              <p className="text-xs text-rose-700 mt-1 font-medium flex items-center gap-1">
                <AlertTriangle size={12} />
                {latest.brokenCount} broken link
                {latest.brokenCount === 1 ? "" : "s"} from last scan
              </p>
            )}
            {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
          </div>
        </div>
        <button
          onClick={handleScan}
          disabled={running}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-teal-700 text-white hover:bg-teal-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {running ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              Scanning…
            </>
          ) : (
            <>
              <CheckCircle2 size={13} />
              Run scan
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function StatBadge({
  label,
  count,
  tone,
}: {
  label: string;
  count: number;
  tone: "ok" | "bad";
}) {
  const color =
    tone === "ok"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : count > 0
        ? "bg-rose-50 text-rose-700 border-rose-200"
        : "bg-gray-50 text-gray-500 border-gray-200";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-medium ${color}`}
    >
      {label}:{" "}
      <span className="tabular-nums">{count.toLocaleString()}</span>
    </span>
  );
}
