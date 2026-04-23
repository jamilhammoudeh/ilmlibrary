"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";
import { canonicalUrl } from "@/lib/site";

export function ShareButton({ title, text }: { title: string; text?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = canonicalUrl();

    if (navigator.share) {
      try {
        await navigator.share({ title, text: text ?? title, url });
        return;
      } catch {}
    }

    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-teal-700 transition-colors"
    >
      <Share2 size={15} />
      {copied ? "Link copied!" : "Share"}
    </button>
  );
}
