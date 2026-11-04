import type { SiteGroup } from "@/data/sites";
import { BUILT_IN_DOMAINS } from "@/lib/built-in-domains";
import { isPublicDomain, normalizeDomain } from "@/lib/domain";
import type { ListedSite } from "@/lib/working-sites";

export const LIST_KEY = "pokies_vault_domains_v1";
export const CATALOG_STRIPPED_KEY = "pokies_vault_catalog_stripped_v1";

const GROUPS = new Set<SiteGroup>(["new", "best", "unverified", "share", "latest", "custom"]);

export function siteRecord(domain: string, addedAt: string | null = null): ListedSite {
  return { domain, group: "custom", addedAt };
}

export function withoutBuiltIn(sites: ListedSite[], keep: Set<string>): ListedSite[] {
  return sites.filter(
    (site) => keep.has(site.domain) || site.group === "custom" || !BUILT_IN_DOMAINS.has(site.domain),
  );
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
