export type BonusView = {
  name: string;
  amount: number;
  amountDisplay: string;
  minWithdrawal: number | null;
  maxWithdrawal: number | null;
  rollover: number | null;
  percent: boolean;
};

export type WalletView = {
  id: string;
  name: string;
  balance: number;
};

export type AccountOk = {
  domain: string;
  ok: true;
  hasData: boolean;
  cash: number;
  cashWalletName: string;
  cashMinWithdrawal: number | null;
  cashMaxWithdrawal: number | null;
  wallets: WalletView[];
  commission: BonusView | null;
  share: BonusView | null;
  referral: BonusView | null;
  new: BonusView | null;
  rebate: BonusView | null;
  availableBonuses: BonusView[];
};

export type AccountCode =
  | "invalid_login"
  | "captcha"
  | "unsupported"
  | "timeout"
  | "unreachable"
  | "other";

export type AccountErr = {
  domain: string;
  ok: false;
  code: AccountCode;
  message: string;
};

export type AccountRow = AccountOk | AccountErr;

type BonusKey = "commission" | "share" | "referral" | "new" | "rebate";

function num(value: unknown): number | null {
  if (value == null || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function cleanName(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&/gi, "&")
    .replace(/&#39;|'/gi, "'")
    .replace(/"/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function moneyCompact(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  return Number.isInteger(rounded) ? `$${rounded}` : `$${rounded.toFixed(2)}`;
}

function categoryOf(name: string, custom: string): BonusKey | null {
  const c = custom.toLowerCase();
  const n = name.toLowerCase();
  if (c.includes("share")) return "share";
  if (c.includes("commission")) return "commission";
  if (c.includes("rebate")) return "rebate";
  if (c.includes("refer") || c.includes("downline") || c.includes("invite")) {
    return "referral";
  }
  if (c.includes("welcome") || c.includes("signup") || c.includes("newmember")) {
    return "new";
  }
  if (n.includes("commission")) return "commission";
  if (n.includes("share")) return "share";
  if (n.includes("rebate") || n.includes("cashback") || n.includes("cash back")) {
    return "rebate";
  }
  if (
    n.includes("refer") ||
    n.includes("invite") ||
    n.includes("downline") ||
    n.includes("mate")
  ) {
    return "referral";
  }
  if (
    n.includes("welcome") ||
    n.includes("sign up") ||
    n.includes("signup") ||
    n.includes("new member")
  ) {
    return "new";
  }
  return null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function parseClaimConfig(value: unknown): Record<string, unknown> {
  if (typeof value === "string") {
    try {
      return asRecord(JSON.parse(value)) ?? {};
    } catch {
      return {};
    }
  }
  return asRecord(value) ?? {};
}

export function parseSyncUser(domain: string, user: unknown): AccountOk {
  const row = asRecord(user) ?? {};
  const wallets: WalletView[] = [];
  const walletRaw = Array.isArray(row.wallet) ? row.wallet : [];
  for (const item of walletRaw) {
    const wallet = asRecord(item);
    if (!wallet) continue;
    wallets.push({
      id: String(wallet.id ?? ""),
      name: cleanName(String(wallet.name ?? "Balance")) || "Balance",
      balance: num(wallet.balance) ?? 0,
    });
  }

  let cash = num(row.cash) ?? 0;
  let cashWalletName = "Balance";
  for (const wallet of wallets) {
    if (wallet.balance > 0.001) {
      cash = wallet.balance;
      cashWalletName = wallet.name;
    }
  }

  const minRaw = num(row.minWithdraw);
  const maxRaw = num(row.maxWithdraw);
  const cashMinWithdrawal = minRaw != null && minRaw > 0 ? minRaw : null;
  const cashMaxWithdrawal = maxRaw != null && maxRaw > 0 ? maxRaw : null;

  const taken = asRecord(row.timebonus) ?? {};
  const buckets: Record<BonusKey, BonusView[]> = {
    commission: [],
    share: [],
    referral: [],
    new: [],
    rebate: [],
  };
  const availableBonuses: BonusView[] = [];

  const bonusRaw = Array.isArray(row.bonus) ? row.bonus : [];
  for (const item of bonusRaw) {
    const bonus = asRecord(item);
    if (!bonus) continue;
    const id = String(bonus.id ?? "");
    const maxRound = num(bonus.maxRound) ?? 0;
    const used = num(taken[id]) ?? 0;
    if (maxRound > 0 && used >= maxRound) continue;

    const cfg = parseClaimConfig(bonus.claimConfig);
    const creditLess = num(cfg.creditLessThan);
    if (creditLess != null && creditLess > 0 && cash >= creditLess) continue;

    const name = cleanName(String(bonus.name ?? "Bonus")) || "Bonus";
    const custom = String(cfg.customBonus ?? "");
    const fixed = num(bonus.bonusFixed) ?? 0;
    const percent = num(bonus.bonus) ?? 0;
    const random = asRecord(bonus.bonusRandom);
    const rmin = random ? num(random.min) : null;
    const rmax = random ? num(random.max) : null;
    const rolloverRaw = num(bonus.rollover);
    const rollover = rolloverRaw != null && rolloverRaw > 0 ? rolloverRaw : null;

    let amount = 0;
    let amountDisplay = "";
    let isPercent = false;
    if (fixed > 0) {
      amount = fixed;
      amountDisplay = moneyCompact(fixed);
    } else if (rmin != null && rmax != null && rmax > 0) {
      amount = rmax;
      amountDisplay = `${moneyCompact(rmin)}–${moneyCompact(rmax)}`;
    } else if (percent > 0) {
      amount = 0;
      amountDisplay = `${percent % 1 === 0 ? percent : percent.toFixed(0)}% match`;
      isPercent = true;
    } else {
      continue;
    }

    const view: BonusView = {
      name,
      amount,
      amountDisplay,
      minWithdrawal: num(cfg.minWithdraw) ?? num(cfg.minWithdrawal),
      maxWithdrawal: num(cfg.maxWithdraw) ?? num(cfg.maxWithdrawal),
      rollover,
      percent: isPercent,
    };
    availableBonuses.push(view);
    const key = categoryOf(name, custom);
    if (key) buckets[key].push(view);
  }

  availableBonuses.sort((a, b) => b.amount - a.amount || a.name.localeCompare(b.name));

  const pick = (list: BonusView[]): BonusView | null => {
    if (!list.length) return null;
    const dollars = list.filter((item) => !item.percent);
    const pool = dollars.length ? dollars : list;
    return [...pool].sort((a, b) => b.amount - a.amount)[0] ?? null;
  };

  const commission = pick(buckets.commission);
  const share = pick(buckets.share);
  const referral = pick(buckets.referral);
  const fresh = pick(buckets.new);
  const rebate = pick(buckets.rebate);

  const hasData = Boolean(
    cash > 0.001 ||
      commission ||
      share ||
      referral ||
      fresh ||
      rebate ||
      availableBonuses.length,
  );

  return {
    domain,
    ok: true,
    hasData,
    cash,
    cashWalletName,
    cashMinWithdrawal,
    cashMaxWithdrawal,
    wallets,
    commission,
    share,
    referral,
    new: fresh,
    rebate,
    availableBonuses,
  };
}

export function accountError(
  domain: string,
  code: AccountCode,
  message: string,
): AccountErr {
  return { domain, ok: false, code, message };
}
