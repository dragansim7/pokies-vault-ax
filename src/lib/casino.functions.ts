import { createServerFn } from "@tanstack/react-start";
import type { CasinoTarget } from "@/lib/casino-target";
import type { CatalogueHit } from "@/lib/public-bonus";
import type { AccountRow } from "@/lib/parse-account";

export type StatusResult = {
  domain: string;
  status: "live" | "slow" | "dead" | "redirect" | "unknown";
  ms: number;
};

export const loadPublicCatalogueFn = createServerFn({ method: "POST" })
  .validator((data: { domains: string[] }) => data)
  .handler(async ({ data }): Promise<CatalogueHit[]> => {
    const { loadPublicCatalogue } = await import("@/lib/casino.impl.server");
    return loadPublicCatalogue(data.domains);
  });

export const fetchCasinoAccount = createServerFn({ method: "POST" })
  .validator((data: { domain: string; phone: string; password: string }) => data)
  .handler(async ({ data }): Promise<AccountRow> => {
    const { fetchCasinoAccount: run } = await import("@/lib/casino.impl.server");
    return run(data);
  });

export const fetchCasinoBatchFn = createServerFn({ method: "POST" })
  .validator((data: { domains: string[]; phone: string; password: string }) => data)
  .handler(async ({ data }): Promise<AccountRow[]> => {
    const { fetchCasinoBatch } = await import("@/lib/casino.impl.server");
    return fetchCasinoBatch(data);
  });

export const resolveCasinoTargetsFn = createServerFn({ method: "POST" })
  .validator((data: { domains: string[] }) => data)
  .handler(async ({ data }): Promise<CasinoTarget[]> => {
    const { resolveCasinoTargets } = await import("@/lib/casino.impl.server");
    return resolveCasinoTargets(data.domains);
  });

export const fetchAllStatusesFn = createServerFn({ method: "POST" })
  .validator((data: Record<string, never>) => data ?? {})
  .handler(async (): Promise<Record<string, StatusResult["status"]>> => {
    const { fetchAllStatuses } = await import("@/lib/casino.impl.server");
    return fetchAllStatuses();
  });

export const checkSiteStatus = createServerFn({ method: "POST" })
  .validator((data: { domain: string }) => data)
  .handler(async ({ data }): Promise<StatusResult> => {
    const { checkSiteStatus: run } = await import("@/lib/casino.impl.server");
    return run(data.domain);
  });
