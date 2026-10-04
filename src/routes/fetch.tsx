import { createFileRoute } from "@tanstack/react-router";
import { AppFrame } from "@/components/shell";
import { Fetcher } from "@/components/fetcher";

export const Route = createFileRoute("/fetch")({ component: FetchPage });

function FetchPage() {
  return (
    <AppFrame>
      <Fetcher />
    </AppFrame>
  );
}
