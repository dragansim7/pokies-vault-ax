import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/fetch-log")({
  server: {
    handlers: {
      GET: async () => {
        const { requireUserId } = await import("@/lib/auth/verify.server");
        const { listFetchRuns } = await import("@/lib/fetch-log.server");
        try {
          const userId = await requireUserId();
          const runs = await listFetchRuns(userId);
          return Response.json({ runs });
        } catch {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
      },
    },
  },
});