"use client";

import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { NeedsAttention } from "@/components/admin/needs-attention";
import { LinkChecker } from "@/components/admin/link-checker";

export default function NeedsAttentionPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <PageHeader
        title="Content Health"
        subtitle="Content missing required fields, media, categories, or body content"
      />

      <div className="mb-4 bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
        This page surfaces content items that are incomplete or need
        attention. Items listed here are still visible on the public site
        unless marked hidden. Click any row to jump to the editor for that
        item and fix the missing information.
      </div>

      <div className="mb-4">
        <LinkChecker onComplete={() => setRefreshKey((k) => k + 1)} />
      </div>

      <NeedsAttention key={refreshKey} />
    </>
  );
}
