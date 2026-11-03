import { createFileRoute } from "@tanstack/react-router";
import { BonusFinder } from "@/components/bonus-finder";
import { AppFrame } from "@/components/shell";

export const Route = createFileRoute("/bonuses")({ component: BonusesPage });

function BonusesPage() {
  return (
    <AppFrame>
      <BonusFinder />
    </AppFrame>
  );
}
