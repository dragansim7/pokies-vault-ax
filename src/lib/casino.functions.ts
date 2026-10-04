import { createServerFn } from "@tanstack/react-start";
import type { AccountRow } from "@/lib/parse-account";

export type StatusResult = {
  domain: string;
  status: "live" | "slow" | "dead" | "redirect";
  ms: number;
};

export const fetchCasinoAccount = createServerFn({ method: "POST" })
  .validator((data: { domain: string; phone: string; password: string }) => data)
  .handler(async ({ data }): Promise<AccountRow> => {
    const { fetchCasinoAccount: run } = await import("@/lib/casino.impl.server");
    return run(data);
  });

export const checkSiteStatus = createServerFn({ method: "POST" })
  .validator((data: { domain: string }) => data)
  .handler(async ({ data }): Promise<StatusResult> => {
    const { checkSiteStatus: run } = await import("@/lib/casino.impl.server");
    return run(data.domain);
  });
