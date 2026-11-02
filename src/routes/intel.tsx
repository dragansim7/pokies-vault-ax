import { createFileRoute } from "@tanstack/react-router";
import { AppFrame } from "@/components/shell";
import { DomainIntel } from "@/components/domain-intel";

export const Route = createFileRoute("/intel")({ component: IntelPage });

function IntelPage() {
  return (
    <AppFrame>
      <DomainIntel />
    </AppFrame>
  );
}
