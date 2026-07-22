import { createRemoteJWKSet, jwtVerify } from "jose";
import { getEnv } from "@/lib/db";

// Cloudflare Access protects /admin* and /api/admin/* at the edge; this is
// defense-in-depth plus the source of the acting admin's identity. Access
// forwards a signed JWT in the Cf-Access-Jwt-Assertion header on every request.

let jwksCache: { issuer: string; jwks: ReturnType<typeof createRemoteJWKSet> } | null = null;

function unauthorized(message: string): Response {
  return Response.json({ error: message }, { status: 401 });
}

/**
 * Verify the Cloudflare Access JWT. Returns the admin identity, or a 401
 * Response the route handler should return as-is:
 *
 *   const admin = await requireAdmin(request);
 *   if (admin instanceof Response) return admin;
 */
export async function requireAdmin(request: Request): Promise<{ email: string } | Response> {
  // `next dev` runs outside Access — allow a stub identity for local work.
  if (process.env.NODE_ENV === "development") {
    return { email: "dev@localhost" };
  }

  const env = await getEnv();
  const teamDomain = env.CF_ACCESS_TEAM_DOMAIN;
  const aud = env.CF_ACCESS_AUD;
  if (!teamDomain || !aud) {
    return unauthorized("Cloudflare Access is not configured");
  }

  const token = request.headers.get("cf-access-jwt-assertion");
  if (!token) {
    return unauthorized("Missing Cloudflare Access token");
  }

  const issuer = `https://${teamDomain}`;
  try {
    if (!jwksCache || jwksCache.issuer !== issuer) {
      jwksCache = {
        issuer,
        jwks: createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`)),
      };
    }
    const { payload } = await jwtVerify(token, jwksCache.jwks, {
      audience: aud,
      issuer,
    });
    const email = typeof payload.email === "string" ? payload.email : null;
    if (!email) return unauthorized("Access token has no email claim");
    return { email };
  } catch (err) {
    // Reset the JWKS cache — a poisoned cross-request cache would otherwise
    // fail every subsequent verification too.
    jwksCache = null;
    console.error("Access JWT verification failed:", err instanceof Error ? `${err.name}: ${err.message}` : String(err));
    return unauthorized("Invalid Cloudflare Access token");
  }
}
