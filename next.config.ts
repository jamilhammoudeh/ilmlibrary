import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.ilmlibrary.org",
      },
      // Legacy Supabase storage — remove after the R2 migration is verified.
      {
        protocol: "https",
        hostname: "rmsaeculynliwrkvnibx.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;

// Provides live D1/R2 bindings (via miniflare) during `next dev`.
initOpenNextCloudflareForDev();
