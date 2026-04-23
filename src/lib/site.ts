export const SITE_URL = "https://ilmlibrary.org";
export const SITE_HOSTS = ["ilmlibrary.org", "www.ilmlibrary.org"] as const;

// Build a canonical URL for the current pathname/search,
// so share/copy actions always point at the real site
// regardless of whether the user is on localhost, a preview, or prod.
export function canonicalUrl(pathAndSearch?: string): string {
  if (pathAndSearch && pathAndSearch.startsWith("/")) {
    return SITE_URL + pathAndSearch;
  }
  if (typeof window === "undefined") return SITE_URL;
  return SITE_URL + window.location.pathname + window.location.search;
}
