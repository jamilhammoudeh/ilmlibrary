/**
 * Polite HTTP helpers: rate limiting, retries with backoff, and a
 * resume-safe on-disk cache of raw API responses.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync } from "fs";
import { join } from "path";

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export class NonRetryableError extends Error {}

export const USER_AGENT = "ilmlibrary-import/1.0 (+https://ilmlibrary.org)";

/**
 * Build a fetcher with its own rate limiter and cache directory.
 *  - minIntervalMs: minimum gap between real network requests (cache hits are free)
 *  - retries: extra attempts after the first (backoff 2s, 4s, 8s)
 */
export function makeFetcher({ cacheDir = null, minIntervalMs = 1000, retries = 3 } = {}) {
  if (cacheDir) mkdirSync(cacheDir, { recursive: true });
  let lastFetch = 0;

  async function throttle() {
    const wait = lastFetch + minIntervalMs - Date.now();
    if (wait > 0) await sleep(wait);
    lastFetch = Date.now();
  }

  async function fetchRaw(url, { timeoutMs = 90000, method = "GET", headers = {} } = {}) {
    let lastErr;
    for (let attempt = 0; attempt <= retries; attempt++) {
      if (attempt > 0) await sleep(1000 * 2 ** attempt);
      await throttle();
      try {
        const res = await fetch(url, {
          method,
          headers: { "user-agent": USER_AGENT, ...headers },
          redirect: "follow",
          signal: AbortSignal.timeout(timeoutMs),
        });
        if (res.ok) return res;
        if (res.status >= 400 && res.status < 500 && res.status !== 429) {
          throw new NonRetryableError(`HTTP ${res.status} for ${url}`);
        }
        lastErr = new Error(`HTTP ${res.status} for ${url}`);
      } catch (e) {
        if (e instanceof NonRetryableError) throw e;
        lastErr = e;
      }
    }
    throw lastErr;
  }

  /** Fetch text with on-disk caching under `cacheName`. */
  async function text(url, cacheName, opts = {}) {
    const cachePath = cacheDir && cacheName ? join(cacheDir, cacheName) : null;
    if (cachePath && existsSync(cachePath)) {
      return readFileSync(cachePath, "utf8");
    }
    const res = await fetchRaw(url, opts);
    const body = await res.text();
    if (cachePath) writeFileSync(cachePath, body, "utf8");
    return body;
  }

  /** Fetch JSON with on-disk caching; a corrupt cache file is refetched once. */
  async function json(url, cacheName, opts = {}) {
    const cachePath = cacheDir && cacheName ? join(cacheDir, cacheName) : null;
    let body = await text(url, cacheName, opts);
    try {
      return JSON.parse(body);
    } catch {
      if (cachePath && existsSync(cachePath)) unlinkSync(cachePath);
      body = await text(url, cacheName, opts);
      return JSON.parse(body); // throws if still invalid
    }
  }

  return { fetchRaw, text, json };
}
