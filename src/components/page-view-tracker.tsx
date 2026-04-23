"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { SITE_HOSTS } from "@/lib/site";

const VISITOR_KEY = "ilm-visitor-id";

function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id =
        "v_" +
        Math.random().toString(36).slice(2, 10) +
        Date.now().toString(36);
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

function classifyReferrer(raw: string): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    // Ignore referrers from our own domain (internal navigation noise)
    if (typeof window !== "undefined" && url.hostname === window.location.hostname) {
      return null;
    }
    return raw;
  } catch {
    return raw || null;
  }
}

function shouldTrack(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return (SITE_HOSTS as readonly string[]).includes(host);
}

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    if (!shouldTrack()) return;

    const visitor_id = getOrCreateVisitorId();
    const referrer = classifyReferrer(document.referrer);
    const user_agent = navigator.userAgent ?? null;

    supabase
      .from("page_views")
      .insert({
        path: pathname,
        visitor_id: visitor_id || null,
        referrer,
        user_agent,
      })
      .then(() => {});
  }, [pathname]);

  return null;
}
