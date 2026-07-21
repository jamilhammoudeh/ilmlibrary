# Cutover runbook: Vercel/Supabase → Cloudflare

Current state (done):
- App deployed and verified at https://ilmlibrary.2345mjh.workers.dev (Workers + OpenNext)
- Remote D1 `ilmlibrary` loaded with all production data
- R2 bucket `ilmlibrary-files` (files migrating via scripts/migrate-files-to-r2.mjs)
- Production (www.ilmlibrary.org on Vercel + Supabase) untouched — zero risk so far

## Step 1 — Move the DNS zone to Cloudflare (user, ~10 min + propagation)
1. Cloudflare dashboard → Add a domain → `ilmlibrary.org` → Free plan.
2. Review the imported DNS records. CHECK EMAIL RECORDS (MX/TXT/DKIM) copied over if any exist.
3. Keep the existing Vercel records (A 76.76.21.21 / CNAME cname.vercel-dns.com) — set them to "DNS only" (grey cloud) so nothing changes yet.
4. At the registrar (wherever ilmlibrary.org was bought), replace the nameservers with the two Cloudflare gives you.
5. Wait until Cloudflare says the zone is Active. Site still serves from Vercel.

## Step 2 — R2 custom domain (user or Claude once zone is active)
- Dashboard → R2 → ilmlibrary-files → Settings → Custom Domains → add `files.ilmlibrary.org`
  (or: `npx wrangler r2 bucket domain add ilmlibrary-files --domain files.ilmlibrary.org --zone-id <zone>`)
- Add a Cache Rule: hostname files.ilmlibrary.org → Cache eligible, Edge TTL 1 month (content is immutable).

## Step 3 — Cloudflare Access for /admin (user, ~10 min)
1. Zero Trust dashboard (one-time: pick a team name, e.g. `ilmlibrary`) → note `<team>.cloudflareaccess.com`.
2. Access → Applications → Add → Self-hosted:
   - Name: Ilm Library Admin
   - Domains/paths: `www.ilmlibrary.org/admin`, `www.ilmlibrary.org/admin/*`, `www.ilmlibrary.org/api/admin/*` (+ same three on apex `ilmlibrary.org` if not redirecting apex)
   - Session: 1 week. Login methods: One-time PIN (email code) — zero setup — and/or Google.
3. Policy: Allow → Include → Emails → `2345mjh@gmail.com`.
4. Copy the application AUD tag (Overview → Application Audience) and the team domain into `wrangler.jsonc` vars `CF_ACCESS_AUD` / `CF_ACCESS_TEAM_DOMAIN`, then redeploy (`npm run deploy`).

## Step 4 — Flip the domain (Claude, after 1–3 done)
1. Content freeze (no admin edits on the old site).
2. Delta re-import: `node scripts/export-supabase.mjs && node scripts/build-d1-import.mjs` then apply the part files with `--remote` (captures anything added since the last import).
3. Uncomment the `routes` block in wrangler.jsonc, `npm run deploy`.
4. Delete the Vercel A/CNAME records in Cloudflare DNS (the Worker custom domain takes over www + apex).
5. Verify: homepage, book covers/PDFs load from files.ilmlibrary.org, /admin prompts Access login, admin CRUD works, run the admin link checker.

## Step 5 — Decommission (after 2–4 weeks of stability)
- Remove ilmlibrary.org from the Vercel project.
- Keep Supabase read-only as rollback, then delete the project.
- Remove the legacy Supabase hostname from next.config.ts images.

Rollback any time before Step 4.4: nothing changed. After: re-add the Vercel DNS records (minutes).

## Costs
- Workers Paid $5/mo (needed: worker bundle > free 3MiB cap; also lifts D1 daily limits)
- R2: free ≤10GB stored; ~$0.015/GB/mo beyond. Egress FREE (this is the big win for PDFs).
- D1/Access/DNS: free tier.
