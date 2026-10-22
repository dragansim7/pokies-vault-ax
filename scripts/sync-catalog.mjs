import { readFile, writeFile } from "node:fs/promises";

const CATALOG_PATH = new URL("../src/data/sites.ts", import.meta.url);
const HOMEPAGE_URL = "https://bestpokieslist.online/api/homepage-domains.php?build=v6";
const STATUS_URL = "https://intel.bestpokieslist.online/public/statuses";

const PRESERVED_UNVERIFIED = [
  { domain: "me96.com", addedAt: "2026-09-24T09:45:24+10:00" },
  { domain: "truemateaus.com", addedAt: "2026-09-23T05:56:54+10:00" },
  { domain: "goalspin.vip", addedAt: "2026-09-20T03:27:13+10:00" },
  { domain: "babymolly88.com", addedAt: "2026-09-15T15:59:42+10:00" },
  { domain: "veeclub.net", addedAt: "2026-09-15T09:43:47+10:00" },
  { domain: "chuckmeth9.net", addedAt: "2026-09-12T02:50:26+10:00" },
  { domain: "ox38.net", addedAt: "2026-09-12T02:46:38+10:00" },
];

function mapGroup(name) {
  const value = String(name ?? "")
    .trim()
    .toLowerCase()
    .replace(/[•·|_-]+/g, " ")
    .replace(/\s+/g, " ");
  if (!value) return "";
  if (value.includes("unverified") || value.includes("untested")) return "unverified";
  if (value === "best" || value.startsWith("best ") || value.includes("best sites") || value.includes("best pokies")) {
    return "best";
  }
  if (value === "latest" || value.startsWith("latest ")) return "latest";
  if (value.includes("share")) return "share";
  if (value === "new" || value.startsWith("new ")) return "new";
  return "";
}

function normalizeDomain(value) {
  let domain = String(value ?? "").trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//, "");
  domain = domain.split("/")[0] ?? "";
  domain = domain.split("?")[0] ?? "";
  domain = domain.split(":")[0] ?? "";
  domain = domain.replace(/^www\./, "");
  if (
    !/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/.test(domain) ||
    domain.length > 253 ||
    /^\d+\.\d+\.\d+\.\d+$/.test(domain) ||
    domain === "localhost" ||
    domain.endsWith(".local") ||
    domain.endsWith(".internal") ||
    domain.endsWith(".localhost")
  ) {
    return "";
  }
  return domain;
}

function listFrom(body) {
  if (Array.isArray(body)) return body;
  if (body && typeof body === "object" && Array.isArray(body.domains)) return body.domains;
  if (body && typeof body === "object" && Array.isArray(body.statuses)) return body.statuses;
  throw new Error("unexpected payload shape");
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json();
}

function render(catalog) {
  const chunks = [];
  for (let i = 0; i < catalog.length; i += 700) chunks.push(catalog.slice(i, i + 700));
  const parts = chunks.map(
    (chunk, index) => `const CATALOG_${index}: CatalogSite[] = ${JSON.stringify(chunk, null, 2)}`,
  );
  const names = chunks.map((_, index) => `...CATALOG_${index}`).join(", ");
  return `export type SiteGroup = "new" | "best" | "unverified" | "share" | "latest" | "custom"

export type CatalogSite = {
  domain: string
  group: Exclude<SiteGroup, "custom">
  addedAt: string | null
}

${parts.join("\n\n")}

export const CATALOG: CatalogSite[] = [${names}]
`;
}

async function main() {
  let homepage;
  let statuses;
  try {
    [homepage, statuses] = await Promise.all([fetchJson(HOMEPAGE_URL), fetchJson(STATUS_URL)]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`sync failed (${message}). left the current catalog in place.`);
    return;
  }

  const homepageItems = listFrom(homepage);
  const rootKeys = Array.isArray(homepage) ? [] : Object.keys(homepage);
  const itemKeys = homepageItems[0] && typeof homepageItems[0] === "object" ? Object.keys(homepageItems[0]) : [];
  const groupValues = [...new Set(homepageItems.map((item) => item?.group))];
  console.log(`homepage top-level keys: ${JSON.stringify(rootKeys)}`);
  console.log(`homepage item keys: ${JSON.stringify(itemKeys)}`);
  console.log(`homepage group values: ${JSON.stringify(groupValues)}`);

  const catalog = [];
  const seen = new Set();
  const counts = { new: 0, best: 0, unverified: 0, share: 0, latest: 0 };
  const unmapped = new Set();
  for (const item of homepageItems) {
    if (!item || typeof item !== "object") continue;
    const domain = normalizeDomain(item.domain);
    let group = mapGroup(item.group);
    if (!domain || seen.has(domain)) continue;
    if (!group) {
      unmapped.add(String(item.group));
      group = "latest";
    }
    seen.add(domain);
    const addedAt = typeof item.addedAt === "string" && item.addedAt ? item.addedAt : null;
    catalog.push({ domain, group, addedAt });
    counts[group] += 1;
  }
  console.log(`unmapped group values: ${JSON.stringify([...unmapped])}`);
  console.log(
    `source groups: new ${counts.new}, best ${counts.best}, unverified ${counts.unverified}, share ${counts.share}, latest ${counts.latest}`,
  );

  let onlyStatus = 0;
  for (const item of listFrom(statuses)) {
    if (!item || typeof item !== "object") continue;
    const domain = normalizeDomain(item.domain);
    if (!domain || seen.has(domain)) continue;
    seen.add(domain);
    catalog.push({ domain, group: "latest", addedAt: null });
    counts.latest += 1;
    onlyStatus += 1;
  }

  const pinned = new Set(PRESERVED_UNVERIFIED.map((item) => item.domain));
  const rest = catalog.filter((site) => !pinned.has(site.domain));
  catalog.length = 0;
  for (const item of PRESERVED_UNVERIFIED) catalog.push({ domain: item.domain, group: "unverified", addedAt: item.addedAt });
  catalog.push(...rest);
  for (const key of Object.keys(counts)) counts[key] = 0;
  for (const site of catalog) counts[site.group] += 1;
  onlyStatus = catalog.filter((site) => site.group === "latest" && site.addedAt == null).length;

  const next = render(catalog);
  const current = await readFile(CATALOG_PATH, "utf8");
  if (next !== current) await writeFile(CATALOG_PATH, next);
  console.log(`total domains: ${catalog.length}`);
  for (const group of ["new", "best", "unverified", "share", "latest"]) {
    console.log(`${group}: ${counts[group]}`);
  }
  console.log(`only from status feed: ${onlyStatus}`);
}

main();
