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
    ],
  },
};

export default nextConfig;

// Provides live D1/R2 bindings (via miniflare) during `next dev`.
initOpenNextCloudflareForDev();
