import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import type { CasinoTarget } from "@/lib/casino-target";
import type { CatalogueHit, CatalogueQuery } from "@/lib/public-bonus";
import type { AccountRow } from "@/lib/parse-account";

export type StatusResult = {
  domain: string;
  status: "live" | "slow" | "dead" | "redirect" | "unknown";
  ms: number;
};

export const lookupSiteIconFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { domain: string }) => data)
  .handler(async ({ data }): Promise<string> => {
    const { lookupSiteIcon } = await import("@/lib/casino.impl.server");
    return lookupSiteIcon(data.domain);
  });

export const loadPublicCatalogueFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { items: CatalogueQuery[] }) => data)
  .handler(async ({ data }): Promise<CatalogueHit[]> => {
    const { loadPublicCatalogue } = await import("@/lib/casino.impl.server");
    return loadPublicCatalogue(data.items);
  });

export const fetchCasinoAccount = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { domain: string; phone: string; password: string }) => data)
  .handler(async ({ data }): Promise<AccountRow> => {
    const { fetchCasinoAccount: run } = await import("@/lib/casino.impl.server");
    return run(data);
  });

export const fetchCasinoBatchFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { domains: string[]; phone: string; password: string }) => data)
  .handler(async ({ data }): Promise<AccountRow[]> => {
    const { fetchCasinoBatch } = await import("@/lib/casino.impl.server");
    return fetchCasinoBatch(data);
  });

export const resolveCasinoTargetsFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { domains: string[] }) => data)
  .handler(async ({ data }): Promise<CasinoTarget[]> => {
    const { resolveCasinoTargets } = await import("@/lib/casino.impl.server");
    return resolveCasinoTargets(data.domains);
  });

export const lookupEgressFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: Record<string, never>) => data ?? {})
  .handler(async () => {
    const { lookupEgress } = await import("@/lib/casino.impl.server");
    return lookupEgress();
  });

export const fetchAllStatusesFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: Record<string, never>) => data ?? {})
  .handler(async (): Promise<Record<string, StatusResult["status"]>> => {
    const { fetchAllStatuses } = await import("@/lib/casino.impl.server");
    return fetchAllStatuses();
  });

export const checkSiteStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { domain: string }) => data)
  .handler(async ({ data }): Promise<StatusResult> => {
    const { checkSiteStatus: run } = await import("@/lib/casino.impl.server");
    return run(data.domain);
  });
