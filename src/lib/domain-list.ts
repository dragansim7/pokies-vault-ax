import { CATALOG, type SiteGroup } from "@/data/sites";
import { isPublicDomain, normalizeDomain } from "@/lib/domain";
import type { ListedSite } from "@/lib/working-sites";

export const LIST_KEY = "pokies_vault_domains_v1";

const GROUPS = new Set<SiteGroup>(["new", "best", "unverified", "share", "latest", "custom"]);
const CATALOG_MAP = new Map(CATALOG.map((site) => [site.domain, site]));

export function siteRecord(domain: string, addedAt: string | null = null): ListedSite {
  return CATALOG_MAP.get(domain) ?? { domain, group: "custom", addedAt };
}

export function loadOwnedList(): ListedSite[] | null {
  try {
    const raw = localStorage.getItem(LIST_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { owned?: unknown; sites?: unknown };
    if (parsed.owned !== true || !Array.isArray(parsed.sites)) return null;
    const sites: ListedSite[] = [];
    const seen = new Set<string>();
    for (const item of parsed.sites) {
      if (!item || typeof item !== "object") continue;
      const row = item as { domain?: unknown; group?: unknown; addedAt?: unknown };
      const domain = normalizeDomain(String(row.domain ?? ""));
      if (!isPublicDomain(domain) || seen.has(domain)) continue;
      seen.add(domain);
      const addedAt = typeof row.addedAt === "string" ? row.addedAt : null;
      const group = GROUPS.has(row.group as SiteGroup) ? (row.group as SiteGroup) : null;
      sites.push(group ? { domain, group, addedAt } : siteRecord(domain, addedAt));
    }
    return sites;
  } catch {
    return null;
  }
}

export function saveOwnedList(sites: ListedSite[]): boolean {
  try {
    const payload = JSON.stringify({ owned: true, sites });
    localStorage.setItem(LIST_KEY, payload);
    return localStorage.getItem(LIST_KEY) === payload;
  } catch {
    return false;
  }
}

export function clearOwnedList() {
  try {
    localStorage.removeItem(LIST_KEY);
  } catch {
    /* ignore */
  }
}
