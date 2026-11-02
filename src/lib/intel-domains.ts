import { isPublicDomain, normalizeDomain } from "@/lib/domain";

export const INTEL_KEY = "pokies_vault_intel_v1";

export function domainsFromText(text: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const line of text.split(/\r?\n/)) {
    const cleaned = line.replace(/#.*/, "").trim();
    if (!cleaned) continue;
    for (const part of cleaned.split(/[\s,;]+/)) {
      const domain = normalizeDomain(part);
      if (!isPublicDomain(domain) || seen.has(domain)) continue;
      seen.add(domain);
      out.push(domain);
    }
  }
  return out;
}
