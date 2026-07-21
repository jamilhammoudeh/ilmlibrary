import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// All DB-driven pages are force-dynamic, so no incremental cache is needed.
// If ISR is wanted later, add r2IncrementalCache here.
export default defineCloudflareConfig();
