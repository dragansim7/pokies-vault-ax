import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import type { FetchRunReport } from "@/lib/fetch-log.server";

export const recordFetchRunFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FetchRunReport) => data)
  .handler(async ({ data, context }) => {
    const { saveFetchRun } = await import("@/lib/fetch-log.server");
    await saveFetchRun(context.userId, data);
    return { ok: true as const };
  });

export const listFetchRunsFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<FetchRunReport[]> => {
    const { listFetchRuns } = await import("@/lib/fetch-log.server");
    return listFetchRuns(context.userId);
  });