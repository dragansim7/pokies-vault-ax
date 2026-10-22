import type { AccountOk, AccountRow, BonusView } from "@/lib/parse-account";
import type { BonusMode, SortMode } from "@/components/vault";
import { CATALOG } from "@/data/sites";
import type { SiteGroup } from "@/data/sites";

export const SORT_IDS = [
  "default",
  "az",
  "za",
  "balance",
  "turnover",
  "cashout",
  "errors",
  "popular",
  "norefer",
  "shareAmount",
  "shareMax",
  "shareTurn",
  "new",
] as const;

export function isSortMode(value: unknown): value is SortMode {
  return typeof value === "string" && (SORT_IDS as readonly string[]).includes(value);
}

const CATALOG_INDEX = new Map(CATALOG.map((site, index) => [site.domain, index]));
const CATALOG_META = new Map(CATALOG.map((site) => [site.domain, site]));

export function catalogMeta(domain: string): { domain: string; group: SiteGroup; addedAt: string | null } {
  return CATALOG_META.get(domain) ?? { domain, group: "latest", addedAt: "" };
}

export function chosenBonus(row: AccountOk, mode: BonusMode): BonusView | null {
  if (mode === "none" || mode === "share") return row.share;
  return row[mode];
}

function turnoverOf(bonus: BonusView | null): number | null {
  if (!bonus || !(bonus.amount > 0) || bonus.minWithdrawal == null || bonus.minWithdrawal < 0) return null;
  return bonus.minWithdrawal / bonus.amount;
}

function bestTurnover(row: AccountOk): number | null {
  const values: number[] = [];
  for (const bonus of [row.commission, row.share, row.referral, row.new, row.rebate]) {
    const value = turnoverOf(bonus);
    if (value != null) values.push(value);
  }
  for (const bonus of row.availableBonuses) {
    const value = turnoverOf(bonus);
    if (value != null) values.push(value);
  }
  return values.length ? Math.min(...values) : null;
}

function asc(a: number | null, b: number | null): number {
  return (a ?? Number.POSITIVE_INFINITY) - (b ?? Number.POSITIVE_INFINITY);
}

function desc(a: number | null, b: number | null): number {
  return (b ?? Number.NEGATIVE_INFINITY) - (a ?? Number.NEGATIVE_INFINITY);
}

export function compareSites(
  a: { domain: string; group: SiteGroup; addedAt: string | null },
  b: { domain: string; group: SiteGroup; addedAt: string | null },
  rowA: AccountRow | undefined,
  rowB: AccountRow | undefined,
  sort: SortMode,
  bonusMode: BonusMode,
): number {
  const tie = () => a.domain.localeCompare(b.domain);
  const okA = rowA?.ok ? rowA : null;
  const okB = rowB?.ok ? rowB : null;
  if (sort === "az") return tie();
  if (sort === "za") return b.domain.localeCompare(a.domain);
  if (sort === "new") return String(b.addedAt).localeCompare(String(a.addedAt)) || tie();
  if (sort === "balance") return desc(okA?.cash ?? null, okB?.cash ?? null) || tie();
  if (sort === "turnover") return asc(okA ? bestTurnover(okA) : null, okB ? bestTurnover(okB) : null) || tie();
  if (sort === "cashout") return asc(okA?.cashMinWithdrawal ?? null, okB?.cashMinWithdrawal ?? null) || tie();
  if (sort === "errors") {
    const rank = (row: AccountRow | undefined) => (!row ? 2 : row.ok ? 1 : 0);
    return rank(rowA) - rank(rowB) || tie();
  }
  if (sort === "popular") {
    const rank = (group: SiteGroup) => (group === "best" ? 0 : 1);
    return rank(a.group) - rank(b.group) || tie();
  }
  if (sort === "norefer") {
    const rank = (row: AccountOk | null) => (!row ? 1 : row.referral ? 2 : 0);
    return rank(okA) - rank(okB) || tie();
  }
  if (sort === "shareAmount" || sort === "shareMax" || sort === "shareTurn") {
    const bonusA = okA ? chosenBonus(okA, bonusMode) : null;
    const bonusB = okB ? chosenBonus(okB, bonusMode) : null;
    if (sort === "shareAmount") return desc(bonusA?.amount ?? null, bonusB?.amount ?? null) || tie();
    if (sort === "shareMax") return desc(bonusA?.maxWithdrawal ?? null, bonusB?.maxWithdrawal ?? null) || tie();
    return asc(turnoverOf(bonusA), turnoverOf(bonusB)) || tie();
  }
  const indexA = CATALOG_INDEX.get(a.domain) ?? Number.POSITIVE_INFINITY;
  const indexB = CATALOG_INDEX.get(b.domain) ?? Number.POSITIVE_INFINITY;
  return indexA - indexB || tie();
}
