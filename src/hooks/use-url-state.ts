"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * URL-synced string state. Returns [value, setValue] like useState.
 * Setting to `defaultValue`, empty string, or null removes the param.
 */
export function useUrlString(key: string, defaultValue: string = ""): [string, (v: string | null) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const value = searchParams.get(key) ?? defaultValue;

  const setValue = useCallback(
    (v: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (v === null || v === "" || v === defaultValue) {
        params.delete(key);
      } else {
        params.set(key, v);
      }
      const qs = params.toString();
      router.replace(pathname + (qs ? `?${qs}` : ""), { scroll: false });
    },
    [key, defaultValue, pathname, router, searchParams]
  );

  return [value, setValue];
}

/** URL-synced integer state (e.g. pagination page). */
export function useUrlNumber(key: string, defaultValue: number): [number, (v: number) => void] {
  const [raw, setRaw] = useUrlString(key, String(defaultValue));
  const parsed = Number.parseInt(raw, 10);
  const value = Number.isFinite(parsed) ? parsed : defaultValue;
  const setValue = useCallback(
    (v: number) => {
      setRaw(v === defaultValue ? null : String(v));
    },
    [setRaw, defaultValue]
  );
  return [value, setValue];
}

/** Batch-update multiple URL params in one navigation. */
export function useUrlUpdater() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const qs = params.toString();
      router.replace(pathname + (qs ? `?${qs}` : ""), { scroll: false });
    },
    [pathname, router, searchParams]
  );
}
