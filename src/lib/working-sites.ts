import { isPublicDomain, normalizeDomain } from "@/lib/domain";
import type { SiteGroup } from "@/data/sites";

export type ListedSite = {
  domain: string;
  group: SiteGroup;
  addedAt: string | null;
};

export function workingSites(
  custom: { domain: string; addedAt: string }[],
  removed: string[],
): ListedSite[] {
  const gone = new Set(removed);
  const sites: ListedSite[] = [];
  const seen = new Set<string>();
  for (const site of custom) {
    const domain = normalizeDomain(site?.domain ?? "");
    if (!isPublicDomain(domain) || gone.has(domain) || seen.has(domain)) continue;
    sites.push({ domain, group: "custom", addedAt: site.addedAt ?? null });
    seen.add(domain);
  }
  return sites;
}

export function visibleSites(input: {
  listOwned: boolean;
  sites: ListedSite[];
  custom: { domain: string; addedAt: string }[];
  removed: string[];
}): ListedSite[] {
  if (input.listOwned) return input.sites;
  return workingSites(input.custom, input.removed);
}
