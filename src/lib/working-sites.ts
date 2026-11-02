import { CATALOG, type SiteGroup } from "@/data/sites";

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
  for (const site of CATALOG) {
    if (gone.has(site.domain)) continue;
    sites.push(site);
    seen.add(site.domain);
  }
  for (const site of custom) {
    if (!site?.domain || gone.has(site.domain) || seen.has(site.domain)) continue;
    sites.push({ domain: site.domain, group: "custom", addedAt: site.addedAt });
    seen.add(site.domain);
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
